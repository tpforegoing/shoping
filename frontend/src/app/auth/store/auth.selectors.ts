import { createFeature } from '@ngrx/store';
import { createSelector } from '@ngrx/store';
import { AuthState, authReducer, authFeatureKey } from './auth.reducer';
import { CLIENT } from '../../store/store.model';


export const authFeature = createFeature<'auth', AuthState>({
  name: authFeatureKey,
  reducer: authReducer,
});

// 🔹 Автоматичні селектори
export const {
  selectAuthState,
  selectUser,
  selectError,
  selectIsAuthenticated,
  selectLoading,
} = authFeature;

// 🔹 Перевірка чи токен ще дійсний (через getter у класі User)
export const selectIsTokenValid = createSelector(
  selectUser,
  (user) => !!user?.token
);

// 🔹 Отримати токен напряму (якщо потрібен для API-запиту)
export const selectAuthToken = createSelector(
  selectUser,
  (user) => user?.token ?? null
);

// 🔹 Отримати username
export const selectUsername = createSelector(
  selectUser,
  (user) => user?.username ?? null
);

export const selectAuthRole = createSelector(
  selectUser,
  (user) => user?.role ?? CLIENT  // або null якщо неавторизований
);