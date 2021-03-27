import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-floor',
  templateUrl: './floor.component.html',
  styleUrls: ['./floor.component.scss']
})
export class FloorComponent implements OnInit {
  createFlag: boolean = true;
  searchText: any = '';
  dBranchId:any = localStorage.getItem("SessionBranchId")
  floors: any;
  floorSource = {
    FloorId: 0, FloorName: '', FloorNoRooms: '', BranchId: this.dBranchId
  }
  constructor(public _appService: AppService) { }

  ngOnInit() {
    this.getFloor();
  }
  getFloor() {
    this._appService.get('GetRepository/getFloors?terms=' + this.searchText + '&branchId=' + this.dBranchId)
      .subscribe(result => {
        this.floors = result;

      }, error => console.error(error));
  }

  fnCreate() {
    this.createFlag = false;
  }

  fnsearchText(eve) {
    this.searchText = eve.target.value;
    this.getFloor();
  }

  fnBack() {
    this.createFlag = true
    this.getFloor();
    this.fnClear();
  }

  fnClear() {
    this.floorSource = {
      FloorId: 0, FloorName: '', FloorNoRooms: '', BranchId: this.dBranchId
    }
  }
  fnAnchorClick(data) {
    this.createFlag = false;
    this.floorSource = {
      FloorId: data.FloorId, FloorName: data.FloorName, FloorNoRooms: data.FloorNoRooms, BranchId: this.dBranchId
    }
  }

  fnSave() {
    if (this.floorSource.FloorName == '' || this.floorSource.FloorName == null) {
      this._appService.openSnackBar('Please Enter The FloorName', 'Warning');
      return;
    }
    if (this.floorSource.FloorNoRooms == '' || this.floorSource.FloorNoRooms == null) {
      this._appService.openSnackBar('Please Enter The No Of Rooms ', 'Warning');
      return;
    }
    let dataSource = {
      FloorId: this.floorSource.FloorId,
      FloorName :this.floorSource.FloorName,
      FloorNoRooms :parseFloat(<any>this.floorSource.FloorNoRooms || 0),
      BranchId : parseFloat(this.dBranchId || 0)
    }
    let body = JSON.stringify(dataSource);
    this._appService.post('PostRepository/postFloors', body).subscribe(data => {
      this._appService.openSnackBar('Saved Successfully', 'Success');
      this.fnBack();
    })
  }
}
