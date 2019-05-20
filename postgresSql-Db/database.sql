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
insert into SDP.S_RIGHTS values ('RIGHT_DATA_UPLOAD','Can upload data');

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

create table SDP.T_APPLICATION_PARAMS
(
    PARAM_ID varchar(50) not null,
    LABEL varchar(100) not null,
    PARAM_VALUE varchar(200) not null,
    primary key (PARAM_ID)
);
grant all privileges on table SDP.T_APPLICATION_PARAMS to SDP;

insert into SDP.T_APPLICATION_PARAMS values ('uploadFolder','Root directory to upload data', '/media/junqueira/DATA/test_sdp_data_transfer');

create table SDP.T_NETWORKS
(
    ID varchar(5) not null,
    DESCRIPTION varchar(500),
    primary key (ID)
);
grant all privileges on table SDP.T_NETWORKS to SDP;

insert into SDP.T_NETWORKS values ('ST','Network station ST.');


create table SDP.S_EQUIPMENT_TAGS
(
    TAG_ID varchar(50) not null,
    DESCRIPTION varchar(200),
    primary key (TAG_ID)

);
grant all privileges on table SDP.S_EQUIPMENT_TAGS to SDP;

insert into SDP.S_EQUIPMENT_TAGS values ('Datalogger_Typ', 'Data logger type.');
insert into SDP.S_EQUIPMENT_TAGS values ('DL_No', '');
insert into SDP.S_EQUIPMENT_TAGS values ('Sensor_Number', 'Sensor number');
insert into SDP.S_EQUIPMENT_TAGS values ('Sensor_Typ', 'Sensor type');

create table SDP.S_EQUIPMENTS
(
    ID varchar(16) not null,
    TAG  varchar(50) not null,
    DESCRIPTION varchar(200),    
    primary key (ID),
    foreign key (TAG) references SDP.S_EQUIPMENT_TAGS (TAG_ID) on delete restrict

);
grant all privileges on table SDP.S_EQUIPMENTS to SDP;

insert into SDP.S_EQUIPMENTS values ('Cube3ext','Datalogger_Typ');
insert into SDP.S_EQUIPMENTS values ('A8S','DL_No');
insert into SDP.S_EQUIPMENTS values ('A2M','DL_No');
insert into SDP.S_EQUIPMENTS values ('AHG','DL_No');
insert into SDP.S_EQUIPMENTS values ('AHH','DL_No');
insert into SDP.S_EQUIPMENTS values ('A8T','DL_No');
insert into SDP.S_EQUIPMENTS values ('AAA','DL_No');
insert into SDP.S_EQUIPMENTS values ('AAB','DL_No');
insert into SDP.S_EQUIPMENTS values ('A2K','DL_No');
insert into SDP.S_EQUIPMENTS values ('AAC','DL_No');
insert into SDP.S_EQUIPMENTS values ('A2L','DL_No');
insert into SDP.S_EQUIPMENTS values ('AJL','DL_No');
insert into SDP.S_EQUIPMENTS values ('ARZ','DL_No');
insert into SDP.S_EQUIPMENTS values ('AJK','DL_No');
insert into SDP.S_EQUIPMENTS values ('A8R','DL_No');
insert into SDP.S_EQUIPMENTS values ('AHF','DL_No');
insert into SDP.S_EQUIPMENTS values ('AST','DL_No');
insert into SDP.S_EQUIPMENTS values ('GP01','Sensor_Number');
insert into SDP.S_EQUIPMENTS values ('GP02','Sensor_Number');
insert into SDP.S_EQUIPMENTS values ('GP03','Sensor_Number');
insert into SDP.S_EQUIPMENTS values ('GP04','Sensor_Number');
insert into SDP.S_EQUIPMENTS values ('GP05','Sensor_Number');
insert into SDP.S_EQUIPMENTS values ('GP06','Sensor_Number');
insert into SDP.S_EQUIPMENTS values ('GP07','Sensor_Number');
insert into SDP.S_EQUIPMENTS values ('GP08','Sensor_Number');
insert into SDP.S_EQUIPMENTS values ('GP09','Sensor_Number');
insert into SDP.S_EQUIPMENTS values ('GP10','Sensor_Number');
insert into SDP.S_EQUIPMENTS values ('GP11','Sensor_Number');
insert into SDP.S_EQUIPMENTS values ('GP12','Sensor_Number');
insert into SDP.S_EQUIPMENTS values ('GP13','Sensor_Number');
insert into SDP.S_EQUIPMENTS values ('GP14','Sensor_Number');
insert into SDP.S_EQUIPMENTS values ('GFZ 20220','Sensor_Number');
insert into SDP.S_EQUIPMENTS values ('LE3D-HH','Sensor_Typ');
insert into SDP.S_EQUIPMENTS values ('L-4C-3D','Sensor_Typ');

create table SDP.T_STATIONS
(
    ID varchar(16) not null,
    NETWORK_ID varchar(5) not null,
    NAME  varchar(16) not null,
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
    foreign key (NETWORK_ID) references SDP.T_NETWORKS (NETWORK) on delete restrict

);
grant all privileges on table SDP.T_STATIONS to SDP;

insert into SDP.T_STATIONS values ('ghyWoC46','ST','04A','-25.48','-64.39','607','0.6','2016/159','2017/226',False);

create table SDP.T_EXPERIMENTS
(
    ID varchar(16) not null,
    STATION_ID varchar(16) not null,
    SAMPLE_RATE integer not null,
    START_TIME date not null,
    STOP_TIME date not null,
    primary key (ID),
    foreign key (STATION_ID) references SDP.T_STATIONS (ID) on delete restrict
    
);
grant all privileges on table SDP.T_EXPERIMENTS to SDP;

insert into SDP.T_EXPERIMENTS values ('test1234','ghyWoC46',100,'2016/159','2017/098');

create table SDP.T_EXPERIMENTS_EQUIPMENTS
(
    EXPERIMENT_ID varchar(16) not null,
    EQUIPMENT_ID varchar(16) not null,
    primary key (EXPERIMENT_ID,EQUIPMENT_ID),
    foreign key (EXPERIMENT_ID) references SDP.T_EXPERIMENTS (ID) on delete restrict,
    foreign key (EQUIPMENT_ID) references SDP.S_EQUIPMENTS (ID) on delete restrict
    
);
grant all privileges on table SDP.T_EXPERIMENTS_EQUIPMENTS to SDP;

insert into SDP.T_EXPERIMENTS_EQUIPMENTS values ('test1234','Cube3ext');
insert into SDP.T_EXPERIMENTS_EQUIPMENTS values ('test1234','A8T');
insert into SDP.T_EXPERIMENTS_EQUIPMENTS values ('test1234','LE3D-HH');
insert into SDP.T_EXPERIMENTS_EQUIPMENTS values ('test1234','GP01');

