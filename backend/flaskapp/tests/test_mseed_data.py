import os
import shutil
from pathlib import Path
from unittest import TestCase

import matplotlib.pyplot as plt
import numpy as np
from obspy import read, Stream
from obspy.imaging.scripts.scan import Scanner

from flaskapp.utils.mseed_utils import get_mseed_files


class TestMseed(TestCase):
    file_paths = []
    root_path = ""

    @classmethod
    def setUpClass(cls):
        TestMseed.root_path = "/media/junqueira/DATA/Test_SDP_DATA/ROBO/200Hz"
        TestMseed.file_paths = []
        # TestMseed.file_paths.append(os.path.join(TestMseed.root_path, "exA2M130830_1.pri0"))
        #TestMseed.file_paths.append(os.path.join(TestMseed.root_path, "exA2M130830000000.pri0"))
        # TestMseed.file_paths.append(os.path.join(TestMseed.root_path, "exA2M130830010000.pri0"))
        #TestMseed.file_paths.append(os.path.join(TestMseed.root_path, "exA2M130830130000.pri0"))
        TestMseed.file_paths.append(os.path.join("/media/junqueira/DATA/Test_SDP_DATA", "mseed_from_app"))

    def test_read_mseed(self):
        st: Stream = read(TestMseed.file_paths.pop(0))
        for path in TestMseed.file_paths:
            st += read(path)
        print(st)

    def test_obspy_scanner(self):
        scanner = Scanner("MSEED")
        scanner.parse(TestMseed.root_path)
        print(scanner.data.keys())
        print(scanner.data)
        scanner.analyze_parsed_data(True)
        scanner.plot()

    def test_plot(self):
        files = len(TestMseed.file_paths)
        st: Stream = read(TestMseed.file_paths.pop(0))
        for path in TestMseed.file_paths:
            st += read(path)
            # sort

        st.sort(['starttime'])
        # start time in plot equals 0
        dt = st[0].stats.starttime.timestamp

        # Go through the stream object, determine time range in julian seconds
        # and plot the data with a shared x axis
        ax = plt.subplot(4, 1, 1)  # dummy for tying axis
        for i in range(files):
            plt.subplot(4, 1, i + 1, sharex=ax)
            t = np.linspace(st[i].stats.starttime.timestamp - dt,
                            st[i].stats.endtime.timestamp - dt,
                            st[i].stats.npts)
            plt.plot(t, st[i].data)

        # Merge the data together and show plot in a similar way
        mergered_st = st.merge(method=0)
        print(mergered_st)
        plt.subplot(4, 1, 4, sharex=ax)
        t = np.linspace(st[0].stats.starttime.timestamp - dt,
                        st[0].stats.endtime.timestamp - dt,
                        st[0].stats.npts)
        plt.plot(t, st[0].data, 'r')
        plt.show()

    def test_read(self):
        st: Stream = read(TestMseed.root_path + "/*.pri0")
        st.sort(['starttime'])
        print(st)
        print(st.get_gaps(1))
        print(st[0].get_id())
        print(st[0].stats)

    def test_get_mseed(self):
        mseed_files = get_mseed_files(TestMseed.root_path)
        print(mseed_files)

        # root_path = "/media/junqueira/DATA/Test_SDP_DATA/"
        # paths = get_mseed_dirs(root_path)
        # print(paths)

    def test_test(self):
        path = "/media/junqueira/DATA/test_sdp_data_transfer/XX/A2M/400Hz/p0/exA2M131016154449.pri0"
        topath = "/media/junqueira/DATA/test_sdp_data_storage/2013/exA2M131016154449.pri0"
        rp = os.path.relpath(path, "/media/junqueira/DATA")
        print(rp)

