import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Value } from "src/app/models/dto/value.dto";
import { Game } from "src/app/models/game.model";
import { Prize } from "src/app/models/prize.model";
import { ResponseList } from "src/app/models/response-list.model";
import { RequestService } from "src/app/services/request.service";
import { environment } from "src/environments/environment";
import { Client } from "../models/client.model";
import { Party } from "../models/party.model";

@Injectable({
  providedIn: 'root'
})
export class PartyService {
    
  apiURL: string = `${environment.API_URL}/parties`;

  private partySubject!: BehaviorSubject<Party>;

  get currentParty$(): Observable<Party> {
    return this.partySubject?.asObservable();
  }

  get currentParty(): Party {
    return this.partySubject.value;
  }

  set currentParty(party: Party) {
    if(!this.partySubject)
      this.partySubject = new BehaviorSubject<Party>(party);
    else
      this.partySubject.next(party);
    localStorage.setItem("party", JSON.stringify(party));
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
    private requestService: RequestService,
  ) { }

  getCurrentParty(idParty: string): Observable<Party> {
    const partyInfo = localStorage.getItem("party")!;
    const party = partyInfo ? JSON.parse(partyInfo) : undefined;

    if(party) return party

    return this.getInfo(idParty);
  }

  getInfo(idParty: string): Observable<Party> {
    return this.http.post<Party>(`${this.apiURL}`, { id: idParty })
    .pipe(tap((partyInfo: Party) =>
      this.currentParty = partyInfo
    ));
  }

  getInfoClients(idParty: string): Observable<ResponseList<Client>> {
    return this.http.post<ResponseList<Client>>(`${this.apiURL}/clients`, { id: idParty });
  }

  getCoins(idParty: string): Observable<Value> {
    return this.http.post<Value>(`${this.apiURL}/coins/quantity`, { id: idParty })
    .pipe(tap((response: Value) => {
      if(response)
        this.coins = response.value;
    }));
  }

  getBarPrizes(): Observable<ResponseList<Prize>> {
    return this.http.get<ResponseList<Prize>>(`${this.apiURL}/bar-prizes`);
  }

  getBarGames(): Observable<ResponseList<Game>> {
    return this.http.get<any>(`${this.apiURL}/bar/games`);
  }
}