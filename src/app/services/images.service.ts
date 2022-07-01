import { Injectable } from '@angular/core';
import { RequestService } from './request.service';

export interface TableQRDTO {
  number: number,
  code: string,
}

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  baseApiURL: string = '/images';

  constructor(private requestService: RequestService) { }

  generatePDFWithQRCodes(tables: TableQRDTO[]): Promise<any> {
    return this.requestService.post(this.baseApiURL, { list: tables });
  }

}
