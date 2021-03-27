import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-gstsalesreport',
  templateUrl: './gstsalesreport.component.html',
  styleUrls: ['./gstsalesreport.component.scss']
})
export class GstsalesreportComponent implements OnInit {

  branchId = localStorage.getItem('SessionBranchId');
  staffId = localStorage.getItem('SessionStaffId');
  showReport = false;
  fromDate = new Date();
  toDate = new Date();
  selectedTab = 0;
  tabBills = ['B2B', 'B2C', 'HSN Detailed', 'HSN Summary' 
  // 'Customerwise HSN Summary', 'CDNR',
  //   'CDNUR', '3B', '3BSummary', 'SalesRegister', 'HSNSummaryReturn'
  ];
  loading: boolean;
  strReportHeadName: string;
  dataRep = [];
  btnCash = true;
  btnCredit = true;
  btnCard = true;
  chkTin = false;
  billSeries = [];

  constructor(private appService: AppService,) { }
  
  ngOnInit(){
    this.fromDate.setDate(1);
    this.fnBillSeries_Gets()
  }
  async fnBillSeries_Gets() {

    let ServiceParams = {};
    ServiceParams['strProc'] = "BillSeries_GetsStaffwiseNew";

    let oProcParams = [];
    let ProcParams = {};

    // ProcParams['strKey'] = 'StaffId';
    // ProcParams['strArgmt'] = this.staffId;
    // oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    await this.appService.post('CommonQuery/fnGetDataReport', body).toPromise()
      .then(data => {
        const jsonData = JSON.parse(data);
        jsonData.map(data => data.checked = true);
        this.billSeries = jsonData;
      });
  }

  myPageChange(eve) {
    this.showReport = false
  }
 fntabChange(eve) {
    this.selectedTab = eve;
  }

  fnSubmit() {
    if (this.selectedTab == 0 || this.selectedTab == 1) {
      this.fnBToBandC();
    } else if (this.selectedTab == 2) {
      this.fnHSNSalesDetailedReport();
    } else if (this.selectedTab == 3) {
      this.fnHSNSalesSummaryReport();
    }    
     //  else if (this.selectedTab == 4) {
    //   this.fnCustomerwiseHSNSummaryReport();
    // } else if (this.selectedTab == 5) {
    //   this.fnBToBCDNRGSTUpload();
    // } else if (this.selectedTab == 6) {
    //   this.fnBToBCDNURGSTUpload();
    // } else if (this.selectedTab == 7) {
    //   this.fn3BReport();
    // } else if (this.selectedTab == 8) {
    //   this.fn3BSummaryReport();
    // } else if (this.selectedTab == 9) {
    //   this.fnSalesRegister();
    // } else if (this.selectedTab == 10) {
    //   this.fnHSNSummaryReturn();
    // }
  }

