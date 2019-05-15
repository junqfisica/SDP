# Application settings APIs.
import os

from flaskapp.api import setting
from flaskapp.http_util import response
from flaskapp.http_util.decorators import secure, query_param, post
from flaskapp.http_util.exceptions import EntityNotFound
from flaskapp.models import Role, AppParamsModel


@setting.route("/appParams", methods=["GET"])
@secure(Role.ADMIN)
def get_app_params():
    app_params = AppParamsModel.get_all(order_by=AppParamsModel.param_id)
    return response.model_to_response(app_params)


@setting.route("/get/<string:param_id>", methods=["GET"])
@secure(Role.ADMIN)
def get_app_param(param_id: str):
    app_param: AppParamsModel = AppParamsModel.find_by_id(param_id)
    if not app_param:
        raise EntityNotFound("The param_id = {} is not valid.".format(param_id))

    return response.model_to_response(app_param)


@setting.route("/isFolderOnline", methods=["GET"])
@query_param("param_id")
@secure(Role.ADMIN)
def is_folder_online(param_id: str):
    app_param: AppParamsModel = AppParamsModel.find_by_id(param_id)

    if not app_param:
        raise EntityNotFound("The param_id = {} is not valid.".format(param_id))

    folder_path = app_param.param_value
    if os.path.isdir(folder_path) and os.path.exists(folder_path):
        return response.bool_to_response(True)
    else:
        return response.bool_to_response(False)


@setting.route("/updateAppParams", methods=["POST"])
@secure(Role.ADMIN)
@post()
def update_app_params(param: dict):
    return response.bool_to_response(AppParamsModel.update(param))

