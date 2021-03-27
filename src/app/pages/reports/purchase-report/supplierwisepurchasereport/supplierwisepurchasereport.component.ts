import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-supplierwisepurchasereport',
  templateUrl: './supplierwisepurchasereport.component.html',
  styleUrls: ['./supplierwisepurchasereport.component.scss']
})
export class SupplierwisepurchasereportComponent implements OnInit {
  branchId = localStorage.getItem('SessionBranchId');
  staffId = localStorage.getItem('SessionStaffId');
  BranchName = localStorage.getItem('SessionBranchName');
  showReport = false;
  fromDate = new Date();
  toDate = new Date();
  selectedTab = 0;
  tabBills = ['Detailed', 'Summary', 'Detailed(GST)', 'SupplierwiseProduct', 'LiabilityPurchase'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  loading: boolean;
  processing: boolean;
  btnCash = true;
  btnCredit = true;
  strReportHeadName: string;
  dataRep = [];
  billSeries: any;
  selectDateType = 'InvoiceDate'
  txtDecimalPlaces: any;
  txtSoftwareName: any;

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.fromDate.setDate(1);
    this.fnSettings();
  }
  async fnSettings() {
    this.processing = true;
    let dictArgmts = { ProcName: 'Settings_GetValues' };
    let body = JSON.stringify(dictArgmts);
    await this.appService.post('CommonQuery/fnSettings', body)
      .toPromise().then(data => {
        for (var i = 0; i < data.length; i++) {
          if (data[i].KeyValue == 'DecimalPlace') {
            this.txtDecimalPlaces = data[i].Value;
          } else if (data[i].KeyValue == 'ProductName') {
            this.txtSoftwareName = data[i].Value;
          }
        }
      });
    this.fnBillSeries_Gets();
  }

  fnBillSeries_Gets() {
    let ServiceParams = {};
    // tslint:disable-next-line:quotemark
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
    this.appService.post('CommonQuery/fnGetDataReport', body)
      .toPromise().then(data => {
        const jsonData = JSON.parse(data);
        jsonData.map(data => data.checked = true);
        this.billSeries = jsonData;
      });
    this.fnCategroyGets();
  }

  fnCategroyGets() {
    this.processing = true;
    let ServiceParams = {};
    ServiceParams['strProc'] = 'AcccountHead_GetsForReport';

    let oProcParams = [];
    let ProcParams = {};
    ProcParams['strKey'] = 'Ac_Name';
    ProcParams['strArgmt'] = '';
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'Type';
    ProcParams['strArgmt'] = 'Supplier';
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);

