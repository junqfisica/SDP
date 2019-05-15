from flaskapp import db
from flaskapp.http_util.exceptions import EntityNotFound
from flaskapp.models import BaseModel, TableNames


class AppParamsModel(db.Model, BaseModel):

    # The name of the table at the data base.
    __tablename__ = TableNames.T_APP_PARAMS

    # The table columns.
    param_id = db.Column(db.String(50), primary_key=True)
    label = db.Column(db.String(100), nullable=False)
    param_value = db.Column(db.String(200), nullable=False)

    def __repr__(self):
        return "AppParamsModel(param_id={}, param_value={})".format(self.param_id, self.param_value)

    @classmethod
    def get_upload_folder_path(cls):
        """
        Get the upload folder path from the database.

        :return: A string that is the upload folder's path.
        """
        parm: AppParamsModel = cls.find_by_id("uploadFolder")
        if not parm:
            raise EntityNotFound("The param_id=uploadFolder don't exits at the database.")
        return parm.param_value

    @classmethod
    def update(cls, param: dict):
        """
        Update this entity from a dictionary representation of it. Usually a Dto.

        :param param: A data transfer object as a dictionary.

        :return:
        """
        app_param: AppParamsModel = AppParamsModel.from_dict(param)
        # validate the entity
        safe_app: AppParamsModel = app_param.validate(app_param.param_id)
        # pass all attributes from app_param to safe_app.
        safe_app << app_param

        return safe_app.save()
