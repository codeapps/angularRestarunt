import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-roomtype',
  templateUrl: './roomtype.component.html',
  styleUrls: ['./roomtype.component.scss']
})
export class RoomtypeComponent implements OnInit {
  createFlag: boolean = true;
  dBranchId = localStorage.getItem("SessionBranchId");
  roomSource = {
    RoomType_Id: 0, RoomType_Name: '', RoomType_NoofPers: '', RoomType_Rent: '', RoomType_SingRent: '', RoomType_ExtBedRent: '',
    RoomType_Tax: '', RoomType_Duration: '', BranchId: this.dBranchId
  }
  searchText: any = '';
  roomTypes: any;
  taxGroup: Object;


  constructor(public _appService: AppService) { }

  ngOnInit() {
    this.getTax();
    this.getRoomType();
  }

  getRoomType() {
    this._appService.get('GetRepository/getRoomTypes?terms=' + this.searchText + '&branchId=' + this.dBranchId)
      .subscribe(result => {
        this.roomTypes = result;
      });
  }

  fnCreate() {
    this.createFlag = false;
  }

  fnBack() {
    this.createFlag = true;
    this.getRoomType();
    this.fnClear();
  }

  fnClear() {
    this.roomSource = {
      RoomType_Id: 0, RoomType_Name: '', RoomType_NoofPers: '', RoomType_Rent: '', RoomType_SingRent: '', RoomType_ExtBedRent: '',
      RoomType_Tax: '', RoomType_Duration: '', BranchId: this.dBranchId
    }
  }

  fnAnchorClick(data) {
    this.createFlag = false;
    this.roomSource = {
      RoomType_Id: data.RoomTypeId, RoomType_Name: data.RoomTypeName, RoomType_NoofPers: data.RoomTypeNoofPers,
      RoomType_Rent: data.RoomTypeRent, RoomType_SingRent: data.RoomTypeSingRent, RoomType_ExtBedRent: data.RoomTypeExtBedRent,
      RoomType_Tax: data.RoomTypeTax, RoomType_Duration: data.RoomTypeDuration, BranchId: this.dBranchId
    }
  }

  fnsearchText(eve) {
    this.searchText = eve.target.value;
    this.getRoomType();
  }

  fnSave() {
    if (this.roomSource.RoomType_Name == '' || this.roomSource.RoomType_Name == null) {
      this._appService.openSnackBar('Please Enter The RoomType Name', 'Warning');
      return;
    }
    if (this.roomSource.RoomType_Tax == '' || this.roomSource.RoomType_Tax == null) {
      this._appService.openSnackBar('Please Select The Tax(%)', 'Warning');
      return;
    }

    let dataSource = {
      RoomTypeId: this.roomSource.RoomType_Id,
      RoomTypeName: this.roomSource.RoomType_Name,
      RoomTypeNoofPers: parseFloat(<any>this.roomSource.RoomType_NoofPers || 0),
      RoomTypeRent: parseFloat(<any>this.roomSource.RoomType_Rent || 0),
      RoomTypeSingRent: parseFloat(<any>this.roomSource.RoomType_SingRent || 0),
      RoomTypeExtBedRent: parseFloat(<any>this.roomSource.RoomType_ExtBedRent || 0),
      RoomTypeTax: parseFloat(<any>this.roomSource.RoomType_Tax || 0),
      RoomTypeDuration: parseFloat(<any>this.roomSource.RoomType_Duration || 0),
      NoOfRooms: parseFloat(<any>this.roomSource.RoomType_NoofPers || 0),
      BranchId: parseFloat(<any>this.roomSource.BranchId || 0)
    }
    let body = JSON.stringify(dataSource);
    this._appService.post('PostRepository/postRoomTypes', body).subscribe(data => {
      this._appService.openSnackBar('Saved Successfully', 'Success');
      this.fnBack();
    });
  }
  getTax() {
    this._appService.get('GetRepository/GetTaxGroups')
      .subscribe(result => {
        this.taxGroup = result;
      });
  }
}
