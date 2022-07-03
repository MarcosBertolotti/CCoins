import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { Table } from '../models/table.model';
import { ResponseData } from '../models/response-data.model';
import { ResponseList } from '../models/response-list.model';

interface TableDTO {
  id?: number,
  number: number,
  active?: boolean,
  bar: number,
}

@Injectable({
  providedIn: 'root'
})
export class TableService {

  baseApiURL: string = '/tables';

  constructor(private requestService: RequestService) { }

  findById(id: number): Promise<Table> {
    return this.requestService.post(`${this.baseApiURL}/id`, { id });
  }

  findAllByBar(id: number): Promise<ResponseList<Table>> {
    return this.requestService.post(`${this.baseApiURL}/bar`, { id }); // revisar status
  }

  saveOrUpdate(table: TableDTO) {
    return this.requestService.post(`${this.baseApiURL}/save`, table);
  }

  createByQuantity(quantity: number, idBar: number): Promise<ResponseData<Table>> {
    return this.requestService.post(`${this.baseApiURL}/save/quantity`, { quantity, bar: idBar });
  }

  removeByQuantity(quantity: number, idBar: number): Promise<ResponseData<Table>> {
    return this.requestService.delete(`${this.baseApiURL}/quantity`, { quantity, bar: idBar} );
  }

  updateActive(id: number): Promise<Table> {
    return this.requestService.patch(`${this.baseApiURL}/active`, { id });
  }

  updateActiveByList(ids: number[]): Promise<ResponseData<Table>> {
    return this.requestService.put(`${this.baseApiURL}`, { list: ids });
  }
}
