import { Injectable } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  constructor(public _appService: AppService) { }

  public fnAreaGets(searchText) {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'Area_Gets';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "Area_Name";
    ProcParams["strArgmt"] = searchText;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    return this._appService.post('CommonQuery/fnGetDataReport', body)
  }
}
