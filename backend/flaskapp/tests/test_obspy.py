from unittest import TestCase

from obspy.clients.nrl import NRL


class TestObspyUtils(TestCase):

    def test_data_logger(self):
        nrl = NRL()
        data_logger = nrl.dataloggers
        manufacture_names = [data_logger[key] for key in data_logger.keys()]
        datalogger_names = []
        for mfk in manufacture_names:
            datalogger_names.extend(list(mfk.keys()))

        print(datalogger_names)

    def test_data_sensor(self):
        nrl = NRL()
        sensor = nrl.sensors
        manufacture_names = [sensor[key] for key in sensor.keys()]
        sensor_names = []
        for mfk in manufacture_names:
            sensor_names.extend(list(mfk.keys()))

        print(sensor_names)
