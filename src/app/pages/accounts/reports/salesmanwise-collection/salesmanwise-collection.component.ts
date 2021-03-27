import { AppService } from './../../../../app.service';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-salesmanwise-collection',
  templateUrl: './salesmanwise-collection.component.html',
  styleUrls: ['./salesmanwise-collection.component.scss']
})
export class SalesmanwiseCollectionComponent implements OnInit {
  createFlag: boolean = true;
  fromDate = new Date();
  toDate = new Date();
  searchtext: any = '';

  salesManDataSource = new MatTableDataSource<Element>();
  salesManselection = new SelectionModel<Element>(true, []);
  salesMancolumnsToDisplay: any[] = ['AC_Id', 'AC_Name'];

  CategoryDataSource = new MatTableDataSource<Element>();
  Categoryselection = new SelectionModel<Element>(true, []);
  CategorycolumnsToDisplay: any[] = ['CategoryId', 'CategoryName'];

  AreaDataSource = new MatTableDataSource<Element>();
  Areaselection = new SelectionModel<Element>(true, []);
  AreacolumnsToDisplay: any[] = ['Area_Id', 'Area_Name'];


  dBranchId = localStorage.getItem("SessionBranchId");
  strBranchName = localStorage.getItem('SessionBranchName');
  searchText: any = '';
  datalist: any = [];
  strReportHeadName: any = 'SalesManWise Collection Report';
  radioValue: any = 'Salesmanwise';

  constructor(public _appService: AppService) { }

