import { Component, OnInit, ViewChild, ElementRef, HostListener, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap, switchMap, finalize } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';
import { Observable, of } from 'rxjs';
import { PosPageService } from './pos-page.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AccountHeadComponent } from '../../master/account-head/account-head.component';

@Component({
  selector: 'app-pos-page',
  templateUrl: './pos-page.component.html',
  styleUrls: ['./pos-page.component.scss']
})

export class PosPageComponent implements OnInit {
  @ViewChild('qty') qtyFocus: ElementRef;
  @ViewChild('product') productFocus: ElementRef;
  @ViewChild('tblname') tableFocus: ElementRef;
  @ViewChild('salesman') salesmanFocus: ElementRef;
  @ViewChild('posscroll') posscroll: ElementRef;

  tblData: any = [];
  salesData: any = [];

  tableControl = new FormControl();
  filteredTable: any = [];
  tbloading: boolean;
  dropDisc = "perc";
  roomControl = new FormControl();
  filteredRoom: any = [];
  roomloading: boolean;
  index = 0;
  salesControl = new FormControl();
  filteredSalesman: any = [];
  salesloading: boolean;
  dStrQty = 1;
  productControl = new FormControl();
  filteredProduct: any = [];
  productloading: boolean;
  chkCode: boolean = false;

  chkDisabled: boolean = false;
  bAlreadyExist: boolean = false;
  billserice: any = [];
  btnRoom: boolean = false;
  tempProdId: number = 0;
  PayTerms = 'CASH';
  touchOnOff = false;
  loadingListData: boolean = false;


  public fieldArray: Array<any> = [];
  private newAttribute: any = {};
  rowId = null;
  billDetailed: any = [];
  btntoggle: boolean = true;
  public toggleFlag = false;
  selectType = 'Table';
  tableSource: any = [];
  roomsData: any = [];
  tblListData: any = [];
  curntItm = null;
  finalPers = 0;
  finalAmount = 0;
  dRof = 0;
  dBranchId: any = localStorage.getItem('SessionBranchId');
  objkotMain = {
    Table_Id: 0,
    TableDetail_Id: 0,
    BillSerId: 0,
    Kot_CustName: '',
    Room_Id: 0,
    Kot_Mobile: 0,
    Kot_TempOrderNo: 0,
    Kot_Id: 0,
  };
  strSelectedTableChairName: any;
  strSelectedTableName: any;
  strBillTotal: any = 0;
  strRoomNo: any;
  discountFlag = false;

  public settings: any = {
    strKotPrintType: '',
    strRof: '',
    strInclusiveCalRoom: '',
    getImagePath: ''
  }
  sub: any;
  kotTotal: number = 0.00;
  billNo: any = '0';
  billSerId: any = '0';
  uniqueId: any = '0';
  constructor(private appservice: AppService, private posservice: PosPageService,
    private activatedRoute: ActivatedRoute, public dialog: MatDialog) {

  }

