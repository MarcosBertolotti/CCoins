import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, PartialObserver } from "rxjs";
import { tap } from "rxjs/operators";
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

  private nickNameSubject = new BehaviorSubject<string>('');

  get nickName$(): Observable<string> {
    return this.nickNameSubject.asObservable();
  }

  get nickName(): string {
    return this.nickNameSubject.value;
  }

  set nickName(nickName: string) {
    this.nickNameSubject.next(nickName);
  }

  constructor(
    private requestService: RequestService,
    private http: HttpClient,
  ) { }

  getIPAddress(): Observable<IpAddress> {
    return this.http.get<IpAddress>("http://api.ipify.org/?format=json");
  }

  get clientTable(): ClientTableDTO {
    const clientTable = localStorage.getItem("client-table")!;
    const me = clientTable ? JSON.parse(clientTable) : undefined;

    if(!this.nickName && me?.nickName)
      this.nickName = me.nickName;

    return me;
  }

  set clientTable(clientTable: Partial<ClientTableDTO>) {
    localStorage.setItem("client-table", JSON.stringify(clientTable));
  }

  isAuthenticated(): boolean {
    const clientTable = this.clientTable;
    return clientTable && clientTable.tableCode ? true : false;
  }

  login(tableCode: string, clientIp: string): Observable<ClientTableDTO> {
    this.clientTable = { tableCode, clientIp };

    return this.http.post<ClientTableDTO>(`${this.apiURL}/login`, { })
    .pipe(tap((response: ClientTableDTO) => {
      if(response?.nickName)
        this.nickName = response.nickName;
    }));
  }

  changeName(nickName: string): Observable<void> {
    return this.http.put<void>(`${this.apiURL}/name`, { nickName });
  }

  getBarMenu(): Observable<{ text: string }> {
    return this.http.get<{ text: string}>(`${this.apiURL}/menu`);
  }

  logout(): Observable<void> {
    const customHeaders = {
      client: this.clientTable.clientId
    }
    this.requestService.getHeaders(customHeaders);
    return this.http.get<void>(`${this.apiURL}/logout`)
    .pipe(
      tap(() => localStorage.clear())
    );
  }
}