  salesmanisAllSelected() {
    const numSelected = this.salesManselection.selected.length;
    const numRows = this.salesManDataSource.data.length;
    return numSelected === numRows;
  }
  salesmanmasterToggle() {

    this.salesmanisAllSelected() ?
      this.salesManselection.clear() :
      this.salesManDataSource.data.forEach(row => this.salesManselection.select(row));
  }
  /** The label for the checkbox on the passed row */
  salesmancheckboxLabel(row?: any): string {
    if (!row) {
      return `${this.salesmanisAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.salesManselection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  CategoryisAllSelected() {
    const numSelected = this.Categoryselection.selected.length;
    const numRows = this.CategoryDataSource.data.length;
    return numSelected === numRows;
  }
  CategorymasterToggle() {

    this.CategoryisAllSelected() ?
      this.Categoryselection.clear() :
      this.CategoryDataSource.data.forEach(row => this.Categoryselection.select(row));
  }
  /** The label for the checkbox on the passed row */
  CategorycheckboxLabel(row?: any): string {
    if (!row) {
      return `${this.CategoryisAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.Categoryselection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  AreaisAllSelected() {
    const numSelected = this.Areaselection.selected.length;
    const numRows = this.AreaDataSource.data.length;
    return numSelected === numRows;
  }
  AreamasterToggle() {

    this.AreaisAllSelected() ?
      this.Areaselection.clear() :
      this.AreaDataSource.data.forEach(row => this.Areaselection.select(row));
  }
  /** The label for the checkbox on the passed row */
  AreacheckboxLabel(row?: any): string {
    if (!row) {
      return `${this.AreaisAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.Areaselection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }


  ngOnInit() {
    this.fnSalesmanGets();
  }

  myPageChange() {
    this.createFlag = true;
    this.datalist = '';
    this.Areaselection.clear();
    this.Categoryselection.clear();
    this.salesManselection.clear();
  }

  fnSalesmanGets() {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'SalesExecutive_GetsNew';
    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'SalesExe_Name';
    ProcParams['strArgmt'] = this.searchText;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.dBranchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      let jsonData = JSON.parse(data);
      this.salesManDataSource = new MatTableDataSource(jsonData);
    });
  }

  fnAreaGroupGets() {
    let id = 17;
    this._appService.get(`GetRepository/Category_GetOnTypeId?typeId=${id}`).subscribe(data => {
      let jsonData:any = data;      
      this.CategoryDataSource = new MatTableDataSource(jsonData);
    });
  }

  fnSearchText(eve) {
    this.searchText = eve;
    this.fnSalesmanGets();
  }

  fnAreaGets() {

    var varArguements = {};
    varArguements = { Area_Name: '' };

    var DictionaryObject = {};
    DictionaryObject['dictArgmts'] = varArguements;
    DictionaryObject['ProcName'] = 'Area_Gets';

    let body = JSON.stringify(DictionaryObject);

    this._appService.post('Master/Area_Gets', body).subscribe(data => {
      let jsonData = JSON.parse(data);
      this.AreaDataSource = new MatTableDataSource(jsonData);
    });
  }

  fnRadioValuesChange() {
    this.fnlear();
    if (this.radioValue == 'Salesmanwise')
      this.fnSalesmanGets();
    else if (this.radioValue == 'Areawise')
      this.fnAreaGets();
    else
      this.fnAreaGroupGets();
  }
  fnlear() {
    this.AreaDataSource.filteredData = [];
    this.CategoryDataSource.filteredData = [];
    this.salesManDataSource.filteredData = [];
  }
  fnGetReport() {
    if (this.radioValue == 'Salesmanwise') {
      this.fnSalesmanwiseCollection();
    } else if (this.radioValue == 'AreaGroupwise') {
      this.fnAreaGroupwiseCollection();
    } else if (this.radioValue == 'Areawise') {
      this.fnAreawiseCollection();
    }

  }

  fnSalesmanwiseCollection() {
    let salesManDataSource: any = this.salesManselection.selected;
    if (salesManDataSource.length == 0) {
      this._appService.openSnackBar('Please Select The SalesMan', 'Warning');
      return;
    }
    let nCount = 0;
    let ComIds = '';
    salesManDataSource.forEach(item => {
      if (nCount == 0) {
        ComIds = '  and (voucherdetails.RepId= ' + item.AC_Id;
      } else {
        ComIds += ' or voucherdetails.RepId= ' + item.AC_Id;
      }
      nCount = nCount + 1;
    });

    if (nCount > 0) {
      ComIds += ' )';
    }

    let ServiceParams = {};
    ServiceParams['strProc'] = 'SalesmanwiseCollection';
    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'SalesManId';
    ProcParams['strArgmt'] = ComIds.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.dBranchId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'FromDate';
    ProcParams['strArgmt'] = this.ConvertDateAll(this.fromDate);
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'ToDate';
    ProcParams['strArgmt'] = this.ConvertDateAll(this.toDate);
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReport', body).subscribe(data => {
      let jsonData = JSON.parse(data);
      this.datalist = jsonData;
      this.createFlag = false;
    });
  }

  fnAreaGroupwiseCollection() {

    let CategoryDataSource: any = this.Categoryselection.selected;
    if (CategoryDataSource.length == 0) {
      this._appService.openSnackBar('Please Select The Category..', 'Warning');
      return;
    }
    let nCount = 0;
    let ComIds = '';
    CategoryDataSource.forEach(item => {
      if (nCount == 0) {
        ComIds = '  where  (Categories.CategoryID= ' + item.CategoryId;
      } else {
        ComIds += ' or Categories.CategoryID= ' + item.CategoryId;
      }
      nCount = nCount + 1;
    });

    if (nCount > 0) {
      ComIds += ' )';
    }

    let ServiceParams = {};
    ServiceParams['strProc'] = 'AreaGroupwiseCollection';
    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'SalesManId';
    ProcParams['strArgmt'] = '';
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.dBranchId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'FromDate';
    ProcParams['strArgmt'] = this.ConvertDateAll(this.fromDate);
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'ToDate';
    ProcParams['strArgmt'] = this.ConvertDateAll(this.toDate);
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'GroupIds';
    ProcParams['strArgmt'] = ComIds;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      let jsonData = JSON.parse(data);
      this.datalist = jsonData;
      this.createFlag = false;
    });
  }

  fnAreawiseCollection() {
    let areaDataSource: any = this.Areaselection.selected;

    if (areaDataSource.length == 0) {
      this._appService.openSnackBar('Please Select The AreaName', 'Warning');
      return;
    }

    let nCount = 0;
    let ComIds = '';
    areaDataSource.forEach(item => {
      if (nCount == 0) {
        ComIds = '  where  (Area.Area_Id = ' + item.Area_Id;
      } else {
        ComIds += ' or Area.Area_Id = ' + item.Area_Id;
      }
      nCount = nCount + 1;
    });

    if (nCount > 0) {
      ComIds += ' )';
    }

    let ServiceParams = {};
    ServiceParams['strProc'] = 'AreawiseCollection';
    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'SalesManId';
    ProcParams['strArgmt'] = '';
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.dBranchId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'FromDate';
    ProcParams['strArgmt'] = this.ConvertDateAll(this.fromDate);
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'ToDate';
    ProcParams['strArgmt'] = this.ConvertDateAll(this.toDate);
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'AreaIds';
    ProcParams['strArgmt'] = ComIds;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      let jsonData = JSON.parse(data);
      this.datalist = jsonData;
      this.createFlag = false
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
