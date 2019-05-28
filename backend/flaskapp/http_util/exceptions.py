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


class EntityNotFound(AppException):
    status_code = http.HTTPStatus.NOT_FOUND


class CreateEntityError(AppException):

    status_code = http.HTTPStatus.NOT_ACCEPTABLE


class PermissionDenied(AppException):

    status_code = http.HTTPStatus.UNAUTHORIZED


class RoleNotFound(AppException):

    status_code = http.HTTPStatus.FAILED_DEPENDENCY


class ForbiddenFileFormat(AppException):

    status_code = http.HTTPStatus.FORBIDDEN


class FileAlreadyExists(AppException):

    status_code = http.HTTPStatus.CONFLICT


class InvalidInstrumentType(AppException):

    status_code = http.HTTPStatus.NOT_ACCEPTABLE


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


@errors.app_errorhandler(EntityNotFound)
def handle_entity_not_found(error: AppException):
    return error_to_response(error)


@errors.app_errorhandler(CreateEntityError)
def handle_create_entity_error(error: AppException):
    return error_to_response(error)


@errors.app_errorhandler(PermissionDenied)
def handle_permission_denied(error: AppException):
    return error_to_response(error)


@errors.app_errorhandler(RoleNotFound)
def handle_role_not_found(error: AppException):
    return error_to_response(error)


@errors.app_errorhandler(ForbiddenFileFormat)
def handle_forbidden_file_format(error: AppException):
    return error_to_response(error)


@errors.app_errorhandler(FileAlreadyExists)
def handle_file_already_exists(error: AppException):
    return error_to_response(error)


@errors.app_errorhandler(InvalidInstrumentType)
def handle_invalid_instrument_type(error: AppException):
    return error_to_response(error)
