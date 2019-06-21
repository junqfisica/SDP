import os

import obspy
# noinspection PyProtectedMember
from obspy.io.mseed.core import _is_mseed
from werkzeug.datastructures import FileStorage

from flaskapp.structures.structures import PreUploadFiles


def get_mseed_dirs(root_path: str):
    """
    Get a list of the :class:`PreUploadFiles` that contains mseed files.

    :param root_path: The root dir that will be scanned.

    :return: A list of PreUploadFiles
    """
    dirs_info = []
    for root, dirs, files in os.walk(root_path):
        mseed_files = [f for f in files
                       if os.path.isfile(os.path.join(root, f)) and _is_mseed(os.path.join(root, f))]
        num_mseed_files = len(mseed_files)
        if num_mseed_files > 0:
            relative_path = root.split(root_path)[-1]
            dir_info = PreUploadFiles(relative_path, num_mseed_files)
            dirs_info.append(dir_info)

    return dirs_info


def get_mseed_files(dir_path: str):
    """
    Return a list containing the names of the mseed files in the directory given by path.

    :param dir_path: The dir to be look at.

    :return: A list contains the the mseed file names within this dir.
    """
    mseed_files = [f for f in os.listdir(dir_path)
                   if os.path.isfile(os.path.join(dir_path, f)) and _is_mseed(os.path.join(dir_path, f))]
    return mseed_files


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

    def __init__(self, root_dir: str, file: FileStorage):
        self.root_dir = root_dir
        self.file = file
        if _is_mseed(file.stream):
            self.stream = obspy.read(file.stream)
        else:
            raise ValueError("File {} is not a valid Mseed".format(file.filename))
        self.dir_path = None
        self.file_path = None

        # Call method to construct path to save file.
        self.___construct_path_to_save()

    def ___construct_path_to_save(self):
        network = self.stream[0].stats.get(ObspyStatsKeys.NETWORK)
        station = self.stream[0].stats.get(ObspyStatsKeys.STATION)
        sample_rate = self.stream[0].stats.get(ObspyStatsKeys.SAMPLE_RATE)
        if network and station and sample_rate:
            sample_rate = str(int(sample_rate)) + "Hz"
            self.dir_path = os.path.join(self.root_dir, network, station, sample_rate)
            self.file_path = os.path.join(self.dir_path, self.file.filename)
        else:
            raise TypeError("Mseed file doesn't contain complete stats information.")

    def save(self):
        if self.file_path and self.dir_path:
            if not os.path.exists(self.dir_path):
                os.makedirs(self.dir_path)

            if os.path.exists(self.file_path):
                return False
            self.stream.write(self.file_path, format="MSEED")
            return True
        else:
            return None
