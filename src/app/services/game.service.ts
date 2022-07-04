import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { ResponseList } from '../models/response-list.model';
import { GameType } from '../models/game-type.model';
import { Game } from '../models/game.model';

interface GameDTO {
  id?: number,
  name: string,
  rules: string,
  points: number,
  startDate?: Date,
  endDate?: Date,
  active?: boolean,
  gameType?: GameType,
}

@Injectable({
  providedIn: 'root'
})
export class GameService {

  baseApiURL: string = '/games';

  constructor(private requestService: RequestService) { }

  findById(id: number): Promise<Game> {
    return this.requestService.post(`${this.baseApiURL}/id`, { id });
  }

  findAllByBar(id: number): Promise<ResponseList<Game>> {
    return this.requestService.get(`${this.baseApiURL}/bar/${id}`);
  }

  saveOrUpdate(table: GameDTO): Promise<Game> {
    return this.requestService.post(`${this.baseApiURL}/save`, table);
  }

  updateActive(id: number): Promise<Game> {
    return this.requestService.patch(`${this.baseApiURL}/active`, { id });
  }

  findAllTypes(): Promise<ResponseList<GameType>> {
    return this.requestService.get(`${this.baseApiURL}/types`);
  }
}
