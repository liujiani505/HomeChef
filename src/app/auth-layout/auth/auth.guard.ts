import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { take, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.authService.user.pipe(
          take(1),
          map(user => {
            const isAuth = !!user;
            if (isAuth) {
              return true;
            } else {
              // Only redirect to 'auth' if we are not already on 'auth'
              if(state.url !== '/auth'){
                return this.router.createUrlTree(['/auth']);
              } else {
                return false;
              }
            }
          })
        );
      }
}