import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, PartialObserver } from "rxjs";
import { RequestService } from "src/app/services/request.service";
import { environment } from "src/environments/environment";
import { ClientTableDTO } from "../models/client-table.dto";

export interface IpAddress {
  ip: string,
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
    
  apiURL: string = `${environment.API_URL}/clients`;

  constructor(
    //private requestService: RequestService,
    private http: HttpClient,
  ) { }

  getIPAddress(): Observable<IpAddress> {
    return this.http.get<IpAddress>("http://api.ipify.org/?format=json");
  }

  get clientTable(): ClientTableDTO {
    const clientTable = localStorage.getItem("client-table");
    return clientTable ? JSON.parse(clientTable) : undefined;
  }

  set clientTable(clientTable: ClientTableDTO) {
    localStorage.setItem("client-table", JSON.stringify(clientTable)); // session storage?
  }

  isAuthenticated(): boolean {
    const clientTable = this.clientTable;
    return clientTable && clientTable.tableCode ? true : false;
  }

  login(tableCode: string, clientIp: string): Observable<ClientTableDTO> {
    return this.http.post<ClientTableDTO>(`${this.apiURL}/login`, { tableCode, clientIp });
  }

  changeName(nickName: string): Observable<void> {
    const { clientIp: ip } = this.clientTable;
    return this.http.put<void>(`${this.apiURL}/name`, { nickName, ip });
  }
}