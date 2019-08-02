# seismic data API
import os

from werkzeug.datastructures import FileStorage

from flaskapp.api import pre_production
from flaskapp.http_util import response
from flaskapp.http_util.decorators import secure, post_file, post, query_param
from flaskapp.http_util.exceptions import FileAlreadyExists, AppException
from flaskapp.models import Right, AppParamsModel
from flaskapp.structures.structures import UploadMseedFiles, PreUploadFiles
from flaskapp.utils.mseed_utils import MseedFileManager, MseedDirManager
from flaskapp.utils.progress_event import ProgressEvent

ACCEPTED_FILES = ["mseed"]


@pre_production.route("/upload", methods=["POST"])
@secure(Right.UPLOAD_DATA)
@post_file()
def upload_data(file: FileStorage):
    if file:
        root_dir = AppParamsModel.get_upload_folder_path()
        try:
            file_manager = MseedFileManager(root_dir, file)
            if file_manager.save():
                return response.bool_to_response(True)
            else:
                raise FileAlreadyExists("The file {} was already upload to the server".format(file.filename))

        except (FileNotFoundError, TypeError, ValueError) as error:
            raise AppException(str(error))


@pre_production.route("/scanUploadDir", methods=["GET"])
@secure(Right.UPLOAD_DATA)
def scan_upload_dir():
    root_dir = AppParamsModel.get_upload_folder_path()
    try:
        dir_structure = MseedDirManager.scan_mseed_dirs(root_dir)
        return response.model_to_response(dir_structure)

    except NotADirectoryError as error:
        raise AppException(str(error))


@pre_production.route("/delete/<string:dir_path>", methods=["DELETE"])
@secure(Right.UPLOAD_DATA)
def delete(dir_path: str):
    root_dir = AppParamsModel.get_upload_folder_path()
    relative_path = MseedDirManager.reconstruct_path(dir_path)
    dir_path = os.path.join(root_dir, relative_path)
    try:
        mdm = MseedDirManager(dir_path)
        was_deleted = mdm.delete()
        return response.bool_to_response(was_deleted)

    except NotADirectoryError as error:
        raise AppException(str(error))


@pre_production.route("/deleteFile", methods=["POST"])
@secure(Right.UPLOAD_DATA)
@post(class_to_map=UploadMseedFiles)
def delete_file(upload_file: UploadMseedFiles):
    root_dir = AppParamsModel.get_upload_folder_path()
    file_manager = MseedFileManager(root_dir, file_path=upload_file.file_path)
    return response.bool_to_response(file_manager.delete())


@pre_production.route("/getFiles", methods=["GET"])
@secure(Right.UPLOAD_DATA)
@query_param("dir_path", "progress_id")
def get_files(dir_path: str, progress_id: str):
    progress_id = progress_id if progress_id != '' else '0'
    with ProgressEvent(progress_id) as pe:
        root_dir = AppParamsModel.get_upload_folder_path()
        relative_path = MseedDirManager.reconstruct_path(dir_path)
        dir_path = os.path.join(root_dir, relative_path)
        try:
            mdm = MseedDirManager(dir_path)
            return response.model_to_response(mdm.get_files(pe))

        except NotADirectoryError as error:
            raise AppException(str(error))


@pre_production.route("/transferFolderData", methods=["POST"])
@secure(Right.UPLOAD_DATA)
@post(class_to_map=PreUploadFiles)
def transfer_folder_data(dir_structure: PreUploadFiles):
    root_dir = AppParamsModel.get_upload_folder_path()
    dir_path = os.path.join(root_dir, dir_structure.path)
    with ProgressEvent(dir_structure.progressId) as pe:
        try:
            mdm = MseedDirManager(dir_path)
            result = mdm.transfer_all_to_storage(dir_structure.channel_id, pe)
            dir_structure.set_file_transfer_results(result)
            return response.model_to_response(dir_structure)

        except (NotADirectoryError, OSError, TypeError) as error:
            raise AppException(str(error))
