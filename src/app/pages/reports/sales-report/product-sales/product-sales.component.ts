import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { AppService } from 'src/app/app.service';
import { ProductService } from 'src/app/pages/master/product/product.service';

@Component({
  selector: 'app-product-sales',
  templateUrl: './product-sales.component.html',
  styleUrls: ['./product-sales.component.scss']
})
export class ProductSalesComponent implements OnInit {
  date = new Date();
  fromDate = new Date();
  toDate = new Date();
  createFlag: boolean = true;
  dataSource = new MatTableDataSource<Element>();
  selection = new SelectionModel<Element>(true, []);
  sortBy: any;
  columnsToDisplay: any[] = ['ProductId', 'ProductName'];
  searchtext: any = '';
  rdoValue = 'Summary';
  datalist: any = [];
  strReportHeadName: any = 'Category Sales Report';
  dBranchId = localStorage.getItem('SessionBranchId');
  productAllowedFlag: any;

  constructor(public _appService: AppService, public _prodService: ProductService) { }

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
    this.fnSettings();
  }
  fnSettings() {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'Setting_GetValues';
    let body = JSON.stringify(ServiceParams);
    this._appService.post('CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      let jsonData = JSON.parse(data);
      jsonData.forEach(element => {
        if (element.KeyValue == 'ProductsAllowed') {
          this.productAllowedFlag = element.Value;
          this.fngetProduct(element.Value);
        }
      });
    })
  }

  fngetProduct(val) {
    if (val == 'Yes') {
      this.fnGetProductWithoutBranchId();
    } else {
      this.fngetProductWithBranchId();
    }
  }
  fnGetProductWithoutBranchId() {
    this._prodService.getProductWithoutBranchId(this.searchtext).subscribe(data => {
      let jsonData: any = data;
      this.dataSource = new MatTableDataSource(jsonData);
    })
  }
  fngetProductWithBranchId() {
    this._prodService.getProduct(this.searchtext).subscribe(data => {
      let jsonData: any = data;
      this.dataSource = new MatTableDataSource(jsonData);
    })
  }
  fnChangeRdo(eve) {
    this.rdoValue = eve.value
  }
  fnSearchText(data) {
    this.searchtext = data.target.value;
    this.fngetProduct(this.productAllowedFlag)
  }
  myPageChange() {
    this.createFlag = true;
    this.datalist ='';
  }
  fngetReport() {

    let nCout = 0;
    let strProductIds = '';
    let productSource: any = this.selection.selected;

    productSource.forEach(item => {
      if (nCout == 0) {
        strProductIds = ' and (Products.ProductId =' + item.ProductId;

      } else {
        strProductIds += ' or Products.ProductId =' + item.ProductId;
      }
      nCout = nCout + 1;
    });
    if (nCout == 0) {
      this._appService.openSnackBar('Please Select Atleast One Product', 'Warning');
      return;
    } else {
      strProductIds += ' ) ';
    }

    let ServiceParams = {};
    if (this.rdoValue == 'Summary') {
      ServiceParams['strProc'] = 'ProductwiseSalesSummary';     
    } else {
      ServiceParams['strProc'] = 'ProductwiseSales';     
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
    ProcParams['strKey'] = 'ProductIds';
    ProcParams['strArgmt'] = strProductIds;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);
   
    this._appService.post('CommonQuery/fnGetDataReportNew',body).subscribe(data=>{
      this.datalist = JSON.parse(data);
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
