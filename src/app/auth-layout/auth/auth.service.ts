import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { User } from "./user.model";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";

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

    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;

    constructor(private http: HttpClient, private router: Router){}

    signup(email: string, password: string){
       return this.http.post<AuthResponseData>(
           'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
            {
                email: email,
                password: password,
                returnSecureToken: true,
            }
            // with this.handleError, we're telling RxJS "Hey, if there's an error, use this function to handle it.
        ) .pipe(catchError(this.handleError), tap( responseData =>{
            // this.handleUser(), we're directly invoking the function for every successful response.
                this.handleUser(responseData.email, responseData.localId, responseData.idToken, +responseData.expiresIn)
            }
        ))
    }

    login(email: string, password: string){
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
        {
            email: email,
            password: password,
            returnSecureToken: true,
        }
        ) .pipe(catchError(this.handleError), tap( responseData =>{
            this.handleUser(responseData.email, responseData.localId, responseData.idToken, +responseData.expiresIn)
        }
    ))
    }

    autoLogin(){
        const userData:{
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        if(!userData){
            return;
        }
        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
        if(loadedUser.token){
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    autoLogout(expirationDuration: number){
        this.tokenExpirationTimer = setTimeout(()=>{
            this.logout();
        }, expirationDuration);
    }


    logout(){
        this.user.next(null);   
        // since we're not redirecting just in one place (header component, and auto logout) so we navigate away in auth service
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if(this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }


    private handleUser(email:string, userId: string, token: string, expiresIn:number){
        const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
        const user = new User(email, userId, token, expirationDate);
        this.user.next(user);
        this.autoLogout(expiresIn * 1000)
        localStorage.setItem('userData', JSON.stringify(user));
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