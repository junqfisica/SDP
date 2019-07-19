import flask

from flaskapp.api import sse
from flaskapp.utils.progress_event import ProgressEvent


@sse.route('/progress/<string:progress_id>', methods=["GET"])
def progress(progress_id: str):
    pe = ProgressEvent(progress_id)
    return flask.Response(pe.event_progress(), mimetype="text/event-stream")
