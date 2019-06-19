import os
from unittest import TestCase
from obspy import read


class TestMseed(TestCase):
    file_path = ""
    @classmethod
    def setUpClass(cls):
        root_path = "/media/junqueira/DATA/Test_SDP_DATA/ROBO/200Hz"
        # file_name = "exA2M130829093123.pri0"
        file_name = "exA2M130902100000.pri0"
        TestMseed.file_path = os.path.join(root_path, file_name)

    def test_read_mseed(self):
        st = read(TestMseed.file_path)
        print(st)
        # st[0].stats.station = "ROBO"
        print(st[0].stats)

