import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportContentComponent } from './report-content/report-content.component';
import { DailySalesComponent } from './sales-report/daily-sales/daily-sales.component';
import { CategorySalesComponent } from './sales-report/category-sales/category-sales.component';
import { ProductSalesComponent } from './sales-report/product-sales/product-sales.component';
import { SalesmanProductwiseComponent } from './sales-report/salesman-productwise/salesman-productwise.component';
import { CompanywisesalesComponent } from './sales-report/companywisesales/companywisesales.component';
import { CustomermonthwisesalessummaryComponent } from './sales-report/customermonthwisesalessummary/customermonthwisesalessummary.component';
import { DatewisepurchaseComponent } from './purchase-report/datewisepurchase/datewisepurchase.component';
import { SupplierwisepurchasereportComponent } from './purchase-report/supplierwisepurchasereport/supplierwisepurchasereport.component';
import { CompanywisepurchaseComponent } from './purchase-report/companywisepurchase/companywisepurchase.component';
import { ProductwisepurchaseComponent } from './purchase-report/productwisepurchase/productwisepurchase.component';
import { GsttaxreportComponent } from './gsttax-report/gsttaxreport/gsttaxreport.component';
import { GstsalesreportComponent } from './gsttax-report/gstsalesreport/gstsalesreport.component';
import { StockReportsComponent } from './stock-report/stock-reports/stock-reports.component';
import { CompanywisestockComponent } from './stock-report/companywisestock/companywisestock.component';
import { RolstockComponent } from './stock-report/rolstock/rolstock.component';
import { NillstockreportComponent } from './stock-report/nillstockreport/nillstockreport.component';
import { CategorywisestockComponent } from './stock-report/categorywisestock/categorywisestock.component';
import { NonmovingitemComponent } from './stock-report/nonmovingitem/nonmovingitem.component';


export const routes = [
    { path: 'dailysales', component: DailySalesComponent },
    { path: 'categorysales', component: CategorySalesComponent },
    { path: 'productsales', component: ProductSalesComponent },
    { path: 'salesmanproductwise', component: SalesmanProductwiseComponent },
    { path: 'companywisesales', component: CompanywisesalesComponent },
    { path: 'customermonthwisesalessummary', component: CustomermonthwisesalessummaryComponent },
    { path: 'datewisepurchase', component: DatewisepurchaseComponent },
    { path: 'supplierwisepurchasereport', component: SupplierwisepurchasereportComponent },
    { path: 'companywisepurchase', component: CompanywisepurchaseComponent },
    { path: 'productwisepurchase', component: ProductwisepurchaseComponent },
    { path: 'gsttaxreport', component: GsttaxreportComponent },
    { path: 'gstsalesreport', component: GstsalesreportComponent },
    { path: 'stockreport', component: StockReportsComponent },
    { path: 'companywisestock', component: CompanywisestockComponent },
    { path: 'rolstock', component: RolstockComponent },
    { path: 'nillstockreport', component: NillstockreportComponent },
    { path: 'categorywisestock', component: CategorywisestockComponent },
    { path: 'nonmovingitem', component: NonmovingitemComponent },
];

@NgModule({
    declarations: [ReportContentComponent, DailySalesComponent, CategorySalesComponent, 
        ProductSalesComponent, SalesmanProductwiseComponent,CompanywisesalesComponent, 
        CustomermonthwisesalessummaryComponent, DatewisepurchaseComponent, SupplierwisepurchasereportComponent, CompanywisepurchaseComponent, ProductwisepurchaseComponent, GsttaxreportComponent, GstsalesreportComponent, StockReportsComponent, CompanywisestockComponent, RolstockComponent, NillstockreportComponent, CategorywisestockComponent, NonmovingitemComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [ReportContentComponent],
    entryComponents: [],
    providers: []
})

export class ReportsModule { }