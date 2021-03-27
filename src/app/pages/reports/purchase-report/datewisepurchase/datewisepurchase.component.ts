import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-datewisepurchase',
  templateUrl: './datewisepurchase.component.html',
  styleUrls: ['./datewisepurchase.component.scss']
})
export class DatewisepurchaseComponent implements OnInit {
  showReport = false;
  fromDate = new Date();
  toDate = new Date();

  tabBills = ['Detailed', 'Datewise', 'Detailed(Local&Interste)', 'Datewise(Local&Interste)', 'PurchaseUpload',
  'Detailed(GST)', 'Datewise(GST)', 'GSTSplitReport', 'DetailedProductwisePurchase'];
selectedTab: any = 0;

branchId = localStorage.getItem('SessionBranchId');
staffId = localStorage.getItem('SessionStaffId');

strReportHeadName = '';
dataRep = [];

processing: boolean;
loading: boolean;
billSeries: any;

dateInvo = 'Yes';
stateType = 'Yes';
Book_FromDate: string;
Book_ToDate: string;


  constructor(private appService: AppService,) { }

  ngOnInit() {
    this.fromDate.setDate(1);
    this.fnBillSeries_Gets();
  }

  fntabChange(eve) {
    this.selectedTab = eve;
  }

  async fnBillSeries_Gets() {
    let ServiceParams = {};
    ServiceParams['strProc'] = "PurBillSeries_GetsStaffwise";

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
     await this.appService.post('CommonQuery/fnGetDataReport', body).toPromise()
      .then(data => {
        const jsonData = JSON.parse(data);
        this.billSeries = jsonData;
        this.billSeries.map(data => data.checked = true);
      });
  }

  fnSubmit() {
    this.Book_FromDate = this.ConvertDateAll(this.fromDate);
    this.Book_ToDate =  this.ConvertDateAll(this.toDate);

    switch (this.selectedTab) {
      case 0:
        this.fnPurchaseReportDetailed();
        break;
      case 1:
        this.fnDatewisePurchaseDetailed();
        break;
      case 2:
        this.fnPurchaseReportDetailedAll();
        break;
      case 3:
        this.fnDatewisePurchaseDetailedAll();
        break;
      case 4:
        this.fnPurchaseUpload();
        break;
      case 5:
        this.fnPurchaseReportDetailedGst();
        break;
      case 6:
        this.fnDatewisePurchaseGst();
        break;
      case 7:
        this.fnPurchaseSplitRpt();
        break;
      case 8:
        this.fnBillwiseDetailedReport();
        break;
      default:
        break;
    }
  }

