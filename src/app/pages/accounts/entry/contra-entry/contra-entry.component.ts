import { AppService } from './../../../../app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contra-entry',
  templateUrl: './contra-entry.component.html',
  styleUrls: ['./contra-entry.component.scss']
})
export class ContraEntryComponent implements OnInit {
  createFlag: boolean = true;
  fromDate = new Date();
  toDate = new Date();
  voucherDate = new Date();
  searchtext = ''
  branchId: any = localStorage.getItem('SessionBranchId');
  StaffId: any = localStorage.getItem("SessionStaffId");
  voucherNo: any;
  salesManList: any;
  contraEntryList: any;
  contraFromFlag: boolean;
  contraToFlag: boolean;
  filteredOptions: any = [];
  ColContraFromHeader = [{ col: 'AC_Name', width: '230px' }, { col: 'Addr1', width: '230px' }];
  ContraFromHeader = ['Name', 'Address'];
  ColContraToHeader = [{ col: 'AC_Name', width: '230px' }, { col: 'Addr1', width: '230px' }];
  ContraToHeader = ['Name', 'Address'];
  options: any;
  contraSource = {
    voucherNo: 0, voucherDate: new Date(), remarks: '', salesmanId: '', accountHeadId1: '', accountHeadName1: '',
    accountHeadAddress1: '', accountHeadCredit: 0, accountHeadledgerBal1: '',
    accountHeadId2: '', accountHeadName2: '',
    accountHeadAddress2: '', accountHeadDebit: 0, accountHeadledgerBal2: '', uniqueVoucherId: 0,
  }
  contraList: any;

  constructor(public _appService: AppService) { }

