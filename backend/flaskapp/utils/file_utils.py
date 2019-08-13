# Util methods to handle files.
import os
import shutil
import tarfile
import tempfile
from typing import List
from zipfile import ZipFile


def get_file_extension(file_name: str) -> str:
    """
    Get the file extension,

        file.jpg returns jpg

        file returns ""

    :param file_name: The name of the file, expects to be a string.

    :return: The file extension
    """
    try:
        split_name = file_name.split(".")
        if len(split_name) < 2:
            return ""
        return split_name.pop(-1)
    except IndexError:
        return ""


def zip_files(file_paths: List[str], output_path: str = None) -> str:
    """
    Compress a list of files into a zip file. If output_path is not given it will be
    saved as a temporary file.

    :param file_paths: The list of files path to be compressed.

    :param output_path: (Optional) The output file path.

    :return: The path of the compressed zip file.
    """
    if not output_path:
        tmp_file = tempfile.NamedTemporaryFile(suffix=".zip")
        output_path = tmp_file.name
        tmp_file.close()

    with ZipFile(file=output_path, mode='w') as zf:
        for file_path in file_paths:
            filename = os.path.basename(file_path)
            zf.write(filename=file_path, arcname=filename)

    return output_path


def tar_files(file_paths: List[str], output_path: str = None) -> str:
    """
    Compress a list of files into a tar file. If output_path is not given it will be
    saved as a temporary file.

    :param file_paths: The list of files path to be compressed.

    :param output_path: (Optional) The output file path.

    :return: The path of the compressed tar file.
    """
    if not output_path:
        tmp_file = tempfile.NamedTemporaryFile(suffix=".tar")
        output_path = tmp_file.name
        tmp_file.close()

    with tarfile.open(name=output_path, mode='w') as tf:
        for file_path in file_paths:
            filename = os.path.basename(file_path)
            tf.add(name=file_path, arcname=filename)

    return output_path


def archive_dir(dir_path: str, file_format: str, output_path: str = None):
    """
    Compress a directory into a file_format file. If output_path is not given it will be
    saved as a temporary file.

    :param dir_path: The directory path to be compressed.

    :param file_format: str one of "zip", "tar", "gztar", "bztar", or "xztar".

    :param output_path: (Optional) The output file path.

    :return: The path of the compressed file.
    """
    if not output_path:
        tmp_file = tempfile.NamedTemporaryFile()
        output_path = tmp_file.name
        tmp_file.close()
    else:
        file_ext = get_file_extension(file_name=output_path)
        output_path = output_path.replace("." + file_ext, "")
    shutil.make_archive(output_path, format=file_format, root_dir=dir_path)
    return output_path


def is_dir_online(dir_path: str):
    """
    Check is is dir and if exists.

    :param dir_path: The directory full path.

    :return: True if is a dir and exists, false otherwise.
    """
    if os.path.isdir(dir_path) and os.path.exists(dir_path):
        return True
    else:
        return False
