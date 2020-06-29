CREATE USER sdp WITH
    LOGIN
    NOSUPERUSER
    NOCREATEDB
    NOCREATEROLE
    INHERIT
    NOREPLICATION
    CONNECTION LIMIT -1
    PASSWORD 'sdp';
    
CREATE DATABASE sdp
    WITH 
    OWNER = sdp
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;

create schema SDP;
grant all privileges on schema SDP to SDP;

create table SDP.S_RIGHTS
(
    RIGHT_ID varchar(50) not null,
    LABEL varchar(100) not null,
    primary key (RIGHT_ID)
);
grant all privileges on table SDP.S_RIGHTS to SDP;

insert into SDP.S_RIGHTS values ('RIGHT_USER','View users');
insert into SDP.S_RIGHTS values ('RIGHT_USER_CREATE','Create users');
insert into SDP.S_RIGHTS values ('RIGHT_USER_EDIT','Edit users');
insert into SDP.S_RIGHTS values ('RIGHT_USER_DELETE','Delete users');
insert into SDP.S_RIGHTS values ('RIGHT_DATA_UPLOAD','Upload data');
insert into SDP.S_RIGHTS values ('RIGHT_FDSN_CREATE','Create FDSN metadata');
insert into SDP.S_RIGHTS values ('RIGHT_FDSN_DELETE','Delete FDSN metadata');
insert into SDP.S_RIGHTS values ('RIGHT_FDSN_EDIT','Edit FDSN metadata');
insert into SDP.S_RIGHTS values ('RIGHT_RSYNC_DOWNLOAD','Can download a rsync bash');

create table SDP.S_ROLES
(
    ROLE_ID varchar(50) not null,
    LABEL varchar(50) not null,
    primary key (ROLE_ID)
);
grant all privileges on table SDP.S_ROLES to SDP;

insert into SDP.S_ROLES values ('ROLE_USER','User');
insert into SDP.S_ROLES values ('ROLE_ADMIN','Admin');

create table SDP.T_ROLES_RIGHTS
(
    ROLE_ID varchar(50) not null,
    RIGHT_ID varchar(50) not null,
    primary key (ROLE_ID, RIGHT_ID),
    foreign key (ROLE_ID) references SDP.S_ROLES (ROLE_ID) on delete restrict,
    foreign key (RIGHT_ID) references SDP.S_RIGHTS (RIGHT_ID) on delete restrict
);
grant all privileges on table SDP.T_ROLES_RIGHTS to SDP;

insert into SDP.T_ROLES_RIGHTS values ('ROLE_ADMIN','RIGHT_USER');
insert into SDP.T_ROLES_RIGHTS values ('ROLE_ADMIN','RIGHT_USER_CREATE');
insert into SDP.T_ROLES_RIGHTS values ('ROLE_ADMIN','RIGHT_USER_EDIT');
insert into SDP.T_ROLES_RIGHTS values ('ROLE_ADMIN','RIGHT_USER_DELETE');
insert into SDP.T_ROLES_RIGHTS values ('ROLE_ADMIN','RIGHT_DATA_UPLOAD');
insert into SDP.T_ROLES_RIGHTS values ('ROLE_ADMIN','RIGHT_FDSN_CREATE');
insert into SDP.T_ROLES_RIGHTS values ('ROLE_ADMIN','RIGHT_FDSN_DELETE');
insert into SDP.T_ROLES_RIGHTS values ('ROLE_ADMIN','RIGHT_FDSN_EDIT');
insert into SDP.T_ROLES_RIGHTS values ('ROLE_ADMIN','RIGHT_RSYNC_DOWNLOAD');

create table SDP.T_USER (
	ID varchar(16) not null, 
	NAME varchar(50) not null, 
	PASSWORD varchar(80) not null, 
	SURNAME varchar(50) not null, 
	USERNAME varchar(50) not null unique, 
	primary key (ID)
);
grant all privileges on table SDP.T_USER to SDP;

