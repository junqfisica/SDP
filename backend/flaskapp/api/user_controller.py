# User APIs.
from typing import List

from flask_login import current_user

from flaskapp import app_logger
from flaskapp.api import users
from flaskapp.http_util import response as response
from flaskapp.http_util.decorators import secure, post, query
from flaskapp.http_util.exceptions import UserNotFound, PermissionDenied
from flaskapp.models import UserModel, Role, RoleModel, RightModel, RolesRightsModel, Right
from flaskapp.structures.structures import Search, SearchResult


def __is_username_taken(username: str) -> bool:
    user = UserModel.find_by_username(username)
    if user:
        return True
    return False


@users.route("/<string:user_id>", methods=["GET"])
@secure(Role.USER)
def get_user(user_id: str):
    user: UserModel = UserModel.find_by_id(user_id)
    if user:
        return response.model_to_response(user)

    return response.empty_response()


@users.route("/roles", methods=["GET"])
@secure(Role.USER)
def get_roles():
    roles: List[RoleModel] = RoleModel.get_all(order_by=RoleModel.label)
    if roles:
        return response.model_to_response(roles)

    return response.empty_response()


@users.route("/rights", methods=["GET"])
@secure(Role.USER)
def get_rights():
    rights: List[RightModel] = RightModel.get_all(order_by=RightModel.label)
    if rights:
        return response.model_to_response(rights)

    return response.empty_response()


@users.route("/roleRights/<string:role_id>", methods=["GET"])
@secure(Role.USER)
def get_rights_from_roles(role_id: str):
    right_ids: List[str] = RolesRightsModel.get_rights_by_role(role_id)
    if right_ids:
        return response.string_to_response(right_ids)

    return response.string_to_response([])


@users.route("/all", methods=["GET"])
@secure(Right.VIEW_USER)
def get_users():

    all_users: List[UserModel] = UserModel.get_all()

    if all_users:
        return response.model_to_response(all_users)

    return response.empty_response()


@users.route("/search", methods=["GET"])
@secure(Right.VIEW_USER)
@query(Search)
def search(user_search: Search):

    search_result: SearchResult = UserModel.search(user_search)
    return response.model_to_response(search_result)


@users.route("/username/<string:username>", methods=["GET"])
@secure(Role.USER)
def get_user_by_username(username: str):
    user = UserModel.find_by_username(username)

    if user:
        return response.model_to_response(user)

    return response.empty_response()


@users.route("/isTaken/<string:username>", methods=["GET"])
def is_taken(username: str):
    user_exist = __is_username_taken(username)
    return response.bool_to_response(user_exist)


@users.route("/create", methods=["POST"])
@secure(Right.CREATE_USER)
@post()
def create_user(user: dict):
    # create a user model from user data.
    user_model = UserModel.create_user(user, current_user.id)

    # Check if user with the same username don't exist.
    if __is_username_taken(user_model.username):
        return response.bool_to_response(False)

    created = user_model.save()

    return response.bool_to_response(created)


@users.route("/update", methods=["POST"])
@secure(Right.EDIT_USER)
@post()
def update_user(user: dict):
    # update user
    updated_user = UserModel.update_user(user, current_user.id)

    if not updated_user:
        raise UserNotFound("The user doesn't exist.")

    # return response.bool_to_response(True)
    return response.bool_to_response(updated_user.save())


@users.route("/userSelfUpdate", methods=["POST"])
@secure(Role.USER)
@post()
def user_self_update(user: dict):
    # update user
    updated_user = UserModel.update_user(user, current_user.id, is_self_update=True)

    if not updated_user:
        raise PermissionDenied("Either, this user don't exists or you are trying to update someone that is not you.")

    if updated_user.save():
        return response.model_to_response(updated_user)

    return response.empty_response()


@users.route("/delete/<string:user_id>", methods=["DELETE"])
@secure(Right.DELETE_USER)
def delete_user(user_id):
    user: UserModel = UserModel.find_by_id(user_id)
    if not user:
        raise UserNotFound("The user id {} doesn't exist".format(user_id))

    deleted = user.delete()
    if deleted:
        app_logger.info("User {} has been deleted".format(user.username))
    else:
        app_logger.warning("User {} could't be deleted.".format(user.username))

    return response.bool_to_response(deleted)
