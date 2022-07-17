import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { ResponseList } from '../models/response-list.model';
import { Prize } from '../models/prize.model';

interface prizeDTO {
  id?: number,
  name: string,
  points: number,
  startDate?: Date,
  endDate?: Date,
  active?: boolean,
}

@Injectable({
  providedIn: 'root'
})
export class PrizeService {

  baseApiURL: string = '/prizes';

  constructor(private requestService: RequestService) { }

  findById(id: number): Promise<Prize> {
    return this.requestService.post(`${this.baseApiURL}/id`, { id });
  }

  findAllByBar(id: number): Promise<ResponseList<Prize>> {
    return this.requestService.post(`${this.baseApiURL}/bar`, { id });
  }

  saveOrUpdate(prize: prizeDTO): Promise<Prize> {
    return this.requestService.post(`${this.baseApiURL}/save`, prize);
  }

  updateActive(id: number): Promise<Prize> {
    return this.requestService.patch(`${this.baseApiURL}/active`, { id });
  }
}
