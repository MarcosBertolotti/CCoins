import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Bar } from '../models/bar-model';
import { SpotifyCredentials } from '../models/spotify-credentials.model';
import { SpotifyPlayer } from '../models/spotify-player-model';
import { BarService } from './bar.service';
import { RequestService } from './request.service';

interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  baseApiURL = '/spotify';
  spotifyApiURL = 'https://api.spotify.com/v1/';
  redirectURI = `http://localhost:4200/admin/bar/list`;
  spotifyCredentials!: SpotifyCredentials;
  tokenExpirationTime!: Date;

  constructor(
    private http: HttpClient,
    private requestService: RequestService,
    private barService: BarService,
    ) { }

  getCredentials(): Promise<SpotifyCredentials> {
    return this.requestService.get(`${this.baseApiURL}/config`);
  }

  redirectToAuthorize(spotifyCredentials: SpotifyCredentials): any {
    const { authEndpoint, clientId, scopes } = spotifyCredentials;
    const authURL = `${authEndpoint}?client_id=${clientId}&response_type=code&redirect_uri=${this.redirectURI}&scope=${scopes.join('%20')}`;
    window.location.href = authURL;
  }

  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${this.spotifyCredentials?.clientId}:${this.spotifyCredentials?.clientSecret}`)}`
    });
  }

  getAccessToken(code: string): Observable<any> {
    const headers = this.getHeaders();
    const body = `grant_type=authorization_code&code=${code}&redirect_uri=${this.redirectURI}`;
    return this.http.post('https://accounts.spotify.com/api/token', body, { headers });
  }

  async refreshToken(): Promise<any> {
    if(!this.spotifyCredentials)
      this.spotifyCredentials = await this.getCredentials();

    const headers = this.getHeaders();
    const body = `grant_type=refresh_token&refresh_token=${this.getRefreshTokenFromStorage()}`;
    return this.http.post('https://accounts.spotify.com/api/token', body, { headers }).toPromise();
  }

  isTokenExpired(): boolean {
    const accessToken = localStorage.getItem('spotify_access_token');
    const tokenExpirationTime = localStorage.getItem('spotify_access_token_exp');

    if(!accessToken || !tokenExpirationTime) return true;

    return new Date(this.tokenExpirationTime) < new Date();
  }

  isLoggedIn(): boolean {
    return !!this.getAccessTokenFromStorage();
  }

  saveTokens(accessToken: string, expireIn: number, refreshToken?: string): void {
    localStorage.setItem('spotify_access_token', accessToken);
    localStorage.setItem('spotify_access_token_exp', `${Date.now() + expireIn * 1000}`);

    if(refreshToken)
      localStorage.setItem('spotify_refresh_token', refreshToken);
  }

  getAccessTokenFromStorage(): string {
    return localStorage.getItem('spotify_access_token') || '';
  }

  getRefreshTokenFromStorage(): string {
    return localStorage.getItem('spotify_refresh_token') || '';
  }

  async mePlayer(): Promise<any> {
    if (this.isTokenExpired()) {
      const response = await this.refreshToken();
      if(response)
        this.saveTokens(response.access_token, response.expires_in);
    }
    return this.http.get<any>(`${this.spotifyApiURL}me/player`).toPromise();
  }

  sendSong(spotifyPlayer: SpotifyPlayer): void {
    const currentBar: Bar = this.barService.currentBar;

    if(currentBar) {
      const body = {
        id: currentBar.id,
        token: this.getAccessTokenFromStorage(),
        playback: {
          progress_ms: spotifyPlayer.progress_ms,
          is_playing: spotifyPlayer.is_playing,
          item: spotifyPlayer.item,
          context: spotifyPlayer.context,
          shuffle_state: spotifyPlayer.shuffle_state,
          repeat_state: spotifyPlayer.repeat_state,
        }
      }
      this.requestService.post('/spotify/actualSongs/bar', body);
    }
  }

}
