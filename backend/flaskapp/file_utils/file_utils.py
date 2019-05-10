# Util methods to handle files.


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
