import os
import shutil
import tempfile
from datetime import datetime
from pathlib import Path

import obspy
from obspy import Stream
from obspy.clients.nrl import NRL
from obspy.core.inventory import Inventory, Network, Station, Channel, Site
# noinspection PyProtectedMember
from obspy.io.mseed.core import _is_mseed
from werkzeug.datastructures import FileStorage

from flaskapp.models import FileTransferredModel, TargetFolderModel, ChannelModel, SeismicDataModel, StationModel, \
    NetworkModel, EquipmentModel
from flaskapp.models.file_transferred_model import FileStatus
from flaskapp.structures.structures import PreUploadFiles, UploadMseedFiles, FileTransferResult
from flaskapp.utils.date_utils import DateUtils
from flaskapp.utils.locks_util import LockById
from flaskapp.utils.progress_event import ProgressEvent


def get_mseed_files(dir_path: str):
    """
    Return a list containing the names of the mseed files in the directory given by path.

    :param dir_path: The dir to be look at.

    :return: A list contains the the mseed file names within this dir.
    """
    try:
        mseed_files = [f for f in os.listdir(dir_path)
                       if os.path.isfile(os.path.join(dir_path, f)) and _is_mseed(os.path.join(dir_path, f))]

    except FileNotFoundError:
        return []

    return mseed_files


def save_data_plot(mseed_file_path: str, size=(1000, 400)):
    """
    Save the wave format plot as a PNG image. The image will be saved at
    the temporary directory as a temp file.

    :param mseed_file_path: The full path of the mseed file.

    :param size: (optional) A tuple for the image's size (x, y).

    :return: The full path of the generated image. None, if the file is not a valid mseed format.
    """
    if _is_mseed(mseed_file_path):
        st: Stream = obspy.read(mseed_file_path)
        file = tempfile.NamedTemporaryFile(suffix=".png", delete=False)
        st.plot(size=size, outfile=file.name)
        file.close()

        return file.name

    return None


def construct_relative_destination_dir(upload_file: UploadMseedFiles):
    """
    Construct a relative path to be used to save mseed files to the storage area.
    This path must be join with the active folder.
    :param upload_file: The upload file structure.
    :return: A relative path to save mseed files.
    """
    relative_path = str(DateUtils.convert_string_to_utc(upload_file.start_time).year)
    return relative_path


class ObspyStatsKeys:
    """
    Class to map keywords names for obspy stats
    """

    NETWORK = "network"
    STATION = "station"
    LOCATION = "location"
    CHANNEL = "channel"
    START_TIME = "starttime"
    END_TIME = "endtime"
    SAMPLE_RATE = "sampling_rate"
    DELTA = "delta"
    NPTS = "npts"
    CALIB = "calib"
    FORMAT = "_format"
    MSEED = "mseed"


class MseedFileManager:

    def __init__(self, root_dir: str, file: FileStorage = None, file_path: str = None):
        self.root_dir = root_dir
        self.file = file
        self.dir_path = None
        self.file_path = file_path

        if self.file_path is not None:
            if os.path.isfile(self.file_path):
                self.dir_path = Path(file_path).parents[0]
            else:
                raise ValueError("The path {} is not a valid file.".format(self.file_path))

        if self.file is not None:
            if _is_mseed(file.stream):
                self.stream = obspy.read(file.stream)
            else:
                raise ValueError("File {} is not a valid Mseed.".format(file.filename))
            # Call method to construct path to save file.
            self.___construct_path_to_save()

    def ___construct_path_to_save(self):

        if len(self.stream) > 1:
            raise TypeError("This mseed contains multiples traces. Before upload it split "
                            "the file into single traces.")

        network = self.stream[0].stats.get(ObspyStatsKeys.NETWORK)
        station = self.stream[0].stats.get(ObspyStatsKeys.STATION)
        sample_rate = self.stream[0].stats.get(ObspyStatsKeys.SAMPLE_RATE)
        ch = self.stream[0].stats.get(ObspyStatsKeys.CHANNEL)
        if network and station and sample_rate:
            sample_rate = str(int(sample_rate)) + "Hz"
            self.dir_path = os.path.join(self.root_dir, network, station, sample_rate, ch)
            self.file_path = os.path.join(self.dir_path, self.file.filename)
        else:
            raise TypeError("Mseed file doesn't contain complete stats information.")

    def __save_dir_info(self, add_value: int):
        MseedDirManager(self.dir_path).add_value_to_info_file(add_value)

    def save(self):
        if self.file_path and self.dir_path:
            if not os.path.exists(self.dir_path):
                os.makedirs(self.dir_path, mode=0o660)

            if os.path.exists(self.file_path):
                return False
            self.stream.write(self.file_path, format="MSEED")
            self.__save_dir_info(1)
            return True
        else:
            return None

    def delete(self):
        # Lock this process. Only a user per time can perform this. Avoid overhead at the system.
        with LockById(self.dir_path):
            if os.path.exists(self.file_path):
                try:
                    os.remove(self.file_path)
                    self.__save_dir_info(-1)
                    return True
                except OSError:
                    return False
            else:
                return False


