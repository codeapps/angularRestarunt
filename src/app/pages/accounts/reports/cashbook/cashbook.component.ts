import { AppService } from './../../../../app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cashbook',
  templateUrl: './cashbook.component.html',
  styleUrls: ['./cashbook.component.scss']
})
export class CashbookComponent implements OnInit {
  createFlag: boolean = true;
  fromDate = new Date();
  toDate = new Date();
  radioValue = 'Detailed';
  datalist: any = [];
  strReportHeadName = 'Cash Book Report';
  dBranchId = localStorage.getItem("SessionBranchId");
  bOpeningBalance = true;
  strBranchName = 'CodeApps';

  constructor(public _appService: AppService) { }

  ngOnInit() {
  }

  myPageChange() {
    this.createFlag = true;
    this.datalist = '';
  }

  fnGetReport() {
    if (this.radioValue == 'Detailed') {
      this.fngetDetailedReport();
    } else {
      this.fngetSummaryReport();
    }
  }

  fngetDetailedReport() {
    var varArguements = {};
    varArguements = {
      FromDate: this.ConvertDateAll(this.fromDate),
      ToDate: this.ConvertDateAll(this.toDate),
      AcId: 26,
      bAllData: true,
      EntryHeadId: 0,
      //    'strHeading': this.strReportHeadName,
      // 'strBranchName': this.strBranchName,
      BranchId: this.dBranchId
    };

    var DictionaryObject = {};
    DictionaryObject['dictArgmts'] = varArguements;
    DictionaryObject['ProcName'] = 'VoucherDetails_GetLeaderDetsilsFormatOne';
    let body = JSON.stringify(DictionaryObject);
       
    this._appService.post('Accounts/fnLeaders', body).subscribe(data => {
      this.datalist = JSON.parse(data);
      this.createFlag = false;
    });
  }

  fngetSummaryReport() {
    var ServiceParams = {};

    ServiceParams['strProc'] = 'CashBookSummary';
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
    var dictArgmts = { strHeading: this.strReportHeadName, strBranchName: this.strBranchName };
    var DictionaryObject = {};
    DictionaryObject['dictArgmts'] = dictArgmts;
    ServiceParams['DictionaryObject'] = DictionaryObject;
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
