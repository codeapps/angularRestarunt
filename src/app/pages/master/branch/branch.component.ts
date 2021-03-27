import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { BranchserviceService } from './branchservice.service';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.scss']
})
export class BranchComponent implements OnInit {
  sessionBranchId = localStorage.getItem("SessionBranchId");
  Branch: Object;
  createFlag: boolean = true;
  branchSource = {
    BranchId: 0, BranchCode: '', BranchName: '', BranchAdr1: '', BranchAdr2: '', BranchAdr3: '', BranchFtr1: '', BranchFtr2: '',
    BranchFtr3: '', Currency: '', Phone: '', Fax: '', Mail: '', TaxID: '', LastCustNo: '', Active: '', PurSlNo: '', DcSlNo: '', ConSlNo: '', SRSlNo: '', ERSlNo: '',
    EDSlNo: '', DNSlNo: '', EodDate: '', TinNo1: '', TinNo2: '', DLNo1: '', DLNo2: '', CSTNo1: '', StartDate: '', EndDate: '', PerformaSlNo: '', QuoSlNo: '', MobileNo: '',
    OrderNo: '', RawMaterialPurSlNo: '', RawMaterialBatchSlNo: '', GoldExchangeNo: '', PurConsignmentSlNo: '', EShopOrderNo: '', NextBillNo: '',
    NextReturnNo: '', NextDebitNoteNo: '', PurReturnNo: '', MailId: '', MailPwd: '', BarCodeName: '', BarCodeHeaderName: '', ComImage: '', NextDcSlNo: '',
    BranchStateCode: 32, BranchStateName: 'KERALA', BranchBankName: '', BranchBankAddr1: '', BranchBankAddr2: '', BranchBankAcNo: '',
    BranchIfsccode: '', BranchPanCardNo: '', BranchField1: '', BranchField2: '', BranchField3: '', BranchNoField: '', DcInNextBillNo: '',
    DcInUniqueNo: '', AcId: ''
  }
  Password: any;
  UserName: any;
  state: any;
  userpass: boolean = true;

  constructor(public _appService: AppService, public _branchService: BranchserviceService) { }

  ngOnInit() {
    this.getBranch();
  }
  getBranch() {
    this._branchService.fnBranchGets()
      .subscribe(data => {
        this.Branch = data;
      }, error => console.error(error));
    this.getStates();
  }
  getStates() {
    this._appService.get('GetRepository/StateGet')
      .subscribe(data => {
        this.state = data;
      }, error => console.error(error));
  }

