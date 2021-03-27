import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintoutComponent } from './printout/printout.component';
import { KotPrintoutComponent } from './kot-printout/kot-printout.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

const route = [
  { path: 'printout', component: PrintoutComponent  },
  { path: 'kot-printout', component: KotPrintoutComponent  }
]

@NgModule({
  declarations: [PrintoutComponent, KotPrintoutComponent],
  
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(route)
  ]
})
export class PrintPagesModule { }
