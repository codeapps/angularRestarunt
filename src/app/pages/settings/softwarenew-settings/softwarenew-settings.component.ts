import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-softwarenew-settings',
  templateUrl: './softwarenew-settings.component.html',
  styleUrls: ['./softwarenew-settings.component.scss']
})
export class SoftwarenewSettingsComponent implements OnInit {
  SalesInInclusive = 'No';
  salesROF = 'No';
  reportPrintType = 'LinePrint';
  ExpiryPrintType = 'LinePrint';
  KotPrintType = 'LinePrint';
  RedierectToLogin = 'No';
  ProductsAllowed = 'No';
  AccountHeadAllowed = 'No';
  branch: any;
  AccountHeadGets: any;
  BranchId: any;


  constructor(public _appService: AppService) { }

  ngOnInit() {
    this.fngetSettings();
  }

  fnSaveGeneralSettings() {

    let ListSettingsInfo = [];
    let SettingsInfo = {};
    SettingsInfo["KeyValue"] = "SRof";
    SettingsInfo["Value"] = this.salesROF;
    ListSettingsInfo.push(SettingsInfo)

    SettingsInfo = {};
    SettingsInfo["KeyValue"] = "MrpInclusiveSales";
    SettingsInfo["Value"] = this.SalesInInclusive;
    ListSettingsInfo.push(SettingsInfo)

    SettingsInfo = {};
    SettingsInfo["KeyValue"] = "ReportPrintType";
    SettingsInfo["Value"] = this.reportPrintType;
    ListSettingsInfo.push(SettingsInfo)

    SettingsInfo = {};
    SettingsInfo["KeyValue"] = "ExpiryPrintType";
    SettingsInfo["Value"] = this.ExpiryPrintType;
    ListSettingsInfo.push(SettingsInfo)

    SettingsInfo = {};
    SettingsInfo["KeyValue"] = "RedierectToHome";
    SettingsInfo["Value"] = this.RedierectToLogin;
    ListSettingsInfo.push(SettingsInfo)

    SettingsInfo = {};
    SettingsInfo["KeyValue"] = "ProductsAllowed";
    SettingsInfo["Value"] = this.ProductsAllowed;
    ListSettingsInfo.push(SettingsInfo)

    SettingsInfo = {};
    SettingsInfo["KeyValue"] = "AccountHeadAllowed";
    SettingsInfo["Value"] = this.AccountHeadAllowed;
    ListSettingsInfo.push(SettingsInfo)

    SettingsInfo = {};
    SettingsInfo["KeyValue"] = "KotPrintType";
    SettingsInfo["Value"] = this.KotPrintType;

    ListSettingsInfo.push(SettingsInfo)
    let body = JSON.stringify(ListSettingsInfo);
    this._appService.post('Master/fnSaveGeneral', body).toPromise()
      .then(data => {
        alert("Update Successfully");
        this.fngetSettings();
      }, error => console.error(error));
  }

  fngetSettings() {
    var VarArguments = { 'ProcName': "Settings_Gets" };
    let body = JSON.stringify(VarArguments);
    var headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8');
    this._appService.post('Master/fnGetSettings', body)
      .subscribe(data => {
        var result = data;
        for (var i = 0; i < result.length; i++) {
          if (result[i].KeyValue == "MRPINCLUSIVESALES") {
            if (result[i].Value == 'Yes') {
              this.SalesInInclusive = 'Yes'
            }
            else { this.SalesInInclusive = 'No' }
          }

          if (result[i].KeyValue == "SRof") {
            if (result[i].Value == 'Yes') {
              this.salesROF = 'Yes'
            }
            else { this.salesROF = 'No' }
          }
          if (result[i].KeyValue == "ReportPrintType") {
            if (result[i].Value == 'LinePrint') {
              this.reportPrintType = 'LinePrint'
            }
            else { this.reportPrintType = 'Laser' }
          }
          if (result[i].KeyValue == "KotPrintType") {
            if (result[i].Value == 'LinePrint') {
              this.KotPrintType = 'LinePrint'
            }
            else { this.KotPrintType = 'Laser' }
          }
          if (result[i].KeyValue == "ExpiryPrintType") {
            if (result[i].Value == 'LinePrint') {
              this.reportPrintType = 'LinePrint'
            }
            else { this.reportPrintType = 'Laser' }
          }

          if (result[i].KeyValue == "RedierectToHome") {
            if (result[i].Value == 'Yes') {
              this.RedierectToLogin = 'Yes'
            }
            else {
              this.RedierectToLogin = 'No'
            }
          }
          if (result[i].KeyValue == "ProductsAllowed") {
            if (result[i].Value == 'Yes') {
              this.ProductsAllowed = 'Yes'
            }
            else {
              this.ProductsAllowed = 'No'
            }
          }
          if (result[i].KeyValue == "AccountHeadAllowed") {
            if (result[i].Value == 'Yes') {
              this.AccountHeadAllowed = 'Yes'
            }
            else {
              this.AccountHeadAllowed = 'No'
            }
          }
        }
      }, error => console.error(error));
    this.getBranch();
  }
  getBranch() {
    this._appService.get('GetRepository/branchGet')
      .subscribe(result => {
        this.branch = result;
        this.BranchId = result[0].BranchId;
        this.fnChangeBranches(result[0].BranchId);
      }, error => console.error(error));

  }
  fnChangeBranches(eve) {

    let branchId = eve;
    if (branchId == 0 || branchId == null || branchId == undefined) {
      alert("Please Select Branch...");
      return;
    }
    let varArguements = {};
    varArguements = { BranchId: branchId };

    let DictionaryObject = {};
    DictionaryObject['dictArgmts'] = varArguements;
    DictionaryObject['ProcName'] = 'accountGetWithBranchId'   
    let body = JSON.stringify(DictionaryObject);
    this._appService.post('Master/Customer_GetforEshopForPassword', body).subscribe(
      data => {
        let DataObj = data;
        this.AccountHeadGets = DataObj;       
      })
  }
  removeRow(eve) {

    if (!confirm('If You Delete The Selecting Branch You Will Lose All Of Your Related Records '
      + 'Please Be sure You Want To Delete?...')) {
      return;
    }
    var ServiceParams = {};
    ServiceParams['strProc'] = 'deleteAllDataWithBranchId';
    ServiceParams['JsonFileName'] = 'JsonArrayScriptOne';

    var oProcParams = [];
    var ProcParams = {};
    ProcParams['strKey'] = '@ParamsBranchId';
    ProcParams['strArgmt'] = eve.BranchId.toString();
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);
    this._appService.post('CommonQuery/fnGetDataReportFromScriptJsonFile', body).subscribe(
      result => {
        alert("Deleted Successfully...")
        this.getBranch();
      }, error => console.error(error));
  }
}
