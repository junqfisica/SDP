# seismic data API
import os

from werkzeug.datastructures import FileStorage

from flaskapp.api import seismic_data
from flaskapp.http_util import response
from flaskapp.http_util.decorators import secure, post_file
from flaskapp.models import Right


@seismic_data.route("/upload", methods=["POST"])
@secure(Right.UPLOAD_DATA)
@post_file()
def upload_data(file: FileStorage):
    print("Test to transfer file")
    if file:
        file_path = os.path.join("/home/junqueira/Pictures/test", file.filename)
        if os.path.exists(file_path):
            print("This file already exists.")
        else:
            print("Saving file.")
            file.save(file_path)
        print(file.filename)
        print(file)
        file.close()
    return response.string_to_response("Great job!!")

