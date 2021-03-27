import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-room-create',
  templateUrl: './room-create.component.html',
  styleUrls: ['./room-create.component.scss']
})
export class RoomCreateComponent implements OnInit {
  createFlag: boolean = true;
  dBranchId = localStorage.getItem("SessionBranchId");
  roomSource = {
    Room_Id: 0, Room_No: '', Room_Delete: '', Floor_Id: '', RoomType_Id: '', Room_IsBook: 'No', BillNo: '', Floor_Name: '',
    RoomType_Name: '', RoomType_Rent: '', BranchId: this.dBranchId
  }
  searchText: any = '';
  roomTypes: Object;
  floors: any;
  rooms: any;


  constructor(public _appService: AppService) { }

  ngOnInit() {
    this.getRoomType();
  }

  getRoomType() {
    this._appService.get('GetRepository/getRoomTypes?terms=' + this.searchText + '&branchId=' + this.dBranchId)
      .subscribe(result => {
        this.roomTypes = result;
      }, error => console.error(error));
    this.getFloor();
  }
  getFloor() {
    this._appService.get('GetRepository/getFloors?terms=' + this.searchText + '&branchId=' + this.dBranchId)
      .subscribe(result => {
        this.floors = result;
      }, error => console.error(error));
    this.getRoom();
  }
  getRoom() {
    this._appService.get('GetRepository/getRooms?terms=' + this.searchText + '&branchId=' + this.dBranchId)
      .subscribe(result => {
        this.rooms = result;
      }, error => console.error(error));
  }

  fnAnchorClick(data) {
    this.createFlag = false;
    this.roomSource = {
      Room_Id: data.Room_Id, Room_No: data.Room_No, Room_Delete: data.Room_Delete,
      Floor_Id: data.Floor_Id, RoomType_Id: data.RoomType_Id, Room_IsBook: data.Room_IsBook,
      BillNo: data.BillNo, Floor_Name: data.Floor_Name,
      RoomType_Name: data.RoomType_Name, RoomType_Rent: data.RoomType_Rent, BranchId: this.dBranchId
    }
  }

  fnCreate() {
    this.createFlag = false;
  }

  fnsearchText(eve) {
    this.searchText = eve.target.value;
    this.getRoom();
  }

  fnBack() {
    this.createFlag = true;
    this.getRoom();
    this.fnClear();
  }

  fnClear() {
    this.roomSource = {
      Room_Id: 0, Room_No: '', Room_Delete: '', Floor_Id: '', RoomType_Id: '', Room_IsBook: '', BillNo: '', Floor_Name: '',
      RoomType_Name: '', RoomType_Rent: '', BranchId: this.dBranchId
    }
  }

  fnSave() {
    if (this.roomSource.Room_No == '' || this.roomSource.Room_No == null) {
      this._appService.openSnackBar('Please Enter The Room No', 'Warning');
      return
    }
    if (this.roomSource.Floor_Id == '' || this.roomSource.Floor_Id == null) {
      this._appService.openSnackBar('Please Select The Floor', 'Warning');
      return
    }
    if (this.roomSource.RoomType_Id == '' || this.roomSource.RoomType_Id == null) {
      this._appService.openSnackBar('Please Select The RoomType', 'Warning');
      return
    }
    let dataSource = {
      RoomId: this.roomSource.Room_Id,
      RoomNo: this.roomSource.Room_No,
      RoomDelete: this.roomSource.Room_Delete,
      FloorId: parseFloat(<any>this.roomSource.Floor_Id || 0),
      RoomTypeId: parseFloat(<any>this.roomSource.RoomType_Id),
      RoomIsBook: this.roomSource.Room_IsBook,
      BillNo: parseFloat(<any>this.roomSource.BillNo || 0),
      BranchId: parseFloat(<any>this.roomSource.BranchId || 0)
    }
    let body = JSON.stringify(dataSource);
    this._appService.post('PostRepository/postRooms', body).subscribe(data => {
      this._appService.openSnackBar('Saved Successfully', 'Success');
      this.fnBack();
    });
  }

}
