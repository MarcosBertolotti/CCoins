import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { Table } from '../models/table.model';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  baseApiURL: string = '/tables';

  constructor(private requestService: RequestService) { }

  createByQuantity(quantity: number, idBar: number): Promise<Table[]> {
    return this.requestService.post(`${this.baseApiURL}/save/quantity`, { quantity, bar: idBar });
  }

  findAllByBar(id: number): Promise<Table[]> {
    return this.requestService.post(`${this.baseApiURL}/bar`, { id });
  }
}
