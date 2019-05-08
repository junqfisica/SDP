import { User } from '../model/model.user';

export class LocalStorage {
    
    static get currentUser(): User {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        return currentUser
    }

    static removeCurrentUser() {
        localStorage.removeItem('currentUser');
    }

    static saveCurrentUser(currentUser: User){
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
}