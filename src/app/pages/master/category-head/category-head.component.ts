import { AppService } from 'src/app/app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-category-head',
  templateUrl: './category-head.component.html',
  styleUrls: ['./category-head.component.scss']
})
export class CategoryHeadComponent implements OnInit {
  searchText: any = '';
  categoryHeadList: Object;
  createFlag: boolean = true;

  categoryheadSource = {
    CategoryHeadId: 0, CategoryHeadName: '', CategoryHeadDescription: '', CategoryHeadField1: '', CategoryHeadType: 0, ProductTypeId: 0
  }


  constructor(public appService: AppService) { }

  ngOnInit() {
    this.fngetAllCategoryHead();
  }

  fngetAllCategoryHead() {
    this.appService.get('GetRepository/CategoryHeadSearch?terms=' + this.searchText).subscribe(data => {
      this.categoryHeadList = data;
    });
  }

  fnCreate() {
    this.createFlag = false;
  }
  fnBack() {
    this.fngetAllCategoryHead();
    this.createFlag = true;
    this.fnClear();
  }
  fnClear() {
    this.categoryheadSource = {
      CategoryHeadId: 0, CategoryHeadName: '', CategoryHeadDescription: '', CategoryHeadField1: '', CategoryHeadType: 0, ProductTypeId: 0
    }
  }

  fnSaveandUpdate() {
    if (this.categoryheadSource.CategoryHeadName == '' || this.categoryheadSource.CategoryHeadName == null) {
      this.appService.openSnackBar("Please Enter The Categoryhead Name", "Warning");
      return;
    }   
      let body = JSON.stringify(this.categoryheadSource);
      this.appService.post('PostRepository/postCategoryHead', body).subscribe(data => {
        this.appService.openSnackBar('Saved Successfully', 'Success');
        this.fnBack();
      });    
  }

  fnAnchorClick(data) {
    this.createFlag = false;
    this.categoryheadSource = {
      CategoryHeadId: data.CategoryHeadId,
      CategoryHeadName: data.CategoryHeadName,
      CategoryHeadDescription: data.CategoryHeadDescription,
      CategoryHeadField1: data.CategoryHeadField1,
      CategoryHeadType: data.CategoryHeadType,
      ProductTypeId: data.ProductTypeId
    }

  }
}
