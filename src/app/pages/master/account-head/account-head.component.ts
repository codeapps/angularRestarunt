import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { AccountHeadService } from './account-head.service';
import { AreaService } from '../area/area.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-account-head',
  templateUrl: './account-head.component.html',
  styleUrls: ['./account-head.component.scss']
})
export class AccountHeadComponent implements OnInit {
  @ViewChild('myinput') myinputField: ElementRef;

  createFlag: boolean = true;
  dbBranchId = localStorage.getItem("SessionBranchId");
  dStaffId = localStorage.getItem("SessionStaffId");
  accesslevel = localStorage.getItem("SessionAccessLevelId")
  accountheadList: any; typeOfHead: any = 'Customer'; searchText: any = '';
  // typeFields: any = [{ Type: 'Customer', Active: false }, { Type: 'Supplier', Active: false },
  // { Type: 'Agent', Active: false }, { Type: 'Salesman', Active: false }, { Type: 'Staff', Active: false }
  //   , { Type: 'Login', Active: false }]
  scheduleList: any; stateList: any; areaList: any; categoryList: any; date = new Date(); currencyList: any;
  priceMenuList: any; taxesList: any; onLoadFlag = true; customerFlag = false; supplierFlag = false;
  agentFlag = false; salesManFlag = false; staffFlag = false; loginFlag = false; addressFlag = true;
  outStandingFlag = false
  accountSource = {
    AC_Id: 0, AdjAmount: 0, AC_Name: '', Addr1: '', Addr2: '', Addr3: '', DescEditFlag: 'KERALA', Phone: '', Mobile: '', Email: '',
    Web: '', Transporter: '', Fax: '', DLNo1: '', DLNo2: '', Tin1: '', Tin2: '', CstNo1: '', CrLmtDays: 0, CrLmtAmt: 0,
    CustOrSupp: 'Main', AreaId: 0, Alias: '', Type: '', OBalance: 0, ScheduleType: 0, Schedule1: 32, Schedule2: 0,
    Schedule3: 0, EntryMatch: '', BankYesNo: '', Flag: 'No', UserID: 0, CreateDate: '', BranchId: this.dbBranchId,
    PurType: '', CategoryId: 0, StartDate: new Date().toISOString(), ExpiryDate: new Date().toISOString(), DateOfBirth: '', IntroducedBy: '',
    Currency: '', IFSCode: '', ModelPoint: 0, ModelPointAmt: 0, PriceMenuId: 0, AgentPriceMenuId: 0, CustomerFlag: false,
    SupplierFlag: false, StaffFlag: false, LoginFlag: false, AgentFlag: false,
    SalesmanFlag: false, ActiveFlag: 1, MediaId: 0, CurrencyId: 0, Field1: '', Field2: '', Field3: '',
    UserName: '', Pwd: '', UniqueDeviceId: '', OtherFlag: false, AccessLevel: this.accesslevel, AgentMarginPers: 0, bSelect: false,
    Schedule4: 0
  }
  radioValue = '';

  constructor(public _appService: AppService, private _accService: AccountHeadService,
    public _areaService: AreaService, public dialog: MatDialog,
    public dialogRef: MatDialogRef<AccountHeadComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogueData: any) {


    }

  ngOnInit() {
    // this.fnAccountGets();
    const _dialogfield = this.dialogueData.params;
    if (_dialogfield) {
      if (_dialogfield == 'salesman') {

        this.salesManFlag = true;
      } else {
        this.customerFlag = true;
      }
    }

  }

  close() {
    this.dialogRef.close();
  }

  fnCreate() {
    this.createFlag = true;
    this.addressFlag = true;
   setTimeout(() => {
    this.myinputField.nativeElement.focus();
   }, 200);
  }

  fnsearchText(eve) {
    this.searchText = eve.target.value;
    this.fnAccountGets();
  }

  fnAccountGets() {
    this._accService.fnAccountGets(this.typeOfHead, this.searchText)
      .subscribe(data => {
        this.accountheadList = JSON.parse(data);
        this.fnSchduleGets();
      });
  }

  fnAnchorClick(data) {

    this._accService.onAccHeadGetsAll(data)
      .subscribe(data => {
      this.fngetAnchorAll(data);
    });
  }

