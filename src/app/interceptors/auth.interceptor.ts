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

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
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
        if (!this.authService.isAuthenticated() && error.status === 401) {
          this.openDialog();
        }
        return throwError(error);
      })
    );
  }

  private addHeaders(request: HttpRequest<any>): HttpRequest<any> {
    const token = this.authService.getToken();

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
        message: 'Por favor, vuelva a iniciar sesión.',
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
