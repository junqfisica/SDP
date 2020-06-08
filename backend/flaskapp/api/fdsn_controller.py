from werkzeug.datastructures import FileStorage

from flaskapp import app_logger
from flaskapp.api import fdsn
from flaskapp.extensions.geocoder import GeoCoder
from flaskapp.http_util import response
from flaskapp.http_util.decorators import secure, post, query_param, query, post_file
from flaskapp.http_util.exceptions import EntityNotFound, AppException
from flaskapp.models import Right, NetworkModel, EquipmentTypeModel, EquipmentModel, StationModel, ChannelModel, \
    LocationModel, StationAttachedFileModel
from flaskapp.structures.structures import Search, SearchResult
from flaskapp.utils.date_utils import DateUtils
from flaskapp.utils.mseed_utils import MseedMetadataHandler


@fdsn.route("/createNetwork", methods=["POST"])
@secure(Right.CREATE_FDSN)
@post()
def create_network(network_dict: dict):

    network: NetworkModel = NetworkModel.from_dict(network_dict)
    network.id = network.id.upper().strip()
    return response.bool_to_response(network.save())


@fdsn.route("/createEquipment", methods=["POST"])
@secure(Right.CREATE_FDSN)
@post()
def create_equipment(equipment_dict: dict):
    was_created = EquipmentModel.create_equipments(equipment_dict)
    return response.bool_to_response(was_created)


@fdsn.route("/createStation", methods=["POST"])
@secure(Right.CREATE_FDSN)
@post()
def create_station(station_dict: dict):
    was_created = StationModel.create_station(station_dict)
    return response.bool_to_response(was_created)


@fdsn.route("/createLocation", methods=["POST"])
@secure(Right.CREATE_FDSN)
@post()
def create_location(location_dict: dict):
    was_created = LocationModel.create_location(location_dict)
    return response.bool_to_response(was_created)


@fdsn.route("/createChannel", methods=["POST"])
@secure(Right.CREATE_FDSN)
@post()
def create_channel(channel_dict: dict):
    was_created = ChannelModel.create_channel(channel_dict)
    return response.bool_to_response(was_created)


@fdsn.route("/networkIsTaken/<string:id>", methods=["GET"])
def is_network_taken(id: str):
    network_exist = NetworkModel.find_by_id(id)
    if network_exist:
        return response.bool_to_response(True)

    return response.bool_to_response(False)


@fdsn.route("/getEquipmentsTypes", methods=["GET"])
def get_equipments_types():
    eq_tags = EquipmentTypeModel.get_all(order_by=EquipmentTypeModel.type_id)
    return response.model_to_response(eq_tags)


@fdsn.route("/getNetworks", methods=["GET"])
def get_networks():
    networks = NetworkModel.get_all(order_by=NetworkModel.id)
    return response.model_to_response(networks)


@fdsn.route("/getLocation", methods=["GET"])
@secure(Right.EDIT_FDSN)
@query_param("lat", "long")
def get_location(lat, long):
    location = GeoCoder().get_location(lat, long)
    return response.model_to_response(location)


@fdsn.route("/getNRLManufacturers", methods=["GET"])
@secure(Right.EDIT_FDSN)
@query_param("instrument_type")
def get_nrl_manufacturers(instrument_type: str):
    manufactures = EquipmentModel.get_all_manufactures_nrl(instrument_type)
    return response.string_to_response(manufactures)


@fdsn.route("/getNRLInstrument", methods=["GET"])
@secure(Right.EDIT_FDSN)
@query_param("instrument_type", "manufactory")
def get_nrl_instrument(instrument_type: str, manufactory: str):
    instruments = EquipmentModel.get_instruments_nrl(instrument_type, manufactory)
    return response.string_to_response(instruments)


@fdsn.route("/getDataloggers", methods=["GET"])
@secure(Right.EDIT_FDSN)
def get_data_loggers():
    dataloggers = EquipmentModel.find_by(type="Datalogger", order_by=EquipmentModel.manufactory, get_first=False)
    return response.model_to_response(dataloggers)


