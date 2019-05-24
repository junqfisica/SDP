
def database_config():
    # Database configuration.
    db_url = "localhost:5432"
    db_name = "sdp"
    db_user = "sdp"
    db_password = "sdp"
    sqlalchemy_database_url = "postgresql://{db_user}:{db_password}@{db_url}/{db_name}". \
        format(db_user=db_user, db_password=db_password, db_url=db_url, db_name=db_name)

    return sqlalchemy_database_url


class Config:
    SQLALCHEMY_DATABASE_URI = database_config()
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = '1000628bb0b13ce0c676dfde280ba187'


