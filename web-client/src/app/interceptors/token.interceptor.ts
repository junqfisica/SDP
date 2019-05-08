import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorage } from '../statics/local-storage';
  
export class TokenInterceptor implements HttpInterceptor {

    constructor() { }
  
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const currentUser = LocalStorage.currentUser
        
        if (currentUser) {
            // // Clone the request to add the new header
            // const clonedRequest = req.clone({
            //   headers: req.headers.set('X-Access-Token', currentUser.token)
            // });
            // // Pass the cloned request instead of the original request to the next handle
            // return next.handle(clonedRequest);
            // return next.handle(req.clone({ setHeaders: { 'X-Access-Token': currentUser.token } }));
            return next.handle(req.clone({ setHeaders: { 'X-Access-Token': currentUser.token } }));
          
        } else {
            return next.handle(req);
        }
    }
}