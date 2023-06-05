import { Injectable } from '@angular/core';
import { RequestService } from './request.service';
import { Game } from '../models/game.model';

@Injectable({
  providedIn: 'root'
})
export class PartyService {

  baseApiURL: string = '/parties';

  constructor(private requestService: RequestService) { }

  findTableMembers(idParty: number): Promise<Game> {
    return this.requestService.post(`${this.baseApiURL}/clients`, { id: idParty });
  }

}
