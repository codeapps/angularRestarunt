import { Component, OnInit, Renderer2, HostListener } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { AppService } from 'src/app/app.service';



@Component({
  selector: 'app-bank-reconcilation',
  templateUrl: './bank-reconcilation.component.html',
  styleUrls: ['./bank-reconcilation.component.scss']
})
export class BankReconcilationComponent implements OnInit {
  chequeDate = new Date();
  displayedColumns: string[] = ['select', 'AC_Name'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  listSelection = new SelectionModel<any>(true, []);
  branchId = localStorage.getItem('SessionBranchId');
  StaffId = localStorage.getItem("SessionStaffId");
  dTsupplies = 'Debitors';
  showList: boolean;
  jsonData = new MatTableDataSource<any>();
  bBankReconcilationList = false;
  datasourcebankReconcilzedList = new MatTableDataSource<any>();
  dataRepTemp: any;
  public strReportHeadName = "Passed Cheque List";
  dListVPrefixId = 3;
  FromDate = new Date();
  ToDate = new Date();
  pressed = false;
  currentResizeIndex: number;
  startX: number;
  startWidth: number;
  isResizingRight: boolean;
  resizableMousemove: () => void;
  resizableMouseup: () => void;
  className: any;
  rowindex: any;
  displayedColumnslist: string[];
  columnsToDisplaylist: string[];
  Header: string[];


  constructor(private appService: AppService, private renderer: Renderer2) { }

  ngOnInit() {
    this.fnGetBankNameFromAccountHead();
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  async fnGetBankNameFromAccountHead() {
    let ServiceParams = {};
    ServiceParams['strProc'] = "AccountHead_GetOnBank";

    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.branchId;
    oProcParams.push(ProcParams);
    ServiceParams['oProcParams'] = oProcParams;

    await this.appService.post('CommonQuery/fnGetDataReportNew', ServiceParams).toPromise()
      .then(data => {
        let jsonData = JSON.parse(data);
        this.dataSource = new MatTableDataSource(jsonData);
        setTimeout(() => {
          this.masterToggle();
        });

      }, err => { this.appService.openSnackBar('server loading 500', 'error') });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  fnCheckListShow() {

    let ChequeDate = this.ConvertDateAll(this.chequeDate)
    const bankListData = this.selection.selected;
    if (bankListData.length == 0) {
      this.appService.openSnackBar('Please Select Banks', 'warning')
      return
    }

    let BankIds = '';

    bankListData.forEach((bank, index) => {
      if (index == 0) {
        BankIds = `  and (AccountHead.Ac_Id = ${bank.AC_Id}`;
      } else {
        BankIds += ` or AccountHead.Ac_Id = ${bank.AC_Id}`;
      }
      ;
    });
    BankIds += ')';

    let VPrefixId = 0;
    if (this.dTsupplies == 'Debitors') {
      VPrefixId = 3;
    } else {
      VPrefixId = 4;
    }

    let ServiceParams = {};
    ServiceParams['strProc'] = "ChequeEntry_GetsForBankReconcilation";
    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "ChequeDate";
    ProcParams["strArgmt"] = ChequeDate;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.branchId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "BankIds";
    ProcParams["strArgmt"] = BankIds;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "Search";
    ProcParams["strArgmt"] = '';
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "VTypeSlNo";
    ProcParams["strArgmt"] = VPrefixId.toString();
    oProcParams.push(ProcParams);
    ServiceParams['oProcParams'] = oProcParams;

    this.appService.post('CommonQuery/fnGetDataReportNew', ServiceParams)
      .toPromise().then(data => {
        const today = new Date();
        let jsonData = JSON.parse(data);

        jsonData.map((data, index) => {
          data.count = index; data.CurDate = today;
          data.BankCharge = ''; data.HeadCharge = false;
          data.ChequeEntry_EnterDate = this.fnDateReverse(new Date(data.ChequeEntry_EnterDate))
          data.ChequeEntry_ChequeDate = this.fnDateReverse(new Date(data.ChequeEntry_ChequeDate))
        });

        this.jsonData = new MatTableDataSource(jsonData);

        this.showList = true
      }).catch((err) => { console.error(err); this.appService.openSnackBar('server loading 500', 'error') });

  }

  async fnSaveChequeEntry() {
    const backDataList = this.listSelection.selected;
    if (backDataList.length == 0) {
      this.appService.openSnackBar('Select Cheque 500', 'warnning');
      return
    }
    let ListChequeEntryInfo = [];

    backDataList.forEach(data => {
      let ChequeEntry_TransDate = this.ConvertDateAll(data.CurDate);


      let strPostBankChgToHead = "No";
      if (data.HeadCharge)
        strPostBankChgToHead = "Yes";

      let ChequeEntryInfo = {}
      ChequeEntryInfo["ChequeEntry_ChequeNo"] = data.ChequeEntry_ChequeNo;
      ChequeEntryInfo["ChequeEntry_ChequeDate"] = data.ChequeEntry_ChequeDate.split('/').reverse().join('-');
      ChequeEntryInfo["ChequeEntry_BankName"] = data.ChequeEntry_BankName;
      ChequeEntryInfo["ChequeEntry_NarrationName1"] = data.ChequeEntry_NarrationName1;
      ChequeEntryInfo["ChequeEntry_NarrationName2"] = data.ChequeEntry_NarrationName2; //
      ChequeEntryInfo["ChequeEntry_Amt"] = data.ChequeEntry_Amt;
      ChequeEntryInfo["ChequeEntry_TransDate"] = ChequeEntry_TransDate;
      ChequeEntryInfo["VPrifix_Id"] = data.VPrifix_Id;
      ChequeEntryInfo["Voucher_VoucherNo"] = data.Voucher_VoucherNo;
      ChequeEntryInfo["ChequeEntry_EnterDate"] = data.ChequeEntry_EnterDate.split('/').reverse().join('-');
      ChequeEntryInfo["ChequeEntry_Id"] = data.ChequeEntry_Id;
      ChequeEntryInfo["AC_Id"] = data.AC_Id;
      ChequeEntryInfo["Rec_Id"] = data.Rec_Id;
      ChequeEntryInfo["StaffId"] = this.StaffId;
      ChequeEntryInfo["BranchId"] = this.branchId;
      ChequeEntryInfo["BankCharge"] = data.BankCharge;
      ChequeEntryInfo["UniqueVoucherId"] = data.UniqueVoucherId;
      ChequeEntryInfo["PostBankChgToHead"] = strPostBankChgToHead;
      ListChequeEntryInfo.push(ChequeEntryInfo)
    });
    if (!confirm("Are you sure you want to Save Bank Reconcilation ?")) {
      return
    }

    await this.appService.post('Accounts/fnSaveChequeEntry', ListChequeEntryInfo).toPromise()
      .then(data => {
        this.appService.openSnackBar(data, 'Saved Successfully');
        this.fnCheckListShow();
        this.listSelection.clear();
      }, err => { this.appService.openSnackBar('server loading 500', 'error') });
  }
  fnBack() {
    this.jsonData = null;
    this.showList = false;
  }

  async fnSaveChequeBounce() {
    const backDataList = this.listSelection.selected;
    if (backDataList.length == 0) {
      this.appService.openSnackBar('Select Cheque', 'warnning');
      return
    }
    let ListChequeEntryInfo = [];
    backDataList.forEach(data => {
      let ChequeEntry_TransDate = this.ConvertDateAll(data.CurDate);

      let strPostBankChgToHead = "No";
      if (data.HeadCharge)
        strPostBankChgToHead = "Yes";

      let ChequeEntryInfo = {}
      ChequeEntryInfo["ChequeEntry_ChequeNo"] = data.ChequeEntry_ChequeNo;
      ChequeEntryInfo["ChequeEntry_ChequeDate"] = data.ChequeEntry_ChequeDate.split('/').reverse().join('-');
      ChequeEntryInfo["ChequeEntry_BankName"] = data.ChequeEntry_BankName;
      ChequeEntryInfo["ChequeEntry_NarrationName1"] = data.ChequeEntry_NarrationName1;
      ChequeEntryInfo["ChequeEntry_NarrationName2"] = data.ChequeEntry_NarrationName2; //
      ChequeEntryInfo["ChequeEntry_Amt"] = data.ChequeEntry_Amt;
      ChequeEntryInfo["ChequeEntry_TransDate"] = ChequeEntry_TransDate;
      ChequeEntryInfo["VPrifix_Id"] = data.VPrifix_Id;
      ChequeEntryInfo["Voucher_VoucherNo"] = data.Voucher_VoucherNo;
      ChequeEntryInfo["ChequeEntry_EnterDate"] = data.ChequeEntry_EnterDate.split('/').reverse().join('-');
      ChequeEntryInfo["ChequeEntry_Id"] = data.ChequeEntry_Id;
      ChequeEntryInfo["AC_Id"] = data.AC_Id;
      ChequeEntryInfo["Rec_Id"] = data.Rec_Id;
      ChequeEntryInfo["StaffId"] = this.StaffId;
      ChequeEntryInfo["BranchId"] = this.branchId;
      ChequeEntryInfo["BankCharge"] = data.BankCharge;
      ChequeEntryInfo["UniqueVoucherId"] = data.UniqueVoucherId;
      ChequeEntryInfo["PostBankChgToHead"] = strPostBankChgToHead;
      if (data.VPrifix_Id != 5) {
        ListChequeEntryInfo.push(ChequeEntryInfo);
      }
    });
    if (!confirm("Are you sure you want to Bounce Cheque ?")) {
      return
    }
    await this.appService.post('Accounts/fnSaveChequeBounce', ListChequeEntryInfo).toPromise()
      .then(data => {
        this.appService.openSnackBar(data, 'Saved Successfully');
        this.listSelection.clear();
        this.fnCheckListShow();
      }, err => this.appService.openSnackBar('server loading 500', 'error'));

  }

  fnrowFocus(index) {
    this.rowindex = index
  }

  @HostListener('window:keydown', ['$event'])
  onkeyEvent(event: KeyboardEvent) {
    
    let row = event.target['offsetParent'];
    
    if (row == null || row.localName != 'td') {
      return
    }
    let indexTd = row.cellIndex;
    
    if (event.which == 40) {
      let nextElement = row.parentElement.nextElementSibling;
      if (nextElement !=null) {
        setTimeout(() => {
          row.parentElement.nextElementSibling.children[indexTd].children[0].focus();
        });
        
      }
     
    }

    if (event.which == 38) {
      let previousElement = row.parentElement.previousElementSibling;
      if (previousElement !=null) {
        setTimeout(() => {
          row.parentElement.previousElementSibling.children[indexTd].children[0].focus();
        });
        
      }
     
    }
  }

  fnSearchTable(keyword) {
    this.jsonData.filter = keyword.trim().toLowerCase();
  }

  onResizeColumn(event: any, index: number) {
    // this.checkResizing(event, index);
    let className = event.target.classList.value;
    this.currentResizeIndex = index;
    this.pressed = true;
    this.startX = event.pageX;
    this.startWidth = event.target.clientWidth;
    this.isResizingRight = true;
    this.className = className;
    event.preventDefault();
    this.mouseMove(index);
  }

  mouseMove(index: number) {
    let nativeEle: any =  document.getElementsByClassName(this.className);
   
    this.resizableMousemove = this.renderer.listen('document', 'mousemove', (event) => {
      if (this.pressed && event.buttons) {
        const dx = (this.isResizingRight) ? (event.pageX - this.startX) : (-event.pageX + this.startX);
        const width = this.startWidth + dx;
        if (this.currentResizeIndex === index && width > 50) {
         
          for (let i = 0; i < nativeEle.length; i++) {
            const e = nativeEle[i];
            if (e instanceof HTMLElement) {
               e.style.minWidth = `${width}px`;
               e.style.maxWidth = `${width}px`;
                
            }
          }
        }
      }
    });

    this.resizableMouseup = this.renderer.listen('document', 'mouseup', (event) => {
      if (this.pressed) {
        this.pressed = false;
        this.currentResizeIndex = -1;
        this.resizableMousemove();
        this.resizableMouseup();
      }
    });    
  }

  fntotalAmount() {
    if(this.jsonData.data.length>0) {
           return this.jsonData.data.map(data => data.ChequeEntry_Amt).reduce((cur, val) => parseFloat(cur) + parseFloat(val))
    }
    return 0.00;
  }

  async fnBankReconcilizedList() { 
  
    
    let dtFromDate = this.ConvertDateAll(this.FromDate);
    let dtToDate = this.ConvertDateAll(this.ToDate);

    var ServiceParams = {};   
    ServiceParams['strProc']      = 'ChequePassedList';  
    ServiceParams['JsonFileName'] = 'JsonArrayScriptOne';    

    var oProcParams = [];
    var ProcParams = {};  
    
    ProcParams = {};
    ProcParams['strKey']   = '@ParamsFromDate';
    ProcParams['strArgmt'] = dtFromDate;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey']   = '@ParamsToDate';
    ProcParams['strArgmt'] = dtToDate;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey']   = '@ParamsBranchId';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey']   = '@ParamsVTypeSlNo';
    ProcParams['strArgmt'] = this.dListVPrefixId.toString();
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    var headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8');
    await this.appService.post('CommonQuery/fnGetDataReportFromScriptJsonFile', body).toPromise()
    .then(data => {
     
      var columnSet = [];
      let jsonData = JSON.parse(data.JsonDetails[0]);
      // this.fnHeaderColoumn(jsonData,columnSet);
      this.dataRepTemp=jsonData;
      this.datasourcebankReconcilzedList = new MatTableDataSource(jsonData);
      this.displayedColumnslist = this.Header;
      this.columnsToDisplaylist = this.displayedColumns.slice();      
      
    }, error => console.error(error));
  
  }

  fnChange(event){
    this.dListVPrefixId = parseFloat(event.target.value||0);
  }

  applyFilterBankReconcilationList(filterValue: string) {
    this.datasourcebankReconcilzedList.filter = filterValue.trim().toLowerCase();
  }

  ConvertDateAll(format) {
    let date = ("0" + format.getDate()).slice(-2);
    let month = ("0" + (format.getMonth() + 1)).slice(-2);
    let year = format.getFullYear();
    const dateconvert = year + '-' + month + '-' + date;
    return dateconvert;
  }
  fnDateReverse(format) {
    let date = ("0" + format.getDate()).slice(-2);
    let month = ("0" + (format.getMonth() + 1)).slice(-2);
    let year = format.getFullYear();
    const dateconvert = year + '-' + month + '-' + date;
    return dateconvert.split('-').reverse().join('/');
  }
}
