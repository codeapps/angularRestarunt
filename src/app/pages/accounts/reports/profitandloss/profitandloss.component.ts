import { AppService } from 'src/app/app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profitandloss',
  templateUrl: './profitandloss.component.html',
  styleUrls: ['./profitandloss.component.scss']
})
export class ProfitandlossComponent implements OnInit {

  createFlag: boolean = true;
  fromDate = new Date();
  toDate = new Date();
  selected = 'Format1';
  datalist: any = [];
  strReportHeadName = 'Profit And Lose Report';
  dBranchId         = localStorage.getItem('SessionBranchId');
  strBranchName     = localStorage.getItem('SessionBranchName');


  constructor(public _appService: AppService) { }

  ngOnInit() {
  }

  fngetProfitAndLoss(){

    let ServiceParams = {};
    
    if (this.selected == 'Format1') {
      ServiceParams['strProc'] = 'ProfitAndLossAccount';
    } else {
      ServiceParams['strProc'] = 'ProfitAndLossStatementNew';
    }

    let oProcParams = [];

    let  ProcParams = {};
    ProcParams['strKey'] = 'FromDate';
    ProcParams['strArgmt'] = this.ConvertDateAll(this.fromDate);
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'ToDate';
    ProcParams['strArgmt'] = this.ConvertDateAll(this.toDate);
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.dBranchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams']  =  oProcParams;
    var dictArgmts= {strHeading:  this.strReportHeadName,strBranchName: this.strBranchName};
    var DictionaryObject = {};
        DictionaryObject['dictArgmts']    = dictArgmts;
        ServiceParams['DictionaryObject'] = DictionaryObject; 
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportNewAcc',body).subscribe(data=>{
      this.datalist = JSON.parse(data);
      this.createFlag = false;
    });
  }

  ConvertDateAll(format) {
    let date = ("0" + format.getDate()).slice(-2);
    let month = ("0" + (format.getMonth() + 1)).slice(-2);
    let year = format.getFullYear();
    const dateconvert = year + '-' + month + '-' + date;
    return dateconvert;
  }
  myPageChange() {
    this.createFlag = true;
    this.datalist = '';
  }
}
