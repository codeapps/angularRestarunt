import { AppService } from 'src/app/app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-opening-balance-entry',
  templateUrl: './opening-balance-entry.component.html',
  styleUrls: ['./opening-balance-entry.component.scss']
})
export class OpeningBalanceEntryComponent implements OnInit {
  createFlag: boolean = true;
  fromDate = new Date();
  toDate = new Date();
  dBranchId = localStorage.getItem("SessionBranchId");
  dStaffId = localStorage.getItem("SessionStaffId");
  searchText: any = '';
  journalVoucherList: any;
  openingSource = {
    uniqueVoucherId: 0, voucherNo: 0, accountHeadId: '', accountHeadName: '', address: '', headaType: 'CUSTOMER', remarks: '',
    voucherDate: new Date(), credit: 0, debit: 0, salesmanId: ''
  };
  anchorSource = {
    enterDate: new Date(), invoiceNo: 0
  }
  SalesManList: any;
  filteredOptions: any = [];
  selectBankFlag = false;
  colAccHeader = [{ col: 'AC_Name', width: '230px' }, { col: 'Addr1', width: '230px' }];
  AccHeader = ['AccountHead Name', 'Address']

  constructor(public appService: AppService) { }

  ngOnInit() {
    this.fnSalesManGets();
    this.fnVoucherGets();
  }

  fnCreate() {
    this.createFlag = false;
  }

  fnBack() {
    this.createFlag = true;
    this.fnVoucherGets();
    this.fnClear();
  }

