from typing import List

import flask

from flaskapp.api import data
from flaskapp.http_util import response
from flaskapp.http_util.decorators import secure, query, post
from flaskapp.http_util.exceptions import EntityNotFound, ForbiddenFileFormat
from flaskapp.models import SeismicDataModel, Right, ChannelModel
from flaskapp.structures.structures import Search
from flaskapp.utils import file_utils
from flaskapp.utils.mseed_utils import save_data_plot
from flaskapp.utils.progress_event import ProgressEvent


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


@data.route("/downloadFiles/<string:channel_id>", methods=["GET"])
@secure(Right.EDIT_FDSN)
def download_files(channel_id):
    ch: ChannelModel = ChannelModel.find_by_id(channel_id)
    if not ch:
        raise EntityNotFound("The channel with id {} doesn't exist".format(channel_id))
    tar_filename = ch.make_tar_file()
    return response.file_to_response(tar_filename, delete_after=True)


@data.route("/rsyncFiles/<string:channel_id>", methods=["GET"])
@secure(Right.RSYNC_DOWNLOAD)
def rsync_files(channel_id):
    ch: ChannelModel = ChannelModel.find_by_id(channel_id)
    if not ch:
        raise EntityNotFound("The channel with id {} doesn't exist".format(channel_id))
    bash_filename = ch.bash_rsync_files()
    return response.file_to_response(bash_filename, delete_after=True)


@data.route("/downloadFileList", methods=["POST"])
@secure(Right.EDIT_FDSN)
@post()
def download_file_list(sdl: List[dict]):
    sd_list: [SeismicDataModel] = [SeismicDataModel.from_dict(d) for d in sdl]
    file_paths = [sd.file_path for sd in sd_list]
    tar_filename = file_utils.tar_files(file_paths)
    return response.file_to_response(tar_filename, delete_after=True)


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


@data.route("/renameFiles/<string:channel_id>", methods=["GET"])
@secure(Right.EDIT_FDSN)
def rename_files(channel_id):
    progress_id = 'rename_' + channel_id
    with ProgressEvent(progress_id) as pe:
        ch: ChannelModel = ChannelModel.find_by_id(channel_id)
        if not ch:
            raise EntityNotFound("The channel with id {} doesn't exist".format(channel_id))
        ch.rename_data(pe)

    return response.string_to_response('Ok')
