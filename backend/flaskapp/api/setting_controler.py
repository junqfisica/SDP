# Application settings APIs.
import os

from flaskapp.api import setting
from flaskapp.http_util import response
from flaskapp.http_util.decorators import secure, query_param, post
from flaskapp.http_util.exceptions import EntityNotFound
from flaskapp.models import Role, AppParamsModel, TargetFolderModel
from flaskapp.utils import file_utils


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
    is_online = file_utils.is_dir_online(folder_path)
    return response.bool_to_response(is_online)


@setting.route("/updateAppParams", methods=["POST"])
@secure(Role.ADMIN)
@post()
def update_app_params(param: dict):
    return response.bool_to_response(AppParamsModel.update(param))


@setting.route("/getTargetFolders", methods=["GET"])
@secure(Role.ADMIN)
def get_target_folders():
    target_folders = TargetFolderModel.get_all()
    return response.model_to_response(target_folders)


@setting.route("/saveTargetFolder", methods=["POST"])
@secure(Role.ADMIN)
@post(class_to_map=TargetFolderModel)
def save_target_folder(target_folder: TargetFolderModel):
    target_folder = TargetFolderModel.save_target_folder(target_folder)
    return response.model_to_response(target_folder)


@setting.route("/deleteTargetFolder/<string:target_folder_id>", methods=["DELETE"])
@secure(Role.ADMIN)
def delete_target_folder(target_folder_id):
    ft: TargetFolderModel = TargetFolderModel.find_by_id(target_folder_id)
    if not ft:
        raise EntityNotFound("The target folder id {} doesn't exist".format(target_folder_id))

    return response.bool_to_response(ft.delete())

