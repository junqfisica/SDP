from flaskapp.api import fdsn
from flaskapp.extensions.geocoder import GeoCoder
from flaskapp.http_util import response
from flaskapp.http_util.decorators import secure, post, query_param
from flaskapp.models import Right, NetworkModel, EquipmentTypeModel, EquipmentModel, StationModel


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


@fdsn.route("/getStation", methods=["GET"])
@secure(Right.CREATE_FDSN)
@query_param("station_id")
def get_station(station_id: str):
    station = StationModel.find_by_id(station_id)
    if station:
        return response.model_to_response(station)

    return response.empty_response()
