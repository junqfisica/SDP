import os
import random
import secrets
import shutil
import string

from flaskapp import bcrypt


def generate_id(length):
    """
    Generate a random string with the combination of lowercase and uppercase letters.

    :param length: The size of the id key
    :return: An id of size length formed by lowe and uppercase letters.
    """
    letters = string.ascii_letters
    return "".join(random.choice(letters) for _ in range(length))


def generate_token():
    """
    Creates a token with 32(16-bits) alphanumeric characters.

    :return: A token string.
    """
    return secrets.token_hex(16)


def encrypt_password(psw: str):
    """
    Encrypts a password and return the encrypted string.

    :param psw: The string to be encrypted.
    :return: A encrypted string.
    """
    return bcrypt.generate_password_hash(psw).decode("utf-8")


def get_disk_info(disk_path: str = None):
    """
    Get information about the disk in the given path.

    :param disk_path: Any dir location in the disk. If None, the root dir will be used.

    :return: A tuple with attributes 'total', 'used' and 'free', which are the amount
    of total, used and free space, in gigabytes.
    """
    try:
        total, used, free = shutil.disk_usage(disk_path) if disk_path else shutil.disk_usage(os.path.abspath(os.sep))
    except FileNotFoundError:
        total, used, free = (0., 0., 0.)
    gb = 1. / 2**30  # bites to GB.
    return total * gb, used * gb, free * gb
