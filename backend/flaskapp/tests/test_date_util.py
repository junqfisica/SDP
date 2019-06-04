from unittest import TestCase

from flaskapp.utils.date_utils import DateUtils


class TestDateUtils(TestCase):

    def test_convert_string_to_datet(self):
        date = DateUtils.convert_string_to_date("Sat, 01 Jun 2019 03:05:00 GMT")
        self.assertTrue(date.day == 1)
        self.assertTrue(date.year == 2019)
        self.assertTrue(date.month == 6)

    def test_convert_string_to_datetime(self):
        date = DateUtils.convert_string_to_datetime("Sat, 01 Jun 2019 03:05:00 GMT")
        self.assertTrue(date.day == 1)
        self.assertTrue(date.year == 2019)
        self.assertTrue(date.month == 6)
        self.assertTrue(date.hour == 3)

    def test_convert_datetime_to_utc(self):
        date = DateUtils.convert_string_to_datetime("2019-06-01 05:05:00+02")
        date_utc = DateUtils.convert_datetime_to_utc(date)
        self.assertTrue(date_utc == date)
        self.assertTrue(date_utc.hour == 3)

    def test_convert_string_to_utc(self):
        date_utc = DateUtils.convert_string_to_utc("2019-06-01 05:05:00+02")
        self.assertTrue(date_utc.hour == 3)
