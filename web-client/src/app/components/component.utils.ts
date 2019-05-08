import { NotificationService } from '../services/notification/notification.service';
import { User } from '../model/model.user';
import { LocalStorage } from '../statics/local-storage';

export abstract class ComponentUtils {

    // bsConfig = Object.assign({}, {locale: 'de', containerClass: 'theme-dark-blue', dateInputFormat: 'DD.MM.YYYY'});
    currentUser: User = LocalStorage.currentUser
    
    constructor(private __notificationService: NotificationService) {
  
    }
  
    public showSuccessMessage(message: string) {
      this.__notificationService.showSuccessMessage(message);
    }

    public showWarningMessage(message: string) {
        this.__notificationService.showWarningMessage(message);
    }
  
    public showErrorMessage(message: string) {
      this.__notificationService.showErrorMessage(message);
    }

    protected userHasRole(user: User, role: string): boolean {
        if (user == null) {
          return false;
        }
        if (user.roles != null && user.roles.includes(role)) {
          return true;
        }
        return false;
    }

    protected userHasRight(user: User, right: string): boolean {
      if (user == null) {
        return false;
      }
      if (user.rights != null && user.rights.includes(right)) {
        return true;
      }
      return false;
    }

    public hasRole(role: string): boolean {
        return this.userHasRole(this.currentUser, role);
    }

    public hasRight(right: string): boolean {
      return this.userHasRight(this.currentUser, right);
    }
  }