import { Injectable } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Injectable({
  providedIn: 'root'
})
export class BranchserviceService {
  sessionBranchId = localStorage.getItem("SessionBranchId");
  constructor(public _appService:AppService) { }

  fnBranchGets(){
  return  this._appService.get('GetRepository/branchGetWithBranchId?branchId=' + this.sessionBranchId)
  }
}
