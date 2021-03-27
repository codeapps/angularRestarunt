import { AppService } from './../../../../app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-daybook',
  templateUrl: './daybook.component.html',
  styleUrls: ['./daybook.component.scss']
})
export class DaybookComponent implements OnInit {
  fromDate = new Date();
  toDate = new Date();
  createFlag: boolean = true;
  datalist: any = [];
  strReportHeadName = 'DayBook Report';
  radioValue = 'Format1'
  dBranchId = localStorage.getItem("SessionBranchId");



  constructor(public _appService: AppService) { }

  ngOnInit() {

  }

  myPageChange() {
    this.datalist = '';
    this.createFlag = true;
  }

  fngetReport() {
    
    let ServiceParams = {};

    if (this.radioValue == "Format1")
      ServiceParams['strProc'] = 'DayBookFormat1';
    else
      ServiceParams['strProc'] = 'DayBookFormat2';

    ServiceParams['JsonFileName'] = 'JsonArrayScriptOne';
    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = '@ParamsFromDate';
    ProcParams['strArgmt'] = this.ConvertDateAll(this.fromDate);
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsToDate';
    ProcParams['strArgmt'] = this.ConvertDateAll(this.toDate);
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsBranchId';
    ProcParams['strArgmt'] = this.dBranchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportFromScriptJsonFile', body).subscribe(data => {
      this.datalist = JSON.parse(data.JsonDetails[0]);
      this.createFlag = false;
    });
  }


  ConvertDateAll(format) {
    let date = ("0" + format.getDate()).slice(-2);
    let month = ("0" + (format.getMonth() + 1)).slice(-2);
    let year = format.getFullYear();
    const dateconvert = year + '-' + month + '-' + date;
    return dateconvert;
  }
}
