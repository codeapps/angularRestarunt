import { ProductService } from './../product/product.service';
import { ManufactureService } from './../manufacture/manufacture.service';
import { AppService } from './../../../app.service';
import { CategoryService } from './../category/category.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-correction',
  templateUrl: './product-correction.component.html',
  styleUrls: ['./product-correction.component.scss']
})
export class ProductCorrectionComponent implements OnInit {
  dataRep: MatTableDataSource<any[]>;
  dataRepTemp: any;
  selection = new SelectionModel<any>(true, []);
  displayedColumn: any = [
    { name: 'SlNo', width: '20px', indexcol: 0 },
    { name: 'Save', width: '20px', indexcol: 1 },
    { name: 'ProductName', width: '260px', indexcol: 2 },
    { name: 'ItemCode', width: '250px', indexcol: 3 },
    { name: 'HsnCode', width: '250px', indexcol: 4 },
    { name: 'Category', width: '100px', indexcol: 5 },
    { name: 'PurRate', width: '100px', indexcol: 6 },
    { name: 'SellingRate', width: '150px', indexcol: 7 },
    { name: 'Mrp', width: '100px', indexcol: 8 },
    { name: 'Discount', width: '100px', indexcol: 9 },
    { name: 'Manufacture', width: '150px', indexcol: 10 },
    { name: 'Tax', width: '100px', indexcol: 11 },
    { name: 'Image', width: '100px', indexcol: 12 },
    { name: 'ImageOption', width: '100px', indexcol: 13 },
  ];

  columsHeader: any = [
    { name: 'SlNo', width: '20px', indexcol: 0 },
    { name: 'Save', width: '20px', indexcol: 1 },
    { name: 'ProductName', width: '260px', indexcol: 2 },
    { name: 'ItemCode', width: '250px', indexcol: 3 },
    { name: 'HsnCode', width: '250px', indexcol: 4 },
    { name: 'Category', width: '100px', indexcol: 5 },
    { name: 'PurRate', width: '100px', indexcol: 6 },
    { name: 'SellingRate', width: '150px', indexcol: 7 },
    { name: 'Mrp', width: '100px', indexcol: 8 },
    { name: 'Discount', width: '100px', indexcol: 9 },
    { name: 'Manufacture', width: '150px', indexcol: 10 },
    { name: 'Tax', width: '100px', indexcol: 11 },
    { name: 'Image', width: '100px', indexcol: 12 },
    { name: 'ImageOption', width: '100px', indexcol: 13 },
  ];
  categoryList: any;
  taxGroup: any;
  allManufactureList: any;
  selectedRowIndex: number;

  //resize
  currentResizeIndex: number;
  startX: number;
  startWidth: number;
  isResizingRight: boolean;
  pressed = false;
  resizableMousemove: () => void;
  resizableMouseup: () => void;
  searchText: any = '';
  filterFlag: boolean = false;
  filterTaxId: any = 0;
  filterCategoryId: any = 0;
  filterManufactureId: any = 0;
  active: any;
  selectcolumn = new FormControl();
  tempReportColumns: any;
  reportColumns: any;
  productListFlag: any;
  fileData: File = null;
  // filesData: File[] = null
  public filesData;
  baseApiUrl = environment.apiUrl;
  imgURL: any;
  imagePreview: boolean;
  categoryHeadList: Object;
  filterCategoryHeadId: any = 0;
  TempcategoryList: any = [];


  constructor(public _categoryService: CategoryService, public appService: AppService, public _manufactureService: ManufactureService,
    private renderer: Renderer2, public _productService: ProductService, public http: HttpClient) { }

  ngOnInit() {
    this.tempReportColumns = this.columsHeader;
    this.selectcolumn.setValue(this.tempReportColumns);

    this.fnSettings();
    this.fngetCategory();
  }
  fnSettings() {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'getSettingsProduct';
    ServiceParams['JsonFileName'] = 'JsonArrayScriptOne';
    let body = JSON.stringify(ServiceParams);

    this.appService.post('CommonQuery/fnGetDataReportFromScriptJsonFile', body).subscribe(data => {
      let jsonObj = JSON.parse(data.JsonDetails[0]);
      this.productListFlag = jsonObj[0].value;
      if (jsonObj[0].value == 'Yes') {
        this.getProductWithoutBranchId();
      } else {
        this.getProduct();
      }
    });
  }

  fnSearchtext() {
    if (this.productListFlag == 'Yes') {
      this.getProductWithoutBranchId();
    } else {
      this.getProduct();
    }
  }

