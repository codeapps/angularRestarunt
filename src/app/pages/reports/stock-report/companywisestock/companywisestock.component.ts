import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-companywisestock',
  templateUrl: './companywisestock.component.html',
  styleUrls: ['./companywisestock.component.scss']
})
export class CompanywisestockComponent implements OnInit {

  showReport = false;
  selectbills = 'Summary';
  tabBills = ['Summary', 'Details', 'CompanywiseBatchWise', 'DetailedWithRack']
  displayedColumns: string[] = ['select', 'ManufactureName'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  branchId = localStorage.getItem('SessionBranchId');
  staffId = localStorage.getItem('SessionStaffId');
  strReportHeadName = '';
  dataRep = [];
  processing: boolean;
  loading: boolean;


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
  ngOnInit() {
    this.fnManufactureGetForReport()
  }
  companyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async fnManufactureGetForReport() {
    this.dataSource = null;
    this.processing = true;
    let varArguements = {};
    varArguements = { Manufacture_Name: '' };

    let DictionaryObject = {};
    DictionaryObject['dictArgmts'] = varArguements;
    DictionaryObject['ProcName'] = 'Manufacture_GetsForReport';

    let body = JSON.stringify(DictionaryObject);
     await  this.appService.post('Master/Manufacture_Gets', body).toPromise()
      .then(data => {
        this.dataSource = new MatTableDataSource(data);
        this.processing = false;
      }, err => {
        this.appService.openSnackBar('server busy', '');
        this.processing = false;
      })
  }

  async fnSubmit() {
    const billData = this.selection.selected;
    let ComIds = '';
    if (billData.length == 0) {
      this.appService.openSnackBar('Choose Company', 'warning');
      return;
    }
    this.loading = true;

    billData.forEach((data, index) => {
      if (index == 0) {
        ComIds = `  and (Manufacture.Manufacture_Id= ${data.ManufactureId}`;
      } else {
        ComIds += ` or Manufacture.Manufacture_Id= ${data.ManufactureId}`;
      }
    });
    ComIds += ' )';
    
    let BranchName = 'codeApps';
    let ServiceParams = {};
    if (this.selectbills == 'Summary') {
      ServiceParams['strProc'] = 'CompanywiseStock';
      this.strReportHeadName = 'Companywise Stock ';
    } else if (this.selectbills == 'Details') {
      ServiceParams['strProc'] = 'CompanywiseStockDetailed';
      this.strReportHeadName = 'Companywise Stock Detailed ';
    } else if (this.selectbills == 'CompanywiseBatchWise') {
      ServiceParams['strProc'] = 'CompanywiseStockDetailedBatchWise';
      this.strReportHeadName = 'Companywise Stock Detailed ';
    } else if (this.selectbills == 'DetailedWithRack') {
      ServiceParams['strProc'] = 'CompanywiseStockWithDamageDetails';
      this.strReportHeadName = 'Companywise Stock  ';
    }

    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'ComIds';
    ProcParams['strArgmt'] = ComIds;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    this.strReportHeadName = 'Companywise Stock ';

    let dictArgmts = { strHeading: this.strReportHeadName, strBranchName: BranchName };
    let DictionaryObject = {};

    DictionaryObject['dictArgmts'] = dictArgmts;
    ServiceParams['DictionaryObject'] = DictionaryObject;

    let body = JSON.stringify(ServiceParams);

    await this.appService.post('CommonQuery/fnGetDataReport', body).toPromise()
      .then(data => {
        const jsonData = JSON.parse(data)
        this.dataRep = jsonData;
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
