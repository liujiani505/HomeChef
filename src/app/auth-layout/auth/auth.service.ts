import { HttpClient } from "@angular/common/http";
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
        ) .pipe(catchError(errorResponse => {
            let errorMessage = "A twist in our culinary tale has occurred. We kindly ask for your patience as we stir things right.";
            if(!errorResponse.error || !errorResponse.error.error){
                return throwError(errorMessage);
            }
            switch (errorResponse.error.error.message) {
                case 'EMAIL_EXISTS':
                    errorMessage = 'This email has already penned its first chapter with us. Care to continue the journey?';
                case 'OPERATION_NOT_ALLOWED':
                    errorMessage = 'For this chapter of our cookbook, password sign-ins have been set aside. Seek alternative ways to embark on the journey.';
                case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                    errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
            }
            return throwError(errorMessage);
        }))
    }

    login(email: string, password: string){
        return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyClMNNk_x30ir7vHvHxBUjR7VIsxdIGo9Y`,
        {
            email: email,
            password: password,
            returnSecureToken: true,
        }
        )
    }
}