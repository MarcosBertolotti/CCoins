import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SpotifyCredentials } from '../models/spotify-credentials.model';
import { RequestService } from './request.service';
import { environment } from 'src/environments/environment';
import { SpotifyStatus } from '../modules/bar/enums/spotify-status.enum';
import { catchError, tap } from 'rxjs/operators';
import { ToastService } from '../shared/services/toast.services';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  apiURL: string = environment.API_URL;
  baseApiURL: string = '/spotify';

  get URL(): string {
    return `${this.apiURL}${this.baseApiURL}`;
  }

  set connected(connected: boolean) {
    const status = connected ? SpotifyStatus.CONNECTED : SpotifyStatus.DISCONNECTED;
    localStorage.setItem("spotify-status", status);
  }

  get connected(): boolean {
    const status = localStorage.getItem("spotify-status");

    if(!status) return false;

    return status === SpotifyStatus.CONNECTED ? true : false;
  }
  
  redirectURI = `http://localhost:4200/admin/bar/list`;
  spotifyCredentials!: SpotifyCredentials;

  constructor(
    private http: HttpClient,
    private requestService: RequestService,
    private toastService: ToastService,
    ) { }

  getCredentials(): Promise<SpotifyCredentials> {
    return this.requestService.get(`${this.baseApiURL}/config`);
  }

  redirectToAuthorize(spotifyCredentials: SpotifyCredentials): void {
    const { authEndpoint, clientId, scopes } = spotifyCredentials;
    const authURL = `${authEndpoint}?client_id=${clientId}&response_type=code&redirect_uri=${this.redirectURI}&scope=${scopes.join('%20')}`;
    window.location.href = authURL;
  }

  spotifyLogin(): void {
    this.getCredentials()
    .then((response: SpotifyCredentials) => {
      this.spotifyCredentials = response;
      this.redirectToAuthorize(response)
    })
    .catch((error: HttpErrorResponse) => console.error(error));
  }

  checkIsConnected(): Observable<boolean> {
    return this.http.get<boolean>(`${this.URL}/is-connected`)
    .pipe(
      tap((isConnected: boolean) => {
        this.connected = isConnected;
        if(isConnected)
          this.startPlayback();
      }),
      catchError((error: HttpErrorResponse, caught: Observable<boolean>) => { 
        this.toastService.openErrorToast(error.error?.message);
        return caught;
      })
    );
  }

  startPlayback(code?: string): Observable<any> {
    return this.http.post<any>(`${this.URL}/start-playback`, { code });
  }
}
