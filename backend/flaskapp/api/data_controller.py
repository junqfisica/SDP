import flask

from flaskapp.api import data
from flaskapp.http_util import response
from flaskapp.http_util.decorators import secure, query, post
from flaskapp.http_util.exceptions import EntityNotFound, ForbiddenFileFormat
from flaskapp.models import SeismicDataModel, Right
from flaskapp.structures.structures import Search
from flaskapp.utils.mseed_utils import save_data_plot


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


@data.route("/deleteSeismicData/<string:data_id>", methods=["DELETE"])
@secure(Right.DELETE_FDSN)
def delete_data(data_id):
    sd: SeismicDataModel = SeismicDataModel.find_by_id(data_id)
    if not sd:
        raise EntityNotFound("The file with id {} doesn't exist".format(data_id))

    # deleting this entity will trigger events to delete the mseed files from storage attached to it.
    deleted = sd.delete()

    return response.bool_to_response(deleted)


@data.route("/plotData/<string:data_id>", methods=["GET"])
@secure(Right.EDIT_FDSN)
def plot_data(data_id):
    sd: SeismicDataModel = SeismicDataModel.find_by_id(data_id)
    if not sd:
        raise EntityNotFound("The file with id {} doesn't exist".format(data_id))

    image_path = save_data_plot(sd.file_path)
    if not image_path:
        ForbiddenFileFormat("The file {} is not a valid mseed file.".format(sd.filename))

    return response.file_to_response(image_path, delete_after=True)