  fngetAnchorAll(data) {
    this.createFlag = true;

    this.customerFlag = data[0].CustomerFlag;
    this.agentFlag = data[0].AgentFlag;
    this.salesManFlag = data[0].SalesmanFlag;
    this.loginFlag = data[0].LoginFlag;
    this.supplierFlag = data[0].SupplierFlag;
    this.staffFlag = data[0].StaffFlag;

    this.accountSource = {
      AC_Id: data[0].AcId, AdjAmount: data[0].AdjAmount, AC_Name: data[0].AcName, Addr1: data[0].Addr1,
      Addr2: data[0].Addr2, Addr3: data[0].Addr3, DescEditFlag: data[0].DescEditFlag, Phone: data[0].Phone,
      Mobile: data[0].Mobile, Email: data[0].Email, Web: data[0].Web, Transporter: data[0].Transporter,
      Fax: data[0].Fax, DLNo1: data[0].Dlno1, DLNo2: data[0].Dlno2, Tin1: data[0].Tin1, Tin2: data[0].Tin2,
      CstNo1: data[0].CstNo1, CrLmtDays: data[0].CrLmtDays, CrLmtAmt: data[0].CrLmtAmt, CustOrSupp: data[0].CustOrSupp,
      Alias: data[0].Alias, Type: data[0].Type, OBalance: data[0].OBalance, ScheduleType: data[0].ScheduleType,
      Schedule1: data[0].Schedule1, Schedule2: data[0].Schedule2, AreaId: data[0].AreaId,
      Schedule3: data[0].Schedule3, EntryMatch: data[0].EntryMatch, BankYesNo: data[0].BankYesNo, Flag: data[0].Flag,
      UserID: data[0].UserID, CreateDate: data[0].CreateDate, BranchId: this.dbBranchId,
      PurType: data[0].PurType, CategoryId: data[0].CategoryId, StartDate: data[0].StartDate,
      ExpiryDate: data[0].ExpiryDate, DateOfBirth: data[0].DateOfBirth, IntroducedBy: data[0].IntroducedBy,
      Currency: data[0].Currency, IFSCode: data[0].IFSCode, ModelPoint: data[0].ModelPoint, ModelPointAmt: data[0].ModelPointAmt,
      PriceMenuId: data[0].PriceMenuId, AgentPriceMenuId: data[0].AgentPriceMenuId, CustomerFlag: data[0].CustomerFlag,
      SupplierFlag: data[0].SupplierFlag, StaffFlag: data[0].StaffFlag, LoginFlag: data[0].LoginFlag, AgentFlag: data[0].AgentFlag,
      SalesmanFlag: data[0].SalesmanFlag, ActiveFlag: data[0].ActiveFlag, MediaId: data[0].MediaId,
      CurrencyId: data[0].CurrencyId, Field1: data[0].Field1, Field2: data[0].Field2, Field3: data[0].Field3,
      UserName: data[0].UserName, Pwd: data[0].Pwd, UniqueDeviceId: data[0].UniqueDeviceId, OtherFlag: data[0].OtherFlag,
      AccessLevel: this.accesslevel, AgentMarginPers: data[0].AgentMarginPers, bSelect: data[0].BSelect, Schedule4: data[0].Schedule4
    }

  }

  fnSchduleGets() {
    let ServiceParams = {};
    ServiceParams['strProc'] = "Head_GET_HIERARCHY";

    let body = JSON.stringify(ServiceParams);
    this._appService.post('CommonQuery/fnGetDataReport', body).subscribe(data => {
      this.scheduleList = JSON.parse(data);
      this.getStates();
    });
  }

  getStates() {
    this._appService.get('GetRepository/StateGet')
      .subscribe(data => {
        this.stateList = data;
        this.fnAreaGets();
      }, error => console.error(error));
  }

  fnAreaGets() {
    this._areaService.fnAreaGets('').subscribe(data => {
      this.areaList = JSON.parse(data);
      this.fnCategoryGets();
    });
  }

  fnCategoryGets() {
    let id = 13;
    this._appService.get(`GetRepository/Category_GetOnTypeId?typeId=${id}`).subscribe(data => {
      this.categoryList = data;
      this.fngetCurrency();
    });
  }

