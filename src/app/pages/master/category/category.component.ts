import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { CategoryService } from './category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  createFlag: boolean = true;
  searchText = '';
  categoryList: any;
  categorySource = {
    CategoryId: 0, CategoryName: '', CategoryTypeId: 1, CategoryType: 1, CategoryHeadId: 0
  };
  categoryHeadList: Object;
  constructor(public _appService: AppService, public _categoryService: CategoryService) { }

  ngOnInit() {
    this.fnGetCategory();
  }

  fnGetCategory() {
    this._categoryService.fngetCategory(this.searchText).subscribe(data => {
      this.categoryList = data;
      this.fngetCategoryHead();
    });
  }

  fngetCategoryHead() {
    this._appService.get('GetRepository/CategoryHeadSearch?terms').subscribe(data => {
      this.categoryHeadList = data;
    })
  }
  fnCreate() {
    this.createFlag = false;
  }

  fnsearchText(eve) {
    this.searchText = eve.target.value;
    this.fnGetCategory();
  }

  fnAnchorClick(eve) {
    this.createFlag = false;
    this.categorySource = {
      CategoryId: eve.CategoryId, CategoryName: eve.CategoryName, CategoryTypeId: eve.CategoryTypeId,
      CategoryType: eve.CategoryType, CategoryHeadId: eve.CategoryHeadId
    };
  }

  fnSave() {
    if (this.categorySource.CategoryName == '' || this.categorySource.CategoryName == null) {
      this._appService.openSnackBar('Please Enter The Category', 'Warning');
      return;
    }

      let body = JSON.stringify(this.categorySource);
      this._appService.post('PostRepository/PostCategory', body).subscribe(data => {
        this._appService.openSnackBar('Saved Successfully', 'Success');
        this.fnBackToList();
      });
  }

  fnClear() {
    this.searchText = '';
    this.categorySource = {
      CategoryId: 0, CategoryName: '', CategoryTypeId: 1, CategoryType: 1, CategoryHeadId: 0
    };
  }
  fnBackToList() {
    this.createFlag = true;
    this.fnClear();
    this.fnGetCategory();
  }
}
