import { AppService } from 'src/app/app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-outstandingledgercompare',
  templateUrl: './outstandingledgercompare.component.html',
  styleUrls: ['./outstandingledgercompare.component.scss']
})
export class OutstandingledgercompareComponent implements OnInit {
  createFlag: boolean = true;
  datalist: any = [];
  strReportHeadName: any = 'Outstanding Ledger Compare Report';
  dBranchId = localStorage.getItem('SessionBranchId');
  strBranchName = localStorage.getItem('SessionBranchName');

  constructor(public _appService: AppService) { }

  ngOnInit() {
  }

  myPageChange() {
    this.createFlag = true;
    this.datalist = '';
  }

  fnOutstandingLeaderCompare() {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'VoucherDetails_GetLeaderBalanceWithBillOutstanding';
    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.dBranchId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'CustOrSupp';
    ProcParams['strArgmt'] = 'Customer';
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
}
