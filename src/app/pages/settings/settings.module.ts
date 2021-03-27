import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SoftwarenewSettingsComponent } from './softwarenew-settings/softwarenew-settings.component';
import { CodeappsmenuSettingsComponent } from './codeappsmenu-settings/codeappsmenu-settings.component';
import { MastermenuSettingsComponent } from './mastermenu-settings/mastermenu-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';

export const routes = [
    { path: 'mastersettings', component: MastermenuSettingsComponent },
    { path: 'codemenusettings', component: CodeappsmenuSettingsComponent },
    { path: 'softwaresettings', component: SoftwarenewSettingsComponent }
];

@NgModule({
    declarations: [
        MastermenuSettingsComponent,
        CodeappsmenuSettingsComponent,
        SoftwarenewSettingsComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        TreeViewModule
    ],
    exports: []
})
export class SettingsModule { }