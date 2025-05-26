import { createFeature, createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';
import { User } from '../auth.model';

export const authFeatureKey = 'auth';

export interface AuthState  {
  user: User | null;
  error: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export const initialState: AuthState = {
  user: null,
  error: null,
  isAuthenticated: false,
  loading: false,
};

export const authReducer = createReducer(
  initialState,

  on(AuthActions.authenticateSuccess, (state, { token, user, expiry }) => ({
    ...state,
    user: new User(user.username, user.role, token, expiry),
    isAuthenticated: true,
    error: null,
    loading: false,
  })),

  on(AuthActions.authenticateFail, (state, { error }) => ({
    ...state,
    user: null,
    isAuthenticated: false,
    error: error,
    loading: false,
  })),

  on(AuthActions.loginStart, AuthActions.signupStart, (state) => ({
    ...state,
    error: null,
    loading: true,
  })),

  on(AuthActions.clearError, (state) => ({
    ...state,
    error: null,
    loading: false,
  })),

  on(AuthActions.logout, AuthActions.logoutAll, AuthActions.logoutSuccess, () => ({
    ...initialState,
  })),

  on(AuthActions.autoLogin, (state) => ({
    ...state,
    loading: true,
  }))
);

export const authFeature = createFeature({
  name: authFeatureKey,
  reducer: authReducer,
});

