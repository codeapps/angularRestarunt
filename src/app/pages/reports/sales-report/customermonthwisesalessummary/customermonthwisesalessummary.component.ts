import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-customermonthwisesalessummary',
  templateUrl: './customermonthwisesalessummary.component.html',
  styleUrls: ['./customermonthwisesalessummary.component.scss']
})
export class CustomermonthwisesalessummaryComponent implements OnInit {
  branchId = localStorage.getItem('SessionBranchId');
  staffId = localStorage.getItem('SessionStaffId');
  showReport: boolean;
  loading: boolean;
  selectbills = 'Customerwise';
  tabBills = ['Customerwise', 'Companywise', 'Salesmanwise'];
  NoofMonth = '5';
  selectcolumn = new FormControl();
  strReportHeadName: string;
  dataRep = [];
  strReportDateCondition: any;

  constructor(private appService: AppService,) { }

  ngOnInit(): void {
  }
  fnSubmit() {
    if (!this.NoofMonth) {
      this.appService.openSnackBar('Enter No of Month', 'warning');
      return;
    }

    this.dataRep = null;
    if (this.selectbills == 'Customerwise') {
      this.fnCustomerwise();
    } else if (this.selectbills == 'Companywise') {
      this.fnCompanywise();
    } else if (this.selectbills == 'Salesmanwise') {
      this.fnSalesmanwise();
    }

  }
  async fnCustomerwise() {
    this.loading = true;
    let varArguements = {};
    varArguements = { NoOnMonths: this.NoofMonth, BranchId: this.branchId };

    this.strReportHeadName = 'Customerwise Month Sales Summary';

    let DictionaryObject = {};
    DictionaryObject['dictArgmts'] = varArguements;

    let body = JSON.stringify(DictionaryObject);

    await this.appService.post('Sales/fnCustomerwiseMonthSales', body).toPromise()
      .then(data => {
        let jsonData = JSON.parse(data);
        this.dataRep = jsonData;
        this.loading = false;
        this.showReport = true;

      }, err => {
        this.appService.openSnackBar('sorry server busy', '');
        this.loading = false;
      });
  }

  async fnCompanywise() {
    this.loading = true;
    this.strReportHeadName = 'Companywise Month Sales Summary';
    let varArguements = {};
    varArguements = { NoOnMonths: this.NoofMonth, BranchId: this.branchId };

    let DictionaryObject = {};
    DictionaryObject['dictArgmts'] = varArguements;

    let body = JSON.stringify(DictionaryObject);
    await this.appService.post('Sales/fnCompanywiseMonthSales', body).toPromise()
      .then(data => {
        let jsonData = JSON.parse(data);
        this.dataRep = jsonData;
        this.loading = false;
        this.showReport = true;

      }, err => {
        this.appService.openSnackBar('sorry server busy', '');
        this.loading = false;
      });
  }

  async fnSalesmanwise() {
    this.loading = true;
    let ServiceParams = {};
    ServiceParams['strProc'] = 'SalesmanwiseSalesAnalysis';

    this.strReportHeadName = 'Salesmanwise Month Sales Summary';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'NoOnMonths';
    ProcParams['strArgmt'] = this.NoofMonth.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    await this.appService.post('CommonQuery/fnGetDataReport', body).toPromise()
      .then(data => {
        let jsonData = JSON.parse(data);
        this.dataRep = jsonData;
        this.loading = false;
        this.showReport = true;

      }, err => {
        this.appService.openSnackBar('sorry server busy', '');
        this.loading = false;
      });
  }

  radioChange(eve) {
    this.selectbills = eve.value;
  }

  myPageChange(eve) {
    this.showReport = false
  }
}
function dateReverse(date) {
  return date.split('-').reverse().join('/');
}