  ngOnInit(): void {

    // Room filter
    this.roomControl.valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.filteredRoom = [];
        this.roomloading = true;
      }),
      switchMap(value => this.filterRoomn(value)
        .pipe(finalize(() => {
          this.roomloading = false
        }),
        )
      )
    ).subscribe(data => {
      this.filteredRoom = data;
    });

    // table filter
    this.tableControl.valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.filteredTable = [];
        // this.tbloading = true;
      }),
      switchMap(value => this.filterTable(value)
        .pipe(finalize(() => {
          this.tbloading = false
        }),
        )
      )
    ).subscribe(data => {
      this.filteredTable = data;
    });

    // Salesman filter

    this.salesControl.valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.filteredSalesman = [];
        this.salesloading = true;
      }),
      switchMap(value => this.posservice._salesman_Get(value)
        .pipe(finalize(() => {
          this.salesloading = false
        }),
        )
      )
    ).subscribe(data => {
      this.filteredSalesman = JSON.parse(<any>data);
      if (this.filteredSalesman.length) {
        this.strKotSalesmanId = this.filteredSalesman[0].AC_Id;
      }

    });


    // product filter

    this.productControl.valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      tap(() => {
        this.filteredProduct = [];
        // this.productloading = true;
      }),
      switchMap(value => this.posservice._product_Get(value, this.chkCode)
        .pipe(finalize(() => {
          this.productloading = false
        }),
        )
      )
    ).subscribe(data => {
      let jsonData: any = data;
      this.filteredProduct = JSON.parse(jsonData.JsonDetails[0]);
    });

    this.sub = this.activatedRoute.queryParams.subscribe(params => {
      if (params['billno'] != null && params['billno'] != undefined) {
        this.billNo = params['billno'];
        this.billSerId = params['billSerId'];
        this.uniqueId = params['uniqueId'];
        this.fnFillBillLists(params['billSerId'], params['billno'], params['uniqueId']);
      }
    });
  }

  ngAfterViewInit(): void {
    this.onfnSettings();

    setTimeout(() => {
      this.tableFocus.nativeElement.focus();
    }, 800);
  }

  filterTable(val: string): Observable<any[]> {
    return val ? <any>this.appservice.get(`GetRepository/GetTableDetails?table=${val}&branchId=${this.dBranchId}`) : of([])
  }

  filterRoomn(val: string): Observable<any[]> {
    return val ? <any>this.appservice.get(`GetRepository/getRooms?terms=${val}&branchId=${this.dBranchId}`) : of([])
  }
  strKotSalesmanId = '0';

  salesmanChange(item) {
    this.strKotSalesmanId = item.AC_Id;
    setTimeout(() => {
      this.productFocus.nativeElement.focus();
    });


  }



  roomChange(event) {
    this.objkotMain.Room_Id = event.option.id;
    this.salesmanFocus.nativeElement.focus();
  }

  productChange(event) {
    this.tempProdId = event.option.id;
    setTimeout(() => {
      this.qtyFocus.nativeElement.focus();
      this.qtyFocus.nativeElement.select();
    });

  }

  tempRowField = {};
  rowClick(item, index) {
    this.tempRowField = item;
    if (this.rowId == index) {
      this.rowId = null;
      return
    }
    this.rowId = index;
  }

  increase() {
    const row: any = this.tempRowField;
    const index = this.fieldArray.indexOf(row);
    this.fieldArray[index].qty = parseFloat(this.fieldArray[index].qty || 0) + 1;
    this.fnkotTotal();
  }

  decrease() {
    const row: any = this.tempRowField;
    const index = this.fieldArray.indexOf(row);
    if (this.fieldArray[index].qty > 0) {
      this.fieldArray[index].qty = parseFloat(this.fieldArray[index].qty || 0) - 1;
      this.fnkotTotal();
    }

  }

  removeRow() {
    const row: any = this.tempRowField;
    this.rowdelete(row);
  }

  rowdelete(item) {
    const index = this.fieldArray.indexOf(item);
    this.fieldArray.splice(index, 1);
    this.fnkotTotal();
    this.rowId = null;
  }

  getProductDetails(id) {
    this.tempProdId = id;
    this.fnAddRow('1');
  }

  fnAddRow(qty) {
    const ProductId = this.tempProdId;
    let jsondata: any;
    let ServiceParams = {};
    ServiceParams['strProc'] = 'Stock_CheckGets';
    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'ProductId';
    ProcParams['strArgmt'] = ProductId.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'branchId';
    ProcParams['strArgmt'] = this.dBranchId.toString();
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this.appservice.post('CommonQuery/fnGetDataReportNew', body)
      .toPromise().then(data => {
        jsondata = JSON.parse(data);

      });

    if (jsondata && jsondata[0].BalanceQty < this.dStrQty && jsondata[0].Stock_Check == 1) {
      this.appservice.openSnackBar('Invalid stock Quantity', '');
      return;
    }
    this.appservice.get('GetRepository/Product_GetOnProductId?dProductId=' + ProductId + '&branchId=' + this.dBranchId).toPromise()
      .then(result => {
        let prod = result[0];
        this.newAttribute = {
          id: prod.ProductId,
          prodName: prod.ProductName,
          qty: qty,
          price: prod.Sel_Rate,
          MRP: prod.MRP_Rate,
          dis: prod.Discount,
          tax: prod.TaxPercent,
          taxId: prod.TaxId,
          SGSTTaxPers: prod.SGSTTaxPers,
          CGSTTaxPers: prod.CGSTTaxPers,
          IGSTTaxPers: prod.IGSTTaxPers,
          amount: 0.00
        };
        // this.posscroll.nativeElement.scrollTo({ left: 0, top: this.posscroll.nativeElement.scrollHeight + 10, behavior: 'smooth' });
        this.bAlreadyExist = false;
        for (let j = 0; j < this.fieldArray.length; j++) {

          if (parseFloat(this.fieldArray[j].id || 0) == parseFloat(prod.ProductId || 0)) {
            // this.fieldArray[j].qty = parseFloat((this.fieldArray[j].qty) || 0) + parseFloat(this.newAttribute.qty || 0);
            let element = <HTMLInputElement>document.getElementById('addQty');
            // element.focus();
            this.bAlreadyExist = true;
            if (this.bAlreadyExist) {
              //Otherwise Angular throws error: Expression has changed after it was checked.
              window.setTimeout(() => {
                element.focus(); //For SSR (server side rendering) this is not safe. Use: https://github.com/angular/angular/issues/15008#issuecomment-285141070)
              });
            }

            this.index = j;




          }
        }
        if (this.bAlreadyExist == false) {
          this.addFieldValue();
        }
        setTimeout(() => {
          this.fnreset();
        }, 100);
      });

  }

  addQuantity() {
    this.addFieldValue();
    this.bAlreadyExist = false;
  }

  fnReplace() {
    const j = this.index;
    this.fieldArray[j].qty = parseFloat((this.fieldArray[j].qty) || 0) + parseFloat(this.newAttribute.qty || 0);
    this.bAlreadyExist = false;
    this.fnkotTotal();
    this.productControl.reset();
    this.productFocus.nativeElement.focus();
  }

  fnCancel() {
    this.productFocus.nativeElement.focus();
    this.productControl.setValue("");
  }

  addFieldValue() {
    this.fieldArray.push(this.newAttribute)
    this.newAttribute = {};
    this.fnkotTotal();
    setTimeout(() => {
      if (this.productFocus)
        this.productFocus.nativeElement.focus();

      this.productControl.reset();
      this.dStrQty = 1;
      this.fnreset();
    });
  }

  onfnSettings() {
    this.posservice.fnSettings()
      .toPromise()
      .then(x => {
        const settings = JSON.parse(x);
        for (const setting of settings) {
          if (setting.KeyValue == 'KotPrintType') {
            this.settings.strKotPrintType = setting.Value;
          } else if (setting.KeyValue == 'SRof') {
            this.settings.strRof = setting.Value;
          } else if (setting.KeyValue == 'Touch') {
            // this.settings.strRof = setting.Value;
          } else if (setting.KeyValue == 'MRPINCLUSIVESALES') {
            this.settings.strInclusiveCalRoom = setting.Value;
          }
          else if (setting.KeyValue == 'ImageSaveFolderName') {
            this.settings.getImagePath = setting.Value;
          }
        }
      }).finally(() => {
        this.getBillSerice();
      })
  }

  getBillSerice() {

    this.appservice.get('GetRepository/GetBillSerice').toPromise()
      .then(result => {
        this.billserice = result;
        this.objkotMain.BillSerId = this.billserice[0].BillSerId;
        this.fnGetssAll();
      }, error => console.error(error));
  }
  // tableChange(event) {
  //   this.objkotMain.Table_Id = event.option.id;
  //   this.salesmanFocus.nativeElement.focus();
  // }
  selectTableDetail(TableDtailId, val) {
    let id = 0
    if (val == 'normal') { id = TableDtailId.TableDetailsId } else { id = TableDtailId.TableDetails_Id }

    this.appservice.get('GetRepository/TableDetailsGet_OnName?TableDetailId=' + id).toPromise()
      .then(result => {
        const data: any = result[0];
        // this.fnClear();
        this.strSelectedTableChairName = data.TableDetails_Name;
        this.strSelectedTableName = data.Table_Name;
        this.objkotMain.Table_Id = data.Table_Id;
        this.objkotMain.TableDetail_Id = data.TableDetails_Id;
        this.strKotSalesmanId
        this.objkotMain.Kot_TempOrderNo = data.BillNo;
        this.selectType = 'Table';
        // this.strShowData = 'Room';
        this.PayTerms = 'CASH';
        this.billTableSettile(data.TableDetails_Id);
      }, error => console.error(error));

  }

  billTableSettile(id) {

    this.posservice.fnKotBillGetOnTableDetailId(id)
      .subscribe(async data => {
        this.billDetailed = JSON.parse(data);
        this.fnBilltotal();

        if (this.billDetailed.length > 0 && this.fieldArray.length <= 0) {
          this.salesControl.setValue(this.billDetailed[0].AC_Name);
          //  this.strKotSalesman = this.billDetailed[0].AC_Name
          for await (const iterator of this.billDetailed) {
            if (iterator.Kot_CustName != null && iterator.Kot_CustName != '') {
              this.objkotMain.Kot_CustName = iterator.Kot_CustName;
            }

            if (iterator.Kot_Mobile != null && iterator.Kot_Mobile != '') {
              this.objkotMain.Kot_Mobile = iterator.Kot_Mobile;

            }
          }
          if (!this.touchOnOff) {
            this.productFocus.nativeElement.focus();
          }

        } else {
          this.salesmanFocus.nativeElement.focus();
        }
        if (this.toggleFlag) {
          this.selectTableTouch()
        }
      });
  }

  selectTableTouch() {
    this.touchOnOff = true;
    this.toggleFlag = false;

  }

  public selectRoomDetail(value) {
    this.selectType = 'Room';
    this.PayTerms = 'CASH';

  }




  fnGetssAll() {
    this.posservice.fnGetAllTableDetails()
      .toPromise().then(res => {
        this.tblData = res;

      }).finally(() => {
        this.posservice.fnAllSalesManGetsAll()
          .subscribe(res => {
            this.salesData = JSON.parse(res);


          })
      })
  }

  fnNormalChange(eve) {
    this.chkDisabled = eve.checked;
    if (eve.checked) {
      this.tableControl.setValue(this.tblData[0].TableDetailsCode);

      this.selectTableDetail(this.tblData[0], 'normal');

      this.salesControl.setValue(this.salesData[0].AC_Name);
      this.strKotSalesmanId = this.salesData[0].AC_Id;

      this.productFocus.nativeElement.focus();
      this.posservice.fnGetAllTableDetails()

    } else {
      this.salesControl.reset();
      this.tableControl.reset();
      this.strKotSalesmanId = null;
      this.objkotMain.Table_Id = 0;
      this.objkotMain.TableDetail_Id = 0;
    }

  }





  public fnkotTotal() {

    let dQty = 0, dSelRate = 0, dAmount = 0, dTaxPers = 0, dTaxAmt = 0,
      dTotal = 0, dRowAmtBeforeTax = 0, dSelRateBeforeTax = 0;
    let dDisPer = 0, dDisAmt = 0;
    for (let j = 0; j < this.fieldArray.length; j++) {
      let row = this.fieldArray[j]
      dSelRate = 0, dAmount = 0;
      //  if (this.dQty == null) {

      dQty = parseFloat((row.qty) || 0);

      //  } else {
      //   dQty = this.dQty;
      //  }


      dSelRate = parseFloat((row.price) || 0);
      dTaxPers = parseFloat((row.tax) || 0);
      dDisPer = parseFloat((row.dis) || 0);
      dSelRateBeforeTax = dSelRate;
      if (this.settings.strInclusiveCalRoom == 'Yes') {
        dSelRateBeforeTax = dSelRate - ((dSelRate * dTaxPers) / (100 + dTaxPers));
      }
      dRowAmtBeforeTax = dQty * dSelRateBeforeTax;
      dDisAmt = (dRowAmtBeforeTax * dDisPer) / 100;
      dRowAmtBeforeTax = dRowAmtBeforeTax - dDisAmt;
      dTaxAmt = (dRowAmtBeforeTax * dTaxPers) / 100;
      dAmount = dRowAmtBeforeTax + dTaxAmt;
      //  dTaxAmt = (dSelRate * dTaxPers) / 100;
      //  dAmount = (dQty * dSelRate) + (dQty * dTaxAmt);
      // row.dis = dDisAmt.toFixed(3);
      row.amount = dAmount.toFixed(3);
      // row.tax = dTaxAmt.toFixed(3);
      dTotal = dAmount + dTotal;

    }
    this.totalKot();
  }

  public fnBilltotal() {
    this.strBillTotal = this.billDetailed.length ? this.billDetailed.map(x => parseFloat(x.KotSub_Amt || 0)).reduce((a, b) => a + b) : 0.00;
  }

  totalKot() {
    this.kotTotal = this.fieldArray.length ? this.fieldArray.map(x => parseFloat(x.amount || 0)).reduce((a, b) => a + b) : 0.00;
  }
  // this.kotTotal =


  toggleChange(eve) {
    this.btntoggle = true;
    this.toggleFlag = eve.checked;
    this.touchOnOff = eve.checked;

    if (eve.checked) {
      this.fntableGet();
      this.fnNormalChange(false)
    } else {
      this.fnClear();
    }

  }


  btntoggleChange(eve) {
    this.curntItm = null;
    const colname = eve;
    this.btntoggle = !this.btntoggle;
    this.tblListData = [];

    if (colname == "room") {
      this.posservice.getRooms().subscribe(data => {
        this.roomsData = data;
      })
    } else {
      this.fntableGet();
    }
  }

  fntableGet() {
    this.posservice.getTables().subscribe(data => {
      this.tableSource = data;
    })
  }


  tableclick(item, index) {
    this.tblListData = [];
    this.loadingListData = true;
    this.curntItm = index;
    this.appservice.get('GetRepository/TableDetailsGet?TableId=' + item.TableId)
      .subscribe(data => {
        this.tblListData = data;
      
        this.loadingListData = false;
      })
  }

  fnBtnRoom() {
    this.btnRoom = !this.btnRoom;
    if (this.btnRoom) {
      this.selectType = 'Room';
    } else {
      this.selectType = 'Table';
    }
  }

  fnBtnRefresh(): void {
    window.location.reload();
  }

  roomClick(item, idx) {
    this.curntItm = idx;
    let ServiceParams = {};
    ServiceParams['strProc'] = 'RoomGetOn_RoomId';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'RoomId';
    ProcParams['strArgmt'] = item.Room_Id.toString();
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);

    this.appservice.post('CommonQuery/fnGetDataReportNew', body)
      .subscribe(data => {
        let dataRep = JSON.parse(data);

        if (!dataRep.length) {
          return
        }
        this.salesControl.reset();
        this.objkotMain.Kot_CustName = dataRep[0].CustomerName;
        this.objkotMain.Kot_Mobile = dataRep[0].Phone;
        // this.objkotMain.Room_Id = item.Room_No;
        this.strRoomNo = item.Room_No;
        this.objkotMain.Room_Id = item.Room_Id;
        this.selectType = 'Room';
        // this.strShowData = 'Table';
        this.PayTerms = 'CASH';
        this.objkotMain.Kot_TempOrderNo = item.BillNo;
        this.fnKotBillGetOnRoomId(item.Room_Id)
      })
  }


  fnKotBillGetOnRoomId(roomId) {

    let ServiceParams = {};
    ServiceParams['strProc'] = 'KotRoom_GetOnTempInvoiceNo';

    let oProcParams = [];
    let ProcParams = {};
    ProcParams['strKey'] = 'RoomId';
    ProcParams['strArgmt'] = roomId.toString();
    oProcParams.push(ProcParams);
    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);

    this.appservice.post('CommonQuery/fnGetDataReportNew', body)
      .subscribe(data => {
        this.billDetailed = JSON.parse(data);
        this.fnBilltotal();
        if (this.billDetailed.length > 0) {
          this.salesControl.setValue(this.billDetailed[0].AC_Name);
          if (this.productFocus)
          this.productFocus.nativeElement.focus();
        } else {
          if (this.productFocus)
          this.salesmanFocus.nativeElement.focus();
        }
        this.selectTableTouch();
      })

  }

  ListIssueSub = [];
  ListIssueSubKot = [];

  fnGetTotal() {
    this.ListIssueSub = [];
    this.ListIssueSubKot = [];
    let dQty = 0, dSelRate = 0, dAmount = 0, dTaxPers = 0, dTaxAmt = 0,
      dfinalTotal = 0, dRowAmtBeforeTax = 0, dSelRateBeforeTax = 0, ProductDisc = 0, ProdDicVal = 0;
    let dDisPer = 0, dDisAmt = 0;
    let ListIssue = [];
    let IssueSub = {};
    if (this.fieldArray.length > 0) {
      for (const rows of this.fieldArray) {
        dSelRate = 0, dAmount = 0;
        dQty = 0, dSelRate = 0, dAmount = 0;
        dSelRateBeforeTax = 0; dTaxAmt = 0;
        dQty = parseFloat((rows.qty) || 0);
        dSelRate = parseFloat((rows.price) || 0);
        dTaxPers = parseFloat((rows.tax) || 0);

        dDisPer = parseFloat(rows.dis || 0);

        dSelRateBeforeTax = dSelRate;
        if (this.settings.strInclusiveCalRoom == 'Yes') {
          dSelRateBeforeTax = dSelRate - ((dSelRate * dTaxPers) / (100 + dTaxPers));
        }

        dRowAmtBeforeTax = dQty * dSelRateBeforeTax;
        dDisAmt = (dRowAmtBeforeTax * dDisPer) / 100;
        dRowAmtBeforeTax = dRowAmtBeforeTax - dDisAmt;
        let percval = (dRowAmtBeforeTax * this.finalPers) / 100;
        dRowAmtBeforeTax = dRowAmtBeforeTax - percval;
        dTaxAmt = (dRowAmtBeforeTax * dTaxPers) / 100;


        dAmount = dRowAmtBeforeTax + dTaxAmt;
        // this.rows[j].KotSub_Amt = dAmount.toFixed(3);
        // this.rows[j].KotSub_TaxAmt = dTaxAmt.toFixed(3);
        // this.rows[j].KotSub_DisAmt = dDisAmt.toFixed(3);
        dfinalTotal = (dfinalTotal + dAmount);

        IssueSub = {};
        IssueSub['IssuesSubQty'] = dQty;
        IssueSub['IssuesSubActualRate'] = dSelRate;
        IssueSub['IssuesSubTaxPercent'] = dTaxPers;
        IssueSub['ProductId'] = parseFloat((rows.id) || 0);
        IssueSub['IssuesSubPurRate'] = parseFloat((rows.price) || 0);
        IssueSub['IssuesSubMrp'] = parseFloat((rows.MRP) || 0);
        IssueSub['IssuesSubTaxAmt'] = dTaxAmt;
        IssueSub['IssuesSubAmt'] = dAmount;
        IssueSub['BillSerId'] = this.objkotMain.BillSerId;
        IssueSub['IssuesSubTaxId'] = parseFloat((rows.taxId) || 0);
        IssueSub['IssuesSubSgsttaxPercent'] = parseFloat((rows.SGSTTaxPers) || 0);
        IssueSub['IssuesSubCgsttaxPercent'] = parseFloat((rows.CGSTTaxPers) || 0);
        IssueSub['IssuesSubIgsttaxPercent'] = parseFloat((rows.IGSTTaxPers) || 0);
        IssueSub['IssuesSubSgsttaxAmt'] = dTaxAmt / 2;
        IssueSub['IssuesSubCgsttaxAmt'] = dTaxAmt / 2;
        IssueSub['IssuesSubIgsttaxAmt'] = 0;
        IssueSub['BranchId'] = parseFloat(this.dBranchId || 0);
        IssueSub['StoreBatchSlNo'] = 0;
        IssueSub['IssuesSubFeildNo1'] = 0;
        IssueSub['IssuesSubFeildNo2'] = 0;
        IssueSub['IssuesSubDiscPerc'] = dDisPer;
        IssueSub['IssuesSubDiscAmnt'] = dDisAmt;
        this.ListIssueSub.push(IssueSub);
      }

    } else {
      for (const iterator of this.billDetailed) {
        dSelRate = 0, dAmount = 0;
        dQty = 0, dSelRate = 0, dAmount = 0;
        dSelRateBeforeTax = 0; dTaxAmt = 0;
        dDisPer = 0; dDisAmt = 0
        dQty = parseFloat((iterator.KotSub_Qty) || 0);
        dSelRate = parseFloat((iterator.KotSub_ActualRate) || 0);
        dTaxPers = parseFloat((iterator.TaxPercent) || 0);
        dSelRateBeforeTax = dSelRate;
        dDisPer = iterator.KotSub_DisPers;

        if (this.settings.strInclusiveCalRoom == 'Yes') {
          dSelRateBeforeTax = dSelRate - ((dSelRate * dTaxPers) / (100 + dTaxPers));
        }
        dRowAmtBeforeTax = dQty * dSelRateBeforeTax;

        dDisAmt = (dRowAmtBeforeTax * dDisPer) / 100;
        dRowAmtBeforeTax = dRowAmtBeforeTax - dDisAmt;

        let percval = (dRowAmtBeforeTax * this.finalPers) / 100;
        dRowAmtBeforeTax = dRowAmtBeforeTax - percval;

        dTaxAmt = (dRowAmtBeforeTax * dTaxPers) / 100;
        dAmount = dRowAmtBeforeTax + dTaxAmt;
        // this.dataReport[j].KotSub_Amt = dAmount.toFixed(3);
        // this.dataReport[j].KotSub_DisAmt = dDisAmt.toFixed(3);

        dfinalTotal = dAmount + dfinalTotal;

        IssueSub = {};
        IssueSub['IssuesSubQty'] = dQty;
        IssueSub['IssuesSubActualRate'] = dSelRate;
        IssueSub['IssuesSubTaxPercent'] = dTaxPers;
        IssueSub['ProductId'] = parseFloat((iterator.ProductId) || 0);
        IssueSub['IssuesSubPurRate'] = dSelRate;
        IssueSub['IssuesSubMrp'] = parseFloat((iterator.KotSub_MRP) || 0);
        IssueSub['IssuesSubTaxAmt'] = dTaxAmt;
        IssueSub['IssuesSubAmt'] = dAmount;
        IssueSub['BillSerId'] = this.objkotMain.BillSerId;
        IssueSub['IssuesSubTaxId'] = parseFloat((iterator.TaxId) || 0);
        IssueSub['IssuesSubSgsttaxPercent'] = parseFloat((iterator.SGSTTaxPers) || 0);
        IssueSub['IssuesSubCgsttaxPercent'] = parseFloat((iterator.CGSTTaxPers) || 0);
        IssueSub['IssuesSubIgsttaxPercent'] = parseFloat((iterator.IGSTTaxPers) || 0);
        IssueSub['IssuesSubSgsttaxAmt'] = dTaxAmt / 2;
        IssueSub['IssuesSubCgsttaxAmt'] = dTaxAmt / 2;
        IssueSub['BranchId'] = parseFloat(this.dBranchId || 0);
        IssueSub['StoreBatchSlNo'] = 0;
        IssueSub['IssuesSubFeildNo1'] = 0;
        IssueSub['IssuesSubFeildNo2'] = 0;
        IssueSub['IssuesSubDiscPerc'] = dDisPer;
        IssueSub['IssuesSubDiscAmnt'] = dDisAmt;
        IssueSub['IssuesAtotal'] = dfinalTotal;
        IssueSub['IssuesRof'] = this.dRof;
        this.ListIssueSubKot.push(IssueSub);
      }
      this.strBillTotal = dfinalTotal.toFixed(3);
    }
  }

  saveBill() {
    if (this.selectType == 'Table' && !this.objkotMain.Table_Id) {
      this.appservice.openSnackBar('Please Select Table!', 'error');
      return;
    }

    if (this.selectType == 'Room' && !this.objkotMain.Room_Id) {
      this.appservice.openSnackBar('Please Select Room!', 'error');
      return;
    }

    if (!this.salesControl.value && !this.strKotSalesmanId) {
      this.appservice.openSnackBar('You must Choose salesman', 'error');
      return;
    }

    if (!this.billDetailed.length) {
      this.appservice.openSnackBar('Bill empty!', 'error');
      return;
    }

    this.fnGetTotal();

    let ListIssue = [];
    let Issue = {};
    Issue['TableDetailId'] = this.objkotMain.TableDetail_Id;
    Issue['TableId'] = this.objkotMain.Table_Id;
    Issue['IssuesCustName'] = this.objkotMain.Kot_CustName;
    Issue['IssuesMobile'] = this.objkotMain.Kot_Mobile.toString();
    Issue['IssuesTotal'] = parseFloat(this.strBillTotal || 0);
    Issue['BillSerId'] = this.objkotMain.BillSerId;
    Issue['BranchId'] = parseFloat(this.dBranchId || 0);
    Issue['IssuesTempOrderNo'] = this.objkotMain.Kot_TempOrderNo;
    Issue['KotId'] = this.objkotMain.Kot_Id;
    Issue['RoomId'] = this.objkotMain.Room_Id;
    Issue['IssuesOrderFrom'] = this.selectType;
    Issue['IssuesSalesmanId'] = this.strKotSalesmanId;
    Issue['IssuePayTerms'] = this.PayTerms;
    Issue['IssuesDisPers'] = this.finalPers;
    Issue['IssuesDisAmt'] = this.finalAmount;
    Issue['IssuesRof'] = this.dRof;
    Issue['IssuesAtotal'] = this.strBillTotal - this.dRof;
    Issue['IssuesBillNo'] = 0;
    Issue['UniqueNo'] = 0;
    // if (this.PayTerms == 'CARD') {
    //   Issue['Issue_CardNo'] = this.CardNumber;
    //   Issue['Issue_CardName'] = this.CardName;
    //   Issue['Issue_CardAmt'] = this.cardAmnt;
    //   Issue['Issue_Banker'] = this.BankID;
    // }
    Issue['IssueSubDetail'] = this.ListIssueSubKot;

    ListIssue.push(Issue);
    let body = JSON.stringify(Issue);
    this.appservice.post('Master/fnSaveBill', body)
      .subscribe(data => {
        let report: any = data;
        this.appservice.openSnackBar('Bill Save Successfully!', 'Success!');
        this.fnClear();
        this.tblListData = [];
        if (this.settings.strKotPrintType == 'LinePrint' || this.settings.strKotPrintType == 'Thermal') {
          this.posservice.IssuesPrint(report.BillSerId, report.IssuesBillNo, report.UniqueNo, this.selectType)
            .subscribe(x => {
              let dataReport = JSON.parse(x);

              const JsonIssueSubDetailsInfo = (dataReport[1]);
              const JsonIssueTaxInfo = (dataReport[2]);
              const JsonBranchInfo = (dataReport[3]);
              const JsonIssueInfo = (dataReport[0]);
              this.saveTextAsFile(JsonIssueInfo, JsonIssueSubDetailsInfo, JsonIssueTaxInfo, JsonBranchInfo);
            })
        } else {
          localStorage.setItem('BillSerId', report.BillSerId);
          localStorage.setItem('BillNo', report.IssuesBillNo);
          localStorage.setItem('UniqueBillNo', report.UniqueNo);
          localStorage.setItem('Issues_OrderFrom', this.selectType);
          window.open('#/print/printout');
        }
      }, err => {
        this.appservice.openSnackBar('Bill Not Valid!', 'Error!');
      })
    if (!this.touchOnOff && this.PayTerms == 'CASH') {
      this.openDialog(this.strBillTotal)
    } else {
      this.strBillTotal = 0.00;
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {

    if (event.keyCode == 113 && (this.fieldArray.length && !this.chkDisabled)) { // F2
      this.fnsaveKot();
    }

    if (event.keyCode == 115 && this.billDetailed.length) { // F4
      this.saveBill();
    }

    if (event.shiftKey && event.keyCode == 38) {
      this.productFocus.nativeElement.focus();
      this.productFocus.nativeElement.select();
    }

    if (event.keyCode == 115 && this.billDetailed.length) { // F4
      this.saveBill();
    }

    if (event.keyCode == 119) { // F8
      // if (this.billDetailed.length > 0)
      //  return;

      this.fnSaveDirectBill();
    }

    if (event.ctrlKey && event.keyCode == 68) { // ctrl + d
      this.discountFlag = true;
    }

  }


  fnSaveDirectBill() {
    if (this.selectType == 'Table' && !this.objkotMain.Table_Id) {
      this.appservice.openSnackBar('Please Select Table!', 'error');
      return;
    }

    if (this.selectType == 'Room' && !this.objkotMain.Room_Id) {
      this.appservice.openSnackBar('Please Select Room!', 'error');
      return;
    }

    if (!this.salesControl.value && !this.strKotSalesmanId) {
      this.appservice.openSnackBar('You must Choose salesman', 'error');
      return;
    }
    let ListIssue = [];
    let Issue = {};

    if (this.selectType == 'Room') {
      Issue['RoomId'] = this.objkotMain.Room_Id;
    } else {
      Issue['TableId'] = this.objkotMain.Table_Id;
      Issue['TableDetailId'] = this.objkotMain.TableDetail_Id;
    }

    Issue['BillSerId'] = this.objkotMain.BillSerId;
    Issue['IssuesCustName'] = this.objkotMain.Kot_CustName;
    Issue['IssuesMobile'] = this.objkotMain.Kot_Mobile.toString();
    Issue['IssuesTotal'] = this.kotTotal;
    Issue['BranchId'] = parseFloat(this.dBranchId || 0);
    Issue['IssuesSalesmanId'] = this.strKotSalesmanId;
    Issue['IssuePayTerms'] = this.PayTerms;
    Issue['IssuesOrderFrom'] = this.selectType;
    Issue['IssuesDisPers'] = this.finalPers;
    Issue['IssuesDisAmt'] = this.finalAmount;
    Issue['IssuesRof'] = this.dRof;
    Issue['IssuesBillNo'] = parseFloat(this.billNo || 0);
    Issue['UniqueNo'] = parseFloat(this.uniqueId || 0);
    Issue['IssuesAtotal'] = this.kotTotal - this.dRof;
    // Issue['IssuesDate'] = this.fieldArray[0].date;
    // if (this.PayTerms == 'CARD') {
    //   Issue['Issue_CardNo'] = this.CardNumber;
    //   Issue['Issue_CardName'] = this.CardName;
    //   Issue['Issue_CardAmt'] = this.cardAmnt;
    //   Issue['Issue_Banker'] = this.BankID;
    // }

    this.fnGetTotal();

    Issue['IssueSubDetail'] = this.ListIssueSub;
    // ListIssue.push(issue);
    let body = JSON.stringify(Issue);

    this.appservice.post('Master/fnSaveBill', body)
      .subscribe(data => {
        let report = data;
        // this.appservice.openSnackBar('Bill Save Successfully!', 'Success!')
        this.fnClear();
        this.billNo = '0';
        this.uniqueId = '0';
        this.billSerId = '0';
        if (this.settings.strKotPrintType == 'LinePrint' || this.settings.strKotPrintType == 'Thermal') {
          this.posservice.IssuesPrint(report.BillSerId, report.IssuesBillNo, report.UniqueNo, this.selectType)
            .subscribe(x => {
              let dataReport = JSON.parse(x);
              const JsonIssueSubDetailsInfo = (dataReport[1]);
              const JsonIssueTaxInfo = (dataReport[2]);
              const JsonBranchInfo = (dataReport[3]);
              const JsonIssueInfo = (dataReport[0]);
              this.saveTextAsFile(JsonIssueInfo, JsonIssueSubDetailsInfo, JsonIssueTaxInfo, JsonBranchInfo);
            })
        } else {
          localStorage.setItem('BillSerId', report.BillSerId);
          localStorage.setItem('BillNo', report.IssuesBillNo);
          localStorage.setItem('UniqueBillNo', report.UniqueNo);
          localStorage.setItem('Issues_OrderFrom', this.selectType);
          window.open('#/print/printout');
        }
        if (!this.touchOnOff && this.PayTerms == 'CASH') {
          this.openDialog(this.kotTotal);
        } else {
          this.kotTotal = 0.00;
        }
      });
  }


  fnsaveKot() {
    let ListKotMain = [];
    let ListKotSub = [];
    let KotMain = {};
    let KotSub = {};

    if (this.selectType == 'Table' && !this.objkotMain.Table_Id) {
      this.appservice.openSnackBar('Please Select Table!', 'error');
      return;
    }

    if (this.selectType == 'Room' && !this.objkotMain.Room_Id) {
      this.appservice.openSnackBar('Please Select Room!', 'error');
      return;
    }

    if (!this.salesControl.value && !this.strKotSalesmanId || this.strKotSalesmanId == null || this.strKotSalesmanId == '0') {
      this.appservice.openSnackBar('You must Choose salesman', 'error');
      return;
    }

    if (!this.fieldArray.length) {
      this.appservice.openSnackBar('Choose Products!', 'error');
      return;
    }

    if (this.selectType == 'Room') {
      KotMain['RoomId'] = this.objkotMain.Room_Id;
    } else {
      KotMain['TableId'] = this.objkotMain.Table_Id;
      KotMain['TableDetailId'] = this.objkotMain.TableDetail_Id;
    }

    KotMain['KotCustName'] = this.objkotMain.Kot_CustName;
    KotMain['KotMobile'] = this.objkotMain.Kot_Mobile.toString();
    KotMain['KotTotal'] = this.kotTotal;
    KotMain['KotBranchId'] = parseFloat(this.dBranchId || 0);
    KotMain['KotSalesmanId'] = this.strKotSalesmanId;
    KotMain['KotOrderFrom'] = this.selectType;

    let dQty = 0, dSelRate = 0, dAmount = 0, dTaxPers = 0, dTaxAmt = 0,
      dfinalTotal = 0, dRowAmtBeforeTax = 0, dSelRateBeforeTax = 0, Discount = 0, discAmnt = 0;

    for (let j = 0; j < this.fieldArray.length; j++) {
      const rows = this.fieldArray[j];
      dSelRate = 0, dAmount = 0; dfinalTotal = 0;
      dQty = 0, dSelRate = 0, dAmount = 0;
      dSelRateBeforeTax = 0; dTaxAmt = 0;

      dQty = parseFloat((rows.qty) || 0);
      dSelRate = parseFloat((rows.price) || 0);
      dTaxPers = parseFloat((rows.tax) || 0);
      Discount = rows.dis;

      dSelRateBeforeTax = dSelRate;
      if (this.settings.strInclusiveCalRoom == 'Yes') {
        dSelRateBeforeTax = dSelRate - ((dSelRate * dTaxPers) / (100 + dTaxPers));

      }
      dRowAmtBeforeTax = dQty * dSelRateBeforeTax;
      discAmnt = (dRowAmtBeforeTax * Discount) / 100;
      dRowAmtBeforeTax = dRowAmtBeforeTax - discAmnt;
      dTaxAmt = (dRowAmtBeforeTax * dTaxPers) / 100;
      dAmount = dRowAmtBeforeTax + dTaxAmt;
      // this.rows[j].KotSub_Amt = dAmount.toFixed(3);
      // this.rows[j].KotSub_TaxAmt = dTaxAmt.toFixed(3);

      KotSub = {};
      KotSub['KotSubQty'] = dQty;
      KotSub['KotSubActualRate'] = dSelRate;
      KotSub['KotSubTaxPercent'] = dTaxPers;
      KotSub['ProductId'] = parseFloat((rows.id) || 0);
      KotSub['KotSubPurRate'] = parseFloat((rows.price) || 0);
      KotSub['KotSubMrp'] = parseFloat((rows.MRP) || 0);
      KotSub['KotSubTaxAmt'] = dTaxAmt;
      KotSub['KotSubAmt'] = dAmount;
      KotSub['KotSubDisPers'] = Discount;
      KotSub['KotSubDisAmt'] = discAmnt;
      ListKotSub.push(KotSub);

    }

    KotMain['KotSubDetails'] = ListKotSub;

    ListKotMain.push(KotMain);

    let body = JSON.stringify(KotMain);
    this.appservice.post('Master/fnSaveKotPost', body)
      .subscribe(data => {
        this.appservice.openSnackBar('Kot Save Successfully!', 'Success!');
        // this.touchOnOff = false;
        this.fnClear();
        this.kotTotal = 0.00;
        this.tblListData = [];
        if (this.settings.strKotPrintType == 'LinePrint' || this.settings.strKotPrintType == 'Thermal') {

          this.posservice.fnkotBill(data, this.selectType)
            .subscribe(x => {
              let dataReport = JSON.parse(x);
              let JsonIssueSubDetailsInfo = (dataReport[1]);
              let JsonIssueTaxInfo = (dataReport[2]);
              let JsonBranchInfo = (dataReport[3]);
              let JsonIssueInfo = (dataReport[0]);
              this.saveTextAsFile(JsonIssueInfo, JsonIssueSubDetailsInfo, JsonIssueTaxInfo, JsonBranchInfo);
            })
        } else {
          localStorage.setItem('Kot_Id', data);
          localStorage.setItem('Kot_OrderFrom', this.selectType);
          window.open('#/print/kot-printout');
        }
      });
  }

  fnClear() {
    if (this.chkDisabled) {
      this.productControl.reset();
      if (this.productFocus) {
        this.productFocus.nativeElement.focus();
      }
      this.fieldArray = [];
      this.billDetailed = [];
      this.dStrQty = 1;
      this.objkotMain.Kot_CustName = '';
      return
    }

    if (this.touchOnOff) {
      this.toggleFlag = true;
    }
    this.strSelectedTableName = '';
    this.strSelectedTableChairName = '';
    this.strRoomNo = '';
    this.objkotMain.Room_Id = 0;
    this.objkotMain.Table_Id = 0;
    this.objkotMain.TableDetail_Id = 0;
    this.objkotMain.Kot_CustName = '';
    this.objkotMain.Kot_Mobile = 0;
    this.strKotSalesmanId = null;
    this.selectType = 'Table';
    this.PayTerms = 'CASH';
    this.fieldArray = [];
    this.billDetailed = [];
    this.tableControl.reset();
    this.roomControl.reset();
    this.salesControl.reset();
    this.productControl.reset();
    this.dStrQty = 1;
    if (this.tableFocus) {
      this.tableFocus.nativeElement.focus();
    }
  }

  fnGetDiscount(event, val) {

    if (val == 'Perc') {
      this.finalPers = event.target.value;
      if (this.finalPers > 99.99) {
        this.finalPers = 0
      }
      let dQty = 0, dSelRate = 0, dAmount = 0, dTaxPers = 0, dTaxAmt = 0,
        dfinalTotal = 0, dRowAmtBeforeTax = 0, dSelRateBeforeTax = 0, dTotalForDisAmtCal = 0, disperc = 0, disAmnt = 0;
      if (this.fieldArray.length > this.billDetailed) {
        for (let j = 0; j < this.fieldArray.length; j++) {

          dSelRate = 0, dAmount = 0;
          dQty = 0, dSelRate = 0, dAmount = 0;
          dSelRateBeforeTax = 0; dTaxAmt = 0;
          dQty = parseFloat((this.fieldArray[j].qty) || 0);
          dSelRate = parseFloat((this.fieldArray[j].price) || 0);
          dTaxPers = parseFloat((this.fieldArray[j].tax) || 0);
          dSelRateBeforeTax = dSelRate;
          disperc = parseFloat((this.fieldArray[j].dis) || 0);
          if (this.settings.strInclusiveCalRoom == 'Yes') {
            dSelRateBeforeTax = dSelRate - ((dSelRate * dTaxPers) / (100 + dTaxPers));
          }

          dRowAmtBeforeTax = dQty * dSelRateBeforeTax;
          disAmnt = (dRowAmtBeforeTax * disperc) / 100;
          dRowAmtBeforeTax = dRowAmtBeforeTax - disAmnt;
          dTaxAmt = (dRowAmtBeforeTax * dTaxPers) / 100;
          // dTotalForDisAmtCal += (dQty * dSelRateBeforeTax) + dTaxAmt;
          dTotalForDisAmtCal += dRowAmtBeforeTax + dTaxAmt
        }
        this.finalAmount = (this.finalPers * dTotalForDisAmtCal) / 100;
      }
      else {
        if (this.finalPers > 99.99) {
          this.finalPers = 0
        }
        for (let j = 0; j < this.billDetailed.length; j++) {

          dSelRate = 0, dAmount = 0; dfinalTotal = 0;
          dQty = 0, dSelRate = 0, dAmount = 0;
          dSelRateBeforeTax = 0; dTaxAmt = 0;
          let disperc = 0, disAmnt = 0;

          dQty = parseFloat((this.billDetailed[j].KotSub_Qty) || 0);
          dSelRate = parseFloat((this.billDetailed[j].KotSub_ActualRate) || 0);
          dTaxPers = parseFloat((this.billDetailed[j].TaxPercent) || 0);
          dSelRateBeforeTax = dSelRate;
          disperc = parseFloat((this.billDetailed[j].KotSub_DisPers) || 0);

          if (this.settings.strInclusiveCalRoom == 'Yes') {
            dSelRateBeforeTax = dSelRate - ((dSelRate * dTaxPers) / (100 + dTaxPers));
          }
          dRowAmtBeforeTax = dQty * dSelRateBeforeTax;
          disAmnt = (dRowAmtBeforeTax * disperc) / 100;
          dRowAmtBeforeTax = dRowAmtBeforeTax - disAmnt;
          dTaxAmt = (dRowAmtBeforeTax * dTaxPers) / 100;
          // dTotalForDisAmtCal += (dQty * dSelRateBeforeTax) + dTaxAmt;
          dTotalForDisAmtCal += dRowAmtBeforeTax + dTaxAmt;
        }
        this.finalAmount = (this.finalPers * dTotalForDisAmtCal) / 100;
      }

    }

    else {
      this.finalAmount = event.target.value;
      // let amnt: any = this.strKotTotal;

      let dQty = 0, dSelRate = 0, dAmount = 0, dTaxPers = 0, dTaxAmt = 0,
        dfinalTotal = 0, dRowAmtBeforeTax = 0, dSelRateBeforeTax = 0, dTotalForDisAmtCal = 0, disperc = 0, disAmnt = 0;;
      if (this.fieldArray.length > this.billDetailed) {
        for (let j = 0; j < this.fieldArray.length; j++) {

          dSelRate = 0, dAmount = 0;
          dQty = 0, dSelRate = 0, dAmount = 0;
          dSelRateBeforeTax = 0; dTaxAmt = 0;
          dQty = parseFloat((this.fieldArray[j].qtyFocus) || 0);
          dSelRate = parseFloat((this.fieldArray[j].price) || 0);
          dTaxPers = parseFloat((this.fieldArray[j].tax) || 0);
          dSelRateBeforeTax = dSelRate;
          disperc = parseFloat((this.fieldArray[j].dis) || 0);

          if (this.settings.strInclusiveCalRoom == 'Yes') {
            dSelRateBeforeTax = dSelRate - ((dSelRate * dTaxPers) / (100 + dTaxPers));
          }

          dRowAmtBeforeTax = dQty * dSelRateBeforeTax;
          disAmnt = (dRowAmtBeforeTax * disperc) / 100;
          dRowAmtBeforeTax = dRowAmtBeforeTax - disAmnt;
          dTaxAmt = (dRowAmtBeforeTax * dTaxPers) / 100;
          // dTotalForDisAmtCal += (dQty * dSelRateBeforeTax) + dTaxAmt;
          dTotalForDisAmtCal += dRowAmtBeforeTax + dTaxAmt
        }
        this.finalPers = (this.finalAmount * 100) / dTotalForDisAmtCal;
      }
      else {
        for (let j = 0; j < this.billDetailed.length; j++) {

          dSelRate = 0, dAmount = 0; dfinalTotal = 0;
          dQty = 0, dSelRate = 0, dAmount = 0;
          dSelRateBeforeTax = 0; dTaxAmt = 0;
          let disperc = 0, disAmnt = 0;

          dQty = parseFloat((this.billDetailed[j].KotSub_Qty) || 0);
          dSelRate = parseFloat((this.billDetailed[j].KotSub_ActualRate) || 0);
          dTaxPers = parseFloat((this.billDetailed[j].TaxPercent) || 0);
          dSelRateBeforeTax = dSelRate;
          disperc = parseFloat((this.billDetailed[j].KotSub_DisPers) || 0);
          if (this.settings.strInclusiveCalRoom == 'Yes') {
            dSelRateBeforeTax = dSelRate - ((dSelRate * dTaxPers) / (100 + dTaxPers));
          }
          dRowAmtBeforeTax = dQty * dSelRateBeforeTax;
          disAmnt = (dRowAmtBeforeTax * disperc) / 100;
          dRowAmtBeforeTax = dRowAmtBeforeTax - disAmnt;
          dTaxAmt = (dRowAmtBeforeTax * dTaxPers) / 100;
          // dTotalForDisAmtCal += (dQty * dSelRateBeforeTax) + dTaxAmt;
          dTotalForDisAmtCal += dRowAmtBeforeTax + dTaxAmt
        }
        this.finalPers = (this.finalAmount * 100) / dTotalForDisAmtCal;
      }
    }
    this.fnGetTotal();
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
  onscroll(rowNumber) {
    var elmnt = document.getElementById("rowNumber" + rowNumber);
    elmnt.scrollIntoView();
  }

  fnreset() {
    this.posscroll.nativeElement.scrollTo({ left: 0, top: this.posscroll.nativeElement.scrollHeight + 10, behavior: 'smooth' });
  }

  openDialog(total: number): void {
    const dialogRef = this.dialog.open(DialogPosList, {
      width: '500px',
      // height: '250px',
      data: { source: total },
      hasBackdrop: true,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      this.kotTotal = 0.00;
      this.strBillTotal = 0.00;
    });
  }

  createAccountHead(value): void {
    const dialogRef = this.dialog.open(AccountHeadComponent, {
      // width: '250px',
      minWidth: '80vw',
      data: { params: value }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }


  fnFillBillLists(billSerId, BillNo, UniqueNo) {
    let item = {};
    this.posservice.IssuesPrint(billSerId, BillNo, UniqueNo, 'table').subscribe(data => {
      let dataReport = JSON.parse(data);
      const JsonIssueSubDetailsInfo = (JSON.parse(dataReport[1]));
      const JsonIssueTaxInfo = (JSON.parse(dataReport[2]));
      const JsonBranchInfo = (JSON.parse(dataReport[3]));
      const JsonIssueInfo = (JSON.parse(dataReport[0]));
      console.log(JsonIssueInfo);

      this.salesControl.setValue(JsonIssueInfo[0].AC_Name);
      this.strKotSalesmanId = JsonIssueInfo[0].AC_Id;
      this.objkotMain.Table_Id = JsonIssueInfo[0].Table_Id;
      this.objkotMain.TableDetail_Id = JsonIssueInfo[0].TableDetail_Id;
      this.tableControl.setValue(JsonIssueInfo[0].TableDetails_Name);
      for (let i = 0; i < JsonIssueSubDetailsInfo.length; i++) {
        item = {
          id: JsonIssueSubDetailsInfo[i].ProductId,
          prodName: JsonIssueSubDetailsInfo[i].ProductName,
          qty: JsonIssueSubDetailsInfo[i].IssuesSub_Qty,
          MRP: JsonIssueSubDetailsInfo[i].MRP_Rate,
          price: JsonIssueSubDetailsInfo[i].Sel_Rate,
          dis: JsonIssueSubDetailsInfo[i].IssuesSub_DiscPerc,
          tax: JsonIssueSubDetailsInfo[i].TaxName,
          amount: JsonIssueSubDetailsInfo[i].IssuesSub_Amt,
          taxId: JsonIssueSubDetailsInfo[i].TaxGroupId,
          date: JsonIssueInfo[0].IssueDateOne
        }
        this.fieldArray.push(item);
        this.chkDisabled = true;
      }
      this.totalKot();
      this.productFocus.nativeElement.focus();
    })
  }

}



@Component({
  selector: 'dialog-Pos-list',
  templateUrl: 'dialog-pos.html',
  styleUrls: ['./pos-page.component.scss']
})
export class DialogPosList implements OnInit {
  billAmount: number = 0.00;
  Amount: number = 0.00;
  Balance: number = 0.00;
  @ViewChild("myinput") myInputField: ElementRef;
  constructor(public dialogRef: MatDialogRef<DialogPosList>,
    @Inject(MAT_DIALOG_DATA) public data: any, private appService: AppService) {

  }

  ngOnInit() {
    this.billAmount = this.data.source;
    this.Amount = this.data.source;
    setTimeout(() => {
      this.myInputField.nativeElement.focus();
      this.myInputField.nativeElement.select();
    }, 500);
  }
  ngAfterViewInit() {

  }
  fngetTotal() {
    this.Balance = this.Amount - this.billAmount
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
