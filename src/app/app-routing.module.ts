import { NgModule } from '@angular/core';
import { Routes, RouterModule, NoPreloading } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PagesComponent } from './pages/pages.component';
import { AuthGuard } from './_helpers';

const routes: Routes = [
  
  { path:'login', component: LoginComponent  },
  { path: 'print', loadChildren: () => import('./print-pages/print-pages.module').then(m => m.PrintPagesModule)},
  {
    path: '',
    component: PagesComponent, children: [
      { path: '', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
      { path: 'restarunt', loadChildren: () => import('./pages/restarunt/restarunt.module').then(m => m.RestaruntModule)},
      { path: 'master', loadChildren: () => import('./pages/master/master.module').then(m => m.MasterModule) },
      { path: 'supplier', loadChildren: () => import('./pages/supplier/supplier.module').then(m => m.SupplierModule) },
      { path: 'report', loadChildren: () => import('./pages/reports/reports.module').then(m => m.ReportsModule) },
      { path: 'booking', loadChildren: () => import('./pages/booking/bookings.module').then(m => m.BookingsModule) },
      { path: 'accounts', loadChildren: () => import('./pages/accounts/account.module').then(m => m.AccountsModule) },
      { path: 'settings', loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsModule) }, 
      
      // BookingsModule
    ],
      canActivate: [AuthGuard]
  },

  { path: '**', redirectTo: '' },
  
];
// , { preloadingStrategy: NoPreloading ,  useHash: true }
@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: NoPreloading ,  useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
