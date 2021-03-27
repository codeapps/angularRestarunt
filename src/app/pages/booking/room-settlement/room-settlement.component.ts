import { Component, OnInit, Inject } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-room-settlement',
  templateUrl: './room-settlement.component.html',
  styleUrls: ['./room-settlement.component.scss']
})
export class RoomSettlementComponent implements OnInit {
  settlementFlag: boolean = true;
  dBranchId:any = localStorage.getItem("SessionBranchId");
  dStaffId:any = localStorage.getItem("SessionStaffId");
  searchText: any = '';
  bookedRoomList: any;
  dataSource = new MatTableDataSource<Element>();
  selection = new SelectionModel<Element>(true, []);
  columnsToDisplay: any[] = ['Room_Id1', 'Room_No', 'RoomType_Name', 'Floor_Name', 'RoomType_Rent'];
  registerSource = {
    RoomRegistration_Id: 0, CustomerName: '', CustAddress: '',
    CheckInDate: '', CheckoutDate: '', Adults: '', Childs: '', NoOfDays: '',
    Phone: '', Email: '', Room_Id: '', Amount: '', Registration_AdvanceAmt: ''
  };
  cardSource = {
    cardNo: '', holdername: '', cardAmt: '', bankId: ''
  }
  netAmount: number;
  Discount: number;
  advanceAmount: number;
  billAmount: any;
  totalAmount: number;
  billserice: any;
  payTerms = 'CASH'
  billsericeID: any;
  grandTotal: number;
  KotLIst: any;
  searchRoomText: any = '';
  settlementList: any;
  createFlag: boolean = false;

