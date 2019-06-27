import datetime
import threading

from functools import wraps

from flaskapp import app_logger

LOCK_IDS = {}


class LockById:
    def __init__(self, lock_id):
        global LOCK_IDS

        self.lock_id = lock_id

        if lock_id in LOCK_IDS:
            self.lock = LOCK_IDS[lock_id]
        else:
            self.lock = threading.Lock()
            LOCK_IDS[lock_id] = self.lock

    def __enter__(self):
        self.lock.acquire()
        app_logger.info("Lock {} at: {}".format(self.lock_id, datetime.datetime.now()))
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.lock.release()
        LOCK_IDS.pop(self.lock_id, None)
        app_logger.info("Unlock {} at: {}".format(self.lock_id, datetime.datetime.now()))


def lock(lock_id):
    def decorated(func):
        @wraps(func)
        def wrap_func(*args, **kwargs):
            with LockById(lock_id):
                return func(*args, **kwargs)

        return wrap_func
    return decorated