  async fnBToBandC() {
    let Book_FromDate = this.ConvertDateAll(this.fromDate);
    let Book_ToDate = this.ConvertDateAll(this.toDate);

    let ncount = 0;
    let BillSerIds = '';
    let bListShow = 'No';
    this.billSeries.forEach(res => {
      if (res.checked) {
        if (ncount == 0) {
          BillSerIds = ` and  (BillSeries.BillSerId = ${res.BillSerId}`;
        } else {
          BillSerIds += ` or BillSeries.BillSerId = ${res.BillSerId}`;
        }
        ncount += 1;
        bListShow = 'Yes';
      }
    });
    BillSerIds += ' )';

    if (bListShow == 'No') {
      this.appService.openSnackBar('Choose Billseries', 'warning');
      return
    }

    if (!this.btnCash && !this.btnCredit && !this.btnCard) {
      this.appService.openSnackBar('Choose PayTerms', 'warning');
      return;
    }

    let TinFlag = 'No';
    if (this.chkTin) {
      TinFlag = 'Yes';
    }
    let strPayterms = '';
    if (this.btnCredit && this.btnCash && this.btnCard) {
      strPayterms = ' ';
    } else if (this.btnCredit && this.btnCash) {
      strPayterms = ' and ( Issue_PayTerms =\'CREDIT\' or Issue_PayTerms =\'CASH\')  ';
    } else if (this.btnCredit && this.btnCard) {
      strPayterms = ' and ( Issue_PayTerms =\'CREDIT\' or Issue_PayTerms =\'CARD\')  ';
    } else if (this.btnCash && this.btnCard) {
      strPayterms = ' and ( Issue_PayTerms =\'CASH\' or Issue_PayTerms =\'CARD\')';
    } else if (this.btnCash) {
      strPayterms = ' and ( Issue_PayTerms =\'CASH\' )';
    } else if (this.btnCredit) {
      strPayterms = ' and ( Issue_PayTerms =\'CREDIT\' )';
    } else if (this.btnCard) {
      strPayterms = ' and ( Issue_PayTerms =\'CARD\' )';
    }
    this.strReportHeadName = ` Sales  Report From ${Book_FromDate} To ${Book_ToDate}`;
    this.loading = true;
    if (this.selectedTab == 0) {

      let ServiceParams = {};
      ServiceParams['strProc'] = 'BToBGSTUpload';

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
      ProcParams['strKey'] = 'BillSeries';
      ProcParams['strArgmt'] = BillSerIds;
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams['strKey'] = 'BranchId';
      ProcParams['strArgmt'] = this.branchId;
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams['strKey'] = 'PayTerms';
      ProcParams['strArgmt'] = strPayterms;
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams['strKey'] = 'TinFlag';
      ProcParams['strArgmt'] = TinFlag;
      oProcParams.push(ProcParams);

      ServiceParams['oProcParams'] = oProcParams;

      let body = JSON.stringify(ServiceParams);
      await this.appService.post('CommonQuery/fnGetDataReportReturnMultiTable', body).toPromise()
        .then(data => {

          let jsonData = JSON.parse(data)
          jsonData = JSON.parse(jsonData[0]);
          this.dataRep = jsonData;
          this.loading = false;
          this.showReport = true;
        }, err => {
          this.appService.openSnackBar('sorry server busy', '');
          this.loading = false;
        });
    } else {
      let ServiceParams = {};
      ServiceParams['strProc'] = 'BToCGSTUpload';

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
      ProcParams['strKey'] = 'BillSeries';
      ProcParams['strArgmt'] = BillSerIds;
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams['strKey'] = 'BranchId';
      ProcParams['strArgmt'] = this.branchId;
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams['strKey'] = 'PayTerms';
      ProcParams['strArgmt'] = strPayterms;
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams['strKey'] = 'TinFlag';
      ProcParams['strArgmt'] = TinFlag;
      oProcParams.push(ProcParams);

      ServiceParams['oProcParams'] = oProcParams;

      let body = JSON.stringify(ServiceParams);

      await this.appService.post('CommonQuery/fnGetDataReportReturnMultiTable', body).toPromise()
        .then(data => {
          let jsonData = JSON.parse(data)
          jsonData = JSON.parse(jsonData[0]);
          this.dataRep = jsonData;
          this.loading = false;
          this.showReport = true;
        }, err => {
          this.appService.openSnackBar('sorry server busy', '');
          this.loading = false;
        });
    }

  }

  async fnHSNSalesDetailedReport() {
    let Book_FromDate = this.ConvertDateAll(this.fromDate);
    let Book_ToDate = this.ConvertDateAll(this.toDate);

    let ncount = 0;
    let BillSerIds = '';
    let bListShow = 'No';
    this.billSeries.forEach(res => {
      if (res.checked) {
        if (ncount == 0) {
          BillSerIds = ` and  (BillSeries.BillSerId = ${res.BillSerId}`;
        } else {
          BillSerIds += ` or BillSeries.BillSerId = ${res.BillSerId}`;
        }
        ncount += 1;
        bListShow = 'Yes';
      }
    });
    BillSerIds += ' )';

    if (bListShow == 'No') {
      this.appService.openSnackBar('Choose Billseries', 'warning');
      return
    }
    this.loading = true;
    this.strReportHeadName = `  Productwise Sales GST Report From ${Book_FromDate} To ${Book_ToDate}`;
    let ServiceParams = {};
    ServiceParams['strProc'] = 'HSNSalesDetailedReport';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'FROMDATE';
    ProcParams['strArgmt'] = Book_FromDate;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'TODATE';
    ProcParams['strArgmt'] = Book_ToDate;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'ProductIds';
    ProcParams['strArgmt'] = '';
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId1';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BillSerIds';
    ProcParams['strArgmt'] = BillSerIds;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);

