import { Component, OnInit, Inject } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { JsonPipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-room-registration',
  templateUrl: './room-registration.component.html',
  styleUrls: ['./room-registration.component.scss']
})
export class RoomRegistrationComponent implements OnInit {
  dBranchId:any = localStorage.getItem("SessionBranchId");
  createFlag: boolean = true;
  backFlag: boolean = false
  floors: any = [];
  RoomsDetail: any = [];
  strCountByFloorId: any = [];
  fromDate = new Date();
  toDate = new Date();
  strCount: any;
  BookingAvailable: any;
  roomBookingDetails: any = [];
  tempRoomDetails: any;
  room: any;
  today = new Date;
  identification: any;
  TodayTime = new Date().toLocaleTimeString();
  registrationSource = {
    RoomRegistration_Id: 0, CustomerName: '', CustAddress: '', Identification: '', Registration_Date: '',
    Registration_Time: this.TodayTime, CheckInDate: new Date(), CheckoutDate: new Date(), Adults: '', Childs: '', NoOfDays: 0,
    Registration_AdvanceAmt: '', Amount: '', CheckOutFlag: '', Phone: '', Email: '', Identification_Id: '',
    RoomBookingId: '', Room_Id: ''
  };

  searchText: any = '';
  roomRegistrationList: any;
  tempDataForAddRoom: any = [];

  constructor(public _appService: AppService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getFloor();
    this.getAvailableBookingRooms();
  }

