import { Injectable } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Injectable({
  providedIn: 'root'
})
export class ManufactureService {

  constructor(public _appService:AppService) { }

 public fngetmanufacture(searchText){
    let ServiceParams = {};
    ServiceParams['strProc'] = "Manufacture_Gets";

    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "Manufacture_Name";
    ProcParams["strArgmt"] = searchText;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    return this._appService.post('CommonQuery/fnGetDataReport', body)
  }
}
