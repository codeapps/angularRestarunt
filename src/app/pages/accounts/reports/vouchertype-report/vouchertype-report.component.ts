import { AppService } from './../../../../app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vouchertype-report',
  templateUrl: './vouchertype-report.component.html',
  styleUrls: ['./vouchertype-report.component.scss']
})
export class VouchertypeReportComponent implements OnInit {
  fromDate = new Date();
  toDate = new Date();
  public BranchId: any = localStorage.getItem('SessionBranchId');
  public StaffId: any = localStorage.getItem('SessionStaffId');
  voucherTypeList: any;
  dVoucherTypeId = 0;
  createFlag: boolean = true;
  strReportHeadName = 'VoucherType Report';
  datalist: any = [];

  constructor(public _appService: AppService) { }

  ngOnInit() {
    this.fnVoucherTypeGets();
  }

  fnVoucherTypeGets() {
    var ServiceParams = {};
    ServiceParams['strProc'] = 'VoucherPrefix_GetsOnBranchId';
    var oProcParams = [];

    var ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.BranchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      this.voucherTypeList = JSON.parse(data);
    });
  }

  gnGetReport() {

    if (this.dVoucherTypeId == 0) {
      this._appService.openSnackBar('Please Select The Voucher Type', 'Warning');
      return;
    }

    var ServiceParams = {};
    ServiceParams['strProc'] = 'VoucherDetails_GetVoucherPrefixIds';
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
    ProcParams['strKey'] = '@ParamsVPrefixId';
    ProcParams['strArgmt'] = this.dVoucherTypeId.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsBranchId';
    ProcParams['strArgmt'] = this.BranchId.toString();
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportFromScriptJsonFile', body).subscribe(data => {
      this.datalist = JSON.parse(data.JsonDetails[0]);
      this.createFlag = false;
    })
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
