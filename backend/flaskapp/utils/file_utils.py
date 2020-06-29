# Util methods to handle files.
import os
import shlex
import shutil
import subprocess as sp
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


def ssh_scp(source: str, destine: str, psw: str):
    """

    :param source:
    :param destine:
    :param psw:
    :return:
    """

    if os.path.isdir(source):
        cmd = shlex.split("sshpass -p '{pws}' scp -r {source} {destine}".format(pws=psw,
                                                                                source=source, destine=destine))
    else:
        cmd = shlex.split("sshpass -p '{pws}' scp {source} {destine}".format(pws=psw,
                                                                             source=source, destine=destine))
    with sp.Popen(cmd,
                  stdin=sp.PIPE, stdout=sp.PIPE, stderr=sp.PIPE, encoding="utf-8") as p:
        try:
            std_out, std_err = p.communicate(timeout=3600*4)
            print("done", str(std_out))
        except sp.TimeoutExpired as e:
            print("Timeout error", e, p.returncode)
            p.kill()
            std_out, std_err = p.communicate()
        if p.returncode != 0:  # Bad error.
            raise sp.CalledProcessError(p.returncode, std_err)
        elif len(std_err) != 0:  # Some possible errors trowed by the running subprocess, but not critical.
            raise sp.SubprocessError(std_err)
        return std_out


def create_rsync_bash(user: str, host_ip: str, psw: str, files_to_download: List[str], destine=None, output_path=None):
    """
    Create a bash file that uses rsync to download files from server.

    :param user: The server user name.
    :param host_ip: The server ip.
    :param psw: The password for the user.
    :param files_to_download: The list of files paths to download.
    :param destine: The client destination to rsync the files.
    :param output_path: The bash output file path. If none it will create a temp file.
    :return: The bash file path.
    """
    print(output_path)
    file_tag = ""
    if not output_path:
        tmp_file = tempfile.NamedTemporaryFile(suffix=".sh")
        output_path = tmp_file.name
        tmp_file.close()

    if not destine:
        destine = "dest=$(pwd)\n\n"  # get current dir where this bash will run.
    else:
        destine = "dest='{}'\n\n".format(destine)

    with open(output_path, "w") as f:
        f.write("#!/bin/bash\n\n")
        f.write("psw='{}'\n".format(psw))
        f.write("user='{}'\n".format(user))
        f.write("host_ip='{}'\n".format(host_ip))
        f.write(destine)
        for index, path in enumerate(files_to_download):
            f.write("file{}='{}'\n".format(index, path))
            file_tag += ":$file{} ".format(index)
        f.write("\n")
        f.write('rsync -ro -P --rsh="sshpass -p $psw ssh -l $user" $host_ip{}$dest'.format(file_tag))

    return output_path



