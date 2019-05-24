from flask import Blueprint

# Create a new Blueprint here. You must register it in the flaskapp __init__.py after.
api = Blueprint('api', __name__)
users = Blueprint('users', __name__)
pre_production = Blueprint('pre_production', __name__)
setting = Blueprint('setting', __name__)
fdsn = Blueprint('fdsn', __name__)


# import the controllers.
from flaskapp.api import user_controller, login_controller, pre_production_controller, setting_controler, \
    fdsn_controller
