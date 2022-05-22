import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppPaths } from '../enums/app-paths.enum';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class IsAuthenticatedGuard implements CanActivateChild {

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}
  
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.redirectIfIsAuthenticated();
  }
  
  private redirectIfIsAuthenticated(): Observable<boolean> {
    return of(this.authService.isAuthenticated()).pipe(
      map((isAuthenticated: boolean) => {
        if (isAuthenticated)
          this.router.navigate(['/']);
          
        return !isAuthenticated ;
      })
    );
  }
 
}
