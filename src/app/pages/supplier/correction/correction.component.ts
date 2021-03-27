import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Title } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-correction',
  templateUrl: './correction.component.html',
  styleUrls: ['./correction.component.scss']
})
export class CorrectionComponent implements OnInit {

  @ViewChild('txtProduct', { read: '', static: false }) txtProduct: ElementRef;

  @ViewChild('scroll', { read: '', static: false }) public scroll;
  branchId = <any>localStorage.getItem('SessionBranchId');
  staffId = parseFloat(localStorage.getItem('SessionStaffId'));
  productName = '';
  selectcomplete: boolean;
  public fillterItems: any[] = [];
  GodownList: any[] = [];
  explength: number;
  ddlPriceMenu = 0;
  ddlCorrectionType = 'Product';
  ddlReason = 0;
  cbSalesMan = 0;
  tableBuffer: boolean;
  dynamicArray: Array<any> = [];
  dynamicColumn = []
  selection = new SelectionModel<any>(true, []);
  public colHeaders = [
    { col: 'ItemCode', width: '100px' },
    { col: 'ItemDesc', width: '300px' },
    { col: 'StockQty', width: '80px' },
    { col: 'MRP', width: '80px' },
    { col: 'ManufactureName', width: '150px' }
  ];
  public HeaderColumn = ['Code', 'ProductName', 'StockQty', 'MRP', 'Manufacture'];
  categories: any;
  reaonJson: any;
  priceMenu: any;
  txtWMRP: boolean;
  lblSpRate1: any;
  lblSpRateOneCalc: any;
  txtSPRATE1: boolean;
  lblSpRate2: any;
  lblSpRateTwoCalc: any;
  txtSPRATE2: boolean;
  lblSpRate3: any;
  lblSpRateThreeCalc: any;
  txtSPRATE3: boolean;
  lblSpRate4: any;
  lblSpRateFourCalc: any;
  txtSPRATE4: boolean;
  lblSpRate5: any;
  lblSpRateFiveCalc: any;
  txtSPRATE5: boolean;
  lblRetailRateCalc: any;
  lblRetailRateHead: any;
  lblMRPHead: any;
  lblWhRate: any;
  lblWholeRateCalc: any;
  txtSoftwareName: any;
  txtRateDecimalPlace: any;
  DeceimalPlace: number;
  dRateDecimalPlace: any;
  ItemCodeWidth: number;
  bSalesBatchVisible: boolean;
  bSalesExpiryVisible: boolean;
  bMrpInclusiveSales: boolean;
  bCorRateEditPermissionAllUser: boolean;
  bCorAddQtyPermissionAllUser: boolean;
  bCorMinusQtyPermissionAllUser: boolean;
  bSchemeInCorrection: boolean;
  bWgtMechineCodeInProduct: boolean;
  strBatchDisplayName: string;
  bExpMonthYearFormat = true;
  jsonData: any;
  bAllPermission = false;
  bPermissionPopupShow: boolean;
  noOfPrint: any;
  barCodeNo: any;
  dBarCodeProductId: number;
  printPopup: boolean;
  bQtyEditing = true;
  dTempGodownId = 0;
  categoryId: number;
  observableObj$: Observable<any>;
  subject = new Subject();
  constructor(public appService: AppService, private _snackBar: MatSnackBar, private titleService: Title) {
    this.titleService.setTitle('Purchase Correction');
  }

