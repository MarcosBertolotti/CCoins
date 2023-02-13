import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";


@Injectable({
  providedIn: 'root'
})
export class VoteService {
    
  apiURL: string = `${environment.API_URL}/votes`;

  constructor(
    private http: HttpClient,
  ) { }

  voteNextSong(idSong: number): Observable<void> {
    return this.http.post<void>(`${this.apiURL}`, { id: idSong });
  }

}