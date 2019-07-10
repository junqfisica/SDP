import os
from unittest import TestCase

from flaskapp import create_app
from flaskapp.models import ChannelModel
from flaskapp.utils.mseed_utils import MseedMetadataHandler


class TestMetadataHandler(TestCase):

    @classmethod
    def setUpClass(cls):
        app = create_app()
        app.app_context().push()

    def test_metadata(self):

        ch = ChannelModel.find_by_id("XdrwcAlnazawNdnF")
        mdh = MseedMetadataHandler(ch)
        print(mdh.ch)
        print(mdh.st)
        print(mdh.nw)
        print(mdh.datalogger)
        print(mdh.sensor)

        mdh.save_metadata()
