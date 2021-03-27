import { Component, OnInit, Renderer2 } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

// import { DatePipe } from '@angular/common';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-companywisesales',
  templateUrl: './companywisesales.component.html',
  styleUrls: ['./companywisesales.component.scss']
})
export class CompanywisesalesComponent implements OnInit {

  showReport = false;
  fromDate = new Date();
  toDate = new Date();
  selectbills = 'Companywise';
  tabBills = ['Companywise', 'Product', 'Customer', 'Summary', 
  'Free Sales Report',
    'Product Sales Summary', 'Customer Summary', 'Discount Report', 'Groupwise',
    'Detailed Discount Report', 'Productwise Discount Report'];
  selectedTab: number = 0;
  displayedColumns: string[] = ['select', 'ManufactureName'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);

  dataBills = new MatTableDataSource<any>();
  Billselection = new SelectionModel<any>(true, []);
  ColumnsDynamic: string[] = [];
  branchId = localStorage.getItem('SessionBranchId');
  staffId = localStorage.getItem('SessionStaffId');

  strReportHeadName = '';
  dataRep = [];

  processing: boolean;
  loading: boolean;
  txtSoftwareName: any;
  txtDecimalPlace: any;
  strReportDateCondition: any;
  NoOfMonth: string = '';

  constructor(public appService: AppService) { }

  ngOnInit() {
    this.fromDate.setDate(1);

  }

  ngAfterViewInit(): void {
    this.fnSettings();
  }

  async fnSettings() {

    let dictArgmts = { ProcName: 'Settings_GetValues' };

    let body = JSON.stringify(dictArgmts);

    await this.appService.post('CommonQuery/fnSettings', body).toPromise()
      .then(data => {

        var jsondata = data;

        for (var i = 0; i < jsondata.length; i++) {

          if (jsondata[i].KeyValue == 'ProductName') {
            this.txtSoftwareName = jsondata[i].Value;
          } else if (jsondata[i].KeyValue == 'QtyDecPlace') {
            this.txtDecimalPlace = jsondata[i].Value;
          } else if (jsondata[i].KeyValue == 'ReportDateCondition') {
            this.strReportDateCondition = jsondata[i].Value;
          }
        }
      })   
      this.fnManufactureGetForReport();  
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
    await this.appService.post('Master/Manufacture_Gets', body).toPromise()
      .then(data => {
        this.dataSource = new MatTableDataSource(data);
        this.processing = false;
      }, err => {
        this.appService.openSnackBar('server busy', '');
        this.processing = false;
      })
  }

  fnSubmit() {


    this.dataRep = null;

    switch (this.selectedTab) {
      case 0:
        this.fnCompanywiseSales();
        break;
      case 1:
        this.fnCompanywiseProductwiseSales();
        break;
      case 2:
        this.fnCompanywiseCustomerwiseSales();
        break;
      case 3:
        this.fnCompanywiseSalesSummary();
        break;
      case 4:
        this.fnCompanywiseSalesFreeStmt();
        break;
      case 5:
        this.fnProductwiseSalesSummary();
        break;
      case 6:
        this.fnCompanywiseCustomerwiseSalesSummary();
        break;
      case 7:
        this.fnCompanywiseDisAmtRpt();
        break;
      case 8:
        this.fnGroupwiseSales();
        break;
      case 9:
        this.fnCompanywiseDiscountDetailedRpt();
        break;
      case 10:
        this.fnProductwiseDiscountReport();
        break;
      default:
        break;
    }

  }

