from obspy.clients.nrl import NRL

from flaskapp import db, app_utils
from flaskapp.http_util.exceptions import InvalidInstrumentType, AppException
from flaskapp.models import BaseModel, TableNames, RelationShip


class EquipmentModel(db.Model, BaseModel):

    # The name of the table at the data base.
    __tablename__ = TableNames.S_EQUIPMENT

    # The table columns.
    id = db.Column(db.String(16), primary_key=True)
    type = db.Column(db.String(50), db.ForeignKey(TableNames.S_EQUIPMENT_TYPE + ".type_id"), nullable=False)
    manufactory = db.Column(db.String(50), nullable=False)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.String(200), nullable=True)

    def __repr__(self):
        return "EquipmentsModel(id={},type={})".format(self.id, self.type)

    @property
    def tag_description(self):
        """
        Gets the description for this equipment type.

        :return: The description of the equipment type.
        """
        # info comes from backref="info"
        return self.info.description

    @classmethod
    def create_equipments(cls, equipment_dict: dict):
        equipment: EquipmentModel = cls.from_dict(equipment_dict)
        equipment.id = app_utils.generate_id(16)
        if cls.find_by(name=equipment.name):
            raise AppException("The instrument {} already exists in the database.".format(equipment.name))
        return equipment.save()

    # ==== NRL methods =======
    @staticmethod
    def __get_instruments_from_nrl(manufactory: str, is_sensor: bool):
        """
        Uses Obspy NRL library to get instruments from the given manufactory.

        :param is_sensor: If true get sensors, otherwise get dataloggers.

        :param manufactory: The manufactory of sensors/datalogger.

        :return: A list of sensors/dataloggers names.
        """
        nrl = NRL()
        try:
            if is_sensor:
                instrument = nrl.sensors[manufactory]
            else:
                instrument = nrl.dataloggers[manufactory]
            return list(instrument)
        except KeyError:
            return []

    @staticmethod
    def get_all_manufactures_nrl(instrument_type: str):
        """
        Uses Obspy NRL library to get all manufactures of sensors/datalogger.

        :param instrument_type: The instrument type, ie: Datalogger or Sensor.

        :return: A list of manufactures.
        """
        nrl = NRL()
        if instrument_type == "Datalogger":
            manufacture_names = list(nrl.dataloggers)
        elif instrument_type == "Sensor":
            manufacture_names = list(nrl.sensors)
        else:
            raise InvalidInstrumentType("The instrument type {} is not valid.".format(instrument_type))

        return manufacture_names

    @staticmethod
    def get_instruments_nrl(instrument_type: str, manufactory: str):
        """
        Uses Obspy NRL library to get all instruments of given manufactory.

        :param instrument_type: The instrument type, ie: Datalogger or Sensor.

        :param manufactory: The manufactory of the sensor/datalogger.

        :return: A list of manufactures.
        """
        if instrument_type == "Datalogger":
            instruments = EquipmentModel.__get_instruments_from_nrl(manufactory, False)
        elif instrument_type == "Sensor":
            instruments = EquipmentModel.__get_instruments_from_nrl(manufactory, True)
        else:
            raise InvalidInstrumentType("The instrument type {} is not valid.".format(instrument_type))

        return instruments

    @staticmethod
    def get_all_dataloggers_from_nrl():
        """
        Uses Obspy NRL library to get all data loggers names available.

        :return: A list of data loggers names.
        """
        nrl = NRL()
        manufacture_names = list(nrl.dataloggers)
        datalogger_names = []
        for mfn in manufacture_names:
            datalogger_names.extend(EquipmentModel.__get_instruments_from_nrl(mfn, False))

        return datalogger_names

    @staticmethod
    def get_all_sensors_from_nrl():
        """
        Uses Obspy NRL library to get all sensor's names available.

        :return: A list of sensor names.
        """
        nrl = NRL()
        manufacture_names = list(nrl.sensors)
        sensor_names = []
        for mfn in manufacture_names:
            sensor_names.extend(EquipmentModel.__get_instruments_from_nrl(mfn, True))

        return sensor_names


class EquipmentTypeModel(db.Model, BaseModel):

    # The name of the table at the data base.
    __tablename__ = TableNames.S_EQUIPMENT_TYPE

    # The table columns.
    type_id = db.Column(db.String(50), primary_key=True)
    description = db.Column(db.String(500), nullable=True)
    equipments = db.relationship(RelationShip.EQUIPMENT, backref="info",
                                 cascade="save-update, merge, delete", lazy=True)

    def __repr__(self):
        return "EquipmentTagsModel(type_id={})".format(self.type_id)

    def to_dict(self):
        """
        Convert EquipmentTagsModel into a dictionary, this way we can convert it to a JSON response.

        :return: A clean dictionary form of this model.
        """
        # convert columns to dict
        dict_representation = super().to_dict()

        # add additional values for the dictionary.
        dict_representation["equipments"] = [eq.to_dict() for eq in self.equipments]

        return dict_representation

