import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-nonmovingitem',
  templateUrl: './nonmovingitem.component.html',
  styleUrls: ['./nonmovingitem.component.scss']
})
export class NonmovingitemComponent implements OnInit {

  showReport = false;
  negativeBill = false;
  selectbills = 'ALL';
  tabBills = ['ALL', 'Companywise', 'Supplierwise', 'ExcessStockCompanywise']
  displayedColumns: string[] = ['Manufacture Name', 'ManufactureName'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  branchId = localStorage.getItem('SessionBranchId');
  staffId = localStorage.getItem('SessionStaffId');
  BranchName = localStorage.getItem('SessionBranchName');
  strReportHeadName = '';
  dataRep = [];
  processing: boolean;
  loading: boolean;
  txtEnterdays: number = 0;
  txtRequireDays: number = 0;
  txtMonth: number = 0;
  strPopUpCondition: string = '';

  constructor(private appService: AppService) { }

  ngOnInit() {
    if (this.strPopUpCondition == 'NonmovingDialogbox') {
      this.txtEnterdays = 60;
      this.fnNonMovingStockAll();
    } else {
      this.fnManufactureGetForReport();
    }
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
  onNonMovingBoxClose() {
    // this.dialogRef.close();
  }

  radioChange(eve) {
    this.selection.clear();
    if ((this.selectbills == 'Companywise' || this.selectbills == 'ExcessStockCompanywise') &&
      this.displayedColumns[1] != 'Manufacture_Name') {
      this.displayedColumns = ['Manufacture Name', 'ManufactureName'];
      this.fnManufactureGetForReport();
    } else if (this.selectbills == 'Supplierwise') {
      this.displayedColumns = ['Supplier Name', 'AcName', 'Addr1'];
      this.fnSupplierGets();
    }
    // displayedColumns
  }

  async fnNonMovingStockAll() {
    this.loading = true;
    let ServiceParams = {};
    ServiceParams['strProc'] = 'NonMovingItemStockValue';
    ServiceParams['JsonFileName'] = 'JsonArrayScriptTwo';

    let oProcParams = [];
    let ProcParams = {};

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsDAYS';
    ProcParams['strArgmt'] = this.txtEnterdays.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsBranchId';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsComIds';
    ProcParams['strArgmt'] = ''
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsCondition';
    ProcParams['strArgmt'] = '';
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    await this.appService.post('CommonQuery/fnGetDataReportFromScriptJsonFile', body).toPromise()
      .then(data => {
        const jsonData = JSON.parse(data.JsonDetails[1]);
        this.dataRep = jsonData;
        this.loading = false;
        this.showReport = true;
      }, err => {
        this.appService.openSnackBar('sorry sever busy', 'warning');
        this.loading = false;
      });
  }

  async fnManufactureGetForReport() {
    this.processing = true;
    this.dataSource = null;
    let dictArgmts = { Manufacture_Name: '' };

    let DictionaryObject = {};
    DictionaryObject['dictArgmts'] = dictArgmts;
    DictionaryObject['ProcName'] = 'Manufacture_Gets';

    let body = JSON.stringify(DictionaryObject);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8');
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

  fnSubmit() {
    if (this.selectbills == 'ALL') {
      this.fnNonMovingStockAll();
    } else if (this.selectbills == 'Companywise' || this.selectbills == 'Supplierwise') {
      this.fnNonmovingStockCompanywise();
    } else {
      this.fnExcessStockReport();
    }
  }

  async fnExcessStockReport() {
    if (!this.txtRequireDays) {
      this.appService.openSnackBar('Enter Days', 'warning');
      return;
    }

    if (!this.txtMonth) {
      this.appService.openSnackBar('Enter Sales Of Month', 'warning');
      return;
    }
    let ComIds = '';
    const billData = this.selection.selected;
    if (billData.length == 0) {
      this.appService.openSnackBar('Choose Company', 'warning');
      return;
    }
    billData.forEach((data, index) => {
      if (index == 0) {
        ComIds = `  and (Manufacture.Manufacture_Id = ${data.ManufactureId}`;
      } else {
        ComIds += ` or Manufacture.Manufacture_Id = ${data.ManufactureId}`;
      }
    });
    ComIds += ' )';

    this.loading = true;

    let ServiceParams = {};
    ServiceParams['strProc'] = 'ExcessStockReport';
    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'Ids';
    ProcParams['strArgmt'] = ComIds;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'StockRequiredDays';
    ProcParams['strArgmt'] = this.txtRequireDays.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'NoOfMonthSales';
    ProcParams['strArgmt'] = this.txtMonth.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'Type';
    ProcParams['strArgmt'] = 'ExcessStockCompanywise';
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let ReportHeadingName = 'Companywise Excess Stock Report ';


    let dictArgmts = { strHeading: ReportHeadingName, strBranchName: this.BranchName };
    let DictionaryObject = {};
    DictionaryObject['dictArgmts'] = dictArgmts;
    ServiceParams['DictionaryObject'] = DictionaryObject;

    let body = JSON.stringify(ServiceParams);

    await this.appService.post('CommonQuery/fnGetDataReportToHtmlTable', body).toPromise()
      .then(data => {
        const jsonData = JSON.parse(data);
        this.dataRep = jsonData;
        this.loading = false;
        this.showReport = true;
      }, err => {
        this.appService.openSnackBar('sorry sever busy', 'warning');
        this.loading = false;
      });
  }

  async fnNonmovingStockCompanywise() {
    if (!this.txtEnterdays) {
      this.appService.openSnackBar('Enter Days', 'warning');
      return;
    }
    let ComIds = '';
    const billData = this.selection.selected;

    if (billData.length == 0) {
      this.appService.openSnackBar('Choose Company', 'warning');
      return;
    }

    if (this.selectbills == 'Companywise') {

      billData.forEach((data, index) => {
        if (index == 0) {
          ComIds = `  and (Manufacture.Manufacture_Id = ${data.ManufactureId}`;
        } else {
          ComIds += ` or Manufacture.Manufacture_Id = ${data.ManufactureId}`;
        }
      });
      ComIds += ' )';

    } else {
      billData.forEach((data, index) => {
        if (index == 0) {
          ComIds = `  and (AccountHead.Ac_Id = ${data.AcId}`;
        } else {
          ComIds += ` or AccountHead.Ac_Id = ${data.AcId}`;
        }
      });
      ComIds += ' )';
    }

    this.loading = true;

    let ServiceParams = {};
    ServiceParams['strProc'] = 'CompanywiseNonMovingItem';
    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'ComIds';
    ProcParams['strArgmt'] = ComIds;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'DAYS';
    ProcParams['strArgmt'] = this.txtEnterdays.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);


    ProcParams = {};
    ProcParams['strKey'] = 'Condition';
    ProcParams['strArgmt'] = this.selectbills;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let ReportHeadingName = 'Companywise Nonmoving Item List ';
    if (this.selectbills == 'Supplierwise') {
      ReportHeadingName = 'Supplierwise Nonmoving Item List ';
    }
    let dictArgmts = { strHeading: ReportHeadingName, strBranchName: this.BranchName };
    let DictionaryObject = {};
    DictionaryObject['dictArgmts'] = dictArgmts;
    ServiceParams['DictionaryObject'] = DictionaryObject;

    let body = JSON.stringify(ServiceParams);
    await this.appService.post('CommonQuery/fnGetDataReportToHtmlTable', body).toPromise()
      .then(data => {
        const jsonData = JSON.parse(data);
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
