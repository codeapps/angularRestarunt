import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BranchComponent } from './branch/branch.component';
import { AreaComponent } from './area/area.component';
import { ManufactureComponent } from './manufacture/manufacture.component';
import { BackuptakenComponent } from './backuptaken/backuptaken.component';
import { CategoryComponent } from './category/category.component';
import { ProductComponent } from './product/product.component';
import { AddtableComponent } from './addtable/addtable.component';
import { TabledetailsComponent } from './tabledetails/tabledetails.component';
import { AccountHeadComponent, AccountheadDialog } from './account-head/account-head.component';
import { CategoryHeadComponent } from './category-head/category-head.component';
import { ProductCorrectionComponent } from './product-correction/product-correction.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export const routes = [
    { path: 'branch', component: BranchComponent },
    { path: 'area', component: AreaComponent },
    { path: 'manufacture', component: ManufactureComponent },
    { path: 'backuptaken', component: BackuptakenComponent },
    { path: 'category', component: CategoryComponent },
    { path: 'product', component: ProductComponent },
    { path: 'addtable', component: AddtableComponent },
    { path: 'tabeldetails', component: TabledetailsComponent },
    { path: 'accounthead', component: AccountHeadComponent },
    { path: 'categoyhead', component: CategoryHeadComponent },
    { path: 'productcorrection', component: ProductCorrectionComponent },
];

@NgModule({
    declarations: [BranchComponent, AreaComponent, ManufactureComponent, BackuptakenComponent,
        CategoryComponent, ProductComponent, AddtableComponent, TabledetailsComponent, AccountHeadComponent
        ,AccountheadDialog, CategoryHeadComponent, ProductCorrectionComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [],
    entryComponents:[AccountheadDialog, AccountHeadComponent],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
    ]
})

export class MasterModule { }
