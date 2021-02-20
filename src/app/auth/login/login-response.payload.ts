/**
 * A class of json web token string that is bound to every http request made by connected
 * user in order to identify him in backend
 */
export interface LoginResponse {
    token: string;
}
