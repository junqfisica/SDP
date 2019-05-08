import coloredlogs
import logging

from flask import Flask
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flaskapp.config import Config

db = SQLAlchemy()
bcrypt = Bcrypt()
login_manager = LoginManager()
login_manager.session_protection = 'strong'


def create_logger():
    # create logger.
    logger = logging.getLogger('logger')
    logger.setLevel(logging.INFO)
    coloredlogs.install(level='DEBUG', logger=logger)

    # create console handler and set level to debug.
    ch = logging.StreamHandler()
    ch.setLevel(logging.DEBUG)

    # create file handler.
    file_log = logging.FileHandler(filename="app.log")
    file_log.setLevel(logging.INFO)

    # create formatter
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

    # add formatter to ch
    ch.setFormatter(formatter)
    file_log.setFormatter(formatter)

    # add ch and file_log to logger
    logger.addHandler(ch)
    logger.addHandler(file_log)

    return logger


def create_app(config_class=Config):

    app = Flask(__name__)
    app.config.from_object(config_class)

    # start db.
    db.init_app(app)

    # set CORS-filter
    CORS(app)

    bcrypt.init_app(app)
    login_manager.init_app(app)

    # this must be imported only after flask configuration.
    from flaskapp.api import api as api_blueprint
    from flaskapp.api import users as users_blueprint
    from flaskapp.main.index import main as main_blueprint
    from flaskapp.http_util.exceptions import errors

    # register new APIs here.
    app.register_blueprint(api_blueprint, url_prefix='/api')
    app.register_blueprint(users_blueprint, url_prefix='/api/user')

    # redirect to Angular build.
    app.register_blueprint(main_blueprint)

    # register error blueprint.
    app.register_blueprint(errors)

    app_logger.info("Webservice started.")

    return app


app_logger = create_logger()



