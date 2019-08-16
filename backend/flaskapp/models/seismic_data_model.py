import os
from datetime import datetime
from typing import List

from sqlalchemy import event

from flaskapp import db, app_utils, app_logger
from flaskapp.http_util.exceptions import EntityNotFound, FileNotFound
from flaskapp.models import BaseModel, TableNames, TargetFolderModel, RelationShip, FileTransferredModel, \
    ChannelModel, StationModel
from flaskapp.structures.structures import UploadMseedFiles, SearchResult, SeismicDataSearch
from flaskapp.utils.date_utils import DateUtils


class SeismicDataModel(db.Model, BaseModel):

    # The name of the table at the data base.
    __tablename__ = TableNames.T_SEISMIC_DATA

    # The table columns.
    id = db.Column(db.String(16), primary_key=True)
    filename = db.Column(db.String(50), nullable=False)
    relative_path = db.Column(db.String(400), nullable=False)
    target_folder_id = db.Column(db.String(16), db.ForeignKey(TableNames.T_TARGET_FOLDERS + ".id"), nullable=False)
    start_time: datetime = db.Column(db.DateTime(timezone=True), nullable=False)
    stop_time: datetime = db.Column(db.DateTime(timezone=True), nullable=False)
    channel_id = db.Column(db.String(16), db.ForeignKey(TableNames.T_CHANNELS + ".id"), nullable=False)
    file_data = db.relationship(RelationShip.FILE_DATA, backref="data",
                                cascade="save-update, merge, delete", lazy=True)

    def __repr__(self):
        return "SeismicDataModel(id={},filename={},relative_path={},target_folder_id={}, start_time={}, " \
               "stop_time={}, channel_id={})".format(self.id, self.filename, self.relative_path,
                                                     self.target_folder_id, self.start_time,
                                                     self.stop_time, self.channel_id)

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

    def is_valid_upload_file(self, upload_file: UploadMseedFiles):
        """
        Check if upload file is valid to be transferred to the storage area.

        :param upload_file: The UploadMseedFile structure.

        :return: A tuple (isValid: boolean, message: str)
        """
        ch: ChannelModel = ChannelModel.find_by_id(self.channel_id)
        if not ch:
            raise EntityNotFound("Channel id {} not found".format(self.channel_id))

        start_time = DateUtils.convert_string_to_utc(upload_file.start_time)
        stop_time = DateUtils.convert_string_to_utc(upload_file.end_time)
        sd = SeismicDataModel.find_by(channel_id=self.channel_id, start_time=start_time)
        if sd:
            return False, "File {} is in conflict with file {} at the channel {}-{}"\
                .format(upload_file.file_name, sd.filename, ch.station.name, ch.name)

        if not ch.is_within_deltatime(start_time, stop_time):
            return False, "File {} is not within the channel's time interval".format(upload_file.file_name)

        if ch.sample_rate != upload_file.sample_rate:
            return False, "File {} has not the same sample rate than channel {}-{} {}"\
                .format(upload_file.file_name, ch.station.name, ch.name,
                        DateUtils.convert_datetime_to_utc(ch.start_time))
        return True, ""

    def delete_file(self):
        """
        This will delete the file at the storage area.

        :return:
        """
        if os.path.isfile(self.file_path):
            os.remove(self.file_path)

    def is_public(self):
        channel: ChannelModel = ChannelModel.find_by_id(self.channel_id)
        return channel.get_station().public_data

    @property
    def folder_path(self):
        """
        The folder location for this data.
        :return: The folder location of this data.
        """
        target_folder: TargetFolderModel = TargetFolderModel.find_by_id(self.target_folder_id)
        if not target_folder:
            raise EntityNotFound("Location for file {} not found".format(self.filename))

        folder_path = os.path.join(target_folder.path, self.relative_path)
        return folder_path

    @property
    def file_path(self):
        file_path = os.path.join(self.folder_path, self.filename)
        SeismicDataModel.validate_path(file_path)
        return file_path

    @property
    def files(self) -> List[FileTransferredModel]:
        """
        Gets the list of :class:`FileTransferredModel`

        :return: A list of FileTransferredModel
        """
        files = [fd.transferred_file for fd in self.file_data]
        return files

    def add_file_data(self, file_transferred_id: str):
        fd = FileDataModel(data_id=self.id, file_id=file_transferred_id)
        self.file_data.append(fd)

    @classmethod
    def create_data(cls, **kwargs):
        """
        This will create a new seismic data entity, with new id.

        Import: You must use save() to storage it in the database.

        :param kwargs: A dictionary contain the kwargs:
            id: str, filename: str, relative_path: str, target_folder_id: str, start_time: datetime,
            stop_time: datetime, channel_id: str

        :return: An instance of seismic data
        """
        data: SeismicDataModel = cls.from_dict(kwargs)
        data.id = app_utils.generate_id(16)

        # Add file data relational field. At creation filename must be the id of transferred file table.
        transferred_file_id = data.filename
        data.add_file_data(transferred_file_id)
        return data

    def to_dict(self):
        """
        Convert SeismicData into a dictionary, this way we can convert it to a JSON response.

        :return: A clean dictionary form of this model.
        """
        # convert columns to dict
        dict_representation = super().to_dict()

        # add file transferred
        dict_representation["files"] = [file.to_dict() for file in self.files]

        # add file location
        dict_representation["folder_path"] = self.folder_path

        # add is public
        dict_representation["is_public"] = self.is_public()

        return dict_representation

    @classmethod
    def join_search(cls, seismic_search: SeismicDataSearch):
        """
        Make a join search with Station and ChannelModel.

        :param seismic_search: A SeismicDataSearch instance use in the search.

        :return:  A SearchResult instance.
        """
        search_filters = []
        if seismic_search.Station:
            search_filters.append(StationModel.name == seismic_search.Station.upper().strip())

        if seismic_search.Network:
            search_filters.append(StationModel.network_id == seismic_search.Network.upper().strip())

        if seismic_search.Channel:
            search_filters.append(ChannelModel.name == seismic_search.Channel.upper().strip())

        if seismic_search.StartTime:
            # noinspection PyTypeChecker
            search_filters.append(SeismicDataModel.start_time >= seismic_search.StartTime)

        if seismic_search.StopTime:
            # noinspection PyTypeChecker
            search_filters.append(SeismicDataModel.stop_time <= seismic_search.StopTime)

        if seismic_search.Filename:
            search_filters.append(cls.filename.like('%{}%'.format(seismic_search.Filename.strip())))

        # Need at least one filter, otherwise return empty result.
        if not search_filters:
            return SearchResult([], 0)

        query = cls.query.join(ChannelModel, cls.channel_id == ChannelModel.id).\
            join(StationModel, ChannelModel.station_id == StationModel.id)\
            .filter(*search_filters).order_by(cls.start_time)

        page = query.paginate(per_page=seismic_search.PerPage, page=seismic_search.Page)

        entities = page.items
        total = page.total
        if entities:
            return SearchResult(entities, total)

        return SearchResult([], 0)


