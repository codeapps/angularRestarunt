import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from "@angular/flex-layout";

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule, DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import {MatCardModule} from '@angular/material/card';
import { ScodeautocompleteModule } from './scodeautocomplete/scodeautocomplete.module';
import { PopAutocompleteModule } from './pop-autocomplete/pop-autocomplete.module';
import { CalculatorComponent } from './calculator/calculator.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

const mat = [
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatToolbarModule,
  MatSnackBarModule,
  MatExpansionModule,
  MatListModule,
  MatBadgeModule,
  MatCheckboxModule,
  MatRippleModule,
  MatInputModule,
  MatFormFieldModule,
  MatSelectModule,
  MatAutocompleteModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatButtonToggleModule,
  MatDatepickerModule,
  MatRadioModule,
  MatTooltipModule,
  MatTableModule,
  MatProgressBarModule,
  MatTabsModule,
  MatNativeDateModule,
  MatCardModule
];
@NgModule({
  declarations: [CalculatorComponent],
  entryComponents: [CalculatorComponent],
  imports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    PerfectScrollbarModule,
    mat,
    FormsModule,
    ReactiveFormsModule,
    VirtualScrollerModule,
    ScodeautocompleteModule,
    PopAutocompleteModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    FlexLayoutModule,
    mat,
    PerfectScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    VirtualScrollerModule,
    ScodeautocompleteModule,
    PopAutocompleteModule
    // MatFormField
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    MatNativeDateModule,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class SharedModule { }
