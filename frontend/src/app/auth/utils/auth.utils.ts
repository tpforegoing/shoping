import { AuthToken } from '../auth.model';

export function isValidAuthToken(obj: any): obj is AuthToken {
  return (
    obj &&
    typeof obj.token === 'string' &&
    typeof obj.expiry === 'string' &&
    obj.user &&
    typeof obj.user.username === 'string'
  );
}