  getFloor() {

    let ServiceParams = {};
    ServiceParams['strProc'] = 'Rooms_GetsAll';
    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.dBranchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);
    this._appService.post('CommonQuery/fnGetDataReportReturnMultiTable', body).subscribe(data => {
      let jsonData = JSON.parse(data);

      this.tempRoomDetails = JSON.parse(jsonData[0]);
      var FloorRoomDetails = JSON.parse(jsonData[0]);
      this.strCountByFloorId = JSON.parse(jsonData[1]);

      let count = 0;
      var dTempFloorId = 0;
      var ListRooms = [];
      var floor = {};
      for (let i = 0; i < FloorRoomDetails.length; i++) {


        if (dTempFloorId == FloorRoomDetails[i].Floor_Id) {

          var Rooms = {};
          Rooms['Room_Id'] = FloorRoomDetails[i].Room_Id;
          Rooms['Room_No'] = FloorRoomDetails[i].Room_No;
          Rooms['Room_Delete'] = FloorRoomDetails[i].Room_Delete;
          Rooms['Floor_Id'] = FloorRoomDetails[i].Floor_Id;
          Rooms['RoomType_Id'] = FloorRoomDetails[i].RoomType_Id;
          Rooms['Room_IsBook'] = FloorRoomDetails[i].Room_IsBook;
          Rooms['BillNo'] = FloorRoomDetails[i].BillNo;
          Rooms['RoomType_Name'] = FloorRoomDetails[i].RoomType_Name;
          ListRooms.push(Rooms);
          dTempFloorId = FloorRoomDetails[i].Floor_Id;

        } else {


          if (dTempFloorId != 0) {
            this.RoomsDetail.push(ListRooms);
            ListRooms = [];
          }

          floor = {};
          floor['Floor_Id'] = FloorRoomDetails[i].Floor_Id;
          floor['Floor_Name'] = FloorRoomDetails[i].Floor_Name;
          floor['Total'] = this.fngetTotal(FloorRoomDetails[i].Floor_Id)
          this.floors.push(floor);

          var Rooms = {};
          Rooms['Room_Id'] = FloorRoomDetails[i].Room_Id;
          Rooms['Room_No'] = FloorRoomDetails[i].Room_No;
          Rooms['Room_Delete'] = FloorRoomDetails[i].Room_Delete;
          Rooms['Floor_Id'] = FloorRoomDetails[i].Floor_Id;
          Rooms['RoomType_Id'] = FloorRoomDetails[i].RoomType_Id;
          Rooms['Room_IsBook'] = FloorRoomDetails[i].Room_IsBook;
          Rooms['BillNo'] = FloorRoomDetails[i].BillNo;
          Rooms['RoomType_Name'] = FloorRoomDetails[i].RoomType_Name;
          ListRooms.push(Rooms);
          dTempFloorId = FloorRoomDetails[i].Floor_Id;

          count++
        }
      }

      this.RoomsDetail.push(ListRooms);
      for (let i = 0; i < this.floors.length; i++) {
        var RoomSelect = this.RoomsDetail[i];
        for (let j = 0; j < RoomSelect.length; j++) {
          RoomSelect[j].select = false;
        }
      }
    });

  }
  fngetTotal(id) {
    if (this.tempRoomDetails.length == 0) {
      return
    }
    let DataSource = this.tempRoomDetails
    const Data = this.tempRoomDetails.filter(res => res.Floor_Id == id && res.Room_IsBook == 'No');
    return Data.length;
  }
  getAvailableBookingRooms() {

    let ServiceParams = {};
    ServiceParams['strProc'] = 'AvailableRooms_GetsOnBooking';
    let oProcParams = [];


    let ProcParams = {};
    ProcParams['strKey'] = 'Book_FromDate';
    ProcParams['strArgmt'] = this.ConvertDateAll(this.fromDate);
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'Book_ToDate';
    ProcParams['strArgmt'] = this.ConvertDateAll(this.toDate);;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.dBranchId;;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    this._appService.post('CommonQuery/fnGetDataReportNew', body)
      .subscribe(data => {
        this.BookingAvailable = JSON.parse(data);
        this.strCount = this.BookingAvailable[0].TotalRooms;
      }, error => console.error(error));
    this.getIdentification();
  }

  getCkeckedRoomDetail(Room, Index, eve) {

    if (Room.Room_IsBook == 'Yes') {
      this._appService.openSnackBar('Already Booked The Enter Room', 'Warning');
      return
    }
    if (eve.target.checked == true) {
      let element = <HTMLInputElement>document.getElementById(Room.Room_Id);
      element.style.border = '1px solid #ced4da';
      element.style.background = 'green';
      const Data = this.tempRoomDetails.filter(res => res.Room_Id == Room.Room_Id);
      this.pushesElements(Data)
    } else {
      let element = <HTMLInputElement>document.getElementById(Room.Room_Id);
      element.style.border = '1px solid silver';
      element.style.background = 'silver';
      let index = this.roomBookingDetails.findIndex(res => res.Room_Id == Room.Room_Id);
      this.roomBookingDetails.splice(index, 1);
    }
  }

  pushesElements(Data) {
    let Rooms = {};
    Rooms['Room_Id'] = Data[0].Room_Id;
    Rooms['Room_No'] = Data[0].Room_No;
    Rooms['RoomType_Id'] = Data[0].RoomType_Id;
    Rooms['RoomType_Name'] = Data[0].RoomType_Name;
    Rooms['RoomType_Rent'] = Data[0].RoomType_Rent;
    Rooms['RoomType_SingRent'] = Data[0].RoomType_SingRent;
    Rooms['Floor_Id'] = Data[0].Floor_Id;
    Rooms['Floor_Name'] = Data[0].Floor_Name;
    Rooms['BranchId1'] = Data[0].BranchId1;
    Rooms['RoomType_Duration'] = Data[0].RoomType_Duration;
    this.roomBookingDetails.push(Rooms);
  }

  fnsubmit() {
    if (this.roomBookingDetails == 0) {
      this._appService.openSnackBar('Please Select The Room', 'Warning');
      return;
    }
    this.createFlag = false;
    this.tempDataForAddRoom['RoomDetails'] = this.RoomsDetail;
    this.tempDataForAddRoom['Floor'] = this.floors;
    this.tempDataForAddRoom['tempRoomDetails'] = this.tempRoomDetails;
    this.tempDataForAddRoom['roomBookingDetails'] = this.roomBookingDetails;
  }
  fnHome() {
    this.createFlag = true;
    this.fnClear();
    this.getFloor();
    this.getAvailableBookingRooms();
  }
  fnBack() {
    this.backFlag = true;
    this.createFlag = false;
    this.fngetRoomReg();
  }
  fnCreate() {
    this.backFlag = false;
    this.createFlag = true;
  }
  fnClear() {
    this.tempDataForAddRoom = [];
    this.RoomsDetail = [];
    this.tempRoomDetails = [];
    this.floors = [];
    this.strCountByFloorId = [];
    this.roomBookingDetails = [];
    this.roomRegistrationList = ''
    this.registrationSource = {
      RoomRegistration_Id: 0, CustomerName: '', CustAddress: '', Identification: '', Registration_Date: '',
      Registration_Time: this.TodayTime, CheckInDate: new Date(), CheckoutDate: new Date(), Adults: '', Childs: '', NoOfDays: 0,
      Registration_AdvanceAmt: '', Amount: '', CheckOutFlag: '', Phone: '', Email: '', Identification_Id: '',
      RoomBookingId: '', Room_Id: ''
    };

  }

  fnDateChange() {
    var CheckoutDate = new Date(this.registrationSource.CheckoutDate);
    var CheckInDate = new Date(this.registrationSource.CheckInDate);
    if (Math.abs(CheckoutDate.getTime()) < Math.abs(CheckInDate.getTime())) {
      this.registrationSource.NoOfDays = 0;
      return;
    }
    var diff = Math.abs(CheckoutDate.getTime() - CheckInDate.getTime());
    var diffDays = Math.ceil(diff / (1000 * 3600 * 24));

    var day1 = CheckoutDate.getFullYear() + '/' + (CheckoutDate.getMonth() + 1) + '/' + CheckoutDate.getDate();
    var day2 = CheckInDate.getFullYear() + '/' + (CheckInDate.getMonth() + 1) + '/' + CheckInDate.getDate();
    if (day1 == day2) {
      this.registrationSource.NoOfDays = 0;
    } else {
      this.registrationSource.NoOfDays = diffDays;
    }
  }
  getIdentification() {
    this._appService.get('GetRepository/getIdentfications?terms=' + '')
      .subscribe(result => {
        this.identification = result;
      }, error => console.error(error));
  }

  fnSave() {
    if (this.roomBookingDetails.length == 0) {
      this._appService.openSnackBar('No rooms availabe!', 'Error');
      return;
    }
    if (this.registrationSource.CustomerName == null || this.registrationSource.CustomerName == '') {
      this._appService.openSnackBar('Please Enter The Customer Name', 'Warning');
      return;
    }
    if (this.registrationSource.CustAddress == null || this.registrationSource.CustAddress == '') {
      this._appService.openSnackBar('Please Enter The Customer Address', 'Warning');
      return;
    }
    if (this.registrationSource.Identification_Id == '' || this.registrationSource.Identification_Id == null) {
      this._appService.openSnackBar('Please Select Identification', 'Warning');
      return;
    }
    if (this.registrationSource.Adults == '' || this.registrationSource.Adults == null) {
      this._appService.openSnackBar('Please Enter The No Of Adults..', 'Warning');
      return;
    }
    if (this.registrationSource.NoOfDays == 0 || this.registrationSource.Adults == null) {
      this._appService.openSnackBar('Invalid Date Entry', 'Warning');
      return;
    }

    let ListRoomReg = [];
    let RoomReg = {};

    RoomReg['RoomRegistrationId'] = this.registrationSource.RoomRegistration_Id;
    RoomReg['CustomerName'] = this.registrationSource.CustomerName;
    RoomReg['CustAddress'] = this.registrationSource.CustAddress;
    RoomReg['Email'] = this.registrationSource.Email;
    RoomReg['Phone'] = this.registrationSource.Phone;
    RoomReg['IdentificationId'] = parseFloat(<any>this.registrationSource.Identification_Id || 0);
    RoomReg['Identification'] = this.registrationSource.Identification;
    RoomReg['CheckInDate'] = this.registrationSource.CheckInDate;
    RoomReg['CheckoutDate'] = this.registrationSource.CheckoutDate;
    RoomReg['Childs'] = parseFloat(<any>this.registrationSource.Childs || 0);
    RoomReg['Adults'] = parseFloat(<any>this.registrationSource.Adults || 0);
    RoomReg['NoOfDays'] = parseFloat(<any>this.registrationSource.NoOfDays || 0);
    RoomReg['RoomBookingId'] = parseFloat(<any>this.registrationSource.RoomBookingId || 0);
    RoomReg['RegistrationAdvanceAmt'] = parseFloat(<any>this.registrationSource.Registration_AdvanceAmt || 0);
    RoomReg['BranchId'] = parseFloat(this.dBranchId || 0);


    let ListRoomRegDtl = [];
    for (let j = 0; j < this.roomBookingDetails.length; j++) {
      let RoomregDtl = {};
      RoomregDtl['RoomId'] = parseFloat((this.roomBookingDetails[j].Room_Id) || 0);
      RoomregDtl['Rate'] = parseFloat((this.roomBookingDetails[j].RoomType_Rent) || 0);
      RoomregDtl['RegistrationFlag'] = 'No';
      ListRoomRegDtl.push(RoomregDtl);
    }
    RoomReg['RoomRegistrationDetails'] = ListRoomRegDtl;
    ListRoomReg.push(RoomReg);

    let body = JSON.stringify(RoomReg);
    this._appService.post('Master/fnSaveRoomRegistration', body).subscribe(data => {
      this._appService.openSnackBar('Saved Successfully', 'Success');
      this.roomBookingDetails.splice(0);
      this.fnHome();
    });
  }

  fngetRoomReg() {
    this._appService.get('GetRepository/getRegistrations?terms=' + this.searchText + '&branchId=' + this.dBranchId)
      .subscribe(result => {
        this.roomRegistrationList = result;
      }, error => console.error(error));
  }
  fnSearchText(eve) {
    this.searchText = eve.target.value;
    this.fngetRoomReg();
  }
  fnAnchorClick(data) {
    this.createFlag = false;
    this.backFlag = false;
    var CheckoutDate = new Date(data.CheckoutDate);
    var CheckInDate = new Date(data.CheckInDate);

    if (Math.abs(CheckoutDate.getTime()) < Math.abs(CheckInDate.getTime())) {

      if (confirm('Date is expiry! Are you change date? ' + name)) {
        this.registrationSource.CheckoutDate = new Date();
        this.registrationSource.CheckInDate = new Date();
        this.registrationSource.CheckoutDate.setDate(this.registrationSource.CheckoutDate.getDate() + 1);
        this.fnDateChange();
        this.fnEditTable(data);
      } else {

        return;
      }

    } else if (Math.abs(CheckoutDate.getTime()) < Math.abs(CheckInDate.getTime())) {
      this.registrationSource.CheckInDate = new Date();
      this.registrationSource.CheckoutDate = data.CheckoutDate;
      this.fnDateChange();
      this.fnEditTable(data);
    } else {
      this.registrationSource.CheckInDate = data.CheckInDate;
      this.registrationSource.CheckoutDate = data.CheckoutDate;
      this.fnEditTable(data);
    }
  }

  fnEditTable(data) {  
    this.registrationSource = {
      RoomRegistration_Id: data.RoomRegistrationId, CustomerName: data.CustomerName,
      CustAddress: data.CustAddress, Identification: data.Identification,
      Registration_Date: data.RegistrationDate, Registration_Time: this.TodayTime,
      CheckInDate: data.CheckInDate, CheckoutDate: data.CheckoutDate,
      Adults: data.Adults, Childs: data.Childs, NoOfDays: data.NoOfDays,
      Registration_AdvanceAmt: data.RegistrationAdvanceAmt, Amount: data.Amount,
      CheckOutFlag: data.CheckOutFlag, Phone: data.Phone, Email: data.Email,
      Identification_Id: data.IdentificationId, RoomBookingId: data.RoomBookingId, Room_Id: data.RoomId
    };
    this.roomRegDetailGets();
  }

  roomRegDetailGets() {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'RoomDetails_GetOnRoomRegId';
    let oProcParams = [];
    let ProcParams = {};

    ProcParams['strKey'] = 'RoomRegistration_Id';
    ProcParams['strArgmt'] = this.registrationSource.RoomRegistration_Id.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.dBranchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);
    this._appService.post('CommonQuery/fnGetDataReport', body).subscribe(data => {
      let jsonData = JSON.parse(data);
      
      for (var i = 0; i < jsonData.length; i++) {
        let Rooms = {};
        Rooms['Room_Id'] = jsonData[i].Room_Id1;
        Rooms['Room_No'] = jsonData[i].Room_No;
        Rooms['RoomType_Id'] = jsonData[i].RoomType_Id;
        Rooms['RoomType_Name'] = jsonData[i].RoomType_Name;
        Rooms['RoomType_Rent'] = jsonData[i].RoomType_Rent;
        Rooms['RoomType_SingRent'] = jsonData[i].RoomType_SingRent;
        Rooms['Floor_Id'] = jsonData[i].Floor_Id;
        Rooms['Floor_Name'] = jsonData[i].Floor_Name;
        Rooms['BranchId1'] = jsonData[i].BranchId1;
        Rooms['RoomType_Duration'] = jsonData[i].RoomType_Duration;
        this.roomBookingDetails.push(Rooms);
      }

      this.tempDataForAddRoom['RoomDetails'] = this.RoomsDetail;
      this.tempDataForAddRoom['Floor'] = this.floors;
      this.tempDataForAddRoom['tempRoomDetails'] = this.tempRoomDetails;
      this.tempDataForAddRoom['roomBookingDetails'] = this.roomBookingDetails;
    });

  }
  openLoginDialog(item): void {
    const dialogRef = this.dialog.open(AddRoomDialog,
      {
        width: '900px',
        data: item,
        hasBackdrop: true,
        disableClose: false
      });
    dialogRef.afterClosed().subscribe(result => {
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


@Component({
  selector: 'AddRoomDialog',
  templateUrl: 'add-room-dialog.html',
  styleUrls: ['./room-registration.component.scss']
})

export class AddRoomDialog {
  floors: any;
  RoomsDetail: any;
  tempRoomDetails: any;
  roomBookingDetails: any;

  constructor(public dialogRef: MatDialogRef<AddRoomDialog>,
    @Inject(MAT_DIALOG_DATA) public data, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.fngetFloorDetails();
  }
  fngetFloorDetails() {
    this.floors = this.data.Floor;
    this.RoomsDetail = this.data.RoomDetails;
    this.tempRoomDetails = this.data.tempRoomDetails;
    this.roomBookingDetails = this.data.roomBookingDetails;
  }
  getCkeckedRoomDetail(Room, Index, eve) {

    if (Room.Room_IsBook == 'Yes') {
      return
    }
    if (eve.target.checked == true) {
      let element = <HTMLInputElement>document.getElementById(Room.Room_Id);
      element.style.border = '1px solid #ced4da';
      element.style.background = 'green';
      const Data = this.tempRoomDetails.filter(res => res.Room_Id == Room.Room_Id);
      this.pushesElements(Data)
    } else {
      let element = <HTMLInputElement>document.getElementById(Room.Room_Id);
      element.style.border = '1px solid silver';
      element.style.background = 'silver ';
      let index = this.roomBookingDetails.findIndex(res => res.Room_Id == Room.Room_Id);
      this.roomBookingDetails.splice(index, 1);
    }
  }
  pushesElements(Data) {
    let Rooms = {};
    Rooms['Room_Id'] = Data[0].Room_Id;
    Rooms['Room_No'] = Data[0].Room_No;
    Rooms['RoomType_Id'] = Data[0].RoomType_Id;
    Rooms['RoomType_Name'] = Data[0].RoomType_Name;
    Rooms['RoomType_Rent'] = Data[0].RoomType_Rent;
    Rooms['RoomType_SingRent'] = Data[0].RoomType_SingRent;
    Rooms['Floor_Id'] = Data[0].Floor_Id;
    Rooms['Floor_Name'] = Data[0].Floor_Name;
    Rooms['BranchId1'] = Data[0].BranchId1;
    Rooms['RoomType_Duration'] = Data[0].RoomType_Duration;
    this.roomBookingDetails.push(Rooms);
  }
  fnContinue() {
  }
  onNoClick(): void {
    this.dialogRef.close('');
  }
}