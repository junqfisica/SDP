export class User {
    id: string;
    token: string;
    username  = '';
    surname = '';
    name = '';
    password = '';
    enabled = true;
    accountNonExpired = true;
    accountNonLocked = true;
    credentialsNonExpired = true;
    roles: string[] = [];
    rights: string[] = [];
    settings: string[] = [];
}