import { AppService } from 'src/app/app.service';
import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-adjustmentreport',
  templateUrl: './adjustmentreport.component.html',
  styleUrls: ['./adjustmentreport.component.scss']
})
export class AdjustmentreportComponent implements OnInit {
  createFlag: boolean = true;
  fromDate = new Date();
  toDate = new Date();
  searchtext: any = '';
  dataSource = new MatTableDataSource<Element>();
  selection = new SelectionModel<Element>(true, []);
  columnsToDisplay: any[] = ['AC_Id', 'AC_Name'];
  dBranchId = localStorage.getItem("SessionBranchId");
  datalist: any = [];
  strReportHeadName: any = 'CreditNote Sales Report';
  strBranchName = localStorage.getItem('SessionBranchName');
  selected: any = 'PendingList';


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
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  ngOnInit() {
    this.fngetCustomer();
  }

  fngetCustomer() {
    var ServiceParams = {};
    ServiceParams['strProc'] = 'AccountHead_Gets';

    let oProcParams = [];
    let ProcParams = {};
    ProcParams['strKey'] = 'Search';
    ProcParams['strArgmt'] = this.searchtext;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.dBranchId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'TypeFlag';
    ProcParams['strArgmt'] = 'Customer';
    oProcParams.push(ProcParams);
    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReport', body).subscribe(data => {
      let jsonData = JSON.parse(data);
      this.dataSource = new MatTableDataSource(jsonData);
    });
  }

  fngetReport(){
    if (this.selected == 'PendingList') {
      this.fnAdjustmentPendingList();
    } else if (this.selected == 'AdjustmentReport') {
     this.fnAmountAdjustmentReport();
    }
  }

  fnAdjustmentPendingList() {
    let pendingDataSource: any = this.selection.selected;
    let nCout = 0;
    var CustIds = '';

    for (var i = 0; i < pendingDataSource.length; i++) {
      if (nCout == 0) {
        CustIds = ' and (AccountHead.Ac_id =' + pendingDataSource[i].AC_Id;
      } else {
        CustIds += ' or AccountHead.Ac_id =' + pendingDataSource[i].AC_Id;
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

    var ServiceParams = {};
    ServiceParams['strProc'] = 'ReturnAdjustmentLog_PendingList';
    ServiceParams['JsonFileName'] = 'JsonArrayScriptTwo';

    let oProcParams = [];
    let ProcParams = {};

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsAcIds';
    ProcParams['strArgmt'] = CustIds;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsBranchId';
    ProcParams['strArgmt'] = this.dBranchId;
    oProcParams.push(ProcParams);
    ServiceParams['oProcParams'] = oProcParams;

    var dictArgmts = { strHeading: this.strReportHeadName, strBranchName: this.strBranchName };
    var DictionaryObject = {};
    DictionaryObject['dictArgmts'] = dictArgmts;
    ServiceParams['DictionaryObject'] = DictionaryObject;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportFromScriptJsonFile', body).subscribe(data => {
      this.datalist = JSON.parse(data.JsonDetails[0]);
      this.createFlag = false;
    });
  }

  fnAmountAdjustmentReport() {
    let pendingDataSource: any = this.selection.selected;
    let nCout = 0;
    var CustIds = '';

    for (var i = 0; i < pendingDataSource.length; i++) {
      if (nCout == 0) {
        CustIds = ' and (AccountHead.Ac_id =' + pendingDataSource[i].AC_Id;
      } else {
        CustIds += ' or AccountHead.Ac_id =' + pendingDataSource[i].AC_Id;
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

    var ServiceParams = {};
    ServiceParams['strProc'] = 'ReturnAdjustmentReport';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'FromDate';
    ProcParams['strArgmt'] = this.ConvertDateAll(this.fromDate);
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'ToDate';
    ProcParams['strArgmt'] = this.ConvertDateAll(this.toDate);
    oProcParams.push(ProcParams);


    ProcParams = {};
    ProcParams['strKey'] = 'AcIds';
    ProcParams['strArgmt'] = CustIds;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.dBranchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    var dictArgmts = { strHeading: this.strReportHeadName, strBranchName: this.strBranchName };
    var DictionaryObject = {};
    DictionaryObject['dictArgmts'] = dictArgmts;
    ServiceParams['DictionaryObject'] = DictionaryObject;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportNewAcc', body).subscribe(data => {
      this.datalist = JSON.parse(data);
      this.createFlag = false;
    });
  }

  fnSearchText(eve) {
    this.searchtext = eve;
    this.fngetCustomer();
  }

  myPageChange() {
    this.createFlag = true;
    this.datalist = '';
  }

  ConvertDateAll(format) {
    let date = ("0" + format.getDate()).slice(-2);
    let month = ("0" + (format.getMonth() + 1)).slice(-2);
    let year = format.getFullYear();
    const dateconvert = year + '-' + month + '-' + date;
    return dateconvert;
  }
}
