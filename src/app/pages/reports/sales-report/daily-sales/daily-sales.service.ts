import { Injectable } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Injectable({
  providedIn: 'root'
})
export class DailySalesService {
  dBranchId: any = localStorage.getItem("SessionBranchId");
  constructor(private appService: AppService) { }

  onGetDailyReportTable(fromDate: Date, toDate:Date) {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'Issue_SalesDetailed';
    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'Fromdate';
    ProcParams['strArgmt'] = this.ConvertDateAll(fromDate);
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'ToDate';
    ProcParams['strArgmt'] = this.ConvertDateAll(toDate);
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.dBranchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

   return this.appService.post('CommonQuery/fnGetDataReportNew', body);
  }
  onGetAllSAles() {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'Issues_Gets';
    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'search';
    ProcParams['strArgmt'] = '';
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

   return this.appService.post('CommonQuery/fnGetDataReportNew', body);
  }

  ConvertDateAll(format) {
    let date = format.getDate();
    let month = format.getMonth() + 1;
    let year = format.getFullYear();
    const dateconvert = year + '-' + month + '-' + date;
    return dateconvert;
  }
}