@fdsn.route("/getSensors", methods=["GET"])
@secure(Right.EDIT_FDSN)
def get_data_sensors():
    sensors = EquipmentModel.find_by(type="Sensor", order_by=EquipmentModel.name, get_first=False)
    return response.model_to_response(sensors)


@fdsn.route("/getSensorExtraInfo", methods=["GET"])
@secure(Right.EDIT_FDSN)
@query_param("manufactory", "instrument")
def get_sensor_extra_info(manufactory: str, instrument: str):
    sr = EquipmentModel.get_sensor_extra_information(manufactory, instrument)
    return response.string_to_response(sr)


@fdsn.route("/getGains", methods=["GET"])
@secure(Right.EDIT_FDSN)
@query_param("manufactory", "instrument")
def get_gains(manufactory: str, instrument: str):
    gains = EquipmentModel.get_gain_from_nrl(manufactory, instrument)
    return response.string_to_response(gains)


@fdsn.route("/getSampleRates", methods=["GET"])
@secure(Right.EDIT_FDSN)
@query_param("manufactory", "instrument", "gain")
def get_sample_rates(manufactory: str, instrument: str, gain: str):
    sr = EquipmentModel.get_sample_rate_from_nrl(manufactory, instrument, gain)
    return response.string_to_response(sr)


@fdsn.route("/getStation", methods=["GET"])
@secure(Right.EDIT_FDSN)
@query_param("station_id")
def get_station(station_id: str):
    station = StationModel.find_by_id(station_id)
    if station:
        return response.model_to_response(station)

    return response.empty_response()


@fdsn.route("/getLocationModel", methods=["GET"])
@secure(Right.EDIT_FDSN)
@query_param("location_id")
def get_location_model(location_id: str):
    location = LocationModel.find_by_id(location_id)
    if location:
        return response.model_to_response(location)

    return response.empty_response()


@fdsn.route("/getChannel", methods=["GET"])
@secure(Right.EDIT_FDSN)
@query_param("channel_id")
def get_channel(channel_id: str):
    channel = ChannelModel.find_by_id(channel_id)
    if channel:
        return response.model_to_response(channel)

    return response.empty_response()


@fdsn.route("/searchStations", methods=["GET"])
@secure(Right.EDIT_FDSN)
@query(Search)
def search_stations(station_search: Search):
    search_result: SearchResult = StationModel.search(station_search)
    return response.model_to_response(search_result)


@fdsn.route("/searchLocations", methods=["GET"])
@secure(Right.EDIT_FDSN)
@query(Search)
def search_locations(location_search: Search):
    print(location_search)
    search_result: SearchResult = LocationModel.search(location_search)
    return response.model_to_response(search_result)


@fdsn.route("/searchChannels", methods=["GET"])
@secure(Right.EDIT_FDSN)
@query(Search)
def search_channels(station_search: Search):
    search_result: SearchResult = ChannelModel.search(station_search)
    return response.model_to_response(search_result)


@fdsn.route("/updateStation", methods=["POST"])
@secure(Right.EDIT_FDSN)
@post()
def update_station(station: dict):

    updated_station = StationModel.update(station)

    if not updated_station:
        raise EntityNotFound("This station doesn't exist.")

    return response.bool_to_response(updated_station.save())


@fdsn.route("/updateLocation", methods=["POST"])
@secure(Right.EDIT_FDSN)
@post()
def update_location(location: dict):

    updated_location = LocationModel.update(location)

    if not updated_location:
        raise EntityNotFound("This location doesn't exist.")

    return response.bool_to_response(updated_location.save())


@fdsn.route("/updateChannel", methods=["POST"])
@secure(Right.EDIT_FDSN)
@post()
def update_channel(channel: dict):

    updated_channel = ChannelModel.update(channel)

    if not updated_channel:
        raise EntityNotFound("This channel doesn't exist.")

    return response.bool_to_response(updated_channel.save())


@fdsn.route("/deleteStation/<string:station_id>", methods=["DELETE"])
@secure(Right.DELETE_FDSN)
def delete_station(station_id):
    station: StationModel = StationModel.find_by_id(station_id)
    if not station:
        raise EntityNotFound("The station id {} doesn't exist".format(station_id))

    deleted = station.delete()
    if deleted:
        app_logger.info("Station {} - {} has been deleted".format(station.name, station.creation_date))
    else:
        app_logger.warning("Station {} - {} could't be deleted.".format(station.name, station.creation_date))

    return response.bool_to_response(deleted)


