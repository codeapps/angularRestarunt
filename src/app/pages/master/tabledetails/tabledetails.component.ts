import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { LoginComponent } from 'src/app/login/login.component';
import { TabledetailsService } from './tabledetails.service';
import { AddtableService } from '../addtable/addtable.service';

@Component({
  selector: 'app-tabledetails',
  templateUrl: './tabledetails.component.html',
  styleUrls: ['./tabledetails.component.scss']
})
export class TabledetailsComponent implements OnInit {
  dBranchId:any = localStorage.getItem("SessionBranchId")
  dStaffId:any = localStorage.getItem('SessionStaffId');
  addTables: any;
  tableDetailsSource: any = [];
  tableId: any;


  constructor(public _appService: AppService,public tableSevice:AddtableService,public detailsService:TabledetailsService) { }

  ngOnInit() {
    this.fnAddRow('');
    this.getTables();
  }
  getTables() {   
      this.tableSevice.fnTableGetsAll('').subscribe(data => {
        this.addTables = data;
      }, error => console.error(error));
  }

  fnTableOnChange() {
    this.fnclear();
   this.detailsService.fngetTableDetails(this.tableId).subscribe(data => {
      let result: any = data;
      if (result.length > 0) {
        result.forEach(ele => {
          let rowObj = {};
          rowObj = {
            TableDetailsId: ele.TableDetails_Id, TableDetailsName: ele.TableDetails_Name,
            TableDetailsCode: ele.TableDetails_Code, TableId: ele.Table_Id,
            BillNo: ele.BillNo, BranchId: parseFloat(this.dBranchId || 0), StaffId: parseFloat(this.dStaffId || 0)
          };
          this.tableDetailsSource.push(rowObj);
        });
      } else {
        this.fnAddRow('');
      }
    });
  }

  fnAddRow(data) {
    if (this.tableId == 0 || this.tableId == '' || this.tableId == null || this.tableId == undefined) {
      this._appService.openSnackBar('Please Select The Table...', 'Warning');
      return;
    }
    if (data.TableDetailsName == "") {
      this._appService.openSnackBar('Please Enter Table Name...', 'Warning');
      return;
    }
    let rowObj = {};
    rowObj = {
      TableDetails_Id: 0, TableDetailsName: '', TableDetailsCode: '', TableId: this.tableId,
      BillNo: 0, BranchId: parseFloat(this.dBranchId || 0), StaffId: parseFloat(this.dStaffId || 0)
    };
    this.tableDetailsSource.push(rowObj);
    setTimeout(() => {
      const maxLen = this.tableDetailsSource.length - 1;
      document.getElementById(`txtTableDetails_Name${maxLen}`).focus();
    }, 200);

  }

  removeRow(item) {
    if (this.tableDetailsSource.length > 1) {
      let index = this.tableDetailsSource.indexOf(item);
      this.tableDetailsSource.splice(index, 1);
      // if (item.Bill_Id != 0) {
      //   this.fnDeleteRow(item.Bill_Id)
      // }
    }
  }

  fnclear() {
    this.tableDetailsSource = [];
  }

  fnSave() {

    for (var i = 0; i < this.tableDetailsSource.length; i++) {
      if (this.tableDetailsSource[i].TableDetailsName == '') {
        this._appService.openSnackBar('Please Check That Any One Of the Row Is Empty', 'Warning');
        return;
      }
    }  

    let body = JSON.stringify(this.tableDetailsSource);
    this._appService.post('PostRepository/postTableDetails', body).subscribe(data => {        
      this._appService.openSnackBar('Updated Successfully','Success');
      this.fnTableOnChange();
      // this.fnAddRow('');
      // this.tableId = 0;
      
    })
  }
}
