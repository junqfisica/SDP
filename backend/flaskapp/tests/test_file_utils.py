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
