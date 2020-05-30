import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
      private auth: AuthService,
      private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.auth.isAuthenticated()) {

      request = request.clone( {
        setParams: {
          // auth: this.auth.token
        }
      });
      // console.log('result request:', request);

    }
    return next.handle(request)
      .pipe(
        catchError( (error: HttpErrorResponse) => {
          console.log('oshibka:', error);
          if (error.status === 401) {
            this.auth.logout();
            // this.router.navigate( ['/admin', 'login'], {
            //   queryParams: {
            //     authFailed: true
            //   }
            // });
          }

          return throwError(error);
        })
      );
  }
}
