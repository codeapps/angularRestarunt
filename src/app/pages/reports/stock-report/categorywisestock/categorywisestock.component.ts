import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-categorywisestock',
  templateUrl: './categorywisestock.component.html',
  styleUrls: ['./categorywisestock.component.scss']
})
export class CategorywisestockComponent implements OnInit {

  branchId = localStorage.getItem('SessionBranchId');
  staffId = localStorage.getItem('SessionStaffId');
  BranchName = localStorage.getItem('SessionBranchName');
  showReport = false;
  selectbills = 'Summary';
  tabBills = ['Summary', 'Details']
  displayedColumns: string[] = ['select', 'CategoryDesc'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  processing: boolean;
  loading: boolean;
  dataRep = [];
  strReportHeadName: string;


  constructor(private appService: AppService) { }

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
  companyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    this.fnCategroyGets();
  }

  async fnCategroyGets() {
    this.processing = true;
    let id = 1;
     await  this.appService.get(`GetRepository/Category_GetOnTypeId?typeId=${id}`).toPromise()
      .then(data => {
       let datas:any = data;
        this.dataSource = new MatTableDataSource(datas);
        this.processing = false;
      });
  }

  async fnSubmit() {

    const billData = this.selection.selected;
    var ListCategoryInfo = [];
    var bListShow = 'No';
    var selected = [];
    if (billData.length == 0) {
      this.appService.openSnackBar('Choose Salesman', 'warning');
      return;
    }
    this.loading = true;
    billData.forEach((data, index) => {
      selected.push(data.CategoryID);
      var CategoryInfo = {};
      CategoryInfo['CategoryID'] = data.CategoryID;
      ListCategoryInfo.push(CategoryInfo);
    });

    let ProceName = '';
    if (this.selectbills == 'Summary') {
      ProceName = 'Stock_CategorywiseStockConsole';
      this.strReportHeadName = 'Categorywise Stock Report Summary';
    } else {
      ProceName = 'Stock_CategorywiseStockDetailed';
      this.strReportHeadName = 'Categorywise Stock Report Detailed';
    }

    let varArguements = {};
    varArguements = { BranchId: this.branchId, strHeading: this.strReportHeadName, strBranchName: this.BranchName };

    let DictionaryObject = {};
    DictionaryObject['dictArgmts'] = varArguements;
    DictionaryObject['ProcName'] = ProceName;
    DictionaryObject['ListCategoryInfo'] = ListCategoryInfo;
    let body = JSON.stringify(DictionaryObject);  
    await this.appService.post('Master/fnCategorywiseStockDetailed', body).toPromise()
      .then(data => {
        const jsonData = JSON.parse(data)        
        this.dataRep =jsonData;
        this.loading = false;
        this.showReport = true;
      }, err => {
        this.appService.openSnackBar('sorry sever busy', 'warning');
        this.loading = false;
      });
  }

  myPageChange(eve) {
    this.showReport = false
  }

}
