import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-productwisepurchase',
  templateUrl: './productwisepurchase.component.html',
  styleUrls: ['./productwisepurchase.component.scss']
})
export class ProductwisepurchaseComponent implements OnInit {
  branchId = localStorage.getItem('SessionBranchId');
  staffId = localStorage.getItem('SessionStaffId');
  showReport = false;
  fromDate = new Date();
  toDate = new Date();
  selectbills = 'Detailed';
  tabBills = ['Detailed', 'Summary'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  loading: boolean;
  processing: boolean;
  strReportHeadName: string;
  dataRep = [];
  billSeries: any;

  
  constructor(private appService: AppService) { }

  ngOnInit() {
    this.fromDate.setDate(1);
    this.fnBillSeries_Gets();
  }

  async fnBillSeries_Gets() {

    let ServiceParams = {};
    ServiceParams['strProc'] = 'PurBillSeries_GetsStaffwise';

    let oProcParams = [];
    let ProcParams = {};

    ProcParams['strKey'] = 'StaffId';
    ProcParams['strArgmt'] = this.staffId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);


    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);

    await this.appService.post('CommonQuery/fnGetDataReport', body)
      .toPromise().then(data => {
        this.billSeries = JSON.parse(data);
        this.billSeries.map(data => data.checked = true);
      })
      // .finally(() => {
        this.fnProductsGetForReport();
      // })
  }
  async fnProductsGetForReport() {
    this.processing = true;
    let ServiceParams = {};
    ServiceParams['strProc'] = 'Product_GetsForPurchaseReport';

    let body = JSON.stringify(ServiceParams);

    await  this.appService.post('CommonQuery/fnGetDataReport', body).toPromise()
      .then(data => {
        const jsonData = JSON.parse(data);
        this.dataSource = new MatTableDataSource(jsonData);
        this.processing = false;
      }, err => {
        this.appService.openSnackBar('server busy', '');
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
  myPageChange(eve) {
    this.showReport = false
  }

  async fnSubmit() {
    let Book_FromDate = this.ConvertDateAll(this.fromDate);
    let Book_ToDate = this.ConvertDateAll(this.toDate);
    this.strReportHeadName = ' Productwise Purchase Report From '+this.fnDateReverse(this.fromDate)+' To '+this.fnDateReverse(this.toDate);

    const billData = this.selection.selected;
    if (billData.length == 0) {
      this.appService.openSnackBar('Choose product', 'warning');
      return;
    }
    let ProdIds = '';

    if (billData.length == this.dataSource.data.length) {
       ProdIds = ''
    } else {
      billData.forEach((data, index) => {
        if (index == 0) {
          ProdIds = ` and  (Products.ProductId = ${data.ProductId}`;
        } else {
          ProdIds += ` or Products.ProductId  = ${data.ProductId}`;
        }
      });
      ProdIds += ' )';
    }

    let ncount = 0;
    let BillseriesIds = '';
    let bListShow = 'No';
    this.billSeries.forEach(s => {
      if (s.checked) {
        if (ncount == 0) {
          BillseriesIds = ` and   ( PurBillSeries.PurBillSerId = ${s.PurBillSerId}`;
        } else {
          BillseriesIds += ` or PurBillSeries.PurBillSerId = ${s.PurBillSerId} `;
        }
        bListShow = 'Yes';
        ncount += 1;
      }
    });
    BillseriesIds += ' )';

    if (bListShow == 'No') {
      this.appService.openSnackBar('Choose Billseries', 'warning');
      return
    }
    if (this.selectbills == 'Summary') {
     
    this.loading = true;
    let ServiceParams = {};
    ServiceParams['strProc'] = 'ProductwisePurchaseConsole';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'FromDate';
    ProcParams['strArgmt'] = Book_FromDate;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'ToDate';
    ProcParams['strArgmt'] = Book_ToDate;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'ProductIds';
    ProcParams['strArgmt'] = ProdIds;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId1';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BillSeriesId';
    ProcParams['strArgmt'] = BillseriesIds;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
   
     await this.appService.post('CommonQuery/fnGetDataReport', body).toPromise()
      .then(data => {
        let jsonData = JSON.parse(data);
        this.dataRep =  jsonData;
        this.loading = false;
        this.showReport = true;
      }, err => {
        this.appService.openSnackBar('sorry server busy', '');
        this.loading = false;
      });
  } else {
    var ServiceParams = {};
    ServiceParams['strProc'] = 'Receipt_ProductwisePurchase';

    var oProcParams = [];
    let ProcParams = {};

    ProcParams = {};
    ProcParams['strKey'] = 'FromDate';
    ProcParams['strArgmt'] = Book_FromDate;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'ToDate';
    ProcParams['strArgmt'] = Book_ToDate;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'ProductIds';
    ProcParams['strArgmt'] = ProdIds;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId1';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BillSeriesId';
    ProcParams['strArgmt'] = BillseriesIds;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);

    await this.appService.post('CommonQuery/fnGetDataReport', body).toPromise()
      .then(data => {
        let jsonData = JSON.parse(data);
        this.dataRep =  jsonData;
        this.loading = false;
        this.showReport = true;
      }, err => {
        this.appService.openSnackBar('sorry server busy', '');
        this.loading = false;
      });
  }

}








  ConvertDateAll(format) {
    let date = ("0" + format.getDate()).slice(-2);
    let month = ("0" + (format.getMonth() + 1)).slice(-2);
    let year = format.getFullYear();
    const dateconvert = year + '-' + month + '-' + date;
    return dateconvert;
  }
  fnDateReverse(format){
    let date = ("0" + format.getDate()).slice(-2);
    let month = ("0" + (format.getMonth() + 1)).slice(-2);
    let year = format.getFullYear();
    const dateconvert = year + '-' + month + '-' + date;
    return dateconvert.split('-').reverse().join('/');
  }
}
