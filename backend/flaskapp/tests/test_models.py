from unittest import TestCase

from flaskapp import create_app
from flaskapp.models import AppParamsModel, NetworkModel, EquipmentsModel, EquipmentTagsModel, StationModel, \
    ExperimentModel, ExperimentEquipmentsModel


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

    def test_equipments_model(self):
        equipment: EquipmentsModel = EquipmentsModel.find_by_id("GP01")
        self.assertIsNotNone(equipment)
        print(equipment.to_dict())

    def test_equipment_tags_model(self):
        eq_tags: EquipmentTagsModel = EquipmentTagsModel.find_by_id("Sensor_Number")
        self.assertIsNotNone(eq_tags)
        print(eq_tags.to_dict())

    def test_station_model(self):
        station: StationModel = StationModel.find_by(name="04A", creation_date="2016/159")
        self.assertIsNotNone(station)
        print(station.to_dict())
        print(station.experiments)

    def test_experiment_model(self):
        station: StationModel = StationModel.find_by(name="04A", creation_date="2016/159")
        self.assertIsNotNone(station)
        experiment: ExperimentModel = ExperimentModel.find_by(station_id=station.id, start_time="2016/159")
        self.assertIsNotNone(experiment)
        print(experiment.to_dict())
        print(experiment.equipments)

    def test_experiment_equipments_model(self):
        ex_eq = ExperimentEquipmentsModel.find_by(experiment_id="test1234", get_first=False)
        self.assertIsNotNone(ex_eq)
        print(ex_eq)
