import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PurchaseComponent } from './purchase/purchase.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { CorrectionComponent } from './correction/correction.component';


export const routes = [
  { path: 'purchase', component: PurchaseComponent },
  { path: 'correction', component: CorrectionComponent }
  
]
@NgModule({
  declarations: [PurchaseComponent, CorrectionComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  providers: [DatePipe]
})
export class SupplierModule { }
