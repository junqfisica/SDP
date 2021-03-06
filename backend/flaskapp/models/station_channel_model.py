from datetime import date, datetime, timedelta
from typing import List

from flaskapp import db, app_utils
from flaskapp.config_ssh import ConfigSSHWhiteDwarf
from flaskapp.http_util.exceptions import CreateEntityError
from flaskapp.models import BaseModel, TableNames, RelationShip, EquipmentModel
from flaskapp.utils import file_utils
from flaskapp.utils.date_utils import DateUtils
from flaskapp.utils.locks_util import LockById
from flaskapp.utils.progress_event import ProgressEvent


class StationModel(db.Model, BaseModel):

    # The name of the table at the data base.
    __tablename__ = TableNames.T_STATIONS

    # The table columns.
    id = db.Column(db.String(16), primary_key=True)
    network_id = db.Column(db.String(5), db.ForeignKey(TableNames.T_NETWORKS + ".id"), nullable=False)
    name = db.Column(db.String(5), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    elevation = db.Column(db.Float, nullable=False)
    depth = db.Column(db.Float, nullable=False)
    creation_date: date = db.Column(db.Date, nullable=False)
    removal_date: date = db.Column(db.Date, nullable=True)
    public_data = db.Column(db.Boolean, nullable=False)
    site = db.Column(db.String(100), nullable=True)
    geology = db.Column(db.String(50), nullable=True)
    province = db.Column(db.String(100), nullable=True)
    country = db.Column(db.String(100), nullable=True)
    channels = db.relationship(RelationShip.CHANNEL, backref="station",
                               cascade="save-update, merge, delete", lazy=True)
    locations = db.relationship(RelationShip.LOCATION, backref="station",
                                cascade="save-update, merge, delete", lazy=True)
    attached = db.relationship(RelationShip.ATTACHED, backref="station",
                               cascade="save-update, merge, delete", lazy=True)

    def __repr__(self):
        return "StationModel(id={},network_id={},name={}, latitude={}, longitude={})"\
            .format(self.id, self.network_id, self.name, self.latitude, self.longitude)

    def is_time_overlap(self, other):

        # ignore the same object
        if self.id == other.id:
            return False

        removal_date = self.removal_date
        if not removal_date:
            # add 10 years to current date. # Virtually it means that the removal date is open.
            removal_date = datetime.now().date() + timedelta(days=10*365)

        other_removal_date = other.removal_date
        if not other_removal_date:
            # add 10 years to current date. # Virtually it means that the removal date is open.
            other_removal_date = datetime.now().date() + timedelta(days=10 * 365)

        # Avoid cases where both dates are equal within the same day.
        is_equal = self.creation_date == other.creation_date and self.removal_date == other_removal_date
        if is_equal:
            return is_equal

        overlap = self.creation_date < other_removal_date and other.creation_date < removal_date
        return overlap

    def to_dict(self):
        """
        Convert Channel into a dictionary, this way we can convert it to a JSON response.

        :return: A clean dictionary form of this model.
        """
        # convert columns to dict
        dict_representation = super().to_dict()

        # add locations
        dict_representation["locations"] = [loc.to_dict() for loc in self.locations]

        # add channels
        dict_representation["channels"] = [ch.to_dict() for ch in self.channels]

        return dict_representation

    def creation_validation(self, ignore_name_loc_check=False):
        stations = StationModel.find_by(name=self.name, get_first=False)
        if stations:
            for station in stations:
                if self.is_time_overlap(station):
                    rd = station.removal_date.strftime("%d-%m-%Y") if station.removal_date else "-"
                    msg = "Time overlap with station {} created at {} and removed at {}". \
                        format(station.name, station.creation_date.strftime("%d-%m-%Y"), rd)
                    raise CreateEntityError(msg)

        if not ignore_name_loc_check:
            st_unique_loc = StationModel.find_by(latitude=self.latitude, longitude=self.longitude, get_first=False)
            if st_unique_loc:
                for station in st_unique_loc:
                    if self.name != station.name:
                        msg = "The location {}, {} is been used by the station {}".\
                            format(self.latitude, self.longitude, station.name)
                        raise CreateEntityError(msg)

    @classmethod
    def from_dict(cls, station_dict: dict):
        station: StationModel = super().from_dict(station_dict)

        # cast string dates to date format
        create_date_str: str = station_dict.get("creation_date")
        removal_date_str: str = station_dict.get("removal_date")
        station.creation_date = DateUtils.convert_string_to_date(create_date_str)
        if station.removal_date:
            station.removal_date = DateUtils.convert_string_to_date(removal_date_str)

        return station

    @classmethod
    def create_station(cls, station_dict: dict):
        st: StationModel = cls.from_dict(station_dict)
        st.id = app_utils.generate_id(16)

        # validate creation
        st.creation_validation()

        if st.save():
            # create default location
            LocationModel.create_location_at_station(st)
            return True

        return False

    @classmethod
    def update(cls, station_dict: dict):
        """
        Update the current station.

        Import: You must use save() to storage it in the database.

        :param station_dict: A dictionary representation of the station.

        :return: The updated station or None if user if not valid.
        """
        station: StationModel = cls.from_dict(station_dict)
        valid_station: StationModel = StationModel.find_by_id(station.id)
        if not valid_station:
            return None

        # validate creation to check if there is time overlap.
        station.creation_validation(ignore_name_loc_check=True)

        # Copy all attributes from station to valid_station.
        valid_station << station

        return valid_station


class LocationModel(db.Model, BaseModel):

    # The name of the table at the data base.
    __tablename__ = TableNames.T_LOCATIONS

    # The table columns.
    id = db.Column(db.String(16), primary_key=True)
    station_id = db.Column(db.String(16), db.ForeignKey(TableNames.T_STATIONS + ".id"), nullable=False)
    name = db.Column(db.String(5), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    elevation = db.Column(db.Float, nullable=False)
    depth = db.Column(db.Float, nullable=False)
    channels = db.relationship(RelationShip.CHANNEL, backref="location",
                               cascade="save-update, merge, delete", lazy=True)

    def __repr__(self):
        return "LocationModel(id={},station_id={},name={})".format(self.id, self.station_id, self.name)

    def creation_validation(self):
        locs = LocationModel.find_by(station_id=self.station_id, name=self.name, get_first=False)
        if locs:
            for loc in locs:
                # ignore same id.
                if self.id != loc.id:
                    raise CreateEntityError("The location {} already exists for this station. "
                                            "Please, give a different name.".format(self.name))

    @classmethod
    def create_location(cls, location_dict: dict):
        """
         Create a location from dict.

        :param location_dict: A dictionary with keys equal to LocationModel columns.

        :return: True if succeed, false otherwise.
        """
        location: LocationModel = cls.from_dict(location_dict)
        location.id = app_utils.generate_id(16)

        # validate creation.
        location.creation_validation()

        return location.save()

    @classmethod
    def create_location_at_station(cls, station: StationModel, name="00"):
        """
        Create a location for a given station. See also, create_location(location_dict).

        :param station: A station entity.

        :param name: The location name. It must be unique within station.

        :return: True if succeed, false otherwise.
        """

        location_dict = {"id": "", "station_id": station.id, "name": name,
                         "latitude": station.latitude, "longitude": station.longitude, "elevation": station.elevation,
                         "depth": station.depth}

        # create location and validate it.
        return cls.create_location(location_dict)

    def to_dict(self):
        """
        Convert Channel into a dictionary, this way we can convert it to a JSON response.

        :return: A clean dictionary form of this model.
        """
        # convert columns to dict
        dict_representation = super().to_dict()

        # add channels
        dict_representation["channels"] = [ch.to_dict() for ch in self.channels]

        return dict_representation


class ChannelModel(db.Model, BaseModel):

    # The name of the table at the data base.
    __tablename__ = TableNames.T_CHANNELS

    # The table columns.
    id = db.Column(db.String(16), primary_key=True)
    station_id = db.Column(db.String(16), db.ForeignKey(TableNames.T_STATIONS + ".id"), nullable=False)
    location_id = db.Column(db.String(16), db.ForeignKey(TableNames.T_LOCATIONS + ".id"), nullable=False)
    name = db.Column(db.String(5), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    elevation = db.Column(db.Float, nullable=False)
    depth = db.Column(db.Float, nullable=False)
    azimuth = db.Column(db.Float, nullable=False, default=0.0)
    dip = db.Column(db.Float, nullable=False, default=0.0)
    gain = db.Column(db.String(50), nullable=False)
    sample_rate = db.Column(db.Integer, nullable=False)
    dl_no = db.Column(db.String(16), nullable=False)
    sensor_number = db.Column(db.String(16), nullable=False)
    start_time: datetime = db.Column(db.DateTime(timezone=True), nullable=False)
    stop_time: datetime = db.Column(db.DateTime(timezone=True), nullable=True)
    equipments = db.relationship(RelationShip.CHANNEL_EQUIPMENTS, backref="channel",
                                 cascade="save-update, merge, delete", lazy=True)
    seismic_data = db.relationship(RelationShip.SEISMIC_DATA, backref="channel",
                                   cascade="save-update, merge, delete", lazy=True)

    def __repr__(self):
        return "ChannelModel(id={},station_id={},station_id={}, name={},gain={},dl_no={},dl_no={},sample_rate={}, " \
               "start_time={}, stop_time={})".format(self.id, self.station_id, self.location_id, self.name, self.gain,
                                                     self.sample_rate, self.dl_no, self.sensor_number,
                                                     self.start_time, self.stop_time)

    @property
    def start_time_utc(self):
        return DateUtils.convert_datetime_to_utc(self.start_time)

    @property
    def stop_time_utc(self):
        return DateUtils.convert_datetime_to_utc(self.stop_time)

    @property
    def location(self) -> LocationModel:
        return LocationModel.find_by_id(self.location_id)

    def to_dict(self):
        """
        Convert Channel into a dictionary, this way we can convert it to a JSON response.

        :return: A clean dictionary form of this model.
        """
        # convert columns to dict
        dict_representation = super().to_dict()

        # add equipments
        dict_representation["equipments"] = [eqs.get_equipment().to_dict() for eqs in self.equipments]

        # add info of how much data files are attach to it
        dict_representation["number_of_files"] = self.number_of_files()

        # add location code.
        dict_representation["location_code"] = self.location.name

        return dict_representation

    def is_within_deltatime(self, start_time: datetime, stop_time: datetime):
        if self.start_time <= start_time and self.stop_time >= stop_time:
            return True

        return False

    def is_time_overlap(self, other):

        # ignore the same object
        if self.id == other.id:
            return False

        if self.start_time == self.stop_time:
            raise CreateEntityError("Channel can't have the same start and stop time")

        overlap = self.start_time < other.stop_time and other.start_time < self.stop_time
        return overlap

    def get_station(self) -> StationModel:
        """
        Get the station in which this channel belongs.

        :return: The station from this channel.
        """
        return StationModel.find_by_id(self.station_id)

    def rename_data(self, pe: ProgressEvent = None):
        """
        Rename all seismic data belonging to this channel. The renam

        :param pe: (Optional) A progress bar event

        :return:
        """
        with LockById(self.id):
            data_list = self.seismic_data
            total = len(data_list)
            processed = 0.
            for sd in data_list:
                sd.rename_mseed()
                processed += 1
                if pe:
                    pe.set_progress(processed * 100. / total)

    @classmethod
    def from_dict(cls, channel_dict: dict):
        channel: ChannelModel = super().from_dict(channel_dict)

        # cast string dates to date format
        start_time_str: str = channel_dict.get("start_time")
        stop_time_str: str = channel_dict.get("stop_time")
        channel.start_time = DateUtils.convert_string_to_datetime(start_time_str)
        channel.stop_time = DateUtils.convert_string_to_datetime(stop_time_str)

        return channel

    def creation_validation(self):
        channels = self.find_by(location_id=self.location_id, name=self.name, get_first=False)
        if channels:
            for channel in channels:
                if self.is_time_overlap(channel):
                    rd = channel.stop_time_utc.strftime("%d-%m-%Y, %H:%M:%S")
                    st = channel.start_time_utc.strftime("%d-%m-%Y, %H:%M:%S")
                    msg = "Time overlap with channel {} started at {} and stopped at {}". \
                        format(channel.name, st, rd)
                    raise CreateEntityError(msg)

    def add_equipment(self, equipment_id: str):
        """
        Add equipment to this channel.

        Important: This will not be added to the database until channel is saved.

        :param equipment_id: The equipment id.
        """
        channel_eq = ChannelEquipmentsModel(channel_id=self.id, equipment_id=equipment_id)
        self.equipments.append(channel_eq)

    def _delete_equipments(self):
        """
        This will remove all equipments for this channel at the database.
        """
        for eq in self.equipments:
            eq.delete()

    def add_equipments(self, equipments: List[EquipmentModel]):
        """
        Add equipments to this channel.

        :param equipments: A list of equipments to be added.

        :return:
        """

        if equipments and len(equipments) == 2:
            for eq in equipments:
                self.add_equipment(equipment_id=eq.id)
        else:
            raise CreateEntityError("Channel must have 2 equipments. A datalogger and a sensor.")

    def has_data(self):
        data = self.seismic_data
        if not data or len(data) == 0:
            return False

        return True

    def number_of_files(self):
        data = self.seismic_data
        if not data:
            return 0

        return len(data)

    def make_tar_file(self):
        """
        Create a .tar file contain all mseed files that belong to this channel.

        :return: The .tar file path.
        """
        file_paths = []
        for sd in self.seismic_data:
            file_paths.append(sd.file_path)
        return file_utils.tar_files(file_paths)

    def bash_rsync_files(self, client_destine=None):
        """
        Create a .sh file to rsync all mseed files that belong to this channel.

        :param client_destine: The client destination to rsync the files.

        :return: The .sh file path.
        """
        files_path = [sd.file_path for sd in self.seismic_data]
        return file_utils.create_rsync_bash(ConfigSSHWhiteDwarf.USER,
                                            ConfigSSHWhiteDwarf.REMOTE_IP,
                                            ConfigSSHWhiteDwarf.PSW, files_path, client_destine)

    @classmethod
    def create_channel(cls, channel_dict: dict):
        channel: ChannelModel = cls.from_dict(channel_dict)
        channel.id = app_utils.generate_id(16)

        # validate creation
        channel.creation_validation()

        # Add equipments relational field.
        equipments = [EquipmentModel.from_dict(eq_dict) for eq_dict in channel_dict.get("equipments")]
        channel.add_equipments(equipments=equipments)

        return channel.save()

    @classmethod
    def update(cls, channel_dict: dict):
        """
        Update the current channel.

        Import: You must use save() to storage it in the database.

        :param channel_dict: A dictionary representation of the channel.

        :return: The updated channel or None if user if not valid.
        """
        channel: ChannelModel = cls.from_dict(channel_dict)
        valid_channel: ChannelModel = ChannelModel.find_by_id(channel.id)
        if not valid_channel:
            return None

        # validate creation to check if there is time overlap.
        channel.creation_validation()

        # Copy all attributes from channel to valid_channel.
        valid_channel << channel

        # update equipments.
        equipments = [EquipmentModel.from_dict(eq_dict) for eq_dict in channel_dict.get("equipments")]
        valid_channel._delete_equipments()
        valid_channel.add_equipments(equipments)

        return valid_channel


class ChannelEquipmentsModel(db.Model, BaseModel):

    # The name of the table at the data base.
    __tablename__ = TableNames.T_CHANNELS_EQUIPMENTS

    # The table columns.
    channel_id = db.Column(db.String(16), db.ForeignKey(TableNames.T_CHANNELS + ".id"), primary_key=True)
    equipment_id = db.Column(db.String(16), db.ForeignKey(TableNames.S_EQUIPMENT + ".id"), primary_key=True)

    def __repr__(self):
        return "ChannelEquipmentsModel(channel_id={},equipment_id={})"\
            .format(self.channel_id, self.equipment_id)

    def get_equipment(self):
        return EquipmentModel.find_by_id(self.equipment_id)
