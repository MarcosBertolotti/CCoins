import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RequestService } from './request.service';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  apiURL: string = environment.API_URL;

  constructor(
    private requestService: RequestService,
    private http: HttpClient,
  ) { }

  generatePDFWithQRCodes(ids: number[]): Observable<Blob> {
    return this.http.post(`${this.apiURL}/images`, { list: ids }, { responseType: 'blob'});
  }

}
