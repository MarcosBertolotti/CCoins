import { Injectable } from "@angular/core";
import { RequestService } from "src/app/services/request.service";


@Injectable({
  providedIn: 'root'
})
export class PartyService {
    
  baseApiURL: string = `/bars/parties`;

  constructor(
    private requestService: RequestService,
  ) { }

  kickMembers(partyId: number, ids: number[], banned = false): Promise<any> {
    return this.requestService.delete(`${this.baseApiURL}/clients`, { partyId, list: ids, banned });
  }
}
