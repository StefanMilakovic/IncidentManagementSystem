import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject, catchError, of, map, shareReplay } from 'rxjs';
import {environment} from '../../environments/environment';

export interface CurrentUser {
  id: number;
  email: string;
  name: string;
  role: 'USER' | 'MODERATOR';
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly BASE_URL = environment.apiUrl;
  private readonly API_URL = `${this.BASE_URL}/auth`;
  private readonly OAUTH_URL = environment.oauthUrl;
  //private readonly API_URL = 'http://localhost:8080/api/v1/auth';

  private loggedInSubject = new BehaviorSubject<boolean>(false);
  private currentUserRoleSubject = new BehaviorSubject<string | null>(null);
  private currentUserCache$: Observable<CurrentUser | null> | null = null;

  constructor(private http: HttpClient) {}

  loginWithGoogle(): void {
    window.location.href = this.OAUTH_URL;
  }

  fetchCurrentUser(): Observable<CurrentUser | null> {
    if (this.currentUserCache$) {
      return this.currentUserCache$;
    }

    this.currentUserCache$ = this.http
      .get<CurrentUser>(`${this.API_URL}/current-user`, { withCredentials: true })
      .pipe(
        map(user => {
          this.loggedInSubject.next(true);
          this.currentUserRoleSubject.next(user.role);
          return user;
        }),
        catchError(err => {
          this.loggedInSubject.next(false);
          this.currentUserRoleSubject.next(null);
          this.currentUserCache$ = null;
          return of(null);
        }),
        shareReplay({ bufferSize: 1, refCount: false })
      );

    return this.currentUserCache$;
  }

  isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }

  hasRole(...allowedRoles: string[]): boolean {
    const role = this.currentUserRoleSubject.value;
    if (!role) return false;
    return allowedRoles.some(r => r.toUpperCase() === role.toUpperCase());
  }

  logout(): Observable<void> {
    return this.http.post(`${this.API_URL}/logout`, {}, {
      withCredentials: true,
      responseType: 'text' as 'json'
    }).pipe(
      tap(() => {
        this.loggedInSubject.next(false);
        this.currentUserRoleSubject.next(null);
        this.currentUserCache$ = null;
      }),
      map(() => void 0)
    );
  }
}
