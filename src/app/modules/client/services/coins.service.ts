import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { RequestService } from "src/app/services/request.service";
import { environment } from "src/environments/environment";
import { CoinsReport } from "../models/coins-report.model";

@Injectable({
  providedIn: 'root'
})
export class CoinsService {
    
  apiURL: string = `${environment.API_URL}/coins`;

  constructor(
    private http: HttpClient,
    private requestService: RequestService,
  ) { }

  partyReport(type = '', page = 0, size = 10, sort = 'id,desc'): Observable<CoinsReport> {
    const url = this.requestService.parseUrlQueryParams(`${this.apiURL}/party/report`, { page, size, sort, type });
    return this.http.get<CoinsReport>(url);
  }

}