  fngetCurrency() {
    let ServiceParams = {};
    ServiceParams['strProc'] = "CurrencyMaster_Gets";
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReport', body).subscribe(data => {
      this.currencyList = JSON.parse(data);
    });
    this.fngetPriceMenuList();
  }

  fngetPriceMenuList() {
    var ServiceParams = {};
    ServiceParams['strProc'] = "PriceMenu_Gets";
    let body = JSON.stringify(ServiceParams);
    this._appService.post('CommonQuery/fnGetDataReport', body).subscribe(data => {
      this.priceMenuList = JSON.parse(data);
    });
    this.fnGetTaxGroups();
  }

  fnGetTaxGroups() {
    var ServiceParams = {};
    ServiceParams['strProc'] = "TaxGroup_GetsNew";
    let body = JSON.stringify(ServiceParams)

    this._appService.post('CommonQuery/fnGetDataReport', body).subscribe(data => {
      this.taxesList = JSON.parse(data);
    })
  }
  fnCustomerChange(eve) {
    this.accountSource.BankYesNo = '';
    this.accountSource.CustomerFlag = eve.checked;
    this.customerFlag = eve.checked;
    this.addressFlag = true;
    if (this.customerFlag == true) {
      this.accountSource.Schedule4 = 32;
    } else {
      this.accountSource.Schedule4 = 0;
    }
    this.radioValue = '';
  }
  fnSupplierChange(eve) {
    this.accountSource.BankYesNo = '';
    this.supplierFlag = eve.checked;
    this.addressFlag = true;
    if (this.supplierFlag == true) {
      this.accountSource.Schedule4 = 31;
    } else {
      this.accountSource.Schedule4 = 0;
    }
    this.radioValue = '';
  }
  fnAgentChange(eve) {
    this.accountSource.BankYesNo = '';
    this.agentFlag = eve.checked;
    this.accountSource.AgentFlag = eve.checked;
    this.addressFlag = true;
    this.radioValue = '';
  }
  fnsalesManChange(eve) {
    this.accountSource.BankYesNo = '';
    this.accountSource.SalesmanFlag = eve.checked;
    this.salesManFlag = eve.checked;
    this.addressFlag = true;
    this.radioValue = '';
  }
  fnstaffChange(eve) {
    this.accountSource.BankYesNo = '';
    this.accountSource.StaffFlag = eve.checked;
    this.staffFlag = eve.checked;
    this.addressFlag = true;
    this.radioValue = '';
  }
  fnLoginChange(eve) {
    this.accountSource.BankYesNo = '';
    this.accountSource.LoginFlag = eve.checked;
    this.loginFlag = eve.checked;
    this.radioValue = '';
    if (this.loginFlag == true) {
      this.openLoginDialog();
    }
  }
  fnOutStandingChange(eve) {
    this.outStandingFlag = eve.checked
    if (this.outStandingFlag == true) {
      this.accountSource.Flag = 'Yes'
    } else {
      this.accountSource.Flag = 'No'
    }
  }

  fnRadioChange(eve) {
    this.accountSource.BankYesNo = eve.value;
    if (eve.value == 'Yes') {
      this.addressFlag = true;
      this.customerFlag = false;
      this.salesManFlag = false;
      this.supplierFlag = false;
      this.agentFlag = false;
      this.staffFlag = false;
    } else {
      this.customerFlag = false;
      this.salesManFlag = false;
      this.supplierFlag = false;
      this.agentFlag = false;
      this.staffFlag = false;
      this.addressFlag = false
    }

  }
  fnClear() {
    this.accountSource = {
      AC_Id: 0, AdjAmount: 0, AC_Name: '', Addr1: '', Addr2: '', Addr3: '', DescEditFlag: 'KERALA', Phone: '', Mobile: '', Email: '',
      Web: '', Transporter: '', Fax: '', DLNo1: '', DLNo2: '', Tin1: '', Tin2: '', CstNo1: '', CrLmtDays: 0, CrLmtAmt: 0,
      CustOrSupp: 'Main', AreaId: 0, Alias: '', Type: '', OBalance: 0, ScheduleType: 0, Schedule1: 32, Schedule2: 0,
      Schedule3: 0, EntryMatch: '', BankYesNo: '', Flag: 'No', UserID: 0, CreateDate: '', BranchId: this.dbBranchId,
      PurType: '', CategoryId: 0, StartDate: new Date().toISOString(), ExpiryDate: new Date().toISOString(), DateOfBirth: '', IntroducedBy: '',
      Currency: '', IFSCode: '', ModelPoint: 0, ModelPointAmt: 0, PriceMenuId: 0, AgentPriceMenuId: 0, CustomerFlag: this.customerFlag,
      SupplierFlag: this.supplierFlag, StaffFlag: this.staffFlag, LoginFlag: this.loginFlag, AgentFlag: this.agentFlag,
      SalesmanFlag: this.salesManFlag, ActiveFlag: 1, MediaId: 0, CurrencyId: 0, Field1: '', Field2: '', Field3: '',
      UserName: '', Pwd: '', UniqueDeviceId: '', OtherFlag: false, AccessLevel: this.accesslevel, AgentMarginPers: 0, bSelect: false,
      Schedule4: 0
    }
    this.staffFlag = false;
    this.customerFlag = false;
    this.salesManFlag = false;
    this.loginFlag = false;
    this.outStandingFlag = false;
    this.addressFlag = false;
    this.agentFlag = false;
    this.supplierFlag = false;
  }
  fnBackToList() {
    this.createFlag = false;
    this.fnClear();
    this.fnAccountGets();
  }
  openLoginDialog(): void {
    const dialogRef = this.dialog.open(AccountheadDialog,
      {
        width: '550px',
        // data: item,
        hasBackdrop: true,
        disableClose: false
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.accountSource.UserName = result.userName;
        this.accountSource.Pwd = result.password;
      }
    });
  }

  fnSave() {

    if (this.radioValue == 'No') {
      this.accountSource.OtherFlag = true;
    }
    if (this.accountSource.CustomerFlag == false && this.accountSource.SalesmanFlag == false && this.accountSource.StaffFlag == false && this.accountSource.SupplierFlag == false && this.radioValue == '') {
      this._appService.openSnackBar('Please Select Account head Type', 'Warning');
      return
    }
    if (this.accountSource.AreaId == 0 && (this.accountSource.CustomerFlag == true || this.accountSource.SupplierFlag == true) && this.radioValue != 'No') {
      this._appService.openSnackBar('Select Area Name.!', 'Warning');
      return;
    }
    if (this.accountSource.Schedule4 == 0) {
      this._appService.openSnackBar('Choose Schedule Type', 'Warning');
      return;
    }
    this._accService.onAccHeadInsertOrUpdate(this.accountSource).subscribe(data => {
      let dataObj = JSON.parse(data);
      if (dataObj[0].flag == 'Already Exists') {
        this._appService.openSnackBar(dataObj[0].flag, 'Warning');
        return
      }
      this._appService.openSnackBar('Saved Successfully', 'Success');
      if(this.dialogueData.params)
      this.dialogRef.close();
      this.fnBackToList();
    });
  }

  fnChangeState(eve) {
    let filtervalue = eve.value.toLowerCase();
    const Data = this.stateList.filter(res => res.State_Name.toLowerCase() == filtervalue);
    this.accountSource.Schedule1 = Data[0].State_Code;
  }
  fnChangeStateCode(eve) {
    let filtervalue = eve.value;
    const Data = this.stateList.filter(res => res.State_Code == filtervalue);
    this.accountSource.DescEditFlag = Data[0].State_Name;
  }
}

@Component({
  selector: 'AccountheadDialog',
  templateUrl: 'account-dialog.html',
  styleUrls: ['./account-head.component.scss']
})
export class AccountheadDialog {
  data = {
    userName: '', password: '', passwordconfirm: ''
  }

  constructor(public dialogRef: MatDialogRef<AccountheadDialog>, private _appService: AppService) { }
  fnSubmit() {
    if (this.data.userName == '' || this.data.password == '' || this.data.passwordconfirm == '') {
      this._appService.openSnackBar('Please Enter the All fields', 'Warning');
      return;
    }
    if (this.data.password != this.data.passwordconfirm) {
      this._appService.openSnackBar('Please Type the Same Password here', 'Warning');
    } else {
      this.dialogRef.close(this.data);
    }
  }
  onNoClick(): void {
    this.dialogRef.close('');
  }
}
