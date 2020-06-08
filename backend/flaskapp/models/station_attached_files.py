import os

from sqlalchemy import event
from werkzeug.datastructures import FileStorage

from flaskapp import db, app_utils, app_logger
from flaskapp.http_util.exceptions import EntityNotFound, FileNotFound
from flaskapp.models import BaseModel, TableNames, TargetFolderModel


class StationAttachedFileModel(db.Model, BaseModel):

    # The name of the table at the data base.
    __tablename__ = TableNames.T_STATION_ATTACHED

    # The table columns.
    id = db.Column(db.String(16), primary_key=True)
    filename = db.Column(db.String(50), nullable=False)
    relative_path = db.Column(db.String(400), nullable=False)
    target_folder_id = db.Column(db.String(16), db.ForeignKey(TableNames.T_TARGET_FOLDERS + ".id"), nullable=False)
    station_id = db.Column(db.String(16), db.ForeignKey(TableNames.T_STATIONS + ".id"), nullable=False)

    def __repr__(self):
        return "StationAttachedFileModel(id={},filename={},relative_path={},target_folder_id={}, " \
               "station_id={})".format(self.id, self.filename, self.relative_path, self.target_folder_id,
                                       self.station_id)

    @staticmethod
    def validate_path(path: str):
        """
        This method will check if path exists. If it doesn't an :class:`FileNotFound` will be sent back as
        an exception response.

        :param path: A string pointing to the path.

        :return:
        """
        if not os.path.exists(path):
            raise FileNotFound("The dir or file {} was not found at the server.".format(path))

    def delete_file(self):
        """
        This will delete the file at the storage area.

        :return:
        """
        if os.path.isfile(self.file_path):
            os.remove(self.file_path)

    @property
    def target_folder(self):
        target_folder: TargetFolderModel = TargetFolderModel.find_by_id(self.target_folder_id)
        if not target_folder:
            raise EntityNotFound("Location for file {} not found".format(self.filename))

        return target_folder

    @property
    def folder_path(self):
        """
        The folder location for this data.

        :return: The folder location of this data.
        """
        folder_path = os.path.join(self.target_folder.path, self.relative_path)
        return folder_path

    @property
    def file_path(self):
        file_path = os.path.join(self.folder_path, self.filename)
        StationAttachedFileModel.validate_path(file_path)
        return file_path

    def create_relative_path(self):
        relative_path = os.path.join("attached", self.station_id)
        absolute_path = os.path.join(self.target_folder.path, relative_path)
        if not os.path.isdir(absolute_path):
            os.makedirs(absolute_path, mode=0o777)
        return relative_path

    @classmethod
    def create(cls, filename: str, station_id):
        """
        This will create a new entity, with new id.

        Import: You must use save() to storage it in the database.

        :param filename: The file name.

        :param station_id: The station id the file will be linked to.

        :return: An instance of StationAttachedFileModel
        """
        attached_dict = {
            "id": app_utils.generate_id(16), "filename": filename, "relative_path": "",
            "target_folder_id": TargetFolderModel.get_active_folder().id, "station_id": station_id
        }
        model: StationAttachedFileModel = cls.from_dict(attached_dict)
        model.relative_path = model.create_relative_path()

        return model

    def write_file(self, file: FileStorage):
        file_path = os.path.join(self.folder_path, file.filename)
        if not os.path.isfile(file_path):
            file.save(file_path)

        file.close()

    def to_dict(self):
        """
        Convert StationAttachedFileModel into a dictionary, this way we can convert it to a JSON response.

        :return: A clean dictionary form of this model.
        """
        # convert columns to dict
        dict_representation = super().to_dict()

        # add file location
        dict_representation["folder_path"] = self.folder_path

        return dict_representation


# Event handlers when StationAttachedFileModel is deleted. This is useful when this
# instances are deleted in cascade.


# This event is called every time a StationAttachedFileModel instance is deleted.
@event.listens_for(StationAttachedFileModel, 'after_delete')
def receive_after_delete(mapper, connection, target: StationAttachedFileModel):
    try:
        file_path = target.file_path
        target.delete_file()
        app_logger.info("File {} was deleted.".format(file_path))

    except FileNotFound:
        app_logger.info("File {} was already deleted.".format(target.filename))
