import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-stock-reports',
  templateUrl: './stock-reports.component.html',
  styleUrls: ['./stock-reports.component.scss']
})
export class StockReportsComponent implements OnInit {
  strReportHeadName = 'Stock Report';
  datalist: any = [];
  dBranchId = localStorage.getItem('SessionBranchId');

  constructor(public _appService: AppService) { }

  ngOnInit() {
    this.getReport();
  }

  getReport() {
    var ServiceParams = {};
    ServiceParams['strProc'] = 'getStockReport';

    var ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.dBranchId;
    var oProcParams = [];
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      this.datalist = JSON.parse(data);  
    })
  }
ngOnChanges(){ 

}
  myPageChange() {
  }
}