  BackToList() {
    this.createFlag = true;
    this.getBranch()
  }
  fnCreate() {
    this.createFlag = false;
    this.userpass = true;
    this.fnClear()
  }
  fnAnchorClick(eve) {
    this.createFlag = false;
    this.userpass = false;
    this.branchSource = {
      BranchId: eve.BranchId, BranchCode: eve.BranchCode, BranchName: eve.BranchName, BranchAdr1: eve.BranchAdr1, BranchAdr2: eve.BranchAdr2,
      BranchAdr3: eve.BranchAdr3, BranchFtr1: eve.BranchFtr1, BranchFtr2: eve.BranchFtr2, BranchFtr3: eve.BranchFtr3, Currency: '',
      Phone: eve.Phone, Fax: eve.Fax, Mail: eve.Mail, TaxID: '', LastCustNo: '', Active: '', PurSlNo: '', DcSlNo: '', ConSlNo: '', SRSlNo: '', ERSlNo: '',
      EDSlNo: '', DNSlNo: '', EodDate: '', TinNo1: '', TinNo2: '', DLNo1: '', DLNo2: '', CSTNo1: '', StartDate: '', EndDate: '', PerformaSlNo: '', QuoSlNo: '', MobileNo: '',
      OrderNo: '', RawMaterialPurSlNo: '', RawMaterialBatchSlNo: '', GoldExchangeNo: '', PurConsignmentSlNo: '', EShopOrderNo: '', NextBillNo: '',
      NextReturnNo: '', NextDebitNoteNo: '', PurReturnNo: '', MailId: '', MailPwd: eve.MailPwd, BarCodeName: '', BarCodeHeaderName: eve.BarCodeHeaderName, ComImage: '', NextDcSlNo: '',
      BranchStateCode: eve.BranchStateCode, BranchStateName: eve.BranchStateName, BranchBankName: eve.BranchBankName, BranchBankAddr1: eve.BranchBankAddr1,
      BranchBankAddr2: eve.BranchBankAddr2, BranchBankAcNo: eve.BranchBankAcNo, BranchIfsccode: eve.BranchIfsccode, BranchPanCardNo: eve.BranchPanCardNo,
      BranchField1: eve.BranchField1, BranchField2: eve.BranchField2, BranchField3: eve.BranchField3, BranchNoField: eve.BranchNoField, DcInNextBillNo: '',
      DcInUniqueNo: '', AcId: ''
    }
  }
  fnClear() {
    this.branchSource = {
      BranchId: 0, BranchCode: '', BranchName: '', BranchAdr1: '', BranchAdr2: '', BranchAdr3: '', BranchFtr1: '', BranchFtr2: '',
      BranchFtr3: '', Currency: '', Phone: '', Fax: '', Mail: '', TaxID: '', LastCustNo: '', Active: '', PurSlNo: '', DcSlNo: '', ConSlNo: '', SRSlNo: '', ERSlNo: '',
      EDSlNo: '', DNSlNo: '', EodDate: '', TinNo1: '', TinNo2: '', DLNo1: '', DLNo2: '', CSTNo1: '', StartDate: '', EndDate: '', PerformaSlNo: '', QuoSlNo: '', MobileNo: '',
      OrderNo: '', RawMaterialPurSlNo: '', RawMaterialBatchSlNo: '', GoldExchangeNo: '', PurConsignmentSlNo: '', EShopOrderNo: '', NextBillNo: '',
      NextReturnNo: '', NextDebitNoteNo: '', PurReturnNo: '', MailId: '', MailPwd: '', BarCodeName: '', BarCodeHeaderName: '', ComImage: '', NextDcSlNo: '',
      BranchStateCode: 32, BranchStateName: 'KERALA', BranchBankName: '', BranchBankAddr1: '', BranchBankAddr2: '', BranchBankAcNo: '',
      BranchIfsccode: '', BranchPanCardNo: '', BranchField1: '', BranchField2: '', BranchField3: '', BranchNoField: '', DcInNextBillNo: '',
      DcInUniqueNo: '', AcId: ''
    }
  }
  fnStateChangeEvent(event) {
    let filtervalue = event.value.toLowerCase();
    const Data = this.state.filter(res => res.State_Name.toLowerCase() == filtervalue);
    this.branchSource.BranchStateCode = Data[0].StateCode;
  }
  fnSave() {
    if (this.branchSource.BranchName == '') {
      this._appService.openSnackBar('Please Enter Branch Name', 'warning');
      return;
    }
    var ListBranchDetailsInfo = [];
    var BranchDetailsInfo = {};

    if (this.branchSource.BranchId != 0) {
      BranchDetailsInfo['BranchId'] = this.branchSource.BranchId;
      BranchDetailsInfo['BranchCode'] = this.branchSource.BranchCode;
      BranchDetailsInfo['BranchName'] = this.branchSource.BranchName;
      BranchDetailsInfo['BranchAdr1'] = this.branchSource.BranchAdr1;
      BranchDetailsInfo['BranchAdr2'] = this.branchSource.BranchAdr2;
      BranchDetailsInfo['BranchAdr3'] = this.branchSource.BranchAdr3;
      BranchDetailsInfo['BranchFtr1'] = this.branchSource.BranchFtr1;
      BranchDetailsInfo['BranchFtr2'] = this.branchSource.BranchFtr2;
      BranchDetailsInfo['BranchFtr3'] = this.branchSource.BranchFtr3;
      BranchDetailsInfo['Phone'] = this.branchSource.Phone;
      BranchDetailsInfo['Fax'] = this.branchSource.Fax;
      BranchDetailsInfo['Mail'] = this.branchSource.Mail;
      BranchDetailsInfo['UserName'] = this.UserName;
      BranchDetailsInfo['Password'] = this.Password;
      BranchDetailsInfo['MailPwd'] = this.branchSource.MailPwd;
      BranchDetailsInfo['Branch_StateName'] = this.branchSource.BranchStateName;
      BranchDetailsInfo['Branch_StateCode'] = this.branchSource.BranchStateCode;
      BranchDetailsInfo['Branch_BankName'] = this.branchSource.BranchBankName;
      BranchDetailsInfo['Branch_BankAddr1'] = this.branchSource.BranchBankAddr1;
      BranchDetailsInfo['Branch_BankAddr2'] = this.branchSource.BranchBankAddr2;
      BranchDetailsInfo['Branch_BankAcNo'] = this.branchSource.BranchBankAcNo;
      BranchDetailsInfo['Branch_IFSCCODE'] = this.branchSource.BranchIfsccode;
      BranchDetailsInfo['Branch_PanCardNo'] = this.branchSource.BranchPanCardNo;
      BranchDetailsInfo['Branch_Field1'] = this.branchSource.BranchField1;
      BranchDetailsInfo['Branch_Field2'] = this.branchSource.BranchField2;
      BranchDetailsInfo['Branch_Field3'] = this.branchSource.BranchField3;
      BranchDetailsInfo['Branch_NoField'] = this.branchSource.BranchNoField;
      BranchDetailsInfo['BarCodeHeaderName'] = this.branchSource.BarCodeHeaderName;

      ListBranchDetailsInfo.push(BranchDetailsInfo);
      let body = JSON.stringify(ListBranchDetailsInfo);
      this._appService.post('master/Branch_UpdateDetails', body).subscribe(data => {
        let report = data
        if (report[0].Flag == 'Already Exists') {
          this._appService.openSnackBar(report[0].Flag, 'warning');
          return;
        }
        this._appService.openSnackBar('Save Successfully', 'success');
        this.fnClear();
        this.BackToList();
      });

    } else {

      if (this.UserName == null || this.Password == null) {
        this._appService.openSnackBar('Please Give UserName and Password', 'warning');
        return;
      }

      BranchDetailsInfo['BranchCode'] = this.branchSource.BranchCode;
      BranchDetailsInfo['BranchName'] = this.branchSource.BranchName;
      BranchDetailsInfo['BranchAdr1'] = this.branchSource.BranchAdr1;
      BranchDetailsInfo['BranchAdr2'] = this.branchSource.BranchAdr2;
      BranchDetailsInfo['BranchAdr3'] = this.branchSource.BranchAdr3;
      BranchDetailsInfo['BranchFtr1'] = this.branchSource.BranchFtr1;
      BranchDetailsInfo['BranchFtr2'] = this.branchSource.BranchFtr2;
      BranchDetailsInfo['BranchFtr3'] = this.branchSource.BranchFtr3;
      BranchDetailsInfo['Phone'] = this.branchSource.Phone;
      BranchDetailsInfo['Fax'] = this.branchSource.Fax;
      BranchDetailsInfo['Mail'] = this.branchSource.Mail;
      BranchDetailsInfo['UserName'] = this.UserName;
      BranchDetailsInfo['Password'] = this.Password;
      BranchDetailsInfo['MailPwd'] = this.branchSource.MailPwd;
      BranchDetailsInfo['Branch_StateName'] = this.branchSource.BranchStateName;
      BranchDetailsInfo['Branch_StateCode'] = this.branchSource.BranchStateCode;
      BranchDetailsInfo['Branch_BankName'] = this.branchSource.BranchBankName;
      BranchDetailsInfo['Branch_BankAddr1'] = this.branchSource.BranchBankAddr1;
      BranchDetailsInfo['Branch_BankAddr2'] = this.branchSource.BranchBankAddr2;
      BranchDetailsInfo['Branch_BankAcNo'] = this.branchSource.BranchBankAcNo;
      BranchDetailsInfo['Branch_IFSCCODE'] = this.branchSource.BranchIfsccode;
      BranchDetailsInfo['Branch_PanCardNo'] = this.branchSource.BranchPanCardNo;
      BranchDetailsInfo['Field1'] = this.branchSource.BranchField1;
      BranchDetailsInfo['Field2'] = this.branchSource.BranchField2;
      BranchDetailsInfo['Field3'] = this.branchSource.BranchField3;
      BranchDetailsInfo['NoField'] = this.branchSource.BranchNoField;
      BranchDetailsInfo['BarCodeHeaderName'] = this.branchSource.BarCodeHeaderName;
      BranchDetailsInfo['TempInvoiceNo'] = 1;
      BranchDetailsInfo['Settelment_BillNo'] = 1;
      BranchDetailsInfo['DcInUniqueNo'] = -1;
      ListBranchDetailsInfo.push(BranchDetailsInfo);

      let body = JSON.stringify(ListBranchDetailsInfo);
      this._appService.post('master/Branch_InsertDetails', body).subscribe(data => {
        let report = data;
        if (report[0].Flag == 'Already Exists') {
          this._appService.openSnackBar(report[0].Flag, 'warning');
          return;
        }
        this._appService.openSnackBar('Saved Successfully', 'success');
        this.BackToList();
        this.fnClear();
      });
    }
  }
}
