# seismic data API
import os

from werkzeug.datastructures import FileStorage

from flaskapp.api import pre_production
from flaskapp.http_util import response
from flaskapp.http_util.decorators import secure, post_file, post
from flaskapp.http_util.exceptions import FileAlreadyExists, AppException
from flaskapp.models import Right, AppParamsModel
from flaskapp.structures.structures import UploadMseedFiles
from flaskapp.utils.mseed_utils import MseedFileManager, MseedDirManager

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
@post()
def delete_file(upload_file: dict):
    root_dir = AppParamsModel.get_upload_folder_path()
    upload_file: UploadMseedFiles = UploadMseedFiles.from_dict(upload_file)
    file_manager = MseedFileManager(root_dir, file_path=upload_file.file_path)
    return response.bool_to_response(file_manager.delete())


@pre_production.route("/getFiles/<string:dir_path>", methods=["GET"])
@secure(Right.UPLOAD_DATA)
def get_files(dir_path: str):
    root_dir = AppParamsModel.get_upload_folder_path()
    relative_path = MseedDirManager.reconstruct_path(dir_path)
    dir_path = os.path.join(root_dir, relative_path)
    try:
        mdm = MseedDirManager(dir_path)
        return response.model_to_response(mdm.get_files())

    except NotADirectoryError as error:
        raise AppException(str(error))