insert into SDP.T_USER values ('A7BU1ZBUgL','Thiago', '$2b$12$3BuLlTO02cb61trmjZOC4OikAq6v.C6tK9cwd0dz.osvRTgL0IrjO', 'Junqueira', 'admin');
insert into SDP.T_USER values ('B7BU2ZBUgL','Julia', '$2b$12$3BuLlTO02cb61trmjZOC4OikAq6v.C6tK9cwd0dz.osvRTgL0IrjO', 'Sammler', 'july');

create table SDP.T_ACCESS_TOKENS (
	ID varchar(16) not null,
	EXPIRY timestamp, 
	TOKEN varchar(255) not null, 
	USER_ID varchar(16) not null, 
	primary key (ID, TOKEN),
	foreign key (USER_ID) references SDP.T_USER (ID) on delete restrict
);
grant all privileges on table SDP.T_ACCESS_TOKENS to SDP;


create table SDP.T_USER_ROLES (
    USER_ID varchar(16) not null,
    ROLE_ID varchar(50) not null,
    LASTCHANGE_BY varchar(16),
    LASTCHANGE_AT timestamp,
    primary key (USER_ID, ROLE_ID),
    foreign key (USER_ID) references SDP.T_USER (ID) on delete restrict,
    foreign key (ROLE_ID) references SDP.S_ROLES (ROLE_ID) on delete restrict
);
grant all privileges on table SDP.T_USER_ROLES to SDP;

insert into SDP.T_USER_ROLES values ('A7BU1ZBUgL','ROLE_ADMIN');
insert into SDP.T_USER_ROLES values ('A7BU1ZBUgL','ROLE_USER');
insert into SDP.T_USER_ROLES values ('B7BU2ZBUgL','ROLE_USER');

create table SDP.T_USER_RIGHTS
(
    USER_ID varchar(16) not null,
    RIGHT_ID varchar(50) not null,
    LASTCHANGE_BY varchar(16),
    LASTCHANGE_AT timestamp,
    primary key (USER_ID, RIGHT_ID),
    foreign key (USER_ID) references SDP.T_USER (ID) on delete restrict,
    foreign key (RIGHT_ID) references SDP.S_RIGHTS (RIGHT_ID) on delete restrict
);
grant all privileges on table SDP.T_USER_RIGHTS to SDP;

insert into SDP.T_USER_RIGHTS values ('A7BU1ZBUgL','RIGHT_USER_CREATE');
insert into SDP.T_USER_RIGHTS values ('A7BU1ZBUgL','RIGHT_USER_DELETE');
insert into SDP.T_USER_RIGHTS values ('A7BU1ZBUgL','RIGHT_USER_EDIT');
insert into SDP.T_USER_RIGHTS values ('A7BU1ZBUgL','RIGHT_USER');
insert into SDP.T_USER_RIGHTS values ('A7BU1ZBUgL','RIGHT_DATA_UPLOAD');
insert into SDP.T_USER_RIGHTS values ('A7BU1ZBUgL','RIGHT_FDSN_DELETE');
insert into SDP.T_USER_RIGHTS values ('A7BU1ZBUgL','RIGHT_FDSN_CREATE');
insert into SDP.T_USER_RIGHTS values ('A7BU1ZBUgL','RIGHT_FDSN_EDIT');
insert into SDP.T_USER_RIGHTS values ('A7BU1ZBUgL','RIGHT_RSYNC_DOWNLOAD');

create table SDP.T_APPLICATION_PARAMS
(
    PARAM_ID varchar(50) not null,
    LABEL varchar(100) not null,
    PARAM_VALUE varchar(200) not null,
    primary key (PARAM_ID)
);
grant all privileges on table SDP.T_APPLICATION_PARAMS to SDP;

insert into SDP.T_APPLICATION_PARAMS values ('uploadFolder','Root directory to upload data', '/media/junqueira/DATA/test_sdp_data_transfer');

create table SDP.T_TARGET_FOLDERS
(
    ID varchar(16) not null,
    PATH varchar(400) not null,
    ACTIVE boolean not null,
    primary key (ID)
);
grant all privileges on table SDP.T_TARGET_FOLDERS to SDP;

