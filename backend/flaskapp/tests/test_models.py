from unittest import TestCase

from flaskapp import create_app
from flaskapp.models import AppParamsModel, NetworkModel


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
        print(network)
        self.assertIsNotNone(network)
