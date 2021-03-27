import { Injectable } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Injectable({
  providedIn: 'root'
})
export class AddtableService {
  dBranchId = localStorage.getItem('SessionBranchId');
  constructor(private _appService: AppService) { }

  public fnTableGetsAll(searchText,) {
    return this._appService.get('GetRepository/GetTable?table=' + searchText + '&branchId=' + this.dBranchId)
  }
}
