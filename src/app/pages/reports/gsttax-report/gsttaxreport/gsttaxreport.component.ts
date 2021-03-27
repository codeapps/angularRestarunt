import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-gsttaxreport',
  templateUrl: './gsttaxreport.component.html',
  styleUrls: ['./gsttaxreport.component.scss']
})
export class GsttaxreportComponent implements OnInit {
  date = new Date();
  fromDate = new Date();
  toDate = new Date();
  dBranchId: any = localStorage.getItem("SessionBranchId");
  createFlag:boolean = true;
  datalist: any = [];
  strReportHeadName: any = 'Daily Sales Report';

  constructor(public _appService:AppService) { }

  ngOnInit(): void {
  }

  getReport(){
    let ServiceParams = {};
    ServiceParams['strProc'] = 'getGstTaxReport';
    let oProcParams = [];
    let ProcParams = {};

    ProcParams['strKey'] = 'Fromdate';
    ProcParams['strArgmt'] = this.ConvertDateAll(this.fromDate);
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'ToDate';
    ProcParams['strArgmt'] =this.ConvertDateAll(this.toDate);
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.dBranchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportNew',body).subscribe(data=>{
      this.datalist = JSON.parse(data);
      this.createFlag = false;
    });
  }

  myPageChange(){
    this.createFlag = true;   
    this.datalist = '';
  }
  ConvertDateAll(format) {
    let date = format.getDate();
    let month = format.getMonth() + 1;
    let year = format.getFullYear();
    const dateconvert = year + '-' + month + '-' + date;
    return dateconvert;
  }
}
