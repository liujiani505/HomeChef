import { Injectable } from "@angular/core";
import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest} from '@angular/common/http'
import { AuthService } from "./auth.service";
import { exhaustMap, take } from "rxjs/operators";


@Injectable()
export class AuthInterceptorService implements HttpInterceptor{

    constructor(private authService: AuthService){}
    intercept(req: HttpRequest<any>, next: HttpHandler){
        return this.authService.user.pipe(
            // we don't want an ongoing subscription,but we still need to subscribe to get the user only once, use pipe and take(1)
            // the observable in exhaustMap (second observable) will be switched to after we take the lastest user (second observable)
            take(1), 
            exhaustMap(user => {
                // HttpParams is mainly used to send parameters with GET requests
                const modifiedReq = req.clone({params: new HttpParams().set('auth', user.token)})
                return next.handle(modifiedReq);
            })
    )}
}