import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { UserAuthRegisterModel, UserAuthLoginModel, AuthToken } from '../auth.model';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login Start': props<UserAuthLoginModel>(),
    'Signup Start': props<UserAuthRegisterModel>(),
    'Authenticate Success': props<AuthToken>(),
    'Authenticate Fail': props<{ error: string }>(),
    'Clear Error': emptyProps(),
    'Logout': emptyProps(),
    'Logout Success': emptyProps(),
    'Logout All': emptyProps(),
    'Auto Login': emptyProps(),

  },
});
