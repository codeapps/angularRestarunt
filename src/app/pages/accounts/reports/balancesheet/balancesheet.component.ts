import { AppService } from 'src/app/app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-balancesheet',
  templateUrl: './balancesheet.component.html',
  styleUrls: ['./balancesheet.component.scss']
})
export class BalancesheetComponent implements OnInit {
  createFlag: boolean = true;
  fromDate = new Date();
  strReportHeadName = 'Blanacesheet Report';
  datalist: any = [];
  dBranchId = localStorage.getItem('SessionBranchId');
  strBranchName = localStorage.getItem('SessionBranchName');


  constructor(public _appService: AppService) { }

  ngOnInit() {
  }

  ConvertDateAll(format) {
    let date = ("0" + format.getDate()).slice(-2);
    let month = ("0" + (format.getMonth() + 1)).slice(-2);
    let year = format.getFullYear();
    const dateconvert = year + '-' + month + '-' + date;
    return dateconvert;
  }
  myPageChange() {
    this.createFlag = true;
    this.datalist = '';
  }

  fngetReport() {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'BalanceSheet_AssetsDetails';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'AsOnDate';
    ProcParams['strArgmt'] = this.ConvertDateAll(this.fromDate);
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

    this._appService.post('CommonQuery/fnGetDataReportReturnMultiTable', body).subscribe(data => {
      let JsonData = JSON.parse(data);
      this.datalist = JSON.parse(JsonData[1])
      this.createFlag = false;
    });
  }
}
