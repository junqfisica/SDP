from functools import wraps

from flask import request
from flask_login import current_user

from flaskapp.structures.abstractClasses import AbstractStructure
from flaskapp.http_util.exceptions import PermissionDenied


def query_param(*params: str):
    """
    Gets the parameters in the http url request and pass to your function argument.

    Example:  request -> /api/login?username=admin&password=test

    In this example the request parameters are username and password. You must then use this decorator like::

        @query_param("username", "password")
        def my_func(username, password):
            'do something'

    :param params: The name of the request parameters.
    :return: The decorated function with the arguments equal the request parameters.
    """
    def app_decorator(func):
        @wraps(func)
        def wrap_func(*args, **kwargs):
            request_values = (request.args.get(param) for param in params)
            args = request_values
            return func(*args, **kwargs)
        return wrap_func
    return app_decorator


def query(class_to_map: AbstractStructure):
    """
    Gets the parameters in the http url request and map to a structure. The class must have the same keys as the
    object being passed.

    Import!! The keys in the json must have the exactly same names as the parameters in the class to be mapped.

    Example:  request -> /api/user/search , { QueryParameters }. Here QueryParameters is a json and each key
    is mapped to a parameter in the class UserSearch.

    In this example the request parameters are username and password. You must then use this decorator like::

        @query(UserSearch)
        def my_func(us):


    :param class_to_map: Expected to be a child from AbstractStructure class.
    :return: The instance of the class mapped.
    """
    def app_decorator(func):
        @wraps(func)
        def wrap_func(*args, **kwargs):
            class_instance = class_to_map.from_dict(request.args)
            return func(class_instance)
        return wrap_func
    return app_decorator


def post(class_to_map=None, *post_parameters: str):
    """
    Get post data as a dictionary if no post parameter is given. Otherwise
    it will map the parameters from post to the decorate function.


    Example::

    request -> /api/login, with a request body user = {name: "Joe", age: 26}.

    In this example user is a json with keys name and age.

    * Method 1::

        @api.route("/api/login", methods=["POST"])
        @post()
        def my_func(user=None):
             print(user)

    This would print {name: "Joe", age: 26}.

    * Method 2::

        @api.route("/api/login", methods=["POST"])
        @post("name", "age")
        def my_func(name=None, age=None):
             print(name)
             print(age)

    This would print "Joe" and 26.

    * Method 3::

        @api.route("/api/login", methods=["POST"])
        @post(User)
        def my_func(user: User):
             print(user.name)
             print(user.age)

    This would print "Joe" and 26.

    :param class_to_map: Expected to be a class with from_dict.
    :param post_parameters: (Optional) The names of the json keys from your body request.
    :return: Map the body request to the given parameters at the decorated method.
    """
    def app_decorator(func):
        @wraps(func)
        def wrap_func(*args, **kwargs):
            json_data = request.get_json()
            # if post parameters are given then map request to it.
            if post_parameters:
                parm = (json_data.get(param) for param in post_parameters)
                return func(*parm, *args, **kwargs)

            if class_to_map and hasattr(class_to_map, "from_dict"):
                class_instance = class_to_map.from_dict(json_data)
                return func(class_instance, *args, **kwargs)

            # Otherwise just return the dictionary.
            return func(json_data, *args, **kwargs)
        return wrap_func

    return app_decorator


def post_from_form(*form_parameters: str):
    """
    Map form data to the form_parameters.


    Example::

    request -> /api/login, with a form = {name: "Joe", age: 26}.

    In this example user is a json with keys name and age.

    * Method::

        @api.route("/api/login", methods=["POST"])
        @post_from_form("name", "age")
        def my_func(name=None, age=None):
             print(name)
             print(age)

    This would print "Joe" and 26.

    :param form_parameters: (Optional) The names of the json keys from your Form request.
    :return: Inject the form parameters to the method.
    """
    def app_decorator(func):
        @wraps(func)
        def wrap_func(*args, **kwargs):
            if form_parameters:
                parm = (request.form.get(param) for param in form_parameters)
                return func(*parm, *args, **kwargs)
        return wrap_func
    return app_decorator


def post_file():
    """
    Get a streamed file from post form.

    Example::

        @api.route("/upload", methods=["POST"])
        @post_file()
        def my_func(stream_file: FileStorage):
             print(stream_file)

    :return: Injects a stream of type FileStorage from request.files['file'] to the method.
    """
    def app_decorator(func):
        @wraps(func)
        def wrap_func(*args, **kwargs):
            file = request.files['file']
            return func(file, *args, **kwargs)

        return wrap_func

    return app_decorator


def secure(permission: str):
    """
    Check if user has a given role/right. If not, raises :class:`PermissionDenied` exception witch
    sends an unauthorized response to the client.

    :param permission: The role/right to be checked. Use the Role/Right from models to pass a secure value.
    :type permission: str

    :return: An unauthorized response to the client if the user don't have the right permission.

    :raises PermissionDenied: Exception witch sends an unauthorized response to the client.
    """
    def app_decorator(func):
        @wraps(func)
        def wrap_func(*args, **kwargs):
            if current_user.is_authenticated and \
                    (current_user.has_role(permission) or current_user.has_right(permission)):
                return func(*args, **kwargs)
            else:
                raise PermissionDenied("User has no permission {}".format(permission))
        return wrap_func
    return app_decorator
