import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CoinsReport } from "src/app/models/coins-report.model";
import { RequestService } from "src/app/services/request.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CoinsService {
    
  apiURL: string = `${environment.API_URL}/coins`;

  constructor(
    private http: HttpClient,
    private requestService: RequestService,
  ) { }

  partyReport(idTable: number, type = '', page = 0, size = 10, sort = 'id,desc'): Observable<CoinsReport> {
    const url = this.requestService.parseUrlQueryParams(`${this.apiURL}/party/report`, { page, size, sort, type });
    return this.http.post<CoinsReport>(url, { id: idTable });
  }

}