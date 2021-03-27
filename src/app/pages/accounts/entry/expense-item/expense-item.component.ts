import { AppService } from 'src/app/app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-expense-item',
  templateUrl: './expense-item.component.html',
  styleUrls: ['./expense-item.component.scss']
})
export class ExpenseItemComponent implements OnInit {
  taxList: any;
  searchText: any;
  expenseItemList: any;
  createFlag: boolean = true;
  expenseItemSource = {
    expenseItemId: 0, expenseItemName: '', expenseItemTaxId: '', expenseItemHsnCode: '', expenseItemCode: ''
  }



  constructor(public _appService: AppService) { }

  ngOnInit() {
    this.fnExpenseItemGets();
    this.fnGetTaxGroups();
  }

  fnCreate() {
    this.createFlag = false;
  }
  fnGetTaxGroups() {
    var dictArgmts = { ProcName: 'TaxGroup_Gets' };
    let body = JSON.stringify(dictArgmts)
    this._appService.post('Master/TaxGroup_Gets', body).subscribe(data => {
      this.taxList = data;
    });
  }

  fnExpenseItemGets() {
    var ServiceParams = {};
    ServiceParams['strProc'] = "ExpenseItem_Gets";
    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "ExpenseItemName";
    ProcParams["strArgmt"] = this.searchText;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReport', body).subscribe(data => {
      this.expenseItemList = JSON.parse(data);
    });
  }

  fnSave() {
    if (this.expenseItemSource.expenseItemName == '' || this.expenseItemSource.expenseItemName == null) {
      this._appService.openSnackBar('Please Enter The Item Name', 'Warning');
      return;
    }
    if (this.expenseItemSource.expenseItemTaxId == '' || this.expenseItemSource.expenseItemTaxId == null) {
      this._appService.openSnackBar('Please Select The Tax Percentage', 'Warning');
      return;
    }

    var ServiceParams = {};
    ServiceParams['strProc'] = "ExpenseItem_InsertOrUpdate";
    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "ExpenseItem_Id";
    ProcParams["strArgmt"] = this.expenseItemSource.expenseItemId.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "HsnCode";
    ProcParams["strArgmt"] = this.expenseItemSource.expenseItemHsnCode;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "ExpenseItemCode";
    ProcParams["strArgmt"] = this.expenseItemSource.expenseItemCode;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "ExpenseItemName";
    ProcParams["strArgmt"] = this.expenseItemSource.expenseItemName;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "bActive";
    ProcParams["strArgmt"] = '1';
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "TaxGroupId";
    ProcParams["strArgmt"] = this.expenseItemSource.expenseItemTaxId.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "CategoryId";
    ProcParams["strArgmt"] = '0';
    oProcParams.push(ProcParams)

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);
    this._appService.post('CommonQuery/fnGetDataReportNewAcc', body).subscribe(data => {
      this._appService.openSnackBar('Saved Successfully', 'Success');
      this.fnBack();
    });
  }

  fnClear() {
    this.expenseItemSource = {
      expenseItemId: 0, expenseItemName: '', expenseItemTaxId: '', expenseItemHsnCode: '', expenseItemCode: ''
    }
  }
  fnBack() {
    this.fnExpenseItemGets();
    this.createFlag = true;
    this.fnClear();
  }

  fnAnchorClick(data) {
    this.createFlag = false;
    this.expenseItemSource = {
      expenseItemId: data.ExpenseItem_Id,
      expenseItemName: data.ExpenseItemName,
      expenseItemTaxId: data.TaxGroupId,
      expenseItemHsnCode: data.HsnCode,
      expenseItemCode: data.ExpenseItemCode
    }
  }
}