insert into SDP.T_TARGET_FOLDERS values ('test1234','/media/junqueira/DATA/test_sdp_data_storage', true);

create table SDP.T_NETWORKS
(
    ID varchar(5) not null,
    DESCRIPTION varchar(500),
    primary key (ID)
);
grant all privileges on table SDP.T_NETWORKS to SDP;

insert into SDP.T_NETWORKS values ('ST','Network station ST.');


create table SDP.S_EQUIPMENT_TYPE
(
    TYPE_ID varchar(50) not null,
    DESCRIPTION varchar(200),
    primary key (TYPE_ID)

);
grant all privileges on table SDP.S_EQUIPMENT_TYPE to SDP;

insert into SDP.S_EQUIPMENT_TYPE values ('Datalogger', 'Data logger type.');
insert into SDP.S_EQUIPMENT_TYPE values ('Sensor', 'Sensore Type');

create table SDP.S_EQUIPMENT
(
    ID varchar(16) not null,
    TYPE  varchar(50) not null,
    MANUFACTORY  varchar(50) not null,
    NAME  varchar(100) not null unique,
    DESCRIPTION varchar(200),    
    primary key (ID),
    foreign key (TYPE) references SDP.S_EQUIPMENT_TYPE (TYPE_ID) on delete restrict

);
grant all privileges on table SDP.S_EQUIPMENT to SDP;

insert into SDP.S_EQUIPMENT values ('hjsuaier','Datalogger', 'DiGOS/Omnirecs','DATACUBE','');
insert into SDP.S_EQUIPMENT values ('hjfsaior','Sensor', 'Lennartz','LE-3D/5s','');

create table SDP.T_STATIONS
(
    ID varchar(16) not null,
    NETWORK_ID varchar(5) not null,
    NAME  varchar(5) not null,
    LATITUDE numeric not null,
    LONGITUDE numeric not null,
    ELEVATION numeric not null,
    DEPTH numeric not null,
    CREATION_DATE date not null,
    REMOVAL_DATE date,
    PUBLIC_DATA boolean not null,
    SITE varchar(100),
    GEOLOGY varchar(50),
    PROVINCE varchar(100),
    COUNTRY varchar(100),
    primary key (ID),
    foreign key (NETWORK_ID) references SDP.T_NETWORKS (ID) on delete restrict

);
grant all privileges on table SDP.T_STATIONS to SDP;

insert into SDP.T_STATIONS values ('ghyWoC46','ST','04A','-25.48','-64.39','607','0.6','2016/159','2017/226',False);

create table SDP.T_LOCATIONS
(
    ID varchar(16) not null,
    STATION_ID varchar(16) not null,
    NAME  varchar(5) not null,
    LATITUDE numeric not null,
    LONGITUDE numeric not null,
    ELEVATION numeric not null,
    DEPTH numeric not null,
    primary key (ID),
    foreign key (STATION_ID) references SDP.T_STATIONS (ID) on delete restrict
 
);
grant all privileges on table SDP.T_LOCATIONS to SDP;

insert into SDP.T_LOCATIONS values ('thiWoC46','ghyWoC46','LOC','-25.48','-64.39','607','0.6');

create table SDP.T_CHANNELS
(
    ID varchar(16) not null,
    STATION_ID varchar(16) not null,
    LOCATION_ID varchar(16) not null,
    NAME  varchar(5) not null,
    LATITUDE numeric not null,
    LONGITUDE numeric not null,
    ELEVATION numeric not null,
    DEPTH numeric not null,
    AZIMUTH numeric not null,
    DIP numeric not null,
    GAIN varchar(50) not null,
    SAMPLE_RATE integer not null,
    DL_NO varchar(16) not null,
    SENSOR_NUMBER varchar(16) not null,
    START_TIME timestamptz not null,
    STOP_TIME timestamptz not null,
    primary key (ID),
    foreign key (STATION_ID) references SDP.T_STATIONS (ID) on delete restrict,
    foreign key (LOCATION_ID) references SDP.T_LOCATIONS (ID) on delete restrict
    
);
grant all privileges on table SDP.T_CHANNELS to SDP;

