from flaskapp.api import fdsn
from flaskapp.extensions.geocoder import GeoCoder
from flaskapp.http_util import response
from flaskapp.http_util.decorators import secure, post, query_param
from flaskapp.models import Right, NetworkModel, EquipmentTypeModel, EquipmentModel, StationModel, ChannelModel


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
@secure(Right.CREATE_FDSN)
@query_param("lat", "long")
def get_location(lat, long):
    location = GeoCoder().get_location(lat, long)
    return response.model_to_response(location)


@fdsn.route("/getNRLManufacturers", methods=["GET"])
@secure(Right.CREATE_FDSN)
@query_param("instrument_type")
def get_nrl_manufacturers(instrument_type: str):
    manufactures = EquipmentModel.get_all_manufactures_nrl(instrument_type)
    return response.string_to_response(manufactures)


@fdsn.route("/getNRLInstrument", methods=["GET"])
@secure(Right.CREATE_FDSN)
@query_param("instrument_type", "manufactory")
def get_nrl_instrument(instrument_type: str, manufactory: str):
    instruments = EquipmentModel.get_instruments_nrl(instrument_type, manufactory)
    return response.string_to_response(instruments)


@fdsn.route("/getDataloggers", methods=["GET"])
@secure(Right.CREATE_FDSN)
def get_data_loggers():
    dataloggers = EquipmentModel.find_by(type="Datalogger", order_by=EquipmentModel.manufactory, get_first=False)
    return response.model_to_response(dataloggers)


@fdsn.route("/getSensors", methods=["GET"])
@secure(Right.CREATE_FDSN)
def get_data_sensors():
    sensors = EquipmentModel.find_by(type="Sensor", order_by=EquipmentModel.name, get_first=False)
    return response.model_to_response(sensors)


@fdsn.route("/getGains", methods=["GET"])
@secure(Right.CREATE_FDSN)
@query_param("manufactory", "instrument")
def get_gains(manufactory: str, instrument: str):
    gains = EquipmentModel.get_gain_from_nrl(manufactory, instrument)
    return response.string_to_response(gains)


@fdsn.route("/getSampleRates", methods=["GET"])
@secure(Right.CREATE_FDSN)
@query_param("manufactory", "instrument", "gain")
def get_sample_rates(manufactory: str, instrument: str, gain: str):
    sr = EquipmentModel.get_sample_rate_from_nrl(manufactory, instrument, gain)
    return response.string_to_response(sr)


@fdsn.route("/getStation", methods=["GET"])
@secure(Right.CREATE_FDSN)
@query_param("station_id")
def get_station(station_id: str):
    station = StationModel.find_by_id(station_id)
    if station:
        return response.model_to_response(station)

    return response.empty_response()
