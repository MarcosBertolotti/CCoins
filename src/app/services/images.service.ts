import { Injectable } from '@angular/core';
import { RequestService } from './request.service';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  baseApiURL: string = '/images';

  constructor(private requestService: RequestService) { }

  generatePDFWithQRCodes(ids: number[]): Promise<any> {
    return this.requestService.post(this.baseApiURL, { list: ids });
  }

}
