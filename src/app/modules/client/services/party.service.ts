import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PartyService {
    
  apiURL: string = `${environment.API_URL}/parties`;

  private partyNameSubject = new BehaviorSubject<string>('');

  get partyName$(): Observable<string> {
    return this.partyNameSubject.asObservable();
  }

  get partyName(): string {
    return this.partyNameSubject.value;
  }

  set partyName(partyName: string) {
    this.partyNameSubject.next(partyName);
  }

  private coinsSubject = new BehaviorSubject<number>(0);

  get coins$(): Observable<number> {
    return this.coinsSubject.asObservable();
  }

  get coins(): number {
    return this.coinsSubject.value;
  }

  set coins(coins: number) {
    this.coinsSubject.next(coins);
  }

  constructor(
    private http: HttpClient,
  ) { }

  get partyInfo(): any {
    const partyInfo = localStorage.getItem("party")!;
    const party = partyInfo ? JSON.parse(partyInfo) : undefined;

    if(!this.partyName && party?.name)
      this.partyName = party.name;

    return party;
  }

  set partyInfo(partyInfo: any) {
    localStorage.setItem("party", JSON.stringify(partyInfo));
  }

  getInfo(idParty: string): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/${idParty}`)
    .pipe(tap((partyInfo: any) => {
      if(partyInfo?.name)
        this.partyName = partyInfo.name;
    }));
  }

  getCoins(idParty: string): Observable<number> {
    return this.http.get<number>(`${this.apiURL}/${idParty}/coins/quantity`)
    .pipe(tap((response: number) => {
      if(response)
        this.coins = response;
    }));
  }
}