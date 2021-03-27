import { Component, OnInit, HostListener, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { PurchaseService } from './purchase.service';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit {
  @ViewChild('prices') public prices;
  @ViewChild('scroll') public scroll;

  @ViewChild(VirtualScrollerComponent)
  private virtualScroller: VirtualScrollerComponent;


  branchId:any = <any>localStorage.getItem('SessionBranchId'); // session branchId
  staffId: any = localStorage.getItem('SessionStaffId'); // session staffId
  btnSave: boolean;
  btnEdit: boolean;
  btnEditDisabled: boolean;
  btnSize: boolean;
  btnUpdate: boolean;
  dialogEsc: boolean;
  popupSize: boolean;
  PopupPhoneSerialNoSet: boolean;
  public strGSTName = 'GSTNo';
  public strSettingTaxName: any;
  public selectcomplete: boolean;
  public fillterItems: any[] = [];
  public colHeaders = [{ col: 'AC_Name', width: '230px' }, { col: 'Addr1', width: '200px' }, { col: 'Tin1', width: '180px' }];
  public HeaderColumn = ['Name', 'Address', 'Tin'];
  public txtAddress: string;
  public txtGSTno: any;
  public jsonBillType: any;
  productShow: boolean;
  productCodeShow: boolean;
  left: string;
  top: string;
  fillterProduct: any = [];
  public dynamicArray: Array<any> = [];
  public taxDynamic: Array<any> = [];
  public newDynamic: any = {};
  txtSoftwareName: any;
  txtProductEdit: any;
  txtAddOrMinus: any;
  txtCustomerForSoftware: any;
  txtQtyDecimalPlace: any;
  txtLandingCostVisible: any;
  txtPhoneSerialNum: any;
  txtPreviousHistory: any;
  txtPurchaseItemCode: any;
  txtEditDays: any;
  txtUniversalCodeLink: any;
  txtMrpInclusiveSales: any;
  txtRateDecimalPlace: any;
  PurchaseMarginVisible: boolean;
  PurchaseMarginVisibleRetail: boolean;
  lblOtherCharge = 'Other Charge';
  lblExciseDuty: any;
  lblPackingChg = 'Packing Charge';
  lblStampingChg = 'Stamping Charge';
  txtPrintFileName: any;
  txtExpMonthYearFormat: any;
  OrderNotificationInPurchase: boolean;
  bManufacturewiseProdCodeSet: boolean;
  bManufacturePriceSetting: boolean;
  lbltax: string;
  newDynamicColumn: any[];
  strGlobalTaxName = 'GST';
  columnHeader: any;
  fromDate = new Date();
  toDate = new Date();
  today = new Date()
  ArgSellingRateValidation: any[] = [];
  codeShift: boolean;
  bTempEditFlag: boolean;
  bSaveButtonClickProgressbar = false;
  bShodowPage = false;
  prodHeaders = [{ col: 'ProductName', width: '230px' }, { col: 'StockQty', width: '100px' }, { col: 'Manufacture', width: '180px' },
  { col: 'Sel_Rate', width: '100px' }, { col: 'MRP_Rate', width: '100px' }];
  prodColumn = ['Product Name', 'Stock', 'Manafacture', 'SellRate', 'MRP'];

  prodCodeHeaders = [{ col: 'ItemCode', width: '180px' }, { col: 'ProductName', width: '230px' }, { col: 'StockQty', width: '100px' }, { col: 'Manufacture', width: '180px' },
  { col: 'Sel_Rate', width: '100px' }];
  prodCodeColumn = ['Item Code', 'Product Name', 'Stock', 'Manafacture', 'SellRate'];

  txtBrowseExcelFlag = 'No';

  public ReceiptInfoMain = {
    PurchaseId: 0, Receipt_SlNo: 0, Receipt_InvoNo: '', Receipt_InvoDate: this.today, Receipt_Date2: this.today,
    Receipt_PayTerms: 'CREDIT', Receipt_Type: 'LOCAL', Receipt_Discount: 0, Receipt_Othercharge: 0,
    Receipt_CST: 0, Receipt_RepAmt: 0, Receipt_InvoAmt: 0, Receipt_ROF: 0, Receipt_Total: 0,
    DrNotesId: "0", StaffId: parseFloat(this.staffId || 0), AC_Id: 0, BranchId: parseFloat(this.branchId || 0), OutletId: 0,
    Excempted: 0, MRPValue: 0, PurchaseValue: 0, VatCollected: 0, Field1: '',
    DisAmt: 0, CSTAmt: 0, WholeSaleRateCalPers: 0, RetailSaleRateCalPers: 0, Receipt_Date1: '',
    LandingCost: 0, Receipt_Freight: 0, Receipt_PackingChg: 0, Receipt_StampingChg: 0,
    PurBillSerId: 0, Receipt_SupplierName: '', Receipt_Address: '', Receipt_Tin1: '',
    Receipt_Cst1: '', Receipt_DLNo1: '', Field3: 'Pers', Receipt_DbAmt: 0, Receipt_OtherTaxGrpId: 0,
    Receipt_OtherTaxPers: 0, Receipt_OtherTaxAmt: 0, Receipt_OtherSGST: 0, Receipt_OtherCGST: 0,
    Receipt_OtherIGST: 0, Receipt_PackingChgTaxGrpId: 0, Receipt_PackingChgTaxPers: 0, Receipt_PackingChgTaxAmt: 0,
    Receipt_PackingChgSGST: 0, Receipt_PackingChgCGST: 0, Receipt_PackingChgIGST: 0, Receipt_StampingChgTaxGrpId: 0,
    Receipt_StampingChgTaxPers: 0, Receipt_StampingChgTaxAmt: 0, Receipt_StampingChgSGST: 0,
    Receipt_StampingChgCGST: 0, Receipt_StampingChgIGST: 0,
  };

  bHiddenGstCtrl: boolean;
  strColumnDisplay: boolean;
  jsonTaxData: any[] = [];
  tempTaxData: any[] = [];
  ddlGroups: any;
  txtTotalSalesValue: string;
  // to total bottom table
  // txtTotQty: number;
  nCtrlNeethiDisPers: boolean;
  nCtrlWholeRateMargin: boolean;
  nCtrlSaleRate: boolean;
  nCtrlMrpCalPurRate: boolean;
  nCtrPRMrpCalTextilies: boolean;
  showBill: boolean;
  ddlbillGetseries: any;
  jsonBillGetType: any;
  purchaseSearch: string;
  billDataGets: any;
  btnSerialNoSet = true;
  btnPreview: boolean;
  btnCancel: boolean;
  btnCancelDisabled: boolean;
  btnPurchaseBillRecal: boolean;
  btnProductBrowse: boolean;
  btnProductRefresh: boolean;
  btnNewBill: boolean;
  btnConvertSalesBill: boolean;
  btnBarCodePrintAll: boolean;
  PurNo: any;
  Receipt_IntrStAmt = 0;
  ItemDisable: any[] = [];
  billseries: boolean;
  btnBrowseExcel: boolean;
  displayName: boolean;
  tableBuffer: boolean;
  pleft = '10px';
  ptop = '0px';

  popItemProduct: boolean = false;
  popProduct: boolean = false;
  bgExcel: any[] = [];
  popEscArray: {
    PurRateAdd: any; MRPRateAdd: any; DiffPriceCalcId: any;
    RetailRateAdd: string; WholeRateAdd: string; SpRateOneForCalc: string;
    SpRateTwoForCalc: string; SpRateThreeForCalc: string; SpRateFourForCalc: string;
    SpRateFiveForCalc: string; ddlRateFormulaType: any; ddlFormulaFrom: any;
    RateChangeProductId: number
  };
  escHeader: string[];
  ddlRateFormulaApply = 'CurrentRow';
  dialogueTax: boolean;
  ddlTaxGroupTaxChange: number;
  txtCurTaxRowId: any;
  prevHistryPop: boolean;
  coumnHisHead: any[];
  historyJson: any[];
  showSerialNoProd: boolean;
  SerialProdName: string;
  PhoneSerialNoProductId: number;
  txtCopyBillNo: number;
  showSizeProd: boolean;
  jsonCategorySize: any;
  ddlCategorySize: string;
  lblRetailRate: string;
  lblMRP: string;
  lblWholSalRate: string;
  lblSpRate1: string;
  lblSpRate2: string;
  lblSpRate3: string;
  lblSpRate4: string;
  lblSpRate5: string;
  bSaveFlag = true;
  typesOfPrice: string[] = ['RetailRate', 'WholeSaleRate', 'SpecialRate', 'DealerPrice'];
  popupPrintPrice: boolean;
  explength: number;
  indexs: number;

  rowIndex = 0;

  selectedRow: Number;
  rowactiveIndex: number;
  constructor(private appService: AppService, private _snackBar: MatSnackBar, public datePipe: DatePipe,
    private router: ActivatedRoute, private renderer: Renderer2, private titleService: Title,
    private purchaseService: PurchaseService) {
    this.titleService.setTitle("Purchase Bill*");
  }

  ngOnInit() {

    this.bHiddenGstCtrl = false;
    // this.fnclear();
    this.btnCancel = false;
    this.btnEdit = false;
    this.btnNewBill = false;
    this.btnConvertSalesBill = false;
    this.btnPreview = false;
    this.btnPurchaseBillRecal = false;
    this.btnUpdate = true;
    this.btnBarCodePrintAll = false;
    this.txtCopyBillNo = 0;
    this.fromDate.setDate(1)

    let today = new Date();
    let dd: any = today.getDate();
    let mm: any = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd
    }
    if (mm < 10) {
      mm = '0' + mm
    }
    this.ReceiptInfoMain.Receipt_Date1 = dd + '/' + mm + '/' + yyyy;
    this.fnGetUserPrevilage();


  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.which == 27) {
      this.popItemProduct = false;
      this.popProduct = false;
    }
    if (event.which == 113 && this.btnSave == false) {
      this.fnsave('save');
    }
  }

  ngAfterViewInit(): void {
    this.fnSettingsForSalesBill();
    this.fnddlTaxGroupOtherCharge();

    setTimeout(() => {
      document.getElementById('txtSupplier').focus();
      let b = document.querySelector("input");
      b.setAttribute("autocomplete", "off");
    });
  }

  fnFocusDate() {

    if (this.txtPurchaseItemCode == 'Yes') {
      document.getElementById('txtItemCode0').focus();
    } else {
      document.getElementById('txtproduct0').focus();
    }

  }

  fnExpDate() {
    let today: any = new Date();
    today.setMonth(today.getMonth() + 3);
    let dd = today.getDate();
    let mm = today.getMonth();
    let yyyy = today.getFullYear();

    if (dd < 10) {
      dd = '0' + dd
    }

    if (mm == 0)
      mm = mm + 1;

    if (mm < 10) {
      mm = '0' + mm
    }

    if (mm == 2)
      dd = 26;
    if (dd != 1)
      dd = dd - 1;

    if (dd < 10) {
      dd = '0' + dd
    }

    if (this.txtSoftwareName == 'RetailPharma' || this.txtSoftwareName == 'WholeSalePharma' ||
      this.txtExpMonthYearFormat == 'Yes') {
      today = mm + '/' + yyyy;
    } else {
      today = dd + '/' + mm + '/' + yyyy;
    }

    return today;

  }

  async fnBillSeries_Gets() {
    let ServiceParams = {};
    ServiceParams['strProc'] = "PurBillSeries_GetsStaffwise";

    let oProcParams = [];
    let ProcParams = {};

    ProcParams["strKey"] = "StaffId";
    ProcParams["strArgmt"] = this.staffId;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.branchId;
    oProcParams.push(ProcParams)

    ServiceParams['oProcParams'] = oProcParams;
    // fnGetDataReportBranchStaff
    await this.appService.post('CommonQuery/fnGetDataReportNew', ServiceParams)
      .toPromise().then(data => {
        this.jsonBillType = JSON.parse(data);
        if (this.jsonBillType == '') { return; }
        this.ReceiptInfoMain.PurBillSerId = this.jsonBillType[0].PurBillSerId;
        this.jsonBillGetType = JSON.parse(data);
        this.ddlbillGetseries = this.jsonBillGetType[0].PurBillSerId;
      }).catch((res) => console.error(res)).finally(() => {
        this.fnGetMaxBillNo();
      });
  }

  async fnGetMaxBillNo() {

    let BillSerId = this.ReceiptInfoMain.PurBillSerId;
    let BranchId = this.branchId;

    let ServiceParams = {};
    ServiceParams['strProc'] = "PurBillSeries_GetMaxBillNo";

    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "BillSerId";
    ProcParams["strArgmt"] = BillSerId.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = BranchId;
    oProcParams.push(ProcParams)
    ServiceParams['oProcParams'] = oProcParams;

    await this.appService.post('CommonQuery/fnGetDataReportNew', ServiceParams).toPromise()
      .then(data => {
        let jsonData = JSON.parse(data);
        if (jsonData == '') { return; }
        this.PurNo = jsonData[0].PurBillSerCurrentBillNo;

      });
  }

  async fnGetUserPrevilage() {


    var ServiceParams = {};
    ServiceParams['strProc'] = "UserPrevilage_GetOnStaffId";

    var oProcParams = [];

    var ProcParams = {};
    ProcParams["strKey"] = "StaffId";
    ProcParams["strArgmt"] = this.staffId;
    oProcParams.push(ProcParams)

    ServiceParams['oProcParams'] = oProcParams;


    await this.appService.post('CommonQuery/fnGetDataReportNew', ServiceParams).toPromise()
      .then(data => {

        let jsonobj = JSON.parse(data);
        if (jsonobj.length) {
          let previLage = jsonobj[0];

          if (previLage.PurCancel) {
            this.btnCancelDisabled = false;
          } else {
            this.btnCancelDisabled = true;
          }
          if (previLage.PurEdit) {
            this.btnEditDisabled = false;
          } else {
            this.btnEditDisabled = true;
          }
        }

      })

  }

  async fnSettings() {

    await this.appService.get('CommonQuery/fnSettingsGet')
      .toPromise().then(data => {
        let jsonSettings: any = data;
        for (let index = 0; index < jsonSettings.length; index++) {
          const element = jsonSettings[index];
          switch (element.KeyValue) {
            case 'ProductName':
              this.txtSoftwareName = element.Value;
              break;
            case 'ProductNameEdit':
              this.txtProductEdit = element.Value;
              if (element.Value == "No") {
                if (this.txtSoftwareName == 'RetailPharma') {
                  // $('#btnAddProduct').hide();
                  this.btnProductRefresh = true;
                }
              }
              else {
                if (this.txtProductEdit == 'RetailPharma') {
                  this.btnProductRefresh = false;
                }
              }
              break;
            case 'Neethi':
              this.txtAddOrMinus = element.Value;
              break;
            case 'Customer':
              this.txtCustomerForSoftware = element.Value;
              break;
            case 'Size':
              if (element.Value != 'Yes') {
                this.btnSize = true;
              }
              break;
            case 'QtyDecPlace':
              this.txtQtyDecimalPlace = element.Value;
              break;
            case 'LandingCost':
              this.txtLandingCostVisible = element.Value;
              break;
            case 'PhoneSerialNum':
              this.txtPhoneSerialNum = element.Value;
              if (this.txtPhoneSerialNum != 'Yes') {
                this.btnSerialNoSet = false;
              }
              break;
            case 'PreviousHistoryPurchase':
              this.txtPreviousHistory = element.Value;
              break;
            case 'PurchaseItemCode':
              this.txtPurchaseItemCode = element.Value;
              break;
            case 'EditDays':
              this.txtEditDays = element.Value;
              break;
            case 'UniversalCodeLink':
              this.txtUniversalCodeLink = element.Value;
              break;
            case 'MRPINCLUSIVESALES':
              this.txtMrpInclusiveSales = element.Value;
              break;
            case 'DecimalPlace':
              this.txtRateDecimalPlace = element.Value;
              break;
            case 'PurchaseMarginVisible':
              if (element.Value == "Yes") {
                this.PurchaseMarginVisible = true;
              }
              break;
            case 'PurchaseMarginVisibleRetail':
              if (element.Value == "Yes") {
                this.PurchaseMarginVisibleRetail = true;
              }
              break;
            case 'PurOtherChargeName':
              this.lblOtherCharge = element.Value;
              break;
            case 'PurExicseDuty':
              this.lblExciseDuty = element.Value;
              break;
            case 'PurPackingCharge':
              this.lblPackingChg = element.Value;
              break;
            case 'PurStampingCharge':
              this.lblStampingChg = element.Value;
              break;
            case 'PurchasePrint':
              this.txtPrintFileName = element.Value;
              break;
            case 'ExpMonthYearFormat':
              this.txtExpMonthYearFormat = element.Value;
              break;
            case 'OrderNotificationInPurchase':
              if (element.Value == "Yes") {
                this.OrderNotificationInPurchase = true;
              }
              break;
            case 'ManufacturewiseProdCodeSet':
              if (element.Value == "Yes") {
                this.bManufacturewiseProdCodeSet = true;
              }
              break;
            case 'ManufacturePriceSetting':
              if (element.Value == "Yes") {
                this.bManufacturePriceSetting = true;
              }
              break;
            case 'TaxName':
              this.strGlobalTaxName = element.Value;
              this.lbltax = `${this.strGlobalTaxName} Name:`
              break;
            case 'OnlineProductAdd':
              if (element.Value == "Yes") {
                // $('#btnAddProduct').hide();
                this.btnProductBrowse = true
              }
              break;
            case 'ItemSearch':
              if (element.Value == "ItemAndCode") {
                let ItemCodeWidth = 100;
              }

              break;

          }

        }
      }).finally(() => {


        if (this.txtSoftwareName == 'RetailPharma') {
          this.prodHeaders = [{ col: 'ItemDesc', width: '230px' }, { col: 'StockQty', width: '80px' }, { col: 'ManufactureName', width: '180px' },
          { col: 'PackQty', width: '80px' }, { col: 'MRP', width: '80px' }, { col: 'Location', width: '100px' }];

          this.prodColumn = ['Product Name', 'Stock', 'Manafacture', 'Pack', 'MRP', 'Location'];

        }

        this.fnColOrderForHeader();
        if (this.txtUniversalCodeLink == "Yes") {
          this.btnBrowseExcel = true;
        }
        this.router.queryParams.subscribe(val => {
          var LedgerPurchaseNo = val.LedgerPurchaseNo;
          var LedgerPurchaseId = val.LedgerPurchaseId;
          if (LedgerPurchaseNo && LedgerPurchaseId) {
            this.anchorclick("", LedgerPurchaseId, LedgerPurchaseNo);
          }
          let QueryPurchaseBillNo = val.QueryPurchaseBillNo;
          let QueryPurchaseId = val.QueryPurchaseId;
          if (QueryPurchaseBillNo > 0 && QueryPurchaseId > 0) {
            this.anchorclick('CreateNewBill', QueryPurchaseId, QueryPurchaseBillNo);
          }
        });
      }).catch((reason) => console.error(reason));
  }

  async fnSettingsForSalesBill() {

    var dictArgmts = { ProcName: 'Settings_GetValues' };
    await this.appService.post('CommonQuery/fnSettings', dictArgmts)
      .toPromise().then(data => {
        var jsondata = data;

        for (var i = 0; i < jsondata.length; i++) {

          if (jsondata[i].KeyValue == 'TaxName') {

            this.strSettingTaxName = jsondata[i].Value;
            if (this.strSettingTaxName == 'VAT') {
              this.strGSTName = 'TRNo';
              this.bHiddenGstCtrl = true;
            }

          }
        }
      }, err => console.error(err)).finally(() => {
        this.fnSettings();
      }).catch((reason) => console.error(reason));
  }

  async fnSupplierSearch(event) {
    this.ReceiptInfoMain.AC_Id = 0;
    const keyword = event.target.value;
    if (keyword == '') {
      this.selectcomplete = false;
      return;
    }
    let ServiceParams = {};
    ServiceParams['strProc'] = "AccountHead_SearchForPurchase";

    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "AC_Name";
    ProcParams["strArgmt"] = keyword;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.branchId;
    oProcParams.push(ProcParams)
    ServiceParams['oProcParams'] = oProcParams;

    await setTimeout(() => {
      this.appService.post('CommonQuery/fnGetDataReportNew', ServiceParams).toPromise()
        .then(data => {
          let jsonSupplier = JSON.parse(data);
          this.fillterItems = jsonSupplier;
          if (this.fillterItems.length > 0) {
            this.selectcomplete = true;
          } else {
            this.selectcomplete = false;
          }
        });
    });

  }

  fnSupplierChange(eve) {
    this.selectcomplete = false;
    this.ReceiptInfoMain.Receipt_SupplierName = eve.AC_Name;
    this.ReceiptInfoMain.AC_Id = eve.AC_Id;
    this.txtGSTno = eve.Tin1;

    this.ReceiptInfoMain.Receipt_Type = 'LOCAL'

    if (eve.PurType != '') {
      this.ReceiptInfoMain.Receipt_Type = eve.PurType
    }

    this.ReceiptInfoMain.Receipt_Address = eve.Addr1;
    this.ReceiptInfoMain.Receipt_Tin1 = eve.Tin1;
    this.ReceiptInfoMain.Receipt_Cst1 = eve.CstNo1;
    this.ReceiptInfoMain.Receipt_DLNo1 = eve.DLNo1;

    document.getElementById(`txtInvoice`).focus();

  }


  async fnColOrderForHeader() {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'ControlOrder_GetOnType';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams['strKey'] = 'ControlType';
    ProcParams['strArgmt'] = 'Purchase';
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    await this.appService.post('CommonQuery/fnGetDataReportNew', ServiceParams)
      .toPromise().then(res => {

        const jsonTable = JSON.parse(res);

        let UniqueTestBoxValue = '';
        if (this.txtUniversalCodeLink == 'Yes') {
          UniqueTestBoxValue = 'Display Name';
        }
        let PurchaseItemCode = '';
        if (this.txtPurchaseItemCode == 'Yes') {
          PurchaseItemCode = 'Code';
        }

        let hideResultColumns = [PurchaseItemCode]

        let showResultColumns = ['Del', 'No', PurchaseItemCode, UniqueTestBoxValue,
          'Product Name & Packing', `${this.strGlobalTaxName}%`];
        for (const col of jsonTable) {
          switch (col.ControlName) {
            case 'PBatch':
              if (col.ControlOrder == 0) {
                hideResultColumns.push('Batch');
              }
              break;
            case 'PPack':
              if (col.ControlOrder == 0) {
                hideResultColumns.push('Pack');
              } else {
                showResultColumns.push('Pack');
              }
              break;

            case 'PExp':
              if (col.ControlOrder == 0) {
                hideResultColumns.push('ExpDate');
              } else {
                showResultColumns.push('ExpDate');
              }
              break;

            case 'PDisPers':
              if (col.ControlOrder == 0) {
                hideResultColumns.push('Dis(%)');
              } else {
                showResultColumns.push('Dis(%)');
              }
              break;
            case 'PSchemeAmt':
              if (col.ControlOrder == 0) {
                hideResultColumns.push('ScheAmt');
              } else {
                showResultColumns.push('ScheAmt');
              }
              break;
            case 'PDisAmt':
              if (col.ControlOrder == 0) {
                hideResultColumns.push('DisAmt');
              } else {
                showResultColumns.push('DisAmt');
              }
              break;
            case 'PAmtBeforeTax':
              if (col.ControlOrder == 0) {
                hideResultColumns.push('AmtBeforeTax');
              }
              break;

            case 'PLCost':
              if (col.ControlOrder == 0) {
                hideResultColumns.push('LCost');
              } else {
                showResultColumns.push('LCost');
              }
              break;

            case 'PHsnCode':
              if (col.ControlOrder == 0) {
                hideResultColumns.push('HsnCode');
              } else {
                showResultColumns.push('HsnCode');
              }
              break;

            case 'PColor':
              if (col.ControlOrder == 0) {
                hideResultColumns.push('Color');
              } else {
                showResultColumns.push('Color');
              }
              break;

            case 'PMrpCalPurRate':
              if (col.ControlOrder != 0) {
                showResultColumns.push('MRP(%)');
                this.nCtrlMrpCalPurRate = true
              }
              break;

            case 'PRMrpCalTextilies':
              if (col.ControlOrder != 0) {
                showResultColumns.push('RMRP(%)');
                this.nCtrPRMrpCalTextilies = true
              }
              break;

            case 'PAmount':
              if (col.ControlOrder != 0) {
                showResultColumns.push('GstAmt', 'BeforeTax', 'BeforeTax');
              }
              break;

            case 'PSRate':
              if (col.ControlOrder == 0) {
                hideResultColumns.push('RetailRate');
                this.nCtrlSaleRate = false;
              } else {
                showResultColumns.push('RetailRate');
                this.nCtrlSaleRate = true;
              }
              break;

            case 'PFreight':
              if (col.ControlOrder == 0) {
                hideResultColumns.push('Freight');
              } else {
                showResultColumns.push('Freight');
              }
              break;

            case 'PQty':
              if (col.ControlOrder == 0) {
                hideResultColumns.push('Qty');
              } else {
                showResultColumns.push('Qty');
              }
              break;

            case 'PFQty':
              if (col.ControlOrder == 0) {
                hideResultColumns.push('FQty');
              } else {
                showResultColumns.push('FQty');
              }
              break;

            case 'PLooseQty':
              if (col.ControlOrder == 0) {
                hideResultColumns.push('Loose');
              } else {
                showResultColumns.push('Loose');
              }
              break;

            case 'PPRate':
              if (col.ControlOrder == 0) {
                hideResultColumns.push('PurRate');
                hideResultColumns.push('LCost');
              } else {
                showResultColumns.push('PurRate');
              }
              break;

            case 'PPRateWithTax':
              if (col.ControlOrder == 0) {
                hideResultColumns.push('PRateWithTax');
              } else {
                showResultColumns.push('PRateWithTax');
              }
              break;

            case 'PMrp':
              if (col.ControlOrder == 0) {
                hideResultColumns.push('MRP');
              } else {
                showResultColumns.push('MRP');
              }
              break;

            case 'PNeethiDis':
              if (col.ControlOrder == 0) {
                hideResultColumns.push('R Mar(%)');
                this.nCtrlNeethiDisPers = false;
              } else {
                showResultColumns.push('R Mar(%)');
                this.nCtrlNeethiDisPers = true;
              }
              break;

            case 'PWholeRateMargin':
              if (col.ControlOrder == 0) {
                hideResultColumns.push('W Mar(%)');
                this.nCtrlWholeRateMargin = false;
              } else {
                showResultColumns.push('W Mar(%)');
                this.nCtrlWholeRateMargin = true;
              }
              break;

            case 'PWRate':
              if (col.ControlOrder == 0) {
                hideResultColumns.push('WholSalRate');
              } else {
                showResultColumns.push('WholSalRate');
              }
              break;

            case 'SPRateOne':
              if (col.ControlOrder == 0) {
                hideResultColumns.push('SpecialRate');
              } else {
                showResultColumns.push('SpecialRate');
              }
              break;

            case 'SPRateTwo':
              if (col.ControlOrder == 0) {
                hideResultColumns.push('DealerRate');
              } else {
                showResultColumns.push('DealerRate');
              }
              break;

            case 'SPRateTwo':
              if (col.ControlOrder == 0) {
                hideResultColumns.push('DealerRate');
              } else {
                showResultColumns.push('DealerRate');
              }
              break;

            case 'SPRateThree':
              if (col.ControlOrder == 0) {
                hideResultColumns.push('SPRateThree');
              } else {
                showResultColumns.push('SPRateThree');
              }
              break;

            case 'SPRateFour':
              if (col.ControlOrder == 0) {
                hideResultColumns.push('SPRateFour');
              } else {
                showResultColumns.push('SPRateFour');
              }
              break;

            case 'SPRateFive':
              if (col.ControlOrder == 0) {
                hideResultColumns.push('SPRateFive');
              } else {
                showResultColumns.push('SPRateFive');
              }
              break;

            case 'PSalesQty':
              if (col.ControlOrder == 0) {
                hideResultColumns.push('SalesQty');
              } else {
                showResultColumns.push('SalesQty');
              }
              break;

            case 'PSalesFree':
              if (col.ControlOrder == 0) {
                hideResultColumns.push('SalesFre');
              } else {
                showResultColumns.push('SalesFre');
              }
              break;

            case 'PSalesPeriod':
              if (col.ControlOrder == 0) {
                hideResultColumns.push('SalePeriod');
              } else {
                showResultColumns.push('SalePeriod');
              }
              break;

            case 'PSelRateMarginPers':
              if (col.ControlOrder == 0) {
                hideResultColumns.push('Profit(%)');
              } else {
                showResultColumns.push('Profit(%)');
              }
              break;

            case 'PMrpMarginPers':
              if (col.ControlOrder == 0) {
                hideResultColumns.push('%MrpMargin');
              } else {
                showResultColumns.push('%MrpMargin');
              }
              break;

            case 'PMrpMarginPers':
              if (col.ControlOrder == 0) {
                hideResultColumns.push('Remarks');
              } else {
                showResultColumns.push('Remarks');
              }
              break;

          }

        }

        for (const col of jsonTable) {
          if (col.ControlName == 'PAmount' && col.ControlOrder == 0) {
            showResultColumns.push(`${this.strGlobalTaxName}Amt`,
              `Before${this.strGlobalTaxName}`, 'Amount');

          }
        }
        showResultColumns.push('Print');

        hideResultColumns.push('WholeSaleMargin', 'RetailMargin', 'TaxName', 'ProductId', 'TaxOn',
          'TaxOnFree', 'print', 'TaxId', 'TLQty', 'TQty', 'TotFreight', 'ActualTaxPers', 'Code', 'EditFlag',
          'BarCode', 'PerPurRate', 'PerLandCost', 'PerSelRate', 'PerMrp', 'BilledQty', 'BatchSlNo');
        this.columnHeader = showResultColumns;

      }).finally(() => {
        this.fnPriceMenusGets();
      }).catch((reason) => console.error(reason));

  }

  async fnPriceMenusGets() {
    let ServiceParams = {};
    ServiceParams['strProc'] = "PriceMenu_GetsAll";
    await this.appService.post('CommonQuery/fnGetDataReportNew', ServiceParams)
      .toPromise().then(data => {
        let jsonDetails = JSON.parse(data);
        // PriceMenu_Name
        for (const val of jsonDetails) {
          switch (val.PriceMenu_Name) {
            case 'SpRate1':
              this.columnHeader = this.columnHeader.map(x => x.replace('SpecialRate', val.DisplayName));
              this.lblSpRate1 = val.DisplayName;
              break;

            case 'SpRate2':
              this.columnHeader = this.columnHeader.map(x => x.replace('DealerRate', val.DisplayName));
              this.lblSpRate2 = val.DisplayName;
              break;

            case 'SpRate3':
              this.columnHeader = this.columnHeader.map(x => x.replace('SPRateThree', val.DisplayName));
              this.lblSpRate3 = val.DisplayName;
              break;

            case 'SpRate4':
              this.columnHeader = this.columnHeader.map(x => x.replace('SPRateFour', val.DisplayName));
              this.lblSpRate4 = val.DisplayName;
              break;

            case 'SpRate5':
              this.columnHeader = this.columnHeader.map(x => x.replace('SPRateFive', val.DisplayName));
              this.lblSpRate5 = val.DisplayName;
              break;

            case 'R MRP':
              this.columnHeader = this.columnHeader.map(x => x.replace('RetailRate', val.DisplayName));
              this.lblRetailRate = val.DisplayName;
              break;

            case 'W MRP':
              this.columnHeader = this.columnHeader.map(x => x.replace('WholSalRate', val.DisplayName));
              this.lblWholSalRate = val.DisplayName;
              break;

            case 'MRP':
              this.columnHeader = this.columnHeader.map(x => x.replace('MRP', val.DisplayName));
              this.lblMRP = val.DisplayName;
              break;
          }
        }

      }).finally(() => {
        this.fnAddRow();
        // this.dynamicArray[0].count = 0;
      });
  }

  fnTestDate(date) {
    if (this.txtSoftwareName == 'RetailPharma' || this.txtSoftwareName == 'WholeSalePharma' ||
      this.txtExpMonthYearFormat == 'Yes') {
      return this.isDateMMYYYY(date);
    } else {
      return this.isDateDDMMYYYY(date);
    }
  }

  fnExpDateKey(event) {

    if (this.txtSoftwareName == 'RetailPharma' || this.txtSoftwareName == 'WholeSalePharma' ||
      this.txtExpMonthYearFormat == 'Yes') {
      this.explength = 7;

      if (event.target.value.length == 2) {
        if (event.keyCode == 8 || event.keyCode == 46) {
          return
        }
        event.target.value += '/';
      } else if (event.target.value.length == 3) {
        if (event.target.value[2] != '/') {
          event.target.value = event.target.value[0] + event.target.value[1] + '/' + event.target.value[2];
        }
      }
    } else {
      this.explength = 10;
      if (event.target.value.length == 2 || event.target.value.length == 5) {
        if (event.keyCode == 8 || event.keyCode == 46) {
          return
        }
        event.target.value += '/';
      } else if (event.target.value.length == 3) {
        if (event.target.value[2] != '/') {
          event.target.value = event.target.value[0] + event.target.value[1] + '/' + event.target.value[2];
        }
      } else if (event.target.value.length == 6) {
        if (event.target.value[5] != '/') {
          event.target.value = event.target.value[0] + event.target.value[1] + '/' + event.target.value[2] +
            event.target.value[3] + event.target.value[4] + '/' + event.target.value[5];
        }
      }

    }
  }

  fnAddRow() {
    let ncount = this.dynamicArray.length;
    this.dynamicArray.map((data, index) => data.count = index);
    let datePresent = 'NO';
    this.prevHistryPop = false;
    this.columnHeader.forEach(element => {
      this.newDynamic = { count: ncount, [element]: '' }
    });
    this.dynamicArray.push(this.newDynamic);

    let totlength = this.dynamicArray.length;

    let prevLength = totlength - 1;
    // this.dynamicArray[prevLength].count  += 1;
    this.dynamicArray[prevLength].ReceiptSub_ExpDate = this.fnExpDate();
    this.dynamicArray[prevLength].ReceiptSub_Period = this.today;

    if (!this.showBill) {
      // this.virtualScroller.items = this.dynamicArray;
      // this.virtualScroller.scrollInto(this.dynamicArray[prevLength]);

      setTimeout(() => {
        if (prevLength > 0) {

          if (this.txtPurchaseItemCode == "Yes") {
            document.getElementById(`txtItemCode${prevLength}`).focus();
          } else {
            document.getElementById(`txtproduct${prevLength}`).focus();
          }
        }
      }, 100);


    }
    return true;
  }




  deleteRow(index, flag) {

    if (flag) {
      this.openSnackBar(`can't remove rows`, 'warning')
      return
    }

    if (this.bTempEditFlag)
      this.btnEdit = false;
    this.btnUpdate = true;
    if (this.dynamicArray.length == 1) {

      this.dynamicArray = [];
      this.fnAddRow();

      return false;
    } else {
      this.dynamicArray.splice(index, 1);
      this.dynamicArray.map((data, index) => { data.count = index })
      this.fnGetTotal(0);
      if (this.displayName) {
        this.fnBgColor();
      }
      return true;
    }

  }

  txtpoName: string = '';
  fnpopProductItemCodeSearch(eve, index, row) {
    this.txtpoName = '';
    const keyword = eve.target.value;
    this.txtpoName = keyword;
    let headPosition = document.getElementById('productTh');
    let thpositions = headPosition.getBoundingClientRect();
    this.indexs = index;
    this.rowIndex = row;
    let divScrollTop = `${thpositions.top}px`;
    this.ptop = divScrollTop;
    this.purchaseService.productCodeSearch(keyword).toPromise()
      .then(data => {
        let length = data.length;
        if (length > 20) {
          length = 20
        }
        for (let i = 0; i < length; i++) {
          const element = data[i];
          this.fillterProduct.push(element);
        }

        if (this.bTempEditFlag)
          this.btnEdit = false;
        this.btnUpdate = true;

        this.popItemProduct = true;
        setTimeout(() => {
          document.getElementById('popFocus').focus();
        })

      });
  }

  async fnProductPopSearch(eve, index, row) {
    this.txtpoName = '';
    const keyword = eve.target.value;
    this.txtpoName = keyword;
    let headPosition = document.getElementById('productTh');
    let thpositions = headPosition.getBoundingClientRect();
    this.indexs = index;
    this.rowIndex = row;
    let divScrollTop = `${thpositions.top}px`;
    let divScrollLeft = `${thpositions.left}px`;
    // this.pleft = divScrollLeft;
    this.ptop = divScrollTop;
    this.purchaseService.productSearch(keyword).toPromise()
      .then(data => {
        const productfillter = JSON.parse(data);
        let length = productfillter.length;
        if (length > 20) {
          length = 20
        }
        for (let i = 0; i < length; i++) {
          const element = productfillter[i];
          this.fillterProduct.push(element);

        }
        if (this.bTempEditFlag)
          this.btnEdit = true;
        this.btnUpdate = true;

        this.popProduct = true;
        setTimeout(() => {
          document.getElementById('popFocus').focus();
        })


      });
  }

  filterItemProduct(eve) {
    const keyword = eve.target.value;
    this.purchaseService.productCodeSearch(keyword).toPromise()
      .then(data => {
        this.fillterProduct = data;

      })
  }

  filterProduct(eve) {
    const keyword = eve.target.value;
    if (!keyword) {
      return
    }
    this.purchaseService.productSearch(keyword).toPromise()
      .then(data => {
        this.fillterProduct = JSON.parse(data);

      })
  }


  popRowClick(row) {
    this.myProductChange(row)
    this.popProduct = false;
    this.popItemProduct = false;

  }

  async fnProductSearch(eve, index, row) {

    const positions = eve.target.getBoundingClientRect();
    let divScrollTop = `${positions.top + positions.height}px`;
    let divScrollLeft = `${positions.left}px`;

    this.productCodeShow = false;
    this.indexs = index;
    this.rowIndex = row;
    this.left = divScrollLeft;
    this.top = divScrollTop;


    const keyword = eve.target.value;
    if (keyword == '') {
      this.productShow = false;
      return;
    }

    await setTimeout(() => {
      this.purchaseService.productSearch(keyword).toPromise()
        .then(data => {
          if (this.bTempEditFlag)
            this.btnEdit = true;
          this.btnUpdate = true;
          this.fillterProduct = JSON.parse(data);

          if (this.fillterProduct.length > 0) {
            this.productShow = true;
          } else {
            this.productShow = false;
          }

        });
    });

  }

  async fnProductItemCodeSearch(eve, index, row) {
    const positions = eve.target.getBoundingClientRect();
    let divScrollTop = `${positions.top + positions.height}px`;
    let divScrollLeft = `${positions.left}px`;

    this.productShow = false;
    this.indexs = index;
    this.rowIndex = row;
    this.left = divScrollLeft;
    this.top = divScrollTop;


    const keyword = eve.target.value;
    if (keyword == '') {
      this.productCodeShow = false;
      return;
    }


    await setTimeout(() => {
      this.purchaseService.productCodeSearch(keyword).toPromise()
        .then(data => {
          if (this.bTempEditFlag)
            this.btnEdit = false;
          this.btnUpdate = true;
          this.fillterProduct = data;
          if (this.fillterProduct.length > 0) {
            this.productCodeShow = true;
          } else {
            this.productCodeShow = false;
          }
        })
    });

  }

  fnFocusProduct(eve, index) {
    if (eve.target.value == '') {
      return;
    }
    document.getElementById(`txtquantity${index}`).focus();
    this.fnGetTotal(index);
  }

  fnQtyCalculation(UniqueId) {

    if (this.bTempEditFlag)
      this.btnEdit = true;
    this.btnUpdate = true;
    this.fnAmountCalculation(UniqueId, '');

  }
  fnFocusOut(event) {
    setTimeout(() => {
      this.productShow = false;
      this.productCodeShow = false;
    }, 200);
    event.preventDefault();
  }

  myProductChange(eve) {

    const index = this.rowIndex;
    let DeceimalPlace = parseFloat(this.txtRateDecimalPlace || 0);
    this.productShow = false;
    this.productCodeShow = false;

    this.dynamicArray[index].ReceiptSub_Id = index;
    this.dynamicArray[index].ReceiptSub_BatchSlNo = 0;

    this.dynamicArray[index].ReceiptSub_Pack = eve.StockQty;

    if (this.txtBrowseExcelFlag != 'Yes') {
      this.dynamicArray[index].ReceiptSub_ReceiptRate = parseFloat(eve.Pur_Rate || 0).toFixed(DeceimalPlace);
      this.dynamicArray[index].ReceiptSub_MRP = parseFloat(eve.MRP_Rate || 0).toFixed(DeceimalPlace);
      this.dynamicArray[index].ReceiptSub_Batch = '';
      this.dynamicArray[index].ReceiptSub_ProdDiscount = 0;

    }



    this.dynamicArray[index].ReceiptSub_SellRate = parseFloat(eve.Sel_Rate || 0).toFixed(DeceimalPlace);
    this.dynamicArray[index].ReceiptSub_WholeSaleRate = parseFloat(eve.MRP_Rate || 0).toFixed(DeceimalPlace);

    this.dynamicArray[index].ReceiptSub_PerRate = 0;
    this.dynamicArray[index].ReceiptSub_PerLandCost = 0;
    this.dynamicArray[index].ReceiptSub_ReceiptFree = 0;
    this.dynamicArray[index].ReceiptSub_NetAmtPerProd = 0;
    this.dynamicArray[index].ReceiptSub_Amount = 0;
    this.dynamicArray[index].ReceiptSub_BarCode = 0;
    this.dynamicArray[index].ReceiptSub_TaxPercentage = parseFloat(eve.TaxPercent || 0);
    this.dynamicArray[index].ReceiptSub_TaxAmt = 0;

    this.dynamicArray[index].ReceiptSub_TaxOn = eve.TaxOn;
    this.dynamicArray[index].ReceiptSub_TaxOnFree = eve.TaxOnFree;
    this.dynamicArray[index].ReceiptSub_TaxName = eve.TaxName;
    this.dynamicArray[index].ReceiptSub_WholSalMag = 0;
    this.dynamicArray[index].ReceiptSub_RetlMargin = 0;
    this.dynamicArray[index].ReceiptSub_Period = this.today;
    this.dynamicArray[index].ProductId = eve.ProductId;
    this.dynamicArray[index].TaxId = eve.TaxID;
    this.dynamicArray[index].ReceiptSub_LandCost = 0;
    this.dynamicArray[index].ReceiptSub_ProdDisAmt = 0;
    this.dynamicArray[index].ReceiptSub_SchemePers = 0;
    this.dynamicArray[index].ReceiptSub_SchemeAmt = 0;
    this.dynamicArray[index].ReceiptSub_Freight = 0;
    this.dynamicArray[index].ReceiptSub_Frgt = parseFloat(eve.TaxPercent || 0);
    this.dynamicArray[index].ReceiptSub_SpRate1 = 0; // parseFloat(  eve.SpRate1 || 0);
    this.dynamicArray[index].ReceiptSub_SpRate2 = 0; // parseFloat( eve.SpRate2 || 0);
    this.dynamicArray[index].ReceiptSub_SpRate3 = 0; // parseFloat(  eve.ProdSpRate3 || 0);
    this.dynamicArray[index].ReceiptSub_SpRate4 = 0; // parseFloat( eve.ProdSpRate4 || 0);
    this.dynamicArray[index].ReceiptSub_SpRate5 = 0; // parseFloat(  eve.ProdSpRate5 || 0);
    this.dynamicArray[index].ReceiptSub_ActualTaxPers = parseFloat(eve.TaxPercent || 0);
    this.dynamicArray[index].ReceiptSub_AmtBeforeTax = 0;
    this.dynamicArray[index].ReceiptSub_SGSTTaxPers = parseFloat(eve.SGSTTaxPers || 0);
    this.dynamicArray[index].ReceiptSub_SGSTTaxAmount = 0;
    this.dynamicArray[index].ReceiptSub_CGSTTaxPers = parseFloat(eve.CGSTTaxPers || 0);
    this.dynamicArray[index].ReceiptSub_CGSTTaxAmount = 0;
    this.dynamicArray[index].ReceiptSub_CGSTAmount = 0;
    this.dynamicArray[index].ReceiptSub_IGSTTaxPers = parseFloat(eve.IGSTTaxPers || 0);
    this.dynamicArray[index].ReceiptSub_LooseQty = 0;
    this.dynamicArray[index].ReceiptSub_CessPers = 0; //parseFloat( eve.CessPers || 0);
    this.dynamicArray[index].ReceiptSub_ExtraCessPers = 0; //parseFloat( eve.AdditionalCess || 0);
    if (this.nCtrlNeethiDisPers) {
      this.dynamicArray[index].ReceiptSub_NeethiDisPers = parseFloat(eve.Discount || 0);
    }
    this.dynamicArray[index].ItemName = eve.ProductName;
    this.dynamicArray[index].Code = eve.ItemCode;

    switch (undefined) {
      case eve.ReceiptSub_SaleQty:
        this.dynamicArray[index].ReceiptSub_SaleQty = 0;
        break;
      case eve.ReceiptSub_SaleFree:
        this.dynamicArray[index].ReceiptSub_SaleFree = 0;
        break;
      case eve.ReceiptSub_CstType:
        this.dynamicArray[index].ReceiptSub_CstType = 0;
        break;
      case eve.ReceiptSub_NeethiDisPers:
        this.dynamicArray[index].ReceiptSub_NeethiDisPers = 0;
        break;
      case eve.ReceiptSub_WRateDis:
        this.dynamicArray[index].ReceiptSub_WRateDis = 0;
        break;
      case eve.UniversalCode:
        this.dynamicArray[index].UniversalCode = 0;
        break;
      case eve.PurBillSerId:
        this.dynamicArray[index].PurBillSerId = 0;
        break;
      case eve.ReceiptSub_Field1:
        this.dynamicArray[index].ReceiptSub_Field1 = 0;
        break;
      case eve.ReceiptSub_Field2:
        this.dynamicArray[index].ReceiptSub_Field2 = 0;
        break;
      case eve.ReceiptSub_NoField1:
        this.dynamicArray[index].ReceiptSub_NoField1 = 0;
        break;
      case eve.ReceiptSub_VarFiedl1:
        this.dynamicArray[index].ReceiptSub_VarFiedl1 = 0;
        break;
    }


    if (this.displayName) {
      this.bgExcel[index] = false;
    }
    this.fnGetTotal(index);
    document.getElementById(`txtquantity${this.indexs}`).focus();
    // this.fnProviousHistory(eve.ProductId, index);
    this.fnGetLastPurchaseDetails(eve.ProductId, index);

  }

  async fnProviousHistory(ProductId, index) {

    if (this.txtPreviousHistory != 'Yes') {
      return
    }
    let ServiceParams = {};
    ServiceParams['strProc'] = "ReceiptDetails_AlreadyReceiptchasedProduct";

    let oProcParams = [];
    let ProcParams = {};
    ProcParams["strKey"] = "ProductId";
    ProcParams["strArgmt"] = ProductId.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.branchId;
    oProcParams.push(ProcParams)
    ServiceParams['oProcParams'] = oProcParams;

    await this.appService.post('CommonQuery/fnGetDataReport', ServiceParams).toPromise()
      .then(data => {
        let jsonobj = JSON.parse(data);
        if (jsonobj.length > 0) {
          this.historyJson = jsonobj;
          let columnsIn = jsonobj[0];
          let coumnHeader = [];
          for (var key in columnsIn) {
            coumnHeader.push(key)
          }
          this.coumnHisHead = coumnHeader
          this.prevHistryPop = true;
        }
      }).finally(() => {

      })
  }

  async fnGetLastPurchaseDetails(nProductId, index) {

    let DeceimalPlace = this.txtRateDecimalPlace;
    let BranchId = this.branchId;

    let ServiceParams = {};
    ServiceParams['strProc'] = "Product_GetLastPurchaseDetails";

    var oProcParams = [];
    var ProcParams = {};
    ProcParams["strKey"] = "ProductId";
    ProcParams["strArgmt"] = nProductId.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = BranchId;
    oProcParams.push(ProcParams)
    ServiceParams['oProcParams'] = oProcParams;

    await this.appService.post('CommonQuery/fnGetDataReport', ServiceParams).toPromise()
      .then(data => {
        const jsonobj = JSON.parse(data);
        if (jsonobj.length > 0) {
          if (this.txtBrowseExcelFlag != 'Yes') {
            this.dynamicArray[index].ReceiptSub_MRP = parseFloat(jsonobj[0].MRP || 0).toFixed(DeceimalPlace);
            this.dynamicArray[index].ReceiptSub_Batch = jsonobj[0].Batch;
            this.dynamicArray[index].ReceiptSub_ReceiptRate = parseFloat(jsonobj[0].PurRate || 0).toFixed(DeceimalPlace);
            this.dynamicArray[index].ReceiptSub_ExpDate = this.DateRetExpiryFormat(jsonobj[0].ExpDate);

          }
          this.dynamicArray[index].ReceiptSub_SellRate = parseFloat(jsonobj[0].SelRate || 0).toFixed(DeceimalPlace);
          this.dynamicArray[index].ReceiptSub_WholeSaleRate = parseFloat(jsonobj[0].WholeSaleRate || 0).toFixed(DeceimalPlace);

        }


      }, err => console.error(err))
  }

  fnFocusQuantity(event, index, rowId) {

    let element = event.srcElement.parentElement.nextElementSibling.children[0];

    if (element == null) {

      if (this.dynamicArray[rowId].ItemName == undefined || parseFloat(this.dynamicArray[rowId].ReceiptSub_ReceiptQty || 0) == 0) {
        this.openSnackBar('Enter  Product', 'Error');

        if (this.txtPurchaseItemCode == "Yes") {

          document.getElementById(`txtItemCode${rowId}`).focus();
          var input = document.getElementById(`txtItemCode${rowId}`) as HTMLInputElement;
          input.select();

        } else {

          document.getElementById(`txtproduct${rowId}`).focus();
          var input = document.getElementById(`txtproduct${rowId}`) as HTMLInputElement;
          input.select();

        }
        return;

      }

      if (this.dynamicArray[rowId].ReceiptSub_ReceiptQty == undefined || parseFloat(this.dynamicArray[rowId].ReceiptSub_ReceiptQty || 0) == 0) {
        this.openSnackBar('Enter Quantity', 'Error');
        document.getElementById(`txtquantity${rowId}`).focus();
        var input = document.getElementById(`txtquantity${rowId}`) as HTMLInputElement;
        input.select();
        return
      }

      if (this.dynamicArray[rowId].ReceiptSub_ReceiptRate == undefined || parseFloat(this.dynamicArray[rowId].ReceiptSub_ReceiptRate || 0) == 0) {
        this.openSnackBar('Enter PurchaseRate', 'Error');
        document.getElementById(`txtPurchaseRate${rowId}`).focus();
        var input = document.getElementById(`txtPurchaseRate${rowId}`) as HTMLInputElement;
        input.select();
        return
      }

      if (this.dynamicArray[rowId].ReceiptSub_SellRate == undefined || parseFloat(this.dynamicArray[rowId].ReceiptSub_SellRate || 0) == 0) {
        this.openSnackBar('Enter Selling Rate', 'Error');
        document.getElementById(`txtSelRate${rowId}`).focus();
        var input = document.getElementById(`txtSelRate${rowId}`) as HTMLInputElement;
        input.select();
        return
      }

      this.dynamicArray = this.dynamicArray.filter(obj => obj.ProductId !== undefined);

      // if (this.dynamicArray[rowId + 1] == undefined) {
      //   this.fnAddRow();
      // }
      this.fnAddRow();

      return;
    }
    else
      element.focus();
    setTimeout(() => {
      element.select()
    });
  }

  DateRetExpiryFormat(value) {
    let BillDate = value;
    let BillDate1 = BillDate.split('-');
    let Dates = BillDate1[1] + '/' + BillDate1[0]
    return Dates;
  }

  DateRet(value) {
    let BillDate = value;
    let BillDate1 = BillDate.split('-');
    let Dates = BillDate1[2] + '/' + BillDate1[1] + '/' + BillDate1[0]
    return Dates;
  }

  DateRetCopy(value) {
    let BillDate = value;
    let BillDate1 = BillDate.split('-');
    // let Dates = new Date(BillDate1[2] + '-' + BillDate1[1] + '-' + BillDate1[0])
    let Dates = new Date(BillDate1[0], BillDate1[1] - 1, BillDate1[2])
    return Dates;
  }

  async fnfocusInvoice(eve) {
    const keyword = eve.target.value;
    let PurSlNo = this.txtCopyBillNo;
    let AcId = this.ReceiptInfoMain.AC_Id;

    if (keyword == '') {
      this.openSnackBar('Enter Invoice No', 'Error');
      return
    }
    if (AcId == 0) {
      this.openSnackBar("Choose Supplier", 'error');
      this.ReceiptInfoMain.Receipt_InvoNo = '';
      document.getElementById('txtSupplier').focus();
      return;
    }

    let ServiceParams = {};
    ServiceParams['strProc'] = "Receipt_InvoiceNoExist";

    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "InvoNo";
    ProcParams["strArgmt"] = this.ReceiptInfoMain.Receipt_InvoNo.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "AcId";
    ProcParams["strArgmt"] = AcId.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "PurSlNo";
    ProcParams["strArgmt"] = PurSlNo.toString();
    oProcParams.push(ProcParams)

    ServiceParams['oProcParams'] = oProcParams;
    await this.appService.post('CommonQuery/fnGetDataReportNew', ServiceParams).toPromise()
      .then(data => {
        let jsonobj = JSON.parse(data);
        if (jsonobj.length > 0) {
          this.openSnackBar("Invoice No Already Exists", 'error');
          this.ReceiptInfoMain.Receipt_InvoNo = '';
          document.getElementById('txtInvoice').focus();
          return;
        } else {
          document.getElementById('txtInvoiceDate').focus();
        }
      }, err => console.error(err));


  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }


  openSnackBarSuccess(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['clsSuccessClassName']
    });
  }

  async fnTaxGets() {
    this.jsonTaxData = [];
    this.strColumnDisplay = false;
    let ServiceParams = {};
    ServiceParams['strProc'] = 'Tax_Gets';
    await this.appService.post('CommonQuery/fnGetDataReportNew', ServiceParams)
      .toPromise().then(data => {
        this.tempTaxData = JSON.parse(data);

        if (this.strGlobalTaxName != 'GST') {
          this.strColumnDisplay = true;
        }
      }).finally(() => {
        this.fnHideTaxGroup();

      }).catch((reason) => console.error(reason));
  }

  async fnHideTaxGroup() {
    let itemDataTax = [];
    let ServiceParams = { strProc: '' };
    ServiceParams.strProc = "Tax_Gets";
    await this.appService.post('CommonQuery/fnGetDataReportNew', ServiceParams)
      .toPromise().then(data => {
        let jsonData = JSON.parse(data);

        jsonData.forEach(element => {
          for (const item of this.tempTaxData) {
            if (element.Active != 1 && element.TaxID == item.TaxID) {
              const index = this.tempTaxData.indexOf(item);
              itemDataTax = this.tempTaxData.splice(index, 1);
            } else {
              itemDataTax = this.tempTaxData;
            }
          }
        });


      }).finally(() => {

        itemDataTax.forEach(data => {
          let ReceiptTaxInfo = {}
          ReceiptTaxInfo["TaxId"] = parseFloat(data.TaxID || 0);
          ReceiptTaxInfo["TaxPercent"] = parseFloat(data.TaxPercent || 0);
          ReceiptTaxInfo["TaxAmount"] = 0;
          ReceiptTaxInfo["Amount"] = 0;
          ReceiptTaxInfo["SGSTTaxPers"] = parseFloat(data.SGSTTaxPers || 0);
          ReceiptTaxInfo["SGSTAmount"] = 0;
          ReceiptTaxInfo["SGSTTaxAmount"] = 0;
          ReceiptTaxInfo["CGSTTaxPers"] = parseFloat(data.CGSTTaxPers || 0);
          ReceiptTaxInfo["CGSTAmount"] = 0;
          ReceiptTaxInfo["CGSTTaxAmount"] = 0;
          ReceiptTaxInfo["IGSTTaxPers"] = parseFloat(data.IGSTTaxPers || 0);
          ReceiptTaxInfo["IGSTAmount"] = 0;
          ReceiptTaxInfo["IGSTTaxAmount"] = 0;
          ReceiptTaxInfo["CessAmt"] = 0;
          ReceiptTaxInfo["AdditionalCessAmt"] = 0;
          this.jsonTaxData.push(ReceiptTaxInfo);
          // RTax=TaxPercent RAmount RVatAmount
        });
        this.fnBillSeries_Gets();
      });
  }


  async fnddlTaxGroupOtherCharge() {
    let ServiceParams = { strProc: '' };
    ServiceParams.strProc = "TaxGroup_GetsNew";
    await this.appService.post('CommonQuery/fnGetDataReportNew', ServiceParams).toPromise()
      .then(data => {
        let jsonData = JSON.parse(data);
        this.ddlGroups = jsonData;
        this.ReceiptInfoMain.Receipt_OtherTaxGrpId = parseFloat(this.ddlGroups[0].TaxID || 0);
        this.ReceiptInfoMain.Receipt_PackingChgTaxGrpId = parseFloat(this.ddlGroups[0].TaxID || 0);
        this.ReceiptInfoMain.Receipt_StampingChgTaxGrpId = parseFloat(this.ddlGroups[0].TaxID || 0);
      }).finally(() => {
        this.fnTaxGets();
      })
  }

  fnGetTotal(UniqueId) {
    setTimeout(() => {
      if (this.ReceiptInfoMain.Field3 == 'Amt') {
        this.fnTotDisPersCalcOnDisAmt();
      } else {
        this.fnAmountCalculation(UniqueId, '');
      }
    });
  }

  fnAmountCalculation(RowId, strInputBoxName) {


    let oListReceiptDetailsInfo = this.dynamicArray;

    if (oListReceiptDetailsInfo == null) {
      return;
    }

    let dDisPerAll = 0;
    let strType, strTaxOn, strTaxName = '';
    let dTotFreightAmt = 0, dAmount = 0, dLCost = 0, dPerLandCost = 0, dAmtBeforeDis = 0;
    let strTaxOnFree = "Yes";
    let dOriginalPurRate = 0, dTotMRPValue = 0, dTotVatCollected = 0, dTotExcempted = 0, dTotSaleValue = 0;
    let dQty = 0, dFreeQty = 0, dLooseQty = 0, dPurRate = 0, dSelRate = 0, dWholeSaleRate = 0, dMRP = 0, dTax = 0, dDisPers = 0, dFreight = 0;
    let Pack = 0, dSchmeAmt = 0, dSGSTTaxPers = 0, dCGSTTaxPers = 0, dIGSTTaxPers = 0, dCessPers = 0, dExtraCessPers = 0, dExtraCessAmt = 0;
    let dPerPurRate = 0, dPerSalRate = 0, dPerMrp = 0, dOriginalLoosePurRate = 0, dMarginAmt = 0, dMaxMarginPers = 0, dTotDisPers = 0;
    let dFreightAmtPerRow = 0, dDisAmt = 0, dTotQty = 0, dAmoutBeforTaxRowise = 0, dAmountBeforeTax = 0, dReceiptTotAmtBeforeTax = 0;
    let dIGSTTaxAmount = 0, dIGSTAmount = 0, dSGSTTaxAmount = 0, dSGSTAmount = 0, dCGSTTaxAmount = 0, dCGSTAmount = 0;
    let dTaxAmt = 0, dPerTaxAmt = 0, dOrginalTaxAmt = 0, dLooseTaxAmt = 0, dLoosePerTaxAmt = 0, dOriginalFreeTaxAmt = 0, dOrginalLooseTaxAmt = 0;
    let dPurRateForPack = 0, dOriginalPerRate = 0;
    dDisPerAll = this.ReceiptInfoMain.Receipt_Discount;
    if (dDisPerAll > 99.99) {
      dDisPerAll = 0;
      this.ReceiptInfoMain.Receipt_Discount = 0;
    }

    strType = this.ReceiptInfoMain.Receipt_Type;
    dTotFreightAmt = this.ReceiptInfoMain.Receipt_Freight;

    let bRowCalculation = false;



    for (let index = 0; index < oListReceiptDetailsInfo.length; index++) {

      if (oListReceiptDetailsInfo[index].ProductId !== undefined) {
        const sub = oListReceiptDetailsInfo[index];
        bRowCalculation = false;
        if (parseFloat(RowId || 0) < 0) {
          bRowCalculation = true;
        } else if (parseFloat(RowId || 0) == parseFloat(sub.ReceiptSub_Id || 0)) {
          bRowCalculation = true;
        }



        dQty = dFreeQty = dPurRate = dSelRate = dMRP = dAmount = Pack = dWholeSaleRate = dDisPers = 0;
        dTaxAmt = dAmoutBeforTaxRowise = dFreight = dLCost = dAmtBeforeDis = dOriginalFreeTaxAmt = dLoosePerTaxAmt = dLooseTaxAmt = dPerLandCost = 0;
        strTaxOn = strTaxName = "";
        dFreightAmtPerRow = 0;
        dFreight = dTotFreightAmt = dPurRateForPack = dOriginalPerRate = 0;

        strTaxOnFree = "Yes";
        dTotQty = 0;
        dPerPurRate = dPerMrp = dPerSalRate = 0;
        dPerTaxAmt = 0;
        dOrginalTaxAmt = 0;
        dSchmeAmt = 0;
        dOrginalLooseTaxAmt = dOriginalLoosePurRate = 0;
        dSGSTTaxPers = dSGSTTaxAmount = dSGSTAmount = dCGSTTaxPers = 0, dCGSTTaxAmount = dCGSTAmount = dIGSTTaxPers = dIGSTTaxAmount = dIGSTAmount = 0;
        dQty = parseFloat(sub.ReceiptSub_ReceiptQty || 0);
        dFreeQty = parseFloat(sub.ReceiptSub_ReceiptFree || 0);
        dLooseQty = parseFloat(sub.ReceiptSub_LooseQty || 0);
        // changes
        if (sub.ReceiptSub_SellRate == "NaN") {
          sub.ReceiptSub_SellRate = 0;

        } else if (sub.ReceiptSub_WholeSaleRate == "NaN") {
          sub.ReceiptSub_WholeSaleRate = 0;
        }

        if (sub.ProductId != 0 && (dQty > 0 || dFreeQty > 0 || dLooseQty > 0)) {
          dQty = 0; dFreeQty = 0;
          dQty = parseFloat(sub.ReceiptSub_ReceiptQty || 0);
          dFreeQty = parseFloat(sub.ReceiptSub_ReceiptFree || 0);
          dLooseQty = parseFloat(sub.ReceiptSub_LooseQty || 0);
          dPurRate = parseFloat(sub.ReceiptSub_ReceiptRate || 0);
          dSelRate = parseFloat(sub.ReceiptSub_SellRate || 0);
          dWholeSaleRate = parseFloat(sub.ReceiptSub_WholeSaleRate || 0);
          dMRP = parseFloat(sub.ReceiptSub_MRP || 0);
          dTax = parseFloat(sub.ReceiptSub_ActualTaxPers || 0);
          strTaxOn = sub.ReceiptSub_TaxOn;
          strTaxOnFree = sub.ReceiptSub_TaxOnFree;
          strTaxName = sub.ReceiptSub_TaxName;
          dDisPers = parseFloat(sub.ReceiptSub_ProdDiscount || 0);
          dFreight = parseFloat(sub.ReceiptSub_Freight || 0);
          Pack = parseFloat(sub.ReceiptSub_Pack || 0);
          dOriginalPurRate = parseFloat(sub.ReceiptSub_ReceiptRate || 0);
          dSchmeAmt = parseFloat(sub.ReceiptSub_SchemeAmt || 0);
          dSGSTTaxPers = parseFloat(sub.ReceiptSub_SGSTTaxPers || 0);
          dCGSTTaxPers = parseFloat(sub.ReceiptSub_CGSTTaxPers || 0);
          dIGSTTaxPers = parseFloat(sub.ReceiptSub_IGSTTaxPers || 0);
          dCessPers = parseFloat(sub.ReceiptSub_CessPers || 0);
          dExtraCessPers = parseFloat(sub.ReceiptSub_ExtraCessPers || 0);
          dPerPurRate = dPurRate;
          dPerSalRate = dSelRate;
          dPerMrp = dMRP;
          dOriginalLoosePurRate = dPurRate;
          dPurRateForPack = parseFloat(sub.ReceiptSub_ReceiptRate || 0);

          if (dPurRate > 0) {
            sub.ReceiptSub_WholSalMag = (((dSelRate - dPurRate) / dPurRate) * 100);
          }
          if (dMRP > 0) {
            let decMRP4RetailMargin = dMRP;
            decMRP4RetailMargin = decMRP4RetailMargin - (dSelRate * dTax / 100);
            if (this.txtSoftwareName == "RetailPharma") {
              if (sub.ReceiptSub_LandCost != 0) {
                sub.ReceiptSub_RetlMargin = (((decMRP4RetailMargin - parseFloat(sub.ReceiptSub_LandCost || 0)) / parseFloat(sub.ReceiptSub_LandCost || 0)) * 100);
              } else {
                sub.ReceiptSub_RetlMargin = 0;
              }

              dMarginAmt = (decMRP4RetailMargin - parseFloat(sub.ReceiptSub_LandCost || 0));
              dMaxMarginPers = ((dMRP - sub.ReceiptSub_LandCost) * 100) / dMRP;
              dMarginAmt = (decMRP4RetailMargin - dPurRate);
            } else {
              if (dSelRate != 0) {
                sub.ReceiptSub_RetlMargin = (((dSelRate - parseFloat(sub.ReceiptSub_ReceiptRate || 0)) / parseFloat(sub.ReceiptSub_ReceiptRate || 0)) * 100);
              } else { sub.ReceiptSub_RetlMargin = 0; }
              dMaxMarginPers = ((dSelRate - parseFloat(sub.ReceiptSub_LandCost || 0)) * 100) / dSelRate;
              dMarginAmt = (decMRP4RetailMargin - dPurRate);
            }
          }

          if (Pack == 0) { Pack = 1; }
          sub.ReceiptSub_Pack = Pack;
          if (this.ReceiptInfoMain.Receipt_Discount != 0) { dTotDisPers = this.ReceiptInfoMain.Receipt_Discount; }
          dFreightAmtPerRow = (dPurRate * dQty * dFreight) / 100;
          if (dQty > 0 && dSchmeAmt > 0) { dPurRate = dPurRate - (dSchmeAmt / dQty) }

          dPurRate = dPurRate - ((dPurRate * dTotDisPers) / 100);
          dDisAmt = (((dPurRate * dQty) * dDisPers) / 100);
          dPurRate = dPurRate - ((dPurRate * dDisPers) / 100);
          dOriginalPurRate = dOriginalPurRate - ((dOriginalPurRate * dDisPers) / 100);
          if (dQty > 0 && dSchmeAmt > 0) { dOriginalPurRate = dOriginalPurRate - (dSchmeAmt / dQty) };
          if (this.txtSoftwareName == "RetailPharma") {
            if (dPurRate > 0 && Pack > 0) {
              dPerPurRate = dPurRate / Pack;
              dOriginalLoosePurRate = dOriginalPurRate / Pack;
              dOriginalPerRate = dPurRateForPack / Pack;
            }
            if (dMRP > 0 && Pack > 0) { dPerMrp = dMRP / Pack; }
            if (dSelRate > 0 && Pack > 0) { dPerSalRate = dSelRate / Pack; }
            dTotQty = (Pack * (dQty + dFreeQty)) + dLooseQty;
          } else {
            dTotQty = dQty + dFreeQty + dLooseQty;
          }

          dAmoutBeforTaxRowise = (dOriginalPurRate * dQty) + (dPerPurRate * dLooseQty);
          dAmountBeforeTax = dAmountBeforeTax + (dPerPurRate * dLooseQty);
          dReceiptTotAmtBeforeTax = dReceiptTotAmtBeforeTax + dAmoutBeforTaxRowise;
          if (bRowCalculation) {
            if (strType == "INTERSTATE") {
              dIGSTTaxAmount = (dQty * ((dPurRate * dIGSTTaxPers) / 100)) + (dLooseQty * ((dPerPurRate * dIGSTTaxPers) / 100));
              dIGSTAmount = (dQty * dPurRate) + (dLooseQty * dPerPurRate)
              if (strTaxOnFree == "Yes") {
                dIGSTAmount = dIGSTAmount + (dFreeQty * dPurRate);
                dIGSTTaxAmount += (dFreeQty * ((dPurRate * dIGSTTaxPers) / 100));

              }
            } else {
              dSGSTTaxAmount = (dQty * ((dPurRate * dSGSTTaxPers) / 100)) + (dLooseQty * ((dPerPurRate * dSGSTTaxPers) / 100));
              dSGSTAmount = (dQty * dPurRate) + (dLooseQty * dPerPurRate);
              dCGSTTaxAmount = (dQty * ((dPurRate * dCGSTTaxPers) / 100)) + (dLooseQty * ((dPerPurRate * dCGSTTaxPers) / 100));
              dCGSTAmount = (dQty * dPurRate) + (dLooseQty * dPerPurRate)
              if (strTaxOnFree == "Yes") {

                dSGSTAmount += (dFreeQty * dPurRate);
                dSGSTTaxAmount += (dFreeQty * ((dPurRate * dSGSTTaxPers) / 100));

                dCGSTAmount += (dFreeQty * dPurRate);
                dCGSTTaxAmount += (dFreeQty * ((dPurRate * dCGSTTaxPers) / 100));
              }
            }
            dTaxAmt = dQty * ((dPurRate * dTax) / 100);
            dPerTaxAmt = 1 * ((dPurRate * dTax) / 100);
            dOrginalTaxAmt = 1 * ((dOriginalPurRate * dTax) / 100);
            dLooseTaxAmt = dLooseQty * ((dPerPurRate * dTax) / 100);
            dLoosePerTaxAmt = dLooseQty * ((dPerPurRate * dTax) / 100);
            if (strTaxOnFree == "Yes") {
              dTaxAmt += dFreeQty * ((dPurRate * dTax) / 100);
              dOriginalFreeTaxAmt = dFreeQty * ((dOriginalPurRate * dTax) / 100);
            }
            dOrginalLooseTaxAmt = (dOriginalLoosePurRate * dTax) / 100;

            dExtraCessAmt = (dPurRate * dQty * dExtraCessPers) / 100;
            dAmount = (dPurRate * dQty) + (dTaxAmt) + (dPerPurRate * dLooseQty) + (dLooseTaxAmt);// - dSchmeAmt;
            dLCost = dPurRate + dPerTaxAmt;
            dPerLandCost = dLCost;
            if (this.txtSoftwareName == "RetailPharma") {

              if (dPurRate > 0 && Pack > 0) {
                //  dPerLandCost = dOriginalPurRate / Pack
                dPerLandCost = dPurRate / Pack
              }
              if (dOrginalTaxAmt > 0 && Pack > 0) {
                dPerLandCost = dPerLandCost + dOrginalTaxAmt / Pack
              }
            }
            let dPurRateForOneProduct = dPurRate;

            if (dQty > 0 || dFreeQty > 0) { dPurRateForOneProduct = (dPurRate * dQty) / (dQty + dFreeQty) };
            dTotFreightAmt = (dQty + dFreeQty) * dFreight;
            dAmtBeforeDis = (dOriginalPurRate * dQty) + (dOriginalLoosePurRate * dLooseQty);
            dAmtBeforeDis = dAmtBeforeDis + (dOrginalTaxAmt * dQty) + (dOrginalLooseTaxAmt * dLooseQty) + dOriginalFreeTaxAmt + dExtraCessAmt;//- dSchmeAmt;
            sub.ReceiptSub_PerRate = dOriginalPerRate;
            sub.ReceiptSub_PerSelRate = dPerSalRate;
            sub.ReceiptSub_PerMRP = dPerMrp;
            sub.ReceiptSub_Amount = dAmount;
            sub.ReceiptSub_TaxAmt = dTaxAmt + dLooseTaxAmt;
            sub.ReceiptSub_LandCost = dLCost;
            sub.ReceiptSub_PerLandCost = dPerLandCost;
            sub.ReceiptSub_ProdDisAmt = dDisAmt;//
            if (strInputBoxName != 'GrossValue') {
              sub.ReceiptSub_AmtBeforeTax = dAmoutBeforTaxRowise;
            }
            sub.ReceiptSub_TotalQty = dTotQty;
            sub.ReceiptSub_TotLQty = dTotQty;
            sub.ReceiptSub_NetAmtPerProd = dAmtBeforeDis;
            sub.ReceiptSub_SGSTTaxAmount = dSGSTTaxAmount;
            sub.ReceiptSub_SGSTAmount = dSGSTAmount;
            sub.ReceiptSub_CGSTTaxAmount = dCGSTTaxAmount;
            sub.ReceiptSub_CGSTAmount = dCGSTAmount;
            sub.ReceiptSub_IGSTTaxAmount = dIGSTTaxAmount;
            sub.ReceiptSub_IGSTAmount = dIGSTAmount;
            sub.ReceiptSub_BarCode = dPurRateForOneProduct;
            sub.ReceiptSub_ExtraCessAmt = dExtraCessAmt;
            this.ReceiptInfoMain.MRPValue = dTotMRPValue;
            this.ReceiptInfoMain.VatCollected = dTotVatCollected;
            this.ReceiptInfoMain.PurchaseValue = dTotSaleValue;
            this.ReceiptInfoMain.Excempted = dTotExcempted;

            let ID = sub.ReceiptSub_Id;
            let DeceimalPlace = parseFloat(this.txtRateDecimalPlace || 0);
            let decMRP4RetailMargin = 0;
            let dTaxPersForRetailMargin = sub.ReceiptSub_Frgt;
            let dOriginalSelRate = parseFloat(sub.ReceiptSub_SellRate || 0);
            if (this.txtMrpInclusiveSales == "Yes") {
              dOriginalSelRate = dOriginalSelRate - ((dOriginalSelRate * dTaxPersForRetailMargin) / (100 + dTaxPersForRetailMargin));
              if (sub.ReceiptSub_ReceiptRate > 0) {
                sub.ReceiptSub_WholSalMag = ((dOriginalSelRate - parseFloat(sub.ReceiptSub_LandCost || 0)) / parseFloat(sub.ReceiptSub_LandCost || 0)) * 100;
              }
            } else {
              if (sub.ReceiptSub_ReceiptRate > 0) {
                sub.ReceiptSub_WholSalMag = ((dOriginalSelRate - parseFloat(sub.ReceiptSub_ReceiptRate || 0)) / parseFloat(sub.ReceiptSub_ReceiptRate || 0)) * 100;

              }
            }
            if (this.txtSoftwareName == "RetailPharma") {
              if (sub.ReceiptSub_MRP > 0) {
                decMRP4RetailMargin = parseFloat(sub.ReceiptSub_MRP || 0);
                if (strTaxOn == "MRP Inclusive")
                  decMRP4RetailMargin = decMRP4RetailMargin - (decMRP4RetailMargin * dTaxPersForRetailMargin / (100 + dTaxPersForRetailMargin));
                if (strTaxOn == "SELLING RATE")//SellingRate to PurchaseRate 
                  decMRP4RetailMargin = decMRP4RetailMargin - (dOriginalSelRate * dTaxPersForRetailMargin / 100);

                if (sub.ReceiptSub_LandCost != 0)
                  sub.ReceiptSub_RetlMargin = ((decMRP4RetailMargin - parseFloat(sub.ReceiptSub_LandCost || 0)) / parseFloat(sub.ReceiptSub_LandCost || 0)) * 100;
                else
                  sub.ReceiptSub_RetlMargin = 0;
              }
            } else {

              if (sub.ReceiptSub_MRP > 0) {
                decMRP4RetailMargin = sub.ReceiptSub_MRP;
                if (strTaxOn == "MRP Inclusive")
                  decMRP4RetailMargin = decMRP4RetailMargin - (decMRP4RetailMargin * dTaxPersForRetailMargin / (100 + dTaxPersForRetailMargin));
                if (strTaxOn == "SELLING RATE")//SellingRate to PurchaseRate 
                  decMRP4RetailMargin = decMRP4RetailMargin - (dOriginalSelRate * dTaxPersForRetailMargin / 100);

                if (dOriginalSelRate != 0)
                  sub.ReceiptSub_RetlMargin = ((decMRP4RetailMargin - dOriginalSelRate) / dOriginalSelRate) * 100;
                else { sub.ReceiptSub_RetlMargin = 0 }
              }

            }
            if (RowId == ID) {
              // $('#txtWholeSaleMarginCurRow').val(oReceiptDetailsInfoArg.ReceiptSub_WholSalMag.toFixed(DeceimalPlace));
              // $('#txtRetailMarginPerRow').val(oReceiptDetailsInfoArg.ReceiptSub_RetlMargin.toFixed(DeceimalPlace))

            }
            if (DeceimalPlace != 3) {
              let decLastDegitValue;
              let strSplit = parseFloat(sub.ReceiptSub_Amount || 0).toFixed(3).split(".");
              if (strSplit.length > 1) {
                decLastDegitValue = strSplit[1];
                if (decLastDegitValue.length >= 3)
                  decLastDegitValue = decLastDegitValue.substring(2);
                if (decLastDegitValue == 5)
                  sub.ReceiptSub_Amount += parseFloat(sub.ReceiptSub_Amount || 0) % .001;
              }
              sub.ReceiptSub_Amount = Math.round(parseFloat(sub.ReceiptSub_Amount || 0) * 100) / 100;
              decLastDegitValue = 0;
              strSplit = sub.ReceiptSub_TaxAmt.toFixed(3).split(".");
              if (strSplit.length > 1) {
                decLastDegitValue = strSplit[1];
                if (decLastDegitValue.length >= 3)
                  decLastDegitValue = decLastDegitValue.substring(2);
                if (decLastDegitValue == 5)
                  sub.ReceiptSub_TaxAmt += parseFloat(sub.ReceiptSub_TaxAmt || 0) % .001;
              }
              sub.ReceiptSub_TaxAmt = Math.round(parseFloat(sub.ReceiptSub_TaxAmt || 0) * 100) / 100;
            }



            if (parseFloat(RowId || 0) >= 0) {

              this.dynamicArray[RowId].ReceiptSub_WholSalMag = parseFloat(sub.ReceiptSub_WholSalMag || 0).toFixed(DeceimalPlace);
              this.dynamicArray[RowId].ReceiptSub_PerRate = parseFloat(sub.ReceiptSub_PerRate || 0).toFixed(DeceimalPlace);
              this.dynamicArray[RowId].ReceiptSub_RetlMargin = parseFloat(sub.ReceiptSub_RetlMargin || 0).toFixed(DeceimalPlace);
              this.dynamicArray[RowId].ReceiptSub_TotLQty = parseFloat(sub.ReceiptSub_TotLQty || 0).toFixed(DeceimalPlace);
              this.dynamicArray[RowId].ReceiptSub_PerSelRate = parseFloat(sub.ReceiptSub_PerSelRate || 0).toFixed(DeceimalPlace);
              this.dynamicArray[RowId].ReceiptSub_PerMRP = parseFloat(sub.ReceiptSub_PerMRP || 0).toFixed(DeceimalPlace);
              this.dynamicArray[RowId].ReceiptSub_Amount = parseFloat(sub.ReceiptSub_Amount || 0).toFixed(DeceimalPlace);
              this.dynamicArray[RowId].ReceiptSub_NetAmtPerProd = parseFloat(sub.ReceiptSub_NetAmtPerProd || 0).toFixed(DeceimalPlace);
              this.dynamicArray[RowId].ReceiptSub_TaxAmt = parseFloat(sub.ReceiptSub_TaxAmt || 0).toFixed(DeceimalPlace);
              this.dynamicArray[RowId].ReceiptSub_ProdDisAmt = parseFloat(sub.ReceiptSub_ProdDisAmt || 0).toFixed(DeceimalPlace);
              // this.dynamicArray[RowId].ReceiptSub_AmtBeforeTax = parseFloat(sub.ReceiptSub_AmtBeforeTax).toFixed(DeceimalPlace);
              if (strInputBoxName != "GrossValue") {
                this.dynamicArray[RowId].ReceiptSub_AmtBeforeTax = parseFloat(sub.ReceiptSub_AmtBeforeTax || 0).toFixed(2);
              }
              this.dynamicArray[RowId].ReceiptSub_TotalQty = sub.ReceiptSub_TotalQty;
              this.dynamicArray[RowId].ReceiptSub_LandCost = parseFloat(sub.ReceiptSub_LandCost || 0).toFixed(DeceimalPlace);
              this.dynamicArray[RowId].ReceiptSub_PerLandCost = parseFloat(sub.ReceiptSub_PerLandCost || 0).toFixed(DeceimalPlace);
              this.dynamicArray[RowId].ReceiptSub_SGSTTaxAmount = parseFloat(sub.ReceiptSub_SGSTTaxAmount || 0).toFixed(DeceimalPlace);
              this.dynamicArray[RowId].ReceiptSub_SGSTAmount = parseFloat(sub.ReceiptSub_SGSTAmount || 0).toFixed(DeceimalPlace);
              this.dynamicArray[RowId].ReceiptSub_CGSTTaxAmount = parseFloat(sub.ReceiptSub_CGSTTaxAmount || 0).toFixed(DeceimalPlace);
              this.dynamicArray[RowId].ReceiptSub_CGSTAmount = parseFloat(sub.ReceiptSub_CGSTAmount || 0).toFixed(DeceimalPlace);
              this.dynamicArray[RowId].ReceiptSub_IGSTTaxAmount = parseFloat(sub.ReceiptSub_IGSTTaxAmount || 0).toFixed(DeceimalPlace);
              this.dynamicArray[RowId].ReceiptSub_IGSTAmount = parseFloat(sub.ReceiptSub_IGSTAmount || 0).toFixed(DeceimalPlace);
              this.dynamicArray[RowId].ReceiptSub_BarCode = parseFloat(sub.ReceiptSub_BarCode || 0).toFixed(DeceimalPlace);
              this.dynamicArray[RowId].ReceiptSub_CessAmt = parseFloat(sub.ReceiptSub_CessAmt || 0).toFixed(DeceimalPlace);
              this.dynamicArray[RowId].ReceiptSub_ExtraCessAmt = parseFloat(sub.ReceiptSub_ExtraCessAmt || 0);
            }

            // ReceiptSub_CstType
            // ReceiptSub_Period
            // ReceiptSub_SchemePers


          }
        }
      }
    }



    this.fnSelRateOnDispers(RowId);

    setTimeout(() => { this.fnGetFinalTotal(dReceiptTotAmtBeforeTax, dDisPerAll); }, 1);


  }

  fnMrpOrMrpPersCalOnPurRate(index, strFormulaType) {

    // fnDiffPriceCalculationAllOnManufacture(ID);
    if (!this.nCtrlMrpCalPurRate && !this.nCtrPRMrpCalTextilies) {
      this.fnGetTotal(index);
      return;
    }
    let dPurRate = 0, dSelRate = 0, dMRP = 0, dAmount = 0, dProdId = 0, dWholeSaleRate = 0, dTax = 0, dDisPers = 0, dDisAmt = 0, dTaxAmt = 0, dActPurRate = 0, dMrpDisPers = 0;
    let strBatch = "", strTaxOn = "", strType = "", strTaxName = "";
    let strTaxOnFree = "Yes";
    let dRMrpCalPersTextilies = 0;
    let strAddOrMinus = this.txtAddOrMinus;
    let dProductId = this.dynamicArray[index].ProductId;
    dPurRate = dSelRate = dMRP = dAmount = dProdId = dWholeSaleRate = dDisPers = dTaxAmt = dActPurRate = 0;
    strBatch = strTaxOn = strTaxName = "";
    strTaxOnFree = "Yes";
    if (dProductId != 0) {

      dPurRate = parseFloat(this.dynamicArray[index].ReceiptSub_ReceiptRate || 0);
      dActPurRate = dPurRate;
      dMRP = parseFloat(this.dynamicArray[index].ReceiptSub_MRP || 0);
      dMrpDisPers = 0; // parseFloat($('#txtMrpCalPurRatePers' + ID).val() || 0);
      dRMrpCalPersTextilies = 0; //parseFloat($('#txtRMrpPersCalTextilies' + ID).val() || 0);
      let DeceimalPlace = parseFloat(this.txtRateDecimalPlace || 0);
      dSelRate = parseFloat(this.dynamicArray[index].ReceiptSub_SellRate || 0);

      if (strFormulaType == "MRPPers") {
        dMRP = dPurRate + ((dPurRate * dMrpDisPers) / 100);
        if (this.nCtrlMrpCalPurRate) {
          this.dynamicArray[index].ReceiptSub_MRP = (dMRP.toFixed(2));
        }
      } else if (strFormulaType == "MRP") {
        dMrpDisPers = ((dMRP - dPurRate) * 100) / dPurRate;
        if (this.nCtrlMrpCalPurRate) {
          // $('#txtMrpCalPurRatePers' + ID).val(dMrpDisPers.toFixed(2));
        }
      }
      if (this.nCtrPRMrpCalTextilies) {
        if (strFormulaType == "RMrpCalTextilies") {
          if (strAddOrMinus == "MINUS")
            dSelRate = (dMRP - (dMRP * (dRMrpCalPersTextilies / 100)));
          else
            dSelRate = (dPurRate + (dPurRate * (dRMrpCalPersTextilies / 100)));

          this.dynamicArray[index].ReceiptSub_SellRate = (dSelRate.toFixed(2));
        }
      } else if (strFormulaType == "SelRate") {

        if (strAddOrMinus == "MINUS" && dMRP > 0)
          dRMrpCalPersTextilies = ((dMRP - dSelRate) / dMRP) * 100;
        else if (dPurRate > 0)
          dRMrpCalPersTextilies = ((dSelRate - dPurRate) * 100) / dPurRate;

        // $('#txtRMrpPersCalTextilies' + ID).val(dRMrpCalPersTextilies.toFixed(2));
      }
    }
    this.fnGetTotal(index);
  }


  fnTotDisPersCalcOnDisAmt() {

    var dTotDisAmt = 0, dTotDisPers = 0;

    dTotDisAmt = this.ReceiptInfoMain.DisAmt

    this.ReceiptInfoMain.Receipt_Discount = dTotDisPers;
    let dQty = 0, dFreeQty = 0, dPurRate = 0, dSelRate = 0, dMRP = 0, dAmount = 0, dProdId = 0, Pack = 0, dWholeSaleRate = 0, dTax = 0, dDisPers = 0, dDisAmt = 0, dTaxAmt = 0;
    let dAmoutBeforTaxRowise = 0, dAmountBeforeTax = 0;
    for (const sub of this.dynamicArray) {
      let oReceiptDetailsInfoArg = sub;
      dQty = dFreeQty = dPurRate = dSelRate = dMRP = dAmount = dProdId = Pack = dWholeSaleRate = dDisPers = dTaxAmt = 0;
      dQty = oReceiptDetailsInfoArg.ReceiptSub_ReceiptQty;

      dFreeQty = oReceiptDetailsInfoArg.ReceiptSub_ReceiptFree;
      dTaxAmt = oReceiptDetailsInfoArg.ReceiptSub_TaxAmt;
      dTax = oReceiptDetailsInfoArg.ReceiptSub_TaxPercentage;
      if (oReceiptDetailsInfoArg.ProductId != 0 && (dQty > 0 || dFreeQty > 0)) {
        dQty = 0; dFreeQty = 0;
        dQty = oReceiptDetailsInfoArg.ReceiptSub_ReceiptQty;
        dFreeQty = oReceiptDetailsInfoArg.ReceiptSub_ReceiptFree;
        dPurRate = oReceiptDetailsInfoArg.ReceiptSub_ReceiptRate;
        dTaxAmt = dQty * ((dPurRate * dTax) / 100);
        dAmoutBeforTaxRowise = (dPurRate * dQty);
        dAmountBeforeTax += (dQty * dPurRate);

      }
    }
    dTotDisPers = (dTotDisAmt * 100) / dAmountBeforeTax;
    this.ReceiptInfoMain.Receipt_Discount = dTotDisPers;
    this.fnAmountCalculation(0, '');
  }

  fnPurRateCalculationOnGrossValue(ID, strInputBoxName) {

    var dPurRate = 0, dGrossValue = 0, dQty = 0;

    var dProductId = this.dynamicArray[ID].ProductId;
    dPurRate = dGrossValue = 0;

    if (dProductId != 0) {
      // dPurRate    = parseFloat($('#PurRate' + ID).val() || 0);
      dGrossValue = parseFloat(this.dynamicArray[ID].ReceiptSub_AmtBeforeTax || 0);
      dQty = parseFloat(this.dynamicArray[ID].ReceiptSub_ReceiptQty || 0);

      if (dQty > 0) {
        dPurRate = dGrossValue / dQty;
      }
      if (dPurRate == 0) {
        return
      }

      this.dynamicArray[ID].ReceiptSub_ReceiptRate = dPurRate;
    }

    this.fnAmountCalculation(ID, strInputBoxName);

  }

  fnGetTotalDisAmtRowwise(index) {
    var dRowDisPers = 0;
    let dProductId = parseFloat(this.dynamicArray[index].ProductId || 0);
    var dQty = parseFloat(this.dynamicArray[index].ReceiptSub_ReceiptQty || 0);
    var dPurRate = parseFloat(this.dynamicArray[index].ReceiptSub_ReceiptRate || 0);
    let dDisAmt = parseFloat(this.dynamicArray[index].ReceiptSub_ProdDisAmt || 0);
    var SchemeAmt = parseFloat(this.dynamicArray[index].ReceiptSub_SchemeAmt || 0);

    if (dQty > 0 && SchemeAmt > 0) {
      dPurRate = dPurRate - (SchemeAmt / dQty);
    }

    if (dQty > 0 && dPurRate > 0)
      dRowDisPers = (dDisAmt * 100) / (dPurRate * dQty);

    if (dProductId != 0) {
      this.dynamicArray[index].ReceiptSub_ProdDiscount = dRowDisPers;
    }
    this.fnAmountCalculationForDisAmt(index);
  }

  fnAmountCalculationForDisAmt(index) {
    if (this.dynamicArray[index].ProductId == undefined) {
      return
    }
    // ListReceiptInfo, ListReceiptDetailsInfo, ListReceiptTaxInfo
    let strSoftwareName = this.txtSoftwareName;
    let strCustomerForSoftware = this.txtCustomerForSoftware;
    let strAddOrMinus = this.txtAddOrMinus;
    let dQty = 0, dFreeQty = 0, dLooseQty = 0, dPurRate = 0, dSelRate = 0, dMRP = 0, dAmount = 0, dProdId = 0, Pack = 0, dWholeSaleRate = 0, dTax = 0, dDisPers = 0, dDisAmt = 0;
    let dTotTaxAmount = 0, dTotAmount = 0, dTotDisPers = 0, dTotDisAmt = 0, dTaxAmt = 0, dAmountBeforeTax = 0, dAmoutBeforTaxRowise = 0, dFreight = 0, dLCost = 0, dPerLandCost = 0;
    let dFreightAmtPerRow = 0, dSchmeAmt = 0;
    let dTotExcempted = 0, dTotMRPValue = 0, dTotVatCollected = 0, dFreightAmt = 0, dTotFreightAmt = 0, dTotQty = 0, dPerTaxAmt = 0, dAmtBeforeDis = 0;

    let dSGSTTaxPers = 0, dSGSTTaxAmount = 0, dSGSTAmount = 0, dCGSTTaxPers = 0, dCGSTTaxAmount = 0, dCGSTAmount = 0, dIGSTTaxPers = 0, dIGSTTaxAmount = 0, dIGSTAmount = 0;
    let dLooseTaxAmt = 0, dLoosePerTaxAmt = 0;

    let strBatch = "", strTaxOn = "", strType = "", strTaxName = "";
    let strTaxOnFree = "Yes";
    let dPerPurRate = 0, dPerSalRate = 0, dPerMrp = 0, dOriginalFreeTaxAmt = 0;
    let dTotSaleValue = 0;
    let oReceiptInfo = "";
    let dOrginalTaxAmt = 0, dOriginalPurRate = 0;

    let dDisPerAll = 0, dTotDisAmtAll = 0;
    let dReceiptTotAmtBeforeTax = 0;
    dDisPerAll = this.ReceiptInfoMain.Receipt_Discount;
    if (dDisPerAll > 99.99) {
      dDisPerAll = 0;
      this.ReceiptInfoMain.Receipt_Discount = 0;
    }
    strType = this.ReceiptInfoMain.Receipt_Type;


    let oReceiptDetailsInfoArg = this.dynamicArray[index];
    if (oReceiptDetailsInfoArg.ProductId !== undefined) {
      dQty = dFreeQty = dLooseQty = dPurRate = dSelRate = dMRP = dAmount = dProdId = Pack = dWholeSaleRate = dDisPers = 0;
      dTotTaxAmount = dTotAmount = dTaxAmt = dAmoutBeforTaxRowise = dFreight = dLCost = dAmtBeforeDis = dOriginalFreeTaxAmt = dLoosePerTaxAmt = dLooseTaxAmt = 0;
      strBatch = strTaxOn = strTaxName = "";
      dFreightAmtPerRow = 0;
      dFreight = dTotFreightAmt = 0;
      strTaxOnFree = "Yes";
      dTotQty = 0;
      dPerPurRate = dPerMrp = dPerSalRate = 0;
      dPerTaxAmt = 0;
      dOrginalTaxAmt = 0;
      dSchmeAmt = 0;
      dSGSTTaxPers = dSGSTTaxAmount = dSGSTAmount = dCGSTTaxPers = 0, dCGSTTaxAmount = dCGSTAmount = dIGSTTaxPers = dIGSTTaxAmount = dIGSTAmount = 0;
      dQty = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_ReceiptQty || 0);
      dFreeQty = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_ReceiptFree || 0);
      dLooseQty = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_LooseQty || 0);
      if (oReceiptDetailsInfoArg.ProductId != 0 && (dQty > 0 || dFreeQty > 0)) {
        dQty = 0; dFreeQty = 0;
        dQty = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_ReceiptQty || 0);
        dFreeQty = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_ReceiptFree || 0);
        dLooseQty = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_LooseQty || 0);
        dPurRate = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_ReceiptRate || 0);
        dSelRate = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_SellRate || 0);
        dWholeSaleRate = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_WholeSaleRate || 0);
        dMRP = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_MRP || 0);
        dTax = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_ActualTaxPers || 0);
        strTaxOn = oReceiptDetailsInfoArg.ReceiptSub_TaxOn;
        strTaxOnFree = oReceiptDetailsInfoArg.ReceiptSub_TaxOnFree;
        strTaxName = oReceiptDetailsInfoArg.ReceiptSub_TaxName;
        dDisPers = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_ProdDiscount || 0);
        dFreight = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_Freight || 0);
        Pack = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_Pack || 0);
        dOriginalPurRate = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_ReceiptRate || 0);
        dSchmeAmt = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_SchemeAmt || 0);
        dSGSTTaxPers = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_SGSTTaxPers || 0);
        dCGSTTaxPers = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_CGSTTaxPers || 0);
        dIGSTTaxPers = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_IGSTTaxPers || 0);
        dPerPurRate = dPurRate;
        dPerSalRate = dSelRate;
        dPerMrp = dMRP;

        let dMaxMarginPers = 0, dMarginAmt = 0;
        if (dPurRate > 0) {
          oReceiptDetailsInfoArg.ReceiptSub_WholSalMag = (((dSelRate - dPurRate) / dPurRate) * 100);
        }
        if (dMRP > 0) {
          let decMRP4RetailMargin = dMRP;
          if (strTaxOn == "MRP Inclusive")
            decMRP4RetailMargin = decMRP4RetailMargin - (decMRP4RetailMargin * dTax / (100 + dTax));
          if (strTaxOn != "MRP Inclusive") //SellingRate to PurchaseRate 
            decMRP4RetailMargin = decMRP4RetailMargin - (dSelRate * dTax / 100);
          if (this.txtSoftwareName == "RetailPharma") {
            if (parseFloat(oReceiptDetailsInfoArg.ReceiptSub_LandCost || 0) != 0) {
              oReceiptDetailsInfoArg.ReceiptSub_RetlMargin = (((decMRP4RetailMargin - parseFloat(oReceiptDetailsInfoArg.ReceiptSub_LandCost || 0)) / parseFloat(oReceiptDetailsInfoArg.ReceiptSub_LandCost || 0)) * 100);
            } else
              oReceiptDetailsInfoArg.ReceiptSub_RetlMargin = 0;
            dMarginAmt = (decMRP4RetailMargin - parseFloat(oReceiptDetailsInfoArg.ReceiptSub_LandCost || 0));
            dMaxMarginPers = ((dMRP - oReceiptDetailsInfoArg.ReceiptSub_LandCost) * 100) / dMRP;
            dMarginAmt = (decMRP4RetailMargin - dPurRate);

          } else {
            if (dSelRate != 0) {
              oReceiptDetailsInfoArg.ReceiptSub_RetlMargin = (((dSelRate - parseFloat(oReceiptDetailsInfoArg.ReceiptSub_ReceiptRate || 0)) / parseFloat(oReceiptDetailsInfoArg.ReceiptSub_ReceiptRate || 0)) * 100);
            }
            else
              oReceiptDetailsInfoArg.ReceiptSub_RetlMargin = 0;
            dMaxMarginPers = ((dSelRate - parseFloat(oReceiptDetailsInfoArg.ReceiptSub_LandCost || 0)) * 100) / dSelRate;
            dMarginAmt = (decMRP4RetailMargin - dPurRate);
          }
        }
        if (Pack == 0)
          Pack = 1;
        oReceiptDetailsInfoArg.ReceiptSub_Pack = Pack;
        if (this.ReceiptInfoMain.Receipt_Discount != 0)
          dTotDisPers = this.ReceiptInfoMain.Receipt_Discount;
        dFreightAmtPerRow = (dPurRate * dQty * dFreight) / 100;
        if (dQty > 0 && dSchmeAmt > 0) {
          dPurRate = dPurRate - (dSchmeAmt / dQty);
        }
        dPurRate = dPurRate - ((dPurRate * dTotDisPers) / 100);
        dDisAmt = (((dPurRate * dQty) * dDisPers) / 100);
        dPurRate = dPurRate - ((dPurRate * dDisPers) / 100);
        dOriginalPurRate = dOriginalPurRate - ((dOriginalPurRate * dDisPers) / 100);
        if (dQty > 0 && dSchmeAmt > 0) {
          dOriginalPurRate = dOriginalPurRate - (dSchmeAmt / dQty);
        }
        dAmoutBeforTaxRowise = (dOriginalPurRate * dQty);
        dAmountBeforeTax += (dOriginalPurRate * dQty);
        dReceiptTotAmtBeforeTax = dAmountBeforeTax;

        if (strSoftwareName == "RetailPharma") {
          if (dPurRate > 0 && Pack > 0)
            dPerPurRate = dPurRate / Pack;
          if (dMRP > 0 && Pack > 0)
            dPerMrp = dMRP / Pack;
          if (dSelRate > 0 && Pack > 0)
            dPerSalRate = dSelRate / Pack;
          dTotQty = Pack * (dQty + dFreeQty);

        } else {
          dTotQty = dQty + dFreeQty;
        }
        if (strType == "INTERSTATE") {
          dIGSTTaxAmount = dQty * ((dPurRate * dIGSTTaxPers) / 100);
          dIGSTAmount = dQty * dPurRate
          if (strTaxOnFree == "Yes") {
            dIGSTAmount += (dFreeQty * dPurRate);
            dIGSTTaxAmount += (dFreeQty * ((dPurRate * dIGSTTaxPers) / 100));
          }
        } else {
          dSGSTTaxAmount = dQty * ((dPurRate * dSGSTTaxPers) / 100);
          dSGSTAmount = dQty * dPurRate;
          dCGSTTaxAmount = dQty * ((dPurRate * dCGSTTaxPers) / 100);
          dCGSTAmount = dQty * dPurRate
          if (strTaxOnFree == "Yes") {
            dSGSTAmount += (dFreeQty * dPurRate);
            dSGSTTaxAmount += (dFreeQty * ((dPurRate * dSGSTTaxPers) / 100));
            dCGSTAmount += (dFreeQty * dPurRate);
            dCGSTTaxAmount += (dFreeQty * ((dPurRate * dCGSTTaxPers) / 100));
          }

        }
        if (strType == "LOCAL" && strTaxName == "MEDICINE") {
          if (strTaxOn == "MRP Inclusive") {
            dTaxAmt = dQty * ((dMRP * dTax) / (100 + dTax));
            dOrginalTaxAmt = 1 * ((dMRP * dTax) / (100 + dTax));
            dPerTaxAmt = 1 * ((dMRP * dTax) / (100 + dTax));
            if (strTaxOnFree == "Yes") {
              dTaxAmt += dFreeQty * ((dMRP * dTax) / (100 + dTax));
              dOriginalFreeTaxAmt = dFreeQty * ((dMRP * dTax) / (100 + dTax));
            }
          } else {
            dTaxAmt = dQty * ((dPurRate * dTax) / 100);

            dOrginalTaxAmt = 1 * ((dOriginalPurRate * dTax) / 100);

            dPerTaxAmt = dQty * ((dPurRate * dTax) / 100);
            if (strTaxOnFree == "Yes") {
              dTaxAmt += dFreeQty * ((dPurRate * dTax) / 100);
              dOriginalFreeTaxAmt = dFreeQty * ((dOriginalPurRate * dTax) / 100);
            }
          }
          dTotExcempted += (dQty * dPurRate) + dTaxAmt;
        } else if (strType == "INTERSTATE" && strTaxName == "MEDICINE") {
          dTotMRPValue += dQty * dMRP;
          dTaxAmt = dQty * ((dPurRate * dTax) / 100);
          dPerTaxAmt = 1 * ((dPurRate * dTax) / 100);
          dOrginalTaxAmt = 1 * ((dOriginalPurRate * dTax) / 100);
          dTotVatCollected += dTaxAmt;
          dTotSaleValue += (dQty * dPurRate);
        } else if (strType == "INTERSTATE") {
          dTaxAmt = dQty * ((dPurRate * dTax) / 100);
          dPerTaxAmt = 1 * ((dPurRate * dTax) / 100);
          dOrginalTaxAmt = 1 * ((dOriginalPurRate * dTax) / 100);
        } else {
          if (strTaxOn == "MRP Inclusive") {
            dTaxAmt = dQty * ((dMRP * dTax) / (100 + dTax));
            dPerTaxAmt = 1 * ((dMRP * dTax) / (100 + dTax));
            dOrginalTaxAmt = 1 * ((dMRP * dTax) / (100 + dTax));
            if (strTaxOnFree == "Yes") {
              dTaxAmt += dFreeQty * ((dMRP * dTax) / (100 + dTax));
              dOriginalFreeTaxAmt = dFreeQty * ((dMRP * dTax) / (100 + dTax));
            }
          } else {
            dTaxAmt = dQty * ((dPurRate * dTax) / 100);
            dPerTaxAmt = 1 * ((dPurRate * dTax) / 100);
            dOrginalTaxAmt = 1 * ((dOriginalPurRate * dTax) / 100);
            if (strTaxOnFree == "Yes") {
              dTaxAmt += dFreeQty * ((dPurRate * dTax) / 100);
              dOriginalFreeTaxAmt = dFreeQty * ((dOriginalPurRate * dTax) / 100);
            }
          }
        }

        let dPurRateForOneProduct = dPurRate
        if (dQty > 0 || dFreeQty > 0) {
          dPurRateForOneProduct = (dPurRate * dQty) / (dQty + dFreeQty);
        }
        dAmount = (dPurRate * dQty) + (dTaxAmt);// - dSchmeAmt;
        dLCost = dOriginalPurRate + dOrginalTaxAmt;
        dTotFreightAmt = (dQty + dFreeQty) * dFreight;
        dAmtBeforeDis = (dOriginalPurRate * dQty);
        dAmtBeforeDis = dAmtBeforeDis + (dOrginalTaxAmt * dQty) + (dOriginalFreeTaxAmt);// - dSchmeAmt;
        oReceiptDetailsInfoArg.ReceiptSub_PerRate = dPerPurRate;
        oReceiptDetailsInfoArg.ReceiptSub_PerSelRate = dPerSalRate;
        oReceiptDetailsInfoArg.ReceiptSub_PerMRP = dPerMrp;
        oReceiptDetailsInfoArg.ReceiptSub_Amount = dAmount;
        oReceiptDetailsInfoArg.ReceiptSub_TaxAmt = dTaxAmt;
        oReceiptDetailsInfoArg.ReceiptSub_LandCost = dLCost;
        //  oReceiptDetailsInfoArg.ReceiptSub_ProdDisAmt = dDisAmt;//DisAmt
        oReceiptDetailsInfoArg.ReceiptSub_AmtBeforeTax = dAmoutBeforTaxRowise;
        oReceiptDetailsInfoArg.ReceiptSub_TotalQty = dTotQty;
        oReceiptDetailsInfoArg.ReceiptSub_TotLQty = dTotQty;
        oReceiptDetailsInfoArg.ReceiptSub_NetAmtPerProd = dAmtBeforeDis;
        oReceiptDetailsInfoArg.ReceiptSub_SGSTTaxAmount = dSGSTTaxAmount;
        oReceiptDetailsInfoArg.ReceiptSub_SGSTAmount = dSGSTAmount;
        oReceiptDetailsInfoArg.ReceiptSub_CGSTTaxAmount = dCGSTTaxAmount;
        oReceiptDetailsInfoArg.ReceiptSub_CGSTAmount = dCGSTAmount;
        oReceiptDetailsInfoArg.ReceiptSub_IGSTTaxAmount = dIGSTTaxAmount;
        oReceiptDetailsInfoArg.ReceiptSub_IGSTAmount = dIGSTAmount;
        oReceiptDetailsInfoArg.ReceiptSub_BarCode = dPurRateForOneProduct;

        this.ReceiptInfoMain.MRPValue = dTotMRPValue;
        this.ReceiptInfoMain.VatCollected = dTotVatCollected;
        this.ReceiptInfoMain.PurchaseValue = dTotSaleValue;
        this.ReceiptInfoMain.Excempted = dTotExcempted;


        let ID = oReceiptDetailsInfoArg.ReceiptSub_Id;
        let DeceimalPlace = parseFloat(this.txtRateDecimalPlace || 0);

        let decMRP4RetailMargin = 0;
        let dTaxPersForRetailMargin = oReceiptDetailsInfoArg.ReceiptSub_Frgt;
        let dOriginalSelRate = oReceiptDetailsInfoArg.ReceiptSub_SellRate;

        //

        if (this.txtMrpInclusiveSales == "Yes") {
          dOriginalSelRate = dOriginalSelRate - ((dOriginalSelRate * dTaxPersForRetailMargin) / (100 + dTaxPersForRetailMargin));
          if (oReceiptDetailsInfoArg.ReceiptSub_ReceiptRate > 0) {
            oReceiptDetailsInfoArg.ReceiptSub_WholSalMag = ((dOriginalSelRate - parseFloat(oReceiptDetailsInfoArg.ReceiptSub_LandCost || 0)) / parseFloat(oReceiptDetailsInfoArg.ReceiptSub_LandCost || 0)) * 100;
          }

        } else {

          if (oReceiptDetailsInfoArg.ReceiptSub_ReceiptRate > 0) {
            oReceiptDetailsInfoArg.ReceiptSub_WholSalMag = ((dOriginalSelRate - parseFloat(oReceiptDetailsInfoArg.ReceiptSub_ReceiptRate || 0)) / parseFloat(oReceiptDetailsInfoArg.ReceiptSub_ReceiptRate || 0)) * 100;

          }
        }

        if (this.txtSoftwareName == "RetailPharma") {

          if (oReceiptDetailsInfoArg.ReceiptSub_MRP > 0) {
            decMRP4RetailMargin = oReceiptDetailsInfoArg.ReceiptSub_MRP;
            if (strTaxOn == "MRP Inclusive")
              decMRP4RetailMargin = decMRP4RetailMargin - (decMRP4RetailMargin * dTaxPersForRetailMargin / (100 + dTaxPersForRetailMargin));
            if (strTaxOn == "SELLING RATE")//SellingRate to PurchaseRate 
              decMRP4RetailMargin = decMRP4RetailMargin - (dOriginalSelRate * dTaxPersForRetailMargin / 100);

            if (oReceiptDetailsInfoArg.ReceiptSub_LandCost != 0)
              oReceiptDetailsInfoArg.ReceiptSub_RetlMargin = ((decMRP4RetailMargin - parseFloat(oReceiptDetailsInfoArg.ReceiptSub_LandCost || 0)) / parseFloat(oReceiptDetailsInfoArg.ReceiptSub_LandCost || 0)) * 100;
            else
              oReceiptDetailsInfoArg.ReceiptSub_RetlMargin = 0;
          }

        } else {
          if (oReceiptDetailsInfoArg.ReceiptSub_MRP > 0) {
            decMRP4RetailMargin = oReceiptDetailsInfoArg.ReceiptSub_MRP;
            if (strTaxOn == "MRP Inclusive")
              decMRP4RetailMargin = decMRP4RetailMargin - (decMRP4RetailMargin * dTaxPersForRetailMargin / (100 + dTaxPersForRetailMargin));
            if (strTaxOn == "SELLING RATE")//SellingRate to PurchaseRate 
              decMRP4RetailMargin = decMRP4RetailMargin - (dOriginalSelRate * dTaxPersForRetailMargin / 100);

            if (dOriginalSelRate != 0)
              oReceiptDetailsInfoArg.ReceiptSub_RetlMargin = ((decMRP4RetailMargin - dOriginalSelRate) / dOriginalSelRate) * 100;
            else
              oReceiptDetailsInfoArg.ReceiptSub_RetlMargin = 0;
          }

        }
        if (index == ID) {
          // $('#txtWholeSaleMarginCurRow').val(oReceiptDetailsInfoArg.ReceiptSub_WholSalMag.toFixed(DeceimalPlace));
          // $('#txtRetailMarginPerRow').val(oReceiptDetailsInfoArg.ReceiptSub_RetlMargin.toFixed(DeceimalPlace))
        }
        if (DeceimalPlace != 3) {
          let decLastDegitValue: any;
          let strSplit = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_Amount || 0).toFixed(3).split(".");
          if (strSplit.length > 1) {
            decLastDegitValue = strSplit[1];
            if (decLastDegitValue.length >= 3)
              decLastDegitValue = decLastDegitValue.substring(2);
            if (decLastDegitValue == 5)
              oReceiptDetailsInfoArg.ReceiptSub_Amount += parseFloat(oReceiptDetailsInfoArg.ReceiptSub_Amount || 0) % .001;
          }

          oReceiptDetailsInfoArg.ReceiptSub_Amount = Math.round(parseFloat(oReceiptDetailsInfoArg.ReceiptSub_Amount || 0) * 100) / 100;

          decLastDegitValue = 0;
          strSplit = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_TaxAmt || 0).toFixed(3).split(".");
          if (strSplit.length > 1) {
            decLastDegitValue = strSplit[1];
            if (decLastDegitValue.length >= 3)
              decLastDegitValue = decLastDegitValue.substring(2);
            if (decLastDegitValue == 5)
              oReceiptDetailsInfoArg.ReceiptSub_TaxAmt += parseFloat(oReceiptDetailsInfoArg.ReceiptSub_TaxAmt || 0) % .001;
          }

          oReceiptDetailsInfoArg.ReceiptSub_TaxAmt = Math.round(parseFloat(oReceiptDetailsInfoArg.ReceiptSub_TaxAmt || 0) * 100) / 100;

          this.dynamicArray[index].ReceiptSub_BarCode = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_BarCode || 0).toFixed(DeceimalPlace);
          this.dynamicArray[index].ReceiptSub_WholSalMag = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_WholSalMag || 0).toFixed(DeceimalPlace);
          this.dynamicArray[index].ReceiptSub_RetlMargin = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_RetlMargin || 0).toFixed(DeceimalPlace);
          this.dynamicArray[index].ReceiptSub_TotLQty = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_TotLQty || 0).toFixed(DeceimalPlace);
          this.dynamicArray[index].ReceiptSub_PerRate = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_PerRate || 0).toFixed(DeceimalPlace);
          this.dynamicArray[index].ReceiptSub_PerSelRate = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_PerSelRate || 0).toFixed(DeceimalPlace);
          this.dynamicArray[index].ReceiptSub_PerMRP = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_PerMRP || 0).toFixed(DeceimalPlace);
          this.dynamicArray[index].ReceiptSub_Amount = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_Amount || 0).toFixed(DeceimalPlace);
          this.dynamicArray[index].ReceiptSub_NetAmtPerProd = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_NetAmtPerProd || 0).toFixed(DeceimalPlace);
          this.dynamicArray[index].ReceiptSub_TaxAmt = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_TaxAmt || 0).toFixed(DeceimalPlace);
          this.dynamicArray[index].ReceiptSub_ProdDiscount = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_ProdDiscount || 0).toFixed(DeceimalPlace);
          this.dynamicArray[index].ReceiptSub_AmtBeforeTax = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_AmtBeforeTax || 0).toFixed(DeceimalPlace);
          this.dynamicArray[index].ReceiptSub_TotalQty = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_TotalQty || 0);
          this.dynamicArray[index].ReceiptSub_LandCost = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_LandCost || 0).toFixed(DeceimalPlace);
          this.dynamicArray[index].ReceiptSub_SGSTTaxAmount = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_SGSTTaxAmount || 0).toFixed(DeceimalPlace);
          this.dynamicArray[index].ReceiptSub_SGSTAmount = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_SGSTAmount || 0).toFixed(DeceimalPlace);
          this.dynamicArray[index].ReceiptSub_CGSTTaxAmount = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_CGSTTaxAmount || 0).toFixed(DeceimalPlace);
          this.dynamicArray[index].ReceiptSub_CGSTAmount = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_CGSTAmount || 0).toFixed(DeceimalPlace);
          this.dynamicArray[index].ReceiptSub_IGSTTaxAmount = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_IGSTTaxAmount || 0).toFixed(DeceimalPlace);
          this.dynamicArray[index].ReceiptSub_IGSTAmount = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_IGSTAmount || 0).toFixed(DeceimalPlace);

        }

      }

    }


    this.fnGetFinalTotal(dReceiptTotAmtBeforeTax, dDisPerAll);
    this.fnSelRateOnDispers(index);
  }

  fnPurRateCalculationOnCurRow(index) {
    let dActPurRate = 0, dPurRate = 0, dSelRate = 0, dMRP = 0, dAmount = 0, dProdId = 0, dWholeSaleRate = 0;
    let dDisPers = 0, dTaxAmt = 0, dTax = 0
    let strBatch = "", strTaxOn = "", strType = "", strTaxName = "";
    let strTaxOnFree = "Yes";

    let dProductId = this.dynamicArray[index].ProductId;
    dPurRate = dSelRate = dMRP = dAmount = dProdId = dWholeSaleRate = dDisPers = dTaxAmt = dActPurRate = 0;
    strBatch = strTaxOn = strTaxName = "";
    strTaxOnFree = "Yes";
    if (dProductId != 0) {
      dPurRate = parseFloat(this.dynamicArray[index].ReceiptSub_Freight || 0);
      dActPurRate = dPurRate;
      dMRP = parseFloat(this.dynamicArray[index].ReceiptSub_MRP || 0);
      dTax = parseFloat(this.dynamicArray[index].ReceiptSub_TaxPercentage || 0);
      strTaxOn = this.dynamicArray[index].ReceiptSub_TaxOn;
      var nPack = parseFloat(this.dynamicArray[index].ReceiptSub_Pack || 0);
      if (nPack == 0)
        nPack = 1;

      let dPerLandingCost = dPurRate / nPack;
      if (strTaxOn == "MRP Inclusive")
        dTaxAmt = 1 * ((dMRP * dTax) / (100 + dTax));
      else {
        dPurRate = dPurRate - ((dPurRate * dTax) / (100 + dTax));
        dTaxAmt = dActPurRate - (dPurRate);
      }
      dPurRate = dActPurRate - dTaxAmt;
      var DeceimalPlace = parseFloat(this.txtRateDecimalPlace || 0);
      // this.dynamicArray[index].ReceiptSub_ReceiptRate = (dPurRate.toFixed(DeceimalPlace));

    }

    this.fnGetTotal(index);
  }

  fnGetFinalTotal(dReceiptTotAmtBeforeTax, dDisPerAll) {

    let oListReceiptTaxInfo = this.jsonTaxData;
    let oListReceiptDetailsInfo = this.dynamicArray;

    if (oListReceiptDetailsInfo == null)
      return;

    let dTotalAmout = 0, dTotFreightAmt = 0, dFreightPerAmt = 0, dLandingCostPerQty = 0;
    let dTotAmt = 0, dAmt = 0, dTaxAmt = 0, dTotInterstateTaxAmt = 0, dQty = 0, dFreeQty = 0, dExciseDuty = 0, dLooseQty = 0;
    let dTaxAmt1 = 0, dTaxAmt2 = 0, dTaxAmt3 = 0, dTaxAmt4 = 0, dTaxAmt5 = 0, dTaxId;
    let dAmt1 = 0, dAmt2 = 0, dAmt3 = 0, dAmt4 = 0, dAmt5 = 0, dOtherCharge = 0, dRof = 0, dDebitNoteAmt = 0, dPackingChg = 0, dStampingChg = 0;
    let strType = "";
    let dTotDisAmtAll = 0;
    let dTaxAmt6 = 0, dTaxAmt7 = 0, dTaxAmt8 = 0, dTaxAmt9 = 0, dTaxAmt10 = 0, dTaxAmt11 = 0, dTaxAmt12 = 0, dTaxAmt13 = 0, dTaxAmt14 = 0, dTaxAmt15 = 0;
    let dAmt6 = 0, dAmt7 = 0, dAmt8 = 0, dAmt9 = 0, dAmt10 = 0, dAmt11 = 0, dAmt12 = 0, dAmt13 = 0, dAmt14 = 0, dAmt15 = 0;
    let dSGSTTaxAmt = 0, dCGSTTaxAmt = 0, dIGSTTaxAmt = 0, dSGSTAmt = 0, dCGSTAmt = 0, dIGSTAmt = 0;
    let dSGSTTaxAmt1 = 0, dSGSTTaxAmt2 = 0, dSGSTTaxAmt3 = 0, dSGSTTaxAmt4 = 0, dSGSTTaxAmt5 = 0, dSGSTTaxAmt6 = 0, dSGSTTaxAmt7 = 0, dSGSTTaxAmt8 = 0, dSGSTTaxAmt9 = 0, dSGSTTaxAmt10 = 0, dSGSTTaxAmt11 = 0, dSGSTTaxAmt12 = 0, dSGSTTaxAmt13 = 0, dSGSTTaxAmt14 = 0, dSGSTTaxAmt15 = 0;
    let dCGSTTaxAmt1 = 0, dCGSTTaxAmt2 = 0, dCGSTTaxAmt3 = 0, dCGSTTaxAmt4 = 0, dCGSTTaxAmt5 = 0, dCGSTTaxAmt6 = 0, dCGSTTaxAmt7 = 0, dCGSTTaxAmt8 = 0, dCGSTTaxAmt9 = 0, dCGSTTaxAmt10 = 0, dCGSTTaxAmt11 = 0, dCGSTTaxAmt12 = 0, dCGSTTaxAmt13 = 0, dCGSTTaxAmt14 = 0, dCGSTTaxAmt15 = 0;
    let dIGSTTaxAmt1 = 0, dIGSTTaxAmt2 = 0, dIGSTTaxAmt3 = 0, dIGSTTaxAmt4 = 0, dIGSTTaxAmt5 = 0, dIGSTTaxAmt6 = 0, dIGSTTaxAmt7 = 0, dIGSTTaxAmt8 = 0, dIGSTTaxAmt9 = 0, dIGSTTaxAmt10 = 0, dIGSTTaxAmt11 = 0, dIGSTTaxAmt12 = 0, dIGSTTaxAmt13 = 0, dIGSTTaxAmt14 = 0, dIGSTTaxAmt15 = 0;
    let dSGSTAmt1 = 0, dSGSTAmt2 = 0, dSGSTAmt3 = 0, dSGSTAmt4 = 0, dSGSTAmt5 = 0, dSGSTAmt6 = 0, dSGSTAmt7 = 0, dSGSTAmt8 = 0, dSGSTAmt9 = 0, dSGSTAmt10 = 0, dSGSTAmt11 = 0, dSGSTAmt12 = 0, dSGSTAmt13 = 0, dSGSTAmt14 = 0, dSGSTAmt15 = 0;
    let dCGSTAmt1 = 0, dCGSTAmt2 = 0, dCGSTAmt3 = 0, dCGSTAmt4 = 0, dCGSTAmt5 = 0, dCGSTAmt6 = 0, dCGSTAmt7 = 0, dCGSTAmt8 = 0, dCGSTAmt9 = 0, dCGSTAmt10 = 0, dCGSTAmt11 = 0, dCGSTAmt12 = 0, dCGSTAmt13 = 0, dCGSTAmt14 = 0, dCGSTAmt15 = 0;
    let dIGSTAmt1 = 0, dIGSTAmt2 = 0, dIGSTAmt3 = 0, dIGSTAmt4 = 0, dIGSTAmt5 = 0, dIGSTAmt6 = 0, dIGSTAmt7 = 0, dIGSTAmt8 = 0, dIGSTAmt9 = 0, dIGSTAmt10 = 0, dIGSTAmt11 = 0, dIGSTAmt12 = 0, dIGSTAmt13 = 0, dIGSTAmt14 = 0, dIGSTAmt15 = 0;
    let dOtherChgTaxPers = 0, dOtherChgTaxAmt = 0, dOtherChgSGST = 0, dOtherChgCGST = 0, dOtherChgIGST = 0;
    let dPackingChgTaxPers = 0, dPackingChgTaxAmt = 0, dPackingChgSGST = 0, dPackingChgCGST = 0, dPackingChgIGST = 0;
    let dStampingChgTaxPers = 0, dStampingChgTaxAmt = 0, dStampingChgSGST = 0, dStampingChgCGST = 0, dStampingChgIGST = 0;
    let dCessAmt1 = 0, dCessAmt2 = 0, dCessAmt3 = 0, dCessAmt4 = 0, dCessAmt5 = 0, dCessAmt6 = 0, dCessAmt7 = 0, dCessAmt8 = 0, dCessAmt9 = 0, dCessAmt10 = 0;
    let dCessAmt11 = 0, dCessAmt12 = 0, dCessAmt13 = 0, dCessAmt14 = 0, dCessAmt15 = 0
    let dRowCessAmt = 0, dRowAdditionalCessAmt = 0;
    var dAdditionalCessAmt1 = 0, dAdditionalCessAmt2 = 0, dAdditionalCessAmt3 = 0, dAdditionalCessAmt4 = 0, dAdditionalCessAmt5 = 0, dAdditionalCessAmt6 = 0, dAdditionalCessAmt7 = 0, dAdditionalCessAmt8 = 0, dAdditionalCessAmt9 = 0, dAdditionalCessAmt10 = 0;
    var dAdditionalCessAmt11 = 0, dAdditionalCessAmt12 = 0, dAdditionalCessAmt13 = 0, dAdditionalCessAmt14 = 0, dAdditionalCessAmt15 = 0;

    let DeceimalPlace = parseFloat(this.txtRateDecimalPlace || 0);

    if (dDisPerAll > 0)
      dTotDisAmtAll = (dReceiptTotAmtBeforeTax * dDisPerAll) / 100;


    if (this.ReceiptInfoMain.Field3 != 'Amt') {
      this.ReceiptInfoMain.DisAmt = dTotDisAmtAll;
    }
    // this.ReceiptInfoMain.DisAmt = dTotDisAmtAll;
    dTotFreightAmt = this.ReceiptInfoMain.Receipt_Freight;

    strType = this.ReceiptInfoMain.Receipt_Type;

    dOtherChgTaxPers = parseFloat(<any>this.ReceiptInfoMain.Receipt_OtherTaxPers || 0);
    dPackingChgTaxPers = parseFloat(<any>this.ReceiptInfoMain.Receipt_PackingChgTaxPers || 0);
    dStampingChgTaxPers = parseFloat(<any>this.ReceiptInfoMain.Receipt_StampingChgTaxPers || 0);
    dOtherCharge = parseFloat(<any>this.ReceiptInfoMain.Receipt_Othercharge || 0);
    dExciseDuty = parseFloat(<any>this.ReceiptInfoMain.LandingCost || 0);
    dPackingChg = parseFloat(<any>this.ReceiptInfoMain.Receipt_PackingChg || 0);
    dStampingChg = parseFloat(<any>this.ReceiptInfoMain.Receipt_StampingChg || 0);
    dDebitNoteAmt = parseFloat(<any>this.ReceiptInfoMain.Receipt_DbAmt || 0);

    dOtherChgTaxAmt = (dOtherCharge * dOtherChgTaxPers) / 100;
    dPackingChgTaxAmt = (dPackingChg * dPackingChgTaxPers) / 100;
    dStampingChgTaxAmt = (dStampingChg * dStampingChgTaxPers) / 100;

    if (strType == "LOCAL") {
      dOtherChgSGST = (dOtherChgTaxAmt / 2);
      dOtherChgCGST = (dOtherChgTaxAmt / 2);
      dPackingChgSGST = (dPackingChgTaxAmt / 2);
      dPackingChgCGST = (dPackingChgTaxAmt / 2);
      dStampingChgSGST = (dStampingChgTaxAmt / 2);
      dStampingChgCGST = (dStampingChgTaxAmt / 2);
    } else {
      dOtherChgIGST = parseFloat(<any>dOtherChgTaxAmt || 0);
      dPackingChgIGST = parseFloat(<any>dPackingChgTaxAmt || 0);
      dStampingChgIGST = parseFloat(<any>dStampingChgTaxAmt || 0);
    }
    // landing cost calculation
    if (dTotFreightAmt > 0) {
      for (const oReceiptDetailsInfoArg of oListReceiptDetailsInfo) {
        if (oReceiptDetailsInfoArg.ProductId !== undefined) {
          dTotalAmout += parseFloat(oReceiptDetailsInfoArg.ReceiptSub_ReceiptQty || 0) * parseFloat(oReceiptDetailsInfoArg.ReceiptSub_ReceiptRate || 0);
        }
      }

      if (dTotFreightAmt > 0 && dTotalAmout > 0)
        dFreightPerAmt = dTotFreightAmt / dTotalAmout;
    }


    let dTotQty = 0;

    for (let index = 0; index < oListReceiptDetailsInfo.length; index++) {
      const oReceiptDetailsInfoArg = oListReceiptDetailsInfo[index];
      if (oReceiptDetailsInfoArg.ProductId !== undefined) {
        this.dynamicArray[index].ReceiptSub_Id = index;

        dLandingCostPerQty = 0;
        dLandingCostPerQty = dFreightPerAmt * parseFloat(oReceiptDetailsInfoArg.ReceiptSub_ReceiptRate || 0);
        oReceiptDetailsInfoArg.ReceiptSub_LandCost = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_LandCost || 0) + dLandingCostPerQty;
        var ID = oReceiptDetailsInfoArg.ReceiptSub_Id;

        this.dynamicArray[ID].ReceiptSub_LandCost = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_LandCost || 0).toFixed(DeceimalPlace);

        let dLandingCost = parseFloat(this.dynamicArray[ID].ReceiptSub_LandCost || 0);
        let dPurRate = parseFloat(this.dynamicArray[ID].ReceiptSub_BarCode || 0);
        let dMrp = parseFloat(this.dynamicArray[ID].ReceiptSub_MRP || 0);
        let dSelRate = parseFloat(this.dynamicArray[ID].ReceiptSub_SellRate || 0);
        let dMrpMarginAmt = 0, dMrpMarginPers = 0, dSelRateMarginAmt = 0, dSelRateMarginPers = 100;

        if (dLandingCost > 0) {
          dMrpMarginAmt = dMrp - dLandingCost;
          dMrpMarginPers = (dMrpMarginAmt / dLandingCost) * 100;
          if (this.txtMrpInclusiveSales == 'Yes') {
            dSelRateMarginAmt = dSelRate - dLandingCost;
            if (dLandingCost > 0) {
              dSelRateMarginPers = (dSelRateMarginAmt / dLandingCost) * 100;
            }

          } else {
            dSelRateMarginAmt = dSelRate - dPurRate;
            if (dPurRate > 0) {
              dSelRateMarginPers = (dSelRateMarginAmt / dPurRate) * 100;
            }
          }
        }


        this.dynamicArray[ID].txtPurMrpMarginPers = dMrpMarginPers.toFixed(2);
        this.dynamicArray[ID].txtPurSelRateMarginPers = dSelRateMarginPers.toFixed(2);

        dQty = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_ReceiptQty || 0);
        dFreeQty = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_ReceiptFree || 0);
        dLooseQty = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_LooseQty || 0);
        dTotQty = dTotQty + (dQty + dFreeQty);

        if (oReceiptDetailsInfoArg.ProductId != 0 && (dQty > 0 || dFreeQty > 0 || dLooseQty > 0)) {
          dQty = 0; dFreeQty = 0;
          dAmt = dTaxAmt = 0; dLooseQty = 0;
          dSGSTTaxAmt = dCGSTTaxAmt = dIGSTTaxAmt = dSGSTAmt = dCGSTAmt = dIGSTAmt = dRowCessAmt = 0;
          if (oReceiptDetailsInfoArg.ReceiptSub_Amount != 0) {
            dTotAmt += parseFloat(oReceiptDetailsInfoArg.ReceiptSub_Amount || 0);
            dAmt = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_Amount || 0);
            dTaxAmt = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_TaxAmt || 0);
            dSGSTTaxAmt = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_SGSTTaxAmount || 0);
            dCGSTTaxAmt = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_CGSTTaxAmount || 0);
            dIGSTTaxAmt = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_IGSTTaxAmount || 0);
            dSGSTAmt = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_SGSTAmount || 0);
            dCGSTAmt = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_CGSTAmount || 0);
            dIGSTAmt = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_IGSTAmount || 0);
            dRowCessAmt = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_CessAmt || 0);
            dRowAdditionalCessAmt = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_ExtraCessAmt || 0);
          }
          if (oReceiptDetailsInfoArg.TaxId != 0) {
            dTaxId = parseFloat(oReceiptDetailsInfoArg.TaxId || 0);
            if (dTaxId == 1) {

              dTaxAmt1 += dTaxAmt;
              dCessAmt1 += dRowCessAmt;
              dAdditionalCessAmt1 += dRowAdditionalCessAmt;
              dAmt1 += dAmt - dTaxAmt - dRowCessAmt - dRowAdditionalCessAmt;
              dSGSTTaxAmt1 += dSGSTTaxAmt;
              dCGSTTaxAmt1 += dCGSTTaxAmt;
              dIGSTTaxAmt1 += dIGSTTaxAmt;
              dSGSTAmt1 += dSGSTAmt;
              dCGSTAmt1 += dCGSTAmt;
              dIGSTAmt1 += dIGSTAmt;

            } else if (dTaxId == 2) {

              dTaxAmt2 += dTaxAmt;
              dCessAmt2 += dRowCessAmt;
              dAdditionalCessAmt2 += dRowAdditionalCessAmt;
              dAmt2 += dAmt - dTaxAmt - dRowCessAmt - dRowAdditionalCessAmt;
              dSGSTTaxAmt2 += dSGSTTaxAmt;
              dCGSTTaxAmt2 += dCGSTTaxAmt;
              dIGSTTaxAmt2 += dIGSTTaxAmt;
              dSGSTAmt2 += dSGSTAmt;
              dCGSTAmt2 += dCGSTAmt;
              dIGSTAmt2 += dIGSTAmt;

            } else if (dTaxId == 3) {
              dTaxAmt3 += dTaxAmt;
              dCessAmt3 += dRowCessAmt;
              dAdditionalCessAmt3 += dRowAdditionalCessAmt;
              dAmt3 += dAmt - dTaxAmt - dRowCessAmt - dRowAdditionalCessAmt;
              dSGSTTaxAmt3 += dSGSTTaxAmt;
              dCGSTTaxAmt3 += dCGSTTaxAmt;
              dIGSTTaxAmt3 += dIGSTTaxAmt;
              dSGSTAmt3 += dSGSTAmt;
              dCGSTAmt3 += dCGSTAmt;
              dIGSTAmt3 += dIGSTAmt;
            } else if (dTaxId == 4) {
              dTaxAmt4 += dTaxAmt;
              dCessAmt4 += dRowCessAmt;
              dAdditionalCessAmt4 += dRowAdditionalCessAmt;
              dAmt4 += dAmt - dTaxAmt - dRowCessAmt - dRowAdditionalCessAmt;
              dSGSTTaxAmt4 += dSGSTTaxAmt;
              dCGSTTaxAmt4 += dCGSTTaxAmt;
              dIGSTTaxAmt4 += dIGSTTaxAmt;
              dSGSTAmt4 += dSGSTAmt;
              dCGSTAmt4 += dCGSTAmt;
              dIGSTAmt4 += dIGSTAmt;

            } else if (dTaxId == 5) {
              dTaxAmt5 += dTaxAmt;
              dCessAmt5 += dRowCessAmt;
              dAdditionalCessAmt5 += dRowAdditionalCessAmt;
              dAmt5 += dAmt - dTaxAmt - dRowCessAmt - dRowAdditionalCessAmt;
              dSGSTTaxAmt5 += dSGSTTaxAmt;
              dCGSTTaxAmt5 += dCGSTTaxAmt;
              dIGSTTaxAmt5 += dIGSTTaxAmt;
              dSGSTAmt5 += dSGSTAmt;
              dCGSTAmt5 += dCGSTAmt;
              dIGSTAmt5 += dIGSTAmt;

            } else if (dTaxId == 6) {
              dTaxAmt6 += dTaxAmt;
              dCessAmt6 += dRowCessAmt;
              dAdditionalCessAmt6 += dRowAdditionalCessAmt;
              dAmt6 += dAmt - dTaxAmt - dRowCessAmt - dRowAdditionalCessAmt;
              dSGSTTaxAmt6 += dSGSTTaxAmt;
              dCGSTTaxAmt6 += dCGSTTaxAmt;
              dIGSTTaxAmt6 += dIGSTTaxAmt;
              dSGSTAmt6 += dSGSTAmt;
              dCGSTAmt6 += dCGSTAmt;
              dIGSTAmt6 += dIGSTAmt;

            } else if (dTaxId == 7) {
              dTaxAmt7 += dTaxAmt;
              dCessAmt7 += dRowCessAmt;
              dAdditionalCessAmt7 += dRowAdditionalCessAmt;
              dAmt7 += dAmt - dTaxAmt - dRowCessAmt - dRowAdditionalCessAmt;
              dSGSTTaxAmt7 += dSGSTTaxAmt;
              dCGSTTaxAmt7 += dCGSTTaxAmt;
              dIGSTTaxAmt7 += dIGSTTaxAmt;
              dSGSTAmt7 += dSGSTAmt;
              dCGSTAmt7 += dCGSTAmt;
              dIGSTAmt7 += dIGSTAmt;

            } else if (dTaxId == 8) {
              dTaxAmt8 += dTaxAmt;
              dCessAmt8 += dRowCessAmt;
              dAdditionalCessAmt8 += dRowAdditionalCessAmt;


              dAmt8 += dAmt - dTaxAmt - dRowCessAmt - dRowAdditionalCessAmt;
              dSGSTTaxAmt8 += dSGSTTaxAmt;
              dCGSTTaxAmt8 += dCGSTTaxAmt;
              dIGSTTaxAmt8 += dIGSTTaxAmt;
              dSGSTAmt8 += dSGSTAmt;
              dCGSTAmt8 += dCGSTAmt;
              dIGSTAmt8 += dIGSTAmt;

            } else if (dTaxId == 9) {
              dTaxAmt9 += dTaxAmt;
              dCessAmt9 += dRowCessAmt;
              dAdditionalCessAmt9 += dRowAdditionalCessAmt;
              dAmt9 += dAmt - dTaxAmt - dRowCessAmt - dRowAdditionalCessAmt;
              dSGSTTaxAmt9 += dSGSTTaxAmt;
              dCGSTTaxAmt9 += dCGSTTaxAmt;
              dIGSTTaxAmt9 += dIGSTTaxAmt;
              dSGSTAmt9 += dSGSTAmt;
              dCGSTAmt9 += dCGSTAmt;
              dIGSTAmt9 += dIGSTAmt;

            } else if (dTaxId == 10) {
              dTaxAmt10 += dTaxAmt;
              dCessAmt10 += dRowCessAmt;
              dAdditionalCessAmt10 += dRowAdditionalCessAmt;
              dAmt10 += dAmt - dTaxAmt - dRowCessAmt - dRowAdditionalCessAmt;
              dSGSTTaxAmt10 += dSGSTTaxAmt;
              dCGSTTaxAmt10 += dCGSTTaxAmt;
              dIGSTTaxAmt10 += dIGSTTaxAmt;
              dSGSTAmt10 += dSGSTAmt;
              dCGSTAmt10 += dCGSTAmt;
              dIGSTAmt10 += dIGSTAmt;

            } else if (dTaxId == 11) {
              dTaxAmt11 += dTaxAmt;
              dCessAmt11 += dRowCessAmt;
              dAdditionalCessAmt11 += dRowAdditionalCessAmt;
              dAmt11 += dAmt - dTaxAmt - dRowCessAmt - dRowAdditionalCessAmt;
              dSGSTTaxAmt11 += dSGSTTaxAmt;
              dCGSTTaxAmt11 += dCGSTTaxAmt;
              dIGSTTaxAmt11 += dIGSTTaxAmt;
              dSGSTAmt11 += dSGSTAmt;
              dCGSTAmt11 += dCGSTAmt;
              dIGSTAmt11 += dIGSTAmt;
            } else if (dTaxId == 12) {

              dTaxAmt12 += dTaxAmt;
              dCessAmt12 += dRowCessAmt;
              dAdditionalCessAmt12 += dRowAdditionalCessAmt;
              dAmt12 += dAmt - dTaxAmt - dRowCessAmt - dRowAdditionalCessAmt;
              dSGSTTaxAmt12 += dSGSTTaxAmt;
              dCGSTTaxAmt12 += dCGSTTaxAmt;
              dIGSTTaxAmt12 += dIGSTTaxAmt;
              dSGSTAmt12 += dSGSTAmt;
              dCGSTAmt12 += dCGSTAmt;
              dIGSTAmt12 += dIGSTAmt;
            } else if (dTaxId == 13) {
              dTaxAmt13 += dTaxAmt;
              dCessAmt13 += dRowCessAmt;
              dAdditionalCessAmt13 += dRowAdditionalCessAmt;
              dAmt13 += dAmt - dTaxAmt - dRowCessAmt - dRowAdditionalCessAmt;
              dSGSTTaxAmt13 += dSGSTTaxAmt;
              dCGSTTaxAmt13 += dCGSTTaxAmt;
              dIGSTTaxAmt13 += dIGSTTaxAmt;
              dSGSTAmt13 += dSGSTAmt;
              dCGSTAmt13 += dCGSTAmt;
              dIGSTAmt13 += dIGSTAmt;
            } else if (dTaxId == 14) {

              dTaxAmt14 += dTaxAmt;
              dCessAmt14 += dRowCessAmt;
              dAdditionalCessAmt14 += dRowAdditionalCessAmt;
              dAmt14 += dAmt - dTaxAmt - dRowCessAmt - dRowAdditionalCessAmt;
              dSGSTTaxAmt14 += dSGSTTaxAmt;
              dCGSTTaxAmt14 += dCGSTTaxAmt;
              dIGSTTaxAmt14 += dIGSTTaxAmt;
              dSGSTAmt14 += dSGSTAmt;
              dCGSTAmt14 += dCGSTAmt;
              dIGSTAmt14 += dIGSTAmt;

            } else if (dTaxId == 15) {

              dTaxAmt15 += dTaxAmt;
              dCessAmt15 += dRowCessAmt;
              dAdditionalCessAmt15 += dRowAdditionalCessAmt;
              dAmt15 += dAmt - dTaxAmt - dRowCessAmt - dRowAdditionalCessAmt;
              dSGSTTaxAmt15 += dSGSTTaxAmt;
              dCGSTTaxAmt15 += dCGSTTaxAmt;
              dIGSTTaxAmt15 += dIGSTTaxAmt;
              dSGSTAmt15 += dSGSTAmt;
              dCGSTAmt15 += dCGSTAmt;
              dIGSTAmt15 += dIGSTAmt;

            }

          }
        }
      }
    }

    // this.txtTotQty = dTotQty;

    for (const oReceiptTaxArg of oListReceiptTaxInfo) {
      oReceiptTaxArg.TaxAmount = 0
      oReceiptTaxArg.Amount = 0;
      oReceiptTaxArg.SGSTTaxAmount = 0;
      oReceiptTaxArg.SGSTAmount = 0;
      oReceiptTaxArg.CGSTTaxAmount = 0;
      oReceiptTaxArg.CGSTAmount = 0;
      oReceiptTaxArg.IGSTTaxAmount = 0;
      oReceiptTaxArg.IGSTAmount = 0;
      oReceiptTaxArg.AdditionalCessAmt = 0;
      oReceiptTaxArg.CessAmt = 0;
      if (oReceiptTaxArg.TaxId == 1) {
        oReceiptTaxArg.TaxAmount = dTaxAmt1;
        oReceiptTaxArg.Amount = dAmt1;
        oReceiptTaxArg.SGSTTaxAmount = dSGSTTaxAmt1;
        oReceiptTaxArg.SGSTAmount = dSGSTAmt1;
        oReceiptTaxArg.CGSTTaxAmount = dCGSTTaxAmt1;
        oReceiptTaxArg.CGSTAmount = dCGSTAmt1;
        oReceiptTaxArg.IGSTTaxAmount = dIGSTTaxAmt1;
        oReceiptTaxArg.IGSTAmount = dIGSTAmt1;
        oReceiptTaxArg.CessAmt = dCessAmt1;
        oReceiptTaxArg.AdditionalCessAmt = dAdditionalCessAmt1;
      } else if (oReceiptTaxArg.TaxId == 2) {
        oReceiptTaxArg.TaxAmount = dTaxAmt2;
        oReceiptTaxArg.Amount = dAmt2;
        oReceiptTaxArg.SGSTTaxAmount = dSGSTTaxAmt2;
        oReceiptTaxArg.SGSTAmount = dSGSTAmt2;
        oReceiptTaxArg.CGSTTaxAmount = dCGSTTaxAmt2;
        oReceiptTaxArg.CGSTAmount = dCGSTAmt2;
        oReceiptTaxArg.IGSTTaxAmount = dIGSTTaxAmt2;
        oReceiptTaxArg.IGSTAmount = dIGSTAmt2;
        oReceiptTaxArg.CessAmt = dCessAmt2;
        oReceiptTaxArg.AdditionalCessAmt = dAdditionalCessAmt2;
      } else if (oReceiptTaxArg.TaxId == 3) {

        oReceiptTaxArg.TaxAmount = dTaxAmt3;
        oReceiptTaxArg.Amount = dAmt3;
        oReceiptTaxArg.SGSTTaxAmount = dSGSTTaxAmt3;
        oReceiptTaxArg.SGSTAmount = dSGSTAmt3;
        oReceiptTaxArg.CGSTTaxAmount = dCGSTTaxAmt3;
        oReceiptTaxArg.CGSTAmount = dCGSTAmt3;
        oReceiptTaxArg.IGSTTaxAmount = dIGSTTaxAmt3;
        oReceiptTaxArg.IGSTAmount = dIGSTAmt3;
        oReceiptTaxArg.CessAmt = dCessAmt3;
        oReceiptTaxArg.AdditionalCessAmt = dAdditionalCessAmt3;

      } else if (oReceiptTaxArg.TaxId == 4) {
        oReceiptTaxArg.TaxAmount = dTaxAmt4;
        oReceiptTaxArg.Amount = dAmt4;
        oReceiptTaxArg.SGSTTaxAmount = dSGSTTaxAmt4;
        oReceiptTaxArg.SGSTAmount = dSGSTAmt4;
        oReceiptTaxArg.CGSTTaxAmount = dCGSTTaxAmt4;
        oReceiptTaxArg.CGSTAmount = dCGSTAmt4;
        oReceiptTaxArg.IGSTTaxAmount = dIGSTTaxAmt4;
        oReceiptTaxArg.IGSTAmount = dIGSTAmt4;
        oReceiptTaxArg.CessAmt = dCessAmt4;
        oReceiptTaxArg.AdditionalCessAmt = dAdditionalCessAmt4;
      } else if (oReceiptTaxArg.TaxId == 5) {
        oReceiptTaxArg.TaxAmount = dTaxAmt5;
        oReceiptTaxArg.Amount = dAmt5;
        oReceiptTaxArg.SGSTTaxAmount = dSGSTTaxAmt5;
        oReceiptTaxArg.SGSTAmount = dSGSTAmt5;
        oReceiptTaxArg.CGSTTaxAmount = dCGSTTaxAmt5;
        oReceiptTaxArg.CGSTAmount = dCGSTAmt5;
        oReceiptTaxArg.IGSTTaxAmount = dIGSTTaxAmt5;
        oReceiptTaxArg.IGSTAmount = dIGSTAmt5;
        oReceiptTaxArg.CessAmt = dCessAmt5;
        oReceiptTaxArg.AdditionalCessAmt = dAdditionalCessAmt5;
      } else if (oReceiptTaxArg.TaxId == 6) {
        oReceiptTaxArg.TaxAmount = dTaxAmt6;
        oReceiptTaxArg.Amount = dAmt6;
        oReceiptTaxArg.SGSTTaxAmount = dSGSTTaxAmt6;
        oReceiptTaxArg.SGSTAmount = dSGSTAmt6;
        oReceiptTaxArg.CGSTTaxAmount = dCGSTTaxAmt6;
        oReceiptTaxArg.CGSTAmount = dCGSTAmt6;
        oReceiptTaxArg.IGSTTaxAmount = dIGSTTaxAmt6;
        oReceiptTaxArg.IGSTAmount = dIGSTAmt6;
        oReceiptTaxArg.CessAmt = dCessAmt6;
        oReceiptTaxArg.AdditionalCessAmt = dAdditionalCessAmt6;
      } else if (oReceiptTaxArg.TaxId == 7) {
        oReceiptTaxArg.TaxAmount = dTaxAmt7;
        oReceiptTaxArg.Amount = dAmt7;
        oReceiptTaxArg.SGSTTaxAmount = dSGSTTaxAmt7;
        oReceiptTaxArg.SGSTAmount = dSGSTAmt7;
        oReceiptTaxArg.CGSTTaxAmount = dCGSTTaxAmt7;
        oReceiptTaxArg.CGSTAmount = dCGSTAmt7;
        oReceiptTaxArg.IGSTTaxAmount = dIGSTTaxAmt7;
        oReceiptTaxArg.IGSTAmount = dIGSTAmt7;
        oReceiptTaxArg.CessAmt = dCessAmt7;
        oReceiptTaxArg.AdditionalCessAmt = dAdditionalCessAmt7;
      } else if (oReceiptTaxArg.TaxId == 8) {
        oReceiptTaxArg.TaxAmount = dTaxAmt8;
        oReceiptTaxArg.Amount = dAmt8;
        oReceiptTaxArg.SGSTTaxAmount = dSGSTTaxAmt8;
        oReceiptTaxArg.SGSTAmount = dSGSTAmt8;
        oReceiptTaxArg.CGSTTaxAmount = dCGSTTaxAmt8;
        oReceiptTaxArg.CGSTAmount = dCGSTAmt8;
        oReceiptTaxArg.IGSTTaxAmount = dIGSTTaxAmt8;
        oReceiptTaxArg.IGSTAmount = dIGSTAmt8;
        oReceiptTaxArg.CessAmt = dCessAmt8;
        oReceiptTaxArg.AdditionalCessAmt = dAdditionalCessAmt8;
      } else if (oReceiptTaxArg.TaxId == 9) {
        oReceiptTaxArg.TaxAmount = dTaxAmt9;
        oReceiptTaxArg.Amount = dAmt9;
        oReceiptTaxArg.SGSTTaxAmount = dSGSTTaxAmt9;
        oReceiptTaxArg.SGSTAmount = dSGSTAmt9;
        oReceiptTaxArg.CGSTTaxAmount = dCGSTTaxAmt9;
        oReceiptTaxArg.CGSTAmount = dCGSTAmt9;
        oReceiptTaxArg.IGSTTaxAmount = dIGSTTaxAmt9;
        oReceiptTaxArg.IGSTAmount = dIGSTAmt9;
        oReceiptTaxArg.CessAmt = dCessAmt9;
        oReceiptTaxArg.AdditionalCessAmt = dAdditionalCessAmt9;
      } else if (oReceiptTaxArg.TaxId == 10) {
        oReceiptTaxArg.TaxAmount = dTaxAmt10;
        oReceiptTaxArg.Amount = dAmt10;
        oReceiptTaxArg.SGSTTaxAmount = dSGSTTaxAmt10;
        oReceiptTaxArg.SGSTAmount = dSGSTAmt10;
        oReceiptTaxArg.CGSTTaxAmount = dCGSTTaxAmt10;
        oReceiptTaxArg.CGSTAmount = dCGSTAmt10;
        oReceiptTaxArg.IGSTTaxAmount = dIGSTTaxAmt10;
        oReceiptTaxArg.IGSTAmount = dIGSTAmt10;
        oReceiptTaxArg.CessAmt = dCessAmt10;
        oReceiptTaxArg.AdditionalCessAmt = dAdditionalCessAmt10;
      } else if (oReceiptTaxArg.TaxId == 11) {
        oReceiptTaxArg.TaxAmount = dTaxAmt11;
        oReceiptTaxArg.Amount = dAmt11;
        oReceiptTaxArg.SGSTTaxAmount = dSGSTTaxAmt11;
        oReceiptTaxArg.SGSTAmount = dSGSTAmt11;
        oReceiptTaxArg.CGSTTaxAmount = dCGSTTaxAmt11;
        oReceiptTaxArg.CGSTAmount = dCGSTAmt11;
        oReceiptTaxArg.IGSTTaxAmount = dIGSTTaxAmt11;
        oReceiptTaxArg.IGSTAmount = dIGSTAmt11;
        oReceiptTaxArg.CessAmt = dCessAmt11;
        oReceiptTaxArg.AdditionalCessAmt = dAdditionalCessAmt11;
      } else if (oReceiptTaxArg.TaxId == 12) {
        oReceiptTaxArg.TaxAmount = dTaxAmt12;
        oReceiptTaxArg.Amount = dAmt12;
        oReceiptTaxArg.SGSTTaxAmount = dSGSTTaxAmt12;
        oReceiptTaxArg.SGSTAmount = dSGSTAmt12;
        oReceiptTaxArg.CGSTTaxAmount = dCGSTTaxAmt12;
        oReceiptTaxArg.CGSTAmount = dCGSTAmt12;
        oReceiptTaxArg.IGSTTaxAmount = dIGSTTaxAmt12;
        oReceiptTaxArg.IGSTAmount = dIGSTAmt12;
        oReceiptTaxArg.CessAmt = dCessAmt12;
        oReceiptTaxArg.AdditionalCessAmt = dAdditionalCessAmt12;
      } else if (oReceiptTaxArg.TaxId == 13) {
        oReceiptTaxArg.TaxAmount = dTaxAmt13;
        oReceiptTaxArg.Amount = dAmt13;
        oReceiptTaxArg.SGSTTaxAmount = dSGSTTaxAmt13;
        oReceiptTaxArg.SGSTAmount = dSGSTAmt13;
        oReceiptTaxArg.CGSTTaxAmount = dCGSTTaxAmt13;
        oReceiptTaxArg.CGSTAmount = dCGSTAmt13;
        oReceiptTaxArg.IGSTTaxAmount = dIGSTTaxAmt13;
        oReceiptTaxArg.IGSTAmount = dIGSTAmt13;
        oReceiptTaxArg.CessAmt = dCessAmt13;
        oReceiptTaxArg.AdditionalCessAmt = dAdditionalCessAmt13;
      } else if (oReceiptTaxArg.TaxId == 14) {
        oReceiptTaxArg.TaxAmount = dTaxAmt14;
        oReceiptTaxArg.Amount = dAmt14;
        oReceiptTaxArg.SGSTTaxAmount = dSGSTTaxAmt14;
        oReceiptTaxArg.SGSTAmount = dSGSTAmt14;
        oReceiptTaxArg.CGSTTaxAmount = dCGSTTaxAmt14;
        oReceiptTaxArg.CGSTAmount = dCGSTAmt14;
        oReceiptTaxArg.IGSTTaxAmount = dIGSTTaxAmt14;
        oReceiptTaxArg.IGSTAmount = dIGSTAmt14;
        oReceiptTaxArg.CessAmt = dCessAmt14;
        oReceiptTaxArg.AdditionalCessAmt = dAdditionalCessAmt14;
      } else if (oReceiptTaxArg.TaxId == 15) {
        oReceiptTaxArg.TaxAmount = dTaxAmt15;
        oReceiptTaxArg.Amount = dAmt15;
        oReceiptTaxArg.SGSTTaxAmount = dSGSTTaxAmt15;
        oReceiptTaxArg.SGSTAmount = dSGSTAmt15;
        oReceiptTaxArg.CGSTTaxAmount = dCGSTTaxAmt15;
        oReceiptTaxArg.CGSTAmount = dCGSTAmt15;
        oReceiptTaxArg.IGSTTaxAmount = dIGSTTaxAmt15;
        oReceiptTaxArg.IGSTAmount = dIGSTAmt15;
        oReceiptTaxArg.CessAmt = dCessAmt15;
        oReceiptTaxArg.AdditionalCessAmt = dAdditionalCessAmt15;
      }
    }
    let dInvoTotal = 0;
    dRof = 0;
    dInvoTotal = parseFloat(<any>this.ReceiptInfoMain.Receipt_InvoAmt || 0);
    dTotAmt = dTotAmt + dOtherCharge + dExciseDuty + dPackingChg + dStampingChg - dDebitNoteAmt + dOtherChgTaxAmt + dPackingChgTaxAmt + dStampingChgTaxAmt;
    dRof = dInvoTotal - dTotAmt;

    this.ReceiptInfoMain.Receipt_Total = dTotAmt;
    this.ReceiptInfoMain.Receipt_ROF = dRof;

    this.ReceiptInfoMain.Receipt_Total = parseFloat(this.ReceiptInfoMain.Receipt_Total.toFixed(DeceimalPlace));
    this.ReceiptInfoMain.Receipt_ROF = parseFloat(this.ReceiptInfoMain.Receipt_ROF.toFixed(DeceimalPlace));

    if (this.ReceiptInfoMain.Field3 == "Amt")
      this.ReceiptInfoMain.Receipt_Discount = parseFloat(this.ReceiptInfoMain.Receipt_Discount.toFixed(DeceimalPlace));
    else
      this.ReceiptInfoMain.DisAmt = parseFloat(this.ReceiptInfoMain.DisAmt.toFixed(DeceimalPlace));

    this.ReceiptInfoMain.MRPValue = parseFloat(this.ReceiptInfoMain.MRPValue.toFixed(DeceimalPlace));
    this.ReceiptInfoMain.VatCollected = parseFloat(this.ReceiptInfoMain.VatCollected.toFixed(DeceimalPlace));
    this.ReceiptInfoMain.PurchaseValue = parseFloat(this.ReceiptInfoMain.PurchaseValue.toFixed(DeceimalPlace));
    this.ReceiptInfoMain.Excempted = parseFloat(this.ReceiptInfoMain.Excempted.toFixed(DeceimalPlace));
    this.Receipt_IntrStAmt = parseFloat(this.Receipt_IntrStAmt.toFixed(DeceimalPlace));
    this.ReceiptInfoMain.CSTAmt = parseFloat(this.ReceiptInfoMain.CSTAmt.toFixed(DeceimalPlace));

    this.ReceiptInfoMain.Receipt_OtherTaxAmt = parseFloat(dOtherChgTaxAmt.toFixed(DeceimalPlace));
    this.ReceiptInfoMain.Receipt_OtherSGST = parseFloat(dOtherChgSGST.toFixed(DeceimalPlace));
    this.ReceiptInfoMain.Receipt_OtherCGST = parseFloat(dOtherChgCGST.toFixed(DeceimalPlace));
    this.ReceiptInfoMain.Receipt_OtherIGST = parseFloat(dOtherChgIGST.toFixed(DeceimalPlace));
    this.ReceiptInfoMain.Receipt_PackingChgTaxAmt = parseFloat(dPackingChgTaxAmt.toFixed(DeceimalPlace));
    this.ReceiptInfoMain.Receipt_PackingChgSGST = parseFloat(dPackingChgSGST.toFixed(DeceimalPlace));
    this.ReceiptInfoMain.Receipt_PackingChgCGST = parseFloat(dPackingChgCGST.toFixed(DeceimalPlace));
    this.ReceiptInfoMain.Receipt_PackingChgIGST = parseFloat(dPackingChgIGST.toFixed(DeceimalPlace));
    this.ReceiptInfoMain.Receipt_StampingChgTaxAmt = parseFloat(dStampingChgTaxAmt.toFixed(DeceimalPlace));
    this.ReceiptInfoMain.Receipt_StampingChgSGST = parseFloat(dStampingChgSGST.toFixed(DeceimalPlace));
    this.ReceiptInfoMain.Receipt_StampingChgCGST = parseFloat(dStampingChgCGST.toFixed(DeceimalPlace));
    this.ReceiptInfoMain.Receipt_StampingChgIGST = parseFloat(dStampingChgIGST.toFixed(DeceimalPlace));

    // for (const iterator of oListReceiptTaxInfo) {

    // }
  }

  fnSelRateOnDispers(RowId) {

    const oListReceiptDetailsInfo = this.dynamicArray;
    if (oListReceiptDetailsInfo == null)
      return;
    let DeceimalPlace = parseFloat(this.txtRateDecimalPlace || 0);
    let strSoftwareName = "", strCustomerForSoftware = "", strAddOrMinus = "", strTaxOn = "";
    let dTotSaleValue = 0;
    strSoftwareName = this.txtSoftwareName;
    strCustomerForSoftware = this.txtCustomerForSoftware;
    strAddOrMinus = this.txtAddOrMinus;

    let dMarginAmt = 0, dMaxMarginPer = 0;
    let dQty = 0, dFreeQty = 0, dPurRate = 0, dSelRate = 0, dMrp = 0, dRetailDisPers = 0, dWholSaleRateDisPer = 0, dTax = 0, dOriginalSelRate = 0;
    let dSelRateMarginAmt = 0, dSelRateMarginPers = 100, dMrpMarginAmt = 0, dMrpMarginPers = 0;
    let Pack = 0;

    dRetailDisPers = this.ReceiptInfoMain.WholeSaleRateCalPers;
    dWholSaleRateDisPer = this.ReceiptInfoMain.RetailSaleRateCalPers;

    let RetailMarginAmt = 0, WholeSalesMarginAmt = 0;
    let bRowCalculation = false;

    for (const oReceiptDetailsInfoArg of oListReceiptDetailsInfo) {
      if (oReceiptDetailsInfoArg.ProductId !== undefined) {

        Pack = 0;
        dQty = dFreeQty = dPurRate = dSelRate = dMrp = dRetailDisPers = dWholSaleRateDisPer = dTax = 0;
        RetailMarginAmt = WholeSalesMarginAmt = 0;
        strTaxOn = "";
        dQty = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_ReceiptQty || 0);
        dFreeQty = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_ReceiptFree || 0);
        strTaxOn = oReceiptDetailsInfoArg.ReceiptSub_TaxOn;
        if (oReceiptDetailsInfoArg.ProductId != 0) {
          bRowCalculation = false;

          if (parseFloat(RowId || 0) < 0) {
            bRowCalculation = true
          } else if (parseFloat(RowId || 0) == parseFloat(oReceiptDetailsInfoArg.ReceiptSub_Id || 0)) {
            bRowCalculation = true
          }
          if (bRowCalculation) {

            dPurRate = dSelRate = dMrp = dRetailDisPers = dWholSaleRateDisPer = 0;
            dPurRate = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_ReceiptRate || 0);
            dSelRate = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_SellRate || 0);
            dMrp = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_MRP || 0);
            dTax = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_ActualTaxPers || 0);
            dOriginalSelRate = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_SellRate || 0);
            Pack = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_Pack || 0);
            dRetailDisPers = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_NeethiDisPers || 0);
            dWholSaleRateDisPer = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_WRateDis || 0);
            var RetailCalActive = this.nCtrlNeethiDisPers;
            var WholeSaleCalActive = this.nCtrlWholeRateMargin;
            if (strAddOrMinus == "ADD" && RetailCalActive) {
              dSelRate = (dPurRate + (dPurRate * (dRetailDisPers / 100)));
              oReceiptDetailsInfoArg.ReceiptSub_SellRate = dSelRate;
              dSelRate = (dPurRate + (dPurRate * (dWholSaleRateDisPer / 100)));
              oReceiptDetailsInfoArg.ReceiptSub_WholeSaleRate = dSelRate;
            } else if (strAddOrMinus == "MINUS" && RetailCalActive) {
              dSelRate = (dMrp - (dMrp * (dRetailDisPers / 100)));
              oReceiptDetailsInfoArg.ReceiptSub_SellRate = dSelRate;
              dSelRate = (dMrp - (dMrp * (dWholSaleRateDisPer / 100)));
              oReceiptDetailsInfoArg.ReceiptSub_WholeSaleRate = dSelRate;
            }
            let ID = oReceiptDetailsInfoArg.ReceiptSub_Id;

            if (RetailCalActive) {
              this.dynamicArray[ID].ReceiptSub_SellRate = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_SellRate || 0).toFixed(DeceimalPlace);
            }
            if (WholeSaleCalActive) {
              this.dynamicArray[ID].ReceiptSub_WholeSaleRate = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_WholeSaleRate || 0).toFixed(DeceimalPlace);
            }

            if (Pack == 0)
              Pack = 1;
            oReceiptDetailsInfoArg.ReceiptSub_Pack = Pack;
            var dNeethiSelRate = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_SellRate || 0);
            if (strSoftwareName == "RetailPharma") {
              if (dNeethiSelRate > 0 && Pack > 0)
                oReceiptDetailsInfoArg.ReceiptSub_PerSelRate = dNeethiSelRate / Pack;



              this.dynamicArray[ID].ReceiptSub_PerSelRate = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_PerSelRate || 0).toFixed(3);


              if (!RetailCalActive && !this.nCtrlSaleRate) {
                this.dynamicArray[ID].ReceiptSub_SellRate = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_MRP || 0);
              }

            }


            if (RetailCalActive)
              dTotSaleValue += (dQty + dFreeQty) * parseFloat(oReceiptDetailsInfoArg.ReceiptSub_SellRate || 0);
            else
              dTotSaleValue += (dQty + dFreeQty) * dOriginalSelRate;
            if (parseFloat(oReceiptDetailsInfoArg.ReceiptSub_LandCost || 0) > 0) {
              dMrpMarginAmt = dMrp - parseFloat(oReceiptDetailsInfoArg.ReceiptSub_LandCost || 0);
              dMrpMarginPers = (dMrpMarginAmt / parseFloat(oReceiptDetailsInfoArg.ReceiptSub_LandCost || 0)) * 100;
              dSelRateMarginAmt = parseFloat(oReceiptDetailsInfoArg.ReceiptSub_SellRate || 0) - parseFloat(oReceiptDetailsInfoArg.ReceiptSub_LandCost || 0);
              dSelRateMarginPers = (dSelRateMarginAmt / parseFloat(oReceiptDetailsInfoArg.ReceiptSub_LandCost || 0)) * 100;
            }

            if (RowId != 0 && RowId == ID) {
              // this.txtMRPMarginAmt = dMrpMarginAmt.toFixed(2);
              // this.txtMRPMarginPers= dMrpMarginPers.toFixed(2);
              // this.txtSelRateMarginAmt = dSelRateMarginAmt.toFixed(2);
              // this.txtSelRateMarginPers= dSelRateMarginPers.toFixed(2);
            }
          }
        }
        this.txtTotalSalesValue = dTotSaleValue.toFixed(DeceimalPlace);
      }
    }
  }

  async fnTaxSelectChange(eve, val) {
    this.fnGetTotal(0);
    var dTaxId = eve.target.value;
    var ServiceParams = {};
    ServiceParams['strProc'] = "TaxDetails_GetOnTaxId";
    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "TaxId";
    ProcParams["strArgmt"] = dTaxId.toString();
    oProcParams.push(ProcParams)
    ServiceParams['oProcParams'] = oProcParams;

    await this.appService.post('CommonQuery/fnGetDataReportNew', ServiceParams).toPromise()
      .then(data => {
        let jsonTax = JSON.parse(data);
        if (jsonTax.length > 0) {
          if (val == 'other') {
            this.ReceiptInfoMain.Receipt_OtherTaxPers = parseFloat(jsonTax[0].TaxPercent || 0);
          } else if (val == 'packing') {
            this.ReceiptInfoMain.Receipt_PackingChgTaxPers = parseFloat(jsonTax[0].TaxPercent || 0);
          } else {
            this.ReceiptInfoMain.Receipt_StampingChgTaxPers = parseFloat(jsonTax[0].TaxPercent || 0);
          }
          this.fnGetTotal(0);
        }
        // TaxPercent
        //other Receipt_OtherTaxGrpId Receipt_OtherTaxPers
        // packing Receipt_PackingChgTaxGrpId Receipt_PackingChgTaxPers
        // stamp Receipt_StampingChg Receipt_StampingChgTaxPers
      })
  }

  async fnbackTolist() {
    if (confirm("Are you go to purchase list ?")) {
      this.showBill = true;
      this.selectcomplete = false;
      await this.fnclear();
      await this.fnPurchaseGets();
    }

  }

  async fnPurchaseGets() {
    let Book_FromDate = this.datePipe.transform(this.fromDate, 'yyyy-MM-dd');
    let Book_ToDate = this.datePipe.transform(this.toDate, 'yyyy-MM-dd');

    var ServiceParams = {};
    ServiceParams['strProc'] = "Receipt_GetsNew";

    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "Receipt_SlNo";
    ProcParams["strArgmt"] = this.purchaseSearch;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "FromDate";
    ProcParams["strArgmt"] = Book_FromDate;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "ToDate";
    ProcParams["strArgmt"] = Book_ToDate;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "PurBillSerId";
    ProcParams["strArgmt"] = this.ddlbillGetseries.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.branchId;
    oProcParams.push(ProcParams)
    ServiceParams['oProcParams'] = oProcParams;

    await this.appService.post('CommonQuery/fnGetDataReportNew', ServiceParams).toPromise()
      .then(res => {
        let jsonData = JSON.parse(res);
        this.billDataGets = jsonData;

      }).finally(() => {
        // this.fnclear();
      })
  }


  fnCreate() {
    this.showBill = false;
    this.btnSave = false;
    this.btnEdit = false;
    this.btnUpdate = true;
    this.btnCancel = false;
    this.btnNewBill = false;
    this.btnConvertSalesBill = false;
    this.bTempEditFlag = false;
    this.ItemDisable = [];
    this.fnclear();
  }

  async anchorclick(Flag, purchaseId, SlNo) {


    for (let taxinfo of this.jsonTaxData) {
      taxinfo.Amount = 0;
      taxinfo.TaxAmount = 0;
      taxinfo.SGSTAmount = 0;
      taxinfo.SGSTTaxAmount = 0;
      taxinfo.CGSTAmount = 0;
      taxinfo.CGSTTaxAmount = 0;
      taxinfo.IGSTAmount = 0;
      taxinfo.IGSTTaxAmount = 0;
      taxinfo.IGSTAmount = 0;
      taxinfo.CessAmt = 0;

    }
    const flag = Flag;
    const PurchaseId = purchaseId;
    const purSno = SlNo;
    this.tableBuffer = true;
    if (flag == "Cancelled@@@PurchaseDetail") {
      this.anchorclickforcancelledbill(Flag, purchaseId, SlNo);
      return;
    }

    var ServiceParams = {};

    ServiceParams['strProc'] = 'Receipt_CopyBillNo';


    var oProcParams = [];

    var ProcParams = {};
    ProcParams['strKey'] = 'Receipt_SlNo';
    ProcParams['strArgmt'] = purSno.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'PurchaseId';
    ProcParams['strArgmt'] = PurchaseId.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;

    this.showBill = false;
    this.btnCancel = true;
    this.btnEdit = false;
    this.btnSave = true;
    await this.appService.post('CommonQuery/fnGetDataReportReturnMultiTable', ServiceParams)
      .toPromise().then(x => {
        const data = JSON.parse(x);
        let JsonReceiptTaxInfo = JSON.parse(data[2]);
        for (const taxinfo of JsonReceiptTaxInfo) {
          let index = this.jsonTaxData.map(data => data.TaxId == taxinfo.TaxId).indexOf(true);
          this.jsonTaxData[index] = taxinfo;
        }

        let JsonReceiptInfo = JSON.parse(data[0])[0];

        this.ReceiptInfoMain = JsonReceiptInfo;

        this.txtCopyBillNo = JsonReceiptInfo.Receipt_SlNo;
        this.ReceiptInfoMain.Receipt_SupplierName = JsonReceiptInfo.SupplierName;


        this.ReceiptInfoMain.Receipt_Date1 = this.DateRet(JsonReceiptInfo.Receipt_Date1);
        this.ReceiptInfoMain.Receipt_InvoDate = this.DateRetCopy(JsonReceiptInfo.Receipt_InvoDate);
        this.ReceiptInfoMain.Receipt_Date2 = this.DateRetCopy(JsonReceiptInfo.Receipt_Date2);
        this.txtGSTno = JsonReceiptInfo.GstNo;
        this.PurNo = this.ReceiptInfoMain.Receipt_SlNo;


        let JsonReceiptDetailInfo = JSON.parse(data[1]);

        this.dynamicArray = JsonReceiptDetailInfo;

        this.bTempEditFlag = true;

        for (let index = 0; index < JsonReceiptDetailInfo.length; index++) {
          this.dynamicArray[index].count = index;
          this.dynamicArray[index].uniqueRowId = index;
          this.dynamicArray[index].ReceiptSub_Id = index;
          const element = JsonReceiptDetailInfo[index];
          // this.dynamicArray[index].count = index + 1;
          this.dynamicArray[index].ReceiptSub_Period = element.ReceiptSub_Period;
          this.dynamicArray[index].Code = element.nItemCode;
          this.dynamicArray[index].ItemName = element.strItemDesc

          if (this.txtSoftwareName == 'RetailPharma' || this.txtSoftwareName == 'WholeSalePharma' || this.txtExpMonthYearFormat == 'Yes') {
            this.dynamicArray[index].ReceiptSub_ExpDate = this.DateRetExpiryFormat(element.ReceiptSub_ExpDate);
          } else {
            this.dynamicArray[index].ReceiptSub_ExpDate = this.DateRet(element.ReceiptSub_ExpDate);
          }


          if (parseFloat(element.BillQty) > 0 || parseFloat(element.CorQty) != 0) {

            this.ItemDisable[index] = true;


            this.btnCancel = false;
          }
          if (element.BillQty > 0 || parseFloat(element.CorQty) != 0) {

          }
          if ((index + 1) == JsonReceiptDetailInfo.length) {

            if (flag == "CreateNewBill") {
              this.txtCopyBillNo = 0;
              for (let j = 0; j < this.dynamicArray.length; j++) {
                this.dynamicArray[j].ReceiptSub_BatchSlNo = 0;
              }

            }

          }

          let dLandingCost = parseFloat(this.dynamicArray[index].ReceiptSub_LandCost || 0);
          let dPurRate = parseFloat(this.dynamicArray[index].ReceiptSub_BarCode || 0);
          let dMrp = parseFloat(this.dynamicArray[index].ReceiptSub_MRP || 0);
          let dSelRate = parseFloat(this.dynamicArray[index].ReceiptSub_SellRate || 0);
          let dMrpMarginAmt = 0, dMrpMarginPers = 0, dSelRateMarginAmt = 0, dSelRateMarginPers = 100;

          if (dLandingCost > 0) {
            dMrpMarginAmt = dMrp - dLandingCost;
            dMrpMarginPers = (dMrpMarginAmt / dLandingCost) * 100;
            if (this.txtMrpInclusiveSales == 'Yes') {
              dSelRateMarginAmt = dSelRate - dLandingCost;
              if (dLandingCost > 0) {
                dSelRateMarginPers = (dSelRateMarginAmt / dLandingCost) * 100;
              }

            } else {
              dSelRateMarginAmt = dSelRate - dPurRate;
              if (dPurRate > 0) {
                dSelRateMarginPers = (dSelRateMarginAmt / dPurRate) * 100;
              }
            }
          }


          this.dynamicArray[index].txtPurMrpMarginPers = dMrpMarginPers.toFixed(2);
          this.dynamicArray[index].txtPurSelRateMarginPers = dSelRateMarginPers.toFixed(2);


        }
        this.tableBuffer = false;
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        var BillDate1 = JsonReceiptInfo.Receipt_Date1.split('/');
        var startDay = new Date(yyyy, mm, dd);
        var endDay = new Date(BillDate1[2], BillDate1[1], BillDate1[0]);
        var millisecondsPerDay = 1000 * 60 * 60 * 24;
        var millisBetween = startDay.getTime() - endDay.getTime();
        var days = millisBetween / millisecondsPerDay;
        days = Math.floor(days)
        var dEditDaysLimit = this.txtEditDays;


        if (dEditDaysLimit < days) {
          this.btnCancel = false;
          this.btnEdit = false;
          this.bTempEditFlag = false;
        }

        let totlength = this.dynamicArray.length;

        let prevLength = totlength - 1;
        // this.virtualScroller.items = this.dynamicArray;
        // this.virtualScroller.scrollInto(this.dynamicArray[prevLength]);

        setTimeout(() => {
          this.fnAddRow();
        }, 750);
      });

    this.btnBrowseExcel = false;
    // this.btnSave = true;
    // this.btnEdit = true;
    this.btnUpdate = false;
    this.btnPreview = true;
    //  this.btnCancel = true;
    this.btnNewBill = true;
    this.btnConvertSalesBill = true;
    this.btnBarCodePrintAll = true;
    this.billseries = true;
    if (flag == "CreateNewBill") {
      this.btnUpdate = true;
      this.btnSave = false;
      this.billseries = false
      this.btnPreview = false;
      this.btnCancel = false;
      this.btnNewBill = false;
      this.btnConvertSalesBill = false;
      this.bTempEditFlag = false;
      this.ReceiptInfoMain.PurchaseId = 0;
      this.fnGetMaxBillNo();
    }
    if (flag != "CreateNewBill") {
      var ServiceParams = {};
      ServiceParams['strProc'] = "ReceiptReturn_CheckInoviceBillReturn";

      var oProcParams = [];

      var ProcParams = {};
      ProcParams["strKey"] = "Receipt_SlNo";
      ProcParams["strArgmt"] = purSno.toString();
      oProcParams.push(ProcParams)

      ProcParams = {};
      ProcParams["strKey"] = "BranchId";
      ProcParams["strArgmt"] = this.branchId;
      oProcParams.push(ProcParams)

      ProcParams = {};
      ProcParams["strKey"] = "PurchaseId";
      ProcParams["strArgmt"] = PurchaseId.toString();
      oProcParams.push(ProcParams)
      ServiceParams['oProcParams'] = oProcParams;

      await this.appService.post('CommonQuery/fnGetDataReportNew', ServiceParams).toPromise()
        .then(data => {
          let jsonobj = JSON.parse(data);

          if (jsonobj.length > 0) {
            this.btnCancel = false;
            this.bTempEditFlag = false;
          }
        })
    }
  }

  async anchorclickforcancelledbill(Flag, purchaseId, SlNo) {
    const flag = Flag;
    const PurchaseId = purchaseId;
    const purSno = SlNo;
    this.bTempEditFlag = false;
    var varArguements = { Pur_SlNo: purSno, PurchaseId: PurchaseId };

    var DictionaryObject = {};
    DictionaryObject["dictArgmts"] = varArguements;
    DictionaryObject["ProcName"] = 'ReceiptCancel_CopyBillNo';

    await this.appService.post('/Purchase/PurchaseCancel_Copy', DictionaryObject).toPromise()
      .then(data => {
        this.jsonTaxData = data.JsonReceiptTaxInfo;

        let JsonReceiptInfo = data.JsonReceiptInfo[0];
        this.txtCopyBillNo = JsonReceiptInfo.Receipt_SlNo
        this.ReceiptInfoMain = JsonReceiptInfo;
        this.ReceiptInfoMain.Receipt_SupplierName = JsonReceiptInfo.SupplierName;
        this.txtGSTno = JsonReceiptInfo.GstNo;
        this.PurNo = this.ReceiptInfoMain.Receipt_SlNo;
        let JsonReceiptDetailInfo = data.JsonReceiptDetailInfo;
        this.dynamicArray = JsonReceiptDetailInfo;
        this.tableBuffer = false;
      });

    this.btnSave = true;
    this.btnEdit = false;
    this.btnPreview = false;
    this.btnCancel = false;
    this.btnPurchaseBillRecal = false;
    this.btnNewBill = false;
    this.btnConvertSalesBill = false;
    this.showBill = false;

  }

  isDateDDMMYYYY(date) {
    return true// _moment(date, "DD/MM/YYYY", true).isValid();
  }
  isDateMMYYYY(date) {
    return true//  _moment(date, "MM/YYYY", true).isValid();
  }

  fngetDateChange(date) {
    return this.datePipe.transform(date, 'dd/MM/yyyy')
  }

  async fnsave(flag) {

    this.fnGetTotal(0);
    this.ArgSellingRateValidation = [];
    if (!this.bSaveFlag)
      return;

    let dBillSerId = this.ReceiptInfoMain.PurBillSerId;
    if (this.branchId == 0) {
      window.location.href = '/Login/Index';
      return
    }

    if (dBillSerId == 0) {
      this.openSnackBar('Select BillSeries', 'Error');
      return;
    }

    if (this.ReceiptInfoMain.Receipt_InvoNo == '') {
      this.openSnackBar('Enter Invoice No', 'Error');
      setTimeout(() => {
        document.getElementById('txtInvoice').focus();
      });
      return
    }
    if (this.ReceiptInfoMain.Receipt_InvoAmt == 0) {
      this.openSnackBar('Enter Inovice Total', 'Error');
      setTimeout(() => {
        document.getElementById('invoTotal').focus();
      });
      return
    }

    if (this.ReceiptInfoMain.AC_Id == 0) {
      this.openSnackBar('Select Supplier', 'Error');
      setTimeout(() => {
        document.getElementById('txtSupplier').focus();
      });
      return
    }
    let invoDate: any = this.datePipe.transform(this.ReceiptInfoMain.Receipt_InvoDate, 'dd/MM/yyyy');
    if (!this.isDateDDMMYYYY(invoDate)) {
      this.openSnackBar('Invalid Invoice Date', 'Error');
      return
    }

    let dueDate: any = this.datePipe.transform(this.ReceiptInfoMain.Receipt_Date2, 'dd/MM/yyyy');

    if (!this.isDateDDMMYYYY(dueDate)) {
      this.openSnackBar('Invalid Due Date', 'Error');
      return
    }

    let strsave = 'Yes';
    let scrollPosition = 0;


    // if (this.txtSoftwareName == 'RetailPharma' || this.txtSoftwareName == 'WholeSalePharma') {
    if (this.txtExpMonthYearFormat == 'Yes' || this.txtSoftwareName == 'RetailPharma' || this.txtSoftwareName == 'WholeSalePharma') {
      for (let i = 0; i < this.dynamicArray.length; i++) {
        if (!this.isDateMMYYYY(this.dynamicArray[i].ReceiptSub_ExpDate)) {
          // document.getElementById(`txtExpDate${i}`).focus();
          strsave = 'No';
          scrollPosition = i;
          this.ArgSellingRateValidation[i] = true;


        }

      }

    } else {

      for (let i = 0; i < this.dynamicArray.length; i++) {
        if (!this.isDateDDMMYYYY(this.dynamicArray[i].ReceiptSub_ExpDate)) {
          // document.getElementById(`txtExpDate${i}`).focus();
          strsave = 'No';
          scrollPosition = i;
          this.ArgSellingRateValidation[i] = true;


        }

      }

    }
    //}

    if (strsave == "No") {
      this.openSnackBar('Enter Valid ExpDate', 'Error');
      // this.scroll.scrollToIndex(scrollPosition);
      this.scroll.scrollInto(this.dynamicArray[scrollPosition - 2]);
      // setTimeout(() => {
      //   document.getElementById(`txtExpDate${scrollPosition}`).focus();
      // }, 1000);
      return;
    }


    if (this.txtSoftwareName == 'RetailPharma' && this.nCtrlNeethiDisPers) {
      for (let i = 0; i < this.dynamicArray.length; i++) {

        let dTempLandingCost = parseFloat(this.dynamicArray[i].ReceiptSub_LandCost || 0);
        let dTempMrp = parseFloat(this.dynamicArray[i].ReceiptSub_MRP || 0);
        let dTempSelRate = parseFloat(this.dynamicArray[i].ReceiptSub_SellRate || 0);

        let dTempMrpMarginAmt = 0, dTempMrpMarginPers = 0, dTempSelRateMarginAmt = 0, dTempSelRateMarginPers = 0;
        if (dTempLandingCost > 0) {
          dTempMrpMarginAmt = dTempMrp - dTempLandingCost;
          dTempMrpMarginPers = (dTempMrpMarginAmt / dTempLandingCost) * 100;
          dTempSelRateMarginAmt = dTempSelRate - dTempLandingCost;
          dTempSelRateMarginPers = (dTempSelRateMarginAmt / dTempLandingCost) * 100;
        }

        if (dTempSelRateMarginPers <= 0 && this.dynamicArray[i].ProductId !== undefined) {
          strsave = 'No';
          scrollPosition = i;
          this.ArgSellingRateValidation[i] = true;
          //  $('#PurRate' + ID).focus();
          //  fnSetBackgroundColor(ID,"Rate");
          // document.getElementById(`txtSelRate${i}`).focus();
        }
      }

    } else {

      if (this.nCtrlSaleRate) {

        for (let i = 0; i < this.dynamicArray.length; i++) {
          var dTempLandingCost = parseFloat(this.dynamicArray[i].ReceiptSub_BarCode || 0);
          var dTempMrp = parseFloat(this.dynamicArray[i].ReceiptSub_MRP || 0);
          var dTempSelRate = parseFloat(this.dynamicArray[i].ReceiptSub_SellRate || 0);
          var dTempProductId = parseFloat(this.dynamicArray[i].ProductId || 0);
          if (dTempSelRate - dTempLandingCost <= 0 && dTempProductId > 0) {
            strsave = 'No';
            scrollPosition = i;
            this.ArgSellingRateValidation[i] = true;
            // $('#PurRate' + ID).focus();
            // fnSetBackgroundColor(ID,"Rate");
            // document.getElementById(`txtSelRate${i}`).focus();
          }
        }

      }
    }

    if (strsave == 'No') {
      this.openSnackBar('Enter valid Rate', 'Error');
      this.scroll.scrollInto(this.dynamicArray[scrollPosition - 2]);
      return;
    }



    let ReceiptInfo = {};
    this.ReceiptInfoMain.Receipt_SlNo = this.txtCopyBillNo;


    ReceiptInfo = this.ReceiptInfoMain;

    var ServiceParams = {};

    var oProcParams = [];

    var ProcParams = {};
    ProcParams['strKey'] = 'SoftwareName';
    ProcParams['strArgmt'] = this.txtSoftwareName;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'CustomerForSoftware';
    ProcParams['strArgmt'] = this.txtCustomerForSoftware;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'AddOrMinus';
    ProcParams['strArgmt'] = this.txtAddOrMinus;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'ExpMonthYearFormat';
    ProcParams['strArgmt'] = this.txtExpMonthYearFormat;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;


    let ListReceiptDetailsInfo = [];

    this.dynamicArray.forEach(iterator => {

      if (iterator.ProductId != 0 && (iterator.ReceiptSub_ReceiptQty > 0 ||
        iterator.ReceiptSub_ReceiptFree > 0 || iterator.ReceiptSub_LooseQty > 0)) {
        let ReceiptDetailsInfo = {};

        ReceiptDetailsInfo = {
          ReceiptSub_Id: iterator.ReceiptSub_Id, PurchaseId: this.ReceiptInfoMain.PurchaseId,
          ReceiptSub_BatchSlNo: iterator.ReceiptSub_BatchSlNo, ReceiptSub_Batch: iterator.ReceiptSub_Batch,
          ReceiptSub_Pack: iterator.ReceiptSub_Pack, ReceiptSub_ExpDate: iterator.ReceiptSub_ExpDate,
          ReceiptSub_ReceiptRate: parseFloat(iterator.ReceiptSub_ReceiptRate || 0), ReceiptSub_SellRate: parseFloat(iterator.ReceiptSub_SellRate || 0),
          ReceiptSub_WholeSaleRate: parseFloat(iterator.ReceiptSub_WholeSaleRate || 0), ReceiptSub_MRP: parseFloat(iterator.ReceiptSub_MRP || 0),
          ReceiptSub_PerRate: parseFloat(iterator.ReceiptSub_PerRate || 0), ReceiptSub_PerLandCost: iterator.ReceiptSub_PerLandCost,
          ReceiptSub_PerSelRate: parseFloat(iterator.ReceiptSub_PerSelRate || 0), ReceiptSub_PerMRP: parseFloat(iterator.ReceiptSub_PerMRP || 0 ),
          ReceiptSub_SaleQty: iterator.ReceiptSub_SaleQty, ReceiptSub_SaleFree: iterator.ReceiptSub_SaleFree,
          ReceiptSub_ReceiptQty: parseFloat(iterator.ReceiptSub_ReceiptQty||0), ReceiptSub_ReceiptFree: iterator.ReceiptSub_ReceiptFree,
          ReceiptSub_TotalQty: iterator.ReceiptSub_TotalQty, ReceiptSub_NetAmtPerProd: iterator.ReceiptSub_NetAmtPerProd,
          ReceiptSub_Amount: iterator.ReceiptSub_Amount, ReceiptSub_BarCode: iterator.ReceiptSub_BarCode,
          ReceiptSub_TaxPercentage: iterator.ReceiptSub_TaxPercentage, ReceiptSub_TaxAmt: iterator.ReceiptSub_TaxAmt,
          ReceiptSub_ProdDiscount: parseFloat(iterator.ReceiptSub_ProdDiscount||0), ReceiptSub_TaxOn: iterator.ReceiptSub_TaxOn,
          ReceiptSub_TaxOnFree: iterator.ReceiptSub_TaxOnFree, ReceiptSub_TaxName: iterator.ReceiptSub_TaxName,
          ReceiptSub_WholSalMag: iterator.ReceiptSub_WholSalMag, ReceiptSub_RetlMargin: iterator.ReceiptSub_RetlMargin,
          ReceiptSub_CstType: iterator.ReceiptSub_CstType, ReceiptSub_Period: this.fngetDateChange(iterator.ReceiptSub_Period),
          ProductId: iterator.ProductId, TaxId: iterator.TaxId, ReceiptSub_LandCost: parseFloat(iterator.ReceiptSub_LandCost||0),
          ReceiptSub_ProdDisAmt: iterator.ReceiptSub_ProdDisAmt, ReceiptSub_SchemePers: iterator.ReceiptSub_SchemePers,
          ReceiptSub_SchemeAmt: iterator.ReceiptSub_SchemeAmt, ReceiptSub_Freight: iterator.ReceiptSub_Freight,
          ReceiptSub_Frgt: iterator.ReceiptSub_Frgt, ReceiptSub_TotLQty: iterator.ReceiptSub_TotLQty, ReceiptSub_SpRate1: iterator.ReceiptSub_SpRate1,
          ReceiptSub_SpRate2: iterator.ReceiptSub_SpRate2, ReceiptSub_SpRate3: iterator.ReceiptSub_SpRate3, ReceiptSub_SpRate4: iterator.ReceiptSub_SpRate4,
          ReceiptSub_SpRate5: iterator.ReceiptSub_SpRate5, ReceiptSub_ActualTaxPers: iterator.ReceiptSub_ActualTaxPers,
          ReceiptSub_NeethiDisPers: iterator.ReceiptSub_NeethiDisPers, ReceiptSub_AmtBeforeTax: iterator.ReceiptSub_AmtBeforeTax,
          ReceiptSub_WRateDis: iterator.ReceiptSub_WRateDis, UniversalCode: iterator.UniversalCode, PurBillSerId: iterator.PurBillSerId,
          ReceiptSub_SGSTTaxPers: iterator.ReceiptSub_SGSTTaxPers, ReceiptSub_SGSTTaxAmount: iterator.ReceiptSub_SGSTTaxAmount,
          ReceiptSub_SGSTAmount: iterator.ReceiptSub_SGSTAmount, ReceiptSub_CGSTTaxPers: iterator.ReceiptSub_CGSTTaxPers,
          ReceiptSub_CGSTTaxAmount: iterator.ReceiptSub_CGSTTaxAmount, ReceiptSub_CGSTAmount: iterator.ReceiptSub_CGSTAmount,
          ReceiptSub_IGSTTaxPers: iterator.ReceiptSub_IGSTTaxPers, ReceiptSub_IGSTTaxAmount: iterator.ReceiptSub_IGSTTaxAmount,
          ReceiptSub_IGSTAmount: iterator.ReceiptSub_IGSTAmount, ReceiptSub_Field2: iterator.ReceiptSub_Field2,
          ReceiptSub_Field1: iterator.ReceiptSub_Field1, ReceiptSub_LooseQty: iterator.ReceiptSub_LooseQty,
          ReceiptSub_NoField1: this.ReceiptInfoMain.Receipt_Discount,

          // ReceiptSub_CessPers: iterator.ReceiptSub_CessPers, ReceiptSub_CessAmt: iterator.ReceiptSub_CessAmt,
          //  ReceiptSub_VarFiedl1: iterator.ReceiptSub_VarFiedl1,
          // ReceiptSub_ExtraCessPers: iterator.ReceiptSub_ExtraCessPers, ReceiptSub_ExtraCessAmt: iterator.ReceiptSub_ExtraCessAmt, ReceiptSub_ProdRemarks: iterator.ReceiptSub_ProdRemarks
        };
        ListReceiptDetailsInfo.push(ReceiptDetailsInfo);
      }

    });
    if (ListReceiptDetailsInfo.length == 0) {
      this.openSnackBar('Enter Product Details', 'error');
      return;
    }

    this.ReceiptInfoMain.Receipt_Date2 = dueDate;
    this.ReceiptInfoMain.Receipt_InvoDate = invoDate;

    let ListReceiptTaxInfo = [];
    ListReceiptTaxInfo = this.jsonTaxData;

    for (let i in ListReceiptTaxInfo) {
      delete ListReceiptTaxInfo[i].TaxPercent;
      delete ListReceiptTaxInfo[i].ReceiptTaxId;
      delete ListReceiptTaxInfo[i].BranchId;
      delete ListReceiptTaxInfo[i].ReceiptDate;
      delete ListReceiptTaxInfo[i].ReceiptNo;
    }
    ReceiptInfo['ListReceiptDetailsInfo'] = ListReceiptDetailsInfo;
    ReceiptInfo['ListReceiptTaxInfo'] = ListReceiptTaxInfo
    ReceiptInfo['objServiceParams'] = ServiceParams;

    if (flag == 'save') {
      if (confirm("Are you sure you want to save  this bill ?")) {

        this.bSaveFlag = false;
        this.bSaveButtonClickProgressbar = true;
        this.tableBuffer = true;
        let body = JSON.stringify(ReceiptInfo);
        await this.appService.post('Purchase/fnPurchaseSave', ReceiptInfo).toPromise().then(async data => {
          // if (this.ReceiptInfoMain.Receipt_SlNo != 0) {
          //   await this.appService.post('/Purchase/fnReceiptDetails_RemoveStockToStoreOnSalesQtyOnEdit', ReceiptInfo).toPromise()
          //     .then(data => {
          //     });
          // }
          this.openSnackBarSuccess(data, 'success');

          if (this.txtBrowseExcelFlag == "Yes") {
            await this.appService.post('/Purchase/fnUniversalCodeSaveSuppProduct', ReceiptInfo).toPromise()
              .then(data => {

              });
          }

          this.bSaveButtonClickProgressbar = false;
          this.tableBuffer = false;
          this.fnclear();

        }).finally(async () => {
          // if (this.ReceiptInfoMain.Receipt_SlNo != 0) {
          //   await this.appService.post('/Purchase/fnReceiptDetails_RemoveStockToStoreOnSalesQtyOnEdit', ReceiptInfo).toPromise()
          //     .then(data => {
          //     });
          // }
          // if (this.txtBrowseExcelFlag == "Yes") {
          //   await this.appService.post('/Purchase/fnUniversalCodeSaveSuppProduct', ReceiptInfo).toPromise()
          //     .then(data => {

          //     });
          // }
          // this.bSaveButtonClickProgressbar = false;
          // this.tableBuffer =false;
          // this.fnclear();
        }).catch((reason) => console.error(reason));
      } else {
        this.ReceiptInfoMain.Receipt_Date2 = new Date(dueDate.split('/').reverse().join('/'));
        this.ReceiptInfoMain.Receipt_InvoDate = new Date(invoDate.split('/').reverse().join('/'));

      }

    } else {
      if (confirm("Are you sure you want to Update  this bill ?")) {
        this.bSaveFlag = false;
        this.tableBuffer = true;
        if (this.ReceiptInfoMain.PurBillSerId > 0 && this.ReceiptInfoMain.Receipt_SlNo > 0) {
          await this.appService.post('/Purchase/fnUpdatePurchaseBill', ReceiptInfo).toPromise()
            .then(data => {
              this.openSnackBarSuccess(data, 'success');
              this.fnclear();
            }, err => console.log(err));

        }
        this.tableBuffer = false;
      } else {
        this.ReceiptInfoMain.Receipt_Date2 = new Date(dueDate.split('/').reverse().join('/'));
        this.ReceiptInfoMain.Receipt_InvoDate = new Date(invoDate.split('/').reverse().join('/'));
      }
    }
  }

  async fnUpdateBill() {
    let strSaveFlag = "Yes";
    let dReceiptNo = this.txtCopyBillNo;
    let dPurchaseId = this.ReceiptInfoMain.PurchaseId;
    let BranchId = this.branchId;
    let AdjustedVoucherNos = ""


    let ServiceParams = {};
    ServiceParams['strProc'] = "PurchaseBillAdustedCheckForUpdate";

    let oProcParams = [];
    let ProcParams = {};

    ProcParams["strKey"] = "Receipt_SlNo";
    ProcParams["strArgmt"] = dReceiptNo;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "PurchaseId";
    ProcParams["strArgmt"] = dPurchaseId;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = BranchId;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "InvoiceAmt";
    ProcParams["strArgmt"] = this.ReceiptInfoMain.Receipt_InvoAmt;
    oProcParams.push(ProcParams)
    ServiceParams['oProcParams'] = oProcParams;
    let jsonobj: any[] = [];
    await this.appService.post('CommonQuery/fnGetDataReportBranchStaff', ServiceParams)
      .toPromise().then(data => {
        jsonobj = JSON.parse(data);
      }).finally(async () => {
        if (jsonobj.length == 0) {
          ServiceParams = {};
          ServiceParams['strProc'] = "PurchaseBillAdustedCheckForUpdate";

          oProcParams = [];
          ProcParams = {};

          ProcParams["strKey"] = "Receipt_SlNo";
          ProcParams["strArgmt"] = dReceiptNo;
          oProcParams.push(ProcParams)

          ProcParams = {};
          ProcParams["strKey"] = "PurchaseId";
          ProcParams["strArgmt"] = dPurchaseId;
          oProcParams.push(ProcParams)

          ProcParams = {};
          ProcParams["strKey"] = "BranchId";
          ProcParams["strArgmt"] = BranchId;
          oProcParams.push(ProcParams);
          ServiceParams['oProcParams'] = oProcParams;
          ServiceParams['strProc'] = "GetVoucherNoFor_AdjustedBillsPurchase";
          await this.appService.post('/CommonQuery/fnGetDataReportBranchStaff', ServiceParams).toPromise()
            .then(data => {
              jsonobj = JSON.parse(data);
              AdjustedVoucherNos = jsonobj[0].AdjustedVouchers
            }, err => console.error(err));

          this.openSnackBar("Bill Payment Received, Not Editing Possible", AdjustedVoucherNos);
          strSaveFlag = "No"
          return;
        }
        if (strSaveFlag == "No") {
          return;
        }

        this.fnsave('update');
      });

  }

  fnclear() {
    this.bSaveButtonClickProgressbar = false;
    this.tableBuffer = false;
    this.ItemDisable = [];
    this.indexs = 0;
    this.rowIndex = 0;
    this.txtCopyBillNo = 0;
    this.btnEdit = false;
    this.btnUpdate = true;
    this.displayName = false;
    this.btnPreview = false;
    this.btnCancel = false;
    this.btnPurchaseBillRecal = false;
    this.btnNewBill = false;
    this.btnConvertSalesBill = false;
    this.btnBarCodePrintAll = false;
    this.billseries = false;
    this.btnSave = false;
    this.bTempEditFlag = false;
    this.txtBrowseExcelFlag = 'No';
    this.bgExcel = [];
    let todays: any = new Date();
    let dd: any = todays.getDate();
    let mm: any = todays.getMonth() + 1; //January is 0!
    let yyyy = todays.getFullYear();
    if (dd < 10) {
      dd = '0' + dd
    }
    if (mm < 10) {
      mm = '0' + mm
    }
    todays = dd + '/' + mm + '/' + yyyy;
    this.txtTotalSalesValue = '';
    this.dynamicArray = [];
    this.ReceiptInfoMain = {
      PurchaseId: 0, Receipt_SlNo: 0, Receipt_InvoNo: '', Receipt_InvoDate: this.today, Receipt_Date2: this.today,
      Receipt_PayTerms: 'CREDIT', Receipt_Type: 'LOCAL', Receipt_Discount: 0, Receipt_Othercharge: 0,
      Receipt_CST: 0, Receipt_RepAmt: 0, Receipt_InvoAmt: 0, Receipt_ROF: 0, Receipt_Total: 0,
      DrNotesId: "0", StaffId: parseFloat(this.staffId || 0), AC_Id: 0, BranchId: parseFloat(this.branchId || 0), OutletId: 0,
      Excempted: 0, MRPValue: 0, PurchaseValue: 0, VatCollected: 0, Field1: '',
      DisAmt: 0, CSTAmt: 0, WholeSaleRateCalPers: 0, RetailSaleRateCalPers: 0, Receipt_Date1: todays,
      LandingCost: 0, Receipt_Freight: 0, Receipt_PackingChg: 0, Receipt_StampingChg: 0,
      PurBillSerId: 0, Receipt_SupplierName: '', Receipt_Address: '', Receipt_Tin1: '',
      Receipt_Cst1: '', Receipt_DLNo1: '', Field3: 'Pers', Receipt_DbAmt: 0, Receipt_OtherTaxGrpId: 0,
      Receipt_OtherTaxPers: 0, Receipt_OtherTaxAmt: 0, Receipt_OtherSGST: 0, Receipt_OtherCGST: 0,
      Receipt_OtherIGST: 0, Receipt_PackingChgTaxGrpId: 0, Receipt_PackingChgTaxPers: 0, Receipt_PackingChgTaxAmt: 0,
      Receipt_PackingChgSGST: 0, Receipt_PackingChgCGST: 0, Receipt_PackingChgIGST: 0, Receipt_StampingChgTaxGrpId: 0,
      Receipt_StampingChgTaxPers: 0, Receipt_StampingChgTaxAmt: 0, Receipt_StampingChgSGST: 0,
      Receipt_StampingChgCGST: 0, Receipt_StampingChgIGST: 0,
    }

    this.fnBillSeries_Gets();

    this.fnAddRow();

    this.ArgSellingRateValidation = [];
    this.bSaveFlag = true;
    this.fnTaxGets();
  }

  async fnEdit() {
    let dReceiptNo = this.txtCopyBillNo;
    let dPurchaseId = this.ReceiptInfoMain.PurchaseId;
    let BranchId = this.branchId;
    if (BranchId == 0) {
      alert("<b>Session Time Out Login Again<b>");
      window.location.href = "/Login/Index";
      return;
    }

    let AdjustedVoucherNos = "";
    let ServiceParams = {};
    ServiceParams['strProc'] = "CheckPurchaseBillAdustedForEditing";

    let oProcParams = [];
    let ProcParams = {};

    ProcParams["strKey"] = "Receipt_SlNo";
    ProcParams["strArgmt"] = dReceiptNo;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "PurchaseId";
    ProcParams["strArgmt"] = dPurchaseId;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = BranchId;
    oProcParams.push(ProcParams)
    ServiceParams['oProcParams'] = oProcParams;
    var jsonobj;
    await this.appService.post('/CommonQuery/fnGetDataReportBranchStaff', ServiceParams)
      .toPromise().then(data => {
        jsonobj = JSON.parse(data);
      }).finally(async () => {
        if (jsonobj.length == 0) {
          ServiceParams['strProc'] = "GetVoucherNoFor_AdjustedBillsPurchase";
          await this.appService.post('/CommonQuery/fnGetDataReportBranchStaff', ServiceParams)
            .toPromise().then(data => {
              jsonobj = JSON.parse(data);
              AdjustedVoucherNos = jsonobj[0].AdjustedVouchers;
            })
        }

        this.btnEdit = false;
        this.btnSave = false;
        this.btnCancel = false;
        this.btnNewBill = false;
        this.btnConvertSalesBill = false;
      }).catch((reason) => console.error(reason));

  }

  fnConvertBill() {

    let dCopyBillNo = this.txtCopyBillNo;
    let dPurchaseId = this.ReceiptInfoMain.PurchaseId;
    let target = "#/salesbill"
    let url = target + '?QueryPurchaseBillNo=' + dCopyBillNo + '&QueryPurchaseId=' + dPurchaseId;
    window.open(url, '_blank');
  }

  async fnUploadExcel(files: FileList) {

    let AcId: any;
    AcId = this.ReceiptInfoMain.AC_Id;
    if (AcId == 0) {
      this.openSnackBar('Select Supplier', 'error');
      return;
    }
    this.tableBuffer = true;
    const formData: FormData = new FormData();
    formData.append('FileUpload', files[0]);
    formData.append('AcId', AcId);
    await this.appService.post(`/CommonQuery/UploadExcel`, formData)
      .toPromise().then(data => {

        this.displayName = true;
        var excelJson = JSON.parse(data.json());
        this.dynamicArray = excelJson;
        this.dynamicArray.map((data, index) => {
          data.ReceiptSub_ExpDate = this.DateRetExpiryFormat(data.ReceiptSub_ExpDate);
          data.count = index
        });


      }).catch((reason) => {
        alert(reason);
        this.tableBuffer = false;
      }).finally(() => {

        this.txtBrowseExcelFlag = 'Yes';
        this.fnGetTotal(-1);
        this.tableBuffer = false;
        this.fnBgColor();
        // document.getElementById('txtExcel').cloneNode(true);

      })

  }

  fnBgColor() {
    if (this.txtUniversalCodeLink != "Yes" || this.txtBrowseExcelFlag != "Yes") {
      return;
    }
    this.bgExcel = [];
    for (let index = 0; index < this.dynamicArray.length; index++) {
      const element = this.dynamicArray[index];
      let dProductId = element.ProductId;
      let dQty = parseFloat(element.ReceiptSub_ReceiptQty || 0) + parseFloat(element.ReceiptSub_ReceiptFree || 0);

      if (dProductId == 0 && dQty > 0) {
        this.bgExcel[index] = true;
      } else {
        this.bgExcel[index] = false;
      }
    };
  }

  reverseDate(val) {
    let date = val.split('-').reverse().join('-')
    return date
  }

  async fnPrint(index) {
    let ProductId = this.dynamicArray[index].ProductId;
    let BatchNo = this.dynamicArray[index].ReceiptSub_BatchSlNo;

    let varArguements = { BatchNo: BatchNo, ProductId: ProductId, BranchId: this.branchId };

    let DictionaryObject = {};
    DictionaryObject["dictArgmts"] = varArguements;
    DictionaryObject["ProcName"] = 'PurchaseDetails_BatchSlNoProductIdForBarCodeNew';
    await this.appService.post('/Purchase/PurchaseBarCodePrintNew', DictionaryObject).toPromise()
      .then(data => {
        let jsonobj = JSON.parse(data);
        if (jsonobj.length > 0) {
          let BatchNo = parseFloat(jsonobj[0].ReceiptSub_BatchSlNo || 0);
          if (BatchNo != 0) {
            this.saveTextAsFile(data);
          }

        }
      });
  }

  saveTextAsFile(jsonobj) {
    let arrayOfStuff = [];
    arrayOfStuff.push(jsonobj);
    const blob = new Blob(arrayOfStuff, { type: 'application/octet-stream' });
    // saveAs(blob, 'codeappsbarcode.txt');
  }

  async fnBarCodePrintAll() {
    let BillNo = this.txtCopyBillNo;
    let PurchaseId = this.ReceiptInfoMain.PurchaseId;

    let ServiceParams = {};
    ServiceParams['strProc'] = "PurchaseDetails_GetBarCodePrintAll";

    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "PurchaseId";
    ProcParams["strArgmt"] = PurchaseId.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "ReceiptMain_SlNo";
    ProcParams["strArgmt"] = BillNo.toString();
    oProcParams.push(ProcParams)


    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.branchId;
    oProcParams.push(ProcParams)
    ServiceParams['oProcParams'] = oProcParams;

    await this.appService.post('CommonQuery/fnGetDataReportNew', ServiceParams).toPromise()
      .then(data => {
        this.saveTextAsFile(data);
      }, err => console.error(err));
  }

  async fnCancel() {

    if (confirm("Are you sure you want to cancel  this purchase ")) {
      let dReceiptNo = this.txtCopyBillNo;
      let dPurchaseId = this.ReceiptInfoMain.PurchaseId;
      let BranchId = this.branchId;

      if (BranchId == 0) {
        alert("<b>Session Time Out Login Again<b>");
        window.location.href = "/Login/Index";
        return;
      }

      let ServiceParams = {};
      ServiceParams['strProc'] = "ReceiptCancelCheckItemIssue";
      ServiceParams['JsonFileName'] = "JsonArrayScriptThree";
      let oProcParams = [];
      let ProcParams = {};

      ProcParams["strKey"] = "@ParamsReceipt_SlNo";
      ProcParams["strArgmt"] = dReceiptNo.toString();
      oProcParams.push(ProcParams)

      ProcParams = {};
      ProcParams["strKey"] = "@ParamsPurchaseId";
      ProcParams["strArgmt"] = dPurchaseId.toString();
      oProcParams.push(ProcParams)

      ProcParams = {};
      ProcParams["strKey"] = "@ParamsBranchId";
      ProcParams["strArgmt"] = BranchId.toString();
      oProcParams.push(ProcParams)
      ServiceParams['oProcParams'] = oProcParams;

      var jsonBillIssued;


      await this.appService.post('CommonQuery/fnGetDataReportFromScriptJsonFile', ServiceParams)
        .toPromise().then(data => {
          jsonBillIssued = JSON.parse(data.JsonDetails[0]);
        });

      if (jsonBillIssued.length > 0) {
        alert("Some Item are " + jsonBillIssued[0].Flag + ' cannot be Cancelled...');
        return;
      }




      let AdjustedVoucherNos = '';
      let jsonobj: any;
      ServiceParams = {};
      ServiceParams['strProc'] = "CheckPurchaseBillAdustedForEditing";

      oProcParams = [];
      ProcParams = {};

      ProcParams["strKey"] = "Receipt_SlNo";
      ProcParams["strArgmt"] = dReceiptNo;
      oProcParams.push(ProcParams)

      ProcParams = {};
      ProcParams["strKey"] = "PurchaseId";
      ProcParams["strArgmt"] = dPurchaseId;
      oProcParams.push(ProcParams)

      ProcParams = {};
      ProcParams["strKey"] = "BranchId";
      ProcParams["strArgmt"] = BranchId;
      oProcParams.push(ProcParams)
      ServiceParams['oProcParams'] = oProcParams;

      await this.appService.post('/CommonQuery/fnGetDataReportBranchStaff', ServiceParams)
        .toPromise().then(data => {
          jsonobj = JSON.parse(data);

        }).finally(async () => {
          if (jsonobj.length == 0) {
            let ServiceParams = {};
            ServiceParams['strProc'] = "GetVoucherNoFor_AdjustedBillsPurchase";
            await this.appService.post('/CommonQuery/fnGetDataReportBranchStaff', ServiceParams)
              .toPromise().then(data => {
                jsonobj = JSON.parse(data);
                AdjustedVoucherNos = jsonobj[0].AdjustedVouchers;
              }).finally(() => {
                this.openSnackBar("Bill Payment Received ,Not Editing Possible ", AdjustedVoucherNos);
                return;
              })
          }

          let ServiceParams = {};
          ServiceParams['strProc'] = "Receipt_Cancel";

          oProcParams = [];
          ProcParams = {};
          ProcParams["strKey"] = "Receipt_SlNo";
          ProcParams["strArgmt"] = dReceiptNo.toString();
          oProcParams.push(ProcParams)

          ProcParams = {};
          ProcParams["strKey"] = "PurchaseId";
          ProcParams["strArgmt"] = dPurchaseId.toString();
          oProcParams.push(ProcParams)

          ProcParams = {};
          ProcParams["strKey"] = "BranchId";
          ProcParams["strArgmt"] = BranchId.toString();
          oProcParams.push(ProcParams)
          ServiceParams['oProcParams'] = oProcParams;

          await this.appService.post('CommonQuery/fnGetDataReportNew', ServiceParams).toPromise()
            .then(res => {
              let jsonobjs = JSON.parse(res);
              this.openSnackBar(jsonobj[0].Flag, '');
              this.fnclear();
            }, err => console.error(err));
        }).catch((reason) => console.error(reason));
    }
  }

  fnNewBill() {
    let dCopyBillNo = this.txtCopyBillNo;
    let dPurchaseId = this.ReceiptInfoMain.PurchaseId;
    let target = "#/PurchaseBillNew"

    let url = target + '?QueryPurchaseBillNo=' + dCopyBillNo + '&QueryPurchaseId=' + dPurchaseId;
    window.open(url, '_blank');
  }

  fnConvertSaleBill() {
    let dCopyBillNo = this.txtCopyBillNo;
    let dPurchaseId = this.ReceiptInfoMain.PurchaseId;
    let target = "#/salesbill"

    let url = target + '?QueryPurchaseBillNo=' + dCopyBillNo + '&QueryPurchaseId=' + dPurchaseId;
    window.open(url, '_blank');
  }
  // dialogue 

  async fnTaxChangeToAnother(index, event) {
    this.txtCurTaxRowId = index;
    this.popEscArray = null;
    let ProductId = this.dynamicArray[index].ProductId;
    if (event.keyCode == 27) {
      let strResultForHeader = ['FormulaApply', 'Formula', 'FormulaFrom', 'LandingCost', 'MRP']

      var varParams = {};
      varParams = { ControlType: 'Purchase', BranchId: this.branchId };

      var DictionaryObject = {};
      DictionaryObject["dictArgmts"] = varParams;
      DictionaryObject["ProcName"] = 'ControlOrder_GetOnType';

      await this.appService.post('/Purchase/fnGetControlOrder', DictionaryObject).toPromise()
        .then(data => {

          for (const col of data) {
            if (col.ControlName == "PSRate" && col.ControlOrder != 0) {
              strResultForHeader.push('R MRP');
            } else if (col.ControlName == "PWRate" && col.ControlOrder != 0) {
              strResultForHeader.push('W MRP');
            } else if (col.ControlName == "SPRateOne" && col.ControlOrder != 0) {
              strResultForHeader.push('SpRate1');
            } else if (col.ControlName == "SPRateTwo" && col.ControlOrder != 0) {
              strResultForHeader.push('SpRate2');
            } else if (col.ControlName == "SPRateThree" && col.ControlOrder != 0) {
              strResultForHeader.push('SpRate3');
            } else if (col.ControlName == "SPRateFour" && col.ControlOrder != 0) {
              strResultForHeader.push('SpRate4');
            } else if (col.ControlName == "SPRateFive" && col.ControlOrder != 0) {
              strResultForHeader.push('SpRate5');
            }
          }
          this.escHeader = strResultForHeader;

        }, err => console.error(err));

      let landingcost = this.dynamicArray[index].ReceiptSub_LandCost;
      let MRP = this.dynamicArray[index].ReceiptSub_MRP;


      this.popEscArray = {
        PurRateAdd: landingcost,
        MRPRateAdd: MRP,
        DiffPriceCalcId: index,
        RetailRateAdd: '',
        WholeRateAdd: '',
        SpRateOneForCalc: '',
        SpRateTwoForCalc: '',
        SpRateThreeForCalc: '',
        SpRateFourForCalc: '',
        SpRateFiveForCalc: '',
        ddlRateFormulaType: 'Pers',
        ddlFormulaFrom: 'LandingCost',
        RateChangeProductId: ProductId
      };

      this.dialogEsc = true;

      setTimeout(async () => {
        if (ProductId > 0) {
          let ServiceParams = {};
          ServiceParams['strProc'] = "ProductRateMaster_GetOnProductId";

          let oProcParams = [];

          let ProcParams = {};
          ProcParams["strKey"] = "ProductId";
          ProcParams["strArgmt"] = ProductId.toString();
          oProcParams.push(ProcParams)
          ServiceParams['oProcParams'] = oProcParams;
          await this.appService.post('CommonQuery/fnGetDataReportNew', ServiceParams).toPromise()
            .then(data => {
              let jsonobj = JSON.parse(data);
              if (jsonobj.length > 0) {
                this.popEscArray = {
                  PurRateAdd: landingcost,
                  MRPRateAdd: MRP,
                  DiffPriceCalcId: index,
                  RetailRateAdd: parseFloat(jsonobj[0].RetailPriceAdd || 0).toFixed(2),
                  WholeRateAdd: parseFloat(jsonobj[0].WholePriceAdd || 0).toFixed(2),
                  SpRateOneForCalc: parseFloat(jsonobj[0].SpRate1PriceAdd || 0).toFixed(2),
                  SpRateTwoForCalc: parseFloat(jsonobj[0].SpRate2PriceAdd || 0).toFixed(2),
                  SpRateThreeForCalc: parseFloat(jsonobj[0].SpRate3PriceAdd || 0).toFixed(2),
                  SpRateFourForCalc: parseFloat(jsonobj[0].SpRate4PriceAdd || 0).toFixed(2),
                  SpRateFiveForCalc: parseFloat(jsonobj[0].SpRate5PriceAdd || 0).toFixed(2),
                  ddlRateFormulaType: jsonobj[0].FormulaType,
                  ddlFormulaFrom: jsonobj[0].FormulaFrom,
                  RateChangeProductId: ProductId
                };
                this.fnDiffPriceCalculation();
              }
            }, err => console.error(err));
        }
      });
      return;
    }

    if (event.keyCode == 120) {
      if (ProductId == 0)
        return;

      let ServiceParams = {};
      ServiceParams['strProc'] = "TaxGroup_GetOnTaxId";
      let oProcParams = [];
      let ProcParams = {};
      ProcParams["strKey"] = "TaxId";
      ProcParams["strArgmt"] = this.dynamicArray[index].TaxId;
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams["strKey"] = "TaxGroupName";
      ProcParams["strArgmt"] = this.dynamicArray[index].ReceiptSub_TaxName.toString();
      oProcParams.push(ProcParams);
      ServiceParams['oProcParams'] = oProcParams;
      await this.appService.post('CommonQuery/fnGetDataReportNew', ServiceParams).toPromise()
        .then(data => {
          let jsonData = JSON.parse(data);
          this.dialogueTax = true
          this.bShodowPage = true;
          this.ddlTaxGroupTaxChange = parseFloat(jsonData[0].TaxGroupId || 0);
        })
    }

  }

  async fnEscSave() {
    var ProductId = this.popEscArray.RateChangeProductId;
    if (ProductId > 0) {
      var ServiceParams = {};
      ServiceParams['strProc'] = "ProductRateMaster_Insert";

      let oProcParams = [];

      let ProcParams = {};
      ProcParams["strKey"] = "ProductId";
      ProcParams["strArgmt"] = ProductId;
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams["strKey"] = "RetailPriceAdd";
      ProcParams["strArgmt"] = this.popEscArray.RetailRateAdd;
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams["strKey"] = "WholePriceAdd";
      ProcParams["strArgmt"] = this.popEscArray.WholeRateAdd;
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams["strKey"] = "SpRate1PriceAdd";
      ProcParams["strArgmt"] = this.popEscArray.SpRateOneForCalc;
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams["strKey"] = "SpRate2PriceAdd";
      ProcParams["strArgmt"] = this.popEscArray.SpRateTwoForCalc;
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams["strKey"] = "SpRate3PriceAdd";
      ProcParams["strArgmt"] = this.popEscArray.SpRateThreeForCalc;
      oProcParams.push(ProcParams);


      ProcParams = {};
      ProcParams["strKey"] = "SpRate4PriceAdd";
      ProcParams["strArgmt"] = this.popEscArray.SpRateFourForCalc;
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams["strKey"] = "SpRate5PriceAdd";
      ProcParams["strArgmt"] = this.popEscArray.SpRateFiveForCalc;
      oProcParams.push(ProcParams);


      ProcParams = {};
      ProcParams["strKey"] = "FormulaType";
      ProcParams["strArgmt"] = this.popEscArray.ddlRateFormulaType.toString();
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams["strKey"] = "FormulaFrom";
      ProcParams["strArgmt"] = this.popEscArray.ddlFormulaFrom.toString();
      oProcParams.push(ProcParams);
      ServiceParams['oProcParams'] = oProcParams;

      await this.appService.post('CommonQuery/fnGetDataReportNew', ServiceParams).toPromise()
        .then(data => {
          this.dialogEsc = false;
        })
    }
  }

  fnDiffPriceCalculation() {
    let UniqueId = this.popEscArray.DiffPriceCalcId;
    let strRateFormulaApply = this.ddlRateFormulaApply;

    for (let index = 0; index < this.dynamicArray.length; index++) {

      if (strRateFormulaApply != "CurrentRow") {
        UniqueId = index;
      }

      let PurRate = parseFloat(this.dynamicArray[UniqueId].ReceiptSub_ReceiptRate || 0);
      let MRP = parseFloat(this.dynamicArray[UniqueId].ReceiptSub_MRP || 0);
      let FormulaFrom = this.popEscArray.ddlFormulaFrom;
      let RateFormulaType = this.popEscArray.ddlRateFormulaType;
      let RetailRate = parseFloat(<any>this.popEscArray.RetailRateAdd || 0);
      let WholeRate = parseFloat(<any>this.popEscArray.WholeRateAdd || 0);
      let SpRateOne = parseFloat(<any>this.popEscArray.SpRateOneForCalc || 0);
      let SpRateTwo = parseFloat(<any>this.popEscArray.SpRateTwoForCalc || 0);
      let SpRateThree = parseFloat(<any>this.popEscArray.SpRateThreeForCalc || 0);
      let SpRateFour = parseFloat(<any>this.popEscArray.SpRateFourForCalc || 0);
      let SpRateFive = parseFloat(<any>this.popEscArray.SpRateFiveForCalc || 0);
      let LandingCost = parseFloat(this.dynamicArray[UniqueId].ReceiptSub_LandCost || 0);
      if (FormulaFrom == "PurRate") {
        if (RateFormulaType == "Pers") {
          RetailRate = ((PurRate * RetailRate) / 100) + PurRate
          WholeRate = ((PurRate * WholeRate) / 100) + PurRate
          SpRateOne = ((PurRate * SpRateOne) / 100) + PurRate
          SpRateTwo = ((PurRate * SpRateTwo) / 100) + PurRate
          SpRateThree = ((PurRate * SpRateThree) / 100) + PurRate
          SpRateFour = ((PurRate * SpRateFour) / 100) + PurRate
          SpRateFive = ((PurRate * SpRateFive) / 100) + PurRate
        } else {
          RetailRate = PurRate + RetailRate
          WholeRate = PurRate + WholeRate
          SpRateOne = PurRate + SpRateOne
          SpRateTwo = PurRate + SpRateTwo
          SpRateThree = PurRate + SpRateThree
          SpRateFour = PurRate + SpRateFour
          SpRateFive = PurRate + SpRateFive
        }
      } else if (FormulaFrom == "LandingCost") {
        if (RateFormulaType == "Pers") {
          RetailRate = ((LandingCost * RetailRate) / 100) + LandingCost
          WholeRate = ((LandingCost * WholeRate) / 100) + LandingCost
          SpRateOne = ((LandingCost * SpRateOne) / 100) + LandingCost
          SpRateTwo = ((LandingCost * SpRateTwo) / 100) + LandingCost
          SpRateThree = ((LandingCost * SpRateThree) / 100) + LandingCost
          SpRateFour = ((LandingCost * SpRateFour) / 100) + LandingCost
          SpRateFive = ((LandingCost * SpRateFive) / 100) + LandingCost
        } else {
          RetailRate = LandingCost + RetailRate
          WholeRate = LandingCost + WholeRate
          SpRateOne = LandingCost + SpRateOne
          SpRateTwo = LandingCost + SpRateTwo
          SpRateThree = LandingCost + SpRateThree
          SpRateFour = LandingCost + SpRateFour
          SpRateFive = LandingCost + SpRateFive
        }
      } else {

        if (RateFormulaType == "Pers") {
          RetailRate = MRP - ((MRP * RetailRate) / 100)
          WholeRate = MRP - ((MRP * WholeRate) / 100)
          SpRateOne = MRP - ((MRP * SpRateOne) / 100)
          SpRateTwo = MRP - ((MRP * SpRateTwo) / 100)
          SpRateThree = MRP - ((MRP * SpRateThree) / 100)
          SpRateFour = MRP - ((MRP * SpRateFour) / 100)
          SpRateFive = MRP - ((MRP * SpRateFive) / 100)
        } else {
          RetailRate = MRP - RetailRate
          WholeRate = MRP - WholeRate
          SpRateOne = MRP - SpRateOne
          SpRateTwo = MRP - SpRateTwo
          SpRateThree = MRP - SpRateThree
          SpRateFour = MRP - SpRateFour
          SpRateFive = MRP - SpRateFive
        }

      }
      var DecimalPlace = parseFloat(this.txtRateDecimalPlace || 0);

      this.dynamicArray[UniqueId].ReceiptSub_SellRate = RetailRate.toFixed(DecimalPlace);
      this.dynamicArray[UniqueId].ReceiptSub_WholeSaleRate = WholeRate.toFixed(DecimalPlace);
      this.dynamicArray[UniqueId].ReceiptSub_SpRate1 = SpRateOne.toFixed(DecimalPlace);
      this.dynamicArray[UniqueId].ReceiptSub_SpRate2 = SpRateTwo.toFixed(DecimalPlace);
      this.dynamicArray[UniqueId].ReceiptSub_SpRate3 = SpRateThree.toFixed(DecimalPlace);
      this.dynamicArray[UniqueId].ReceiptSub_SpRate4 = SpRateFour.toFixed(DecimalPlace);
      this.dynamicArray[UniqueId].ReceiptSub_SpRate5 = SpRateFive.toFixed(DecimalPlace);

      if (strRateFormulaApply == "CurrentRow")
        return;
    }

  }

  async fnTaxApply() {
    let TaxRowId = this.txtCurTaxRowId;
    let TaxGroupId = this.ddlTaxGroupTaxChange;
    let TaxPerValue = parseFloat(this.dynamicArray[TaxRowId].ReceiptSub_TaxPercentage || 0);

    let ServiceParams = {};
    ServiceParams['strProc'] = "TaxDetails_FromTaxGroupId";

    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "TaxGroupId";
    ProcParams["strArgmt"] = TaxGroupId.toString();
    oProcParams.push(ProcParams);
    ServiceParams['oProcParams'] = oProcParams;

    await this.appService.post('CommonQuery/fnGetDataReportNew', ServiceParams).toPromise()
      .then(data => {
        let jsonData = JSON.parse(data);
        this.dynamicArray[TaxRowId].ReceiptSub_TaxPercentage = parseFloat(jsonData[0].TaxPercent || 0);
        this.dynamicArray[TaxRowId].ReceiptSub_ActualTaxPers = parseFloat(jsonData[0].TaxPercent || 0)
        this.dynamicArray[TaxRowId].ReceiptSub_TaxName = jsonData[0].TaxName;
        this.dynamicArray[TaxRowId].ReceiptSub_TaxOn = jsonData[0].TaxOn;
        this.dynamicArray[TaxRowId].ReceiptSub_TaxOnFree = jsonData[0].TaxOnFree;
        this.dynamicArray[TaxRowId].TaxId = parseFloat(jsonData[0].TaxId || 0);
        this.dynamicArray[TaxRowId].ReceiptSub_SGSTTaxPers = parseFloat(jsonData[0].SGSTTaxPers || 0);
        this.dynamicArray[TaxRowId].ReceiptSub_CGSTTaxPers = parseFloat(jsonData[0].CGSTTaxPers || 0);
        this.dynamicArray[TaxRowId].ReceiptSub_IGSTTaxPers = parseFloat(jsonData[0].IGSTTaxPers || 0);
        this.dynamicArray[TaxRowId].ReceiptSub_CessPers = parseFloat(jsonData[0].CessPers || 0);
        this.fnGetTotal(TaxRowId);
      }, err => console.error(err));
    this.dialogueTax = false;
    this.bShodowPage = false;
  }

  // serialNoSet Popup

  async productSearchSerial(eve, val) {

    const keyword = eve.target.value;
    if (keyword == '') {

      if (val == 'size') {
        this.showSizeProd = false;
      } else {
        this.showSerialNoProd = false;
      }
      return;
    }

    let varArguements = { dictArgmts: keyword, BranchId: this.branchId };
    let DictionaryObject = {};
    DictionaryObject["dictArgmts"] = varArguements;
    DictionaryObject["ProcName"] = 'Product_SearchPurchase';

    await this.appService.post('/Purchase/Product_SearchPurchase', DictionaryObject).toPromise()
      .then(data => {
        this.fillterProduct = data;

        if (this.fillterProduct.length > 0) {
          if (val == 'size') {
            this.showSizeProd = true;
          } else {
            this.showSerialNoProd = true;
          }
        } else {
          if (val == 'size') {
            this.showSizeProd = false;
          } else {
            this.showSerialNoProd = false;
          }
        }

      })
  }

  ProductserialNoGet(eve) {
    if (this.showSizeProd) {
      this.fnGetCategorysHeadSize(eve.ProductId);
    }
    this.showSerialNoProd = false;
    this.showSizeProd = false;
    this.SerialProdName = eve.ItemDesc;
    this.PhoneSerialNoProductId = eve.ProductId;

  }

  async fnSerialNoSubmit(Qty) {

    let ProductId = this.PhoneSerialNoProductId;
    let dQty = parseFloat(Qty || 0);


    if (ProductId == undefined) {
      this.openSnackBar('Enter Product Name', 'error');
      return;
    }
    if (dQty == 0) {
      this.openSnackBar('Enter Qty', 'error');
      return;
    }

    let ServiceParams = {};
    ServiceParams['strProc'] = "Product_SearchForSize";

    let oProcParams = [];
    let ProcParams = {};
    ProcParams["strKey"] = "ProductId";
    ProcParams["strArgmt"] = ProductId;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.branchId;
    oProcParams.push(ProcParams)
    ServiceParams['oProcParams'] = oProcParams;

    await this.appService.post('/CommonQuery/fnGetData', ServiceParams).toPromise()
      .then(data => {
        this.dynamicArray = [];
        let jsonRowData = JSON.parse(data);

        for (var index = 0; index < dQty; index++) {
          this.fnAddRow();
          this.dynamicArray[index].ReceiptSub_Id = index;
          this.dynamicArray[index].ReceiptSub_Batch = '';
          this.dynamicArray[index].ItemName = jsonRowData[0].ItemDesc;
          this.dynamicArray[index].ProductId = parseFloat(jsonRowData[0].ProductId || 0);
          this.dynamicArray[index].ReceiptSub_TaxPercentage = parseFloat(jsonRowData[0].TaxPercent || 0);
          this.dynamicArray[index].ReceiptSub_TaxOn = jsonRowData[0].TaxOn;
          this.dynamicArray[index].ReceiptSub_TaxOnFree = jsonRowData[0].TaxOnFree;
          this.dynamicArray[index].ReceiptSub_TaxName = jsonRowData[0].TaxName;
          this.dynamicArray[index].TaxId = parseFloat(jsonRowData[0].TaxID || 0);
          this.dynamicArray[index].ReceiptSub_Pack = parseFloat(jsonRowData[0].PackQty || 0);
          this.dynamicArray[index].ReceiptSub_ActualTaxPers = parseFloat(jsonRowData[0].TaxPercent || 0);
          this.dynamicArray[index].ReceiptSub_ReceiptRate = parseFloat(jsonRowData[0].PurRate || 0);
          this.dynamicArray[index].ReceiptSub_SellRate = parseFloat(jsonRowData[0].SelRate || 0);
          this.dynamicArray[index].ReceiptSub_MRP = parseFloat(jsonRowData[0].MRP || 0);
          this.dynamicArray[index].ReceiptSub_WholeSaleRate = parseFloat(jsonRowData[0].WholeSaleRate || 0);
          this.dynamicArray[index].ReceiptSub_Freight = parseFloat(jsonRowData[0].Freight || 0);
          this.dynamicArray[index].ReceiptSub_ReceiptQty = 1;
          this.dynamicArray[index].ReceiptSub_SGSTTaxPers = parseFloat(jsonRowData[0].SGSTTaxPers || 0);
          this.dynamicArray[index].ReceiptSub_CGSTTaxPers = parseFloat(jsonRowData[0].CGSTTaxPers || 0);
          this.dynamicArray[index].ReceiptSub_IGSTTaxPers = parseFloat(jsonRowData[0].IGSTTaxPers || 0);
          this.dynamicArray[index].ReceiptSub_CessPers = parseFloat(jsonRowData[0].CessPers || 0);
          this.dynamicArray[index].ReceiptSub_ExtraCessPers = parseFloat(jsonRowData[0].AdditionalCess || 0);

          this.dynamicArray[index].ReceiptSub_BatchSlNo = 0;
          this.dynamicArray[index].ReceiptSub_PerRate = 0;
          this.dynamicArray[index].ReceiptSub_PerLandCost = 0;
          this.dynamicArray[index].ReceiptSub_ReceiptFree = 0;
          this.dynamicArray[index].ReceiptSub_NetAmtPerProd = 0;
          this.dynamicArray[index].ReceiptSub_Amount = 0;
          this.dynamicArray[index].ReceiptSub_BarCode = 0;
          this.dynamicArray[index].ReceiptSub_TaxAmt = 0;
          this.dynamicArray[index].ReceiptSub_ProdDiscount = 0;
          this.dynamicArray[index].ReceiptSub_WholSalMag = 0;
          this.dynamicArray[index].ReceiptSub_RetlMargin = 0;
          this.dynamicArray[index].ReceiptSub_Period = null;
          this.dynamicArray[index].ReceiptSub_LandCost = 0;
          this.dynamicArray[index].ReceiptSub_ProdDisAmt = 0;
          this.dynamicArray[index].ReceiptSub_SchemePers = 0;
          this.dynamicArray[index].ReceiptSub_SchemeAmt = 0;
          this.dynamicArray[index].ReceiptSub_Frgt = 0;
          this.dynamicArray[index].ReceiptSub_SpRate1 = 0;
          this.dynamicArray[index].ReceiptSub_SpRate2 = 0;
          this.dynamicArray[index].ReceiptSub_SpRate3 = 0;
          this.dynamicArray[index].ReceiptSub_SpRate4 = 0;
          this.dynamicArray[index].ReceiptSub_SpRate5 = 0;
          this.dynamicArray[index].ReceiptSub_AmtBeforeTax = 0;
          this.dynamicArray[index].ReceiptSub_SGSTTaxAmount = 0;
          this.dynamicArray[index].ReceiptSub_CGSTTaxAmount = 0;
          this.dynamicArray[index].ReceiptSub_CGSTAmount = 0;
          this.dynamicArray[index].ReceiptSub_LooseQty = 0;
        }
        this.fnGetTotal(0);
        this.SerialProdName = '';
        this.PopupPhoneSerialNoSet = false;
      })
  }

  async fnGetCategorysHeadSize(ProductId) {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'Product_Get';

    let oProcParams = [];

    var ProcParams = {};
    ProcParams['strKey'] = 'ProductId';
    ProcParams['strArgmt'] = ProductId.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    await this.appService.post('CommonQuery/fnGetDataReportNew', ServiceParams).toPromise()
      .then(async x => {
        let data = JSON.parse(x);
        var ServiceParams = {};
        ServiceParams['strProc'] = "CategoryHead_Get";

        var oProcParams = [];

        var ProcParams = {};
        ProcParams["strKey"] = "CategoryID";
        ProcParams["strArgmt"] = parseFloat(data[0].SecDiscount || 0);
        oProcParams.push(ProcParams);

        ServiceParams['oProcParams'] = oProcParams;

        await this.appService.post('/fnGetDataReportNew', ServiceParams).toPromise()
          .then(data => {
            this.jsonCategorySize = data;
            this.ddlCategorySize = this.jsonCategorySize[0].CategoryHead_Id;
          });
      })
  }

  async fnSizeSubmit() {
    let ProductId = this.PhoneSerialNoProductId;
    let CategoryHeadId = this.ddlCategorySize;
    if (ProductId == undefined) {
      this.openSnackBar('Enter Product Name', 'error');
      return;
    }
    if (CategoryHeadId == undefined) {
      this.openSnackBar('Select Size', 'error');
      return;
    }
    var ServiceParams = {};
    ServiceParams['strProc'] = "Category_GetsOnHeadId";

    let oProcParams = [];
    let ProcParams = {};
    ProcParams["strKey"] = "CategoryHead_Id";
    ProcParams["strArgmt"] = CategoryHeadId;
    oProcParams.push(ProcParams);
    ServiceParams['oProcParams'] = oProcParams;
    let CategoryJsonObj: any;
    await this.appService.post('/CommonQuery/fnGetData', ServiceParams).toPromise()
      .then(data => {
        CategoryJsonObj = JSON.parse(data);
      }).finally(async () => {
        var ServiceParams = {};
        ServiceParams['strProc'] = "Product_SearchForSize";

        oProcParams = [];
        ProcParams = {};
        ProcParams["strKey"] = "ProductId";
        ProcParams["strArgmt"] = ProductId;
        oProcParams.push(ProcParams)

        ProcParams = {};
        ProcParams["strKey"] = "BranchId";
        ProcParams["strArgmt"] = this.branchId;
        oProcParams.push(ProcParams)
        ServiceParams['oProcParams'] = oProcParams;

        await this.appService.post('/CommonQuery/fnGetData', ServiceParams).toPromise()
          .then(data => {
            let jsonRowData = JSON.parse(data);
            this.dynamicArray = [];
            for (let index = 0; index < CategoryJsonObj.length; index++) {
              this.fnAddRow();
              this.dynamicArray[index].ReceiptSub_Batch = CategoryJsonObj[index].CategoryDesc;
              this.dynamicArray[index].ReceiptSub_Id = index;
              this.dynamicArray[index].ItemName = jsonRowData[0].ItemDesc;
              this.dynamicArray[index].ProductId = parseFloat(jsonRowData[0].ProductId || 0);
              this.dynamicArray[index].ReceiptSub_TaxPercentage = parseFloat(jsonRowData[0].TaxPercent || 0);
              this.dynamicArray[index].ReceiptSub_TaxOn = jsonRowData[0].TaxOn;
              this.dynamicArray[index].ReceiptSub_TaxOnFree = jsonRowData[0].TaxOnFree;
              this.dynamicArray[index].ReceiptSub_TaxName = jsonRowData[0].TaxName;
              this.dynamicArray[index].TaxId = parseFloat(jsonRowData[0].TaxID || 0);
              this.dynamicArray[index].ReceiptSub_Pack = parseFloat(jsonRowData[0].PackQty || 0);
              this.dynamicArray[index].ReceiptSub_ActualTaxPers = parseFloat(jsonRowData[0].TaxPercent || 0);
              this.dynamicArray[index].ReceiptSub_ReceiptRate = parseFloat(jsonRowData[0].PurRate || 0);
              this.dynamicArray[index].ReceiptSub_SellRate = 0;
              this.dynamicArray[index].ReceiptSub_MRP = parseFloat(jsonRowData[0].MRP || 0);
              this.dynamicArray[index].ReceiptSub_WholeSaleRate = parseFloat(jsonRowData[0].WholeSaleRate || 0);
              this.dynamicArray[index].ReceiptSub_Freight = parseFloat(jsonRowData[0].Freight || 0);
              this.dynamicArray[index].ReceiptSub_ReceiptQty = 0;
              this.dynamicArray[index].ReceiptSub_SGSTTaxPers = parseFloat(jsonRowData[0].SGSTTaxPers || 0);
              this.dynamicArray[index].ReceiptSub_CGSTTaxPers = parseFloat(jsonRowData[0].CGSTTaxPers || 0);
              this.dynamicArray[index].ReceiptSub_IGSTTaxPers = parseFloat(jsonRowData[0].IGSTTaxPers || 0);
              this.dynamicArray[index].ReceiptSub_CessPers = parseFloat(jsonRowData[0].CessPers || 0);
              this.dynamicArray[index].ReceiptSub_ExtraCessPers = parseFloat(jsonRowData[0].AdditionalCess || 0);
              this.dynamicArray[index].ReceiptSub_BatchSlNo = 0;
              this.dynamicArray[index].ReceiptSub_PerRate = 0;
              this.dynamicArray[index].ReceiptSub_PerLandCost = 0;
              this.dynamicArray[index].ReceiptSub_ReceiptFree = 0;
              this.dynamicArray[index].ReceiptSub_NetAmtPerProd = 0;
              this.dynamicArray[index].ReceiptSub_Amount = 0;
              this.dynamicArray[index].ReceiptSub_BarCode = 0;
              this.dynamicArray[index].ReceiptSub_TaxAmt = 0;
              this.dynamicArray[index].ReceiptSub_ProdDiscount = 0;
              this.dynamicArray[index].ReceiptSub_WholSalMag = 0;
              this.dynamicArray[index].ReceiptSub_RetlMargin = 0;
              this.dynamicArray[index].ReceiptSub_Period = null;
              this.dynamicArray[index].ReceiptSub_LandCost = 0;
              this.dynamicArray[index].ReceiptSub_ProdDisAmt = 0;
              this.dynamicArray[index].ReceiptSub_SchemePers = 0;
              this.dynamicArray[index].ReceiptSub_SchemeAmt = 0;
              this.dynamicArray[index].ReceiptSub_Frgt = 0;
              this.dynamicArray[index].ReceiptSub_SpRate1 = 0;
              this.dynamicArray[index].ReceiptSub_SpRate2 = 0;
              this.dynamicArray[index].ReceiptSub_SpRate3 = 0;
              this.dynamicArray[index].ReceiptSub_SpRate4 = 0;
              this.dynamicArray[index].ReceiptSub_SpRate5 = 0;
              this.dynamicArray[index].ReceiptSub_AmtBeforeTax = 0;
              this.dynamicArray[index].ReceiptSub_SGSTTaxAmount = 0;
              this.dynamicArray[index].ReceiptSub_CGSTTaxAmount = 0;
              this.dynamicArray[index].ReceiptSub_CGSTAmount = 0;
              this.dynamicArray[index].ReceiptSub_LooseQty = 0;

            }

          });
        this.popupSize = false;
      });
  }

  fnPreview() {
    let PrintFileName = this.txtPrintFileName;
    let PurSlNo: any = this.txtCopyBillNo;
    let PurchaseId: any = this.ReceiptInfoMain.PurchaseId;
    localStorage.setItem("SessionPurSlNo", PurSlNo);
    localStorage.setItem("SessionPurchaseId", PurchaseId);
    if (PrintFileName == "PurchasePrintKmsMobile") {
      this.popupPrintPrice = true;
      return;
    } else {
      window.open("#/" + PrintFileName, "_blank");
    }
  }

  fnPreviewPrint() {
    let PrintFileName = this.txtPrintFileName;
    let PurSlNo: any = this.txtCopyBillNo;
    let PurchaseId: any = this.ReceiptInfoMain.PurchaseId;

    let selected: any = this.prices._value;
    let chkRetailRate: any;
    let chkWholeSaleRate: any;
    let chkSpecialRate: any;
    let chkDealerPrice: any;

    if (selected == undefined || selected.legth == 0) {
      chkRetailRate = false;
      chkWholeSaleRate = false;
      chkSpecialRate = false;
      chkDealerPrice = false;
    } else {
      chkRetailRate = selected.includes('RetailRate');
      chkWholeSaleRate = selected.includes('WholeSaleRate');
      chkSpecialRate = selected.includes('SpecialRate');
      chkDealerPrice = selected.includes('DealerPrice');
    }
    localStorage.setItem("SessionPurSlNo", PurSlNo);
    localStorage.setItem("SessionPurchaseId", PurchaseId);
    localStorage.setItem("chkRetailRate", chkRetailRate);
    localStorage.setItem("chkWholeSaleRate", chkWholeSaleRate);
    localStorage.setItem("chkSpecialRate", chkSpecialRate);
    localStorage.setItem("chkDealerPrice", chkDealerPrice);
    this.popupPrintPrice = false;
    window.open("#/" + PrintFileName, "_blank");
  }

  fngetTotQty() {

    if (this.dynamicArray.length == 0 || this.dynamicArray[0].ReceiptSub_ReceiptQty == undefined) {
      return 0
    } else {
      let Qty = this.dynamicArray.map(data => parseFloat(data.ReceiptSub_ReceiptQty || 0)).reduce((val, cur) => val + cur);
      let FQty = this.dynamicArray.map(data => parseFloat(data.ReceiptSub_ReceiptFree || 0)).reduce((val, cur) => val + cur);

      return Qty + FQty;
    }

  }


  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (event.which == 8 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46)
      return true;
    else if ((event.which != 46 || event.val().indexOf('.') != -1) && (event.which < 48 || event.which > 57))
      event.preventDefault();

  }

  pressed = false;
  currentResizeIndex: number;
  startX: number;
  startWidth: number;
  isResizingRight: boolean;
  resizableMousemove: () => void;
  resizableMouseup: () => void;

  onResizeColumn(event: any, index: number) {
    // this.checkResizing(event, index);
    this.currentResizeIndex = index;
    this.pressed = true;
    this.startX = event.pageX;
    this.startWidth = event.target.clientWidth;
    this.isResizingRight = true;
    event.preventDefault();
    this.mouseMove(index);

  }

  mouseMove(index: number) {

    let tblcolelement: any;

    this.resizableMousemove = this.renderer.listen('document', 'mousemove', (event) => {
      if (this.pressed && event.buttons) {
        const dx = (this.isResizingRight) ? (event.pageX - this.startX) : (-event.pageX + this.startX);
        const width = this.startWidth + dx;
        if (this.currentResizeIndex === index && width > 50) {

          let s = event.path[3].rows;
          let c = event.target.cellIndex;
          for (let index = 1; index < s.length; index++) {
            let td = s[index].cells[c];
            td.width = `${width}px`;
            td.style.minWidth = `${width}px`;
          }
          event.target.width = `${width}px`;
          event.target.style.minWidth = `${width}px`;
          event.target.style.maxWidth = `${width}px`;
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

  @HostListener('window:keydown.arrowup', ['$event'])
  @HostListener('window:keydown.arrowdown', ['$event'])
  onkeyEvent(event: KeyboardEvent) {

    let row = event.target['offsetParent'];

    if (this.productCodeShow || this.productShow) {
      return
    }
    if (row == null || row.localName != 'td') {
      return
    }
    let indexTd = row.cellIndex;
    let rowId = this.scroll.viewPortInfo.endIndex;


    if (event.which == 40) {
      let rowIndex = this.rowactiveIndex + 1;
      let nextElement = row.parentElement.nextElementSibling;
      if (nextElement != null) {
        row.parentElement.nextElementSibling.children[indexTd].children[0].focus();
        row.parentElement.nextElementSibling.children[indexTd].children[0].select();
        this.setClickedRow(rowIndex);
      } else {
        if (this.dynamicArray.length != rowId) {
          this.scroll.scrollToIndex(rowId - 3);
        }
      }

    }

    if (event.which == 38) {
      let rowIndex = this.rowactiveIndex - 1;
      let rowId = this.scroll.viewPortInfo.startIndex;
      let previousElement = row.parentElement.previousElementSibling;
      if (previousElement != null) {
        row.parentElement.previousElementSibling.children[indexTd].children[0].focus();
        row.parentElement.previousElementSibling.children[indexTd].children[0].select();
        this.setClickedRow(rowIndex);
      } else {
        if (this.dynamicArray.length != rowId) {
          this.scroll.scrollToIndex(rowId - 3);
        }
      }

    }
  }


  setClickedRow(index) {
    this.rowactiveIndex = index;
    this.selectedRow = index;
  }

}
