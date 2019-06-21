# seismic data API

from werkzeug.datastructures import FileStorage

from flaskapp.api import pre_production
from flaskapp.http_util import response
from flaskapp.http_util.decorators import secure, post_file
from flaskapp.http_util.exceptions import FileAlreadyExists, AppException
from flaskapp.models import Right, AppParamsModel
from flaskapp.utils.mseed_utils import MseedFileManager

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
