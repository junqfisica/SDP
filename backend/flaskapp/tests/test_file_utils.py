import os
from unittest import TestCase

from flaskapp.utils import file_utils


class TestFileUtils(TestCase):

    def test_get_file_extension(self):
        file_name = "file.jpg"
        file_name_2 = "file"
        file_name_3 = "file.test.jpg"
        file_name_4 = ".jpg"
        file_name_5 = "dir/file.jpg"

        ext = file_utils.get_file_extension(file_name)
        ext_2 = file_utils.get_file_extension(file_name_2)
        ext_3 = file_utils.get_file_extension(file_name_3)
        ext_4 = file_utils.get_file_extension(file_name_4)
        ext_5 = file_utils.get_file_extension(file_name_5)

        self.assertEqual(ext, "jpg")
        self.assertEqual(ext_2, "")
        self.assertEqual(ext_3, "jpg")
        self.assertEqual(ext_4, "jpg")
        self.assertEqual(ext_5, "jpg")

    def test_zip_files(self):
        base_dir = "/media/junqueira/DATA/Test_SDP_DATA/ROBO/200Hz"
        output_path = "/media/junqueira/DATA/Test_SDP_DATA/test.zip"
        files = ["exA2M130830_1.pri0", "exA2M130830_2.pri0"]
        files_path = []
        for f in files:
            files_path.append(os.path.join(base_dir, f))
        if os.path.exists(output_path):
            os.remove(output_path)
        # file_utils.zip_files(files_path, output_path)
        print(file_utils.zip_files(files_path))

    def test_archive_dir(self):
        base_dir = "/media/junqueira/DATA/Test_SDP_DATA/ROBO/200Hz"
        output_path = "/media/junqueira/DATA/Test_SDP_DATA/test.zip"
        if os.path.exists(output_path):
            os.remove(output_path)
        # file_utils.archive_dir(base_dir, output_path)
        print(file_utils.archive_dir(base_dir, "tar"))

    def test_tar_files(self):
        base_dir = "/media/junqueira/DATA/Test_SDP_DATA/ROBO/200Hz"
        files = ["exA2M130830_1.pri0", "exA2M130830_2.pri0"]
        files_path = []
        for f in files:
            files_path.append(os.path.join(base_dir, f))

        print(file_utils.tar_files(files_path))
