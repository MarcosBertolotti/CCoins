import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClientService } from '../modules/client/services/client.service';
import { ClientTableDTO } from '../modules/client/models/client-table.dto';

@Injectable()
export class ClientInterceptor implements HttpInterceptor {

  constructor(
    private clientService: ClientService,
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = this.addHeaders(request);
    
    return next.handle(request);
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

}
