import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SpotifyCredentials } from '../models/spotify-credentials.model';
import { RequestService } from './request.service';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  baseApiURL = '/spotify';
  spotifyApiURL = 'https://api.spotify.com/v1/';
  headers: any;

  constructor(
    private http: HttpClient,
    private requestService: RequestService,
    ) { }

  getHeaders(token: string, customHeaders?: any): HttpHeaders {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if(token)
      this.headers = this.headers.append('Authorization', 'Bearer ' + token);

    //custom headers override default if the key exists
    Object.entries(customHeaders).forEach(([key, value]) =>
      this.headers = this.headers.set(key, String(value))
    );

    return this.headers;
  }

  getCredentials(): Promise<SpotifyCredentials> {
    return this.requestService.get(`${this.baseApiURL}/config`);
  }

  redirectToAuthorize(spotifyCredentials: SpotifyCredentials): any {
    const { authEndpoint, clientId, scopes } = spotifyCredentials;
    const redirectURI = `http://localhost:4200/admin/bar/list`;
    const authURL = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectURI}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`;
    window.open(authURL, "_self");
  }

  mePlayer(accessToken: string): Promise<any> {
    let headers;

    if(accessToken)
      headers = this.getHeaders(accessToken);
    
    return this.http.get<any>(`${this.spotifyApiURL}me/player`, { headers }).toPromise();
  }

  getHashUrlParam(): any {
    let hashStored = localStorage.getItem('hash');
    hashStored = hashStored ? JSON.parse(hashStored) : null;
  
    if(hashStored)
      return hashStored;
  
    const hash = window.location.hash
    .substring(1)
    .split("&")
    .reduce(function(initial: any, item) {
      if (item) {
        var parts = item.split("=");
        initial[parts[0]] = decodeURIComponent(parts[1]);
      }
      return initial;
    }, {});
    window.location.hash = "";
  
    localStorage.setItem('hash', JSON.stringify(hash));
    return hash;
  } 
}
