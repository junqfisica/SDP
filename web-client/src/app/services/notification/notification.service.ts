import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class NotificationService {

    private successMessageSource = new Subject<string>();
    successMessage$ = this.successMessageSource.asObservable();
    private warningMessageSource = new Subject<string>();
    warningMessage$ = this.warningMessageSource.asObservable();
    private errorMessageSource = new Subject<string>();
    errorMessage$ = this.errorMessageSource.asObservable();

    constructor() { }

    showSuccessMessage(message: string) {
        this.successMessageSource.next(message);
    }

    showWarningMessage(message: string){
        this.warningMessageSource.next(message);
    }

    showErrorMessage(message: string) {
        this.errorMessageSource.next(message);
    }

}