  constructor(public _appService: AppService,public dialog: MatDialog) { }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {

    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  ngOnInit() {
    this.getBillSerice();
    this.fngetBookedRooms();
  }

  fngetBookedRooms() {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'RoomSettlment_Gets';
    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'strSearch';
    ProcParams['strArgmt'] = this.searchText;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.dBranchId.toString();
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      this.bookedRoomList = JSON.parse(data);
    });
  }

  fnSettlement(Data) {
    this.settlementFlag = false;
    let fromDate = new Date(Data.CheckInDate)
    let toDate = new Date(Data.CheckoutDate)
    this.registerSource = {
      RoomRegistration_Id: Data.RoomRegistration_Id, CustomerName: Data.CustomerName,
      CustAddress: Data.CustAddress, CheckInDate: this.fnDateReverse(fromDate),
      CheckoutDate: this.fnDateReverse(toDate), Adults: Data.Adults, Childs: Data.Childs,
      NoOfDays: Data.NoOfDays, Phone: Data.Phone, Email: Data.Email, Room_Id: Data.Room_Id,
      Amount: Data.Amount, Registration_AdvanceAmt: Data.Registration_AdvanceAmt
    };
    this.fngetRoomDetails(Data.RoomRegistration_Id);
  }

  fngetRoomDetails(id) {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'RoomDetails_GetOnRoomRegId';
    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'RoomRegistration_Id';
    ProcParams['strArgmt'] = id.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.dBranchId.toString();
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      let jsonData = JSON.parse(data);
      this.dataSource = new MatTableDataSource(jsonData);
    });
  }

  fnGetKot() {
    let roomDataSource: any = this.selection.selected;
    if (roomDataSource.length == 0) {
      return;
    }
    let nCout = 0;
    let strRoomIds = '';
    let strBillNo = '';
    roomDataSource.forEach(item => {
      this.grandTotal = 0;

      if (nCout == 0) {

        strRoomIds = ' and (Rooms.Room_Id =' + item.RoomId + ' and KOT.Kot_BranchId=' + this.dBranchId;
        strBillNo = ' and (Kot.Kot_TempOrderNo =' + item.BillNo;

      } else {

        strRoomIds += ' or Rooms.Room_Id =' + item.RoomId;
        strBillNo += ' or Kot.Kot_TempOrderNo =' + item.BillNo;
      }
      nCout = nCout + 1;
    });

    if (nCout > 0) {
      strRoomIds += ' ) ';
      strBillNo += ' ) ';
    }

    let ServiceParams = {};
    ServiceParams['strProc'] = 'KotList_GetOnRoomID';
    let oProcParams = [];
    let ProcParams = {};

    ProcParams['strKey'] = 'RoomIds';
    ProcParams['strArgmt'] = strRoomIds.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'TempInvoiceNo';
    ProcParams['strArgmt'] = strBillNo.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'RoomRegistration_Id';
    ProcParams['strArgmt'] = this.registerSource.RoomRegistration_Id.toString();
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      this.KotLIst = JSON.parse(data);
    });

  }

  fnGetSettlementList() {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'HottelSettlmentList_Gets';
    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'strRoomBooked';
    ProcParams['strArgmt'] = this.searchRoomText.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.dBranchId.toString();
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      this.settlementList = JSON.parse(data);
    });
  }

  getBillSerice() {
    this._appService.get('GetRepository/GetBillSerice')
      .subscribe(result => {
        this.billserice = result;
      }, error => console.error(error));
  }

  fngetTaxableAmout() {
    let Data: any = this.selection.selected;
    let TaxPerc = 0;
    let RentAmt = 0;
    let BillTotal = 0;
    let Advance = 0;
    let balance = 0;
    if (Data) {
      for (let i = 0; i < Data.length; i++) {
        let TaxPercentage = Data[i].RoomType_Tax;
        let RentAmts = Data[i].RoomType_Rent;
        Advance = Data[0].Registration_AdvanceAmt;

        TaxPerc = TaxPercentage;
        RentAmt = RentAmt + RentAmts;
      }
      BillTotal = RentAmt + ((RentAmt * TaxPerc) / 100);
      this.netAmount = BillTotal;
      this.advanceAmount = Advance;
      this.totalAmount = BillTotal;
      this.billAmount = this.netAmount - this.advanceAmount;

      let disc = this.Discount;
      if (disc) {
        this.billAmount = this.billAmount - disc;
        this.totalAmount = this.totalAmount - disc;
      }
    }
    this.fnGetKot();
  }

  fngetTotal() {
    this.fngetTaxableAmout();
  }

  fnsearchText(eve) {
    this.searchText = eve.target.value;
    this.fngetBookedRooms();
  }

  fnClear() {
    this.registerSource = {
      RoomRegistration_Id: 0, CustomerName: '', CustAddress: '',
      CheckInDate: '', CheckoutDate: '', Adults: '', Childs: '', NoOfDays: '',
      Phone: '', Email: '', Room_Id: '', Amount: '', Registration_AdvanceAmt: ''
    };
    this.netAmount = 0;
    this.Discount = 0;
    this.advanceAmount = 0;
    this.billAmount = 0;
    this.totalAmount = 0;
    this.selection.clear();
  }

  fnBack() {
    this.settlementFlag = true;
    this.fngetBookedRooms();
    this.fnClear();
  }


  fnSettleBill() {
    let calculate = {
      netAmount:this.netAmount,advanceAmount:this.advanceAmount,totalAmount:this.totalAmount
    };

    if (this.selection.selected.length == 0) {
      this._appService.openSnackBar('Please Select The Room', 'Warning');
      return;
    }
    if (this.payTerms == 'CARD') {
      this.openLoginDialog(calculate);
    }else{
      this.fnsaveBill();
    }

  }

  fnsaveBill() {

    let ListIssueSub = [];
    let Issue = {};
    let IssueSub = {};

    let ListSettlmentSub = [];
    let Settlment = {};
    let SettlmentSub = {};

    Issue['IssuesCustName'] = this.registerSource.CustomerName;
    Issue['IssuesMobile'] = this.registerSource.Phone;
    Issue['IssuesTotal'] = this.totalAmount;
    Issue['BillSerId'] = this.billsericeID;
    Issue['BranchId'] = parseFloat(this.dBranchId || 0);
    Issue['IssuesSalesmanId'] = 0;
    Issue['IssuesTempOrderNo'] = 0;
    Issue['RoomRegistrationId'] = this.registerSource.RoomRegistration_Id;
    Issue['IssuesOrderFrom'] = '';

    Settlment = {};
    Settlment['BillSerId'] = this.billsericeID;
    Settlment['AdvanceAmt'] = this.advanceAmount;
    Settlment['RestaurantTotal'] = 0;
    Settlment['HotalTotal'] = this.netAmount;
    Settlment['SettlementPayTerms'] = this.payTerms;
    Settlment['StaffId'] = parseFloat(this.dStaffId || 0);
    Settlment['SettlmentTotal'] = this.totalAmount;
    Settlment['NoOfDays'] = this.registerSource.NoOfDays;

    if (this.payTerms == 'CARD') {
      Settlment['CardNumber'] = this.cardSource.cardNo;
      Settlment['CardName'] = this.cardSource.holdername;
      Settlment['CardAmt'] = this.cardSource.cardAmt;
      Settlment['BankId'] = this.cardSource.bankId;
    }


    Settlment['BranchId'] = parseFloat(this.dBranchId || 0);
    Settlment['DiscountAmt'] = this.Discount;
    Settlment['SettlementBalaceAmt'] = this.billAmount;

    let roomSource: any = this.selection.selected;

    for (let i = 0; i < roomSource.length; i++) {

      SettlmentSub = {};
      SettlmentSub['RoomId'] = roomSource[i].RoomId;
      SettlmentSub['RoomRegistrationId'] = this.registerSource.RoomRegistration_Id;
      SettlmentSub['RoomRent'] = roomSource[i].Rate;
      SettlmentSub['SettlmentSubAmount'] = roomSource[i].Rate + ((roomSource[i].Rate * roomSource[i].RoomType_Tax) / 100);
      SettlmentSub['RoomPerRentBeforeTax'] = roomSource[i].Rate;
      SettlmentSub['RoomRegistrationId'] = this.registerSource.RoomRegistration_Id;
      SettlmentSub['SettlmentSubTaxPers'] = roomSource[i].RoomType_Tax;
      SettlmentSub['SettlmentSubTaxAmt'] = (roomSource[i].Rate * roomSource[i].RoomType_Tax) / 100;

      SettlmentSub['SettlmentSubSgsttaxPers'] = roomSource[i].RoomType_Tax / 2;
      SettlmentSub['SettlmentSubSgsttaxAmt'] = ((roomSource[i].Rate * roomSource[i].RoomType_Tax) / 100) / 2
      SettlmentSub['SettlmentSubCgsttaxPers'] = roomSource[i].RoomType_Tax / 2;
      SettlmentSub['SettlmentSubCgsttaxAmt'] = ((roomSource[i].Rate * roomSource[i].RoomType_Tax) / 100) / 2
      SettlmentSub['SettlmentSubIgsttaxPers'] = roomSource[i].RoomType_Tax
      SettlmentSub['SettlmentSubIgsttaxAmt'] = 0;

      ListSettlmentSub.push(SettlmentSub);
    }


    Settlment['Issue'] = Issue;
    Issue['IssueSubDetail'] = ListIssueSub;
    Settlment['SettlmentSubDetail'] = ListSettlmentSub;
    let body = JSON.stringify(Settlment);

    this._appService.post('Master/fnSettlmentBill', body).subscribe(data => {
      this._appService.openSnackBar('Bill Saved Successfully', 'Success');
      this.fnBack();
      this.fnClear();
    })
  }


  fnBackToList() {
    this.createFlag = true;
    this.fnGetSettlementList();
  }
  fnCreate() {
    this.createFlag = false;
  }

  fnsearchTextsettle(eve) {
    this.searchRoomText = eve.target.value;
    this.fnGetSettlementList();

  }
  fnDateReverse(format) {
    let date = ("0" + format.getDate()).slice(-2);
    let month = ("0" + (format.getMonth() + 1)).slice(-2);
    let year = format.getFullYear();
    const dateconvert = year + '-' + month + '-' + date;
    return dateconvert.split('-').reverse().join('/');
  }

  openLoginDialog(item): void {
    const dialogRef = this.dialog.open(AddcardDialog,
      {
        width: '500px',
        data: item,
        hasBackdrop: true,
        disableClose: false
      });
    dialogRef.afterClosed().subscribe(result => {
      this.cardSource = {
        cardNo: result.cardNo, holdername: result.holdername, cardAmt: result.cardAmt, bankId: result.bankId
      }
      if(result){
        this.fnsaveBill();
      }
    });
  }
}


