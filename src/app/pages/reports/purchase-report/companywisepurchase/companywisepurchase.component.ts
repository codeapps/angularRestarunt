import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-companywisepurchase',
  templateUrl: './companywisepurchase.component.html',
  styleUrls: ['./companywisepurchase.component.scss']
})
export class CompanywisepurchaseComponent implements OnInit {
  showReport = false;
  fromDate = new Date();
  toDate = new Date();
  selectbills = 'Companywise';
  tabBills = ['Companywise', 'Company-Product', 'Company-Supplier', 'Summary', 'Free Purchase Report'];
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
  
  constructor(private appService: AppService) { }

  ngOnInit(){
    this.fromDate.setDate(1);
    this.fnManufactureGetForReport();
  }

  async fnManufactureGetForReport() {
    this.processing = true;
    let varArguements = {};
    varArguements = { Manufacture_Name: '' };

    let DictionaryObject = {};
    DictionaryObject['dictArgmts'] = varArguements;
    DictionaryObject['ProcName'] = 'Manufacture_Gets';

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

  fnSubmit() {
  
    switch (this.selectedTab) {
      case 0:
        this.fnCompanywisePurchase();
        break;
      case 1:
        this.fnCompanywiseProductwisePurchase();
        break;
      case 2:
        this.fnCompanywiseSupplierwisePurchase();
        break;
      case 3:
        this.fnCompanywisePurchaseSummary();
        break;
      case 4:
        this.fnCompanywisePurchaseFreeStmt();
        break;
      default:
        break;
    }
  }

  async fnCompanywisePurchase() {
    let Book_FromDate = this.ConvertDateAll(this.fromDate);
    let Book_ToDate = this.ConvertDateAll(this.toDate);
    this.strReportHeadName= 'Companywise Purchase Report From '+this.fnDateReverse(this.fromDate)+' To '+this.fnDateReverse(this.toDate);

    const billData = this.selection.selected;
    if (billData.length == 0) {
      this.appService.openSnackBar('Choose Company', 'warning');
      return;
    }
    let ComIds = '';
    let chkAll1 = false
    if (billData.length == this.dataSource.data.length) {
      chkAll1 = true;
    } else {
      billData.forEach((data, index) => {
          if (index == 0) {
            ComIds = `  and ( Manufacture.Manufacture_Id=  ${data.Manufacture_Id}`;
          } else {
            ComIds += ` or Manufacture.Manufacture_Id=  ${data.Manufacture_Id}`;
          }
      });
      ComIds += ' )';
    }
    this.loading = true;
    let ServiceParams = {};
    ServiceParams['strProc'] = 'CompanywisePurchaseDetailed';

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
    ProcParams['strKey'] = 'Manufacture_Ids';
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
      this.dataRep =  jsonData;
      this.loading = false;
      this.showReport = true;
    }, err => {
      this.appService.openSnackBar('sorry server busy', '');
      this.loading = false;
    });
  }

  async fnCompanywiseProductwisePurchase() {
    let Book_FromDate = this.ConvertDateAll(this.fromDate);
    let Book_ToDate = this.ConvertDateAll(this.toDate);
    this.strReportHeadName= 'Companywise Productwise Purchase Report From '+this.fnDateReverse(this.fromDate)+' To '+this.fnDateReverse(this.toDate);
    const billData = this.selection.selected;
    
    if (billData.length == 0) {
      this.appService.openSnackBar('Choose Company', 'warning');
      return;
    }
    let ComIds = '';
    let chkAll1 = false
    if (billData.length == this.dataSource.data.length) {
      chkAll1 = true;
    } else {
      billData.forEach((data, index) => {
          if (index == 0) {
            ComIds = `  and ( Manufacture.Manufacture_Id=  ${data.Manufacture_Id}`;
          } else {
            ComIds += ` or Manufacture.Manufacture_Id=  ${data.Manufacture_Id}`;
          }
      });
      ComIds += ' )';
    }

    const ProductData = this.Billselection.selected;  
    
    if (ProductData.length == 0) {
      this.appService.openSnackBar('Choose Product', 'warning');
      return;
    }
    let ProdIds = '';
      chkAll1 = false
    if (ProductData.length == this.dataBills.data.length) {
      chkAll1 = true;
    } else {
      ProductData.forEach((data, index) => {
          if (index == 0) {
            ProdIds = `  and ( Products.ProductId=  ${data.ProductId}`;
          } else {
            ProdIds += ` or Products.ProductId=  ${data.ProductId}`;
          }
      });
      ProdIds += ' )';
    }
    
    this.loading = true;

    let ServiceParams = {};
    ServiceParams['strProc'] = 'CompanywiseProductwisePurchaseDetailed';
  
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
    ProcParams['strKey'] = 'Manufacture_Ids';
    ProcParams['strArgmt'] = ComIds;
    oProcParams.push(ProcParams);
  
    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);
  
    ProcParams = {};
    ProcParams['strKey'] = 'ProductIds';
    ProcParams['strArgmt'] = ProdIds;
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

  async fnCompanywiseSupplierwisePurchase() {
    let Book_FromDate = this.ConvertDateAll(this.fromDate);
    let Book_ToDate = this.ConvertDateAll(this.toDate);
    this.strReportHeadName= 'Companywise Supplierwise Purchase Report From '+this.fnDateReverse(this.fromDate)+' To '+this.fnDateReverse(this.toDate);
    const billData = this.selection.selected;
    if (billData.length == 0) {
      this.appService.openSnackBar('Choose Company', 'warning');
      return;
    }
    let ComIds = '';
    let chkAll1 = false
    if (billData.length == this.dataSource.data.length) {
      chkAll1 = true;
    } else {
      billData.forEach((data, index) => {
          if (index == 0) {
            ComIds = `  and ( Manufacture.Manufacture_Id=  ${data.Manufacture_Id}`;
          } else {
            ComIds += ` or Manufacture.Manufacture_Id=  ${data.Manufacture_Id}`;
          }
      });
      ComIds += ' )';
    }
    const ProductData = this.Billselection.selected;
    if (ProductData.length == 0) {
      this.appService.openSnackBar('Choose Supplier', 'warning');
      return;
    }
    let AcIds = '';
      chkAll1 = false
    if (ProductData.length == this.dataBills.data.length) {
      chkAll1 = true;
    } else {
      ProductData.forEach((data, index) => {
          if (index == 0) {
            AcIds = `  and ( AccountHead.Ac_Id=  ${data.AC_Id}`;
          } else {
            AcIds += ` or AccountHead.Ac_Id=  ${data.AC_Id}`;
          }
      });
      AcIds += ' )';
    }
    
    this.loading = true;
    let ServiceParams = {};
    ServiceParams['strProc'] = 'CompanywiseSupplierPurchaseDetailed';

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
    ProcParams['strKey'] = 'Manufacture_Ids';
    ProcParams['strArgmt'] = ComIds;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'AcIds';
    ProcParams['strArgmt'] = AcIds;
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

  async fnCompanywisePurchaseSummary() {
    let Book_FromDate = this.ConvertDateAll(this.fromDate);
    let Book_ToDate = this.ConvertDateAll(this.toDate);
    this.strReportHeadName= 'Companywise Purchase Summary  Report From '+this.fnDateReverse(this.fromDate)+' To '+this.fnDateReverse(this.toDate);
    const billData = this.selection.selected;
    if (billData.length == 0) {
      this.appService.openSnackBar('Choose Company', 'warning');
      return;
    }
    let ComIds = '';
    let chkAll1 = false
    if (billData.length == this.dataSource.data.length) {
      chkAll1 = true;
    } else {
      billData.forEach((data, index) => {
          if (index == 0) {
            ComIds = `  and ( Manufacture.Manufacture_Id=  ${data.Manufacture_Id}`;
          } else {
            ComIds += ` or Manufacture.Manufacture_Id=  ${data.Manufacture_Id}`;
          }
      });
      ComIds += ' )';
    }
    this.loading = true;
    var ServiceParams = {};
    ServiceParams['strProc'] = 'Receipt_CompanywisePurchaseConsole';

    var oProcParams = [];
    var ProcParams = {};

    ProcParams['strKey'] = 'FromDate';
    ProcParams['strArgmt'] = Book_FromDate;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'ToDate';
    ProcParams['strArgmt'] = Book_ToDate;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'ComIds';
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
        this.dataRep =  jsonData;
        this.loading = false;
        this.showReport = true;
      }, err => {
        this.appService.openSnackBar('sorry server busy', '');
        this.loading = false;
      });
  }

  async fnCompanywisePurchaseFreeStmt() {
    let Book_FromDate = this.ConvertDateAll(this.fromDate);
    let Book_ToDate = this.ConvertDateAll(this.toDate);
    this.strReportHeadName= 'Companywise Purchase Free Report From '+this.fnDateReverse(this.fromDate)+' To '+this.fnDateReverse(this.toDate);
    const billData = this.selection.selected;
    if (billData.length == 0) {
      this.appService.openSnackBar('Choose Company', 'warning');
      return;
    }
    let ComIds = '';
    let chkAll1 = false
    if (billData.length == this.dataSource.data.length) {
      chkAll1 = true;
    } else {
      billData.forEach((data, index) => {
          if (index == 0) {
            ComIds = `  and ( Manufacture.Manufacture_Id=  ${data.Manufacture_Id}`;
          } else {
            ComIds += ` or Manufacture.Manufacture_Id=  ${data.Manufacture_Id}`;
          }
      });
      ComIds += ' )';
    }
    this.loading = true;

    let ServiceParams = {};
    ServiceParams['strProc'] = 'Receipt_FreeQtyCompany';

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
    ProcParams['strKey'] = 'ComId';
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
        this.dataRep =  jsonData;
        this.loading = false;
        this.showReport = true;
      }, err => {
        this.appService.openSnackBar('sorry server busy', '');
        this.loading = false;
      });
  }

  fntabChange(eve) {
    this.Billselection.clear();
    this.selectedTab = eve;
    if (eve == 1) {
      this.ColumnsDynamic = ['ProductName', 'Product Name'];
      this.fnProductsGetForReport();
    } else if (eve == 2) {
      this.ColumnsDynamic = ['AC_Name', 'Customer Name'];
      this.fnCustomerGetForReport();
    }
  }

  async fnProductsGetForReport() {
    this.dataBills = null;
    this.processing = true;
    let varParams = {};
    varParams = { ItemDesc: '' ,BranchId:this.branchId};

    let DictionaryObject = {};
    DictionaryObject['dictArgmts'] = varParams;
    DictionaryObject['ProcName'] = 'Product_GetsForReport';


    let body = JSON.stringify(DictionaryObject);
    await this.appService.post('Master/fnProductsGetForReport', body).toPromise()
      .then(data => {
        const jsonData = JSON.parse(data);
        // ProductId
        this.dataBills = new MatTableDataSource(jsonData);
        this.processing = false;
      }, err => {
        this.appService.openSnackBar('server busy', '');
        this.processing = false;
      })
  }

  async fnCustomerGetForReport() {
    this.dataBills = null;
    this.processing = true;
    let ServiceParams = {};
    ServiceParams['strProc'] = 'AcccountHead_GetsForReport';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'Ac_Name';
    ProcParams['strArgmt'] = '';
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'Type';
    ProcParams['strArgmt'] = 'Supplier';
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    await this.appService.post('CommonQuery/fnGetDataReport', body).toPromise()
      .then(data => {
        const jsonData = JSON.parse(data);
        // AC_Id
        this.dataBills = new MatTableDataSource(jsonData);
        this.processing = false;
      }, err => {
        this.appService.openSnackBar('server busy', '');
        this.processing = false;
      })
  }

  dataFieldFilter(filterValue: string) {
    this.dataBills.filter = filterValue.trim().toLowerCase();
  }
 myPageChange(eve) {
    this.showReport = false
  }
  companyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
