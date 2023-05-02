import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, EMPTY, Observable, of } from "rxjs";
import { CoinsReport } from "src/app/models/coins-report.model";
import { RequestService } from "src/app/services/request.service";
import { environment } from "src/environments/environment";
import { DemandReport } from "../models/demand-report.model";
import { DemandActionDescription } from "../models/demand-action-description.model";
import { ResponseHttp } from "src/app/models/response-http.model";
import { Value } from "src/app/models/dto/value.dto";
import { catchError, tap } from "rxjs/operators";
import { ToastService } from "src/app/shared/services/toast.services";

@Injectable({
  providedIn: 'root'
})
export class CoinsService {
    
  apiURL: string = `${environment.API_URL}/coins`;

  private _actionsDescription!: DemandActionDescription[];

  private countDemandSubject = new BehaviorSubject(0);

  get countDemand$(): Observable<number> {
    return this.countDemandSubject.asObservable();
  }

  set countDemand(countDemand: number) {
    this.countDemandSubject.next(countDemand);
  }

  constructor(
    private http: HttpClient,
    private toastService: ToastService,
    private requestService: RequestService,
  ) { }

  partyReport(idTable: number, type = '', page = 0, size = 10, sort = 'id,desc'): Observable<CoinsReport> {
    const url = this.requestService.parseUrlQueryParams(`${this.apiURL}/party/report`, { page, size, sort, type });
    return this.http.post<CoinsReport>(url, { id: idTable });
  }

  getOutDemandReport(): Observable<DemandReport> {
    return this.http.get<DemandReport>(`${this.apiURL}/report/out-demand`);
  }

  getInDemandReport(): Observable<DemandReport> {
    return this.http.get<DemandReport>(`${this.apiURL}/report/in-demand`);
  }

  getActionsDescription(): Observable<DemandActionDescription[]> {
    return this.http.get<DemandActionDescription[]>(`${this.apiURL}/active-states`);
  }

  getCurrentActionsDescription(): Observable<DemandActionDescription[]> {
    if(!this._actionsDescription)
      return this.getActionsDescription();

    return of(this._actionsDescription);
  }

  deliver(idCoin: number): Observable<ResponseHttp> {
    return this.http.post<ResponseHttp>(`${this.apiURL}/deliver`, { id: idCoin });
  }

  cancel(idCoin: number): Observable<ResponseHttp> {
    return this.http.post<ResponseHttp>(`${this.apiURL}/cancel`, { id: idCoin });
  }

  adjust(idCoin: number): Observable<ResponseHttp> {
    return this.http.post<ResponseHttp>(`${this.apiURL}/adjust`, { id: idCoin });
  }

  countCurrentDemand(): Observable<Value> {
    return this.http.get<Value>(`${this.apiURL}/count-demand`)
    .pipe(
      tap((response: Value) => this.countDemand = response?.value || 0),
      catchError((error: HttpErrorResponse) => {
        this.toastService.openErrorToast(error.error?.message);
        return EMPTY;
      })
    );
  }

}