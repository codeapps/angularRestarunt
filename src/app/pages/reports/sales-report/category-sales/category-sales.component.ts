import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-category-sales',
  templateUrl: './category-sales.component.html',
  styleUrls: ['./category-sales.component.scss']
})
export class CategorySalesComponent implements OnInit {
  date = new Date();
  fromDate = new Date();
  toDate = new Date();
  createFlag: boolean = true;
  dataSource = new MatTableDataSource<Element>();
  selection = new SelectionModel<Element>(true, []);
  sortBy: any;
  columnsToDisplay: any[] = ['CategoryId', 'CategoryName'];
  searchtext: any = '';
  rdoValue = 'Summary';
  datalist: any = [];
  strReportHeadName: any = 'Category Sales Report';
  dBranchId = localStorage.getItem('SessionBranchId');

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
    this.getCategory();
  }
  getCategory() {
    this._appService.get('GetRepository/SearchCategory?terms=' + this.searchtext).subscribe(data => {
      let jsonObj: any = data
      this.dataSource = new MatTableDataSource(jsonObj);
    });
  }

  fnSearchText(data) {
    this.searchtext = data.target.value;
    this.getCategory();
  }
  fnChangeRdo(eve) {
    this.rdoValue = eve.value
  }

  myPageChange() {
    this.createFlag = true;
    this.datalist = '';
  }

  getCategoryReport() {

    let nCout = 0;
    let strCategoryIds = '';
    this.selection
    let categorySource: any = this.selection.selected
    for (var i = 0; i < categorySource.length; i++) {
      if (nCout == 0) {
        strCategoryIds = ' and (Categories.CategoryId =' + categorySource[i].CategoryId;
      } else {
        strCategoryIds += ' or Categories.CategoryId =' + categorySource[i].CategoryId;
      }
      nCout = nCout + 1;
    }
    if (nCout == 0) {
      this._appService.openSnackBar('Please Select Category', 'Warning')
      return;
    }
    if (nCout > 0) {
      strCategoryIds += ' ) ';
    }
    let ServiceParams = {};
    if (this.rdoValue == 'Summary') {
      ServiceParams['strProc'] = 'CategorywiseSalesSummary';
    } else {
      ServiceParams['strProc'] = 'CategorywiseSales';
    }
    let oProcParams = [];
    let ProcParams = {};

    ProcParams['strKey'] = 'Fromdate';
    ProcParams['strArgmt'] = this.ConvertDateAll(this.fromDate);
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'ToDate';
    ProcParams['strArgmt'] = this.ConvertDateAll(this.toDate);
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.dBranchId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'CategoryIds';
    ProcParams['strArgmt'] = strCategoryIds;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      let jsonData = JSON.parse(data);
      this.datalist = jsonData;
      this.createFlag = false;
    })
  }

  ConvertDateAll(format) {
    let date = format.getDate();
    let month = format.getMonth() + 1;
    let year = format.getFullYear();
    const dateconvert = year + '-' + month + '-' + date;
    return dateconvert;
  }
}