  getProductWithoutBranchId() {
    this._productService.getProductWithoutBranchId(this.searchText).subscribe(data => {
      this.dataRepTemp = data;
      this.dataRep = new MatTableDataSource(this.dataRepTemp);
    })
  }
  getProduct() {
    this._productService.getProduct(this.searchText).subscribe(data => {
      this.dataRepTemp = data;
      this.dataRep = new MatTableDataSource(this.dataRepTemp);
    });
  }


  fngetCategory() {
    this._categoryService.fngetCategory('').subscribe(data => {
      this.categoryList = data;
      this.TempcategoryList = data;
      this.fngetTaxes();
    });
  }
  fngetTaxes() {
    this.appService.get('GetRepository/GetTaxGroups')
      .subscribe(data => {
        this.taxGroup = data;
        this.fngetManufactures();
      }, error => console.error(error));
  }

  fngetManufactures() {
    this._manufactureService.fngetmanufacture('').subscribe(data => {
      let DataObj = JSON.parse(data);
      this.allManufactureList = DataObj;
      this.fngetCategoryHead();
    });
  }

  fngetCategoryHead() {
    this.appService.get('GetRepository/CategoryHeadSearch?terms').subscribe(data => {
      this.categoryHeadList = data;
    });
  }

  fngetCategoriesOnHeadId() {
    this.appService.get('GetRepository/getCategoriesOnHeadId?headId=' + this.filterCategoryHeadId).subscribe(data => {
      this.TempcategoryList = data;
    });
  }

  fnChangeCategoryHead() {
    if (this.filterCategoryHeadId == 0) {
      this.fngetCategory();
    } else {
      this.fngetCategoriesOnHeadId();
    }
  }

