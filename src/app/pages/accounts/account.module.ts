import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReceiptVoucherComponent } from './entry/receipt-voucher/receipt-voucher.component';
import { PaymentVoucherComponent } from './entry/payment-voucher/payment-voucher.component';
import { BankReconcilationComponent } from './entry/bank-reconcilation/bank-reconcilation.component';
import { ContraEntryComponent } from './entry/contra-entry/contra-entry.component';
import { ExpenseItemComponent } from './entry/expense-item/expense-item.component';
import { OpeningBalanceEntryComponent } from './entry/opening-balance-entry/opening-balance-entry.component';
import { DebitorsasondateComponent } from './reports/debitorsasondate/debitorsasondate.component';
import { ReportsModule } from '../reports/reports.module';
import { CreditorsasondateComponent } from './reports/creditorsasondate/creditorsasondate.component';
import { SalesmanwiseCollectionComponent } from './reports/salesmanwise-collection/salesmanwise-collection.component';
import { VouchertypeReportComponent } from './reports/vouchertype-report/vouchertype-report.component';
import { DaybookComponent } from './reports/daybook/daybook.component';
import { CashbookComponent } from './reports/cashbook/cashbook.component';
import { BankbookComponent } from './reports/bankbook/bankbook.component';
import { TrialbalanceComponent } from './reports/trialbalance/trialbalance.component';
import { ProfitandlossComponent } from './reports/profitandloss/profitandloss.component';
import { BalancesheetComponent } from './reports/balancesheet/balancesheet.component';
import { TransactionreportComponent } from './reports/transactionreport/transactionreport.component';
import { ExpenseentryreportComponent } from './reports/expenseentryreport/expenseentryreport.component';
import { TdsreportComponent } from './reports/tdsreport/tdsreport.component';
import { AdjustmentreportComponent } from './reports/adjustmentreport/adjustmentreport.component';
import { OutstandingledgercompareComponent } from './reports/outstandingledgercompare/outstandingledgercompare.component';
import { LedgerComponent, LedgerdialogueComponent } from './reports/ledger/ledger.component';
import { ExpenseEntryComponent, ExpenseDialog } from './entry/expense-entry/expense-entry.component';


export const routes = [
    { path: 'receiptvoucher', component: ReceiptVoucherComponent },
    { path: 'paymentvoucher', component: PaymentVoucherComponent },
    { path: 'bankreconcilation', component: BankReconcilationComponent },
    { path: 'contraentry', component: ContraEntryComponent },
    { path: 'expenseitem', component: ExpenseItemComponent },
    { path: 'openingbalanceentry', component: OpeningBalanceEntryComponent },
    { path: 'expenseentry', component: ExpenseEntryComponent },

    { path: 'debitorsasondate', component: DebitorsasondateComponent },
    { path: 'creditorsasondate', component: CreditorsasondateComponent },
    { path: 'salesmanwisecollection', component: SalesmanwiseCollectionComponent },
    { path: 'vouchertypereport', component: VouchertypeReportComponent },
    { path: 'daybook', component: DaybookComponent },
    { path: 'cashbook', component: CashbookComponent },
    { path: 'bankbook', component: BankbookComponent },
    { path: 'trialbalance', component: TrialbalanceComponent },
    { path: 'profitandloss', component: ProfitandlossComponent },
    { path: 'balancesheet', component: BalancesheetComponent },
    { path: 'transactionreport', component: TransactionreportComponent },
    { path: 'expenseentryreport', component: ExpenseentryreportComponent },
    { path: 'tdsreport', component: TdsreportComponent },
    { path: 'adjustmentreport', component: AdjustmentreportComponent },
    { path: 'outstandingledgercompare', component: OutstandingledgercompareComponent },
    { path: 'ledger', component: LedgerComponent },
];

@NgModule({
    declarations: [ReceiptVoucherComponent, PaymentVoucherComponent,
        BankReconcilationComponent, ContraEntryComponent, ExpenseItemComponent, OpeningBalanceEntryComponent,
        DebitorsasondateComponent, CreditorsasondateComponent, SalesmanwiseCollectionComponent, VouchertypeReportComponent,
        DaybookComponent, CashbookComponent, BankbookComponent, TrialbalanceComponent, ProfitandlossComponent, BalancesheetComponent,
        TransactionreportComponent, ExpenseentryreportComponent, TdsreportComponent, AdjustmentreportComponent,
        OutstandingledgercompareComponent,
        LedgerComponent,
        LedgerdialogueComponent,
        ExpenseEntryComponent,
        ExpenseDialog
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        ReportsModule
    ],
    exports: [],
    entryComponents: [LedgerdialogueComponent,ExpenseDialog],
    providers: []
})

export class AccountsModule { }