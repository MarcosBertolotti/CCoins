import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { Table } from '../models/table.model';

export interface TableQRDTO {
  number: number,
  code: string,
}

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  baseApiURL: string = '/images/';

  constructor(private requestService: RequestService) { }

  generatePDFWithQRCodes(tables: TableQRDTO[]): Promise<any> {
    return this.requestService.post(this.baseApiURL, { list: tables });
  }

}
