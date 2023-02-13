import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ClientService } from '../modules/client/services/client.service';
import { ClientTableDTO } from '../modules/client/models/client-table.dto';
import { catchError } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../shared/components/dialog/dialog.component';
import { Router } from '@angular/router';
import { ClientPaths } from '../modules/client/enums/client-paths.eum';
import { WarningType } from '../modules/client/enums/warning-type.enum';

@Injectable()
export class ClientInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private clientService: ClientService,
    private matDialog: MatDialog,
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = this.addHeaders(request);
    
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.openDialog();
        }
        return throwError(error);
      })
    );
  }

  private addHeaders(request: HttpRequest<any>): HttpRequest<any> {
    const me: ClientTableDTO = this.clientService.clientTable;

    if(me && me.clientIp) {
      request = request.clone({
        setHeaders: {
          client: me.clientIp,
          code: me.tableCode,
          partyId: `${me.partyId}`,
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
        title: 'La sesión ha terminado!',
        messages: ['Por favor, vuelva a iniciar sesión dentro del horario del bar.'],
        canCancel: false,
        actions: [
          {
            message: 'Aceptar',
            action: () => {
              this.router.navigate([ClientPaths.WARNING_LOGIN], { queryParams: {
                type: WarningType.LOGOUT
              }});
            },
          },
        ],
      },
    });
  }
}
