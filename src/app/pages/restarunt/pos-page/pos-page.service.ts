import { Injectable } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PosPageService {
  dBranchId = localStorage.getItem('SessionBranchId');

  constructor(private appservice: AppService) { }


  _salesman_Get(salesman) {
    if (!salesman) {
      return of();
    }
    let ServiceParams = {};
    ServiceParams['strProc'] = 'Salesman_Gets';

    let oProcParams = [];


    let ProcParams = {};
    ProcParams['strKey'] = 'strSearch';
    ProcParams['strArgmt'] = salesman.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.dBranchId.toString();
    oProcParams.push(ProcParams);


    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    return this.appservice.post('CommonQuery/fnGetDataReportNew', body)
  }


  _product_Get(term, code) {
    if (!term) {
      return of();
    }
    let orderBy = 'order by ProductName'
    if (code) {      
      orderBy = 'order by ItemCode'
    }
    let ServiceParams = {};
    ServiceParams['strProc'] = 'getProductWithoutBranchId';
    ServiceParams['JsonFileName'] = 'JsonArrayScriptOne';
    let oProcParams = [];
    let ProcParams = {};

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsstrSearch';
    ProcParams['strArgmt'] = term;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsBranchId';
    ProcParams['strArgmt'] = this.dBranchId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsOrderBy';
    ProcParams['strArgmt'] = orderBy;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    return this.appservice.post('CommonQuery/fnGetDataReportFromScriptJsonFile', body)
  }


 
 
  fnKotBillGetOnTableDetailId(TableDetailId) {


    let ServiceParams = {};
    ServiceParams['strProc'] = 'Kot_GetOnTempInvoiceNo';

    let oProcParams = [];
    let ProcParams = {};
    ProcParams['strKey'] = 'TableDetails_Id';
    ProcParams['strArgmt'] = TableDetailId.toString();
    oProcParams.push(ProcParams);
    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    var headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8');
    return this.appservice.post('CommonQuery/fnGetDataReportNew', body);
  }

  public getRooms() {
    return this.appservice.get('GetRepository/getRooms?terms&branchId=' + this.dBranchId)
  }

  public getTables() {
    return this.appservice.get('GetRepository/GetTable?table&branchId=' + this.dBranchId)
  }

  getCategory() {
    return this.appservice.get('GetRepository/SearchCategory?terms');
  };

  fnGetAllTableDetails() {
    return this.appservice.get('GetRepository/GetTableDetails?table=' + '' + '&branchId=' + this.dBranchId)
  }

  fnAllSalesManGetsAll() {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'Salesman_Gets';

    let oProcParams = [];
    let ProcParams = {};
    ProcParams['strKey'] = 'strSearch';
    ProcParams['strArgmt'] = '';
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.dBranchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
   
   return this.appservice.post('CommonQuery/fnGetDataReportNew', body)
  }

  fnSettings() {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'Setting_GetValues';
    let body = JSON.stringify(ServiceParams);

    return this.appservice.post('CommonQuery/fnGetDataReportNew', body);
    
  }

  fnkotBill(KotId, type) {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'Kot_BillCopyNo';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'Kot_Id';
    ProcParams['strArgmt'] = KotId.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'Kot_OrderFrom';
    ProcParams['strArgmt'] = type.toString();
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    return this.appservice.post('CommonQuery/fnGetDataReportReturnMultiTable', body);
  }

  IssuesPrint(BillSerId, BillNo, UniqueNo, type) {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'Issues_CopyBillNoProductGroupwise';

    let oProcParams = [];


    let ProcParams = {};
    ProcParams['strKey'] = 'BillSerId';
    ProcParams['strArgmt'] = BillSerId.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'Issues_BillNo';
    ProcParams['strArgmt'] = BillNo.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'Unique_No';
    ProcParams['strArgmt'] = UniqueNo.toString();
    oProcParams.push(ProcParams);


    ProcParams = {};
    ProcParams['strKey'] = 'Issues_OrderFrom';
    ProcParams['strArgmt'] = type.toString();
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);
   return this.appservice.post('CommonQuery/fnGetDataReportReturnMultiTable', body)
  }
}
