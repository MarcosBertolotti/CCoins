import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../shared/components/dialog/dialog.component';
import { SpotifyService } from '../services/spotify.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private spotifyService: SpotifyService,
    private matDialog: MatDialog,
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = this.addHeaders(request);
    
    return next.handle(request).pipe(
      tap((httpEvent: HttpEvent<any>) =>{
        // Skip request
        if(httpEvent.type === 0)
          return;  

        if (httpEvent instanceof HttpResponse && httpEvent.headers.has('Authorization')) {
          const token: string | null = httpEvent.headers.get('Authorization');
          if(token)
            this.authService.saveToken(token.replace("Bearer ", ""));
        }
      }),
      catchError((error) => {
        if (this.authService.getToken() && !this.authService.isAuthenticated() && error.status === 401) {
          this.openDialog();
        }
        return throwError(error);
      })
    );
  }

  private addHeaders(request: HttpRequest<any>): HttpRequest<any> {
    let token: string | null;

    if(request.url.includes('https://accounts.spotify.com/api/token'))
      token = null;
    else if(request.url.includes('https://api.spotify.com/v1'))
      token = this.spotifyService.getAccessTokenFromStorage();
    else 
      token = this.authService.getToken();

    if(token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        }
      });
    }
    return request;
  }

  openDialog() {
    this.matDialog.closeAll();
    this.matDialog.open(DialogComponent, {
      panelClass: 'custom-dialog-container',
      width: '80%',
      maxWidth: '350px',
      disableClose: true,
      data: {
        title: 'La sesión ha expirado!',
        messages: ['Por favor, vuelva a iniciar sesión.'],
        canCancel: false,
        actions: [
          {
            message: 'Aceptar',
            action: () => {
              this.authService.logOut();
            },
          },
        ],
      },
    });
  }
}