  fnVoucherGets() {
    var dPrefixId = 10;

    var ServiceParams = {};
    ServiceParams['strProc'] = "VoucherDetails_JournalGets";
    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "FromDate";
    ProcParams["strArgmt"] = this.ConvertDateAll(this.fromDate);
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "ToDate";
    ProcParams["strArgmt"] = this.ConvertDateAll(this.toDate);
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "VoucherPrefixId";
    ProcParams["strArgmt"] = dPrefixId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.dBranchId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "search";
    ProcParams["strArgmt"] = this.searchText;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this.appService.post('/CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      this.journalVoucherList = JSON.parse(data);
    });
  }

  fnSalesManGets() {
    var ServiceParams = {};
    ServiceParams['strProc'] = "SalesExecutive_GetsNew";
    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "SalesExe_Name";
    ProcParams["strArgmt"] = "";
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.dBranchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this.appService.post('/CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      this.SalesManList = JSON.parse(data);
    });
  }

  fnSearchAccountHead(eve) {
    if (!eve) {
      this.selectBankFlag = false;
      this.filteredOptions = [];
      return;
    }
    var ServiceParams = {};
    ServiceParams['strProc'] = "AccountHead_SearchOpeningBalance";
    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "AC_Name";
    ProcParams["strArgmt"] = eve;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.dBranchId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "CustOrSupp";
    ProcParams["strArgmt"] = this.openingSource.headaType;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams)

    this.appService.post('/CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      this.filteredOptions = JSON.parse(data);
      this.selectBankFlag = true;
    });
  }

  fnSelectBankChange(eve) {
    this.openingSource.accountHeadId = eve.AC_Id;
    this.openingSource.accountHeadName = eve.AC_Name;
    this.selectBankFlag = false;
    this.filteredOptions = [];
    let element = <HTMLInputElement>document.getElementById('credit');
    element.focus();
    element.select();
  }

  fnSave() {
    if (this.openingSource.accountHeadId == '' || this.openingSource.accountHeadId == null) {
      this.appService.openSnackBar('Please Choose AccountHead', 'Warning');
      return;
    }
    if (this.openingSource.salesmanId == '' || this.openingSource.salesmanId == '') {
      this.appService.openSnackBar('Please Select SalesMan', 'Warning');
      return;
    }
    if ((<any>this.openingSource.credit > 0 && <any>this.openingSource.debit > 0) || (<any>this.openingSource.credit == 0 && <any>this.openingSource.debit == 0)) {
      this.appService.openSnackBar('Please Enter Valid Amount', 'Warning');
      return;
    }

    var dVoucherAmount = 0;
    if (<any>this.openingSource.credit > 0)
      dVoucherAmount = (-1) * <any>this.openingSource.credit;
    else dVoucherAmount = <any>this.openingSource.debit;

    // var dVPrefixId = 0;
    // if (this.openingSource.headaType == 'CUSTOMER')
    //   dVPrefixId = 5;
    // else if (this.openingSource.headaType == 'SUPPLIER')
    //   dVPrefixId = 6;
    // else dVPrefixId = 7;

    let dVPrefixId = 10;
    let VoucherDetailsInfo = {};

    VoucherDetailsInfo["Voucher_Date"] = this.ConvertDateAll(this.openingSource.voucherDate);
    VoucherDetailsInfo["Voucher_Amt"] = dVoucherAmount;
    VoucherDetailsInfo["AC_Id"] = this.openingSource.accountHeadId;
    VoucherDetailsInfo["Voucher_Description1"] = '';
    VoucherDetailsInfo["Field1"] = this.anchorSource.invoiceNo;
    VoucherDetailsInfo["Field4"] = this.openingSource.headaType;
    VoucherDetailsInfo["RepId"] = 0;
    VoucherDetailsInfo["VPrefix_No"] = dVPrefixId;
    VoucherDetailsInfo["DelFlag"] = this.anchorSource.enterDate;
    VoucherDetailsInfo["Voucher_VoucherNo"] = this.openingSource.voucherNo;
    VoucherDetailsInfo["BranchId"] = this.dBranchId;
    VoucherDetailsInfo["UniqueVoucherId"] = this.openingSource.uniqueVoucherId;
    VoucherDetailsInfo["RepId"] = this.openingSource.salesmanId;
    VoucherDetailsInfo["Remarks"] = this.openingSource.remarks;
    VoucherDetailsInfo["BranchId"] = this.dBranchId;
    VoucherDetailsInfo["StaffId"] = this.dStaffId;

    let body = JSON.stringify(VoucherDetailsInfo);

    this.appService.post('/Accounts/fnOpeningBalanceEntry', body).subscribe(data => {
      this.appService.openSnackBar('Saved Successfully', 'Success');
      this.fnClear();
    });
  }

  fnClear() {
    this.openingSource = {
      uniqueVoucherId: 0, voucherNo: 0, accountHeadId: '', accountHeadName: '', address: '', headaType: 'CUSTOMER', remarks: '',
      voucherDate: new Date(), credit: 0, debit: 0, salesmanId: ''
    };
    this.anchorSource = {
      enterDate: new Date(), invoiceNo: 0
    }
  }

  fnAnchorClick(data) {

    var ServiceParams = {};
    ServiceParams['strProc'] = "OpeningBalanceEntry_Get";
    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "VPrefixId";
    ProcParams["strArgmt"] = data.VoucherPrefixNo;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "VoucherNo";
    ProcParams["strArgmt"] = data.VoucherNo1;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.dBranchId;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "UniqueVoucherId";
    ProcParams["strArgmt"] = data.UniqueVoucherId;
    oProcParams.push(ProcParams)

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this.appService.post('/CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      let JsonVoucherDetails = JSON.parse(data);
      var VoucherAmt: any = parseFloat(JsonVoucherDetails[0].VoucherAmt || 0);
      if (VoucherAmt > 0)
        this.openingSource.debit = VoucherAmt;
      else {
        VoucherAmt = (-1) * VoucherAmt
        this.openingSource.credit = VoucherAmt;
      }
      this.openingSource.uniqueVoucherId = JsonVoucherDetails[0].UniqueVoucherId
      this.openingSource.voucherNo = JsonVoucherDetails[0].VoucherNo;
      this.openingSource.accountHeadId = JsonVoucherDetails[0].AcId;
      this.openingSource.accountHeadName = JsonVoucherDetails[0].AC_Name;
      this.openingSource.address = JsonVoucherDetails[0].Addr1;
      this.openingSource.headaType = JsonVoucherDetails[0].AccountHeadType;
      this.openingSource.remarks = JsonVoucherDetails[0].Remarks;
      this.openingSource.voucherDate = new Date(JsonVoucherDetails[0].VoucherDate);
      this.openingSource.salesmanId = JsonVoucherDetails[0].SalesmanId;
      this.anchorSource.enterDate = new Date(JsonVoucherDetails[0].EnterDate)
      this.anchorSource.invoiceNo = JsonVoucherDetails[0].BillNo;
      this.createFlag = false;

    });
  }

  fnVoucherDelete() {
    if (!confirm("Are you sure you want to Delete  this Voucher?")) {
      return
    }

    var ServiceParams = {};
    ServiceParams['strProc'] = "OpeningBalanceEntry_Delete";
    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "VPrefixId";
    ProcParams["strArgmt"] = 10;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "VoucherNo";
    ProcParams["strArgmt"] = this.openingSource.voucherNo;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.dBranchId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "UniqueVoucherId";
    ProcParams["strArgmt"] = this.openingSource.uniqueVoucherId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this.appService.post('/CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      this.appService.openSnackBar('Deleted Successfully', 'Success');
      this.fnBack();
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
