import { Injectable } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  branchId = <any>localStorage.getItem('SessionBranchId');
  constructor(private appService: AppService) { }

  productSearch(keyword) {
    let ServiceParams = {};
    ServiceParams['strProc'] = "Product_SearchPurchase";

    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "strItemDesc";
    ProcParams["strArgmt"] = keyword;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.branchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    return  this.appService.post('CommonQuery/fnGetDataReportNew', ServiceParams)
  }

  productCodeSearch(keyword) {
    var dictArgmts = { dictArgmts: keyword, BranchId: this.branchId };
    var DictionaryObject = {};
    DictionaryObject["dictArgmts"] = dictArgmts;
    DictionaryObject["ProcName"] = 'Product_SearchPurchaseOnItemCode';
    return this.appService.post('/Purchase/Product_SearchPurchaseItemCode', DictionaryObject)
  }
}
