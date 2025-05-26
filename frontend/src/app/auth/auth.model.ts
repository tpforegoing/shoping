export const auth_prefix = 'auth';

export interface UserAuthLoginModel{
    username: string;
    password: string;
}

export interface UserAuthRegisterModel{
    username: string; 
    email: string; 
    password: string
}

export interface AuthToken{
    expiry: Date;
    token: string;
    user: {'username': string, 'role': string}
}

// new model user
export class User{
    constructor(
        public username: string,
        public role: string,
        private _token: string,
        private _tokenExpirationDate: Date
    ){}

    get token(){
        if(!this._tokenExpirationDate || new Date() > this._tokenExpirationDate){
            return null
        }
        return this._token;
    }
}