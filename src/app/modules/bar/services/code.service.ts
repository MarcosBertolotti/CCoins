import { Injectable } from "@angular/core";
import { Code } from "src/app/models/code.model";
import { RequestService } from "src/app/services/request.service";


@Injectable({
  providedIn: 'root'
})
export class codeService {
    
  apiURL: string = `/codes`;

  constructor(
    private requestService: RequestService,
  ) { }

  create(body: Partial<Code>): Promise<Code> {
    return this.requestService.post(this.apiURL, body);
  }

  getActives(): Promise<Code[]> {
    return this.requestService.get(`${this.apiURL}/game/active`);
  }

  getInactives(): Promise<Code[]> {
    return this.requestService.get(`${this.apiURL}/game/inactive`);
  }

  invalidate(code: string): Promise<Code> {
    return this.requestService.put(`${this.apiURL}/invalidate`, { text: code })
  }
}