import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({providedIn: 'root'})

export class AuthService{

    constructor(private http: HttpClient){}

    signup(email: string, password: string){
       return this.http.post<AuthResponseData>(
           `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=
            AIzaSyClMNNk_x30ir7vHvHxBUjR7VIsxdIGo9Y`, 
            {
                email: email,
                password: password,
                returnSecureToken: true,
            }
        ) .pipe(catchError(this.handleError))
    }

    login(email: string, password: string){
        return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyClMNNk_x30ir7vHvHxBUjR7VIsxdIGo9Y`,
        {
            email: email,
            password: password,
            returnSecureToken: true,
        }
        ) .pipe(catchError(this.handleError))
    }

    private handleError(errorResponse: HttpErrorResponse){
        let errorMessage = "A twist in our culinary tale has occurred. We kindly ask for your patience as we stir things right.";
            if(!errorResponse.error || !errorResponse.error.error){
                return throwError(errorMessage);
            }
            switch (errorResponse.error.error.message) {
                case 'EMAIL_EXISTS':
                    errorMessage = "This email's tale is already penned. Recognize it?";
                break;
                case 'OPERATION_NOT_ALLOWED':
                    errorMessage = 'This chapter bypasses password sign-ins. Seek other paths.';
                break;
                case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                    errorMessage = 'Unusual activity stirred a pause. Reconvene later.';
                break;
                case 'EMAIL_NOT_FOUND':
                    errorMessage = "This email's tale isn't found. Begin anew?";
                break;
                case 'INVALID_PASSWORD':
                    errorMessage = "Mismatched or unwritten password. Retrace steps?";
                break;
                case 'USER_DISABLED':
                    errorMessage = "This account's at rest by our curators. Need help?";
                break;
            }
            return throwError(errorMessage);
    }
}