@Component({
  selector: 'AddRoomDialog',
  templateUrl: 'addcard-dialog.html',
  styleUrls: ['./room-settlement.component.scss']
})
export class AddcardDialog {
  dBranchId = localStorage.getItem("SessionBranchId");
  accoundHedGetData:any;
  cardSource = {
    cardNo:'',holdername:'',cardAmt:'',bankId:''
  }
  constructor(public dialogRef: MatDialogRef<AddcardDialog>,
    @Inject(MAT_DIALOG_DATA) public data, public dialog: MatDialog,
    public _appService:AppService) { }

    ngOnInit():void {
      this.cardSource.cardAmt = this.data.totalAmount;
    this.fngetAccountHeads()
    }
    fngetAccountHeads(){
      let ServiceParams = {};
      ServiceParams['strProc'] = 'AccountHead_GetOnBank';
      let oProcParams = [];

      let ProcParams = {};
      ProcParams['strKey'] = 'BranchId';
      ProcParams['strArgmt'] = this.dBranchId.toString();
      oProcParams.push(ProcParams);

      ServiceParams['oProcParams'] = oProcParams;
      let body = JSON.stringify(ServiceParams);
      this._appService.post('CommonQuery/fnGetDataReportNew',body).subscribe(data=>{
        this.accoundHedGetData = JSON.parse(data);
      });
    }
    fnSettled(){
      this.dialogRef.close(this.cardSource);
    }
    onNoClick(): void {
      this.dialogRef.close('');
    }
}
