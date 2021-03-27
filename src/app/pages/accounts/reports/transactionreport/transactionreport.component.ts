import { AppService } from 'src/app/app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transactionreport',
  templateUrl: './transactionreport.component.html',
  styleUrls: ['./transactionreport.component.scss']
})
export class TransactionreportComponent implements OnInit {
  createFlag: boolean = true;
  fromDate = new Date();
  toDate = new Date();
  datalist: any = [];
  strReportHeadName = 'Transaction Report';
  BranchId: any = localStorage.getItem('SessionBranchId');


  constructor(public _appService: AppService) { }

  ngOnInit() {
  }

  myPageChange() {
    this.createFlag = true;
    this.datalist = '';
  }

  fngetReport() {
    var ServiceParams = {};
    ServiceParams['strProc'] = 'TransactionReport';
    var oProcParams = [];

    var ProcParams = {};
    ProcParams['strKey'] = 'FromDate';
    ProcParams['strArgmt'] = this.ConvertDateAll(this.fromDate);
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'ToDate';
    ProcParams['strArgmt'] = this.ConvertDateAll(this.toDate);
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.BranchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReport', body).subscribe(data => {
      this.datalist = JSON.parse(data);
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