class FileDataModel(db.Model, BaseModel):

    # The name of the table at the data base.
    __tablename__ = TableNames.T_FILE_DATA

    # The table columns.
    data_id = db.Column(db.String(16), db.ForeignKey(TableNames.T_SEISMIC_DATA + ".id"), primary_key=True)
    file_id = db.Column(db.String(50), db.ForeignKey(TableNames.T_TRANSFERRED_FILES + ".id"), primary_key=True)

    def __repr__(self):
        return "FileDataModel(data_id={},file_id={})"\
            .format(self.data_id, self.file_id)

    @property
    def transferred_file(self) -> FileTransferredModel:
        return FileTransferredModel.find_by_id(self.file_id)


# Event handlers when FileDataModel and SeismicDataModel are deleted. This is useful when this
# instances are deleted in cascade.

# This event is called every time a FileDataModel instance is deleted.
@event.listens_for(FileDataModel, 'after_delete')
def receive_after_delete(mapper, connection, target: FileDataModel):
    @event.listens_for(db.session, "after_flush", once=True)
    def receive_after_flush(session, context):
        ft: FileTransferredModel = FileTransferredModel.find_by_id(target.file_id)
        # Must delete file transferred instance, because here is not possible to update.
        # When deleted it will trigger its event after_delete.
        if ft:
            session.delete(ft)

# This event is called every time a SeismicDataModel instance is deleted.
@event.listens_for(SeismicDataModel, 'after_delete')
def receive_after_delete(mapper, connection, target: SeismicDataModel):
    try:
        file_path = target.file_path
        target.delete_file()
        app_logger.info("File {} was deleted.".format(file_path))

    except FileNotFound:
        app_logger.info("File {} was already deleted.".format(target.filename))
