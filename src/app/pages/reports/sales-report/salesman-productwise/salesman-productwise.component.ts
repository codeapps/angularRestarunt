import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { AppService } from 'src/app/app.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-salesman-productwise',
  templateUrl: './salesman-productwise.component.html',
  styleUrls: ['./salesman-productwise.component.scss']
})
export class SalesmanProductwiseComponent implements OnInit {
  date = new Date();
  fromDate = new Date();
  toDate = new Date();
  createFlag: boolean = true;
  dataSource = new MatTableDataSource<Element>();
  selection = new SelectionModel<Element>(true, []);

  CatdataSource = new MatTableDataSource<Element>();
  Catselection = new SelectionModel<Element>(true, []);
  CatcolumnsToDisplay: any[] = ['CategoryID', 'CategoryName'];
  sortBy: any;
  columnsToDisplay: any[] = ['AC_Id', 'AC_Name'];
  searchtext: any = '';
  rdoValue = 'Summary';
  datalist: any = [];
  strReportHeadName: any = 'Category Sales Report';
  dBranchId = localStorage.getItem('SessionBranchId');
  categoryFlag: boolean = false;

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

  CatisAllSelected() {
    const numSelected = this.Catselection.selected.length;
    const numRows = this.CatdataSource.data.length;
    return numSelected === numRows;
  }
  CatmasterToggle() {

    this.CatisAllSelected() ?
      this.Catselection.clear() :
      this.CatdataSource.data.forEach(row => this.Catselection.select(row));
  }
  /** The label for the checkbox on the passed row */
  CatcheckboxLabel(row?: any): string {
    if (!row) {
      return `${this.CatisAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.Catselection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  ngOnInit() {
    this.fnSalesManget();
  }

  fnSalesManget() {
    let ServiceParams = {};
    ServiceParams['strProc'] = "SalesExecutive_GetsNew";
    var oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "SalesExe_Name";
    ProcParams["strArgmt"] = "";
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.dBranchId;
    oProcParams.push(ProcParams)

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams)

    this._appService.post('CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      let jsonData = JSON.parse(data)
      this.dataSource = new MatTableDataSource(jsonData);
    });
    this.fngetCategory();
  }

  fngetCategory() {
    
    let id = 1;
    this._appService.get(`GetRepository/Category_GetOnTypeId?typeId=${id}`).subscribe(data => {
      let jsonData:any = data;
      this.CatdataSource = new MatTableDataSource(jsonData);
    });
  }

  fnSearchText(eve) {

  }

  fngetReport() {
    if (this.rdoValue == 'ProductWiseSalesDetailed' || this.rdoValue == 'ProductWiseSalesSummary') {
      this.fnSalesmanProductwiseSales();
    } else if (this.rdoValue == 'Summary' || this.rdoValue == 'Detailed') {
      this.fnSalesmanwisSales();
    } else if (this.rdoValue == 'CategorywiseSales') {
      this.fnSalesmanCategorywiseSales();
    }
  }

  fnChangeRdo(eve) {
    this.rdoValue = eve.value;
    if (this.rdoValue == 'CategorywiseSales') {
      this.categoryFlag = true;
    } else { this.categoryFlag = false; }
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

  fnSalesmanProductwiseSales() {
    var CustomerCount = 0;
    var AcIds = "";
    let AccSource: any = this.selection.selected;
    AccSource.forEach(item => {
      if (CustomerCount == 0) {
        AcIds = ' and (Issues.Issues_SalesmanId =' + item.AC_Id;

      } else {
        AcIds += 'or Issues.Issues_SalesmanId= ' + item.AC_Id;
      }
      CustomerCount = CustomerCount + 1;
    });
    if (CustomerCount == 0) {
      this._appService.openSnackBar('Please Select Atleast One Sales Man', 'Warning');
      return;
    } else {
      AcIds += ' ) ';
    }

    let ServiceParams = {};
    if (this.rdoValue == 'ProductWiseSalesDetailed') {
      ServiceParams['strProc'] = "Issue_SalesmanProductwiseSales";
    } else {
      ServiceParams['strProc'] = "Issue_SalesmanProductwiseSalesSummary";
    }
    let oProcParams = [];
    let ProcParams = {};

    ProcParams["strKey"] = "FROMDATE";
    ProcParams["strArgmt"] = this.ConvertDateAll(this.fromDate);
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "TODATE";
    ProcParams["strArgmt"] = this.ConvertDateAll(this.toDate);
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "SalesManId";
    ProcParams["strArgmt"] = AcIds;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.dBranchId;
    oProcParams.push(ProcParams)

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams)

    this._appService.post('CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      let jsonData = JSON.parse(data);
      this.datalist = jsonData;
      this.createFlag = false;  
    })
  }

  fnSalesmanwisSales() {
    var CustomerCount = 0;
    let AccountIds = "";
    let AccSource: any = this.selection.selected;

    AccSource.forEach(item => {
      if (CustomerCount == 0) {
        AccountIds = ' and (Issues.Issues_SalesmanId =' + item.AC_Id;

      } else {
        AccountIds += ' or Issues.Issues_SalesmanId= ' + item.AC_Id;
      }
      CustomerCount = CustomerCount + 1;
    });

    if (CustomerCount == 0) {
      this._appService.openSnackBar('Please Select Atleast One Sales Man', 'Warning');
      return;
    } else {
      AccountIds += ' ) ';
    }
    var ServiceParams = {};

    if (this.rdoValue == "Detailed")
      ServiceParams['strProc'] = "Issue_SalesmanwiseSalesNew";
    else {
      ServiceParams['strProc'] = "Issue_SalesmanwiseSalesConsole";
    }
    var oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "FromDate";
    ProcParams["strArgmt"] = this.ConvertDateAll(this.fromDate);
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "ToDate";
    ProcParams["strArgmt"] = this.ConvertDateAll(this.toDate);
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "SalesManId";
    ProcParams["strArgmt"] = AccountIds;
    oProcParams.push(ProcParams)


    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.dBranchId;
    oProcParams.push(ProcParams)

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      let jsonData = JSON.parse(data);
      this.datalist = jsonData;
      this.createFlag = false;
    });
  }

  fnSalesmanCategorywiseSales() {
    var CustomerCount = 0;
    var AcIds = "";
    let AccSource: any = this.selection.selected;
    AccSource.forEach(item => {
      if (CustomerCount == 0) {
        AcIds = ' and (Issues.Issues_SalesmanId =' + item.AC_Id;

      } else {
        AcIds += 'or Issues.Issues_SalesmanId= ' + item.AC_Id;
      }
      CustomerCount = CustomerCount + 1;
    });
    if (CustomerCount == 0) {
      this._appService.openSnackBar('Please Select Atleast One Sales Man', 'Warning');
      return;
    } else {
      AcIds += ' ) ';
    }

    let cateCount = 0;
    let CatIds = '';
    let catSource: any = this.Catselection.selected;
    catSource.forEach(item => {
      if (cateCount == 0) {
        CatIds = ' and (Categories.CategoryID =' + item.CategoryId;

      } else {
        CatIds += 'or Categories.CategoryID= ' + item.CategoryId;
      }
      cateCount = CustomerCount + 1;
    });
    if (cateCount == 0) {
      this._appService.openSnackBar('Please Select Atleast One Category', 'Warning');
      return;
    } else {
      CatIds += ' ) ';
    }

    var ServiceParams = {};
    ServiceParams['strProc'] = "Issue_SalesmanCategoryProductwiseSales";

    var oProcParams = [];
    let ProcParams = {};

    ProcParams["strKey"] = "FROMDATE";
    ProcParams["strArgmt"] = this.ConvertDateAll(this.fromDate);
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "TODATE";
    ProcParams["strArgmt"] = this.ConvertDateAll(this.toDate);
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "SalesManId";
    ProcParams["strArgmt"] = AcIds.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "CategoryIds";
    ProcParams["strArgmt"] = CatIds;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.dBranchId;
    oProcParams.push(ProcParams)

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      let jsonData = JSON.parse(data);
      this.datalist = jsonData;
      this.createFlag = false;  
    })
  }

}
