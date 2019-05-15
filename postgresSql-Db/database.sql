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

create table SDP.S_NETWORKS
(
    NETWORK_ID varchar(16) not null,
    LABEL varchar(500),
    primary key (NETWORK_ID)
);
grant all privileges on table SDP.S_NETWORKS to SDP;

insert into SDP.S_NETWORKS values ('ST','Network stations.');

