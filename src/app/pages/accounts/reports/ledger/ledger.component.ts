import { AppService } from './../../../../app.service';
import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef, ViewChild, Renderer2, HostListener, Inject } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Query } from '@syncfusion/ej2-data';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', display: 'none' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class LedgerComponent implements OnInit, AfterViewInit {

  nPageSearchCnt = 0;
  keyword = 'AC_Name';
  @ViewChild(MatPaginator, { read: '', static: false }) paginator: MatPaginator;
  @ViewChild('txtFindBox', { read: '', static: true }) txtFindBox: ElementRef;
  expandedElement: [] | null;
  reportColumns: string[] = [];
  tempReportColumns: string[] = [];
  public toolbar: Object[];
  selectcolumn = new FormControl();
  // public wrapSettings: TextWrapSettingsModel;
  bFindBoxVisible = false;
  BranchId = localStorage.getItem('SessionBranchId');
  StaffId = localStorage.getItem('SessionStaffId');
  BranchName = localStorage.getItem('SessionBranchName');
  dBranchName: string;
  divShow: boolean;
  FromDate = new Date();
  ToDate = new Date();
  MinDate = new Date();
  MaxDate = new Date();
  today = new Date();
  itemEnter: any;
  checked = true;
  branchWebAddress: any;
  ddlEntryHead: any;
  nameGetdata: any;
  Phone = '';
  Address = '';
  AcID: any;
  selected = '0';
  ddlEntryShow = false;
  displayedColumns = [];
  columnsToDisplay: string[];
  Header: string[];
  loading: boolean;
  dataRepTemp: any;
  dtLedgerData: any;
  strReportHeadName = 'Ledger Report Details';
  dialogResult = '';
  ReportPrintType = '';
  public arrayOfNames: Object[] = [];
  public fields: Object = { value: 'AC_Name' };
  public query: Query = new Query().select(['AC_Id', 'AC_Name', 'Addr1', 'Email', 'Mobile', 'OBalance', 'Phone']);
  SearchCondition = 'StartsWith'; // Contains,EndsWith,
  strLedgerSmsFormat: any;
  smsPop: boolean;
  Message: string;
  ledgerBalance: any;
  voucherPop: boolean;
  vouchaccountHead: any;
  vouchamount: any;
  voucherdate: any;
  vouchernum: any;
  vouchchngeDate: any;
  BankCharge: number;
  chageDate: boolean;
  headNamePop: any;
  UniqueVoucherNo: any;
  PrefixId: any;
  UniqueVoucherId: any;
  bnkchecked = false;
  dataRepExcel: any;
  dataRepPrint: any;
  strDataslice: any;
  strHeadName = '';
  ItemFill: { AC_Id: string; AC_Name: string; Addr1: string; Email: string; Mobile: string; OBalance: string; Phone: string; };
  ledgerFlag: boolean;
  coloumPrint: Array<any> = [];
  dataRep = new MatTableDataSource<any>();
  public model9: any;

  PopUp: boolean;
  CallData: any;

  fillterItems: any[] = [];
  selectcomplete: boolean;
  thHeader: any[] = ['Name', 'Address'];
  // colHeaders: any[] = ['AC_Name','Addr1'];
  colHeaders = [{ col: 'AC_Name', width: '250px' }, { col: 'Addr1', width: '250px' }];
  rowId: number;
  a: any;

  constructor(private renderer: Renderer2, public dialog: MatDialog, private route: ActivatedRoute, public appService: AppService) { }

  ngOnInit() {
    document.getElementById('txtLedger').focus();

    this.setTitle('LedgerReport');
    this.divShow = false;
    let mm = this.today.getMonth();
    let yyyy = this.today.getFullYear();
    this.FromDate = new Date(yyyy, mm, 1);

    // this.fnnameSearch();
    this.ledgerFlag = false;
    var LedgerAcId;

    this.route.queryParams.subscribe(params => {

      LedgerAcId = (params['LedgerAcId']);

    });


    if (LedgerAcId != undefined && LedgerAcId != null && parseFloat(LedgerAcId) > 0) {

      this.AcID = parseFloat(LedgerAcId);
      var ServiceParams = {};
      ServiceParams['strProc'] = 'AccountHead_Get';

      var oProcParams = [];

      var ProcParams = {};
      ProcParams['strKey'] = 'AC_Id';
      ProcParams['strArgmt'] = this.AcID.toString();
      oProcParams.push(ProcParams);
      ServiceParams['oProcParams'] = oProcParams;

      let body = JSON.stringify(ServiceParams);
      var headers = new Headers();
      headers.append('Content-Type', 'application/json; charset=utf-8');
      this.appService.post('CommonQuery/fnGetDataReportNew', body).toPromise()
        .then(data => {

          var jsonobj = JSON.parse(data);

          if (jsonobj.length > 0) {

            this.strHeadName = jsonobj[0].AC_Name;
            this.Address = jsonobj[0].Addr1;
            this.Phone = jsonobj[0].Phone;
            this.onclick();
          }
        }, error => console.error(error));

      // $('#btnOutstandingBills').show();


    }
  }

  findName = (keyword: any): Observable<any[]> => {

    let ServiceParams = {};
    ServiceParams['strProc'] = 'AccountHead_SearchForLedger';
    ServiceParams['JsonFileName'] = 'JsonArrayScriptTwo';
    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = '@ParamsAC_Name';
    ProcParams['strArgmt'] = keyword;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsBranchId';
    ProcParams['strArgmt'] = this.BranchId;
    oProcParams.push(ProcParams);
    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    if (keyword) {
      return this.appService.post('CommonQuery/fnGetDataReportFromScriptJsonFile', body)

        .pipe(
          debounceTime(400),
          map(res => {
            let json = JSON.parse(res.JsonDetails[0]);
            return json;
          }));
    } else {
      return of([]);
    }
  }

  getQueryStringValue(key) {
    return decodeURIComponent(window.location.search.replace(new RegExp('^(?:.*[&\\?]' + encodeURIComponent(key).replace(/[\.\+\*]/g, '\\$&') + '(?:\\=([^&]*))?)?.*$', 'i'), '$1'));
  }

  public setTitle(newTitle: string) {
    // this.titleService.setTitle(newTitle);
  }

  @ViewChild(VirtualScrollerComponent, { read: '', static: false }) private virtualScroller: VirtualScrollerComponent;
  scrollChange(eve) {
    let end = eve.endIndex
    setTimeout(async () => {
      let start = this.virtualScroller.viewPortInfo.endIndex;
      if (start == end) {
        await this.keyFind();
      }
    }, 100);

  }
  findText = '';
  keyFind() {
    this.nPageSearchCnt = 0;
    const keyword = this.findText;
    const rows = this.matTableRef.nativeElement.rows;
    for (let index = 1; index < rows.length; index++) {
      const e = rows[index];
      for (const iterator of e.cells) {
        let valid = iterator.innerText;
        iterator.innerHTML = valid.replace(new RegExp(keyword, "gi"), match => {

          return `<span class="highlightText">${match}</span>`
        });
      }

    }

    var DispCol = [];
    this.displayedColumns.forEach(obj => {
      DispCol.push(obj.field);
    });

    if (this.findText != "") {
      var keywords = String(this.findText).toUpperCase();

      this.dtLedgerData.forEach(obj => {

        Object.entries(obj).forEach(([key, value]) => {

          if (DispCol.includes(key)) {

            var valueone = String(value).toUpperCase();
            if (String(valueone).indexOf(keywords) !== -1) {
              this.nPageSearchCnt = this.nPageSearchCnt + 1;
            }
          }
        });

      });
    }

    return;
    setTimeout(() => {


      if (this.findText != "") {
        var keywords = String(this.findText).toUpperCase();
        for (let index = 1; index < rows.length; index++) {
          const e = rows[index];
          for (const iterator of e.cells) {
            if ((iterator.innerText).toUpperCase().includes(keywords)) {
              this.nPageSearchCnt = this.nPageSearchCnt + 1;
            }
          }
        }
      }
    }, 100);

    return;
    var vale = JSON.stringify(this.dtLedgerData).toUpperCase();
    var count = (vale.match(/is/g) || []).length;

    count = (JSON.stringify(this.dtLedgerData).match(/issue/g) || []).length;
    return;

    if (this.findText != "") {


      this.dtLedgerData.forEach(obj => {

        Object.entries(obj).forEach(([key, value]) => {

          var valueone = String(value);
          if (String(valueone).indexOf(this.findText) !== -1) {
            this.nPageSearchCnt = this.nPageSearchCnt + 1;
          }

        });

      });
    }
  }

  fnFind(keyword, item) {
    if (keyword == '') {
      return false
    }
    return item.includes(keyword) ? true : false;

  }

  public myCallback(args): void {
    this.strHeadName = args.AC_Name;
    this.selectcomplete = false;
    this.itemEnter = [];

    this.itemEnter = args;

    if (this.itemEnter == '') {
      this.Address = '';
      this.Phone = '';
    } else {
      this.Address = this.itemEnter.Addr1;
      this.Phone = this.itemEnter.Phone;
    }

    this.AcID = this.itemEnter.AC_Id;
    this.itemEnter = [];
    this.itemEnter = args;
    // this.strHeadName=this.itemEnter.AC_Name;

  }

  DateChange() {
    this.onclick();
  }

  fnColSubmit(eve) {

    const selectedCol = eve.value;
    if (selectedCol.length < 1) {
      this.appService.openSnackBar('minimum column removed', 'warning');
    } else {
      this.reportColumns = selectedCol;
      this.fnColumnSet(this.reportColumns)
    }


  }


  // fnColumnSet(columsHeader) {
  //   let header = [];
  //   columsHeader.forEach(col => {
  //     let columns = {};
  //     columns['field'] = col;
  //     columns['width'] = 100;
  //     header.push(columns);
  //   });
  //   this.displayedColumns = header;
  // }

  fnCommonPrintOne(JsonData, strBranchName, strReportHeading, reportColumns) {

    var sWinHTML: any;
    var myList = [];

    this.a = JsonData.data;

    var valueone = '';
    this.a.forEach(obj => {

      var item = {}
      Object.entries(obj).forEach(([key, value]) => {

        valueone = String(value);
        if (String(valueone).includes(',')) {

          var count = (String(valueone).match(/,/g) || []).length;
          for (var k = 0; k < count; k++) {
            valueone = valueone.replace(',', ' ');
          }
        }
        if (valueone == 'null') {
          valueone = ''
        }
        if (reportColumns.includes(key)) {
          item[key] = valueone;
        }

      });
      myList.push(item);
    });

    var strResult = '<table>';
    // var columns = addAllColumnHeadersTemp(myList);
    var columns = [];
    strResult += '<thead>';
    strResult += '<tr>';
    for (var i = 0; i < myList.length; i++) {
      var rowHash = myList[i];
      for (var key in rowHash) {
        // if ($.inArray(key, columns) == -1) {
        columns.push(key);
        strResult += '<th>' + key + '</th>';
        // }
      }

    }
    strResult += '</tr></thead>';
    strResult += '<tbody>';
    for (var i = 0; i < myList.length; i++) {
      strResult += '<tr>';
      for (var colIndex = 0; colIndex < columns.length; colIndex++) {
        var cellValue = myList[i][columns[colIndex]];
        if (cellValue == null) { cellValue = ''; }

        strResult += '<td>' + cellValue + '</td>';
      }
      strResult += '</tr>';
    }
    strResult += '</tbody></table>';
    sWinHTML = strResult;

    // sWinHTML=this.buildHtmlTableTemp(JsonData.data,'badd');

    var sOption = 'toolbar=yes,location=no,directories=yes,menubar=yes,scrollbars=yes,width=900,height=600,left=100,top=25';
    var winprint = window.open('', '', sOption);
    winprint.document.open();
    winprint.document.write('<html><head><style type="text/css">');
    winprint.document.write('table{font-size: 16px; width: 870px; border-color: rgb(0, 0, 0);;border-collapse: collapse}');
    winprint.document.write('td,th{border:0.2px solid #000000;}');
    winprint.document.write('</style></head><body onload="window.print();">');
    winprint.document.write('<center><h2>' + strBranchName + '</h2><center>');
    winprint.document.write('<center>' + strReportHeading + '</center>');
    winprint.document.write(sWinHTML);
    winprint.document.write('</body></html>');
    winprint.document.close();
    winprint.focus();
  }

  fnLinePrint(JsonData, strBranchName, strReportHeading, reportColumns) {

    this.a = JsonData.data;


    var CommaArray = new Array();
    var jsonObj = [];
    var valueone = '';
    this.a.forEach(obj => {

      var item = {}
      Object.entries(obj).forEach(([key, value]) => {

        valueone = String(value);
        if (String(valueone).includes(',')) {

          var count = (String(valueone).match(/,/g) || []).length;
          for (var k = 0; k < count; k++) {
            valueone = valueone.replace(',', ' ');
          }
        }
        if (valueone == 'null') {
          valueone = ''
        }
        if (reportColumns.includes(key)) {
          item[key] = valueone;
        }

      });
      jsonObj.push(item);
    });


    var dTime = new Date().toLocaleTimeString();
    let strHeader1 = JSON.stringify([
      {
        HeaderOne: strBranchName,
        HeaderTwo: strReportHeading,
        HeaderThree: 'Time : ' + dTime,
        PrintFrom: 'ReportLinePrintOne',
        ReportClassName: 'StockAndSales',
        SoftwareType: 'SoftwareType'
      }
    ]);

    let ReportValue = strHeader1 + '&&@@a&&@' + JSON.stringify(jsonObj)

    let BillObj = ReportValue;
    let arrayOfStuff = [];
    arrayOfStuff.push(BillObj);
    const blob = new Blob(arrayOfStuff, { type: 'application/octet-stream' });
    // saveAs(blob, `codeappsbillmain.txt`);
    this.saveTextAsFile(arrayOfStuff, strBranchName)
  }

  saveTextAsFile(main, branch) {
    //you can enter your own file name and extension
    let BillObj = main + '&&@@a&&@' + branch;
    this.writeContents(BillObj, 'codeappslineprint' + '.txt', 'text/csv');
  }

  writeContents(content, fileName, contentType) {
    var a = document.createElement('a');
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  fnCommonExportTOExcelFilterColumn(datalist, excelFileName, reportColumns) {
    this.a = datalist;


    var CommaArray = new Array();
    var myList = [];
    var valueone = '';
    this.a.forEach(obj => {

      var item = {}
      Object.entries(obj).forEach(([key, value]) => {

        valueone = String(value);
        if (valueone == 'null') {
          valueone = ''
        }
        if (reportColumns.includes(key)) {
          item[key] = valueone;
        }

      });
      myList.push(item);
    });


    var strTempBranchName = localStorage.getItem('SessionBranchName');
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([], { header: [] });
    XLSX.utils.sheet_add_json(ws, myList, { skipHeader: false, origin: { r: 2, c: 0 } });

    var dColumnValueLen = 0;
    var wscols = [];

    var col = [];
    for (var i = 0; i < myList.length; i++) {
      for (var key in myList[i]) {
        if (col.indexOf(key) === -1) {
          col.push(key);
        }
      }
    }

    for (var j = 0; j < col.length; j++) {

      var result = Object.keys(myList).map(e => myList[e][col[j]]);
      var longest = result.reduce((a, b) => String(a).length > String(b).length ? a : b, '');
      longest = String(longest);
      if (longest == undefined || longest == null) {
        longest = '000';
      }
      if (parseFloat(longest.length) < parseFloat(col[j].length || 0)) {
        longest = col[j];
      }
      dColumnValueLen = parseInt(longest.length || 0) + 2;
      wscols.push({ wch: dColumnValueLen });
    }

    ws['!cols'] = wscols;

    if (!ws['!merges'])
      ws['!merges'] = [];
    ws["!merges"].push({ s: { r: 0, c: 0 }, e: { r: 0, c: col.length - 1 } }); /* A1:A2 */
    ws["!merges"].push({ s: { r: 1, c: 0 }, e: { r: 1, c: col.length - 1 } }); /* A1:A2 */

    // var cell = ws["A1"];
    // cell.s =  { 
    //               font: {
    //                 sz: 20
    //               }
    //           }

    const wb: XLSX.WorkBook = XLSX.utils.book_new();


    XLSX.utils.sheet_add_aoa(ws, [
      [strTempBranchName]
    ], { origin: 0 });
    XLSX.utils.sheet_add_aoa(ws, [
      [excelFileName]
    ], { origin: 1 });

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, excelFileName + '.xlsx');
  }


  clickHandler(args: ClickEventArgs): void {
    if (args.item.id === 'small') {
      // this.grid.rowHeight = 20;
    }
    if (args.item.id === 'medium') {
      // this.grid.rowHeight = 40;
    }
    if (args.item.id === 'big') {
      // this.grid.rowHeight = 60;
    }
  }

  public rowDataBound(args) {


    if (args.data['Particulars'] === 'Balance') {
      args.row.classList.add('highlight');
    }
    if (args.data['VchNo'] === 'Invoice Return No ') {
      args.row.classList.add('Voucherlight');
    }
    if (args.data['Flag'] === 'Red@@@Color') {
      args.row.classList.add('Flaglight');
    }
    if (args.data['Narration'] === 'ˌPost-Dated ˈCheque') {
      args.row.classList.add('Datedlight');
    }
  }

  rowSelected(args) {
    // let result = args.data;
    this.CallData = [];
    this.CallData = args.data;

    if (args.data['UniqueVoucherId'] != '' && args.data['VPrefixId'] == 3) {
      this.PopUp = true;
    } else {
      this.PopUp = false;
    }

  }

  Doubleclick(event) {
    this.CallData = [];
    this.CallData = event.rowData;
    this.fnVoucher();

  }
  searchHead(event) {

    let searchText = event.target.value;
    // this.grid.search(searchText);
  }

  async onclick() {
    // document.getElementById('Grid').;
    this.dataRepTemp = [];
    this.dataRepExcel = [];
    let Book_FromDate = this.ConvertDateAll(this.FromDate);
    let Book_ToDate = this.ConvertDateAll(this.ToDate);


    if (this.AcID == undefined) {
      alert('Select AccountHead');
      return;
    }

    this.loading = true;
    let ProcedureName = '';
    if (this.checked) {
      ProcedureName = 'VoucherDetails_GetLeaderDetsilsFormatOne';
    } else {
      ProcedureName = 'VoucherDetails_GetLeaderDetsils';
    }
    var BranchName = this.BranchName;

    this.strReportHeadName = ' Ledger Report - ' + this.strHeadName + '  ' + this.Address + ' From ' + this.fnDateReverse(this.FromDate) + ' To ' + this.fnDateReverse(this.ToDate);
    var varArguements = {};
    varArguements = { FromDate: Book_FromDate, ToDate: Book_ToDate, AcId: this.AcID, bAllData: this.checked, EntryHeadId: this.selected, 'strHeading': this.strReportHeadName, 'strBranchName': BranchName, BranchId: this.BranchId };

    var DictionaryObject = {};
    DictionaryObject['dictArgmts'] = varArguements;
    DictionaryObject['ProcName'] = ProcedureName;

    let body = JSON.stringify(DictionaryObject);
    var dd = this.AcID;
    await this.appService.post('Accounts/fnLeaders', body).toPromise()
      .then(async data => {


        this.dataRepExcel = [];

        this.dataRepTemp = JSON.parse(data);
        this.dtLedgerData = JSON.parse(data);
        // this.wrapSettings = { wrapMode: 'Content' };
        // { text: 'Print', tooltipText: 'print', prefixIcon: 'e-print', id: 'print-All' },
        this.toolbar = [{ text: 'Print', tooltipText: 'print', prefixIcon: 'e-print', id: 'print-All' }, 'ExcelExport', 'PdfExport', { text: 'Outstanding', tooltipText: 'outstandingAll', prefixIcon: 'e-medium-icon', id: 'outstanding' }, 'ColumnChooser',
        { prefixIcon: 'e-small-icon', id: 'big', align: 'Right' },
        { prefixIcon: 'e-medium-icon', id: 'medium', align: 'Right' },
        { prefixIcon: 'e-big-icon', id: 'small', align: 'Right' }];
        // 'Search',
        this.dataRepExcel = JSON.parse(data);
        let columnSet = [];
        // this.fnHeaderColoumn(this.dataRepTemp, columnSet);


        this.dataRepTemp.map(function (item) {
          delete item.Field1;
          delete item.Field2;
          // delete item.Flag;
          // delete item.Particulars;
          //  delete item.ReconAmt;
          delete item.UniqueVoucherId;
          delete item.UniqueVoucherNo;
          delete item.VPrefixId;
          delete item.VchType;
          delete item.VoucherNo;
        });
        this.dataRep = new MatTableDataSource(this.dataRepTemp);

        this.columnsToDisplay = ['SlNo', 'Date', 'VchNo', 'Particulars', 'Remarks', 'Debit', 'Credit', 'Balance', 'AdjustedBills', 'Flag'];
        this.dBranchName = this.BranchName;
        let colhideItem = this.strDataslice;

        if (colhideItem == null) {
          colhideItem = '';
        }

        this.coloumPrint = [];
        for (let i = 0; i < this.dtLedgerData.length; i++) {
          let dataObj = {
            'SlNo': this.dtLedgerData[i].SlNo,
            'Date': this.dtLedgerData[i].Date,
            'VchNo': this.dtLedgerData[i].VchNo,
            'Particulars': this.dtLedgerData[i].Particulars,
            'Remarks': this.dtLedgerData[i].Remarks,
            'Debit': this.dtLedgerData[i].Debit,
            'Credit': this.dtLedgerData[i].Credit,
            'Balance': this.dtLedgerData[i].Balance,
            'AdjustedBills': this.dtLedgerData[i].AdjustedBills,
            'Flag': this.dtLedgerData[i].Flag
          };

          this.coloumPrint.push(dataObj);
        }

        this.dataRepExcel = this.coloumPrint;
        this.dataRep = new MatTableDataSource(this.coloumPrint);

        this.dataRepPrint = [];
        this.dataRepPrint = ({ data: this.coloumPrint });

        this.reportColumns = this.columnsToDisplay;

        const index = this.reportColumns.indexOf('Flag');
        if (index > -1) {
          this.reportColumns.splice(index, 1);
        }

        // this.fnColumnSet(this.reportColumns)
        this.fnColumnWidthSet();
        this.tempReportColumns = this.reportColumns;
        this.tempReportColumns = this.columnsToDisplay;
        this.selectcolumn.setValue(this.columnsToDisplay)
        this.loading = false;
        this.divShow = true;
        await this.fnGetLeadgerAmtOnAcId();

      }, error => console.error(error));


  }

  fnColumnWidthSet() {

    var dColumnValueLen = 0;
    var myList = this.coloumPrint;
    var wscols = [];

    var col = [];
    let columnsIn = this.coloumPrint[0];
    for (var key in columnsIn) {
      col.push(key)
    }
    for (var j = 0; j < col.length; j++) {

      var result = Object.keys(myList).map(e => myList[e][col[j]]);
      var longest = result.reduce((a, b) => String(a).length > String(b).length ? a : b, '');
      if (longest == undefined || longest == 'undefined' || longest == null) {
        longest = '0000';
      }

      if (String(longest).length < String(col[j]).length) {
        longest = String(col[j]);
      }
      dColumnValueLen = ((String(longest).length + 1) * 5) + 4;
      wscols.push({ width: dColumnValueLen, field: col[j] });
    }


    let header = [];
    wscols.forEach(col => {
      let columns = {};
      columns['field'] = col.field;
      columns['width'] = col.width;
      header.push(columns);
    });
    this.displayedColumns = header;
  }

  async ngAfterViewInit() {
    await this.fnSettings();
    // await this.fnnameSearch();

  }

  async fnSettings() {

    let dictArgmts = { ProcName: 'Settings_GetValues' };
    let body = JSON.stringify(dictArgmts);
    await this.appService.post('CommonQuery/fnSettings', body).toPromise()
      .then(data => {
        let dataobj = data;
        for (var i = 0; i < dataobj.length; i++) {

          if (dataobj[i].KeyValue == 'LeaderSms' && dataobj[i].Value == 'Yes') {
            // $('#btnSms').show();
            let dtyata = true;
          } else if (dataobj[i].KeyValue == 'WebAddress') {
            this.branchWebAddress = dataobj[i].Value;
          } else if (dataobj[i].KeyValue == 'DecimalPlace') {
            let RateDecimalPlace = dataobj[i].Value;
            if (RateDecimalPlace != 3) {
              RateDecimalPlace = 2;
            }
          } else if (dataobj[i].KeyValue == 'EntryHeadInAccounts') {
            if (dataobj[i].Value == 'Yes') {
              let bEntryHeadInAccounts = true;
              this.ddlEntryShow = true;
              this.fnEntryHeadGets();
            }
          } else if (dataobj[i].KeyValue == 'LedgerSmsFormat') {
            this.strLedgerSmsFormat = dataobj[i].Value;
          } else if (dataobj[i].KeyValue == 'AccountHeadMultiSearch') {

            if (dataobj[i].Value == 'Yes') {
              this.SearchCondition = 'Contains';
            }
          } else if (dataobj[i].KeyValue == 'ReportPrintType') {
            this.ReportPrintType = dataobj[i].Value;
          }
        }
      }, error => console.error(error));
  }

  async fnEntryHeadGets() {

    var ServiceParams = {};
    ServiceParams['strProc'] = 'EntryHead_Gets';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'EntryHead_Name';
    ProcParams['strArgmt'] = '';
    oProcParams.push(ProcParams);
    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    await this.appService.post('CommonQuery/fnGetDataReportNew', body).toPromise()
      .then(data => {
        this.ddlEntryHead = JSON.parse(data);
      }, error => console.error(error));

  }

  async fnnameSearch() {

    this.arrayOfNames = [];
    var strQuery = '' +
      '\n declare @AC_Name  varchar(200) ' +
      '\n declare      @BranchId  int  ' +
      '\n set @AC_Name=@@@@@@' +
      '\n set @BranchId=' + this.BranchId +
      '\n declare @AllBranchSupplierVisible  as varchar(100)' +
      '\n select  @AllBranchSupplierVisible   =  isnull(Value,@@@Yes@@@) from BranchSetting where SettingName=@@@AllBranchSupplierVisible@@@  and BranchId=@BranchId  ' +
      '\n  set     @AllBranchSupplierVisible   =  isnull(@AllBranchSupplierVisible,@@@Yes@@@) ' +

      '\n declare @AllBranchCustomerVisible  as varchar(100)' +
      '\n select  @AllBranchCustomerVisible   =  isnull(Value,@@@Yes@@@) from BranchSetting where SettingName=@@@AllBranchCustomerVisible@@@  and BranchId=@BranchId  ' +
      '\n  set     @AllBranchCustomerVisible   =  isnull(@AllBranchCustomerVisible,@@@Yes@@@) ' +

      '\n declare @AllBranchOtherHeadVisible as varchar(100)' +
      '\n select  @AllBranchOtherHeadVisible  =  isnull(Value,@@@Yes@@@) from BranchSetting where SettingName=@@@AllBranchOtherHeadVisible@@@   and BranchId=@BranchId  ' +
      '\n   set     @AllBranchOtherHeadVisible  =  isnull(@AllBranchOtherHeadVisible,@@@Yes@@@)' +

      '\n declare @AccountHeadMultiSearch   as varchar(100)' +
      '\n declare @MultiSearch as varchar(100)' +
      '\n set     @AccountHeadMultiSearch = @@@@@@' +
      '\n select  @MultiSearch  =  isnull(Value,@@@No@@@) from Settings where KeyValue=@@@AccountHeadMultiSearch@@@' +

      '\n if(@MultiSearch = @@@Yes@@@)' +
      '\n begin' +
      '\n  set  @AccountHeadMultiSearch= @@@%@@@' +
      '\n end' +

      '\n Create Table #tblResult' +
      '\n (' +
      '\n AC_Id           numeric(18,0)  ,' +
      '\n AC_Name         varchar(1200)  ,' +
      '\n Addr1           varchar(1200)  ,' +
      '\n OBalance        numeric(18,3)  ,' +
      '\n BankYesNo       varchar(100)   ,' +
      '\n Email           varchar(100)   ,' +
      '\n Phone           varchar(100)   ,' +
      '\n Mobile          varchar(100)   ,' +
      '\n CustomerFlag    bit     ' +
      '\n )' +

      '\n insert into #tblResult(AC_Id,AC_Name,Addr1,OBalance,BankYesNo,Email,Phone,Mobile,CustomerFlag)' +
      '\n SELECT    [AC_Id] ,  AC_Name ,ISNULL(  Addr1,@@@@@@)    Addr1    ,OBalance ' +
      '\n ,BankYesNo ,ISNULL(email,@@@@@@)   Email ,ISNULL( Phone,@@@@@@) Phone,ISNULL( Mobile ,@@@@@@) Mobile,CustomerFlag' +
      '\n FROM [AccountHead] where AC_Name like @AccountHeadMultiSearch+@AC_Name+@@@%@@@  and AC_Id<=50  and AC_Id in (9,10,23,26,40,45,43,42,40,48) ' +
      '\n order by AccountHead.AC_Name ' +

      '\n insert into #tblResult(AC_Id,AC_Name,Addr1,OBalance,BankYesNo,Email,Phone,Mobile,CustomerFlag)' +
      '\n SELECT    [AC_Id] ,  AC_Name ,ISNULL(  Addr1,@@@@@@)    Addr1    ,OBalance' +
      '\n    ,BankYesNo ,ISNULL(email,@@@@@@)   Email ,ISNULL( Phone,@@@@@@) Phone,ISNULL( Mobile ,@@@@@@) Mobile,CustomerFlag' +
      '\n FROM [AccountHead] where AC_Name like @AccountHeadMultiSearch+@AC_Name+@@@%@@@  and AC_Id<=50' +
      '\n order by AccountHead.AC_Name ' +

      '\n if(@AllBranchCustomerVisible=@@@Yes@@@)' +
      '\n begin' +
      '\n insert into #tblResult(AC_Id,AC_Name,Addr1,OBalance,BankYesNo,Email,Phone,Mobile,CustomerFlag)' +
      '\n SELECT    [AC_Id] ,  AC_Name ,ISNULL(  Addr1,@@@@@@)    Addr1  ' +
      '\n , OBalance ,BankYesNo ,ISNULL(email,@@@@@@)   Email ,ISNULL( Phone,@@@@@@) Phone,ISNULL( Mobile ,@@@@@@) Mobile,CustomerFlag' +
      '\n   FROM [AccountHead] ' +
      '\n   where CustomerFlag=1 and  AC_Name like @AccountHeadMultiSearch+@AC_Name+@@@%@@@  --  and AccountHead.BranchId=@BranchId ' +
      '\n end' +
      '\n else' +
      '\n begin' +
      '\n insert into #tblResult(AC_Id,AC_Name,Addr1,OBalance,BankYesNo,Email,Phone,Mobile,CustomerFlag)' +
      '\n SELECT    [AC_Id]  , AC_Name ,ISNULL(  Addr1,@@@@@@)    Addr1    ,OBalance ' +
      '\n ,BankYesNo ,ISNULL(email,@@@@@@)   Email ,ISNULL( Phone,@@@@@@) Phone,ISNULL( Mobile ,@@@@@@) Mobile,CustomerFlag' +
      '\n FROM [AccountHead] ' +
      '\n where CustomerFlag=1 and  AC_Name like @AccountHeadMultiSearch+@AC_Name+@@@%@@@  and AccountHead.BranchId=@BranchId ' +
      '\n end	' +

      '\n if(@AllBranchSupplierVisible=@@@Yes@@@)' +
      '\n begin' +
      '\n  insert into #tblResult(AC_Id,AC_Name,Addr1,OBalance,BankYesNo,Email,Phone,Mobile,CustomerFlag) ' +
      '\n SELECT    [AC_Id] ,  AC_Name ,ISNULL(  Addr1,@@@@@@)    Addr1   ' +
      '\n , OBalance ,BankYesNo ,ISNULL(email,@@@@@@)   Email ,ISNULL( Phone,@@@@@@) Phone,ISNULL( Mobile ,@@@@@@) Mobile,SupplierFlag' +
      '\n  FROM [AccountHead] ' +
      '\n  where SupplierFlag=1 and  AC_Name like @AccountHeadMultiSearch+@AC_Name+@@@%@@@  --  and AccountHead.BranchId=@BranchId ' +
      '\n end' +
      '\n else' +
      '\n begin' +
      '\n insert into #tblResult(AC_Id,AC_Name,Addr1,OBalance,BankYesNo,Email,Phone,Mobile,CustomerFlag) ' +
      '\n SELECT    [AC_Id]  , AC_Name ,ISNULL(  Addr1,@@@@@@)    Addr1    ,OBalance   ' +
      '\n ,BankYesNo ,ISNULL(email,@@@@@@)   Email ,ISNULL( Phone,@@@@@@) Phone,ISNULL( Mobile ,@@@@@@) Mobile,SupplierFlag' +
      '\n FROM [AccountHead]' +
      '\n where SupplierFlag=1 and  AC_Name like @AccountHeadMultiSearch+@AC_Name+@@@%@@@  and AccountHead.BranchId=@BranchId' +
      '\n end' +
      '\n if(@AllBranchOtherHeadVisible=@@@Yes@@@)' +
      '\n begin' +
      '\n insert into #tblResult(AC_Id,AC_Name,Addr1,OBalance,BankYesNo,Email,Phone,Mobile,CustomerFlag) ' +
      '\n SELECT    [AC_Id] ,  AC_Name ,ISNULL(  Addr1,@@@@@@)    Addr1' +
      '\n , OBalance ,BankYesNo ,ISNULL(email,@@@@@@)   Email ,ISNULL( Phone,@@@@@@) Phone,ISNULL( Mobile ,@@@@@@) Mobile,OtherFlag' +
      '\n FROM [AccountHead]  ' +
      '\n where OtherFlag=1 and  AC_Name like @AccountHeadMultiSearch+@AC_Name+@@@%@@@  --  and AccountHead.BranchId=@BranchId' +

      '\n insert into #tblResult(AC_Id,AC_Name,Addr1,OBalance,BankYesNo,Email,Phone,Mobile,CustomerFlag) ' +
      '\n SELECT    [AC_Id] ,  AC_Name ,ISNULL(  Addr1,@@@@@@)    Addr1  ' +
      '\n , OBalance ,BankYesNo ,ISNULL(email,@@@@@@)   Email ,ISNULL( Phone,@@@@@@) Phone,ISNULL( Mobile ,@@@@@@) Mobile,OtherFlag' +
      '\n  FROM [AccountHead] ' +
      '\n  where BankYesNo=@@@Yes@@@ and  AC_Name like @AccountHeadMultiSearch+@AC_Name+@@@%@@@  --  and AccountHead.BranchId=@BranchId ' +
      '\n end' +
      '\n else' +
      '\n begin' +
      '\n insert into #tblResult(AC_Id,AC_Name,Addr1,OBalance,BankYesNo,Email,Phone,Mobile,CustomerFlag)' +
      '\n SELECT    [AC_Id]  , AC_Name ,ISNULL(  Addr1,@@@@@@)    Addr1    ,OBalance ' +
      '\n ,BankYesNo ,ISNULL(email,@@@@@@)   Email ,ISNULL( Phone,@@@@@@) Phone,ISNULL( Mobile ,@@@@@@) Mobile,OtherFlag' +
      '\n  FROM [AccountHead] ' +
      '\n where OtherFlag=1 and  AC_Name like @AccountHeadMultiSearch+@AC_Name+@@@%@@@  and AccountHead.BranchId=@BranchId ' +

      '\n insert into #tblResult(AC_Id,AC_Name,Addr1,OBalance,BankYesNo,Email,Phone,Mobile,CustomerFlag) ' +
      '\n  SELECT   [AC_Id] ,  AC_Name ,ISNULL(  Addr1,@@@@@@)    Addr1   ' +
      '\n , OBalance ,BankYesNo ,ISNULL(email,@@@@@@)   Email ,ISNULL( Phone,@@@@@@) Phone,ISNULL( Mobile ,@@@@@@) Mobile,OtherFlag' +
      '\n  FROM [AccountHead]' +
      '\n  where BankYesNo=@@@Yes@@@ and  AC_Name like @AccountHeadMultiSearch+@AC_Name+@@@%@@@    and AccountHead.BranchId=@BranchId ' +
      '\n end' +

      '\n insert into #tblResult(AC_Id,AC_Name,Addr1,OBalance,BankYesNo,Email,Phone,Mobile,CustomerFlag) ' +
      '\n SELECT    [AC_Id]  , AC_Name ,ISNULL(  Addr1,@@@@@@)    Addr1    ,OBalance ' +
      '\n ,BankYesNo ,ISNULL(email,@@@@@@)   Email ,ISNULL( Phone,@@@@@@) Phone,ISNULL( Mobile ,@@@@@@) Mobile,StaffFlag' +
      '\n FROM [AccountHead] ' +
      '\n where StaffFlag=1 and  AC_Name like @AccountHeadMultiSearch+@AC_Name+@@@%@@@  and AccountHead.BranchId=@BranchId ' +

      '\n insert into #tblResult(AC_Id,AC_Name,Addr1,OBalance,BankYesNo,Email,Phone,Mobile,CustomerFlag) ' +
      '\n SELECT    [AC_Id]  , AC_Name ,ISNULL(  Addr1,@@@@@@)    Addr1    ,OBalance     ' +
      '\n ,BankYesNo ,ISNULL(email,@@@@@@)   Email ,ISNULL( Phone,@@@@@@) Phone,ISNULL( Mobile ,@@@@@@) Mobile,SalesmanFlag' +
      '\n FROM [AccountHead] ' +
      '\n where SalesmanFlag=1 and  AC_Name like @AccountHeadMultiSearch+@AC_Name+@@@%@@@  and AccountHead.BranchId=@BranchId ' +

      '\n insert into #tblResult(AC_Id,AC_Name,Addr1,OBalance,BankYesNo,Email,Phone,Mobile,CustomerFlag) ' +
      '\n SELECT    [AC_Id]  , AC_Name ,ISNULL(  Addr1,@@@@@@)    Addr1    ,OBalance ' +
      '\n ,BankYesNo ,ISNULL(email,@@@@@@)   Email ,ISNULL( Phone,@@@@@@) Phone,ISNULL( Mobile ,@@@@@@) Mobile,AgentFlag' +
      '\n FROM [AccountHead]     ' +
      '\n where AgentFlag=1 and  AC_Name like @AccountHeadMultiSearch+@AC_Name+@@@%@@@  and AccountHead.BranchId=@BranchId' +

      '\n -- select distinct * from #tblResult order by AC_Name' +

      '\n insert into #tblResult(AC_Id,AC_Name,Addr1,OBalance,BankYesNo,Email,Phone,Mobile,CustomerFlag) ' +
      '\n select  AccountHead.AC_Id  , AccountHead.AC_Name ,ISNULL(  AccountHead.Addr1,@@@@@@)    Addr1    ,AccountHead.OBalance  ' +
      '\n ,AccountHead.BankYesNo ,ISNULL(AccountHead.email,@@@@@@)   Email ,ISNULL( AccountHead.Phone,@@@@@@) Phone,ISNULL( AccountHead.Mobile ,@@@@@@) Mobile,1' +
      '\n  from  AccountHead' +
      '\n inner join Branch on AccountHead.AC_Id=Branch.AcId and   Branch.BranchId<>@BranchId' +
      '\n and  AC_Name like @AccountHeadMultiSearch+@AC_Name+@@@%@@@' +
      '\n -- where Branch.AcId not  in (select AcId from #tblResult) ' +

      '\n select distinct * from #tblResult order by AC_Name	';

    // let ServiceParams = {};
    // ServiceParams['strProc'] = 'AccountHead_SearchForAccountReceipt';

    // let oProcParams = [];

    // let ProcParams             = {};
    // ProcParams['strKey']   = 'AC_Name';
    // ProcParams['strArgmt'] = '';
    // oProcParams.push(ProcParams);

    // ProcParams = {};
    // ProcParams['strKey']   = 'BranchId';
    // ProcParams['strArgmt'] = this.BranchId;
    // oProcParams.push(ProcParams);
    // ServiceParams['oProcParams'] = oProcParams;

    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary);
    await this.appService.post('CommonQuery/fnGetDataReportFromQuery', body)
      .toPromise().then(data => {
        this.arrayOfNames = JSON.parse(data.JsonDetails[0]);
      }, error => console.error(error));
  }

  fnBillwiseOutstandingOnAcId(): Observable<any> {

    var ServiceParams = {};

    ServiceParams['strProc'] = 'OutstandingSupplier_GetOnAcId';

    let oProcParams = [];
    let ProcParams = {};
    ProcParams['strKey'] = 'AC_Id';
    ProcParams['strArgmt'] = this.AcID.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.BranchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    return this.appService.post('CommonQuery/fnGetDataReportNew', body);
    // .map((response) => response.json());

  }

  fnVoucherDetailsGetonVPrefixId(): Observable<any> {

    let Book_FromDate = this.ConvertDateAll(this.FromDate);
    let Book_ToDate = this.ConvertDateAll(this.ToDate);

    var ServiceParams = {};
    ServiceParams['strProc'] = 'VouchereDetails_GetOnAcId';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'FromDate';
    ProcParams['strArgmt'] = Book_FromDate;
    oProcParams.push(ProcParams);


    ProcParams = {};
    ProcParams['strKey'] = 'ToDate';
    ProcParams['strArgmt'] = Book_ToDate;
    oProcParams.push(ProcParams);


    ProcParams = {};
    ProcParams['strKey'] = 'VPrefixId';
    ProcParams['strArgmt'] = '1';
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'AcId';
    ProcParams['strArgmt'] = this.AcID.toString();
    oProcParams.push(ProcParams);


    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.BranchId;
    oProcParams.push(ProcParams);
    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    return this.appService.post('CommonQuery/fnGetDataReportNew', body);

  }

  fnShowCashBillOnAcId(): Observable<any> {
    let Book_FromDate = this.ConvertDateAll(this.FromDate);
    let Book_ToDate = this.ConvertDateAll(this.ToDate);


    var ServiceParams = {};
    ServiceParams['strProc'] = 'IssueGetsOnPayterms';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'fromdate';
    ProcParams['strArgmt'] = Book_FromDate;
    oProcParams.push(ProcParams);


    ProcParams = {};
    ProcParams['strKey'] = 'todate';
    ProcParams['strArgmt'] = Book_ToDate;
    oProcParams.push(ProcParams);


    ProcParams = {};
    ProcParams['strKey'] = 'PayTerms';
    ProcParams['strArgmt'] = 'CASH';
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'AcId';
    ProcParams['strArgmt'] = this.AcID.toString();
    oProcParams.push(ProcParams);


    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.BranchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    return this.appService.post('CommonQuery/fnGetDataReportNew', body);

  }

  async fnGetLeadgerAmtOnAcId() {

    var ServiceParams = {};
    ServiceParams['strProc'] = 'LeadgerAmtGetOnAcId';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'AcId';
    ProcParams['strArgmt'] = this.AcID.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.BranchId;
    oProcParams.push(ProcParams);
    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    await this.appService.post('CommonQuery/fnGetDataReportNew', body).toPromise()
      .then(data => {
        let jsonobj = JSON.parse(data);

        if (jsonobj.length > 0) {
          this.ledgerBalance = jsonobj[0].LeaderAmt;
        }
      }, error => console.error(error));

  }

  openSmsDialog() {

    let pattern = /^\d{10}$/;
    if (!pattern.test(this.Phone)) {
      alert('Enter Valid Mobile No');
      return false;
    }

    let strmsg = this.BranchName + '. Dear ' + this.itemEnter.AC_Name + '. Balance Amt :' + this.ledgerBalance + ' ' + this.branchWebAddress;
    strmsg = this.strLedgerSmsFormat;
    strmsg = strmsg.replace('(BranchName)', this.BranchName);
    strmsg = strmsg.replace('(AccountHead)', this.strHeadName);
    strmsg = strmsg.replace('(LedgerAmount)', this.ledgerBalance);
    strmsg = strmsg.replace('(BillTotal)', '');

    this.Message = strmsg;

    this.smsPop = true;
  }

  async fnSmsSend() {
    let MessageCounterInfo = {};
    MessageCounterInfo['MessageTo'] = this.Phone;
    MessageCounterInfo['Information'] = this.Message;
    MessageCounterInfo['StaffId'] = this.StaffId;
    MessageCounterInfo['BranchId'] = this.BranchId;
    let body = JSON.stringify(MessageCounterInfo);
    await this.appService.post('/Common/SmsSent', body).toPromise()
      .then(data => {

      });
    this.smsPop = false;
  }

  fnSendEmail() {
    alert(this.itemEnter.Email + 'sending Error !');
  }

  cancelPop() {
    this.smsPop = false;
    this.voucherPop = false;
    this.PopUp = false;
  }

  openDialog(value) {

    if (value == 'Outstanding') {
      let request = this.fnBillwiseOutstandingOnAcId();
      let dialogRefer: MatDialogRef<LedgerdialogueComponent> = this.dialog.open(LedgerdialogueComponent, <any>{
        hasBackdrop: false, disableClose: false, data: request
      });
      dialogRefer.componentInstance.name = value;


    } if (value == 'Voucher') {
      let request = this.fnVoucherDetailsGetonVPrefixId();
      let dialogRefer: MatDialogRef<LedgerdialogueComponent> = this.dialog.open(LedgerdialogueComponent, <any>{
        hasBackdrop: false, disableClose: false, data: request
      });
      dialogRefer.componentInstance.name = value;
    }
    if (value == 'CashBill') {
      let request = this.fnShowCashBillOnAcId();
      let dialogRefer: MatDialogRef<LedgerdialogueComponent> = this.dialog.open(LedgerdialogueComponent, <any>{
        hasBackdrop: false, disableClose: false, data: request
      });
      dialogRefer.componentInstance.name = value;

    }

  }

  fnLedgerRowClick(rowItem) {

    this.CallData = [];
    var dClickRowNo = rowItem.SlNo;
    var filterData = this.dtLedgerData.filter(function (i, n) { return n.SlNo === dClickRowNo })
    filterData = this.dtLedgerData.filter(function (entry) {
      return entry.SlNo === dClickRowNo;
    });

    if (filterData.length > 0) {

      var Json = {
        UniqueVoucherId: filterData[0].UniqueVoucherId, UniqueVoucherNo: filterData[0].UniqueVoucherNo,
        VPrefixId: filterData[0].VPrefixId
      }
      this.CallData = Json;
      this.fnVoucher();
    }

  }
  async fnVoucher() {

    let element = this.CallData;
    let UniqueVoucherId = element.UniqueVoucherId;
    let VoucherNo = element.UniqueVoucherNo;
    let VPrefixId = element.VPrefixId;
    var BranchId = this.BranchId;


    if (UniqueVoucherId == 0) {
      return;
    }

    var ServiceParams = {};
    ServiceParams['strProc'] = 'GetBillDetailsFromVoucherNo';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'UniqueVoucherId';
    ProcParams['strArgmt'] = UniqueVoucherId.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'VoucherNo';
    ProcParams['strArgmt'] = VoucherNo.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'VPrefixId';
    ProcParams['strArgmt'] = VPrefixId.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = BranchId.toString();
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);

    let jsonobj = [];
    await this.appService.post('CommonQuery/fnGetDataReportNew', body).toPromise()
      .then(data => {
        jsonobj = JSON.parse(data);

      }, error => console.error(error));

    var url = '';
    if (jsonobj.length > 0) {

      if (jsonobj[0].TransFrom == 'NoTransaction') {
        return;
      } else if (jsonobj[0].TransFrom == 'Sales') {

        var target = '#/salesbill';
        // window.location.href = target + '?LedgerBillNo=' + jsonobj[0].Issue_SlNo + '&LedgerUniqueNo=' + jsonobj[0].UniqueBillNo + '&LedgerBillSerId=' + jsonobj[0].BillSerId;
        url = target + '?LedgerBillNo=' + jsonobj[0].Issue_SlNo + '&LedgerUniqueNo=' + jsonobj[0].UniqueBillNo + '&LedgerBillSerId=' + jsonobj[0].BillSerId;
        window.open(url, '_blank');
      } else if (jsonobj[0].TransFrom == 'SalesReturn') {

        if (jsonobj[0].Issue_Field2 != 'AccountsEntry' && jsonobj[0].BillSerId == 0) {
          var target = '#/salesreturn';
          url = target + '?LedgerReturnNo=' + jsonobj[0].IssueRetSlNo + '&LedgerReturnUniqueNo=' + jsonobj[0].UniqueNo;
          window.open(url, '_blank');
        } else if (jsonobj[0].Issue_Field2 != 'AccountsEntry' && jsonobj[0].BillSerId != 0) {
          var target = '#/salesreturnbillwise';
          url = target + '?LedgerReturnNo=' + jsonobj[0].IssueRetSlNo + '&LedgerReturnUniqueNo=' + jsonobj[0].UniqueNo;
          window.open(url, '_blank');
        }
      } else if (jsonobj[0].TransFrom == 'ReceiptEntry') {

        var target = '#/receiptvoucher';
        url = target + '?LedgerUniqueVoucherId=' + jsonobj[0].UniqueVoucherId + '&LedgerVoucherNo=' + jsonobj[0].VoucherNo + '&LedgerPrefixId=' + jsonobj[0].VPrefixId;
        window.open(url, '_blank');
      } else if (jsonobj[0].TransFrom == 'PaymentEntry') {

        var target = '#/paymentvoucher';
        url = target + '?LedgerUniqueVoucherId=' + jsonobj[0].UniqueVoucherId + '&LedgerVoucherNo=' + jsonobj[0].VoucherNo + '&LedgerPrefixId=' + jsonobj[0].VPrefixId;
        window.open(url, '_blank');
      } else if (jsonobj[0].TransFrom == 'Purchase') {

        var target = '#/purchasebill';
        url = target + '?LedgerPurchaseNo=' + jsonobj[0].Receipt_SlNo + '&LedgerPurchaseId=' + jsonobj[0].PurchaseId;
        window.open(url, '_blank');
      } else if (jsonobj[0].TransFrom == 'DebitNote') {

        var target = '#/debitnote';
        url = target + '?LedgerDebitNoteNo=' + jsonobj[0].DebitNote_SlNo + '&LedgerDebitNoteId=' + jsonobj[0].DebitNoteId;
        window.open(url, '_blank');
      }

    }

  }

  async fnVoucherDetailsGet(flag) {
    let element = this.CallData;
    this.UniqueVoucherNo = element.UniqueVoucherNo;
    this.PrefixId = element.VPrefixId;
    this.UniqueVoucherId = element.UniqueVoucherId;

    this.headNamePop = flag;
    var subtotal = 0;
    var taxamt = 0;
    var varArguements = {};
    varArguements = { VoucherNo: element.UniqueVoucherNo, PrefixId: element.VPrefixId, UniqueVoucherId: element.UniqueVoucherId, BranchId: this.BranchId };
    var DictionaryObject = {};
    DictionaryObject['dictArgmts'] = varArguements;
    DictionaryObject['ProcName'] = 'AccountLogFile_Get';

    let body = JSON.stringify(DictionaryObject);
    await this.appService.post('Accounts/fnOutstandingPaidAmtForCopy', body).toPromise()
      .then(data => {

        let JsonVoucherDetails = JSON.parse(data.VoucherDetails);


        if (JsonVoucherDetails.length > 0) {

          if (this.headNamePop == 'DateChange') {
            this.vouchaccountHead = JsonVoucherDetails[0].AC_Name;
            this.vouchamount = JsonVoucherDetails[0].Voucher_Amt;
            let Book_FromDate = this.fnDateReverse(JsonVoucherDetails[0].Voucher_Date);
            this.voucherdate = Book_FromDate;
            this.vouchernum = JsonVoucherDetails[0].Voucher_VoucherNo;
            this.vouchchngeDate = JsonVoucherDetails[0].Voucher_Date;
            this.chageDate = true;
            this.voucherPop = true;
          } else if (this.headNamePop == 'BankCharge') {
            this.vouchaccountHead = JsonVoucherDetails[0].AC_Name;
            this.vouchamount = JsonVoucherDetails[0].Voucher_Amt;
            let Book_FromDate = this.fnDateReverse(JsonVoucherDetails[0].Voucher_Date);
            this.voucherdate = Book_FromDate;
            this.vouchernum = JsonVoucherDetails[0].Voucher_VoucherNo;
            this.BankCharge = 0;
            this.chageDate = false;
            this.voucherPop = true;
          }

        }

      }, error => console.error(error));
  }

  async fnVoucherDateChangeSave() {

    let Book_FromDate = this.ConvertDateAll(new Date(this.vouchchngeDate));

    var ServiceParams = {};
    ServiceParams['strProc'] = 'VoucherDateChange';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'Voucher_VoucherNo';
    ProcParams['strArgmt'] = this.UniqueVoucherNo.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.BranchId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'VPrefix_No';
    ProcParams['strArgmt'] = this.PrefixId.toString();
    oProcParams.push(ProcParams);


    ProcParams = {};
    ProcParams['strKey'] = 'ChangeDate';
    ProcParams['strArgmt'] = Book_FromDate;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'UniqueVoucherId';
    ProcParams['strArgmt'] = this.UniqueVoucherId.toString();
    oProcParams.push(ProcParams);
    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    await this.appService.post('CommonQuery/fnGetDataReportNew', body).toPromise()
      .then(data => {

        var jsonobj = JSON.parse(data.json());
        if (jsonobj.length > 0) {
          alert(jsonobj[0].flag);
          this.voucherPop = false;
        }
      }, error => console.error(error));

  }

  async fnBankChargeSave() {

    let strPostBankChgToHead = 'No';

    let bPostBankChgToHead = document.getElementById('txtPostChargeToHead');

    strPostBankChgToHead = 'No';
    if (this.bnkchecked) {
      strPostBankChgToHead = 'Yes';
    }

    let ServiceParams = {};
    ServiceParams['strProc'] = 'VoucherDetails_BankChargeSave';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'Voucher_VoucherNo';
    ProcParams['strArgmt'] = this.UniqueVoucherNo.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.BranchId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'VPrefix_No';
    ProcParams['strArgmt'] = this.PrefixId.toString();
    oProcParams.push(ProcParams);


    ProcParams = {};
    ProcParams['strKey'] = 'BankCharge';
    ProcParams['strArgmt'] = this.BankCharge.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'UniqueVoucherId';
    ProcParams['strArgmt'] = this.UniqueVoucherId.toString();
    oProcParams.push(ProcParams);


    ProcParams = {};
    ProcParams['strKey'] = 'StaffId';
    ProcParams['strArgmt'] = this.StaffId;
    oProcParams.push(ProcParams);


    ProcParams = {};
    ProcParams['strKey'] = 'PostBankChgToHead';
    ProcParams['strArgmt'] = strPostBankChgToHead;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    await this.appService.post('CommonQuery/fnGetDataReportNew', body).toPromise()
      .then(data => {
        var jsonobj = JSON.parse(data);
        if (jsonobj.length > 0) {
          alert(jsonobj[0].flag);
          this.voucherPop = false;
        }
      }, error => console.error(error));

  }

  onKey(event) {

    this.findName(event.target.value).subscribe(data => {
      this.fillterItems = data;
      if (this.fillterItems.length > 0) {
        this.selectcomplete = true;
      } else {
        this.selectcomplete = false;
      }
    });
  }

  @ViewChild('MatTable', { read: '', static: false }) private matTableRef: ElementRef;
  pressed = false;
  currentResizeIndex: number;
  startX: number;
  startWidth: number;
  isResizingRight: boolean;

  resizableMousemove: () => void;
  resizableMouseup: () => void;
  fnColumnSet(columsHeader) {

    let header = [];
    columsHeader.forEach(col => {
      let columns = {};
      columns['field'] = col;
      columns['width'] = 100;
      header.push(columns);
    });
    this.displayedColumns = header;
  }
  setTableResize(tableWidth: number) {
    let totWidth = 0;
    this.displayedColumns.forEach((column) => {
      totWidth += column.width;
    });
    const scale = (tableWidth - 5) / totWidth;
    this.displayedColumns.forEach((column) => {
      column.width *= scale;
    });
  }

  onResizeColumn(event: any, index: number) {
    let className = event.target.classList.value;
    this.checkResizing(event, index);
    this.currentResizeIndex = index;
    this.pressed = true;
    this.startX = event.pageX;
    this.startWidth = event.target.clientWidth;
    event.preventDefault();
    this.mouseMove(index, className);
  }

  private checkResizing(event, index) {
    const cellData = this.getCellData(index);
    if ((index === 0) || (Math.abs(event.pageX - cellData.right) < cellData.width / 2 && index !== this.displayedColumns.length - 1)) {
      this.isResizingRight = true;
    } else {
      this.isResizingRight = false;
    }
  }

  private getCellData(index: number) {
    const headerRow = this.matTableRef.nativeElement.tHead.rows[0];
    const cell = headerRow.cells[index];
    return cell.getBoundingClientRect();
  }

  mouseMove(index: number, className: string) {
    let nativeEle = <any>document.getElementsByClassName(className) as HTMLElement;

    this.resizableMousemove = this.renderer.listen('document', 'mousemove', (event) => {


      if (this.pressed && event.buttons) {

        const dx = (this.isResizingRight) ? (event.pageX - this.startX) : (-event.pageX + this.startX);
        const width = this.startWidth + dx;
        if (this.currentResizeIndex === index && width > 50) {
          //  this.columns[index].width = `${width}px`
          // nativeEle[0].style.minWidth = `${width}px`

          this.displayedColumns[index].width = `${width}`

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


  setColumnWidthChanges(index: number, width: number) {
    const orgWidth = this.displayedColumns[index].width;

    const dx = width - orgWidth;
    if (dx !== 0) {
      const j = (this.isResizingRight) ? index + 1 : index - 1;
      const newWidth = this.displayedColumns[j].width - dx;
      this.displayedColumns[index].width = width;
      // this.reportColumns[j].width = newWidth;
      if (newWidth > 50) {
        // this.reportColumns[index].width = width;
        this.displayedColumns[j].width = newWidth;
      }
    }
  }

  @HostListener('keydown', ['$event'])
  onkeydown(event) {

    const keyCode = event.which;
    if (keyCode == 115) { // F4
      this.bFindBoxVisible = true;
      // this.txtFindBox.nativeElement.focus();
      this.findText = '';
      this.nPageSearchCnt = 0;
    }

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


@Component({
  selector: 'app-ledgerdialogue',
  templateUrl: 'ledgerdialogue.component.html',
})

export class LedgerdialogueComponent {
  // @ViewChild('LedgerApp') LedgerApp: LedgerComponent;

  BranchId = localStorage.getItem('SessionBranchId');
  name: string;
  public JsonObj = [];
  // public fnCommonExportTOExcel = fnCommonExportTOExcel;
  // public fnCommonPrint = fnCommonPrint;
  ddlvalue: any;
  ddlselected = 0;
  constructor(public appService: AppService, public thisDialogRef: MatDialogRef<LedgerdialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Observable<any>) {

    // tslint:disable-next-line:no-shadowed-variable
    this.data.subscribe(data => {
      this.JsonObj = JSON.parse(data);

    });
    this.fnVoucherPrefixGets();
  }

 fnCommonExportTOExcel(myList, excelFileName) {

    var strTempBranchName = localStorage.getItem('SessionBranchName');
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([], { header: [] });
    XLSX.utils.sheet_add_json(ws, myList, { skipHeader: false, origin: { r: 2, c: 0 } });
  
    var dColumnValueLen = 0;
    var wscols = [];
  
    var col = [];
    for (var i = 0; i < myList.length; i++) {
      for (var key in myList[i]) {
        if (col.indexOf(key) === -1) {
          col.push(key);
        }
      }
    }
  
    for (var j = 0; j < col.length; j++) {
  
      var result = Object.keys(myList).map(e => myList[e][col[j]]);
      var longest = result.reduce((a, b) => String(a).length > String(b).length ? a : b, '');
      longest = String(longest);
      if (longest == undefined || longest == null) {
        longest = '000';
      }
      if (parseFloat(longest.length) < parseFloat(col[j].length || 0)) {
        longest = col[j];
      }
      dColumnValueLen = parseInt(longest.length || 0) + 2;
      wscols.push({ wch: dColumnValueLen });
    }
  
    ws['!cols'] = wscols;
  
    if (!ws['!merges'])
      ws['!merges'] = [];
    ws["!merges"].push({ s: { r: 0, c: 0 }, e: { r: 0, c: col.length - 1 } }); /* A1:A2 */
    ws["!merges"].push({ s: { r: 1, c: 0 }, e: { r: 1, c: col.length - 1 } }); /* A1:A2 */
  
  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
  
  
    XLSX.utils.sheet_add_aoa(ws, [
      [strTempBranchName]
    ], { origin: 0 });
    XLSX.utils.sheet_add_aoa(ws, [
      [excelFileName]
    ], { origin: 1 });
  
    // ws['!rows'] = [{ hpx: 40 }];
  
    // var cell_ref = XLSX.utils.encode_cell({c:0,r:0});
    // cell_ref.fontcolor
  
    // merge_format = wb.add_format({
    //   'bold': 1,
    //   'border': 1,
    //   'align': 'center',
    //   'valign': 'vcenter',
    //   'fg_color': 'yellow'})
  
    // wrapAndCenterCell(ws.A1);
    // wb["Sheets"]["A1"] = {"fgColor":"#FF0000"}; 
    // ws.A1 = { fill: {patternType: "none",  font: {sz: 14, bold: true, color: "#FF00FF",textAlign:"center" }} }
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, excelFileName + '.xlsx');
    return;
  }

  async fnVoucherPrefixGets() {

    var ServiceParams = {};
    ServiceParams['strProc'] = 'VoucherPrefix_GetsOnBranchId';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.BranchId;
    oProcParams.push(ProcParams);
    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    await this.appService.post('CommonQuery/fnGetDataReportNew', body).toPromise()
      .then(data => {
        this.ddlvalue = JSON.parse(data);
      }, error => console.error(error));
  }

  fnPrint() {
    let printContents, popupWin;
    printContents = document.getElementById('divReportBill').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>
         table {
           width:100%;
           border-collapse: collapse;
         }
         table th{
          padding: 5px;
          border: 1px solid #000;
         }
         table td{
          padding: 5px;
          border: 1px solid #000;
        }
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();

  }

  myPageChange(eve) {
    // this.showReport = false
  }

}

