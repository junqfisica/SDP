from flaskapp import db, app_utils
from flaskapp.http_util.exceptions import ActiveFolderNotFound
from flaskapp.models import BaseModel, TableNames
from flaskapp.utils import file_utils


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

    def to_dict(self):
        """
        Convert TargetFolder into a dictionary, this way we can convert it to a JSON response.

        :return: A clean dictionary form of this model.
        """
        # convert columns to dict
        dict_representation = super().to_dict()

        # add extra keys
        dict_representation['online'] = file_utils.is_dir_online(self.path)
        dict_representation['diskInfo'] = app_utils.get_disk_info(self.path)

        return dict_representation

    def deactivate(self):
        self.active = False
        self.save()

    def activate(self):
        self.active = True
        self.save()

    @classmethod
    def save_target_folder(cls, target_folder):
        try:
            active_folder = cls.get_active_folder()
        except ActiveFolderNotFound:
            active_folder = None

        if target_folder.id:
            safe_tf: TargetFolderModel = cls.find_by_id(target_folder.id)
            safe_tf << target_folder
            safe_tf.save()
        else:
            target_folder.id = app_utils.generate_id(16)
            target_folder.save()

        if active_folder and active_folder.id != target_folder.id and target_folder.active:
            active_folder.deactivate()

        return target_folder
