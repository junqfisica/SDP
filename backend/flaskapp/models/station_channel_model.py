from datetime import date, datetime, timedelta
from typing import List

from flaskapp import db, app_utils
from flaskapp.http_util.exceptions import CreateEntityError
from flaskapp.models import BaseModel, TableNames, RelationShip, EquipmentModel
from flaskapp.utils.date_utils import DateUtils


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

        overlap = self.creation_date < other_removal_date and other.creation_date < removal_date
        return overlap

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

    def creation_validation(self):
        stations = self.find_by(name=self.name, get_first=False)
        if stations:
            for station in stations:
                if self.is_time_overlap(station):
                    rd = station.removal_date.strftime("%d-%m-%Y") if station.removal_date else "-"
                    msg = "Time overlap with station {} created at {} and removed at {}". \
                        format(station.name, station.creation_date.strftime("%d-%m-%Y"), rd)
                    raise CreateEntityError(msg)

        stations = self.find_by(latitude=self.latitude, longitude=self.longitude, get_first=False)
        if stations:
            for station in stations:
                if self.name != station.name:
                    msg = "The location {}, {} is used by the station {}".\
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

        return st.save()


class ChannelModel(db.Model, BaseModel):

    # The name of the table at the data base.
    __tablename__ = TableNames.T_CHANNELS

    # The table columns.
    id = db.Column(db.String(16), primary_key=True)
    station_id = db.Column(db.String(16), db.ForeignKey(TableNames.T_STATIONS + ".id"), nullable=False)
    name = db.Column(db.String(5), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    elevation = db.Column(db.Float, nullable=False)
    depth = db.Column(db.Float, nullable=False)
    gain = db.Column(db.String(50), nullable=False)
    sample_rate = db.Column(db.Integer, nullable=False)
    dl_no = db.Column(db.String(16), nullable=False)
    sensor_number = db.Column(db.String(16), nullable=False)
    start_time: datetime = db.Column(db.DateTime(timezone=True), nullable=False)
    stop_time: datetime = db.Column(db.DateTime(timezone=True), nullable=True)
    equipments = db.relationship(RelationShip.CHANNEL_EQUIPMENTS, backref="channel",
                                 cascade="save-update, merge, delete", lazy=True)

    def __repr__(self):
        return "ChannelModel(id={},station_id={},name={},gain={},dl_no={},dl_no={},sample_rate={}, " \
               "start_time={}, stop_time={})".format(self.id, self.station_id, self.name, self.gain,
                                                     self.sample_rate, self.dl_no, self.sensor_number,
                                                     self.start_time, self.stop_time)

    def to_dict(self):
        """
        Convert Channel into a dictionary, this way we can convert it to a JSON response.

        :return: A clean dictionary form of this model.
        """
        # convert columns to dict
        dict_representation = super().to_dict()

        # add channels
        dict_representation["equipments"] = [eqs.get_equipment().to_dict() for eqs in self.equipments]

        return dict_representation

    def is_time_overlap(self, other):

        # ignore the same object
        if self.id == other.id:
            return False

        overlap = self.start_time < other.stop_time and other.start_time < self.stop_time
        return overlap

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
        channels = self.find_by(name=self.name, get_first=False)
        if channels:
            for channel in channels:
                if self.is_time_overlap(channel):
                    rd = DateUtils.convert_datetime_to_utc(channel.stop_time).strftime("%d-%m-%Y, %H:%M:%S")
                    st = DateUtils.convert_datetime_to_utc(channel.start_time).strftime("%d-%m-%Y, %H:%M:%S")
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
