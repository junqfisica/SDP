from unittest import TestCase

from flaskapp import create_app
from flaskapp.models import AppParamsModel, NetworkModel, EquipmentModel, EquipmentTypeModel, StationModel, \
    ChannelModel, ChannelEquipmentsModel


class TestModels(TestCase):

    @classmethod
    def setUpClass(cls):
        app = create_app()
        app.app_context().push()

    def test_app_params_model(self):
        root_dir: AppParamsModel = AppParamsModel.find_by_id("uploadFolder")
        print(root_dir.param_value)
        self.assertIsNotNone(root_dir.param_value)

    def test_network_model(self):
        network: NetworkModel = NetworkModel.find_by_id("ST")
        self.assertIsNotNone(network)
        print(network)
        print(network.stations)

    def test_equipment_model(self):
        equipment: EquipmentModel = EquipmentModel.find_by(name="DATACUBE")
        self.assertIsNotNone(equipment)
        print(equipment.to_dict())

    def test_equipment_type_model(self):
        eq_tags: EquipmentTypeModel = EquipmentTypeModel.find_by_id("Sensor")
        self.assertIsNotNone(eq_tags)
        print(eq_tags.to_dict())

    def test_station_model(self):
        station: StationModel = StationModel.find_by(name="04A", creation_date="2016/06/07")
        self.assertIsNotNone(station)
        print(station.to_dict())
        print(station.channels)

    def test_channel_model(self):
        station: StationModel = StationModel.find_by(name="04A", creation_date="2016/159")
        self.assertIsNotNone(station)
        setup: ChannelModel = ChannelModel.find_by(station_id=station.id, start_time="2016/159")
        self.assertIsNotNone(setup)
        print(setup.to_dict())
        print(setup.equipments)

    def test_channel_equipments_model(self):
        ex_eq = ChannelEquipmentsModel.find_by(channel_id="test1234", get_first=False)
        self.assertIsNotNone(ex_eq)
        print(ex_eq)

    def test_equipments_manufactory(self):
        dataloggers = EquipmentModel.get_all_dataloggers_from_nrl()
        sensors = EquipmentModel.get_all_sensors_from_nrl()
        self.assertIsNotNone(dataloggers)
        self.assertIsNotNone(sensors)
        print(dataloggers)
        print(sensors)
