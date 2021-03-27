import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { ProductService } from './product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @ViewChild('itemcode') itemcodeField: ElementRef;
  searchText: any = '';
  createFlag: boolean = true;
  productListFlag: any;
  dBranchId: any = localStorage.getItem("SessionBranchId");
  productLists: any;
  productSource = {
    ProductId: 0, ProductName: '', ItemCode: '', HsnCode: '', Qty: '', HsnCode_Id: '', CategoryID: '',
    PurRate: '', Discount: '', SelRate: '', MrpRate: '', PackageId: '', ManufacturingId: '',
    TaxGroupId: '', ManufacturingDes: '', TaxPercent: '', Amound: '', Active: true, BranchId: parseFloat(this.dBranchId || 0),
    Stock_Check: false,
  }
  category: any;
  taxGroup: any;
  Manufacture: any;
  constructor(public _appService: AppService, public _productService: ProductService) { }

  ngOnInit() {
    this.fnSettings();
  }
  fnSettings() {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'getSettingsProduct';
    ServiceParams['JsonFileName'] = 'JsonArrayScriptOne';
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportFromScriptJsonFile', body).subscribe(data => {
      let jsonObj = JSON.parse(data.JsonDetails[0]);
      this.productListFlag = jsonObj[0].value;
      if (jsonObj[0].value == 'Yes') {
        this.getProductWithoutBranchId();
      } else {
        this.getProduct();
      }
      this.getCategory();
    });

  }
  getProductWithoutBranchId() {
    this._productService.getProductWithoutBranchId(this.searchText).subscribe(data => {
      this.productLists = data;
    })
  }
  getProduct() {
    this._productService.getProduct(this.searchText).subscribe(data => {
      this.productLists = data;
    });
  }
  fnsearchText(eve) {
    this.searchText = eve.target.value
    if (this.productListFlag == 'Yes') {
      this.getProductWithoutBranchId();
    } else {
      this.getProduct();
    }
  }

  fnCreate() {
    this.createFlag = false;

    setTimeout(() => {
      this.itemcodeField.nativeElement.focus();
     }, 200);
  }

  fnAnchorClick(eve) {
    this.createFlag = false;
    this.productSource = {
      ProductId: eve.ProductId, ProductName: eve.ProductName, ItemCode: eve.ItemCode,
      HsnCode: eve.HsnCode, Qty: eve.BalanceQty, HsnCode_Id: eve.HsnCodeId, CategoryID: eve.CategoryId,
      PurRate: eve.PurRate, Discount: eve.Discount, SelRate: eve.SelRate, MrpRate: eve.MrpRate,
      PackageId: '', ManufacturingId: eve.ManufacturingId, TaxGroupId: eve.TaxGroupId,
      ManufacturingDes: eve.ManufacturingDes, TaxPercent: eve.TaxPercent, Amound: '',
      Active: eve.Active, BranchId: this.dBranchId, Stock_Check: eve.StockCheck
    }
  }

  fnSave() {

    for (const product of this.productLists) {
      if (product.ProductId != this.productSource.ProductId) {
        if (product.ItemCode == this.productSource.ItemCode) {
          this._appService.openSnackBar('The Given Item Code Is Already Exist...!', 'Warning');
          return;
        }

        if (product.ProductName.toLocaleLowerCase() == this.productSource.ProductName.toLocaleLowerCase() ) {
          this._appService.openSnackBar('The Given Product Name Is Already Exist', 'Warning');
          return;
        }
      }
    }

    if (!this.productSource.ItemCode) {
      this._appService.openSnackBar('Please Enter The ItemCode...', 'Warning');
      return;
    }

    if (!this.productSource.ProductName) {
      this._appService.openSnackBar('Please Enter The Product Name....', 'Warning');
      return;
    }

    if (this.productSource.SelRate == null || this.productSource.SelRate == '') {
      this._appService.openSnackBar('Please Enter The Selling Rate....', 'Warning');
      return;
    }

    if (this.productSource.ManufacturingId == null || this.productSource.ManufacturingId == '') {
      this._appService.openSnackBar('Please Select The Company....', 'Warning');
      return;
    }

    if (this.productSource.CategoryID == null || this.productSource.CategoryID == '') {
      this._appService.openSnackBar('Please Select The Category....', 'Warning');
      return;
    }

    if (this.productSource.TaxGroupId == null || this.productSource.TaxGroupId == '') {
      this._appService.openSnackBar('Please Select The Tax Percentage....', 'Warning');
      return;
    }

    if (this.productSource.TaxGroupId == null || this.productSource.TaxGroupId == '') {
      this._appService.openSnackBar('Please Select The Tax Percentage....', 'Warning');
      return;
    }

    let dataSource = {
      ProductId: this.productSource.ProductId,
      ProductName: this.productSource.ProductName,
      ItemCode: this.productSource.ItemCode,
      HsnCode: this.productSource.HsnCode,
      Qty: parseFloat(<any>this.productSource.Qty || 0),
      HsnCodeId: parseFloat(<any>this.productSource.HsnCode_Id || 0),
      CategoryId: parseFloat(<any>this.productSource.CategoryID || 0),
      PurRate: parseFloat(<any>this.productSource.PurRate || 0),
      Discount: parseFloat(<any>this.productSource.Discount || 0),
      SelRate: parseFloat(<any>this.productSource.SelRate || 0),
      MrpRate: parseFloat(<any>this.productSource.MrpRate || 0),
      PackageId: parseFloat(<any>this.productSource.PackageId || 0),
      ManufacturingId: parseFloat(<any>this.productSource.ManufacturingId || 0),
      TaxGroupId: parseFloat(<any>this.productSource.TaxGroupId || 0),
      ManufacturingDes: this.productSource.ManufacturingDes,
      TaxPercent: parseFloat(<any>this.productSource.TaxPercent || 0),
      Amound: parseFloat(<any>this.productSource.Amound || 0),
      Active: true,
      BranchId: parseFloat(this.dBranchId || 0),
      StockCheck: false,
    }
    let body = JSON.stringify(dataSource);


    this._appService.post('PostRepository/PostProduct', body).subscribe(data => {
      let jsonData = data;
      if (jsonData.ProductId == 0) {
        this._appService.openSnackBar('ItemCode or Product Name is Already Exists ', 'Success');
        return;
      }
      this._appService.openSnackBar('Saved Successfully', 'Success');
      this.BackToList();
    });
  }

  BackToList() {
    this.fnClear();
    if (this.productListFlag == 'Yes') {
      this.getProductWithoutBranchId();
    } else {
      this.getProduct();
    }
    this.createFlag = true;
  }

  fnClear() {
    this.productSource = {
      ProductId: 0, ProductName: '', ItemCode: '', HsnCode: '', Qty: '', HsnCode_Id: '', CategoryID: '',
      PurRate: '', Discount: '', SelRate: '', MrpRate: '', PackageId: '', ManufacturingId: '',
      TaxGroupId: '', ManufacturingDes: '', TaxPercent: '', Amound: '', Active: true, BranchId: this.dBranchId,
      Stock_Check: false
    }
  }
  getCategory() {
    this._appService.get('GetRepository/SearchCategory?terms')
      .subscribe(data => {
        this.category = data;
      }, error => console.error(error));
    this.getTax();
  }
  getTax() {
    this._appService.get('GetRepository/GetTaxGroups')
      .subscribe(data => {
        this.taxGroup = data;
      }, error => console.error(error));
    this.getManufacture();
  }
  getManufacture() {
    var ServiceParams = {};
    ServiceParams['strProc'] = "Manufacture_Gets";

    var oProcParams = [];

    var ProcParams = {};
    ProcParams["strKey"] = "Manufacture_Name";
    ProcParams["strArgmt"] = '';
    oProcParams.push(ProcParams);

    ServiceParams["oProcParams"] = oProcParams;
    let body = JSON.stringify(ServiceParams);
    this._appService.post('CommonQuery/fnGetDataReport', body)
      .subscribe(data => {
        this.Manufacture = JSON.parse(data);
      }, error => console.error(error));
  }
}
