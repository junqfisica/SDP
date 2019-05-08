import random
import secrets
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


