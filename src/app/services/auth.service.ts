import { Injectable } from '@angular/core';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { Router } from '@angular/router';
import { AppPaths } from '../enums/app-paths.enum';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, PartialObserver } from 'rxjs';
import { AccessToken } from '../models/access-token.model';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseApiURL = `${environment.API_URL}/oauth`;

  constructor(
    private socialAuthService: SocialAuthService,
    private router: Router,
    private http: HttpClient,
  ) { }
  
  private login(token: string, socialType: string): Observable<AccessToken> {
    return this.http.post<AccessToken>(`${this.baseApiURL}/${socialType}`, { value: token });
  } 

  socialLogin(socialType: string) {
    this.socialAuthService.signIn(socialType).then(
      (socialUser: SocialUser) => {
        if(socialUser) {
          const socialLoginObserver: PartialObserver<AccessToken> = {
            next: (token: AccessToken) => {
              this.saveToken(token.value);
              this.router.navigate([AppPaths.SIDENAV, AppPaths.BAR])
            },
            error: (error: HttpErrorResponse) => console.error(error.message)
          }
          this.login(socialUser.idToken, socialType.toLowerCase()).subscribe(socialLoginObserver);
        } else
          console.error(`Ha ocurrido un error al iniciar sesión con ${socialType.toLowerCase()}`);
      }
    ).catch((err: any) => console.error(err))
  }

  logOut(): void {
    this.socialAuthService.signOut().finally(
      () => {
        localStorage.clear();
        this.router.navigate([AppPaths.AUTH]);
      }
    );
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if(!token) return false;
    return !this.isTokenExpired(token);
  }

  isTokenExpired(token: string): boolean {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  private saveToken(token: string): void {
    localStorage.removeItem('id_token');
    localStorage.setItem('id_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('id_token');
  }
}
