import { AppService } from './../../../../app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-trialbalance',
  templateUrl: './trialbalance.component.html',
  styleUrls: ['./trialbalance.component.scss']
})
export class TrialbalanceComponent implements OnInit {

  createFlag: boolean = true;
  fromDate = new Date();
  toDate = new Date();
  datalist: any = [];
  strReportHeadName = 'trialBalance Report';
  dBranchId = localStorage.getItem('SessionBranchId');
  strBranchName = localStorage.getItem('SessionBranchName');
  selected = 'Format1';

  constructor(public _appService: AppService) { }

  ngOnInit() {
  }

  myPageChange() {
    this.createFlag = true;
    this.datalist = '';
  }

  fngetReport() {
    if (this.selected == 'Format1') {
      this.fngetFormat1();
    } else if (this.selected == 'Format2') {
      this.fngetFormat2();
    } else {
      this.fngetReport3();
    }
  }

  fngetFormat1() {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'TrialBalance';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'FromDate';
    ProcParams['strArgmt'] = this.ConvertDateAll(this.fromDate);
    oProcParams.push(ProcParams);


    ProcParams = {};
    ProcParams['strKey'] = 'ToDate';
    ProcParams['strArgmt'] = this.ConvertDateAll(this.toDate);
    oProcParams.push(ProcParams);


    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.dBranchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    var dictArgmts = { strHeading: this.strReportHeadName, strBranchName: this.strBranchName };
    var DictionaryObject = {};
    DictionaryObject['dictArgmts'] = dictArgmts;
    ServiceParams['DictionaryObject'] = DictionaryObject;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      this.datalist = JSON.parse(data);
      this.createFlag = false;
    });
  }

  fngetFormat2() {

    var ServiceParams = {};
    ServiceParams['strProc'] = 'TrailBalanceAsOnDate';
    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'AsOnDate';
    ProcParams['strArgmt'] = this.ConvertDateAll(this.toDate);
    oProcParams.push(ProcParams);


    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.dBranchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    var dictArgmts = { strHeading: this.strReportHeadName, strBranchName: this.strBranchName };
    var DictionaryObject = {};
    DictionaryObject['dictArgmts'] = dictArgmts;
    ServiceParams['DictionaryObject'] = DictionaryObject;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportNewAcc', body).subscribe(data => {
      this.datalist = JSON.parse(data);
      this.createFlag = false;
    });

  }

  fngetReport3() {
    var ServiceParams = {};
    ServiceParams['strProc'] = 'TrialBalanceFormat3';
    ServiceParams['JsonFileName'] = 'JsonArrayScriptTwo';
    var oProcParams = [];

    var ProcParams = {};
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
