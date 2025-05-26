import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { environment } from '../../../../environments/environment';
import { AuthActions } from '../store/auth.actions';
import { UserAuthLoginModel, AuthToken, auth_prefix } from '../auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = `${environment.apiUrl}`;
  private tokenTimer: any;
  private role = signal<'manager' | 'client'>('client');
  private readonly key = 'redirectAfterLogin';
  private authRoutes = [`/${auth_prefix}/login`, `/${auth_prefix}/signup`];
  
  constructor(private http: HttpClient, private store: Store) {}

  userRole() {
    return this.role;
  }

  login(username: string, password: string): Observable<AuthToken> {
    const body: UserAuthLoginModel = { username, password };
    return this.http.post<AuthToken>(`${this.API_URL}/login/`, body)
  }

  signup(username: string, password: string): Observable<AuthToken> {
    const body: UserAuthLoginModel = { username, password };
    return this.http.post<AuthToken>(`${this.API_URL}/register/`, body);
  }

  setAuthTimer(duration: number) {
    this.clearLogoutTimer();
    this.tokenTimer = setTimeout(() => {
      this.store.dispatch(AuthActions.logout());
    }, duration);
  }

  clearLogoutTimer() {
    if (this.tokenTimer) {
      clearTimeout(this.tokenTimer);
      this.tokenTimer = null;
    }
  }

  logout(): Observable<AuthToken> {
    return this.http.post<AuthToken>(`${this.API_URL}/logout/`, {});
  }
  // зберігаємо шлях url
  isAuthPath(path: string): boolean {;
    return this.authRoutes.includes(path);
  }
  set(path: string) {
    if (!this.get() && !this.isAuthPath(path)) {
      localStorage.setItem(this.key, path);
    }
  }

  get(): string | null {
    return localStorage.getItem(this.key);
  }

  consume(): string {
    const path = this.get() || '/';
    // console.log('consume', path);
    localStorage.removeItem(this.key);
    return path;
  }
}


@Injectable({ providedIn: 'root' })
export class ThemeService {
  private darkMode = signal<boolean>(false);

  toggleTheme() {
    this.darkMode.update(v => !v);
    document.body.classList.toggle('dark-theme', this.darkMode());
  }

  isDarkMode() {
    return this.darkMode;
  }
}
