import http
import os

import flask
from flask import jsonify


def string_to_response(string):
    """
    Parse a string to an application/json.

    :param string: The string to parse into json response.
    :return: The Json response.
    """
    return jsonify(string)


def bool_to_response(b: bool):
    """
    Parse a string to an application/json.

    :param b: The boolean to parse into json response.
    :return: The Json response.
    """
    return jsonify(b)


def model_to_response(entities):
    """
    Parse an entity model or a list of it to an application/json.

    :param entities: Any object or a list of it that contains a method to_dict().
        This method must return a dictionary.
    :return: The Json response.
    """

    if type(entities) == list:
        model_dict = [entity.to_dict() for entity in entities]
    else:
        model_dict = entities.to_dict()

    return jsonify(model_dict)


def file_to_response(file_path: str, delete_after = False):
    """
    Create a response from a file path using flask.send_file

    :param file_path: The full path to the file.
    :param delete_after: If file should be deleted after creating response.
    :return: A file response.
    """
    rv = flask.send_file(file_path)
    if delete_after and os.path.isfile(file_path):
        os.remove(file_path)
    return rv


def empty_response():
    """
    Create a null response with the right http status.

    :return: The null response with http status: 204
    """
    return "", http.HTTPStatus.NO_CONTENT
