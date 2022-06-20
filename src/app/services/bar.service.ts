import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { Bar } from '../models/bar-model';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BarService {

  apiURL: string = environment.API_URL;
  baseApiURL: string = '/bars';

  get URL(): string {
    return `${this.apiURL}${this.baseApiURL}`;
  }

  private currentBarSubject!: BehaviorSubject<Bar>;

  get currentBar$(): Observable<Bar> {
    return this.currentBarSubject.asObservable();
  }

  get currentBar(): Bar {
    return this.currentBarSubject?.value;
  }

  constructor(
    private requestService: RequestService,
    private http: HttpClient,
  ) { }

  public getDetails(id: number): Observable<Bar> {
    return this.http.post<Bar>(`${this.URL}/id`, { id }).pipe(
      tap((bar: Bar) => {
        if (!this.currentBarSubject)
          this.currentBarSubject = new BehaviorSubject<Bar>(bar);
        else
          this.currentBarSubject.next(bar);
      })
    );
  }

  public getCurrentBar(id: number): Observable<Bar> {
    if(this.currentBar)
      return this.currentBar$;
      
    return this.getDetails(id);
  }

  create(newBar: Bar): Promise<Bar > {
    return this.requestService.post(`${this.baseApiURL}/save`, newBar).then(
      (bar: Bar) => {
        if (!this.currentBarSubject)
          this.currentBarSubject = new BehaviorSubject<Bar>(bar);
        else
          this.currentBarSubject.next(bar);
        return bar;
      }
    );
  }

  findById(id: number): Promise<Bar> {
    return this.requestService.post(`${this.baseApiURL}/id`, { id });
  }

  findAllByOwner(): Promise<any> {
    return this.requestService.get(`${this.baseApiURL}/owner`);
  }

  updateActive(id: number): Promise<Bar> {
    return this.requestService.patch(`${this.baseApiURL}/active`, { id });
  }

}