@fdsn.route("/deleteLocation/<string:loc_id>", methods=["DELETE"])
@secure(Right.DELETE_FDSN)
def delete_location(loc_id):
    loc: LocationModel = LocationModel.find_by_id(loc_id)
    if not loc:
        raise EntityNotFound("The location id {} doesn't exist".format(loc_id))

    deleted = loc.delete()
    if deleted:
        app_logger.info("Location {} has been deleted at station {}.".format(loc.name, loc.station_id))
    else:
        app_logger.warning("Location {} could't be deleted at station {}.".format(loc.name, loc.station_id))

    return response.bool_to_response(deleted)


@fdsn.route("/deleteChannel/<string:channel_id>", methods=["DELETE"])
@secure(Right.DELETE_FDSN)
def delete_channel(channel_id):
    channel: ChannelModel = ChannelModel.find_by_id(channel_id)
    if not channel:
        raise EntityNotFound("The channel id {} doesn't exist".format(channel_id))

    deleted = channel.delete()
    if deleted:
        app_logger.info("Channel {}-{}-{} has been deleted".
                        format(channel.get_station().name, channel.name,
                               DateUtils.convert_datetime_to_utc(channel.start_time)))
    else:
        app_logger.warning("Channel {}-{}-{} could't be deleted.".
                           format(channel.get_station().name, channel.name,
                                  DateUtils.convert_datetime_to_utc(channel.start_time)))

    return response.bool_to_response(deleted)


@fdsn.route("/getMetadata/<string:channel_id>", methods=["GET"])
@secure(Right.EDIT_FDSN)
def get_metadata(channel_id):
    channel: ChannelModel = ChannelModel.find_by_id(channel_id)
    if not channel:
        raise EntityNotFound("The channel id {} doesn't exist".format(channel_id))

    mdh = MseedMetadataHandler(channel)
    file_path = mdh.save_metadata()

    return response.file_to_response(file_path, delete_after=True)


@fdsn.route("/attacheFile/<string:station_id>", methods=["POST"])
@secure(Right.EDIT_FDSN)
@post_file()
def attach_file(file: FileStorage, station_id):
    print(file)
    if file.content_type != 'application/pdf':
        raise AppException("File is not a valid pdf.")
    station_attached = StationAttachedFileModel.find_by(station_id=station_id, filename=file.filename,
                                                        get_first=True)
    if not station_attached:
        station_attached = StationAttachedFileModel.create(file.filename, station_id)

    if station_attached.save():
        try:
            station_attached.write_file(file)
        except IOError as e:
            app_logger.error(str(e))

    file.close()
    return response.empty_response()


@fdsn.route("/getAttached/<string:attached_id>", methods=["GET"])
@secure(Right.EDIT_FDSN)
def get_attached_file(attached_id):
    attached: StationAttachedFileModel = StationAttachedFileModel.find_by_id(attached_id)
    if not attached:
        raise EntityNotFound("The attached file id {} doesn't exist".format(attached_id))

    return response.file_to_response(attached.file_path, delete_after=False)


@fdsn.route("/getAttachedToStation/<string:station_id>", methods=["GET"])
@secure(Right.EDIT_FDSN)
def get_attached_to_station(station_id: str):
    attached_list = StationAttachedFileModel.find_by(station_id=station_id, get_first=False)
    if attached_list:
        return response.model_to_response(attached_list)
    return response.empty_response()


@fdsn.route("/deleteAttachedFile/<string:attached_id>", methods=["DELETE"])
@secure(Right.DELETE_FDSN)
def delete_attached_file(attached_id):
    attached: StationAttachedFileModel = StationAttachedFileModel.find_by_id(attached_id)
    if not attached:
        raise EntityNotFound("The file id {} doesn't exist".format(attached_id))

    deleted = attached.delete()
    if deleted:
        app_logger.info("Attached file {} has been deleted".format(attached.filename))
    else:
        app_logger.warning("Channel {} could't be deleted.".format(attached.filename))

    return response.bool_to_response(deleted)
