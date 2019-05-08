from flaskapp import app_logger
from flaskapp.api import api
from flaskapp.http_util import response
from flaskapp.http_util.decorators import post_from_form
from flaskapp.models import UserModel, TokenModel


@api.route("/login",  methods=["POST"])
@post_from_form("username", "password")
def login(username=None, password=None):

    user = UserModel.find_by_username(username)

    if user and user.has_valid_password(password):

        # create a token for user.
        token_model = TokenModel.find_by_user_id(user.id)
        if not token_model:
            # create if token don't exist.
            token_model = TokenModel.create_token(user.id)

        if token_model.save():
            app_logger.info("User {} logged in successfully.".format(username))
            return response.model_to_response(user)
        else:
            app_logger.warning("User {} fail to login.".format(username))
            return response.empty_response()

    app_logger.info("User {} has bad credentials.".format(username))
    return response.empty_response()
