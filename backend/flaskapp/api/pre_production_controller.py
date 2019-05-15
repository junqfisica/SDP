# seismic data API
import os

from werkzeug.datastructures import FileStorage

from flaskapp import app_logger
from flaskapp.api import pre_production
from flaskapp.file_utils import file_utils
from flaskapp.http_util import response
from flaskapp.http_util.decorators import secure, post_file
from flaskapp.http_util.exceptions import ForbiddenFileFormat, FileAlreadyExists
from flaskapp.models import Right, AppParamsModel

ACCEPTED_FILES = ["mseed"]


@pre_production.route("/upload", methods=["POST"])
@secure(Right.UPLOAD_DATA)
@post_file()
def upload_data(file: FileStorage):

    if file:
        root_dir = AppParamsModel.get_upload_folder_path()
        file_path = os.path.join(root_dir, file.filename)
        if os.path.exists(file_path):
            raise FileAlreadyExists("The file {} was already upload to the server".format(file.filename))
        else:
            file_ext = file_utils.get_file_extension(file.filename)
            try:
                ACCEPTED_FILES.index(file_ext)
                file.save(file_path)
                file.close()
                app_logger.info("File {} saved.".format(file_path))
            except ValueError:
                raise ForbiddenFileFormat("The extension {} is not allow".format(file_ext))

    return response.string_to_response("Great job!!")
