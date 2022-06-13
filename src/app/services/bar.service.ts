import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { Bar } from '../models/bar-model';

@Injectable({
  providedIn: 'root'
})
export class BarService {

  baseApiURL: string = '/bars';

  constructor(private requestService: RequestService) { }

  create(newBar: Bar): Promise<Bar> {
    return this.requestService.post(`${this.baseApiURL}/save`, newBar);
  }

  findById(id: number): Promise<Bar> {
    return this.requestService.post(`${this.baseApiURL}/id`, { id });
  }

  findAllByOwner(): Promise<Bar> {
    return this.requestService.get(`${this.baseApiURL}/all`);
  }

  updateActive(id: number): Promise<Bar> {
    return this.requestService.patch(`${this.baseApiURL}/active`, { id });
  }

}
