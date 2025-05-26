import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Store } from '@ngrx/store';
// import { selectAuthToken } from './store/auth.selectors';
import { catchError } from 'rxjs/operators';
import { AuthActions } from './store/auth.actions';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  const raw = localStorage.getItem('authData');
  let token = '';
  // console.log('raw authData:', raw);
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      token = parsed.token.trim();
    } catch (e) {
      console.error('Некоректний JSON', e);
    }
  }
  // console.log('AUTH:', `Token ${token}`);

  const authReq = req.clone({
    headers: req.headers
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Token ' + token),
    withCredentials: true 
  });

  // return next(authReq);
  return next(authReq).pipe(
    catchError(error => {
      if (error.status === 401 && !req.url.includes('/logout')) {
        console.warn('[Interceptor] 401 Unauthorized → logout()');
        store.dispatch(AuthActions.logout());
      }
      return throwError(() => error);
    })
  );
};