    await this.appService.post('CommonQuery/fnGetDataReportReturnMultiTable', body).toPromise()
      .then(data => {
        let jsonData = JSON.parse(data);
        jsonData = JSON.parse(jsonData[0]);
        this.dataRep = jsonData;
        this.loading = false;
        this.showReport = true;
      }, err => {
        this.appService.openSnackBar('sorry server busy', '');
        this.loading = false;
      });
  }

  async fnHSNSalesSummaryReport() {
    let Book_FromDate = this.ConvertDateAll(this.fromDate);
    let Book_ToDate = this.ConvertDateAll(this.toDate);

    let ncount = 0;
    let BillSerIds = '';
    let bListShow = 'No';
    this.billSeries.forEach(res => {
      if (res.checked) {
        if (ncount == 0) {
          BillSerIds = ` and  (BillSeries.BillSerId = ${res.BillSerId}`;
        } else {
          BillSerIds += ` or BillSeries.BillSerId = ${res.BillSerId}`;
        }
        ncount += 1;
        bListShow = 'Yes';
      }
    });
    BillSerIds += ' )';

    if (bListShow == 'No') {
      this.appService.openSnackBar('Choose Billseries', 'warning');
      return
    }
    this.loading = true;
    this.strReportHeadName = ' Productwise Sales GST Report From '+this.fnDateReverse(this.fromDate)+' To '+this.fnDateReverse(this.toDate);

    let ServiceParams = {};
    ServiceParams['strProc'] = 'HSNSalesSummaryReport';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'FROMDATE';
    ProcParams['strArgmt'] = Book_FromDate;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'TODATE';
    ProcParams['strArgmt'] = Book_ToDate;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'ProductIds';
    ProcParams['strArgmt'] = '';
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId1';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BillSerIds';
    ProcParams['strArgmt'] = BillSerIds;
    oProcParams.push(ProcParams);
    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    await this.appService.post('CommonQuery/fnGetDataReportReturnMultiTable', body).toPromise()
      .then(data => {
        let jsonData = JSON.parse(data);
        jsonData = JSON.parse(jsonData[0]);
        this.dataRep = jsonData;
        this.loading = false;
        this.showReport = true;
      }, err => {
        this.appService.openSnackBar('sorry server busy', '');
        this.loading = false;
      });
  }

  async fnCustomerwiseHSNSummaryReport() {
    let Book_FromDate = this.ConvertDateAll(this.fromDate);
    let Book_ToDate = this.ConvertDateAll(this.toDate);

    let ncount = 0;
    let BillSerIds = '';
    let bListShow = 'No';
    this.billSeries.forEach(res => {
      if (res.checked) {
        if (ncount == 0) {
          BillSerIds = ` and  (BillSeries.BillSerId = ${res.BillSerId}`;
        } else {
          BillSerIds += ` or BillSeries.BillSerId = ${res.BillSerId}`;
        }
        ncount += 1;
        bListShow = 'Yes';
      }
    });
    BillSerIds += ' )';

    if (bListShow == 'No') {
      this.appService.openSnackBar('Choose Billseries', 'warning');
      return
    }
    this.loading = true;
    this.strReportHeadName = ' Customerwise HsnSummaryDetailedReport From '+this.fnDateReverse(this.fromDate)+' To '+this.fnDateReverse(this.toDate);

    let ServiceParams = {};
    ServiceParams['strProc'] = 'CustomerwiseHsnSummaryDetailedReport';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'FROMDATE';
    ProcParams['strArgmt'] = Book_FromDate;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'TODATE';
    ProcParams['strArgmt'] = Book_ToDate;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'ProductIds';
    ProcParams['strArgmt'] = '';
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId1';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BillSerIds';
    ProcParams['strArgmt'] = BillSerIds;
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

  async fnBToBCDNRGSTUpload() {
    this.loading = true;
    let Book_FromDate = this.ConvertDateAll(this.fromDate);
    let Book_ToDate = this.ConvertDateAll(this.toDate);

    let ServiceParams = {};
    ServiceParams['strProc'] = 'BToBCDNRGSTUpload';

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

  async fnBToBCDNURGSTUpload() {
    this.loading = true;
    let Book_FromDate = this.ConvertDateAll(this.fromDate);
    let Book_ToDate = this.ConvertDateAll(this.toDate);

    let ServiceParams = {};
    ServiceParams['strProc'] = 'BToBCDNURGSTUpload';

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
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    await this.appService.post('/CommonQuery/fnGetDataReport', body).toPromise()
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

  async fn3BReport() {
    let Book_FromDate = this.ConvertDateAll(this.fromDate);
    let Book_ToDate = this.ConvertDateAll(this.toDate);

    let ncount = 0;
    let BillSerIds = '';
    let bListShow = 'No';
    this.billSeries.forEach(res => {
      if (res.checked) {
        if (ncount == 0) {
          BillSerIds = ` and  (BillSeries.BillSerId = ${res.BillSerId}`;
        } else {
          BillSerIds += ` or BillSeries.BillSerId = ${res.BillSerId}`;
        }
        ncount += 1;
        bListShow = 'Yes';
      }
    });
    BillSerIds += ' )';

    if (bListShow == 'No') {
      this.appService.openSnackBar('Choose Billseries', 'warning');
      return
    }

    this.loading = true;
    this.strReportHeadName =  ' GST 3B Report From '+this.fnDateReverse(this.fromDate)+' To '+this.fnDateReverse(this.toDate);

    let ServiceParams = {};
    ServiceParams['strProc'] = 'GST3BFormat';

    let oProcParams = [];
    let ProcParams = {};

    ProcParams['strKey'] = '@ParamsFromDate';
    ProcParams['strArgmt'] = Book_FromDate;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsToDate';
    ProcParams['strArgmt'] = Book_ToDate;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsBillSeries';
    ProcParams['strArgmt'] = BillSerIds;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsBranchId';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);

    await this.appService.post('CommonQuery/fnGetDataReportFromScriptJsonFile', body).toPromise()
      .then(data => {
        let jsonData = JSON.parse(data.JsonDetails[0]);
        this.dataRep = jsonData;
        this.loading = false;
        this.showReport = true;
      }, err => {
        this.appService.openSnackBar('sorry server busy', '');
        this.loading = false;
      });
  }

  async fn3BSummaryReport() {
    let Book_FromDate = this.ConvertDateAll(this.fromDate);
    let Book_ToDate = this.ConvertDateAll(this.toDate);

    let ncount = 0;
    let BillSerIds = '';
    let bListShow = 'No';
    this.billSeries.forEach(res => {
      if (res.checked) {
        if (ncount == 0) {
          BillSerIds = ` and  (BillSeries.BillSerId = ${res.BillSerId}`;
        } else {
          BillSerIds += ` or BillSeries.BillSerId = ${res.BillSerId}`;
        }
        ncount += 1;
        bListShow = 'Yes';
      }
    });
    BillSerIds += ' )';

    if (bListShow == 'No') {
      this.appService.openSnackBar('Choose Billseries', 'warning');
      return
    }

    this.loading = true;
    this.strReportHeadName = ' GST Tax Comparison Report From '+this.fnDateReverse(this.fromDate)+' To '+this.fnDateReverse(this.toDate);
    let ServiceParams = {};
    ServiceParams['strProc'] = 'GstMonthTaxSummary';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = '@ParamsFromDate';
    ProcParams['strArgmt'] = Book_FromDate;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsToDate';
    ProcParams['strArgmt'] = Book_ToDate;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsBranchId';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsBillSeries';
    ProcParams['strArgmt'] = BillSerIds;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
     await this.appService.post('CommonQuery/fnGetDataReportFromScriptJsonFile', body).toPromise()
    .then(data => {
      let jsonData = JSON.parse(data.JsonDetails[0]);
      this.dataRep = jsonData;
      this.loading = false;
      this.showReport = true;
    }, err => {
      this.appService.openSnackBar('sorry server busy', '');
      this.loading = false;
    });
  }

  async fnSalesRegister() {
    let Book_FromDate = this.ConvertDateAll(this.fromDate);
    let Book_ToDate = this.ConvertDateAll(this.toDate);

    let ncount = 0;
    let BillSerIds = '';
    let bListShow = 'No';
    this.billSeries.forEach(res => {
      if (res.checked) {
        if (ncount == 0) {
          BillSerIds = ` and  (BillSeries.BillSerId = ${res.BillSerId}`;
        } else {
          BillSerIds += ` or BillSeries.BillSerId = ${res.BillSerId}`;
        }
        ncount += 1;
        bListShow = 'Yes';
      }
    });
    BillSerIds += ' )';

    if (bListShow == 'No') {
      this.appService.openSnackBar('Choose Billseries', 'warning');
      return
    }

    this.loading = true;
    this.strReportHeadName = ' Sales Register  Report From '+this.fnDateReverse(this.fromDate)+' To '+this.fnDateReverse(this.toDate);
    let ServiceParams = {};
    ServiceParams['strProc'] = 'SalesRegister';
  
    let oProcParams = [];
    let ProcParams = {};
  
    ProcParams['strKey'] = '@ParamsFromDate';
    ProcParams['strArgmt'] = Book_FromDate;
    oProcParams.push(ProcParams);
  
    ProcParams = {};
    ProcParams['strKey'] = '@ParamsToDate';
    ProcParams['strArgmt'] = Book_ToDate;
    oProcParams.push(ProcParams);
  
    ProcParams = {};
    ProcParams['strKey'] = '@ParamsBillSerIds';
    ProcParams['strArgmt'] = BillSerIds;
    oProcParams.push(ProcParams);
  
    ProcParams = {};
    ProcParams['strKey'] = '@ParamsBranchId';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);
  
    ServiceParams['oProcParams'] = oProcParams;
  
    let body = JSON.stringify(ServiceParams);
    await this.appService.post('CommonQuery/fnGetDataReportFromScriptJsonFile', body).toPromise()
    .then(data => {
      let jsonData = JSON.parse(data.JsonDetails[0]);
      this.dataRep = jsonData;
      this.loading = false;
      this.showReport = true;
    }, err => {
      this.appService.openSnackBar('sorry server busy', '');
      this.loading = false;
    });
  }

  async fnHSNSummaryReturn() {
    let Book_FromDate = this.ConvertDateAll(this.fromDate);
    let Book_ToDate = this.ConvertDateAll(this.toDate);

    this.loading = true;
    this.strReportHeadName = ' Hsn Summary With SalesReturn  Report From '+this.fnDateReverse(this.fromDate)+' To '+this.fnDateReverse(this.toDate);

    let ServiceParams = {};
    ServiceParams['strProc'] = 'HSNSalesSummaryReportWithReturn';
  
    let oProcParams = [];

    let ProcParams         = {};  
    ProcParams['strKey']   = '@ParamsFROMDATE';
    ProcParams['strArgmt'] = Book_FromDate;
    oProcParams.push(ProcParams);
  
    ProcParams             = {};
    ProcParams['strKey']   = '@ParamsTODATE';
    ProcParams['strArgmt'] = Book_ToDate;
    oProcParams.push(ProcParams);
  
    ProcParams             = {};
    ProcParams['strKey']   = '@ParamsBillSerIds';
    ProcParams['strArgmt'] = ' ';
    oProcParams.push(ProcParams);
  
    ProcParams             = {};
    ProcParams['strKey']   = '@ParamsBranchId1';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);
  
    ProcParams             = {};
    ProcParams['strKey']   = '@ParamsProductIds';
    ProcParams['strArgmt'] = ' ';
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
  
    let body = JSON.stringify(ServiceParams);
     await this.appService.post('CommonQuery/fnGetDataReportFromScriptJsonFile', body).toPromise()
    .then(data => {
      let jsonData = JSON.parse(data.JsonDetails[0]);
      this.dataRep = jsonData;
      this.loading = false;
      this.showReport = true;
    }, err => {
      this.appService.openSnackBar('sorry server busy', '');
      this.loading = false;
    });
  }

  ConvertDateAll(format) {
    let date = ("0" + format.getDate()).slice(-2);
    let month = ("0" + (format.getMonth() + 1)).slice(-2);
    let year = format.getFullYear();
    const dateconvert = year + '-' + month + '-' + date;
    return dateconvert;
  }
  fnDateReverse(format) {
    let date = ("0" + format.getDate()).slice(-2);
    let month = ("0" + (format.getMonth() + 1)).slice(-2);
    let year = format.getFullYear();
    const dateconvert = year + '-' + month + '-' + date;
    return dateconvert.split('-').reverse().join('/');
  }
}