  onResizeColumn(event: any, index: number) {
    // this.checkResizing(event, index);
    let className = event.target.classList.value;
    this.currentResizeIndex = index;
    this.pressed = true;
    this.startX = event.pageX;
    this.startWidth = event.target.clientWidth;
    this.isResizingRight = true;
    event.preventDefault();
    this.mouseMove(index, className);
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
          this.displayedColumn[index].width = `${width}px`

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

  // rowClick(index: number, row: any) {
  //   this.selectedRowIndex = index;
  //   document.getElementById(`focusRow${index}`).focus();
  //   // this.fnBatchKeyDown(row);
  // }

  fnSelected(event, item) {
    let row = event.target['offsetParent'];
    if (row == null) {
      return
    }
    let indexTd = row.cellIndex;
    if (event.which == 37 || event.which == 39) {
      return
    }
    if (event.which == 40) {
      let nextElement = row.parentElement.nextElementSibling;
      if (nextElement != null) {
        setTimeout(() => {
          row.parentElement.nextElementSibling.children[indexTd].children[0].focus();
        });
      }
    } else if (event.which == 38) {
      let previousElement = row.parentElement.previousElementSibling;
      if (previousElement != null) {
        setTimeout(() => {
          row.parentElement.previousElementSibling.children[indexTd].children[0].focus();
        });
      }

    } else {
      this.selection.select(item);

    }
    event.preventDefault();
    event.stopPropagation();
  }
  fnToggle(event) {
    this.filterFlag = !this.filterFlag;
  }
  fnColSubmit(eve) {
    this.displayedColumn = []
    const selectedCol = eve.value;
    if (selectedCol.length < 1) {
      alert('minimum column removed ');
    }
    else {
      this.reportColumns = selectedCol;
      this.fnColumnSet(this.reportColumns)
    }
  }
  fnColumnSet(columsHeader) {
    let header = [];
    columsHeader.forEach(col => {
      this.displayedColumn.push(col)
    });
  }

  fnResetFilter() {
    this.filterCategoryId = 0; this.filterTaxId = 0; this.filterManufactureId = 0;
    this.dataRep.filteredData = this.dataRepTemp;
    this.filterFlag = false;
  }
  fnApply() {
    var data = this.dataRepTemp.slice();

    let elements = data;
    if (this.filterCategoryId == 0 && this.filterTaxId == 0 && this.filterManufactureId == 0) {
      // this.active = false;
      return
    }

    if (this.filterTaxId !== 0) {
      elements = data.filter((data) => data.TaxGroupId == this.filterTaxId);
    }
    data = elements;
    if (this.filterCategoryId !== 0) {
      elements = data.filter((data) => data.CategoryID == this.filterCategoryId);
    }
    data = elements;
    if (this.filterManufactureId !== 0) {
      elements = data.filter((data) => data.Manufacturing_Id == this.filterManufactureId);
    }
    data = elements;

    this.dataRep.filteredData = elements;
    this.filterFlag = false;
  }


  fnSave() {
    let DataSource = this.selection.selected;
    let product = [];
    for (let i = 0; i < DataSource.length; i++) {
      let productSource = {};
      productSource['ProductId'] = DataSource[i].ProductId,
        productSource['ProductName'] = DataSource[i].ProductName,
        productSource['ItemCode'] = DataSource[i].ItemCode,
        productSource['HsnCode'] = DataSource[i].HsnCode,
        productSource['HsnCodeId'] = parseFloat(DataSource[i].HsnCodeId || 0),
        productSource['CategoryId'] = parseFloat(DataSource[i].CategoryId || 0),
        productSource['PurRate'] = parseFloat(DataSource[i].PurRate || 0),
        productSource['Discount'] = parseFloat(DataSource[i].Discount || 0),
        productSource['SelRate'] = parseFloat(DataSource[i].SelRate || 0),
        productSource['MrpRate'] = parseFloat(DataSource[i].MrpRate || 0),
        productSource['Active'] = DataSource[i].Active,
        productSource['ImageData'] = DataSource[i].ImageData,
        productSource['GroupId'] = parseFloat(DataSource[i].GroupId || 0),
        productSource['ManufacturingId'] = parseFloat(DataSource[i].ManufacturingId || 0),
        productSource['TaxGroupId'] = parseFloat(DataSource[i].TaxGroupId || 0),
        productSource['ManufacturingDes'] = DataSource[i].ManufacturingDes,
        productSource['TaxName'] = DataSource[i].TaxName,
        productSource['StockCheck'] = DataSource[i].StockCheck,
        productSource['Feild2'] = DataSource[i].Feild2,
        productSource['Feild3'] = DataSource[i].Feild3,
        productSource['ImgeLoc'] = DataSource[i].ImgeLoc,
        productSource['BranchId'] = DataSource[i].BranchId
      product.push(productSource);
    }
    let body = JSON.stringify(product);
    this.appService.post('PostRepository/productCorrections', body).subscribe(data => {
      this.fnSaveImage();
      this.appService.openSnackBar('Updated Succesfully', 'Success');
    });
  }
  fnChangeFiles(files, index, item) {
    if (files.length === 0)
      return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    this.filesData = files;
    this.dataRepTemp[index].ImgeFile = this.filesData[0];
    this.dataRep = new MatTableDataSource(this.dataRepTemp);

    this.dataRepTemp[index].ImgeLoc = this.filesData[0].name;
    this.dataRep = new MatTableDataSource(this.dataRepTemp);
    this.selection.select(item);

  }

  fnRemove(index, item) {
    this.dataRepTemp[index].ImgeFile = null;
    this.dataRep = new MatTableDataSource(this.dataRepTemp);

    this.dataRepTemp[index].ImgeLoc = '';
    this.dataRep = new MatTableDataSource(this.dataRepTemp);
    this.selection.deselect(item);
  }

  fnSaveImage() {
    const formData = new FormData();
    for (var i = 0; i < this.selection.selected.length; i++) {
      if (this.selection.selected[i].ImgeFile != undefined && this.selection.selected[i].ImgeFile != '' || this.selection.selected[i].ImgeFile != null) {
        formData.append("fileUpload", this.selection.selected[i].ImgeFile, `${this.selection.selected[i].ProductId}.jpeg`);
      }
    }

    this.http.post(`${this.baseApiUrl}/ImageUpload/UploadFilesforProductCorrections`, formData)
      .subscribe(data => {
        this.selection.clear();
        this.getProduct();
      }, err => console.error(err));

  }

  getHoverImage(eve, index) {
    this.imgURL = '';
    let File = this.dataRepTemp[index].ImgeLoc;
    if (this.selection.selected.length != 0 && this.dataRepTemp[index].ImgeFile !== undefined) {
      File = this.dataRepTemp[index].ImgeFile;

      var reader = new FileReader();
      reader.readAsDataURL(File);
      reader.onload = (_event) => {
        this.imgURL = reader.result;
      }
    } else {
      this.imgURL = `https://productcodeappsimage.s3.ap-south-1.amazonaws.com/Hotel/${File}`;
    }
    this.imagePreview = true;
  }

}
