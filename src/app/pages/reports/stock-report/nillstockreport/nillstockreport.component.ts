import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-nillstockreport',
  templateUrl: './nillstockreport.component.html',
  styleUrls: ['./nillstockreport.component.scss']
})
export class NillstockreportComponent implements OnInit {

  showReport = false;
  negativeBill = false;
  selectbills = 'Categorywise';
  tabBills = ['Categorywise', 'Companywise', 'Supplierwise']
  displayedColumns: string[] = ['Category Name', 'CategoryName'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  branchId = localStorage.getItem('SessionBranchId');
  staffId = localStorage.getItem('SessionStaffId');
  strReportHeadName = 'Nill Stock Report';
  dataRep = [];
  processing: boolean;
  loading: boolean;
  tblNegativeBilling = false;

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.fnSettings();
  }

  async fnSettings() {
    let dictArgmts = { ProcName: 'Settings_GetValues' };
    let body = JSON.stringify(dictArgmts);
    await this.appService.post('CommonQuery/fnSettings', body)
      .toPromise().then(data => {
        let jsondata = data
        for (var i = 0; i < jsondata.length; i++) {
          if (jsondata[i].KeyValue == 'NegativeBilling') {
            if (jsondata[i].Value == 'Yes') {
              this.tblNegativeBilling = true;
            }
          }
        }

      });
    this.fnCategroyGets();
  }

  async fnCategroyGets() {
     this.processing = true;
     let id = 1;
    await this.appService.get(`GetRepository/Category_GetOnTypeId?typeId=${id}`).toPromise()
      .then(data => {
        let jsonData:any  = data;
        this.dataSource = new MatTableDataSource(jsonData);
        this.processing = false;
      });
  }

  radioChange(eve) {
    this.dataSource = null;
    // this.selectbills = eve.value;
    this.selection.clear();
    if (this.selectbills == 'Categorywise') {
      this.displayedColumns = ['Category Name', 'CategoryName'];
      this.fnCategroyGets();
    } else if (this.selectbills == 'Companywise') {
      this.displayedColumns = ['Manufacture Name', 'ManufactureName'];
      this.fnManufactureGetForReport();
    } else if (this.selectbills == 'Supplierwise') {
      this.displayedColumns = ['Supplier Name', 'AcName', 'Addr1'];
      this.fnSupplierGets();
    }
  }

  async fnManufactureGetForReport() {
    this.processing = true;
    let dictArgmts = { Manufacture_Name: '' };

    let DictionaryObject = {};
    DictionaryObject['dictArgmts'] = dictArgmts;
    DictionaryObject['ProcName'] = 'Manufacture_GetsForReport';

    let body = JSON.stringify(DictionaryObject);
    await this.appService.post('Master/Manufacture_Gets', body).toPromise()
      .then(data => {

        this.dataSource = new MatTableDataSource(data);
        this.processing = false;
      });
  }

  async fnSupplierGets() {
    this.processing = true;
    let varArguements = {};
    varArguements = { AC_Name: '', BranchId: this.branchId };
    let ProceName = 'AccountHead_Search';

    let DictionaryObject = {};
    DictionaryObject['dictArgmts'] = varArguements;
    DictionaryObject['ProcName'] = ProceName;

    let body = JSON.stringify(DictionaryObject);
    await this.appService.post('Master/AccountHead_SearchSupplier', body).toPromise()
      .then(data => {
        this.dataSource = new MatTableDataSource(data);
        this.processing = false;
      });
  }

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

  async fnSubmit() {
    let strIds = '';
    const billData = this.selection.selected;
    if (this.selectbills == 'Categorywise') {

      if (billData.length == 0) {
        this.appService.openSnackBar('Choose Category', 'warning');
        return;
      }

      billData.forEach((data, index) => {
        if (index == 0) {
          strIds = `  and (Manufacture.Manufacture_Id = ${data.CategoryId}`;
        } else {
          strIds += ` or Manufacture.Manufacture_Id = ${data.CategoryId}`;
        }
      });
      strIds += ' )';

    } else if (this.selectbills == 'Companywise') {
      if (billData.length == 0) {
        this.appService.openSnackBar('Choose Company', 'warning');
        return;
      }
      billData.forEach((data, index) => {
        if (index == 0) {
          strIds = `  and (Manufacture.Manufacture_Id = ${data.ManufactureId}`;
        } else {
          strIds += ` or Manufacture.Manufacture_Id = ${data.ManufactureId}`;
        }
      });
      strIds += ' )';
    } else {
      if (billData.length == 0) {
        this.appService.openSnackBar('Choose Supplier', 'warning');
        return;
      }
      billData.forEach((data, index) => {
        if (index == 0) {
          strIds = `  and (AccountHead.Ac_Id = ${data.AcId}`;
        } else {
          strIds += ` or AccountHead.Ac_Id = ${data.AcId}`;
        }
      });
      strIds += ' )';
    }

    let ServiceParams = {};
    if (this.negativeBill) {
      ServiceParams['strProc'] = 'NegativeStockReportOnType';
    } else {
      ServiceParams['strProc'] = 'NillStockReportOnType';
    }

    ServiceParams['JsonFileName'] = 'JsonArrayScriptTwo';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = '@ParamsBranchId';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsType';
    ProcParams['strArgmt'] = this.selectbills;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsIds';
    ProcParams['strArgmt'] = strIds;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);

    await this.appService.post('CommonQuery/fnGetDataReportFromScriptJsonFile', body).toPromise()
      .then(data => {
        const jsonData = JSON.parse(data.JsonDetails[0]);
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
