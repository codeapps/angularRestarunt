import { Injectable } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Injectable({
  providedIn: 'root'
})
export class KotListService {

  constructor(private appService: AppService) { }
  dBranchId = localStorage.getItem("SessionBranchId");

  onKotBillGetOnTableDetailId() {

    let ServiceParams = {};
    ServiceParams['strProc'] = 'Kot_PendingBillGetOnAll';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.dBranchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);

    return this.appService.post('CommonQuery/fnGetDataReportNew', body)

  }
}
