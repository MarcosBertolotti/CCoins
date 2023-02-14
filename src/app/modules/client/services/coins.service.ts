import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CoinsService {
    
  apiURL: string = `${environment.API_URL}/coins`;

  constructor(
    private http: HttpClient,
  ) { }

  partyReport(): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/party/report`);
  }

}