import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-rolstock',
  templateUrl: './rolstock.component.html',
  styleUrls: ['./rolstock.component.scss']
})
export class RolstockComponent implements OnInit {
  branchId = localStorage.getItem('SessionBranchId');
  staffId = localStorage.getItem('SessionStaffId');
  strReportHeadName: string = 'Reorder Level Stock';
  dataRep = [];
  wait = true;

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.fnRolProductList();
  }
  fnRolProductList() {
    
    let ServiceParams = {};
    ServiceParams['strProc'] = 'Product_ReorderLevelStock';
    ServiceParams['JsonFileName'] = 'JsonArrayScriptTwo';
    let oProcParams = [];


    let ProcParams = {};
    ProcParams['strKey'] = '@ParamsBranchId';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);
    ServiceParams['oProcParams'] = oProcParams;
    
    let body = JSON.stringify(ServiceParams);
    this.appService.post('CommonQuery/fnGetDataReportFromScriptJsonFile', body).toPromise()
    .then(data => {
      let jsonData = JSON.parse(data.JsonDetails[0]);
        this.dataRep = jsonData;
        this.wait = false;
      }, err => {
        console.error(err);
      });
  }
  myPageChange(){
    
  }
}
