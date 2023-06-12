import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, PartialObserver } from 'rxjs';
import { SpotifyCredentials } from '../models/spotify-credentials.model';
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

  private connectedSubject = new BehaviorSubject<boolean>(false);

  get connected$() {
    this.connectedSubject.next(this.connected);
    return this.connectedSubject.asObservable();
  }

  set connected(connected: boolean) {
    const status = connected ? SpotifyStatus.CONNECTED : SpotifyStatus.DISCONNECTED;
    this.connectedSubject.next(connected);
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
    private toastService: ToastService,
    ) { }

  getCredentials(): Observable<SpotifyCredentials> {
    return this.http.get<SpotifyCredentials>(`${this.URL}/config`)
    .pipe(
      tap((response: SpotifyCredentials) => this.spotifyCredentials = response)
    );
  }

  redirectToAuthorize(spotifyCredentials: SpotifyCredentials): void {
    const { authEndpoint, clientId, scopes } = spotifyCredentials;
    const authURL = `${authEndpoint}?client_id=${clientId}&response_type=code&redirect_uri=${this.redirectURI}&scope=${scopes.join('%20')}`;
    window.location.href = authURL;
  }

  spotifyLogin(): void {
    const spotifyObserver: PartialObserver<SpotifyCredentials> = {
      next: (response: SpotifyCredentials) => this.redirectToAuthorize(response),
      error: (error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message)
    }
    this.getCredentials().subscribe(spotifyObserver);
  }

  checkIsConnected(): Observable<boolean> {
    return this.http.get<boolean>(`${this.URL}/is-connected`)
    .pipe(
      tap((isConnected: boolean) => {
        this.connected = isConnected;
        if(isConnected)
          this.startPlayback().subscribe();
      }),
      catchError((error: HttpErrorResponse, caught: Observable<boolean>) => { 
        this.toastService.openErrorToast(error.error?.message);
        return caught;
      })
    );
  }

  disconnect(): Observable<void> {
    return this.http.get<void>(`${this.URL}/disconnect-me`)
  }

  startPlayback(code?: string): Observable<void> {
    return this.http.post<void>(`${this.URL}/start-playback`, { code });
  }
}
