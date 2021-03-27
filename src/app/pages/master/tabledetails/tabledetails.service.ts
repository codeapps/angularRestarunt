import { Injectable } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Injectable({
  providedIn: 'root'
})
export class TabledetailsService {
  dBranchId = localStorage.getItem("SessionBranchId")
  constructor(public _appService:AppService) { }

   public fngetTableDetails(tableId){
   return this._appService.get('GetRepository/TableDetailsGet?tableId=' + tableId)
  }
}
