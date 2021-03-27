import { AppService } from './../../../../app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-voucher',
  templateUrl: './payment-voucher.component.html',
  styleUrls: ['./payment-voucher.component.scss']
})
export class PaymentVoucherComponent implements OnInit {
  createFlag: boolean = true;
  fromDate = new Date();
  toDate = new Date();
  searchText: any = '';
  rdoValue = 'CASH';
  typeOfDate: any = 'EnterDate';
  paymentSource = {
    voucherNo: 0, uniqueVoucherId: 0, paymentType: 'CASH', selectBank: '', accountHeadId: '', address: '', paidAmount: 0,
    voucherDate: new Date(), outstanding: '', balanceAmt: 0, tdsperc: '', tdsAmt: '', salesmanId: '', remarks: '',
    voucherAmt: 0
  }
  bankSource = {
    bankId: '', bankName: '', chequeNo: '', chequeDate: new Date(), transferType: ''
  };
  dBranchId: any = localStorage.getItem("SessionBranchId");
  dStaffId: any = localStorage.getItem("SessionStaffId");
  voucherNo: any;
  salesManList: any;
  tempAccountHeadsList: any;
  selectAccountHeadFlag: boolean;
  filteredOptions: any = [];
  options: any;
  colAccHeader = [{ col: 'AC_Name', width: '230px' }, { col: 'Addr1', width: '230px' }];
  AccHeader = ['AccountHead Name', 'Address']
  AcName: any;
  colBankHeader = [{ col: 'BankName', width: '150px' }];
  BankHeader = ['Bank Name'];
  selectBankFlag: boolean;
  Balance: number;
  voucherList: any;

  constructor(public _appService: AppService) { }

  ngOnInit() {
    this.fnVoucherGets();
  }

  fnCreate() {
    this.createFlag = false;
    if (this.paymentSource.paymentType == 'CASH') {
      this.paymentSource.selectBank = 'CASH ACCOUNTS'
    } else {
      this.paymentSource.selectBank = ''
    }
    this.fnNextVoucherNo();
    setTimeout(() => {
      this.fngetSalesMan();
    }, 500);
  }