  async fnPurchaseReportDetailed() {
    let DateCondition = '';
    if (this.dateInvo == 'Yes') {
      DateCondition = 'InvoiceDate';
    }

    let ncount = 0;
    let BillseriesIds = '';
    let bListShow = 'No';
    this.billSeries.forEach(res => {
      if (res.checked) {
        if (ncount == 0) {
          BillseriesIds = ` and  (PurBillSeries.PurBillSerId = ${res.PurBillSerId}`;
        } else {
          BillseriesIds += ` or PurBillSeries.PurBillSerId = ${res.PurBillSerId}`;
        }
        ncount += 1;
        bListShow = 'Yes';
      }
    });
    BillseriesIds += ' )';

    if (bListShow == 'No') {
      this.appService.openSnackBar('Choose Billseries', 'warning');
      return
    }
    this.loading = true;
    this.strReportHeadName = ' Purchase Report Detailed From '+this.fnDateReverse(this.fromDate)+' To '+this.fnDateReverse(this.toDate);
    if (this.stateType == 'Yes') {
      let ServiceParams = {};
      ServiceParams['strProc'] = 'Receipt_Datewise';

      let oProcParams = [];

      let ProcParams = {};
      ProcParams['strKey'] = 'FromDate';
      ProcParams['strArgmt'] = this.Book_FromDate;
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams['strKey'] = 'ToDate';
      ProcParams['strArgmt'] = this.Book_ToDate;
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams['strKey'] = 'BillSerIds';
      ProcParams['strArgmt'] = BillseriesIds;
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams['strKey'] = 'BranchId';
      ProcParams['strArgmt'] = this.branchId;
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams['strKey'] = 'OrderCondition';
      ProcParams['strArgmt'] = DateCondition;
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
    } else {
      let ServiceParams = {};
      ServiceParams['strProc'] = 'Receipt_DatewiseInterstate';

      let oProcParams = [];

      let ProcParams = {};
      ProcParams['strKey'] = 'FromDate';
      ProcParams['strArgmt'] = this.Book_FromDate;
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams['strKey'] = 'ToDate';
      ProcParams['strArgmt'] = this.Book_ToDate;
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams['strKey'] = 'BillSerIds';
      ProcParams['strArgmt'] = BillseriesIds;
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams['strKey'] = 'BranchId';
      ProcParams['strArgmt'] = this.branchId;
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams['strKey'] = 'OrderCondition';
      ProcParams['strArgmt'] = DateCondition;
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
  }

  async fnDatewisePurchaseDetailed() {
    let DateCondition = '';
    if (this.dateInvo == 'Yes') {
      DateCondition = 'InvoiceDate';
    }

    let ncount = 0;
    let BillseriesIds = '';
    let bListShow = 'No';
    this.billSeries.forEach(res => {
      if (res.checked) {
        if (ncount == 0) {
          BillseriesIds = ` and  (PurBillSeries.PurBillSerId = ${res.PurBillSerId}`;
        } else {
          BillseriesIds += ` or PurBillSeries.PurBillSerId = ${res.PurBillSerId}`;
        }
        ncount += 1;
        bListShow = 'Yes';
      }
    });
    BillseriesIds += ' )';

    if (bListShow == 'No') {
      this.appService.openSnackBar('Choose Billseries', 'warning');
      return
    }
    this.loading = true;
    this.strReportHeadName = ' Datewise Purchase Report From '+this.fnDateReverse(this.fromDate)+' To '+this.fnDateReverse(this.toDate);
    if (this.stateType == 'Yes') {
      let ServiceParams = {};
      ServiceParams['strProc'] = 'receipt_DatewiseConsolidated';

      let oProcParams = [];

      let ProcParams = {};
      ProcParams['strKey'] = 'FromDate';
      ProcParams['strArgmt'] = this.Book_FromDate;
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams['strKey'] = 'ToDate';
      ProcParams['strArgmt'] = this.Book_ToDate;
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams['strKey'] = 'BillSerIds';
      ProcParams['strArgmt'] = BillseriesIds;
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams['strKey'] = 'BranchId';
      ProcParams['strArgmt'] = this.branchId;
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams['strKey'] = 'OrderCondition';
      ProcParams['strArgmt'] = DateCondition;
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
    } else {
      let ServiceParams = {};
      ServiceParams['strProc'] = 'Receipt_DatewiseConsolidatedInterState';

      let oProcParams = [];

      let ProcParams = {};
      ProcParams['strKey'] = 'FromDate';
      ProcParams['strArgmt'] = this.Book_FromDate;
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams['strKey'] = 'ToDate';
      ProcParams['strArgmt'] = this.Book_ToDate;
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams['strKey'] = 'BillSerIds';
      ProcParams['strArgmt'] = BillseriesIds;
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams['strKey'] = 'BranchId';
      ProcParams['strArgmt'] = this.branchId;
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams['strKey'] = 'OrderCondition';
      ProcParams['strArgmt'] = DateCondition;
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
  }

  async fnPurchaseReportDetailedAll() {
    let DateCondition = '';
    if (this.dateInvo == 'Yes') {
      DateCondition = 'InvoiceDate';
    }

    let ncount = 0;
    let BillseriesIds = '';
    let bListShow = 'No';
    this.billSeries.forEach(res => {
      if (res.checked) {
        if (ncount == 0) {
          BillseriesIds = ` and  (PurBillSeries.PurBillSerId = ${res.PurBillSerId}`;
        } else {
          BillseriesIds += ` or PurBillSeries.PurBillSerId = ${res.PurBillSerId}`;
        }
        ncount += 1;
        bListShow = 'Yes';
      }
    });
    BillseriesIds += ' )';

    if (bListShow == 'No') {
      this.appService.openSnackBar('Choose Billseries', 'warning');
      return
    }
    this.loading = true;
    this.strReportHeadName = '  Purchase Report Detailed From '+this.fnDateReverse(this.fromDate)+' To '+this.fnDateReverse(this.toDate);
    let ServiceParams = {};
    ServiceParams['strProc'] = 'Receipt_DatewiseAll';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'FromDate';
    ProcParams['strArgmt'] = this.Book_FromDate;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'ToDate';
    ProcParams['strArgmt'] = this.Book_ToDate;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BillSerIds';
    ProcParams['strArgmt'] = BillseriesIds;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'OrderCondition';
    ProcParams['strArgmt'] = DateCondition;
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

  async fnDatewisePurchaseDetailedAll() {
    let DateCondition = '';
    if (this.dateInvo == 'Yes') {
      DateCondition = 'InvoiceDate';
    }

    let ncount = 0;
    let BillseriesIds = '';
    let bListShow = 'No';
    this.billSeries.forEach(res => {
      if (res.checked) {
        if (ncount == 0) {
          BillseriesIds = ` and  (PurBillSeries.PurBillSerId = ${res.PurBillSerId}`;
        } else {
          BillseriesIds += ` or PurBillSeries.PurBillSerId = ${res.PurBillSerId}`;
        }
        ncount += 1;
        bListShow = 'Yes';
      }
    });
    BillseriesIds += ' )';

    if (bListShow == 'No') {
      this.appService.openSnackBar('Choose Billseries', 'warning');
      return
    }
    this.loading = true;
    this.strReportHeadName = ' Datewise Purchase Report From '+this.fnDateReverse(this.fromDate)+' To '+this.fnDateReverse(this.toDate);
    let ServiceParams = {};
    ServiceParams['strProc'] = 'Receipt_DatewiseConsolidatedAll';
  
    let oProcParams = [];
  
    let ProcParams = {};
    ProcParams['strKey'] = 'FromDate';
    ProcParams['strArgmt'] = this.Book_FromDate;
    oProcParams.push(ProcParams);
  
    ProcParams = {};
    ProcParams['strKey'] = 'ToDate';
    ProcParams['strArgmt'] = this.Book_ToDate;
    oProcParams.push(ProcParams);
  
    ProcParams = {};
    ProcParams['strKey'] = 'BillSerIds';
    ProcParams['strArgmt'] = BillseriesIds;
    oProcParams.push(ProcParams);
  
    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);
  
    ProcParams = {};
    ProcParams['strKey'] = 'OrderCondition';
    ProcParams['strArgmt'] = DateCondition;
    oProcParams.push(ProcParams);
  
    ServiceParams['oProcParams'] = oProcParams;
  
    let body = JSON.stringify(ServiceParams);
    await  this.appService.post('CommonQuery/fnGetDataReport', body).toPromise()
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

  async fnPurchaseUpload() {
    let ncount = 0;
    let BillseriesIds = '';
    let bListShow = 'No';
    this.billSeries.forEach(res => {
      if (res.checked) {
        if (ncount == 0) {
          BillseriesIds = ` and  (PurBillSeries.PurBillSerId = ${res.PurBillSerId}`;
        } else {
          BillseriesIds += ` or PurBillSeries.PurBillSerId = ${res.PurBillSerId}`;
        }
        ncount += 1;
        bListShow = 'Yes';
      }
    });
    BillseriesIds += ' )';

    if (bListShow == 'No') {
      this.appService.openSnackBar('Choose Billseries', 'warning');
      return
    }
    this.loading = true;
    this.strReportHeadName = `Purchase Upload Report From ${this.Book_FromDate} To ${this.Book_ToDate}`;
    let ServiceParams = {};
    ServiceParams['strProc'] = 'Receipt_Upload';
  
    let oProcParams = [];
    let ProcParams = {};
  
    ProcParams['strKey'] = 'FromDate';
    ProcParams['strArgmt'] = this.Book_FromDate;
    oProcParams.push(ProcParams);
  
    ProcParams = {};
    ProcParams['strKey'] = 'ToDate';
    ProcParams['strArgmt'] = this.Book_ToDate;
    oProcParams.push(ProcParams);
  
    ProcParams = {};
    ProcParams['strKey'] = 'BillSerIds';
    ProcParams['strArgmt'] = BillseriesIds;
    oProcParams.push(ProcParams);
  
    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);
  
    ProcParams = {};
    ProcParams['strKey'] = 'OrderCondition';
    ProcParams['strArgmt'] = '';
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

  async fnPurchaseReportDetailedGst() {
    let DateCondition = '';
    if (this.dateInvo == 'Yes') {
      DateCondition = 'InvoiceDate';
    }

    let ncount = 0;
    let BillseriesIds = '';
    let bListShow = 'No';
    this.billSeries.forEach(res => {
      if (res.checked) {
        if (ncount == 0) {
          BillseriesIds = ` and  (PurBillSeries.PurBillSerId = ${res.PurBillSerId}`;
        } else {
          BillseriesIds += ` or PurBillSeries.PurBillSerId = ${res.PurBillSerId}`;
        }
        ncount += 1;
        bListShow = 'Yes';
      }
    });
    BillseriesIds += ' )';

    if (bListShow == 'No') {
      this.appService.openSnackBar('Choose Billseries', 'warning');
      return
    }
    this.loading = true;
    this.strReportHeadName = ' Purchase Report Detailed From '+this.fnDateReverse(this.fromDate)+' To '+this.fnDateReverse(this.toDate);

    let ServiceParams = {};
    ServiceParams['strProc'] = 'Receipt_BillwiseDetailedGst';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'FromDate';
    ProcParams['strArgmt'] = this.Book_FromDate;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'ToDate';
    ProcParams['strArgmt'] = this.Book_ToDate;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BillSerIds';
    ProcParams['strArgmt'] = BillseriesIds;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'OrderCondition';
    ProcParams['strArgmt'] = DateCondition;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    await  this.appService.post('CommonQuery/fnGetDataReport', body).toPromise()
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

  async fnDatewisePurchaseGst() {
    let DateCondition = '';
    if (this.dateInvo == 'Yes') {
      DateCondition = 'InvoiceDate';
    }

    let ncount = 0;
    let BillseriesIds = '';
    let bListShow = 'No';
    this.billSeries.forEach(res => {
      if (res.checked) {
        if (ncount == 0) {
          BillseriesIds = ` and  (PurBillSeries.PurBillSerId = ${res.PurBillSerId}`;
        } else {
          BillseriesIds += ` or PurBillSeries.PurBillSerId = ${res.PurBillSerId}`;
        }
        ncount += 1;
        bListShow = 'Yes';
      }
    });
    BillseriesIds += ' )';

    if (bListShow == 'No') {
      this.appService.openSnackBar('Choose Billseries', 'warning');
      return
    }
    this.loading = true;
    this.strReportHeadName = '  Purchase Report Detailed From '+this.fnDateReverse(this.fromDate)+' To '+this.fnDateReverse(this.toDate);
  
    let ServiceParams = {};
    ServiceParams['strProc'] = 'Receipt_DatewiseDetailedGst';
  
    let oProcParams = [];
  
    let ProcParams = {};
    ProcParams['strKey'] = 'FromDate';
    ProcParams['strArgmt'] = this.Book_FromDate;
    oProcParams.push(ProcParams);
  
    ProcParams = {};
    ProcParams['strKey'] = 'ToDate';
    ProcParams['strArgmt'] = this.Book_ToDate;
    oProcParams.push(ProcParams);
  
    ProcParams = {};
    ProcParams['strKey'] = 'BillSerIds';
    ProcParams['strArgmt'] = BillseriesIds;
    oProcParams.push(ProcParams);
  
    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);
  
    ProcParams = {};
    ProcParams['strKey'] = 'OrderCondition';
    ProcParams['strArgmt'] = DateCondition;
    oProcParams.push(ProcParams);
    ServiceParams['oProcParams'] = oProcParams;
  
    let body = JSON.stringify(ServiceParams);
   await  this.appService.post('CommonQuery/fnGetDataReport', body).toPromise()
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

  async fnPurchaseSplitRpt() {
    let DateCondition = '';
    if (this.dateInvo == 'Yes') {
      DateCondition = 'InvoiceDate';
    }

    let ncount = 0;
    let BillseriesIds = '';
    let bListShow = 'No';
    this.billSeries.forEach(res => {
      if (res.checked) {
        if (ncount == 0) {
          BillseriesIds = ` and  (PurBillSeries.PurBillSerId = ${res.PurBillSerId}`;
        } else {
          BillseriesIds += ` or PurBillSeries.PurBillSerId = ${res.PurBillSerId}`;
        }
        ncount += 1;
        bListShow = 'Yes';
      }
    });
    BillseriesIds += ' )';

    if (bListShow == 'No') {
      this.appService.openSnackBar('Choose Billseries', 'warning');
      return
    }
    this.loading = true;
    this.strReportHeadName = '  Purchase Report Detailed From '+this.fnDateReverse(this.fromDate)+' To '+this.fnDateReverse(this.toDate);
    let ServiceParams = {};
    ServiceParams['strProc'] = 'PurchaseReportGstSpit';
  
    let oProcParams = [];
  
    let ProcParams = {};
    ProcParams['strKey'] = 'FromDate';
    ProcParams['strArgmt'] = this.Book_FromDate;
    oProcParams.push(ProcParams);
  
    ProcParams = {};
    ProcParams['strKey'] = 'ToDate';
    ProcParams['strArgmt'] = this.Book_ToDate;
    oProcParams.push(ProcParams);
  
    ProcParams = {};
    ProcParams['strKey'] = 'BillSerIds';
    ProcParams['strArgmt'] = BillseriesIds;
    oProcParams.push(ProcParams);
  
    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);
  
    ProcParams = {};
    ProcParams['strKey'] = 'OrderCondition';
    ProcParams['strArgmt'] = DateCondition;
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

  async fnBillwiseDetailedReport() {
    let ncount = 0;
    let BillSerIds = '';
   
    this.loading = true;
    this.strReportHeadName = ' Billwise Detailed Report From  '+this.fnDateReverse(this.fromDate)+' To '+this.fnDateReverse(this.toDate);
  
    let ServiceParams = {};
    ServiceParams['strProc'] = 'Purchase_DetailedReport';
  
    let oProcParams = [];
    let ProcParams = {};
  
    ProcParams['strKey'] = 'FromDate';
    ProcParams['strArgmt'] = this.Book_FromDate;
    oProcParams.push(ProcParams);
  
    ProcParams = {};
    ProcParams['strKey'] = 'ToDate';
    ProcParams['strArgmt'] = this.Book_ToDate;
    oProcParams.push(ProcParams);
  
    ProcParams = {};
    ProcParams['strKey'] = 'BillSeries';
    ProcParams['strArgmt'] = BillSerIds;
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

  myPageChange(eve) {
    this.showReport = false
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
