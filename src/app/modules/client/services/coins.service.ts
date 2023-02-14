import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { CoinsReport } from "../models/coins-report.model";

@Injectable({
  providedIn: 'root'
})
export class CoinsService {
    
  apiURL: string = `${environment.API_URL}/coins`;

  constructor(
    private http: HttpClient,
  ) { }

  partyReport(): Observable<CoinsReport> {
    return this.http.get<CoinsReport>(`${this.apiURL}/party/report`);
  }

}