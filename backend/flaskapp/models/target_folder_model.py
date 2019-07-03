from flaskapp import db
from flaskapp.http_util.exceptions import ActiveFolderNotFound
from flaskapp.models import BaseModel, TableNames


class TargetFolderModel(db.Model, BaseModel):

    # The name of the table at the data base.
    __tablename__ = TableNames.T_TARGET_FOLDERS

    # The table columns.
    id = db.Column(db.String(16), primary_key=True)
    path = db.Column(db.String(400), nullable=False)
    active = db.Column(db.Boolean, nullable=False)

    def __repr__(self):
        return "TargetFolderModel(id={}, path={}, active={})".format(self.id, self.path, self.active)

    @classmethod
    def get_active_folder(cls):
        """
        Get the active folder, if not found an :class:`ActiveFolderNotFound` exception will raise.

        :return: A the active target folder.
        """
        active_folder: TargetFolderModel = cls.find_by(active=True)
        if not active_folder:
            raise ActiveFolderNotFound("There isn't an active target folder. Please, activate before proceed.")

        return active_folder
