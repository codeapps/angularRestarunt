import { AppService } from './../../../app.service';
import { Component, OnInit, Renderer2, Input, Output, EventEmitter, ElementRef, ViewChild, HostListener } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';

import * as XLSX from 'xlsx';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';
// import { SendgmailComponent } from '../../Master/sendgmail/sendgmail.component';
// import { SingleproductpurchaseorderComponent } from '../../purchase/singleproductpurchaseorder/singleproductpurchaseorder.component';

@Component({
  selector: 'app-report-content',
  templateUrl: './report-content.component.html',
  styleUrls: ['./report-content.component.scss']
})
export class ReportContentComponent implements OnInit {
  @ViewChild('MatTable', { read: '', static: true }) private matTableRef: ElementRef;
  nPageSearchCnt = 0;
  @ViewChild(MatSort, { read: '', static: false }) sort: MatSort;
  selectcolumn = new FormControl();
  tempReportColumns: string[] = [];
  ReportPrintType = '';

  @Input('strReportParams') public strReportParams;
  @Input('dataSource') public dataSource;
  @Input('ReportHeadName') public strReportHeadName;
  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  BranchName = localStorage.getItem('SessionBranchName');
  a: any;
  dataRep = new MatTableDataSource<any>();
  displayedColumns = [];
  reportColumns: string[] = [];

  constructor(private renderer: Renderer2, public appService: AppService) { }

  ngOnInit() {
    this.fnSettings();
    let columsHeader = [];
    let columnsIn = this.dataSource[0];
    for (var key in columnsIn) {
      columsHeader.push(key)
    }

    this.displayedColumns = columsHeader;
    this.dataRep = new MatTableDataSource(this.dataSource);
    this.dataRep.sort = this.sort;
    this.reportColumns = columsHeader;
    this.tempReportColumns = columsHeader;
    this.selectcolumn.setValue(this.tempReportColumns);
    this.fnColumnWidthSet();
  }

  fnSettings() {
    let ServiceParams = {};
    ServiceParams['strProc'] = "Setting_GetValues";
    let body = JSON.stringify(ServiceParams);
    this.appService.post('CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      const settings = JSON.parse(data);
      for (const setting of settings) {
        if (setting.KeyValue == 'ReportPrintType') {
          this.ReportPrintType = setting.Value;
        }
      }
    });
  }

  fnColumnWidthSet() {

    var dColumnValueLen = 0;
    var myList = this.dataSource;
    var wscols = [];

    var col = [];
    let columnsIn = this.dataSource[0];
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

  fnGetValue(item) {
    this.valueChange.emit(item);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataRep.filter = filterValue;
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


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setTableResize(this.matTableRef.nativeElement.clientWidth);
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
      this.dataRep.filteredData.forEach(obj => {

        var item = {}
        Object.entries(obj).forEach(([key, value]) => {

          if (DispCol.includes(key)) {

            var valueone = String(value).toUpperCase();
            if (String(valueone).includes(keywords)) {
              this.nPageSearchCnt = this.nPageSearchCnt + 1;
            }

          }

        });

      });
    }

  }

  @ViewChild(VirtualScrollerComponent, { read: '', static: false }) private virtualScroller: VirtualScrollerComponent;
  scrollChange(eve) {
    let end = eve.endIndex;
    if(this.virtualScroller && this.virtualScroller.viewPortInfo)
    setTimeout(async () => {
      let start = this.virtualScroller.viewPortInfo.endIndex;
      if (start == end) {
        await this.keyFind();
      }
    }, 200);

  }
  sortData(sort: Sort) {
    const data = this.dataRep.data.slice();
    if (!sort.active || sort.direction === '') {
      this.dataRep.filteredData = data;
      return;
    }
    this.dataRep.filteredData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      return compare(a[sort.active], b[sort.active], isAsc);
    });
  }

  pressed = false;
  currentResizeIndex: number;
  startX: number;
  startWidth: number;
  isResizingRight: boolean;
  resizableMousemove: () => void;
  resizableMouseup: () => void;

  onResizeColumn(event: any, index: number) {

    this.checkResizing(event, index);
    this.currentResizeIndex = index;
    this.pressed = true;
    this.startX = event.pageX;
    this.startWidth = event.target.clientWidth;
    event.preventDefault();
    this.mouseMove(index);
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

  mouseMove(index: number) {

    this.resizableMousemove = this.renderer.listen('document', 'mousemove', (event) => {
      // if (!event.ctrlKey) {
      //   return
      // }
      if (this.pressed && event.buttons) {
        const dx = (this.isResizingRight) ? (event.pageX - this.startX) : (-event.pageX + this.startX);
        const width = this.startWidth + dx;
        if (this.currentResizeIndex === index && width > 50) {
          this.setColumnWidthChanges(index, width);
        }
      }
    });

    this.resizableMouseup = this.renderer.listen('document', 'mouseup', (event) => {
      if (!event.ctrlKey) {
        return
      }
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
      //  this.reportColumns[index].width = newWidth;
      if (newWidth > 50) {
        // this.reportColumns[index].width = width;
        this.displayedColumns[j].width = newWidth;
      }
    }
  }

  fnDbClick(item) {

    if (this.strReportParams.hasOwnProperty("ReportName")) {
      // const ProductOrder = this.dialog.open(SingleproductpurchaseorderComponent, {
      //   // width:'850px',
      //   data: { ProductId: item.ProductId }
      // });
    }


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
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

