from datetime import date, datetime, timezone
from dateutil import parser as parse_date


class DateUtils:

    @staticmethod
    def convert_string_to_date(date_str: str) -> date:
        """
        Convert a string a date type.

        :param date_str: The date format string to be converted.

        :return: The date.
        """
        return_date = parse_date.parse(date_str).date()
        return return_date

    @staticmethod
    def convert_string_to_datetime(date_str: str) -> datetime:
        """
        Convert a string a datetime type.

        :param date_str: The date format string to be converted.

        :return: The datetime.
        """
        return_date = parse_date.parse(date_str)
        return return_date

    @staticmethod
    def convert_datetime_to_utc(date_time: datetime) -> datetime:
        """
        Convert datetime to utc datetime.

        :param date_time: The date converted.

        :return: The utc datetime.
        """
        return_date = date_time.astimezone(tz=timezone.utc)
        return return_date

    @staticmethod
    def convert_string_to_utc(date_str: str) -> datetime:
        """
        Convert string to utc datetime.

       :param date_str: The date format string to be converted.

        :return: The utc datetime.
        """
        dt = DateUtils.convert_string_to_datetime(date_str)
        return_utc = DateUtils.convert_datetime_to_utc(dt)
        return return_utc

    @staticmethod
    def create_stamp(date_time: datetime):
        """
        Creates a stamp from the datetime. The stamp is a string of YYYY + MM + DD + HH + mm + ss

        :param date_time: The datetime

        :return: A string like YYYY + MM + DD + HH + mm + ss
        """
        return date_time.strftime('%Y%m%d%H%M%S')
