import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  apiURL: string = environment.API_URL;

  constructor(private http: HttpClient) { }

  private getUrl(urlEndpoint: string): string {
    return this.apiURL + urlEndpoint
  }

  parseUrlQueryParams(url: string, options: {}): string {
    let urlQueryParams: any = options || {};
    Object.entries(urlQueryParams).forEach(([key, value]) => {
      url += (url.indexOf('?') > 0 ? '&' : '?') + key + '=' + value;
    });

    return url;
  }

  get(urlEndpoint: string, criteria?: any): Promise<any> {
    let url = this.getUrl(urlEndpoint)

    if(!criteria) {
      url = this.parseUrlQueryParams(url, criteria);
    }

    return this.http.get(url).toPromise();
  }

  put(urlEndpoint: string, body: {}): Promise<any> {
    let url = this.getUrl(urlEndpoint)
    return this.http.put(url, body).toPromise();
  }

  patch(urlEndpoint: string, body: {}): Promise<any> {
    let url = this.getUrl(urlEndpoint)
    return this.http.patch(url, body).toPromise();
  }

  post(urlEndpoint: string, body: {}): Promise<any> {
    let url = this.getUrl(urlEndpoint)
    return this.http.post(url, body).toPromise();
  }

  delete(urlEndpoint: string): Promise<any> {
    let url = this.getUrl(urlEndpoint);
    return this.http.delete(url).toPromise();
  }
}
