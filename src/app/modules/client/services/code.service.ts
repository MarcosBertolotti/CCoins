import { Injectable } from '@angular/core';
import { CoinsRegister } from 'src/app/models/coins-register.model';
import { ResponseData } from 'src/app/models/response-data.model';
import { RequestService } from 'src/app/services/request.service';

@Injectable({
  providedIn: 'root'
})
export class CodeService {

  constructor(
    private requestService: RequestService,
  ) { }

  redeem(code: string): Promise<ResponseData<CoinsRegister>> {
    return this.requestService.post('/redeem/code', { text: code });
  }
}
