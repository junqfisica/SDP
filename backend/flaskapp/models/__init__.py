# include models class name here.
class RelationShip:
    """
    Keep track of models class name for being used in relational tables.
    """
    USER_ROLE = "UserRoleModel"
    USER_RIGHT = "UserRightModel"
    USER = "UserModel"
    ROLE = "RoleModel"
    TOKEN = "TokenModel"
    EQUIPMENT = "EquipmentModel"
    STATIONS = "StationModel"
    CHANNEL = "ChannelModel"
    CHANNEL_EQUIPMENTS = "ChannelEquipmentsModel"


# Include the name of tables from your data base. Use this to map table's name.
# This Avoid possibles circular imports from getting __tablename__ from models.
class TableNames:
    """
    Name of structures (S) or tables (T) in your database.
    Important: The names must match the table's name in your database.
    """
    T_USER = "t_user"
    T_TOKEN = "t_access_tokens"
    S_ROLES = "s_roles"
    S_RIGHTS = "s_rights"
    T_USER_ROLES = "t_user_roles"
    T_USER_RIGHTS = "t_user_rights"
    T_ROLES_RIGHTS = "t_roles_rights"
    T_APP_PARAMS = "t_application_params"
    T_NETWORKS = "t_networks"
    S_EQUIPMENT_TYPE = "s_equipment_type"
    S_EQUIPMENT = "s_equipment"
    T_STATIONS = "t_stations"
    T_CHANNELS = "t_channels"
    T_CHANNELS_EQUIPMENTS = "t_channels_equipments"


class Role:
    """ Possible roles for the user."""
    ADMIN = "ROLE_ADMIN"
    USER = "ROLE_USER"


class Right:
    """ Possible rights for the user."""
    VIEW_USER = "RIGHT_USER"
    CREATE_USER = "RIGHT_USER_CREATE"
    EDIT_USER = "RIGHT_USER_EDIT"
    DELETE_USER = "RIGHT_USER_DELETE"
    UPLOAD_DATA = "RIGHT_DATA_UPLOAD"
    CREATE_FDSN = "RIGHT_FDSN_CREATE"
    DELETE_FDSN = "RIGHT_FDSN_DELETE"
    EDIT_FDSN = "RIGHT_FDSN_EDIT"


# Import models. Watch for circular dependencies.
from flaskapp.models.base_model import BaseModel
from flaskapp.models.token_model import TokenModel
from flaskapp.models.roles_model import RoleModel, UserRoleModel, RightModel, RolesRightsModel, UserRightModel
from flaskapp.models.user_model import UserModel
from flaskapp.models.app_params_model import AppParamsModel
from flaskapp.models.networks_model import NetworkModel
from flaskapp.models.equipments_model import EquipmentTypeModel, EquipmentModel
from flaskapp.models.station_channel_model import StationModel, ChannelModel, ChannelEquipmentsModel