insert into SDP.T_CHANNELS values ('test1234','ghyWoC46','thiWoC46', 'HHZ','-25.48','-64.39','607','0.6','0.0','0.0','1',100,'ARZ','GP12','2016/159','2017/098');

create table SDP.T_CHANNELS_EQUIPMENTS
(
    CHANNEL_ID varchar(16) not null,
    EQUIPMENT_ID varchar(16) not null,
    primary key (CHANNEL_ID,EQUIPMENT_ID),
    foreign key (CHANNEL_ID) references SDP.T_CHANNELS (ID) on delete restrict,
    foreign key (EQUIPMENT_ID) references SDP.S_EQUIPMENT (ID) on delete restrict
    
);
grant all privileges on table SDP.T_CHANNELS_EQUIPMENTS to SDP;

insert into SDP.T_CHANNELS_EQUIPMENTS values ('test1234','hjsuaier');
insert into SDP.T_CHANNELS_EQUIPMENTS values ('test1234','hjfsaior');

create table SDP.S_TRANSFERRED_STATUS (
    ID varchar(16) not null,
    DESCRIPTION varchar(200),
    primary key (ID)
);
insert into SDP.S_TRANSFERRED_STATUS values ('Transferred','File was succefully tranfered to the storage area.');
insert into SDP.S_TRANSFERRED_STATUS values ('Deleted','File was removed from the storage area.');
insert into SDP.S_TRANSFERRED_STATUS values ('Merged','File was merged with other streams.');

grant all privileges on table SDP.S_TRANSFERRED_STATUS to SDP;

create table SDP.T_TRANSFERRED_FILES (
    ID varchar(50) not null,
    STATUS_ID varchar(16) not null,
    TRANSFERRED_BY varchar(50) not null,
    TRANSFERRED_AT timestamp not null,
    primary key (ID),
    foreign key (STATUS_ID) references SDP.S_TRANSFERRED_STATUS (ID) on delete restrict
);
grant all privileges on table SDP.T_TRANSFERRED_FILES to SDP;

create table SDP.T_SEISMIC_DATA (
    ID varchar(16) not null,
    FILENAME varchar(50) not null,
    RELATIVE_PATH varchar(400) not null,
    TARGET_FOLDER_ID varchar(16) not null,
    START_TIME timestamptz not null,
    STOP_TIME timestamptz not null,
    CHANNEL_ID varchar(16) not null,
    primary key (ID),
    foreign key (TARGET_FOLDER_ID) references SDP.T_TARGET_FOLDERS (ID) on delete restrict,
    foreign key (CHANNEL_ID) references SDP.T_CHANNELS (ID) on delete restrict
);
grant all privileges on table SDP.T_SEISMIC_DATA to SDP;

create table SDP.T_FILES_DATA
(
    DATA_ID varchar(16) not null,
    FILE_ID varchar(50) not null,
    primary key (DATA_ID,FILE_ID),
    foreign key (DATA_ID) references SDP.T_SEISMIC_DATA (ID) on delete restrict,
    foreign key (FILE_ID) references SDP.T_TRANSFERRED_FILES (ID) on delete restrict
    
);
grant all privileges on table SDP.T_FILES_DATA to SDP;


create table SDP.T_STATION_ATTACHED (
    ID varchar(16) not null,
    FILENAME varchar(50) not null,
    RELATIVE_PATH varchar(400) not null,
    TARGET_FOLDER_ID varchar(16) not null,
    STATION_ID varchar(16) not null,
    primary key (ID),
    foreign key (TARGET_FOLDER_ID) references SDP.T_TARGET_FOLDERS (ID) on delete restrict,
    foreign key (STATION_ID) references SDP.T_STATIONS (ID) on delete restrict
);
grant all privileges on table SDP.T_STATION_ATTACHED to SDP;