  async fnProductwiseDiscountReport() {
    let ischeck = false;
    let selected = [];
    let ComIds = '';
    let Book_FromDate = this.ConvertDateAll(this.fromDate)
    let Book_ToDate = this.ConvertDateAll(this.toDate)

    const billData = this.selection.selected;
    if (billData.length == 0) {
      this.appService.openSnackBar('Choose Company', 'warning');
      return;
    }
    if (billData.length == this.dataSource.data.length) {
      ischeck = true;
    } else {
      billData.forEach((data, index) => {
        selected.push(data.Manufacture_Id)
        if (index == 0) {
          ComIds = `  and  (Manufacture.Manufacture_Id = ${data.Manufacture_Id}`;
        } else {
          ComIds += ` or Manufacture.Manufacture_Id  = ${data.Manufacture_Id}`;
        }

      });
      ComIds += ' )';
    }
    this.strReportHeadName = ' Productwise Discount Report From '+this.fnDateReverse(this.fromDate)+'To'+this.fnDateReverse(this.toDate);
    this.loading = true;
    let ServiceParams = {};
    ServiceParams['strProc'] = 'ProductwiseDiscountRpt';
    let oProcParams = [];

    var ProcParams = {};
    ProcParams['strKey'] = '@ParamsFromDate';
    ProcParams['strArgmt'] = Book_FromDate;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsToDate';
    ProcParams['strArgmt'] = Book_ToDate;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsManufactureIds';
    ProcParams['strArgmt'] = ComIds;
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

  async fnCompanywiseDiscountDetailedRpt() {
    let ischeck = false;
    let selected = [];
    let ComIds = '';
    let Book_FromDate = this.ConvertDateAll(this.fromDate)
    let Book_ToDate = this.ConvertDateAll(this.toDate)

    const billData = this.selection.selected;
    if (billData.length == 0) {
      this.appService.openSnackBar('Choose Company', 'warning');
      return;
    }
    if (billData.length == this.dataSource.data.length) {
      ischeck = true;
    } else {
      billData.forEach((data, index) => {
        selected.push(data.Manufacture_Id)
        if (index == 0) {
          ComIds = `  and  (Manufacture.Manufacture_Id = ${data.Manufacture_Id}`;
        } else {
          ComIds += ` or Manufacture.Manufacture_Id  = ${data.Manufacture_Id}`;
        }

      });
      ComIds += ' )';
    }
    this.strReportHeadName = ' Companywise Discount Report From '+this.fnDateReverse(this.fromDate)+'To'+this.fnDateReverse(this.toDate);
    this.loading = true;

    let ServiceParams = {};
    ServiceParams['strProc'] = 'CompanywiseDiscountDetailedRpt';
    let oProcParams = [];

    var ProcParams = {};
    ProcParams['strKey'] = 'FromDate';
    ProcParams['strArgmt'] = Book_FromDate;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'ToDate';
    ProcParams['strArgmt'] = Book_ToDate;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'ManufactureIds';
    ProcParams['strArgmt'] = ComIds;
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

  async fnGroupwiseSales() {   
    let ischeck = false;
    let ComIds = '';
    let Book_FromDate = this.ConvertDateAll(this.fromDate)
    let Book_ToDate = this.ConvertDateAll(this.toDate)
    const billData = this.selection.selected;
    if (billData.length == 0) {
      this.appService.openSnackBar('Choose Group', 'warning');
      return;
    }

    if (billData.length == this.dataSource.data.length) {    
      
      ischeck = true;
    } else {
      billData.forEach((data, index) => {

        if (index == 0) {
          ComIds = `  and  (Category.CategoryId = ${data.CategoryID}`;
        } else {
          ComIds += ` or Category.CategoryId  = ${data.CategoryID}`;
        }

      });
      ComIds += ' )';
    }

    this.strReportHeadName = ' Groupwise Sales Report From '+this.fnDateReverse(this.fromDate)+'To'+this.fnDateReverse(this.toDate);
    this.loading = true;
    let ServiceParams = {};
    ServiceParams['strProc'] = 'CompanyGroupwiseSales';
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
    ProcParams['strKey'] = 'ManufactureGroupIds';
    ProcParams['strArgmt'] = ComIds;
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

  async fnCompanywiseDisAmtRpt() {
    let ischeck = false;
    let selected = [];
    let ComIds = '';
    let Book_FromDate = this.ConvertDateAll(this.fromDate)
    let Book_ToDate = this.ConvertDateAll(this.toDate)

    const billData = this.selection.selected;
    if (billData.length == 0) {
      this.appService.openSnackBar('Choose Company', 'warning');
      return;
    }
    if (billData.length == this.dataSource.data.length) {
      ischeck = true;
    } else {
      billData.forEach((data, index) => {
        selected.push(data.Manufacture_Id)
        if (index == 0) {
          ComIds = `  and  (Manufacture.Manufacture_Id = ${data.Manufacture_Id}`;
        } else {
          ComIds += ` or Manufacture.Manufacture_Id  = ${data.Manufacture_Id}`;
        }

      });
      ComIds += ' )';
    }    
    this.strReportHeadName = ' Companywise Discount Report From '+this.fnDateReverse(this.fromDate)+'To'+this.fnDateReverse(this.toDate);
    this.loading = true;
    let ServiceParams = {};
    ServiceParams['strProc'] = 'CompanywiseDiscountRpt';
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
    ProcParams['strKey'] = 'ManufactureIds';
    ProcParams['strArgmt'] = ComIds;
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

  async fnCompanywiseCustomerwiseSalesSummary() {
    let Book_FromDate = this.ConvertDateAll(this.fromDate)
    let Book_ToDate = this.ConvertDateAll(this.toDate)
    let chkAll1 = false;
    let chkAll2 = false;

    let selected = [];
    let ListCompanyInfo = [];
    let CompanyIds = '';
    const billData = this.selection.selected;
    if (billData.length == 0) {
      this.appService.openSnackBar('Choose Company', 'warning');
      return;
    }
    if (billData.length == this.dataSource.data.length) {
      chkAll1 = true;
    } else {
      billData.forEach((data, index) => {
        selected.push(data.Manufacture_Id)
        if (index == 0) {
          CompanyIds = `  and  (Manufacture.Manufacture_Id = ${data.Manufacture_Id}`;
        } else {
          CompanyIds += ` or Manufacture.Manufacture_Id  = ${data.Manufacture_Id}`;
        }

      });
      CompanyIds += ' )';
    }

    let ListCustomerInfo = [];
    const itemData = this.Billselection.selected;

    if (itemData.length == 0) {
      this.appService.openSnackBar('Choose Customer', 'warning');
      return;
    }

    let CustomerIds = '';
    if (itemData.length == this.dataBills.data.length) {
      chkAll2 = true;
    } else {
      itemData.forEach((data, index) => {
        selected.push(data.AC_Id);
        let CusId = data.AC_Id;
        let IdParameterInfo = {};
        IdParameterInfo['Id'] = CusId;
        ListCustomerInfo.push(IdParameterInfo);
        if (index == 0) {
          CustomerIds = `  and (AccountHead.ac_id= ${CusId}`;
        } else {
          CustomerIds += ` or AccountHead.ac_id= ${CusId} `;
        }

      });
      CustomerIds += ' )';
    }
    this.loading = true;
    this.strReportHeadName = ' Companywise Customerwise Sales Summary Report From '+this.fnDateReverse(this.fromDate)+'To'+this.fnDateReverse(this.toDate);

    let ServiceParams = {};

    ServiceParams['strProc'] = 'Issue_CompanywiseCustomerwiseSalesSummary';

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
    ProcParams['strKey'] = 'ComIds';
    ProcParams['strArgmt'] = CompanyIds;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'AcIds';
    ProcParams['strArgmt'] = CustomerIds;
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

  async fnProductwiseSalesSummary() {

    let ListCompanyInfo = [];
    let selected = [];
    let ischeck = false;
    let Book_FromDate = this.ConvertDateAll(this.fromDate)
    let Book_ToDate = this.ConvertDateAll(this.toDate)
    const billData = this.selection.selected;
    if (billData.length == 0) {
      this.appService.openSnackBar('Choose Company', 'warning');
      return;
    }
    if (billData.length == this.dataSource.data.length) {
      ischeck = true;
    } else {
      billData.forEach((data, index) => {
        selected.push(data.Manufacture_Id);
        var IdParameterInfo = {};
        IdParameterInfo['Id'] = data.Manufacture_Id;
        ListCompanyInfo.push(IdParameterInfo);
      });
    }
    if (this.NoOfMonth == '0' || this.NoOfMonth == '') {
      this.NoOfMonth = ''
      this.appService.openSnackBar('Enter No Of Month', 'warning');
      return;
    }

    this.loading = true;
    this.strReportHeadName = ' Productwise Sales Summary From  '+this.fnDateReverse(this.fromDate)+'To'+this.fnDateReverse(this.toDate);
    let varArguements = {};
    varArguements = { BranchId: this.branchId, FromDate: this.fnDateReverse(this.fromDate), ToDate: this.fnDateReverse(this.toDate), 'chkAll1': ischeck, nNoOfMonth: this.NoOfMonth };

    let DictionaryObject = {};
    DictionaryObject['dictArgmts'] = varArguements;
    DictionaryObject['ListCompanyInfo'] = ListCompanyInfo;
    DictionaryObject['ProcName'] = 'ProductwiseSalesAnalysis';

    let body = JSON.stringify(DictionaryObject);

    await this.appService.post('Sales/fnProductwiseSalesAnalysis', body).toPromise()
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

  async fnCompanywiseSalesFreeStmt() {

    let selected = [];
    let ComIds = '';
    let Book_FromDate = this.ConvertDateAll(this.fromDate)
    let Book_ToDate = this.ConvertDateAll(this.toDate)
    const billData = this.selection.selected;
    if (billData.length == 0) {
      this.appService.openSnackBar('Choose Company', 'warning');
      return;
    }

    if (billData.length !== this.dataSource.data.length) {
      billData.forEach((data, index) => {
        selected.push(data.Manufacture_Id)
        if (index == 0) {
          ComIds = `  and  (Manufacture.Manufacture_Id = ${data.Manufacture_Id}`;
        } else {
          ComIds += ` or Manufacture.Manufacture_Id  = ${data.Manufacture_Id}`;
        }

      });
      ComIds += ' )';
    }

    this.loading = true;
    this.strReportHeadName = ' Companywise Sales Free Report From '+this.fnDateReverse(this.fromDate)+'To'+this.fnDateReverse(this.toDate);

    let ServiceParams = {};
    ServiceParams['strProc'] = 'IssueSubDetails_GetFreeQtyCompanywise';
    let oProcParams = [];

    var ProcParams = {};
    ProcParams['strKey'] = 'FromDate';
    ProcParams['strArgmt'] = Book_FromDate;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'ToDate';
    ProcParams['strArgmt'] = Book_ToDate;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'Id';
    ProcParams['strArgmt'] = ComIds;
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

  async fnCompanywiseSalesSummary() {
    let ischeck = false;
    let selected = [];
    let ListCompanyInfo = [];
    let CompanyIds = '';
    let Book_FromDate = this.ConvertDateAll(this.fromDate)
    let Book_ToDate = this.ConvertDateAll(this.toDate)
    const billData = this.selection.selected;
    if (billData.length == 0) {
      this.appService.openSnackBar('Choose Company', 'warning');
      return;
    }

    if (billData.length !== this.dataSource.data.length) {
      billData.forEach((data, index) => {
        selected.push(data.Manufacture_Id)
        if (index == 0) {
          CompanyIds = `  and (Manufacture.Manufacture_Id = ${data.Manufacture_Id}`;
        } else {
          CompanyIds += ` or Manufacture.Manufacture_Id = ${data.Manufacture_Id}`;
        }

      });
      CompanyIds += ' )';
    }

    this.loading = true;
    this.strReportHeadName = ' Companywise Sales Report From '+this.fnDateReverse(this.fromDate)+'To'+this.fnDateReverse(this.toDate);

    let ServiceParams = {};

    ServiceParams['strProc'] = 'Issue_CompanywiseSalesConsolidated';

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
    ProcParams['strKey'] = 'ComIds';
    ProcParams['strArgmt'] = CompanyIds;
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

  async fnCompanywiseCustomerwiseSales() {
    let Book_FromDate = this.ConvertDateAll(this.fromDate)
    let Book_ToDate = this.ConvertDateAll(this.toDate)
    let selected = [];
    let ListCompanyInfo = [];
    const billData = this.selection.selected;
    if (billData.length == 0) {
      this.appService.openSnackBar('Choose Company', 'warning');
      return;
    }

    let chkAll1 = false
    if (billData.length == this.dataSource.data.length) {
      chkAll1 = true;
    } else {
      billData.forEach((data, index) => {
        selected.push(data.ManufactureId);
        let IdParameterInfo = {};
        IdParameterInfo['Id'] = data.ManufactureId;
        ListCompanyInfo.push(IdParameterInfo);
      });
    }

    let chkAll2 = false
    selected = [];
    let ListCustomerInfo = [];
    const itemData = this.Billselection.selected;


    if (itemData.length == 0) {
      this.appService.openSnackBar('Choose Customer', 'warning');
      return;
    }
    this.loading = true;

    if (itemData.length == this.dataBills.data.length) {
      chkAll2 = true;
    } else {
      itemData.forEach((data, index) => {
        selected.push(data.AC_Id);
        let CusId = data.AC_Id;
        let IdParameterInfo = {};
        IdParameterInfo['Id'] = CusId;
        ListCustomerInfo.push(IdParameterInfo);
      });
    }
    this.strReportHeadName =  ' Companywise Customerwise Sales Report From '+this.fnDateReverse(this.fromDate)+'To'+this.fnDateReverse(this.toDate);

    let varArguements = {};
    varArguements = { BranchId: this.branchId, SoftwareName: this.txtSoftwareName, DecimalPlace: this.txtDecimalPlace, FromDate: Book_FromDate, ToDate: Book_ToDate, 'chkAll1': chkAll1, 'chkAll2': chkAll2 };

    let DictionaryObject = {};
    DictionaryObject['dictArgmts'] = varArguements;
    DictionaryObject['ListCompanyInfo'] = ListCompanyInfo;
    DictionaryObject['ListCustomerInfo'] = ListCustomerInfo;
    DictionaryObject['ProcName'] = 'Issue_CompanywiseCustomerwiseSales';

    let body = JSON.stringify(DictionaryObject);
    await this.appService.post('Sales/fnCompanywiseCustomerwiseSales', body).toPromise()
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

  async fnCompanywiseProductwiseSales() {
    let Book_FromDate = this.ConvertDateAll(this.fromDate)
    let Book_ToDate = this.ConvertDateAll(this.toDate)
    let selected = [];
    let ListCompanyInfo = [];
    const billData = this.selection.selected;
    if (billData.length == 0) {
      this.appService.openSnackBar('Choose Company', 'warning');
      return;
    }

    let chkAll1 = false
    if (billData.length == this.dataSource.data.length) {
      chkAll1 = true;
    } else {
      billData.forEach((data, index) => {
        selected.push(data.Manufacture_Id);
        let IdParameterInfo = {};
        IdParameterInfo['Id'] = data.Manufacture_Id;
        ListCompanyInfo.push(IdParameterInfo);
      });
    }

    let chkAll2 = false
    selected = [];
    let ListProductInfo = [];
    const itemData = this.Billselection.selected;
    if (itemData.length == 0) {
      this.appService.openSnackBar('Choose Product', 'warning');
      return;
    }
    this.loading = true;

    if (itemData.length == this.dataBills.data.length) {
      chkAll2 = true;
    } else {
      itemData.forEach((data, index) => {
        selected.push(data.ProductId);
        let ProdId = data.ProductId;
        let IdParameterInfo = {};
        IdParameterInfo['Id'] = ProdId;
        ListProductInfo.push(IdParameterInfo);
      });
    }

    this.strReportHeadName = ' Companywise Productwise Sales Report From '+this.fnDateReverse(this.fromDate)+'To'+this.fnDateReverse(this.toDate);
    let varArguements = {};
    varArguements = { BranchId: this.branchId, SoftwareName: this.txtSoftwareName, DecimalPlace: this.txtDecimalPlace, FromDate: Book_FromDate, ToDate: Book_ToDate, 'chkAll1': chkAll1, 'chkAll2': chkAll2 };

    let DictionaryObject = {};
    DictionaryObject['dictArgmts'] = varArguements;
    DictionaryObject['ListCompanyInfo'] = ListCompanyInfo;
    DictionaryObject['ListProductInfo'] = ListProductInfo;
    DictionaryObject['ProcName'] = 'Issue_CompanywiseProductwiseSales';

    let body = JSON.stringify(DictionaryObject);

    await this.appService.post('Sales/fnCompanywiseProductwiseSales', body).toPromise()
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

  async fnCompanywiseSales() {

    let Book_FromDate = this.ConvertDateAll(this.fromDate)
    let Book_ToDate = this.ConvertDateAll(this.toDate)
    let selected = [];
    let ListCompanyInfo = [];
    const billData = this.selection.selected;
    if (billData.length == 0) {
      this.appService.openSnackBar('Choose Company', 'warning');
      return;
    }
    let chkAll = false 
    if (billData.length == this.dataSource.data.length) {
      chkAll = true;
    } else {
         
      billData.forEach((data, index) => {
        selected.push(data.ManufactureId);
        let IdParameterInfo = {};
        IdParameterInfo['Id'] = data.ManufactureId;
        ListCompanyInfo.push(IdParameterInfo);
      });
    }
    this.loading = true;


    this.strReportHeadName = 'Companywise Sales Report From '+this.fnDateReverse(this.fromDate)+'To'+this.fnDateReverse(this.toDate);
    let varArguements = {};
    varArguements = { BranchId: this.branchId, FromDate: Book_FromDate, ToDate: Book_ToDate, 'chkAll1': chkAll, SoftwareName: this.txtSoftwareName, DecimalPlace: this.txtDecimalPlace };

    let DictionaryObject = {};
    DictionaryObject['dictArgmts'] = varArguements;
    DictionaryObject['ListCompanyInfo'] = ListCompanyInfo;
    DictionaryObject['ProcName'] = 'CompanywiseSalesDetailed';

    let body = JSON.stringify(DictionaryObject);    
    await this.appService.post('Sales/fnCompanywiseSales', body).toPromise()
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

  fntabChange(eve) {
    this.selectedTab = eve;
    if (eve == 1) {
      this.Billselection.clear();
      this.ColumnsDynamic = ['ProductName', 'Product Name'];
      this.fnProductsGetForReport();
    }
    if (eve == 2 || eve == 6) {
      this.Billselection.clear();
      this.ColumnsDynamic = ['AC_Name', 'Customer Name'];
      this.fnCustomerGetForReport();
    }
    if (eve == 8) {
      this.selection.clear();
      this.displayedColumns = ['select', 'CategoryName']
      this.fnGroupGets();
    } else if (this.displayedColumns[1] == 'CategoryName') {
      this.selection.clear();
      this.displayedColumns = ['select', 'ManufactureName'];
      this.fnManufactureGetForReport();
    }

  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows; 
  }

  itsmasterToggle() {
    this.itsAllSelected() ?
      this.Billselection.clear() :
      this.dataBills.data.forEach(row => this.Billselection.select(row));
  }

  itsAllSelected() {
    const numSelected = this.Billselection.selected.length;
    const numRows = this.dataBills.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  async fnGroupGets() {
    let id = 1;
    await this.appService.get(`GetRepository/Category_GetOnTypeId?typeId=${id}`).toPromise()
      .then(data => {
        let jsonData:any = data;
        this.dataSource = new MatTableDataSource(jsonData);
        this.processing = false;
      }, err => {
        this.appService.openSnackBar('server busy', '');
        this.processing = false;
      })
  }

  async fnCustomerGetForReport() {

    this.processing = true;
    this.dataBills = null;
    let ServiceParams = {};
    ServiceParams['strProc'] = 'AcccountHead_GetsForReport';

    var oProcParams = [];
    var ProcParams = {};
    ProcParams['strKey'] = 'Ac_Name';
    ProcParams['strArgmt'] = '';
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'Type';
    ProcParams['strArgmt'] = 'Customer';
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);

    await this.appService.post('CommonQuery/fnGetDataReport', body).toPromise()
      .then(data => {

        let jsonData = JSON.parse(data);
        this.dataBills = new MatTableDataSource(jsonData);
        this.processing = false;
      }, err => {
        this.appService.openSnackBar('server busy', '');
        this.processing = false;
      });
  }

  async fnProductsGetForReport() {
    this.processing = true;
    this.dataBills = null;
    let varArguements = { ItemDesc: '' ,BranchId:this.branchId };

    let DictionaryObject = {};
    DictionaryObject['dictArgmts'] = varArguements;
    DictionaryObject['ProcName'] = 'Product_GetsForReport';

    let body = JSON.stringify(DictionaryObject);

    await this.appService.post('Master/fnProductsGetForReport', body).subscribe(data => {
        let jsonData = JSON.parse(data)
        this.dataBills = new MatTableDataSource(jsonData); 
               
        this.processing = false;
      }, err => {
        this.appService.openSnackBar('server busy', '');
        this.processing = false;
      });

  }

  companyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  dataFieldFilter(filterValue: string) {
    this.dataBills.filter = filterValue.trim().toLowerCase();
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
