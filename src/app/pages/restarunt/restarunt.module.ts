import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { DialogPosList, PosPageComponent } from './pos-page/pos-page.component';
import { RouterModule } from '@angular/router';
import { KotListComponent } from './kot-list/kot-list.component';
import { BillListComponent, DialogBillList } from './bill-list/bill-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PosTouchComponent } from './pos-page/pos-touch/pos-touch.component';
import { MatAutocompleteTriggerAccessorDirective } from 'src/app/theme/mat-autocomplete-trigger-accessor.directive';

export const routes = [
  { path: 'pos', component: PosPageComponent  },
  { path: 'kot-list', component: KotListComponent  },
  { path: 'bill-list', component: BillListComponent  }
];

@NgModule({
  declarations: [PosPageComponent, KotListComponent,
    BillListComponent, DialogBillList, DialogPosList,
    PosTouchComponent,
    MatAutocompleteTriggerAccessorDirective],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  entryComponents:[DialogBillList,DialogPosList],
  providers: [DatePipe]
})
export class RestaruntModule { }
