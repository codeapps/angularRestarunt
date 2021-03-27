import { Injectable } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  dBranchId: any = localStorage.getItem("SessionBranchId");
  constructor(public _appService:AppService) { }

  public getProductWithoutBranchId(searchText){
   return this._appService.get('GetRepository/GetProductListWithoutBranchId?terms=' + searchText)
  }
  public getProduct(searchText){
  return  this._appService.get('GetRepository/GetProductList?terms=' + searchText + '&branchId=' + this.dBranchId)
  }
}
