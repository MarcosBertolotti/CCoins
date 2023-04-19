import { Injectable } from '@angular/core';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { Router } from '@angular/router';
import { AppPaths } from '../enums/app-paths.enum';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CompletionObserver, Observable, PartialObserver } from 'rxjs';
import { AccessToken } from '../models/access-token.model';
import { environment } from 'src/environments/environment';
import { ToastService } from '../shared/services/toast.services';
import { ClientService } from '../modules/client/services/client.service';
import { SpotifyService } from './spotify.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseApiURL = `${environment.API_URL}/oauth`;

  constructor(
    private router: Router,
    private http: HttpClient,
    private toastService: ToastService,
    private socialAuthService: SocialAuthService,
    private clientService: ClientService,
    private spotifyService: SpotifyService,
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
              this.checkSpotifyIsConnected();
            },
            error: (error: HttpErrorResponse) => {
              const message = error.status === 503 ? 'Servicio momentáneamente no disponible' : error.error?.message;
              this.toastService.openErrorToast(message);
            }
          }
          this.login(this.getSocialToken(socialType, socialUser), socialType.toLowerCase()).subscribe(socialLoginObserver);
        } else
          this.toastService.openErrorToast(`Ha ocurrido un error al iniciar sesión con ${socialType.toLowerCase()}`);
      }
    ).catch((err: any) => {
      const error = err?.error?.message ?? err?.error ?? err;
      if(error !== 'popup_closed_by_user' && error !== 'User cancelled login or did not fully authorize.')
        this.toastService.openErrorToast(error);
    });
  }

  private getSocialToken(socialType: string, socialUser: SocialUser): string {
    return socialType === GoogleLoginProvider.PROVIDER_ID ? socialUser.idToken : socialUser.authToken;
  }

  checkSpotifyIsConnected(): void {
    const spotifyObserver: CompletionObserver<boolean> = {
      complete: () => this.router.navigate([AppPaths.ADMIN, AppPaths.BAR, AppPaths.LIST])
    }
    this.spotifyService.checkIsConnected().subscribe(spotifyObserver);
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

  saveToken(token: string): void {
    localStorage.removeItem('id_token');
    localStorage.setItem('id_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('id_token');
  }

  // only admins have tokens
  isAdmin(): boolean {
    return this.isAuthenticated();
  }

  isClient(): boolean {
    return this.clientService.isAuthenticated();
  }
}
