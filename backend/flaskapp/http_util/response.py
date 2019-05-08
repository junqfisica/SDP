import http

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


def empty_response():
    """
    Create a null response with the right http status.

    :return: The null response with http status: 204
    """
    return "", http.HTTPStatus.NO_CONTENT
