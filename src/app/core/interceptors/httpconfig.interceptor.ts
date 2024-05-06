import {Injectable} from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';

import {Observable, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {AuthService} from "../../services/auth.service";

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: string = localStorage.getItem('access_token');
    if (token) {
      request = request.clone({headers: request.headers.set('Authorization', 'Bearer ' + token)});
    }

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        return event;
      }),
      /*catchError((err) => {
       /!* if (err instanceof HttpErrorResponse) {
          if (err.error instanceof ErrorEvent) {
            /!*console.error('Error Event');
            this.authService.showErrorDialogBox(err.error);*!/
          } else {
            /!*console.log(`error status : ${err.status} ${err.statusText}`);
            *!/
            switch (err.status) {
              case 401:
                // auto logout if 401 response returned from api
                this.authService.showErrorDialogBox(err.error.error);
                if (!err.error) {
                  this.authService.logout();
                }
                break;
              case 403:
                // auto logout if 403 response returned from api
                this.authService.logout();
                location.reload();
                break;
            }
          }
        } else {
          console.error('some thing else happened');
        }*!/
        const error = err.error.message || err.statusText;
        return throwError(error);
      })*/
    );
  }
}
