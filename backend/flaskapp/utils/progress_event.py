from time import sleep

from flask import json, stream_with_context

PROGRESS_IDS = {}


class Message:
    """
      Data that is published as a server-sent event.

    """

    def __init__(self, data, type=None, id=None, retry=None):
        """
        Create a server-sent event.
        :param data: The event data. If it is not a string, it will be
            serialized to JSON using the Flask application's
            :class:`~flask.json.JSONEncoder`.
        :param type: An optional event type.
        :param id: An optional event ID.
        :param retry: An optional integer, to specify the reconnect time for
            disconnected clients of this stream.
        """
        self.data = data
        self.type = type
        self.id = id
        self.retry = retry

    def __str__(self):
        """
        Serialize this object to a string, according to the `server-sent events
        specification <https://www.w3.org/TR/eventsource/>`_.
        """
        msgs = ["data:{}".format(self.data)]
        if self.type:
            msgs.insert(0, "event:{}".format(self.type))
        if self.id:
            msgs.append("id:{}".format(self.id))
        if self.retry:
            msgs.append("retry:{}".format(self.retry))
        return "\n".join(msgs) + "\n\n"


class ProgressEvent:
    def __init__(self, progress_id):
        global PROGRESS_IDS

        self.progress_id = progress_id

        if progress_id in PROGRESS_IDS:
            self.__progress = PROGRESS_IDS[progress_id]
        else:
            self.__progress = 0

    def set_progress(self, value: float):
        PROGRESS_IDS[self.progress_id] = value
        self.__progress = value

    def __enter__(self):
        PROGRESS_IDS[self.progress_id] = 0
        self.__progress = 0
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        PROGRESS_IDS.pop(self.progress_id, None)

    @stream_with_context
    def event_progress(self):
        msg = Message(self.__progress, type="message", id=self.progress_id)
        for i in range(20):
            if self.progress_id in PROGRESS_IDS:
                yield str(msg)
                break
            else:
                # Wait a bit for process to start.
                sleep(0.1)
        else:
            # if loop is break than assume there is no process with this id to be reported anymore.
            msg = Message(100, type="complete", id=self.progress_id)
            yield str(msg)



