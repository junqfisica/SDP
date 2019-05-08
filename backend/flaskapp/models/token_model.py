from flaskapp import db, app_utils
from flaskapp.models import TableNames
from flaskapp.models.base_model import BaseModel


class TokenModel(db.Model, BaseModel):

    # The name of the table at the data base.
    __tablename__ = TableNames.T_TOKEN

    # The table columns.
    id = db.Column(db.String(16), primary_key=True)
    expiry = db.Column(db.DateTime, nullable=True)
    token = db.Column(db.String(255), primary_key=True)
    user_id = db.Column(db.String(16), db.ForeignKey(TableNames.T_USER + ".id"), unique=False, nullable=False)

    def __repr__(self):
        return "TokenModel(user_id={}, token={})".format(self.user_id, self.token)

    @classmethod
    def create_token(cls, user_id, expiry=None):
        """
        Create an instance of TokenModel using only user_id.

        :param user_id: A user id.
        :param expiry: (Optional) An expire date stamp.
        :return: The instance of TokenModel.
        """
        token_model = cls(expiry=expiry, user_id=user_id)
        token_model.token = app_utils.generate_token()
        token_model.id = app_utils.generate_id(16)
        return token_model

    # Queries for this model.
    @classmethod
    def find_by_user_id(cls, user_id):
        token = cls.find_by(user_id=user_id)
        if token:
            return token

        return None