  ngOnInit() {
    this.fnVoucherGets();
  }
  fnCreate() {
    this.createFlag = false;
    this.fnNextVoucherNo();
  }
  fnNextVoucherNo() {
    var value = 8;
    var ServiceParams = {};
    ServiceParams['strProc'] = "VoucherPrefix_GetVoucherNoOnVoucherId";
    let oProcParams = [];
    let ProcParams = {};

    ProcParams["strKey"] = "Value";
    ProcParams["strArgmt"] = value.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.branchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      let jsonData = JSON.parse(data);
      this.voucherNo = jsonData[0].VoucherNo;
      this.fngetSalesMan();
    });

  }

  fngetSalesMan() {
    var ServiceParams = {};
    ServiceParams['strProc'] = "SalesExecutive_GetsNew";
    let oProcParams = [];
    let ProcParams = {};

    ProcParams["strKey"] = "SalesExe_Name";
    ProcParams["strArgmt"] = "";
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.branchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportNewAcc', body).subscribe(data => {
      let jsonData = JSON.parse(data);
      this.salesManList = jsonData;
      this.fnSearchForContraEntry();
    });
  }

  fnSearchForContraEntry() {
    var ServiceParams = {};
    ServiceParams['strProc'] = "AccountHead_SearchForContraEntry";
    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "AC_Name";
    ProcParams["strArgmt"] = '';
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.branchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      this.contraEntryList = JSON.parse(data);
    });
  }

  fnFilterFromContra(eve) {
    if (!eve) {
      this.contraFromFlag = false;
      // this.paymentSource.accountHeadId = '';
      return;
    }
    const filterValue = eve.toLowerCase();
    const data = this.contraEntryList.filter(res => res.AC_Name.toLowerCase().indexOf(filterValue) === 0);
    if (data.length > 0) {
      this.contraFromFlag = true;
      this.filteredOptions = data;
    } else {
      this.contraFromFlag = true;
      this.filteredOptions = [];
    }
    this.options = data;
  }

  fnFilterToContra(eve) {
    if (!eve) {
      this.contraToFlag = false;
      // this.paymentSource.accountHeadId = '';
      return;
    }
    const filterValue = eve.toLowerCase();
    const data = this.contraEntryList.filter(res => res.AC_Name.toLowerCase().indexOf(filterValue) === 0);
    if (data.length > 0) {
      this.contraToFlag = true;
      this.filteredOptions = data;
    } else {
      this.contraToFlag = true;
      this.filteredOptions = [];
    }
    this.options = data;
  }

  fnContraFromChange(eve) {
    this.contraSource.accountHeadId1 = eve.AC_Id;
    this.contraSource.accountHeadName1 = eve.AC_Name;
    this.contraSource.accountHeadAddress1 = eve.Addr1;
    this.contraSource.accountHeadledgerBal1 = eve.Addr1;
    this.fnGetLeadgerBalanceOnAccountId(eve.AC_Id, eve.AC_Name);
    this.contraFromFlag = false;
    this.filteredOptions = [];
    let element = <HTMLInputElement>document.getElementById('credit');
    element.focus();
    element.select();
  }

  fnContraToChange(eve) {
    this.contraSource.accountHeadId2 = eve.AC_Id;
    this.contraSource.accountHeadName2 = eve.AC_Name;
    this.contraSource.accountHeadAddress2 = eve.Addr1;
    this.contraSource.accountHeadledgerBal2 = eve.Addr1;
    this.fnGetLeadgerBalanceOnAccountId(eve.AC_Id, eve.AC_Name);
    this.contraToFlag = false;
    this.filteredOptions = [];
    let element = <HTMLInputElement>document.getElementById('debit');
    element.focus();
    element.select();
  }

  fnGetLeadgerBalanceOnAccountId(AcId, Name) {
    var ServiceParams = {};
    ServiceParams['strProc'] = "GetLeaderAmtOnAcId";
    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.branchId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "AcId";
    ProcParams["strArgmt"] = AcId.toString();
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      let jsonData = JSON.parse(data);
      if (Name == this.contraSource.accountHeadName1 && AcId == this.contraSource.accountHeadId1) {
        this.contraSource.accountHeadledgerBal1 = jsonData[0].OpeningBalance;
      } else if (Name == this.contraSource.accountHeadName2 && AcId == this.contraSource.accountHeadId2)
        this.contraSource.accountHeadledgerBal2 = jsonData[0].OpeningBalance;
    });
  }

  fnSave() {
    var dPrefixId = 8;
    if (this.contraSource.accountHeadCredit == 0 || this.contraSource.accountHeadCredit == null) {
      this._appService.openSnackBar('Please Enter The Credit Amount', 'Warning');
      return;
    }
    if (this.contraSource.remarks == '' || this.contraSource.remarks == null) {
      this._appService.openSnackBar('Please Enter The narration', 'Warning');
      return;
    }
    if (this.contraSource.accountHeadDebit == 0 || this.contraSource.accountHeadDebit == null) {
      this._appService.openSnackBar('Please Enter The Debit Amount', 'Warning');
      return;
    }
    if (this.contraSource.accountHeadCredit != this.contraSource.accountHeadDebit) {
      this._appService.openSnackBar('Please Enter The Valid Amount', 'Warning');
      return;
    }
    if (this.contraSource.accountHeadId1 == this.contraSource.accountHeadId2) {
      this._appService.openSnackBar('Cannot Be Same AccountHead On the Field', 'Warning');
      return;
    }
    if ((this.contraSource.accountHeadId1 == '' || this.contraSource.accountHeadId1 == null) || (this.contraSource.accountHeadId2 == '' || this.contraSource.accountHeadId2 == null)) {
      this._appService.openSnackBar('please Select Valid Accounthead..', 'Warning');
      return;
    }

    var ListOutstandingInfo = [];
    let OutstandingInfo = {}
    OutstandingInfo["VType_SlNo"] = 0;
    OutstandingInfo["Voucher_VoucherNo"] = this.contraSource.voucherNo;
    OutstandingInfo["ReceiveAmt"] = 0;
    OutstandingInfo["DisAmt"] = 0;
    OutstandingInfo["RetAmt"] = 0;
    OutstandingInfo["BillNo"] = 0;
    OutstandingInfo["UniqueNo"] = 0;
    OutstandingInfo["Issue_Amount"] = 0;
    OutstandingInfo["AcId"] = 0;
    OutstandingInfo["UniqueVoucherId"] = this.contraSource.uniqueVoucherId;;
    ListOutstandingInfo.push(OutstandingInfo);

    var ListVoucherDetailsInfo = [];
    let VoucherDetailsInfo = {};
    VoucherDetailsInfo["Voucher_Date"] = this.ConvertDateAll(this.voucherDate);
    VoucherDetailsInfo["Voucher_ChequeNo"] = ""
    VoucherDetailsInfo["Voucher_ChequeDate"] = this.ConvertDateAll(this.voucherDate);
    VoucherDetailsInfo["Voucher_Amt"] = (-1) * parseFloat(<any>this.contraSource.accountHeadCredit || 0);
    VoucherDetailsInfo["Voucher_BankName"] = ""
    VoucherDetailsInfo["VPrefix_No"] = dPrefixId;
    VoucherDetailsInfo["AC_Id"] = this.contraSource.accountHeadId1;
    VoucherDetailsInfo["RevAC_Id"] = this.contraSource.accountHeadId2;
    VoucherDetailsInfo["Voucher_Description2"] = this.contraSource.remarks;
    VoucherDetailsInfo["BalanceAmt"] = 0;
    VoucherDetailsInfo["BankId"] = 0;
    VoucherDetailsInfo["RepId"] = 0;
    VoucherDetailsInfo["BranchId"] = parseFloat(this.branchId || 0);
    VoucherDetailsInfo["StaffId"] = parseFloat(this.StaffId || 0);
    VoucherDetailsInfo["Voucher_VoucherNo"] = this.contraSource.voucherNo;
    VoucherDetailsInfo["RepId"] = parseFloat(<any>this.contraSource.salesmanId || 0);
    VoucherDetailsInfo["UniqueVoucherId"] = this.contraSource.uniqueVoucherId;
    VoucherDetailsInfo["VoucherGroupId"] = 0;
    VoucherDetailsInfo["Remarks"] = this.contraSource.remarks;
    VoucherDetailsInfo["ListOutstandingInfo"] = ListOutstandingInfo;
    ListVoucherDetailsInfo.push(VoucherDetailsInfo);

    VoucherDetailsInfo = {};

    VoucherDetailsInfo["Voucher_Date"] = this.ConvertDateAll(this.voucherDate);
    VoucherDetailsInfo["Voucher_ChequeNo"] = ""
    VoucherDetailsInfo["Voucher_ChequeDate"] = this.ConvertDateAll(this.voucherDate);
    VoucherDetailsInfo["Voucher_Amt"] = parseFloat(<any>this.contraSource.accountHeadDebit || 0);
    VoucherDetailsInfo["Voucher_BankName"] = ""
    VoucherDetailsInfo["VPrefix_No"] = dPrefixId;
    VoucherDetailsInfo["AC_Id"] = this.contraSource.accountHeadId2;
    VoucherDetailsInfo["RevAC_Id"] = this.contraSource.accountHeadId1;
    VoucherDetailsInfo["Voucher_Description2"] = this.contraSource.remarks;
    VoucherDetailsInfo["BalanceAmt"] = 0;
    VoucherDetailsInfo["BankId"] = 0;
    VoucherDetailsInfo["RepId"] = 0;
    VoucherDetailsInfo["BranchId"] = parseFloat(this.branchId || 0);
    VoucherDetailsInfo["StaffId"] = parseFloat(this.StaffId || 0);
    VoucherDetailsInfo["Voucher_VoucherNo"] = this.contraSource.voucherNo;
    VoucherDetailsInfo["UniqueVoucherId"] = this.contraSource.uniqueVoucherId;
    VoucherDetailsInfo["VoucherGroupId"] = 0;
    VoucherDetailsInfo["Remarks"] = this.contraSource.remarks;
    VoucherDetailsInfo["ListOutstandingInfo"] = ListOutstandingInfo;
    ListVoucherDetailsInfo.push(VoucherDetailsInfo);

    let body = JSON.stringify(ListVoucherDetailsInfo);
    this._appService.post('Accounts/fnContraEntrySaveVoucher', body).subscribe(data => {
      this._appService.openSnackBar('Saved Successfully', 'Success');
      this.fnNextVoucherNo();
      this.fnClear();
    })

  }
  fnClear() {
    this.contraSource = {
      voucherNo: 0, voucherDate: new Date(), remarks: '', salesmanId: '', accountHeadId1: '', accountHeadName1: '',
      accountHeadAddress1: '', accountHeadCredit: 0, accountHeadledgerBal1: '',
      accountHeadId2: '', accountHeadName2: '',
      accountHeadAddress2: '', accountHeadDebit: 0, accountHeadledgerBal2: '', uniqueVoucherId: 0,
    }

  }

  fnVoucherGets() {
    var dPrefixId = 8;

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
    ProcParams["strArgmt"] = dPrefixId.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.branchId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "search";
    ProcParams["strArgmt"] = this.searchtext;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      let jsonData = JSON.parse(data);
      this.contraList = jsonData
    });
  }
  fnBack() {
    this.createFlag = true;
    this.fnVoucherGets();
    this.fnClear();
  }
  fnAnchorClick(data) {
    this.createFlag = false;
    var varArguements = {};
    varArguements = {
      VoucherNo: data.VoucherNo1, PrefixId: data.VoucherPrefixNo, UniqueVoucherId: data.UniqueVoucherId, BranchId: this.branchId
    };
    var DictionaryObject = {};
    DictionaryObject["dictArgmts"] = varArguements;
    DictionaryObject["ProcName"] = 'AccountLogFile_GetJournalEntry';

    let body = JSON.stringify(DictionaryObject);
    this._appService.post('Accounts/fnJournalEntryCopies', body).subscribe(data => {
      var jsonAdjustedBill = JSON.parse(data.AdjustBill);
      var JsonVoucherDetails = JSON.parse(data.VoucherDetails);
      var VoucherAmount = JSON.parse(JsonVoucherDetails[0].Voucher_Amt || 0);

      this.contraSource.voucherNo = JsonVoucherDetails[0].Voucher_VoucherNo;
      this.contraSource.voucherDate = new Date(JsonVoucherDetails[0].Voucher_Date);
      this.contraSource.remarks = JsonVoucherDetails[0].Remarks;
      this.contraSource.salesmanId = JsonVoucherDetails[0].RepId;

      if (VoucherAmount < 0) {
        VoucherAmount = (-1) * VoucherAmount;
        this.contraSource.accountHeadId1 = JsonVoucherDetails[0].AC_Id;
        this.contraSource.accountHeadName1 = JsonVoucherDetails[0].AC_Name;
        this.contraSource.accountHeadAddress1 = JsonVoucherDetails[0].Addr1;
        this.contraSource.accountHeadCredit = VoucherAmount;
        this.contraSource.accountHeadledgerBal1 = ''
        this.contraSource.accountHeadId2 = JsonVoucherDetails[0].RevAC_Id;
        this.contraSource.accountHeadName2 = JsonVoucherDetails[0].RevAccountName;
        this.contraSource.accountHeadAddress2 = JsonVoucherDetails[0].RevAddress;
        this.contraSource.accountHeadDebit = VoucherAmount;
        this.contraSource.accountHeadledgerBal2 = '';
        this.contraSource.uniqueVoucherId = JsonVoucherDetails[0].UniqueVoucherId;
      } else {
        VoucherAmount = (-1) * VoucherAmount;
        this.contraSource.accountHeadId1 = JsonVoucherDetails[0].AC_Id;
        this.contraSource.accountHeadName1 = JsonVoucherDetails[0].AC_Name;
        this.contraSource.accountHeadAddress1 = JsonVoucherDetails[0].Addr1;
        this.contraSource.accountHeadCredit = VoucherAmount;
        this.contraSource.accountHeadledgerBal1 = ''
        this.contraSource.accountHeadId2 = JsonVoucherDetails[0].RevAC_Id;
        this.contraSource.accountHeadName2 = JsonVoucherDetails[0].RevAccountName;
        this.contraSource.accountHeadAddress2 = JsonVoucherDetails[0].RevAddress;
        this.contraSource.accountHeadDebit = VoucherAmount;
        this.contraSource.accountHeadledgerBal2 = '';
        this.contraSource.uniqueVoucherId = JsonVoucherDetails[0].UniqueVoucherId;
      }

      // var AcIdCustomerType = JsonVoucherDetails[0].AccountHeadTypeOnAcId;
      // let AccountHeadTypeOnRevAcId = JsonVoucherDetails[0].AccountHeadTypeOnRevAcId;


    })
  }

  ConvertDateAll(format) {
    let date = ("0" + format.getDate()).slice(-2);
    let month = ("0" + (format.getMonth() + 1)).slice(-2);
    let year = format.getFullYear();
    const dateconvert = year + '-' + month + '-' + date;
    return dateconvert;
  }
}
