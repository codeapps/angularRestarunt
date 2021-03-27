import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-printout',
  templateUrl: './printout.component.html',
  styleUrls: ['./printout.component.scss']
})
export class PrintoutComponent implements OnInit {
  JsonIssueSubDetailsInfo: any = [];
  JsonIssueTaxInfo: any = [];
  JsonBranchInfo: any = [];
  JsonIssueInfo: any = [];

  constructor(private appservice: AppService) { }

  ngOnInit(): void {
 
    const BillNo =  localStorage.getItem("BillNo");
    const BillSerId =  localStorage.getItem("BillSerId");
    const UniqueBillNo =  localStorage.getItem("UniqueBillNo");
    const Issues_OrderFrom =  localStorage.getItem("Issues_OrderFrom");
    this.fnBillPrint(BillSerId, BillNo, UniqueBillNo, Issues_OrderFrom);
  }

  fnBillPrint(BillSerId, BillNo, UniqueBillNo, Issues_OrderFrom) {
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
    ProcParams['strArgmt'] = UniqueBillNo.toString();
    oProcParams.push(ProcParams);
  
    ProcParams = {};
    ProcParams['strKey'] = 'Issues_OrderFrom';
    ProcParams['strArgmt'] = Issues_OrderFrom.toString();
    oProcParams.push(ProcParams);
  
    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    this.appservice.post('CommonQuery/fnGetDataReportReturnMultiTable', body)
    .subscribe(data => {
     
      let jsonobj = JSON.parse(data);
      this.JsonIssueSubDetailsInfo = JSON.parse(jsonobj[1]);
      this.JsonIssueTaxInfo =JSON.parse(jsonobj[2]);
      this.JsonBranchInfo = JSON.parse(jsonobj[3])[0];
      this.JsonIssueInfo = JSON.parse(jsonobj[0])[0];
    })
  }

  fnNumberWords() {
    let ServiceParams = {};
     ServiceParams['strProc'] = 'fnNumToWords_GetValue';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'Value';
    ProcParams['strArgmt'] = parseFloat(this.JsonIssueInfo.Issues_Total);
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams)
    this.appservice.post('CommonQuery/fnGetDataReportNew', body)
    .subscribe(res => {

    })

  }
}
