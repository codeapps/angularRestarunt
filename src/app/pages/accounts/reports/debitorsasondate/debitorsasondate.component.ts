import { AppService } from 'src/app/app.service';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-debitorsasondate',
  templateUrl: './debitorsasondate.component.html',
  styleUrls: ['./debitorsasondate.component.scss']
})
export class DebitorsasondateComponent implements OnInit {
  createFlag: boolean = true;
  date = new Date();
  fromDate = new Date();
  searchtext: any = '';
  dataSource = new MatTableDataSource<Element>();
  selection = new SelectionModel<Element>(true, []);
  columnsToDisplay: any[] = ['AC_Id', 'AC_Name'];
  dBranchId = localStorage.getItem("SessionBranchId");
  strBranchName = localStorage.getItem('SessionBranchName');
  searchText: any = '';
  datalist: any = [];
  strReportHeadName: any = 'DebitNote Sales Report';

  constructor(public _appService: AppService) { }

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
    this.fnCustotmerGets();
  }

  fnCustotmerGets() {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'AcccountHead_GetsForReport';
    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'Ac_Name';
    ProcParams['strArgmt'] = this.searchText;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'Type';
    ProcParams['strArgmt'] = 'Customer';
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.dBranchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReport', body).subscribe(data => {
      let jsonData = JSON.parse(data);
      this.dataSource = new MatTableDataSource(jsonData);
    });
  }

  fnLeaderAsOnDate() {

    let DataSource: any = this.selection.selected;
    let nCout = 0;
    var CustIds = '';

    for (var i = 0; i < DataSource.length; i++) {
      if (nCout == 0) {
        CustIds = ' and (AccountHead.Ac_id =' + DataSource[i].AC_Id;
      } else {
        CustIds += ' or AccountHead.Ac_id =' + DataSource[i].AC_Id;
      }
      nCout = nCout + 1;
    }
    if (nCout > 0) {
      CustIds += ' ) ';
    }
    if (nCout == 0) {
      this._appService.openSnackBar('Please Select Customer', 'Warning')
      return;
    }

    let ServiceParams = {};
    ServiceParams['strProc'] = 'CustomerwiseLeaderAsOnDate';
    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'CustIds';
    ProcParams['strArgmt'] = CustIds.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.dBranchId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'CustOrSupp';
    ProcParams['strArgmt'] = 'Customer';
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'AsOnDate';
    ProcParams['strArgmt'] = this.ConvertDateAll(this.fromDate);
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    this.strReportHeadName = 'Debitors As On Date ' + this.fromDate;
    let fileNameExcel = this.strReportHeadName + '.xlsx';

    var dictArgmts = { strHeading: this.strReportHeadName, strBranchName: this.strBranchName };
    var DictionaryObject = {};
    DictionaryObject['dictArgmts'] = dictArgmts;
    ServiceParams['DictionaryObject'] = DictionaryObject;

    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      let jsonData = JSON.parse(data);
      this.datalist = jsonData;
      this.createFlag = false;
    });

  }

  fnSearchText(eve) {
    this.searchText = eve;
    this.fnCustotmerGets();
  }
  ConvertDateAll(format) {
    let date = ("0" + format.getDate()).slice(-2);
    let month = ("0" + (format.getMonth() + 1)).slice(-2);
    let year = format.getFullYear();
    const dateconvert = year + '-' + month + '-' + date;
    return dateconvert;
  }
  myPageChange() {
    this.createFlag = true;
    this.datalist = '';
  }

}
