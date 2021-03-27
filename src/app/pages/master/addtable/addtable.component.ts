import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { AddtableService } from './addtable.service';

@Component({
  selector: 'app-addtable',
  templateUrl: './addtable.component.html',
  styleUrls: ['./addtable.component.scss']
})
export class AddtableComponent implements OnInit {
  createFlag: boolean = true;
  searchText: any = '';
  dBranchId: any = localStorage.getItem('SessionBranchId');
  dStaffId: any = localStorage.getItem('SessionStaffId');
  addtableDetails: any;

  addTabelSource = {
    TableId: 0, TableName: '', TableCode: '', TableStatus: 'Yes', TempInvoiceNo: 0, StaffId: parseFloat(this.dStaffId || 0), BranchId: parseFloat(this.dBranchId || 0)
  }

  constructor(public _appService: AppService, private _accService: AddtableService) { }

  ngOnInit() {
    this.getTables();
  }

  getTables() {
    this._accService.fnTableGetsAll(this.searchText)
      .subscribe(data => {
        this.addtableDetails = data;
      }, error => console.error(error));
  }

  fnCreate() {
    this.createFlag = false;
  }

  fnsearchText(eve) {
    this.searchText = eve.target.value;
    this.getTables();
  }

  fnAnchorClick(data) {
    this.createFlag = false;
    this.addTabelSource = {
      TableId: data.TableId, TableName: data.TableName,
      TableCode: data.TableCode, TableStatus: data.TableStatus,
      TempInvoiceNo: data.TempInvoiceNo, StaffId: data.StaffId,
      BranchId: parseFloat(this.dBranchId || 0)
    }
  }

  fnSave() {
    if (this.addTabelSource.TableName == '' || this.addTabelSource.TableName == null) {
      this._appService.openSnackBar('Please Enter The Table Name', 'Warning');
      return;
    }
    let body = JSON.stringify(this.addTabelSource);
    this._appService.post('PostRepository/PostTable', body).subscribe(data => {
      this._appService.openSnackBar('Saved Successfully', 'Success');
      this.fnBackToList();
    });
  }

  fnBackToList() {
    this.fnClear();
    this.getTables();
    this.createFlag = true;
  }

  fnClear() {
    this.addTabelSource = {
      TableId: 0, TableName: '', TableCode: '', TableStatus: 'Yes', TempInvoiceNo: 0, StaffId: parseFloat(this.dStaffId || 0), BranchId: parseFloat(this.dBranchId || 0)
    }
  }
}
