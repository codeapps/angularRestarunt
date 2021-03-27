import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { AreaService } from './area.service';


@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {
  areas: any;
  searchText: any = '';
  createFlag: boolean = true;
  areaSource = {
    AreaId: 0, AreaName: '', AreaShortName: '', CategoryId: 0, AreaDescription: ''
  }
  constructor(public _appService: AppService, public _areaService: AreaService) { }

  ngOnInit() {
    this.fnAreaGets();
  }
  fnAreaGets() {
    this._areaService.fnAreaGets(this.searchText).subscribe(data => {
      this.areas = JSON.parse(data);
    })
  }
  fnsearchText(eve) {
    this.searchText = eve.target.value;
    this.fnAreaGets();
  }
  fnCreate() {
    this.createFlag = false;
    this.fnClear();
  }
  fnBackToList() {
    this.createFlag = true;
    this.fnAreaGets();
  }
  fnClear() {
    this.areaSource = {
      AreaId: 0, AreaName: '', AreaShortName: '', CategoryId: 0, AreaDescription: ''
    }
  }
  fnAnchorClick(area) {
    this.createFlag = false;
    this.areaSource = {
      AreaId: area.Area_Id, AreaName: area.Area_Name, AreaShortName: area.Area_ShortName,
      AreaDescription: area.Area_Description, CategoryId: 0
    }
  }
  fnSave() {
    if (this.areaSource.AreaName == '' || this.areaSource.AreaName == null) {
      this._appService.openSnackBar('Please Enter Area Name', 'Warning');
      return;
    }
    let body = JSON.stringify(this.areaSource)
      this._appService.post('PostRepository/Area_insert', body).subscribe(data => {
        if(data == 0){
          this._appService.openSnackBar('Already Exists', 'Warning');
          return
        }        
        this._appService.openSnackBar('Saved Successfully', 'Success');
        this.fnClear();
        this.fnBackToList();
      })
  }
}
