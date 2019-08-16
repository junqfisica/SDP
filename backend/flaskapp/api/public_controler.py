from typing import List

import flask

from flaskapp.api import public
from flaskapp.http_util import response
from flaskapp.http_util.decorators import query, post
from flaskapp.models import SeismicDataModel
from flaskapp.structures.structures import SeismicDataSearch
from flaskapp.utils import file_utils


@public.route("/searchData", methods=["GET"])
@query(SeismicDataSearch)
def search_data(seismic_search: SeismicDataSearch):
    search_result = SeismicDataModel.join_search(seismic_search)
    return response.model_to_response(search_result)


@public.route("/downloadFileList", methods=["POST"])
@post()
def download_file_list(sdl: List[dict]):
    sd_list: [SeismicDataModel] = [SeismicDataModel.from_dict(d) for d in sdl]
    file_paths = [sd.file_path for sd in sd_list if sd.is_public()]
    tar_filename = file_utils.tar_files(file_paths)
    return response.file_to_response(tar_filename, delete_after=True)


@public.route("/downloadFile", methods=["POST"])
@post(class_to_map=SeismicDataModel)
def download_file(sd: SeismicDataModel):
    if sd.is_public():
        return flask.send_file(sd.file_path, mimetype="mseed", attachment_filename=sd.filename)
    return response.empty_response()
