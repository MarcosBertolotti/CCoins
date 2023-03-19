import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ResponseData } from "src/app/models/response-data.model";
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

  checkCanVote(): Observable<ResponseData<void>> {
    return this.http.get<ResponseData<void>>(`${this.apiURL}/check-vote`);
  }

}