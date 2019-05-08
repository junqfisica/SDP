import http

from flask import jsonify, Blueprint


# Exceptions Classes


class AppException(Exception):

    status_code = http.HTTPStatus.INTERNAL_SERVER_ERROR

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv


class UserNotFound(AppException):
    status_code = http.HTTPStatus.NOT_FOUND


class PermissionDenied(AppException):

    status_code = http.HTTPStatus.UNAUTHORIZED


class RoleNotFound(AppException):

    status_code = http.HTTPStatus.FAILED_DEPENDENCY


def error_to_response(error: AppException):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response


# Register exceptions in the app.

errors = Blueprint('errors', __name__)


@errors.app_errorhandler(AppException)
def handle_app_exception(error: AppException):
    return error_to_response(error)


@errors.app_errorhandler(UserNotFound)
def handle_user_not_found(error: AppException):
    return error_to_response(error)


@errors.app_errorhandler(PermissionDenied)
def handle_permission_denied(error: AppException):
    return error_to_response(error)


@errors.app_errorhandler(RoleNotFound)
def handle_role_not_found(error: AppException):
    return error_to_response(error)
