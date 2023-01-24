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
    return this.currentBarSubject?.asObservable();
  }

  get currentBar(): Bar {
    if(this.currentBarSubject?.value)
      return this.currentBarSubject?.value;
      
    let currentBar: any = localStorage.getItem("bar");
    currentBar = currentBar ? JSON.parse(currentBar) : null;

    if (currentBar && !this.currentBarSubject)
      this.currentBarSubject = new BehaviorSubject<Bar>(currentBar);
    else if(currentBar)
      this.currentBarSubject.next(currentBar);

    return currentBar;
  }

  set currentBar(bar: Bar) {
    localStorage.setItem("bar", JSON.stringify(bar));
    this.currentBarSubject.next(bar);
  }

  constructor(
    private requestService: RequestService,
    private http: HttpClient,
  ) { }

  public getDetails(id: number): Observable<Bar> {
    return this.http.post<Bar>(`${this.URL}/id`, { id }).pipe(
      tap((bar: Bar) => {
        if (!this.currentBarSubject) {
          this.currentBarSubject = new BehaviorSubject<Bar>(bar);
          localStorage.setItem("bar", JSON.stringify(bar));
        } else
          this.currentBar = bar;
      })
    );
  }

  public getCurrentBar(id: number): Observable<Bar> {
    if(this.currentBar && this.currentBar.id === id)
      return this.currentBar$;
      
    return this.getDetails(id);
  }

  create(newBar: Bar): Promise<Bar> {
    return this.requestService.post(`${this.baseApiURL}/save`, newBar).then(
      (bar: Bar) => {
        if (!this.currentBarSubject) {
          this.currentBarSubject = new BehaviorSubject<Bar>(bar);
          localStorage.setItem("bar", JSON.stringify(bar));
        } else
          this.currentBar = bar;

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