class MseedDirManager:
    """
    Class that deal with upload and transference of mseed files.

    dir_path: The path location of the files at the upload area.
    """

    info_file_name = ".info"

    def __init__(self, dir_path: str):
        self.dir_path = dir_path

        if not os.path.isdir(self.dir_path):
            raise NotADirectoryError("Path {} is not a valid dir.".format(self.dir_path))

        self.info_file_path = os.path.join(self.dir_path, MseedDirManager.info_file_name)

    @property
    def active_folder(self):
        return TargetFolderModel.get_active_folder()

    @staticmethod
    def reconstruct_path(path: str):
        paths = path.split(".")
        return os.path.join(*paths)

    @staticmethod
    def scan_mseed_dirs(root_dir: str):
        """
        Returns a list of the :class:`PreUploadFiles` that contains mseed dir info.

        :param root_dir: The path of the directory that will be scanned.
            This scanner performs a top-down search.

        :return: A list of PreUploadFiles
        """
        dirs_info = []
        for root, dirs, files in os.walk(root_dir):
            for file in files:
                if os.path.isfile(os.path.join(root, file)) and _is_mseed(os.path.join(root, file)):
                    num_mseed_files = MseedDirManager(root).get_number_of_mseed_from_info()
                    relative_path = os.path.relpath(root, root_dir)
                    dir_info = PreUploadFiles(relative_path, num_mseed_files)
                    dirs_info.append(dir_info)
                    break

        return dirs_info

    def get_number_of_mseed_from_info(self):

        if os.path.exists(self.info_file_path):
            with open(self.info_file_path, mode="r") as f:
                return int(f.read())
        else:
            return 0

    def set_value_to_info_file(self, value: int):
        with open(self.info_file_path, mode="w+") as f:
            f.write(str(value))

    def add_value_to_info_file(self, add_value: int):
        file_path = os.path.join(self.dir_path, MseedDirManager.info_file_name)
        has_file = os.path.exists(file_path)
        file_mode = "r+" if has_file else "w"
        num_of_files = 0
        with open(file_path, mode=file_mode) as f:
            if has_file:
                num_of_files = int(f.read())
            num_of_files += add_value
            f.seek(0)
            f.write(str(num_of_files))
            f.truncate()

    def fix_info_file(self, expect_value: int):
        if expect_value != self.get_number_of_mseed_from_info():
            self.set_value_to_info_file(expect_value)

    def get_stream(self):
        st = None
        for file in os.listdir(self.dir_path):
            file_path = os.path.join(self.dir_path, file)
            if _is_mseed(file_path):
                if st is None:
                    st = obspy.read(file_path)
                else:
                    st += obspy.read(file_path)
        return st

    def delete(self):
        # Lock this process. Only a user per time can perform this. Avoid overhead at the system.
        with LockById(self.dir_path):
            if os.path.isdir(self.dir_path):
                shutil.rmtree(self.dir_path)
                return True
            else:
                return False

    def __get_files(self, progress_event: ProgressEvent = None):
        mseed_files = get_mseed_files(self.dir_path)
        upload_files = []
        count = 0
        total = len(mseed_files)
        for mseed_file in mseed_files:
            file_path = os.path.join(self.dir_path, mseed_file)
            st = obspy.read(file_path)
            ch = st[0].stats.get(ObspyStatsKeys.CHANNEL)
            sr = int(st[0].stats.get(ObspyStatsKeys.SAMPLE_RATE))
            start_time = str(st[0].stats.get(ObspyStatsKeys.START_TIME))
            end_time = str(st[0].stats.get(ObspyStatsKeys.END_TIME))
            upload_file = UploadMseedFiles(file_path, mseed_file, ch, sr, start_time, end_time)
            upload_files.append(upload_file)
            if progress_event:
                count += 1
                progress = count * 100. / total
                progress_event.set_progress(progress)

        # sort files using start time!!
        upload_files.sort(key=lambda file:  DateUtils.convert_string_to_datetime(file.start_time))
        self.fix_info_file(len(mseed_files))
        return upload_files

    def get_files(self, pe: ProgressEvent = None):
        # Lock this process. Only a user per time can perform this. Avoid overhead at the system.
        with LockById(self.dir_path):
            return self.__get_files(pe)

    def __make_destination_dir(self, upload_file: UploadMseedFiles):
        relative_path = construct_relative_destination_dir(upload_file)
        dest_dir = os.path.join(self.active_folder.path, relative_path)
        if not os.path.isdir(dest_dir):
            os.makedirs(dest_dir, mode=0o660)
        return dest_dir

    def __transfer_file_to_storage(self, upload_file: UploadMseedFiles, channel: ChannelModel):

        if not upload_file:
            raise TypeError("Upload file can't be None.")

        # secure that upload_file was not transferred already.
        ftm: FileTransferredModel = FileTransferredModel.find_by_id(upload_file.file_name)

        if not ftm:
            should_transfer = True
        elif ftm.status_id == FileStatus.DELETED:
            should_transfer = True
        else:
            should_transfer = False

        if should_transfer:
            try:
                relative_path = construct_relative_destination_dir(upload_file)
                start_time = DateUtils.convert_string_to_utc(upload_file.start_time)
                stop_time = DateUtils.convert_string_to_utc(upload_file.end_time)
                data = SeismicDataModel.create_data(id=None, filename=upload_file.file_name,
                                                    relative_path=relative_path,
                                                    target_folder_id=self.active_folder.id,
                                                    start_time=start_time, stop_time=stop_time,
                                                    channel_id=channel.id)
                is_valid, msg = data.is_valid_upload_file(upload_file)
                if not is_valid:
                    return FileTransferResult(upload_file.file_name, msg)

                dest_dir = self.__make_destination_dir(upload_file)
                dest_path = os.path.join(dest_dir, upload_file.file_name)
                shutil.move(upload_file.file_path, dest_path)
                self.add_value_to_info_file(-1)
                if ftm:
                    ftm.update(FileStatus.TRANSFERRED, datetime.utcnow())
                else:
                    ftm = FileTransferredModel(id=upload_file.file_name, status_id=FileStatus.TRANSFERRED)
                    ftm.save()
                data.save()
                return FileTransferResult(upload_file.file_name, "Ok")
            except OSError as error:
                return FileTransferResult(upload_file.file_name, "Fail", str(error))

        else:
            return FileTransferResult(upload_file.file_name,
                                      "File {} already exists in the database.".format(upload_file.file_name))

    def transfer_file_to_storage(self, file: UploadMseedFiles, channel_id: str):
        channel = ChannelModel.find_by_id(channel_id)
        if not channel:
            raise TypeError("An valid channel id must be provide to transfer files")
        with LockById(self.dir_path):
            result = self.__transfer_file_to_storage(file, channel)

        return result

    def transfer_all_to_storage(self, channel_id: str, pe: ProgressEvent = None):
        channel = ChannelModel.find_by_id(channel_id)
        if not channel:
            raise TypeError("An valid channel id must be provide to transfer files")
        results = []
        with LockById(self.dir_path):
            files = self.__get_files()
            count = 0
            total = len(files)
            for file in files:
                result = self.__transfer_file_to_storage(file, channel)
                results.append(result)
                count += 1
                if pe:
                    pe.set_progress(count * 100. / total)

        return results


