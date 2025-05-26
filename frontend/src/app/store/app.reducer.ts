import { ActionReducerMap } from '@ngrx/store';
import { authReducer, AuthState } from '../auth/store/auth.reducer';
// import { menuReducer } from '../layout/store/layout.reducer';
// import { MenuState } from '../layout/layout.model';

export interface AppState {
  auth: AuthState;

}

export const appReducers: ActionReducerMap<AppState> = {
  auth: authReducer
};
