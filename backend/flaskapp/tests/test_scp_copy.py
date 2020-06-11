import unittest

from flaskapp.config_test import ConfigSSHTest
from flaskapp.utils.file_utils import ssh_scp, create_rsync_bash


class MyTestCase(unittest.TestCase):

    def setUp(self) -> None:
        self.files_path = "/home/thiago/Documents/3059_001.pdf " \
                          "/home/thiago/Documents/auflosungsvertrag_thiago.pdf"

        self.files_from_server = ["/home/thiago/ST.ROBO20131016190000.HHR",
                                  "/home/thiago/ST.ROBO20131016170000.HHR"]

        self.dir = "/home/thiago/Documents/ROBO-HHR"

    def test_scp(self):
        source = self.files_path
        destine = "{user}@{ip}:".format(user=ConfigSSHTest.USER, ip=ConfigSSHTest.REMOTE_IP)
        print(ssh_scp(source, destine, ConfigSSHTest.PSW))

    def test_scp_2(self):
        source = self.dir
        destine = "{user}@{ip}:".format(user=ConfigSSHTest.USER, ip=ConfigSSHTest.REMOTE_IP)
        print(ssh_scp(source, destine, ConfigSSHTest.PSW))

    def test_create_rsync_bash(self):
        create_rsync_bash(ConfigSSHTest.USER,
                          ConfigSSHTest.REMOTE_IP, ConfigSSHTest.PSW, self.files_from_server,
                          "/home/thiago/Documents/test_here",
                          "/home/thiago/Documents/rsync_python.sh")


if __name__ == '__main__':
    unittest.main()
