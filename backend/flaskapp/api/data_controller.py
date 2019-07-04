import flask
from werkzeug.datastructures import FileStorage

from flaskapp.api import data
from flaskapp.http_util import response
from flaskapp.http_util.decorators import secure, query, post
from flaskapp.models import SeismicDataModel, Right
from flaskapp.structures.structures import Search


@data.route("/searchData", methods=["GET"])
@secure(Right.EDIT_FDSN)
@query(Search)
def search_data(search: Search):
    search_result = SeismicDataModel.search(search)
    return response.model_to_response(search_result)


@data.route("/downloadFile", methods=["POST"])
@secure(Right.EDIT_FDSN)
@post(class_to_map=SeismicDataModel)
def download_file(sd: SeismicDataModel):
    return flask.send_file(sd.file_path, mimetype="mseed", attachment_filename=sd.filename)