  ngOnInit() {
    this.observableObj$ = this.subject.pipe(
      debounceTime(100),
      switchMap((search) => {
        return this.appService.post('CommonQuery/fnGetDataReportNew', search);
      }),
    )

    this.observableObj$.subscribe(data => {
      this.fillterItems = JSON.parse(data);
     
      if (this.fillterItems.length > 0) {
        this.selectcomplete = true;
      } else {
        this.selectcomplete = false;
      }
    });
  }


  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (event.which == 8 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 46)
      return true;
    else if ((event.which != 46 || event.val().indexOf('.') != -1) && (event.which < 48 || event.which > 57))
      event.preventDefault();
  }

  fnArrowKeyevent(event, index) {

    switch (event.keyCode) {
      case 40:
        if (event.path[2].nextElementSibling == null) {
          return
        }
        let nextElement = event.path[2].nextElementSibling.children[index];
        if (nextElement != null) {
          nextElement.children[0].focus();
          nextElement.children[0].select();
        }
        if (nextElement == undefined) {
          let nextOtherElement = event.path[2].nextElementSibling.nextElementSibling;
          if (nextOtherElement != null) {
            nextOtherElement.children[index].children[0].focus();
            nextOtherElement.children[index].children[0].select();
          }
        }
        event.preventDefault();
        break;

      case 38:
        let previousElement = event.path[2].previousElementSibling.children[index];
        if (previousElement != null) {
          previousElement.children[0].focus();
          previousElement.children[0].select()
        }
        if (previousElement == undefined) {
          let previousOtherElement = event.path[2].previousElementSibling.previousElementSibling;
          if (previousOtherElement != null) {
            previousOtherElement.children[index].children[0].focus();
            previousOtherElement.children[index].children[0].select();
          }
        }
        event.preventDefault();
        break

      // this.scroll.scrollToIndex(scrollPosition);
      // this.scroll.scrollToIndex(totlength);
    }


    if (event.keyCode == 38) {
      let nextRow = event.path[2].previousElementSibling.children[index];
      if (nextRow != null) {
        nextRow.children[0].focus();
        nextRow.children[0].select();
      }
      event.preventDefault();
    }

  }
  // @HostListener('document:keydown', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) {
  // }
  
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  ngAfterViewInit(): void {
    this.fnSettings()
    // this.txtProduct.nativeElement.focus();
  }

  fnSettings() {
    var dictArgmts = { ProcName: 'Settings_GetValues' };
    this.appService.post('CommonQuery/fnSettings', dictArgmts)
      .toPromise().then(data => {

        for (let i = 0; i < data.length; i++) {

          if (data[i].KeyValue == 'ProductName') {
            this.txtSoftwareName = data[i].Value;
          } else if (data[i].KeyValue == 'DecimalPlace') {
            this.txtRateDecimalPlace = data[i].Value;
            this.DeceimalPlace = parseFloat(this.txtRateDecimalPlace || 0);
            this.dRateDecimalPlace = this.DeceimalPlace;
          } else if (data[i].KeyValue == 'ItemSearch') {
            if (data[i].Value == "ItemAndCode")
              this.ItemCodeWidth = 150;
          } else if (data[i].KeyValue == 'BatchInCorrection') {
            if (data[i].Value == "Yes")
              this.bSalesBatchVisible = true;
          } else if (data[i].KeyValue == 'ExpiryInCorrection') {
            if (data[i].Value == "Yes")
              this.bSalesExpiryVisible = true;
          } else if (data[i].KeyValue == 'PurchaseItemCode') {
            if (data[i].Value == "Yes")
              this.ItemCodeWidth = 150;
          } else if (data[i].KeyValue == 'MRPINCLUSIVESALES') {
            if (data[i].Value == "Yes")
              this.bMrpInclusiveSales = true;
          } else if (data[i].KeyValue == 'CorRateEditPermissionAllUser') {
            if (data[i].Value == "Yes")
              this.bCorRateEditPermissionAllUser = true;
          } else if (data[i].KeyValue == 'CorAddQtyPermissionAllUser') {
            if (data[i].Value == "Yes")
              this.bCorAddQtyPermissionAllUser = true;
          } else if (data[i].KeyValue == 'CorMinusQtyPermissionAllUser') {
            if (data[i].Value == "Yes")
              this.bCorMinusQtyPermissionAllUser = true;
          } else if (data[i].KeyValue == 'SchemeInCorrection') {
            if (data[i].Value == "Yes")
              this.bSchemeInCorrection = true;
          } else if (data[i].KeyValue == 'ExpMonthYearFormat') {
            if (data[i].Value == 'No') {
              this.bExpMonthYearFormat = false;
            }
          } else if (data[i].KeyValue == 'WgtMechineCodeInProduct') {

            if (data[i].Value == 'Yes') {
              this.bWgtMechineCodeInProduct = true;

            }
          } else if (data[i].KeyValue == 'BatchDisplayName') {
            this.strBatchDisplayName = data[i].Value;
          }

        }
      }).finally(() => {
        this.fnPriceMenuGets();
      })
  }

  fnPriceMenuGets() {
    let ServiceParams = {};
    ServiceParams['strProc'] = "PriceMenu_GetsAll";

    this.appService.post('CommonQuery/fnGetDataReportNew', ServiceParams)
      .toPromise().then(data => {
        let jsonPricemenu = JSON.parse(data);
        for (var i = 0; i < jsonPricemenu.length; i++) {
          const element = jsonPricemenu[i]
          if (element.PriceMenu_Name == "W MRP") {
            this.lblWholeRateCalc = element.DisplayName;
            this.lblWhRate = element.DisplayName;
            if (element.Active == false)
              this.txtWMRP = false;
            else this.txtWMRP = true;
          } else if (element.PriceMenu_Name == "SpRate1") {
            this.lblSpRate1 = element.DisplayName;
            this.lblSpRateOneCalc = element.DisplayName;
            if (element.Active == false)
              this.txtSPRATE1 = false;
            else this.txtSPRATE1 = true;
          } else if (element.PriceMenu_Name == "SpRate2") {

            this.lblSpRate2 = element.DisplayName;
            this.lblSpRateTwoCalc = element.DisplayName;
            if (element.Active == false)
              this.txtSPRATE2 = false;
            else this.txtSPRATE2 = true;
          } else if (element.PriceMenu_Name == "SpRate3") {
            this.lblSpRate3 = element.DisplayName;
            this.lblSpRateThreeCalc = element.DisplayName;
            if (element.Active == false)
              this.txtSPRATE3 = false;
            else this.txtSPRATE3 = true;
          } else if (element.PriceMenu_Name == "SpRate4") {
            this.lblSpRate4 = element.DisplayName;
            this.lblSpRateFourCalc = element.DisplayName;
            if (element.Active == false)
              this.txtSPRATE4 = false;
            else this.txtSPRATE4 = true;
          } else if (element.PriceMenu_Name == "SpRate5") {
            this.lblSpRate5 = element.DisplayName;
            this.lblSpRateFiveCalc = element.DisplayName;
            if (element.Active == false)
              this.txtSPRATE5 = false;
            else this.txtSPRATE5 = true;
          } else if (element.PriceMenu_Name == "R MRP") {
            this.lblRetailRateCalc = element.DisplayName;
            this.lblRetailRateHead = element.DisplayName;
          } else if (element.PriceMenu_Name == "MRP") {
            this.lblMRPHead = element.DisplayName;
          }
        }

      }).finally(() => {
        this.fnGetCategorys();
        // this.fnGodownGets();
        this.fnColHeader();
      });
  }

  fnColHeader() {

    this.dynamicColumn = ['Save', 'No', 'Product'];

    if (this.bSalesExpiryVisible) {
      this.dynamicColumn.push('ExpDate');
    }

    if (this.bSalesBatchVisible) {
      this.dynamicColumn.push(this.strBatchDisplayName);
    }

    this.dynamicColumn.push('PurRate');
    this.dynamicColumn.push('LCost');
    this.dynamicColumn.push('RateCalc(%)');
    this.dynamicColumn.push(this.lblRetailRateHead);
    if (this.txtWMRP) {
      // this.dynamicColumn.push('WhRate';
      this.dynamicColumn.push(this.lblWhRate);
    }
    this.dynamicColumn.push(this.lblMRPHead);
    this.dynamicColumn.push('Stock');
    this.dynamicColumn.push('Add');
    this.dynamicColumn.push('Minus');



    if (this.txtSPRATE1) {
      // SpRate1
      this.dynamicColumn.push(this.lblSpRate1);
    }
    if (this.txtSPRATE2) {
      this.dynamicColumn.push(this.lblSpRate2);
      // this.dynamicColumn.push('SpRate2';
    }
    if (this.txtSPRATE3) {
      // SpRate3
      this.dynamicColumn.push(this.lblSpRate3);
    }
    if (this.txtSPRATE4) {
      // SpRate4
      this.dynamicColumn.push(this.lblSpRate4);
    }

    if (this.txtSPRATE5) {
      // SpRate5
      this.dynamicColumn.push(this.lblSpRate5);
    }


    if (this.txtSoftwareName == "RetailPharma")
      this.dynamicColumn.push('Pack');
    if (this.txtSoftwareName == "WholeSalePharma" || this.txtSoftwareName == "RetailPharma") {
      this.dynamicColumn.push('Banned');
    }
    if (this.bSchemeInCorrection) {
      this.dynamicColumn.push('SchemeQty');
      this.dynamicColumn.push('SchemeFree');
    }
    this.dynamicColumn.push('PurNo', 'InvNo', 'InvDate', 'Supplier', 'Print');

  }

  async fnGetCategorys() {
    let id = 1;
    
    await this.appService.get(`GetRepository/Category_GetOnTypeId?typeId=${id}`)
      .toPromise().then(data => {
        this.categories = data;

      }).finally(() => {
        this.fnReasons();
      })

  }

  async fnReasons() {
    let id = 13;
    await this.appService.get(`GetRepository/Category_GetOnTypeId?typeId=${id}`)
      .toPromise().then(data => {
        this.reaonJson = data;

      }).finally(() => {
        this.fnPriceMenuGetsForCorrection()
      })

  }

  async fnPriceMenuGetsForCorrection() {
    let ServiceParams = {};
    ServiceParams['strProc'] = "PriceMenu_Gets";

    await this.appService.post('CommonQuery/fnGetDataReport', ServiceParams)
      .toPromise().then(data => {
        this.priceMenu = JSON.parse(data);

      })
  }

  async fnProductSearch(event) {

    const keyword = event.target.value;
    if (keyword == '') {
      this.selectcomplete = false;
      return;
    }
    if (this.ddlCorrectionType == 'Product') {

      var ServiceParams = {};
      ServiceParams['strProc'] = "Product_SearchSalesCorrectionProductwise";
      
      var oProcParams = [];
      var ProcParams = {};
      ProcParams["strKey"] = "strItemDesc";
      ProcParams["strArgmt"] = keyword;
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams["strKey"] = "BranchId";
      ProcParams["strArgmt"] = this.branchId;
      oProcParams.push(ProcParams);

      ServiceParams['oProcParams'] = oProcParams;
      const body = JSON.stringify(ServiceParams)
      this.subject.next(body);

    } else if (this.ddlCorrectionType == 'Company') {

      let ServiceParams = {};
      let oProcParams = [];

      ServiceParams['strProc'] = "Manufacture_Gets";

      let ProcParams = {};
      ProcParams["strKey"] = "Manufacture_Name";
      ProcParams["strArgmt"] = keyword;
      oProcParams.push(ProcParams);
      ServiceParams['oProcParams'] = oProcParams;

      await this.appService.post('CommonQuery/fnGetDataReportNew', ServiceParams).toPromise()
        .then(data => {
          this.fillterItems = JSON.parse(data);

          if (this.fillterItems.length > 0) {
            this.selectcomplete = true;
          } else {
            this.selectcomplete = false;
          }
        });
    }
  }

  DateRetExpiryFormat(value) {
    var BillDate = value;
    var BillDate1 = BillDate.split('-');
    var Dates = BillDate1[1] + '/' + BillDate1[0]
    return Dates;
  }

  DateRet(value) {
    var BillDate = value;
    var BillDate1 = BillDate.split('-');
    var Dates = BillDate1[2] + '/' + BillDate1[1] + '/' + BillDate1[0]
    return Dates;
  }

  fnProductChange(eve) {

    this.dTempGodownId = 0;
    this.selectcomplete = false;

    let ProductId = 0;
    if (this.ddlCorrectionType == 'Product') {
      ProductId = eve.ProductId;
      this.productName = eve.ItemDesc;
      let itemFlag = false;
      if (this.jsonData && this.jsonData.data.length > 0) {
        itemFlag = this.dynamicArray.map(data => data.ProductId).includes(ProductId);
      }
      if (itemFlag) {
        this.openSnackBar('Already Exits !!!', 'Warning');
        return
      }
      this.fnStoreTaxDetailsGetOnProductId(ProductId);
    } else if (this.ddlCorrectionType == 'Company') {

      this.selection.clear();
      this.jsonData = null;
      this.dynamicArray = [];
      this.productName = '';
      ProductId = eve.Manufacture_Id;
     
      this.productName = eve.Manufacture_Name;
      this.fnStoreTaxDetailsGetOnProductId(ProductId);
    }

  }

  async fnStoreTaxDetailsGetOnBatchNo(eve) {

    if (eve.which == 13) {
      this.tableBuffer = true;
      const nBatchNo = eve.target.value;
      if (nBatchNo == '') {
        this.openSnackBar('enter valid code', 'Warning')
        return
      }
      const type = this.ddlCorrectionType;
      var ServiceParams = {};
      ServiceParams['strProc'] = "Store_GetOnBatchNo";

      let oProcParams = [];
      let ProcParams = {};

      ProcParams["strKey"] = "BatchNo";
      ProcParams["strArgmt"] = nBatchNo.toString();
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams["strKey"] = "BranchId";
      ProcParams["strArgmt"] = parseFloat(this.branchId || 0);
      oProcParams.push(ProcParams);
      ServiceParams['oProcParams'] = oProcParams;

      await this.appService.post('CommonQuery/fnGetDataReportNew', ServiceParams).toPromise()
        .then(data => {
          let dataJson = JSON.parse(data);

          let ncount = this.dynamicArray.length;
          dataJson.forEach((element, index) => {
            element.count = ncount + index
            element.oldBatch = element.Store_Batch;
            element.oldPack = element.Store_Pack;
            element.ddlOldBanned = element.Store_IsBanned;
            element.oldSchemeQty = element.Store_SchemeQty;
            element.oldSchemeFree = element.Store_SchemeFreQty;
            element.oldSellRate = element.Store_SellRate;
            element.oldPurRate = element.Store_ReceiptRate;
            element.oldWholeSaleRate = element.Store_DisributRate;
            element.oldMRP = element.Store_MRP;
            element.oldSPRateOne = element.SpRate1;
            element.oldSPRateTwo = element.SpRate2;
            element.oldLandingCost = element.LandingCost;
            element.oldSPRateThree = element.SpRate3;
            element.oldSPRateFour = element.SpRate4;
            element.oldSPRateFive = element.SpRate5;
            element.minus = 0;
            element.add = 0;
            if (this.txtSoftwareName == 'RetailPharma' || this.txtSoftwareName == 'WholeSalePharma' || this.bExpMonthYearFormat) {
              element.Store_ExpDate = this.DateRetExpiryFormat(element.Store_ExpDate);
            }
            else {
              element.Store_ExpDate = this.DateRet(element.Store_ExpDate);
            }
            // element.oldExpDate = element.Store_ExpDate;


            if (this.txtSoftwareName == 'RetailPharma' || this.txtSoftwareName == 'WholeSalePharma' || this.bExpMonthYearFormat) {
              element.oldExpDate = this.DateRetExpiryFormat(element.Store_ExpDate);
            }
            else {
              element.oldExpDate = this.DateRet(element.Store_ExpDate);
            }

            this.dynamicArray.push(element);
            this.tableBuffer = false;
          });


          this.jsonData = new MatTableDataSource(this.dynamicArray);
          this.fnGroupFlag();

        });

    }

  }



  async fnStoreTaxDetailsGetOnProductId(ProductId) {

    this.tableBuffer = true;
    var dltypes = this.ddlCorrectionType;
    var ServiceParams = {};
    if (dltypes === "Product") {
      ServiceParams['strProc'] = 'Store_GetsOnProdIdBranchIdForCorrection';
    } else if (dltypes === "Category") {
      ServiceParams['strProc'] = 'Store_GetsOnProdIdCategoryForCorrection';
    }
    else if (dltypes == "Company") {
      ServiceParams['strProc'] = 'Store_GetsProductForCorrectionCompanywise';
    }
    else {
      ServiceParams['strProc'] = 'Store_GetsProductForCorrectionCompanywise';
    }
    
    var oProcParams = [];

    var ProcParams = {};
    ProcParams["strKey"] = "ProdId";
    ProcParams["strArgmt"] = ProductId.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.branchId;
    oProcParams.push(ProcParams)

    ServiceParams['oProcParams'] = oProcParams;
    await this.appService.post('CommonQuery/fnGetDataReportNew', ServiceParams).toPromise()
      .then(data => {

        let jsonobj = JSON.parse(data);
        let ncount = this.dynamicArray.length;
        jsonobj.forEach((element, index) => {
          element.count = ncount + index;
          element.oldBatch = element.Store_Batch;
          element.oldPack = element.Store_Pack;
          element.ddlOldBanned = element.Store_IsBanned;
          element.oldSchemeQty = element.Store_SchemeQty;
          element.oldSchemeFree = element.Store_SchemeFreQty;
          element.oldSellRate = element.Store_SellRate;
          element.oldPurRate = element.Store_ReceiptRate;
          element.oldWholeSaleRate = element.Store_DisributRate;
          element.oldMRP = element.Store_MRP;
          element.oldSPRateOne = element.SpRate1;
          element.oldSPRateTwo = element.SpRate2;
          element.oldLandingCost = element.LandingCost;
          element.oldSPRateThree = element.SpRate3;
          element.oldSPRateFour = element.SpRate4;
          element.oldSPRateFive = element.SpRate5;
          element.minus = 0;
          element.add = 0;
          if (this.txtSoftwareName == 'RetailPharma' || this.txtSoftwareName == 'WholeSalePharma' || this.bExpMonthYearFormat) {
            element.Store_ExpDate = this.DateRetExpiryFormat(element.Store_ExpDate);
          }
          else {
            element.Store_ExpDate = this.DateRet(element.Store_ExpDate);
          }
          element.oldExpDate = element.Store_ExpDate;

          if (this.txtSoftwareName == 'RetailPharma') {

            element.Store_ReceiptRate = element.Store_PerRate;
            element.Store_SellRate = element.Store_PerSellRate;
            element.Store_MRP = element.Store_PerMRP;
            element.oldPurRate = element.Store_PerRate;
            element.oldSellRate = element.Store_PerSellRate;
            element.oldMRP = element.Store_PerMRP;
            element.LandingCost = element.Store_AvgRate;
            element.oldLandingCost = element.Store_AvgRate;
          }

          this.dynamicArray.push(element);

        });

        this.tableBuffer = false;
        this.jsonData = new MatTableDataSource(this.dynamicArray);
        this.fnGroupFlag();
        setTimeout(() => {
          (document.getElementById('txtAddQty' + (ncount)) as HTMLInputElement).focus();
        }, 600);

        // this.dynamicArray = this.jsonData.data;
      }, err => console.error(err));

  }

  productCountId = 0;
  fnGroupFlag() {
    this.jsonData.filteredData.forEach(element => {
      if (this.productCountId !== element.ProductId) {
        this.productCountId = element.ProductId;
        element.groupFlag = true;
      }
    });
  }

  fnChangeType(eve) {

    this.selection.clear();
    this.jsonData = null;
    this.dynamicArray = [];
    this.productName = '';
    this.bQtyEditing = true;
    this.dTempGodownId = 0;
   
    if (eve.target.value == 'All') {
      this.fnStoreTaxDetailsGetOnProductId(0);
    }

    if (eve.target.value == 'Product') {
      this.colHeaders = [{ col: 'ItemCode', width: '100px' },
      { col: 'ItemDesc', width: '300px' },
      { col: 'StockQty', width: '80px' },
      { col: 'MRP', width: '80px' },
      { col: 'ManufactureName', width: '150px' }];
      this.HeaderColumn = ['Code', 'ProductName', 'StockQty', 'MRP', 'Manufacture'];
    }
    if (eve.target.value == 'Company') {
      this.colHeaders = [{ col: 'Manufacture_Name', width: '300px' }];
      this.HeaderColumn = ['Manufacture Name'];
    }

    if (eve.value == 'Godown') {
      this.bQtyEditing = false;
    }

  }


  async fnGodownGets() {

    var ServiceParams = {};
    ServiceParams['strProc'] = 'Godown_Gets';

    var oProcParams = [];

    var ProcParams = {};
    ProcParams['strKey'] = 'Search';
    ProcParams['strArgmt'] = '';
    oProcParams.push(ProcParams);


    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);
    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);
    await this.appService.post('CommonQuery/fnGetDataReport', ServiceParams).toPromise()
      .then(data => {
        this.GodownList = JSON.parse(data);

      }, error => console.error(error));
  }

  fnChangeCategory(eve) {
    this.categoryId = eve.value;
    const catrgoryId = eve.value;
    this.selection.clear();
    this.jsonData = null;
    this.dynamicArray = [];
    this.productName = '';
    this.dTempGodownId = 0;
    if (catrgoryId !== 0) {
      this.fnStoreTaxDetailsGetOnProductId(catrgoryId);
    }

  }

  fnChangeGodown(eve) {

    const dGodownId = eve.value;
    this.dTempGodownId = dGodownId;

    this.selection.clear();
    this.jsonData = null;
    this.dynamicArray = [];
    this.productName = '';
    if (dGodownId !== 0) {
      this.fnStoreTaxDetailsGetOnProductId(dGodownId);
    }

  }

  OnSearch(filterValue) {
    const keyward = filterValue.target.value;
    if (this.jsonData && this.jsonData.data.length) {
      this.jsonData.filter = keyward.trim().toLowerCase();
    }

  }
  fnKeyvalid(eve, i) {

    if (eve.which != 40 && eve.which != 38 && eve.which != 37 && eve.which != 39) {
      this.selection.select(this.dynamicArray[i]);
    }


  }

  fnPurRateWithTaxCalculationOnCurRow(eve, ID) {
    this.fnKeyvalid(eve, ID);
    let dPurRate = 0, dSelRate = 0, dMRP = 0, dAmount = 0, dProdId = 0, dWholeSaleRate = 0, dTax = 0, dDisPers = 0, dDisAmt = 0, dTaxAmt = 0, dActPurRate = 0;
    let strBatch = "", strTaxOn = "", strType = "", strTaxName = "";

    let dProductId = this.dynamicArray[ID].ProductId;
    dPurRate = dSelRate = dMRP = dAmount = dProdId = dWholeSaleRate = dDisPers = dTaxAmt = dActPurRate = 0;
    strBatch = strTaxOn = strTaxName = "";

    if (dProductId != 0) {
      dPurRate = parseFloat(this.dynamicArray[ID].Store_ReceiptRate || 0);
      dActPurRate = dPurRate;
      dMRP = parseFloat(this.dynamicArray[ID].Store_MRP || 0);
      dTax = parseFloat(this.dynamicArray[ID].Store_ProdTaxPers || 0);
      strTaxOn = this.dynamicArray[ID].Store_TaxOn;
      if (strTaxOn == "MRP Inclusive")
        dTaxAmt = 1 * ((dMRP * dTax) / (100 + dTax));
      else
        dTaxAmt = 1 * ((dPurRate * dTax) / 100);

      dPurRate = dActPurRate + dTaxAmt;

      this.dynamicArray[ID].LandingCost = (dPurRate.toFixed(this.DeceimalPlace));

    }
  }

  fnPurRateCalculationOnCurRow(eve, ID) {
    this.fnKeyvalid(eve, ID);
    let dPurRate = 0, dSelRate = 0, dMRP = 0, dAmount = 0, dProdId = 0, dWholeSaleRate = 0, dTax = 0, dDisPers = 0, dDisAmt = 0, dTaxAmt = 0, dActPurRate = 0;
    let strBatch = "", strTaxOn = "", strType = "", strTaxName = "";


    let dProductId = this.dynamicArray[ID].ProductId;
    dPurRate = dSelRate = dMRP = dAmount = dProdId = dWholeSaleRate = dDisPers = dTaxAmt = dActPurRate = 0;
    strBatch = strTaxOn = strTaxName = "";

    if (dProductId != 0) {
      dPurRate = parseFloat(this.dynamicArray[ID].LandingCost || 0);
      dActPurRate = dPurRate;
      dMRP = parseFloat(this.dynamicArray[ID].Store_MRP || 0);
      dTax = parseFloat(this.dynamicArray[ID].Store_ProdTaxPers || 0);
      strTaxOn = this.dynamicArray[ID].Store_TaxOn;

      if (strTaxOn == "MRP Inclusive")
        dTaxAmt = 1 * ((dMRP * dTax) / (100 + dTax));
      else {
        dPurRate = dPurRate - ((dPurRate * dTax) / (100 + dTax));
        dTaxAmt = dActPurRate - (dPurRate);
      }
      dPurRate = dActPurRate - dTaxAmt;
      this.dynamicArray[ID].Store_ReceiptRate = dPurRate.toFixed(this.DeceimalPlace);
    }
  }

  fnRetailRateCalulationOnMargin(eve, ID) {
    this.fnKeyvalid(eve, ID);
    if (eve.target.value == '') {
      return;
    }
    if (this.ddlPriceMenu == 0) {
      this.openSnackBar('choose any pricemenu', 'Warning');
      return;
    }
    // this.jsonData.data[ID] = eve.target.value;
    let dMarginPers = parseFloat(eve.target.value || 0);
    let dSellRate = parseFloat(this.dynamicArray[ID].Store_SellRate || 0);
    let dWholeSaleRate = parseFloat(this.dynamicArray[ID].Store_DisributRate || 0);
    let dSPRateOne = parseFloat(this.dynamicArray[ID].SpRate1 || 0);
    let dSPRateTwo = parseFloat(this.dynamicArray[ID].SpRate2 || 0);
    let dSPRateThree = parseFloat(this.dynamicArray[ID].SpRate3 || 0);
    let dSPRateFour = parseFloat(this.dynamicArray[ID].ItemDSpRate4esc || 0);
    let dSPRateFive = parseFloat(this.dynamicArray[ID].SpRate5 || 0);
    let dPurRate = parseFloat(this.dynamicArray[ID].Store_ReceiptRate || 0);
    let dLandingCost = parseFloat(this.dynamicArray[ID].LandingCost || 0);
    let dPriceMenuId = parseFloat(<any>this.ddlPriceMenu || 0);
    let dMrp = parseFloat(this.dynamicArray[ID].Store_MRP || 0);

    if (this.bMrpInclusiveSales)
      dPurRate = dLandingCost;

    if (this.txtSoftwareName == "RetailPharma") {
      dSellRate = dMrp - ((dMrp * dMarginPers) / 100);
      this.dynamicArray[ID].Store_SellRate = (dSellRate.toFixed(this.dRateDecimalPlace));
      return;
    }
    //R MRP
    if (dPriceMenuId == 1) {
      dSellRate = ((dPurRate * dMarginPers) / 100) + dPurRate;
      this.dynamicArray[ID].Store_SellRate = (dSellRate.toFixed(this.dRateDecimalPlace));
    }
    //W MRP
    if (dPriceMenuId == 2) {
      dWholeSaleRate = ((dPurRate * dMarginPers) / 100) + dPurRate;
      this.dynamicArray[ID].Store_DisributRate = (dWholeSaleRate.toFixed(this.dRateDecimalPlace));
    }
    //SpRate1
    if (dPriceMenuId == 4) {
      dSPRateOne = ((dPurRate * dMarginPers) / 100) + dPurRate;
      this.dynamicArray[ID].SpRate1 = (dSPRateOne.toFixed(this.dRateDecimalPlace));
    }
    //SpRate2
    if (dPriceMenuId == 5) {
      dSPRateTwo = ((dPurRate * dMarginPers) / 100) + dPurRate;
      this.dynamicArray[ID].SpRate2 = (dSPRateTwo.toFixed(this.dRateDecimalPlace));
    }
    //SpRate3
    if (dPriceMenuId == 6) {
      dSPRateThree = ((dPurRate * dMarginPers) / 100) + dPurRate;
      this.dynamicArray[ID].SpRate3 = (dSPRateThree.toFixed(this.dRateDecimalPlace));
    }
    //SpRate4
    if (dPriceMenuId == 7) {
      dSPRateFour = ((dPurRate * dMarginPers) / 100) + dPurRate;
      this.dynamicArray[ID].ItemDSpRate4esc = (dSPRateFour.toFixed(this.dRateDecimalPlace));
    }
    //SpRate5
    if (dPriceMenuId == 8) {
      dSPRateFive = ((dPurRate * dMarginPers) / 100) + dPurRate;
      this.dynamicArray[ID].SpRate5 = (dSPRateFive.toFixed(this.dRateDecimalPlace));
    }
  }



  fnQtyChange(event, PUniqueId, item) {
    this.fnKeyvalid(event, PUniqueId);
    const dQty = parseFloat(event.target.value || 0);
    const dStockQty = parseFloat(this.dynamicArray[PUniqueId].Store_BalQty || 0);

    if (dQty > dStockQty) {
      item.minus = 0;
      this.openSnackBar('Enter Valid Stock', 'Warning');
      event.target.value = ''
      return;
    }
  }
  isDateDDMMYYYY(date) {
    return true // _moment(date, "DD/MM/YYYY", true).isValid();
  }
  isDateMMYYYY(date) {
    return true //_moment(date, "MM/YYYY", true).isValid();
  }


  async fnSave() {
    this.bPermissionPopupShow = false;

    const dataSelected = this.selection.selected;
    if (dataSelected.length == 0) {
      this.openSnackBar('choose any changes', 'Warning')
      return
    }
    let BranchId = parseFloat(this.branchId || 0);
    let StaffId = this.staffId;


    if (BranchId == 0) {
      this.openSnackBar('Session Time Out Login Again', 'Warning')
      window.location.href = "#/login";
      return;
    }
    let dReason = this.ddlReason;
    if (dReason == 0) {
      this.openSnackBar('Select Reason', 'Warning');
      return;
    }

    let strsave = 'Yes';

    if (this.ddlCorrectionType == 'Godown') {

    }

    dataSelected.forEach(data => {
      // var ProductId = parseFloat($('#ProductId' + ID).val() || 0);
      if (this.txtSoftwareName == 'RetailPharma' || this.txtSoftwareName == 'WholeSalePharma' || this.bExpMonthYearFormat) {
        if (!this.isDateMMYYYY(data.Store_ExpDate)) {
          strsave = 'No'
        }
      } else if (!this.isDateDDMMYYYY(data.Store_ExpDate)) {
        strsave = 'No'
      }

    });

    if (strsave == 'No') {
      this.openSnackBar('enter valid  expiry date', 'Warning');
      return;
    }

    let ListCorrectionInfo = [];

    for (let index = 0; index < dataSelected.length; index++) {
      const element = dataSelected[index];
      let OldPurRate = parseFloat(element.oldPurRate || 0);
      let PurRate = parseFloat(element.Store_ReceiptRate || 0);
      let OldSellRate = parseFloat(element.oldSellRate || 0);
      let SelRate = parseFloat(element.Store_SellRate || 0);
      let WholeSalRate = parseFloat(element.Store_DisributRate || 0);
      let OldWholeSaleRate = parseFloat(element.oldWholeSaleRate || 0);
      let Mrp = parseFloat(element.Store_MRP || 0);
      let OldMRP = parseFloat(element.oldMRP || 0);
      let SpRateOne = parseFloat(element.SpRate1 || 0);
      let OldSpRateOne = parseFloat(element.oldSPRateOne || 0);
      let LandingCost = parseFloat(element.LandingCost || 0);
      let OldLandingCost = parseFloat(element.oldLandingCost || 0);
      let OldSpRateTwo = parseFloat(element.oldSPRateTwo || 0);
      let SpRateTwo = parseFloat(element.SpRate2 || 0);
      let OldSpRateThree = parseFloat(element.oldSPRateThree || 0);
      let SpRateThree = parseFloat(element.SpRate3 || 0);
      let OldSpRateFour = parseFloat(element.oldSPRateFour || 0);
      let SpRateFour = parseFloat(element.SpRate4 || 0);
      let OldSpRateFive = parseFloat(element.oldSPRateFive || 0);
      let SpRateFive = parseFloat(element.SpRate5 || 0);
      let ProductId = parseFloat(element.ProductId || 0);
      let BatchSlNo = parseFloat(element.Store_BatchSlNo || 0);
      let ExpDate = element.Store_ExpDate;
      let Pack = parseFloat(element.Store_Pack || 0);
      let Batch = element.Store_Batch;
      let Stock = parseFloat(element.Store_BalQty || 0);
      let Add = parseFloat(element.add || 0);
      let Minus = parseFloat(element.minus || 0);
      let OldBatch = element.oldBatch;
      let OldExpDate = element.oldExpDate;
      let OldPack = parseFloat(element.oldPack || 0);
      let Banned = element.Store_IsBanned;
      let OldBanned = element.ddlOldBanned;
      let dSchemeQty = parseFloat(element.Store_SchemeQty || 0);
      let dOldSchemeQty = parseFloat(element.oldSchemeQty || 0);
      let dSchemeFree = parseFloat(element.Store_SchemeFreQty || 0);
      let dOldSchemeFree = parseFloat(element.oldSchemeFree || 0);

      if (!this.bAllPermission) {
        if (this.bCorRateEditPermissionAllUser) {
          if (OldPurRate != PurRate || OldSellRate != SelRate || WholeSalRate != OldWholeSaleRate || Mrp != OldMRP ||
            SpRateOne != OldSpRateOne || LandingCost != OldLandingCost || OldSpRateTwo != SpRateTwo ||
            OldSpRateThree != SpRateThree || OldSpRateFour != SpRateFour || OldSpRateFive != SpRateFive)
            this.bPermissionPopupShow = true;
        }
        if (this.bCorAddQtyPermissionAllUser) {
          if (parseFloat(element.add || 0) > 0) {
            this.bPermissionPopupShow = true;
          }
        }
        if (this.bCorMinusQtyPermissionAllUser) {
          if (parseFloat(element.minus || 0) > 0) {
            this.bPermissionPopupShow = true;
          }
        }
      }

      if (ProductId != 0) {
        let CorrectionInfo = {}
        CorrectionInfo["ProductId"] = ProductId;
        CorrectionInfo["BatchSlno"] = BatchSlNo;
        CorrectionInfo["ExpDate"] = ExpDate;
        CorrectionInfo["Pack"] = Pack;
        CorrectionInfo["Batch"] = Batch;
        CorrectionInfo["PurRate"] = PurRate;
        CorrectionInfo["SelRate"] = SelRate;
        CorrectionInfo["WholeSalRate"] = WholeSalRate;
        CorrectionInfo["SpRate1"] = SpRateOne;
        CorrectionInfo["SpRate2"] = SpRateTwo;
        CorrectionInfo["SpRate3"] = SpRateThree;
        CorrectionInfo["SpRate4"] = SpRateFour;
        CorrectionInfo["SpRate5"] = SpRateFive;
        CorrectionInfo["Mrp"] = Mrp;
        CorrectionInfo["Stock"] = Stock;
        CorrectionInfo["Add"] = Add;
        CorrectionInfo["Minus"] = Minus;
        CorrectionInfo["OldBatch"] = OldBatch;
        CorrectionInfo["OldExpDate"] = OldExpDate;
        CorrectionInfo["OldPurRate"] = OldPurRate;
        CorrectionInfo["OldSellRate"] = OldSellRate;
        CorrectionInfo["OldWholeSaleRate"] = OldWholeSaleRate;
        CorrectionInfo["OldMRP"] = OldMRP;
        CorrectionInfo["OldSpRate1"] = OldSpRateOne;
        CorrectionInfo["OldSpRate2"] = OldSpRateTwo;
        CorrectionInfo["OldSpRate3"] = OldSpRateThree;
        CorrectionInfo["OldSpRate4"] = OldSpRateFour;
        CorrectionInfo["OldSpRate5"] = OldSpRateFive;
        CorrectionInfo["LandingCost"] = LandingCost;
        CorrectionInfo["OldLandingCost"] = OldLandingCost;
        CorrectionInfo["Field1"] = dReason;
        CorrectionInfo["BranchId"] = BranchId;
        CorrectionInfo["StaffId"] = StaffId;
        CorrectionInfo["OldPack"] = OldPack;
        CorrectionInfo["Banned"] = Banned;
        CorrectionInfo["OldBanned"] = OldBanned;
        CorrectionInfo["SchemeQty"] = dSchemeQty;
        CorrectionInfo["OldSchemeQty"] = dOldSchemeQty;
        CorrectionInfo["SchemeFreeQty"] = dSchemeFree;
        CorrectionInfo["OldSchemeFreeQty"] = dOldSchemeFree;
        CorrectionInfo["SalesmanId"] = this.cbSalesMan;
        // CorrectionInfo["GodownId"] = this.dTempGodownId;
        ListCorrectionInfo.push(CorrectionInfo);
      }
    }
    if (this.bPermissionPopupShow) {
      strsave = 'No';
    }
    if (strsave == 'No')
      return;
    if (ListCorrectionInfo.length == 0) {
      this.openSnackBar('Select Product', 'Warning');
      return;
    }
    if (!confirm('Are you sure you want to save  this correction ?')) {
      return
    }

    if (this.ddlCorrectionType == 'Godown') {
      await this.appService.post('Purchase/fnSaveCorrectionGodownwise', ListCorrectionInfo).toPromise()
        .then(data => {
          this.openSnackBar('Correction Saved', 'Successfully')
          this.fnClear();
        }, err => console.error(err));
    } else {
      let body = JSON.stringify(ListCorrectionInfo)
      await this.appService.post('Purchase/fnSaveCorrection', ListCorrectionInfo).toPromise()
        .then(data => {
          this.openSnackBar('Correction Saved', 'Successfully')
          this.fnClear();
        }, err => console.error(err));

    }


  }

  async fnAdminUserLogin(pwd) {
    if (pwd == '') {
      this.openSnackBar('please enter password', 'Warning');
      return;
    }
    let varArguements = {};
    varArguements = { SalesmanPwd: pwd, BranchId: this.branchId }

    let DictionaryObject = {};
    DictionaryObject["dictArgmts"] = varArguements;
    DictionaryObject["ProcName"] = 'SalesmanGet_LoginOnPassword';

    await this.appService.post('/Master/SalesmanLogin_OnPwd', DictionaryObject).toPromise()
      .then(data => {
        let jsonobj = JSON.parse(data);

        if (jsonobj.length > 0) {
          this.cbSalesMan = jsonobj[0].AC_Id || 0;
          this.bAllPermission = true;
          this.fnSave();
        } else {
          this.openSnackBar('Enter valid password', 'Warning')
        }
      });
  }


  fnClear() {
    this.dTempGodownId = 0;
    this.selection.clear();
    this.bAllPermission = false;
    this.bPermissionPopupShow = false;
    this.cbSalesMan = 0;
    this.fnGetCategorys();
    // this.fnGodownGets();
    this.jsonData = null;
    this.dynamicArray = [];
    this.productName = '';

    // this.ddlReason = 0;
    this.ddlCorrectionType = 'Product'
    this.ddlPriceMenu = 0;

  }

  fnExpDateKey(event, id) {
    this.fnKeyvalid(event, id);
    if (this.txtSoftwareName == 'RetailPharma' || this.txtSoftwareName == 'WholeSalePharma' || this.bExpMonthYearFormat) {
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

  fnShowPrintPop(item) {
    this.barCodeNo = item.Store_BatchSlNo
    this.dBarCodeProductId = item.ProductId;
    this.printPopup = true;

  }

  async fnPrint() {
    let NoOfPrint = parseFloat(this.noOfPrint || 0);
    let BatchNo = parseFloat(this.barCodeNo || 0);

    if (NoOfPrint == 0) {
      this.openSnackBar('Enter the No Of Qty', 'Warning');
      return
    }

    var ServiceParams = {};
    ServiceParams['strProc'] = "PurchaseDetails_BatchSlNoProductIdForBarCodeCorrection";

    let oProcParams = [];
    let ProcParams = {};

    ProcParams["strKey"] = "BatchSlNo";
    ProcParams["strArgmt"] = BatchNo.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "NoOfPrint";
    ProcParams["strArgmt"] = NoOfPrint.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.branchId;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "ProductId";
    ProcParams["strArgmt"] = this.dBarCodeProductId;
    oProcParams.push(ProcParams)

    ServiceParams['oProcParams'] = oProcParams;

    await this.appService.post('CommonQuery/fnGetDataReportNew', ServiceParams).toPromise()
      .then(data => {

        this.saveTextAsFile(data)

      });
  }

  fnWgtMechCode() {

    var ServiceParams = {};
    ServiceParams['strProc'] = 'Product_GetOnCategoryId';

    let oProcParams = [];
    let ProcParams = {};

    ProcParams['strKey'] = 'CategoryId';
    ProcParams['strArgmt'] = this.categoryId.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = 'BranchId';
    ProcParams['strArgmt'] = this.branchId;
    oProcParams.push(ProcParams);
    ServiceParams['oProcParams'] = oProcParams;
    let Value = '';
    this.appService.post('CommonQuery/fnGetDataReportNew', ServiceParams)
      .subscribe(data => {
        const jsonobj = JSON.parse(data)
        jsonobj.forEach(val => {
          Value = Value + val.Model + ',' + val.ItemCode + ',' + val.ItemDesc + ',' + val.VendorCode + ',' + parseFloat(val.SelRate || 0).toFixed(2) + '\r\n';
        });

        const BillObj = Value;
        let arrayOfStuff = [];
        arrayOfStuff.push(BillObj);
        const blob = new Blob([BillObj], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'PLU.txt';
        a.click();
      }, err => console.error(err));

  }
  saveTextAsFile(jsonobj) {
    let arrayOfStuff = [];
    arrayOfStuff.push(jsonobj);
    const blob = new Blob(arrayOfStuff, { type: 'application/octet-stream' });
    // saveAs(blob, 'codeappsbarcode.txt');
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {

    if (event.keyCode === 113 && this.selection.selected.length > 0) {
      this.fnSave();
    }


  }

}
