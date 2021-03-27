import { AppService } from './../../../../app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bankbook',
  templateUrl: './bankbook.component.html',
  styleUrls: ['./bankbook.component.scss']
})
export class BankbookComponent implements OnInit {
  createFlag: boolean = true;
  fromDate = new Date();
  toDate = new Date();
  datalist: any = [];
  strReportHeadName = 'Bank Book Report';
  isChecked: boolean = true;
  dBranchId = localStorage.getItem('SessionBranchId');
  strBranchName = localStorage.getItem('SessionBranchName');
  bankList: any;
  dBankId = 0;

  constructor(public _appService: AppService) { }

  ngOnInit() {
    this.fnBankGets();
  }

  fnBankGets() {
    var ServiceParams = {};
    ServiceParams['strProc'] = 'AccountHead_GetBanksNew';
    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'Search';
    ProcParams['strArgmt'] = '';
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.dBranchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      this.bankList = JSON.parse(data);
    });
  }

  fnGetReport() {
    if (this.dBankId == 0) {
      this._appService.openSnackBar('Please Select The BankName', 'Warning');
      return;
    }
    var ProcedureName = '';

    if (this.isChecked) {
      ProcedureName = 'VoucherDetails_GetLeaderDetsilsFormatOne';
    } else {
      ProcedureName = 'VoucherDetails_GetLeaderDetsils';
    }

    var varArguements = {};
    varArguements = {
      FromDate: this.ConvertDateAll(this.fromDate),
      ToDate: this.ConvertDateAll(this.toDate),
      AcId: this.dBankId,
      bAllData: true,
      EntryHeadId: 0,
      'strHeading': this.strReportHeadName,
      'strBranchName': this.strBranchName,
      BranchId: this.dBranchId
    };

    var DictionaryObject = {};
    DictionaryObject['dictArgmts'] = varArguements;
    DictionaryObject['ProcName'] = ProcedureName;
    let body = JSON.stringify(DictionaryObject);

    this._appService.post('Accounts/fnLeaders', body).subscribe(data => {
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
  myPageChange() {
    this.createFlag = true;
    this.datalist = '';
  }
}
