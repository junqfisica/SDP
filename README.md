# SDP
Seismic Data of Potsdam 

This is a web app to manage and release to the public the seismic data hosted by the Potsdam University.

##### When clone this repository, two files need to be added. Those files contain sensitive information and are not being tracked by git.

* Create a Geokey.txt file in extensions. Inside the file put your key for the Geocode service.

* Create a config_ssh.py file in flaskapp.

    
    In config_ssh.py file add the classes to configure access to servers, ie:

    class ConfigSSHTest:
        REMOTE_IP = "ip"
        USER = "user"
        PSW = "psw"
    
    
    class ConfigSSHWhiteDwarf:
        REMOTE_IP = "ip"
        USER = "user"
        PSW = "psw"   