    this.appService.post('CommonQuery/fnGetDataReport', body)
      .subscribe(data => {
        const jsonData = JSON.parse(data);
        this.dataSource = new MatTableDataSource(jsonData);
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

  fntabChange(eve) {
    this.selectedTab = eve;
  }

  fnSubmit() {

    if (this.selectedTab == 2) {
      this.fnPurchaseReportDetailedGst();
    } else if (this.selectedTab == 3) {
      this.fnSupplierwiseProductDetailed();
    } else if (this.selectedTab == 4) {
      this.fnLiabilityPurchaseRport();
    } else {
      this.fnShow();
    }
  }

  fnPurchaseReportDetailedGst() {
    let Book_FromDate = this.ConvertDateAll(this.fromDate);
    let Book_ToDate = this.ConvertDateAll(this.toDate);

    const billData = this.selection.selected;
    let DateCondition = '';
    let AcIds = '';
    if (this.selectDateType == 'InvoiceDate') {
      DateCondition = this.selectDateType;
    }

    if (billData.length == 0) {
      this.appService.openSnackBar('Choose Supplier', 'warning');
      return;
    }

    if (billData.length == this.dataSource.data.length) {
      AcIds = '';
    } else {
      billData.forEach((data, index) => {
        if (index == 0) {
          AcIds = ` and  (Receipt.AC_Id = ${data.AC_Id}`;
        } else {
          AcIds += `  or Receipt.AC_Id = ${data.AC_Id}`;
        }
      });
      AcIds += ' ) ';
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
    this.strReportHeadName = ' Purchase Report Detailed From '+this.fnDateReverse(this.fromDate)+' To '+this.fnDateReverse(this.toDate);
    let ServiceParams = {};
    ServiceParams['strProc'] = 'PurchaseRegisterSupplierwiseGst';
    ServiceParams['JsonFileName'] = 'JsonArrayScriptTwo';

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
    ProcParams['strArgmt'] = BillseriesIds;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsBranchId';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsOrderCondition';
    ProcParams['strArgmt'] = DateCondition;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsAcIds';
    ProcParams['strArgmt'] = AcIds;
    oProcParams.push(ProcParams);

    this.loading = true;
    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);

    this.appService.post('CommonQuery/fnGetDataReportFromScriptJsonFile', body)
      .subscribe(data => {

        let jsonData = JSON.parse(data.JsonDetails[0]);
        this.dataRep = jsonData;
        this.loading = false;
        this.showReport = true;
      }, err => {
        this.appService.openSnackBar('sorry server busy', '');
        this.loading = false;
      });
  }

  fnSupplierwiseProductDetailed() {
    let Book_FromDate = this.ConvertDateAll(this.fromDate);
    let Book_ToDate = this.ConvertDateAll(this.toDate);

    const billData = this.selection.selected;
    let DateCondition = '';
    let AcIds = '';
    if (this.selectDateType == 'InvoiceDate') {
      DateCondition = this.selectDateType;
    }

    if (billData.length == 0) {
      this.appService.openSnackBar('Choose Supplier', 'warning');
      return;
    }

    if (billData.length == this.dataSource.data.length) {
      AcIds = '';
    } else {
      billData.forEach((data, index) => {
        if (index == 0) {
          AcIds = ` and  (Receipt.AC_Id = ${data.AC_Id}`;
        } else {
          AcIds += `  or Receipt.AC_Id = ${data.AC_Id}`;
        }
      });
      AcIds += ' ) ';
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
    this.strReportHeadName = ' Productwise Purchase Report Detailed From '+this.fnDateReverse(this.fromDate)+' To '+this.fnDateReverse(this.toDate);

    let ServiceParams = {};
    ServiceParams['strProc'] = 'SupplierwiseProductwisePurchase';

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
    ProcParams['strKey'] = '@ParamsAcIds';
    ProcParams['strArgmt'] = AcIds;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsBranchId1';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsBillSeriesId';
    ProcParams['strArgmt'] = BillseriesIds;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    this.loading = true;
    let body = JSON.stringify(ServiceParams);
    this.appService.post('CommonQuery/fnGetDataReportFromScriptJsonFile', body)
      .subscribe(data => {

        let jsonData = JSON.parse(data.JsonDetails[0]);
        this.dataRep = jsonData;
        this.loading = false;
        this.showReport = true;
      }, err => {
        this.appService.openSnackBar('sorry server busy', '');
        this.loading = false;
      });
  }

  fnLiabilityPurchaseRport() {
    let Book_FromDate = this.ConvertDateAll(this.fromDate);
    let Book_ToDate = this.ConvertDateAll(this.toDate);

    let DateCondition = '';

    if (this.selectDateType == 'InvoiceDate') {
      DateCondition = this.selectDateType;
    }

    this.loading = true;
    let ServiceParams = {};
    ServiceParams['strProc'] = 'LiabilityPurchaseRport';
    ServiceParams['JsonFileName'] = 'JsonArrayScriptTwo';

    let oProcParams = [];
    let ProcParams = {};

    ProcParams = {};
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
    ProcParams['strKey'] = '@ParamsDateCondition';
    ProcParams['strArgmt'] = DateCondition;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    this.appService.post('CommonQuery/fnGetDataReportFromScriptJsonFile', body)
      .subscribe(data => {
        let jsonData = JSON.parse(data.JsonDetails[0]);
        this.dataRep = jsonData;
        this.loading = false;
        this.showReport = true;
      }, err => {
        this.appService.openSnackBar('sorry server busy', '');
        this.loading = false;
      });
  }

  fnShow() {
    let Book_FromDate = this.ConvertDateAll(this.fromDate);
    let Book_ToDate = this.ConvertDateAll(this.toDate);

    const billData = this.selection.selected;
    let DateCondition = '';

    let ListAccountHeadInfo = [];
    let selected = [];


    if (this.selectDateType == 'InvoiceDate') {
      DateCondition = this.selectDateType;
    }

    if (billData.length == 0) {
      this.appService.openSnackBar('Choose Supplier', 'warning');
      return;
    }

    billData.forEach((data, index) => {
      selected.push(data.AC_Id);
      let AccountHeadInfo = {};
      AccountHeadInfo['AC_Id'] = data.AC_Id;
      ListAccountHeadInfo.push(AccountHeadInfo);
    });


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

    let bCash = this.btnCash;
    let bCredit = this.btnCredit;
    let strPayTerms = '';
    if (bCash && bCredit) {
      strPayTerms = '';
    } else if (bCash) {
      strPayTerms = ' and (Receipt_PayTerms=\'CASH\') ';
    } else if (bCredit) {
      strPayTerms = ' and (Receipt_PayTerms=\'CREDIT\') ';
    }
    this.loading = true;

    let varArguements = {};
    varArguements = { BranchId: this.branchId, FromDate: Book_FromDate, ToDate: Book_ToDate, BillPrefix: BillseriesIds, PayTerms: strPayTerms, ReportHeading: this.strReportHeadName, BranchName: this.BranchName };

    let DictionaryObject = {};
    DictionaryObject['dictArgmts'] = varArguements;
    DictionaryObject['ListAccountHeadInfo'] = ListAccountHeadInfo;

    if (this.selectedTab == 1) {
      this.strReportHeadName = ` Supplierwise Purchase Report From ${Book_FromDate} To ${Book_ToDate}`;

      DictionaryObject['ProcName'] = 'Receipt_SupplierwisePurchaseConsole';
      let body = JSON.stringify(DictionaryObject);


      this.appService.post('Purchase/fnSupplierwiesPurchase', body)
        .subscribe(data => {
          let jsonData = JSON.parse(data.JsonDetails[0]);
          this.dataRep = jsonData;
          this.loading = false;
          this.showReport = true;
        }, err => {
          this.appService.openSnackBar('sorry server busy', '');
          this.loading = false;
        });
    } else {
      this.strReportHeadName = ' Supplierwise Purchase Report Detailed From '+this.fnDateReverse(this.fromDate)+' To '+this.fnDateReverse(this.toDate);
      varArguements = {
        BranchId: this.branchId, FromDate: Book_FromDate, ToDate: Book_ToDate,
        SoftwareName: this.txtSoftwareName, DecimalPlace: this.txtDecimalPlaces, BillPrefix: BillseriesIds, DateCondition: DateCondition, PayTerms: strPayTerms, ReportHeading: this.strReportHeadName, BranchName: this.BranchName
      };

      let DictionaryObject = {};
      DictionaryObject['dictArgmts'] = varArguements;
      DictionaryObject['ListAccountHeadInfo'] = ListAccountHeadInfo;
      DictionaryObject['ProcName'] = 'Receipt_PurchaseRegisterDetailed';

      let body = JSON.stringify(DictionaryObject);
      this.appService.post('Purchase/fnPurchaseRegister', body)
        .subscribe(data => {
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
