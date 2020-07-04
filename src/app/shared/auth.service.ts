import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, FirebaseLoginResponse } from './interfaces';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  get token(): string {
    const expDate = new Date(localStorage.getItem('fb-token-exp'));
    if (new Date() > expDate) {
      this.logout()
      return null;
    }
    return localStorage.getItem('fb-token');
  }

  public get userName(): string {
    let name = localStorage.getItem('fb-username');
    name = name.length > 0 ? name : null;
    const email = localStorage.getItem('fb-email');

    return name ?? email ?? 'anon';
  }

  login(user: User): Observable<any> {
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
      .pipe(
        tap(this.setToken)
      );
  }

  private setToken(response: FirebaseLoginResponse | null) {
    if (response) {
      const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000);
      localStorage.setItem('fb-token', response.idToken);
      localStorage.setItem('fb-token-exp', expDate.toString());
      localStorage.setItem('fb-username', response.displayName)
      localStorage.setItem('fb-email', response.email)
    } else {
      localStorage.clear();
    }
  }

  public logout(): void {
    localStorage.clear();
  }

  public isAuthenticated(): boolean {
    // return false;
    return !!this.token;
  }
}
