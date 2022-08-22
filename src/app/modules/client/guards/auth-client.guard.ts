import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ClientPaths } from '../enums/client-paths.eum';
import { ClientService } from '../services/client.service';

@Injectable({
  providedIn: 'root'
})
export class AuthClientGuard implements CanActivate {
  
  constructor(
    private router: Router,
    private clientService: ClientService,
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if(!this.clientService.isAuthenticated())
      this.router.navigate([`${ClientPaths.WARNING_LOGIN}`]);

    return true;
  }
 
}
