import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsTokenValid } from './store/auth.selectors';
import { take, map } from 'rxjs/operators';
import { auth_prefix } from './auth.model';
import { AuthService } from './services/auth.service';



export const AuthGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  const redirectStorage = inject(AuthService);
  
  return store.select(selectIsTokenValid).pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      } else {
        // 💾 зберігаємо URL, куди хотіли зайти
        // 
        
        const save_url = state.url
        
        if (redirectStorage.isAuthPath(state.url)) {
          redirectStorage.set(state.url);
        } else{
          redirectStorage.set('');
        }
      
        router.navigate([auth_prefix+'/login']);
        return false;
      }
    })
  );
};
