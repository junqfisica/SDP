import os

from opencage.geocoder import OpenCageGeocode

from flaskapp import app_logger
from flaskapp.http_util.exceptions import AppException
from flaskapp.structures.structures import Location


class GeoCoder:

    def __init__(self):
        # use to get location from lat, log coordinates. (https://opencagedata.com/tutorials/geocode-in-python)
        try:
            root_path = os.path.dirname(os.path.abspath(__file__))
            with open(file=os.path.join(root_path, "GeoKey.txt"), mode="r") as f:
                key = f.read()
                self.__geocoder = OpenCageGeocode(key)
        except FileNotFoundError:
            app_logger.warning("File GeoKey.txt not found")
            raise AppException("File contain Key for geocoder not found.")

    def get_location(self, lat: float, long: float):
        results = self.__geocoder.reverse_geocode(lat, long)
        state = ""
        country = ""
        if len(results) > 0:
            component = results[0].get("components")
            if component:
                country = component.get("country")
                state = component.get("state")

        return Location(latitude=lat, longitude=long, province=state, country=country)
