import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PerfectScrollbarConfig, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-pos-touch',
  templateUrl: './pos-touch.component.html',
  styleUrls: ['./pos-touch.component.scss']
})
export class PosTouchComponent implements OnInit {
  @Input('folder') public imgFolder;
  @Output() valueChanges: EventEmitter<any> = new EventEmitter();
  categoryHeadList: Object;
  tempCategoryID = null;
  tempCategoryHeadID = null;
  productsArray: any = [];
  category: any = [];
  dBranchId: any = localStorage.getItem('SessionBranchId');
  scrollconfig: PerfectScrollbarConfigInterface = {
    useBothWheelAxes: true,
    suppressScrollX: false,
    suppressScrollY: false
  }
  cateLoading: boolean;
  prodloading: boolean;
  constructor(private appservice: AppService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.fngetAllCategoryHead();
  }

  fngetAllCategoryHead() {
    this.categoryHeadList = [];
    this.category = [];
    this.appservice.get('GetRepository/CategoryHeadSearch?terms=' + '')
      .subscribe(data => {
        const consider: any = data;



        this.categoryHeadList = consider;

      });
  }

  fnCategoryView(id) {
    this.cateLoading = true;
    this.productsArray = [];
    this.tempCategoryHeadID = id;
    this.appservice.get('GetRepository/getCategoriesOnHeadId?headId=' + id)
      .subscribe(data => {
        const consider: any = data;
        let count = consider.length / 12;
        let arrayPut = [];
        let i: number = 0;
        let sumindex = 12;
        do {
          let startCount = i * 12;
          let setArray = consider.slice(startCount, sumindex);
          arrayPut.push(setArray);
          sumindex += 12;
          i++;
        } while (i < count);


        this.category = arrayPut;
        this.cateLoading = false;
        if (consider.length > 0) {
          this.fnProductView(this.category[0][0].CategoryId);
        } else {
          // alert("Products Not Availables");
          this.openSnackBar("Products Not Availables", 'sorry!')
        }

      },err => this.cateLoading = false)
  }


  fnProductView(id) {
    this.prodloading = true;
    this.tempCategoryID = id;
    this.appservice.get('GetRepository/Product_GetOnCategoryId?dCategoryId=' + id + '&branchId=' + this.dBranchId)
      .subscribe(data => {

        const consider: any = data;
        let count = consider.length / 20;
        let arrayPut = [];
        let i: number = 0;
        let sumindex = 20;
        do {
          let startCount = i * 20;
          let setArray = consider.slice(startCount, sumindex);
          arrayPut.push(setArray);
          sumindex += 20;
          i++;
        } while (i < count);

        this.prodloading = false;
        this.productsArray = arrayPut;

      }, err => this.prodloading = false)
  }

  public getBgImage(index, idx) {
    let bgImage = {};
    if (!this.productsArray[index][idx].ImgeLoc) {
      bgImage = { 'background-image': 'url("https://slickpos.com/wp-content/uploads/2019/05/sree-sampoorna.png")' };

    } else {
      bgImage = {
        'background-image': index != null ? `url(https://s3.ap-south-1.amazonaws.com/productcodeappsimage/${this.imgFolder}/${this.productsArray[index][idx].ImgeLoc})` : 'url(https://via.placeholder.com/600x400/ff0000/fff/)'
      };
    }
    return bgImage;
  }

  getProductDetails(id) {
    this.valueChanges.emit(id)
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      verticalPosition:'top'
    });
  }
}