  fnNextVoucherNo() {
    var value;
    if (this.paymentSource.paymentType == 'CASH') {
      value = 4;
    } else {
      value = 2;
    }
    var ServiceParams = {};
    ServiceParams['strProc'] = "VoucherPrefix_GetVoucherNoOnVoucherId";
    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "Value";
    ProcParams["strArgmt"] = value.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.dBranchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      let jsonData = JSON.parse(data);
      this.voucherNo = jsonData[0].VoucherNo;
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
    ProcParams["strArgmt"] = this.dBranchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportNewAcc', body).subscribe(data => {
      this.salesManList = JSON.parse(data);
      this.fnSearchAccounthead();
    });
  }

  fnSearchAccounthead() {
    var ServiceParams = {};
    ServiceParams['strProc'] = "AccountHead_SearchForAccountReceipt";
    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "AC_Name";
    ProcParams["strArgmt"] = '';
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.dBranchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportNewAcc', body).subscribe(data => {
      let jsonData = JSON.parse(data);
      this.tempAccountHeadsList = jsonData;
    });
  }

  fnFilterAccountHead(eve) {
    if (!eve) {
      this.selectAccountHeadFlag = false;
      this.paymentSource.accountHeadId = '';
      return;
    }
    const filterValue = eve.toLowerCase();
    const data = this.tempAccountHeadsList.filter(res => res.AC_Name.toLowerCase().indexOf(filterValue) === 0);
    if (data.length > 0) {
      this.selectAccountHeadFlag = true;
      this.filteredOptions = data;
    } else {
      this.selectAccountHeadFlag = true;
      this.filteredOptions = [];
    }
    this.options = data;
  }
  fnSelectPaymentTypeChange(eve) {
    this.AcName = eve.AC_Name;
    this.paymentSource.accountHeadId = eve.AC_Id;
    this.selectAccountHeadFlag = false
    this.filteredOptions = [];
    let element = <HTMLInputElement>document.getElementById('paidAmount');
    element.focus();
    element.select();

    this.fnGetLeadgerBalanceOnAccountId();
  }

  fnpayamentTypeChange() {
    if (this.paymentSource.paymentType == 'CASH') {
      this.paymentSource.selectBank = 'CASH ACCOUNTS'
    } else {
      this.paymentSource.selectBank = ''
    }
    this.fnNextVoucherNo();
  }

  fnSearchBankName(eve) {
    if (eve == '' || eve == null) {
      this.selectBankFlag = false;
      this.filteredOptions = [];
      return
    }
    var ServiceParams = {};
    ServiceParams['strProc'] = "AccountHead_GetBanksNew";
    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "Search";
    ProcParams["strArgmt"] = eve;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.dBranchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      this.filteredOptions = JSON.parse(data);
      this.selectBankFlag = true;
    });
  }
  fnSelectBankChange(eve) {
    this.paymentSource.selectBank = eve.BankName;
    this.bankSource.bankId = eve.AC_Id;
    this.selectBankFlag = false;
    this.filteredOptions = [];
    let element = <HTMLInputElement>document.getElementById('selectbank');
    element.focus();
    element.select();
  }

  fnGetLeadgerBalanceOnAccountId() {
    var ServiceParams = {};
    ServiceParams['strProc'] = "GetLeaderAmtOnAcId";
    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.dBranchId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "AcId";
    ProcParams["strArgmt"] = this.paymentSource.accountHeadId.toString();
    oProcParams.push(ProcParams);
    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      let jsonData = JSON.parse(data);
      this.paymentSource.outstanding = jsonData[0].OpeningBalance;
      this.paymentSource.balanceAmt = jsonData[0].OpeningBalance;
      this.Balance = jsonData[0].OpeningBalance;
    });
  }

  fngetTotal() {
    let paidamt: any = this.paymentSource.paidAmount;
    let Balance: any = this.Balance;
    let tdsPerc: any = this.paymentSource.tdsperc;
    let tdsAmt: any = this.paymentSource.tdsAmt;
    let Voucher = this.paymentSource.voucherAmt;
    Balance = parseFloat(Balance || 0) - parseFloat(paidamt || 0);
    this.paymentSource.balanceAmt = Balance;

    tdsAmt = ((paidamt * tdsPerc) / 100);
    Voucher = paidamt - tdsAmt;
    this.paymentSource.voucherAmt = Voucher;
    this.paymentSource.tdsAmt = tdsAmt;
  }

  fnSave() {
    let chequeFlag;
    let dPrefixId;
    if (this.paymentSource.paymentType == 'CASH')
      dPrefixId = 2;
    else
      dPrefixId = 4;

    if (dPrefixId == 4 && this.bankSource.bankId == '') {
      this._appService.openSnackBar('Please Select The Bank', 'Warning');
      return;
    }
    if (this.paymentSource.paidAmount == 0 || this.paymentSource.paidAmount == null) {
      this._appService.openSnackBar('Please Enter The Paid Amount', 'Warning');
      return;
    }
    if (this.paymentSource.accountHeadId == '' || this.paymentSource.accountHeadId == null) {
      this._appService.openSnackBar('Please Select The AccountHead', 'Warning');
      return;
    }
    if (this.paymentSource.salesmanId == '' || this.paymentSource.salesmanId == null) {
      this._appService.openSnackBar('Please Select The Sales Man', 'Warning');
      return;
    }

    if (dPrefixId == 4 && this.paymentSource.paymentType == 'BANK') {
      var ServiceParams = {};
      ServiceParams['strProc'] = "ChequeNoExistsCheck";
      let oProcParams = [];

      let ProcParams = {};
      ProcParams["strKey"] = "ChequeNo";
      ProcParams["strArgmt"] = this.bankSource.chequeNo.toString();
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams["strKey"] = "Voucher_VoucherNo";
      ProcParams["strArgmt"] = this.paymentSource.voucherNo.toString();
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams["strKey"] = "UniqueVoucherId";
      ProcParams["strArgmt"] = this.paymentSource.uniqueVoucherId.toString();
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams["strKey"] = "BranchId";
      ProcParams["strArgmt"] = this.dBranchId;
      oProcParams.push(ProcParams);

      ServiceParams['oProcParams'] = oProcParams;
      let body = JSON.stringify(ServiceParams);

      this._appService.post('CommonQuery/fnGetDataReportNew', body).subscribe(data => {
        let jsonData = JSON.parse(data);
        if (jsonData.length != 0) {
          chequeFlag = 'No'
        }
      });
    }
    if (chequeFlag == 'No') {
      this._appService.openSnackBar('Cheque No Already Exist', 'Warning');
      return;
    }

    var ListOutstandingInfo = [];

    let OutstandingInfo = {}
    OutstandingInfo["VType_SlNo"] = 0;
    OutstandingInfo["Voucher_VoucherNo"] = this.paymentSource.voucherNo;
    OutstandingInfo["ReceiveAmt"] = this.paymentSource.paidAmount;
    OutstandingInfo["DisAmt"] = 0;
    OutstandingInfo["RetAmt"] = this.paymentSource.outstanding;
    OutstandingInfo["BillNo"] = 0;
    OutstandingInfo["UniqueNo"] = 0;
    OutstandingInfo["Issue_Amount"] = this.paymentSource.voucherAmt;
    OutstandingInfo["UniqueVoucherId"] = this.paymentSource.uniqueVoucherId;
    ListOutstandingInfo.push(OutstandingInfo);

    var ListVoucherDetailsInfo = [];
    let VoucherDetailsInfo = {};

    VoucherDetailsInfo["Voucher_Date"] = this.ConvertDateAll(this.paymentSource.voucherDate);
    VoucherDetailsInfo["Voucher_ChequeNo"] = this.bankSource.chequeNo;
    VoucherDetailsInfo["Voucher_ChequeDate"] = this.ConvertDateAll(this.bankSource.chequeDate);
    VoucherDetailsInfo["Voucher_Amt"] = this.paymentSource.voucherAmt;
    VoucherDetailsInfo["Voucher_BankName"] = this.paymentSource.selectBank;
    VoucherDetailsInfo["VPrefix_No"] = dPrefixId;
    VoucherDetailsInfo["AC_Id"] = this.paymentSource.accountHeadId;
    VoucherDetailsInfo["Voucher_Description2"] = '';
    VoucherDetailsInfo["BalanceAmt"] = this.paymentSource.balanceAmt;
    VoucherDetailsInfo["BankId"] = parseFloat(<any>this.bankSource.bankId || 0);
    VoucherDetailsInfo["RepId"] = this.paymentSource.salesmanId;
    VoucherDetailsInfo["BranchId"] = parseFloat(this.dBranchId || 0);
    VoucherDetailsInfo["StaffId"] = parseFloat(this.dStaffId || 0);
    VoucherDetailsInfo["Voucher_VoucherNo"] = this.paymentSource.voucherNo;
    VoucherDetailsInfo["UniqueVoucherId"] = this.paymentSource.uniqueVoucherId;
    VoucherDetailsInfo["NoField1"] = 0;
    VoucherDetailsInfo["Field4"] = this.paymentSource.paymentType;
    VoucherDetailsInfo["VoucherGroupId"] = 0;
    VoucherDetailsInfo["Voucher_TDSPers"] = parseFloat(<any>this.paymentSource.tdsperc || 0);
    VoucherDetailsInfo["Voucher_TDSAmt"] = this.paymentSource.tdsAmt;
    VoucherDetailsInfo["Voucher_NoField2"] = parseFloat(<any>this.paymentSource.paidAmount || 0);
    VoucherDetailsInfo["Remarks"] = this.paymentSource.remarks;
    ListVoucherDetailsInfo.push(VoucherDetailsInfo);

    var ListCommisionAdjLogInfo = [];
    let CommisionAdjLogInfo = {}
    CommisionAdjLogInfo["AcId"] = this.paymentSource.accountHeadId;
    CommisionAdjLogInfo["VPrefixId"] = dPrefixId;
    CommisionAdjLogInfo["VoucherNo"] = this.paymentSource.voucherNo;
    CommisionAdjLogInfo["UniqueVoucherId"] = this.paymentSource.uniqueVoucherId;
    CommisionAdjLogInfo["AdjVPrefixId"] = 0;
    CommisionAdjLogInfo["AdjVoucherNo"] = 0;
    CommisionAdjLogInfo["AdjUniqueVoucherId"] = 0;
    CommisionAdjLogInfo["Amount"] = 0;
    CommisionAdjLogInfo["BranchId"] = parseFloat(this.dBranchId || 0);
    CommisionAdjLogInfo["AdjFlag"] = 'Yes';
    CommisionAdjLogInfo["AdjDate"] = '';
    CommisionAdjLogInfo["Narration1"] = '';
    CommisionAdjLogInfo["Narration2"] = '';
    CommisionAdjLogInfo["BillDate"] = this.paymentSource.voucherDate;
    ListCommisionAdjLogInfo.push(CommisionAdjLogInfo);

    VoucherDetailsInfo['ListOutstandingInfo'] = ListOutstandingInfo;
    VoucherDetailsInfo['ListCommisionAdjLogInfo'] = ListCommisionAdjLogInfo;

    let body = JSON.stringify(VoucherDetailsInfo);
    this._appService.post('Accounts/fnPaymentSave', body).subscribe(data => {
      this._appService.openSnackBar('Saved Successfully', 'Success');
      this.fnClear();
    })
  }
  fnClear() {
    this.paymentSource = {
      voucherNo: 0, uniqueVoucherId: 0, paymentType: 'CASH', selectBank: '', accountHeadId: '', address: '', paidAmount: 0,
      voucherDate: new Date(), outstanding: '', balanceAmt: 0, tdsperc: '', tdsAmt: '', salesmanId: '', remarks: '',
      voucherAmt: 0
    }
    this.bankSource = {
      bankId: '', bankName: '', chequeNo: '', chequeDate: new Date(), transferType: ''
    };
    this.Balance = 0;
    this.AcName = '';
    if (this.paymentSource.paymentType == 'CASH') {
      this.paymentSource.selectBank = 'CASH ACCOUNTS'
    } else {
      this.paymentSource.selectBank = ''
    }
  }
  ConvertDateAll(format) {
    let date = ("0" + format.getDate()).slice(-2);
    let month = ("0" + (format.getMonth() + 1)).slice(-2);
    let year = format.getFullYear();
    const dateconvert = year + '-' + month + '-' + date;
    return dateconvert;
  }
  fnVoucherGets() {
    var dPrefixId = 0;
    if (this.rdoValue == 'CASH')
      dPrefixId = 2;
    else
      dPrefixId = 4;

    var ServiceParams = {};
    ServiceParams['strProc'] = 'VoucherDetails_GetsNew';
    ServiceParams['JsonFileName'] = 'JsonArrayScriptOne';
    var oProcParams = [];
    var ProcParams = {};

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsFromDate';
    ProcParams['strArgmt'] = this.ConvertDateAll(this.fromDate);
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsToDate';
    ProcParams['strArgmt'] = this.ConvertDateAll(this.toDate);
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@Paramssearch';
    ProcParams['strArgmt'] = this.searchText;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsVoucherPrefixId';
    ProcParams['strArgmt'] = dPrefixId.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsDateCondition';
    ProcParams['strArgmt'] = this.typeOfDate;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsBranchId';
    ProcParams['strArgmt'] = this.dBranchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams)

    this._appService.post('CommonQuery/fnGetDataReportFromScriptJsonFile', body).subscribe(data => {
      let jsonData = JSON.parse(data.JsonDetails[0]);
      this.voucherList = jsonData;
    });
  }
  fnBack() {
    this.fnClear();
    this.fnVoucherGets();
    this.createFlag = true;
  }
  fnAnchorClick(data) {
    this.createFlag = false;
    var varArguements = {};
    varArguements = { VoucherNo: data.VoucherNo1, PrefixId: data.VoucherPrefixNo, UniqueVoucherId: data.UniqueVoucherId, BranchId: this.dBranchId };
    var DictionaryObject = {};
    DictionaryObject["dictArgmts"] = varArguements;
    DictionaryObject["ProcName"] = 'AccountLogFile_Get';

    let body = JSON.stringify(DictionaryObject);

    this._appService.post('Accounts/fnOutstandingPaidAmtForCopy', body).subscribe(data => {
      this.fngetSalesMan();
      let AdjustBill = JSON.parse(data.AdjustBill);
      let BankDetails = JSON.parse(data.BankDetails);
      let VoucherDetails = JSON.parse(data.VoucherDetails);

      this.paymentSource = {
        voucherNo: VoucherDetails[0].Voucher_VoucherNo,
        uniqueVoucherId: VoucherDetails[0].Voucher_VoucherNo,
        paymentType: 'CASH',
        selectBank: VoucherDetails[0].Voucher_Field7,
        accountHeadId: VoucherDetails[0].AC_Id,
        address: VoucherDetails[0].Addr1,
        paidAmount: VoucherDetails[0].Voucher_NoField2,
        voucherDate: new Date(VoucherDetails[0].Voucher_Date),
        outstanding: '0',
        balanceAmt: 0,
        tdsperc: VoucherDetails[0].Voucher_TDSPers,
        tdsAmt: VoucherDetails[0].Voucher_TDSAmt,
        salesmanId: VoucherDetails[0].RepId.toString(),
        remarks: VoucherDetails[0].Remarks,
        voucherAmt: VoucherDetails[0].Voucher_Amt
      }
      //---------Old Codes------------
      // this.paymentSource = {
      //   voucherNo: VoucherDetails[0].Voucher_VoucherNo,
      //   uniqueVoucherId: VoucherDetails[0].Voucher_VoucherNo,
      //   paymentType: 'CASH',
      //   selectBank: VoucherDetails[0].Voucher_Field7,
      //   accountHeadId: VoucherDetails[0].AC_Id,
      //   address: VoucherDetails[0].Addr1,
      //   paidAmount: VoucherDetails[0].Voucher_NoField2,
      //   voucherDate: new Date(VoucherDetails[0].Voucher_Date),
      //   outstanding: AdjustBill[0].ReturnAmt,
      //   balanceAmt: AdjustBill[0].BalanceAmt,
      //   tdsperc: VoucherDetails[0].Voucher_TDSPers,
      //   tdsAmt: VoucherDetails[0].Voucher_TDSAmt,
      //   salesmanId: VoucherDetails[0].RepId.toString(),
      //   remarks: VoucherDetails[0].Remarks,
      //   voucherAmt: VoucherDetails[0].Voucher_Amt
      // }

      if (VoucherDetails[0].VPrefix_No == 2) {
        this.paymentSource.paymentType = 'CASH'
      } else {
        this.paymentSource.paymentType = 'BANK'
      }

      this.AcName = VoucherDetails[0].AC_Name;
      this.voucherNo = VoucherDetails[0].Voucher_VoucherNo;
      this.bankSource = {
        bankId: '',
        bankName: VoucherDetails[0].Voucher_BankName,
        chequeNo: VoucherDetails[0].Voucher_ChequeNo,
        chequeDate: new Date(VoucherDetails[0].Voucher_ChequeDate),
        transferType: VoucherDetails[0].Field4
      };
    })
  }
}
