import { PosPageService } from './../pos-page/pos-page.service';
import { Component, OnInit, Inject } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { DatePipe } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bill-list',
  templateUrl: './bill-list.component.html',
  styleUrls: ['./bill-list.component.scss']
})
export class BillListComponent implements OnInit {
  pFromDate = new Date();
  pToDate = new Date();
  billserice: any = [];
  billSource: any = [];
  strBillSerId = '0';
  loading: boolean = false;

  dBranchId = localStorage.getItem("SessionBranchId");
  strKotPrintType: any;
  constructor(private appService: AppService, private datepipe: DatePipe, public dialog: MatDialog, public posservice: PosPageService) { }

  ngOnInit(): void {
    this.pFromDate.setDate(1);
    this.getBillSerice();
    setTimeout(() => {
      this.onfnSettings();
    }, 200);
  }

  onfnSettings() {
    this.posservice.fnSettings()
      .toPromise()
      .then(x => {
        const settings = JSON.parse(x);
        for (const setting of settings) {
          if (setting.KeyValue == 'KotPrintType') {
            this.strKotPrintType = setting.Value;
          }
        }
      }).finally(() => {
        this.getBillSerice();
      })
  }

  getBillSerice() {
    this.appService.get('GetRepository/GetBillSerice')
      .subscribe(result => {
        this.billserice = result;
        this.strBillSerId = this.billserice[0].BillSerId;
        this.getIssues("");
      }, error => console.error(error));
  }


  getIssues(val) {
    this.loading = true;
    const bookFromDate = this.datepipe.transform(this.pFromDate, 'yyyy-MM-dd');
    const bookToDateDate = this.datepipe.transform(this.pToDate, 'yyyy-MM-dd');
    let ServiceParams = {};
    ServiceParams['strProc'] = 'IssuesGetOn_Search';

    let oProcParams = [];

    let ProcParams = {};

    ProcParams['strKey'] = 'Fromdate';
    ProcParams['strArgmt'] = bookFromDate;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'ToDate';
    ProcParams['strArgmt'] = bookToDateDate;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.dBranchId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'search';
    ProcParams['strArgmt'] = val;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BillSerId';
    ProcParams['strArgmt'] = this.strBillSerId.toString();
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this.appService.post('CommonQuery/fnGetDataReportNew', body)
      .subscribe(data => {
        this.billSource = JSON.parse(data);
        this.loading = false;

      }, err => {
        this.loading = false;
      })
  }



  fnCancel(data) {
    if (!confirm("Do Yoy Want To Delete ?..")) {
      return
    }
    const BillSerId = data.BillSerId;
    const BillNo = data.Issues_BillNo;
    const UniqueBillNo = data.Unique_No;

    let ServiceParams = {};
    ServiceParams['strProc'] = 'Issues_Cancel';

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
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.dBranchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);

    this.appService.post('CommonQuery/fnGetDataReportReturnMultiTable', body)
      .subscribe(result => {
        this.appService.openSnackBar("Deleted Successfully", "Successfully");
        this.getIssues("");
      })
  }

  fnPrint(data) {
    const BillSerId = data.BillSerId;
    let ServiceParams = {};
    ServiceParams['strProc'] = 'BillSeries_Get';

    let oProcParams = [];


    let ProcParams = {};
    ProcParams['strKey'] = 'BillSerId';
    ProcParams['strArgmt'] = BillSerId.toString();
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);

    this.appService.post('CommonQuery/fnGetDataReportNew', body)
      .subscribe(result => {
        this.fnPrintData(data);
      })
  }
  fnPrintData(values) {
    if (this.strKotPrintType == 'LinePrint' || this.strKotPrintType == 'Thermal') {
      this.posservice.IssuesPrint(values.BillSerId, values.Issues_BillNo, values.Unique_No, 'Table')
        .subscribe(x => {
          let dataReport = JSON.parse(x);
          const JsonIssueSubDetailsInfo = (dataReport[1]);
          const JsonIssueTaxInfo = (dataReport[2]);
          const JsonBranchInfo = (dataReport[3]);
          const JsonIssueInfo = (dataReport[0]);
          this.saveTextAsFile(JsonIssueInfo, JsonIssueSubDetailsInfo, JsonIssueTaxInfo, JsonBranchInfo);
        })
    } else {
      localStorage.setItem('BillSerId', values.BillSerId);
      localStorage.setItem('BillNo', values.Issues_BillNo);
      localStorage.setItem('UniqueBillNo', values.Unique_No);
      localStorage.setItem('Issues_OrderFrom', 'Table');

      window.open('#/print/printout');
    }
  }
  saveTextAsFile(main, sub, tax, branch) {
    //you can enter your own file name and extension
    let BillObj = main + '&&@@a&&@' + sub + '&&@@a&&@' + tax + '&&@@a&&@' + branch;
    this.writeContents(BillObj, 'codeappslineprint' + '.txt', 'text/csv');
  }
  writeContents(content, fileName, contentType) {
    var a = document.createElement('a');
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  openDialog(eve): void {
    const dialogRef = this.dialog.open(DialogBillList, {
      // width: '250px',
      data: { source: eve }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
}

@Component({
  selector: 'dialog-bill-list',
  templateUrl: 'dialog-bill-list.html',
  styleUrls: ['./bill-list.component.scss']
})
export class DialogBillList {
  billSubList: any = [];
  billMainList: any = {};
  constructor(public dialogRef: MatDialogRef<DialogBillList>,
    @Inject(MAT_DIALOG_DATA) public data: any, private appService: AppService, private router: Router) {
    this.fnEditBill(data.source)

  }

  fnEditBill(data) {

    const BillSerId = data.BillSerId;
    const BillNo = data.Issues_BillNo;
    const UniqueBillNo = data.Unique_No;
    const Issues_OrderFrom = data.Issues_OrderFrom;

    let ServiceParams = {};
    ServiceParams['strProc'] = 'Issues_CopyBillNo';

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

    this.appService.post('CommonQuery/fnGetDataReportReturnMultiTable', body)
      .subscribe(result => {
        const billRport = JSON.parse(result)
        const JsonIssueSubDetailsInfo = (JSON.parse(billRport[1]));
        const JsonIssueInfo = (JSON.parse(billRport[0]));
        this.billSubList = JsonIssueSubDetailsInfo;
        this.billMainList = JsonIssueInfo[0];
      })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  fnAssign() {
    let uniqueId = this.billSubList[0].UniqueNo;
    let BillNo = this.billSubList[0].IssuesSub_BillNo;
    let billSerId = this.billSubList[0].BillSerId;
    this.router.navigate(['/restarunt/pos'], { queryParams: { billno: BillNo, uniqueId: uniqueId, billSerId: billSerId } });
    this.dialogRef.close();
  }
}