class MseedMetadataHandler:

    def __init__(self, ch: ChannelModel):
        self.ch = ch
        self.st: StationModel = self.ch.station
        self.nw: NetworkModel = self.st.network

        for eqs in self.ch.equipments:
            eq: EquipmentModel = eqs.get_equipment()
            if eq.type == "Datalogger":
                self.datalogger = eq
            elif eq.type == "Sensor":
                self.sensor = eq

        self.inv = self.__create_inventory()

    def __create_inventory(self):
        # We'll first create all the various objects. These strongly follow the
        # hierarchy of StationXML files.
        inv = Inventory(
            # We'll add networks later.
            networks=[],
            # The source should be the id whoever create the file.
            source="University of Potsdam")

        net = Network(
            # This is the network code according to the SEED standard.
            code=self.nw.id,
            # A list of stations. We'll add one later.
            stations=[],
            description=self.nw.description)

        site = self.st.site if self.st.site else "Unknown"
        sta = Station(
            # This is the station code according to the SEED standard.
            code=self.st.name,
            latitude=self.st.latitude,
            longitude=self.st.longitude,
            elevation=self.st.elevation,
            creation_date=obspy.UTCDateTime(self.st.creation_date),
            end_date=obspy.UTCDateTime(self.st.removal_date) if self.st.removal_date else None,
            geology=self.st.geology,
            site=Site(name=site, country=self.st.country, region=self.st.province))

        cha = Channel(
            # This is the channel code according to the SEED standard.
            code=self.ch.name,
            # This is the location code according to the SEED standard.
            location_code="",
            # Note that these coordinates can differ from the station coordinates.
            latitude=self.ch.latitude,
            longitude=self.ch.longitude,
            elevation=self.ch.elevation,
            start_date=obspy.UTCDateTime(self.ch.start_time),
            end_date=obspy.UTCDateTime(self.ch.stop_time),
            depth=self.ch.depth,
            data_logger=obspy.core.inventory.Equipment(type=self.datalogger.type,
                                                       manufacturer=self.datalogger.manufactory,
                                                       model=self.datalogger.name,
                                                       serial_number=self.ch.dl_no,
                                                       description=self.datalogger.description),
            sensor=obspy.core.inventory.Equipment(type=self.sensor.type,
                                                  manufacturer=self.sensor.manufactory,
                                                  model=self.sensor.name,
                                                  serial_number=self.ch.sensor_number,
                                                  description=self.sensor.description),
            azimuth=self.ch.azimuth,
            dip=self.ch.dip,
            sample_rate=self.ch.sample_rate)

        response = self.get_response_from_nrl()

        # Now tie it all together.
        cha.response = response
        sta.channels.append(cha)
        net.stations.append(sta)
        inv.networks.append(net)

        return inv

    def get_response_from_nrl(self):
        """
        Uses Obspy NRL library to get the sensor extra information.

        :return: A list of extra information.
        """
        nrl = NRL()
        try:
            if self.sensor.description:
                sensor_keys = [self.sensor.manufactory, self.sensor.name, self.sensor.description]
            else:
                sensor_keys = [self.sensor.manufactory, self.sensor.name]
            datalogger_keys = [self.datalogger.manufactory, self.datalogger.name, self.ch.gain,
                               str(self.ch.sample_rate)]
            response = nrl.get_response(sensor_keys=sensor_keys, datalogger_keys=datalogger_keys)
            return response
        except KeyError:
            return None

    def save_metadata(self):
        """
        Save the metadata associate with the given channel in a xml file. The file will be saved
        as a temporary file.

        :return: The file location of the temporary xml file.
        """
        file = tempfile.NamedTemporaryFile(suffix=".xml", delete=False)
        self.inv.write(file.name, format="STATIONXML", validate=True)
        return file.name
