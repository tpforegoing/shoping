import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthActions } from './auth.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
// import { AuthToken, User } from '../auth.model';
import { isValidAuthToken } from '../utils/auth.utils';
import { auth_prefix } from '../auth.model';
import { selectAuthToken } from './auth.selectors';
import { Store } from '@ngrx/store';

@Injectable()
export class AuthEffects {
  
  authenticateSuccess$ = createEffect(() => {
    const actions$ = inject(Actions);
    const router = inject(Router);
  
    return actions$.pipe(
      ofType(AuthActions.authenticateSuccess),
      tap(() => {
        const redirectUrl = localStorage.getItem('redirectAfterLogin') || '/';
        // console.log('[Effect Auth Success] redirectUrl', redirectUrl);
        localStorage.removeItem('redirectAfterLogin');
        router.navigateByUrl(redirectUrl);
      })
    );
  }, { dispatch: false });

  login$ = createEffect(() => {
    const actions$ = inject(Actions);
    const authService = inject(AuthService);
  
    return actions$.pipe(
      ofType(AuthActions.loginStart),
      switchMap(({ username, password }) =>
        authService.login(username, password).pipe(
          tap((res) => {
            // console.log('[EFFECT] login success response', res);
            localStorage.setItem('authData', JSON.stringify(res));
          }),
          map((res) =>
            AuthActions.authenticateSuccess({
              token: res.token,
              expiry: res.expiry,
              user: res.user,
            })
          ),
          catchError((error) =>
            of(AuthActions.authenticateFail({ error: error.message || 'Login failed' }))
          )
        )
      )
    );
  });
  

  signup$ = createEffect(() => {
    // const actions$ = inject(Actions);
    const authService = inject(AuthService);
    return inject(Actions).pipe(
      ofType(AuthActions.signupStart),
      switchMap(({ username, password }) =>
        authService.signup(username, password).pipe(
          tap((res) => {
            localStorage.setItem('authData', JSON.stringify(res));
          }),
          map((res) =>
            AuthActions.authenticateSuccess({
              token: res.token,
              expiry: new Date(res.expiry),
              user: res.user,
            })
          ),
          catchError((error) =>
            of(
              AuthActions.authenticateFail({
                error: error.message || 'Signup failed',
              })
            )
          )
        )
      )
    );
  });

  autoLogin$ = createEffect(() => {
    // const actions$ = inject(Actions);
    const authService = inject(AuthService);
    return inject(Actions).pipe(
      ofType(AuthActions.autoLogin),
      map(() => {
        const stored = localStorage.getItem('authData');
        // console.log('[EFFECT] autoLogin triggered', stored); // 🧪
        if (!stored) return AuthActions.clearError()

        try {
          const parsed = JSON.parse(stored);
          if (!isValidAuthToken(parsed)) {
            localStorage.removeItem('authData');
            return AuthActions.logout();
          }
          const expiry = new Date(parsed.expiry); // ⬅️ привести до типу Date
          // console.log('[AUTOLOGIN] Token expired', expiry);
          if (expiry <= new Date()) {
            console.log('[AUTOLOGOUT] Session expired');
            localStorage.removeItem('authData');
            return AuthActions.logout();
          }
          const expirationDuration = expiry.getTime() - new Date().getTime();
          authService.setAuthTimer(expirationDuration);

          return AuthActions.authenticateSuccess({
            token: parsed.token,
            user: parsed.user,
            expiry: parsed.expiry,
          });
        } catch {
          return AuthActions.logout();
        }
      })
    );
  });

  logout$ = createEffect(() => {
    const actions$ = inject(Actions);
    const authService = inject(AuthService);
    const router = inject(Router);
    const store = inject(Store);
  
    return actions$.pipe(
      ofType(AuthActions.logout, AuthActions.logoutAll),
      // withLatestFrom(store.select(selectAuthToken)),
      // filter(([_, token]) => !!token), // 🔒 не викликаємо logout без токена
      switchMap(() =>
        authService.logout().pipe(
          tap(() => {
            localStorage.removeItem('authData');
            router.navigate([auth_prefix+'/login']);
          }),
          catchError((error) => {
            // console.error('[EFFECT] logout error', error);
            // все одно чистимо localStorage і переходимо
            localStorage.removeItem('authData');

            router.navigate([auth_prefix+'/login']);
            return of(); // no follow-up action
          })
        )
      )
    );
  }, { dispatch: false });
  
}
