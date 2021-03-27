import { AppService } from './../../../../app.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-expense-entry',
  templateUrl: './expense-entry.component.html',
  styleUrls: ['./expense-entry.component.scss']
})
export class ExpenseEntryComponent implements OnInit {
  fromDate = new Date();
  toDate = new Date();
  createflag: boolean = true;
  billDate = new Date();
  invoiceDate = new Date();
  invNo: any;
  radioValue = 'ExpenseEntry';
  dBranchId: any = localStorage.getItem("SessionBranchId");
  dStaffId: any = localStorage.getItem("SessionStaffId");
  expenseEntrySource: any = [];
  searchProduct: any = '';

  expenseAutoComplete = false;
  expenseFilter: any = [];
  expenseHeader: string[] = ['Name'];
  expenseColumns: any[] = [
    { col: 'AC_Name', width: '150px' }
  ];

  prodAutoComplete = false;
  prodFilter: any = [];
  prodHeader: string[] = ['Name', 'Tax'];
  prodColumns: any[] = [
    { col: 'ExpenseItemName', width: '150px' },
    { col: 'TaxName', width: '150px' }
  ];


  public pTop: number = 0;
  public pLeft: number = 0;
  public tempProdIndex: number = 0;

  accountHeadSource: any = [];
  accountHeadAutoComplete = false;
  accHeader: string[] = ['Name', 'Address'];
  accColumn: any[] = [
    { col: 'AC_Name', width: '150px' },
    { col: 'Addr1', width: '150px' }
  ];
  AccHeadId: any;
  AccHeadName: any;
  purType = "LOCAL";
  amtBefore = 0.00;
  disPerc: any = 0;
  discAmt: any = 0.00;
  amount = 0;
  otherCharge = 0;
  totalAmount: any = 0.00;
  grandTotal: any = 0.00;
  rofVal: any = 0;
  ddRof = 'No';
  payterms = 'CASH';
  salesManId;
  salesManName = '';
  salesManList: any;

  bankAutoComplete = false;
  bankFilter: any = [];
  bankHeader: string[] = ['Name', 'Address'];
  bankColumns: any[] = [
    { col: 'AC_Name', width: '150px' },
    { col: 'Addr1', width: '150px' }
  ];
  headId: any;
  headName: any = '';
  ExpenseEntryMain_Id: any = 0;
  strTaxOnFree: any;
  searchText: any = '';
  expenseEntryList: any;
  jsonTaxData: any[];
  tempTaxData: any;
  strGlobalTaxName: string;
  strColumnDisplay: boolean;
  totQty: number;
  remarks = '';

  constructor(public _appService: AppService, public dialog: MatDialog) { }

  ngOnInit() {
    // this.fnAddRow('');
    this.fnGetSalesMan();

    setTimeout(() => {
      this.fnExpenseHeadSearch();
    }, 500);
  }

  fnAddRow(data) {
    // if (data.TableDetails_Name == "") {
    //   this._appService.openSnackBar('Please Enter Table Name...', 'Warning');
    //   return;
    // }
    let rowObj = {};
    rowObj = {
      expenseSubId: 0, productId: 0, prodName: '', Qty: 0, rate: 0, taxPerc: 0, taxAmt: 0, Amt: 0, taxid: 0, remarks: ''
    };
    this.expenseEntrySource.push(rowObj);
    setTimeout(() => {
      const maxLen = this.expenseEntrySource.length - 1;
      document.getElementById(`txtProduct${maxLen}`).focus();
    }, 200);

  }

  fnClear() {
    this.remarks = '';
    this.otherCharge = 0;
    this.invNo = '';
    this.expenseEntrySource = [];
    this.prodFilter = [];
    this.expenseFilter = [];
    this.prodAutoComplete = false;
    this.expenseAutoComplete = false;
    this.disPerc = 0.00;
    this.discAmt = 0.00;
    this.grandTotal = 0.00;
    this.ddRof = 'No';
    this.totalAmount = 0.00;
    this.rofVal = 0.00;
    this.amtBefore = 0.00;
    // this.radioValue = 'ExpenseEntry';
    if (this.radioValue == 'ExpensePurchase') {
      this.fnAddRow('');
    }

  }

  fnClearAll() {
    this.AccHeadId = '';
    this.AccHeadName = '';
    this.salesManId = '';
    this.salesManName = '';
    this.headId = '';
    this.headName = '';
    this.payterms = 'CASH';
    this.purType = 'LOCAL';
    this.fnClear();
  }

  radioValueChange() {
    this.fnClear();
    if (this.radioValue == 'ExpenseEntry') {
      this.fnExpenseHeadSearch();
    } else {
      // this.fnAddRow('');
    }

  }
  removeRow(item) {
    if (this.expenseEntrySource.length > 1) {
      let index = this.expenseEntrySource.indexOf(item);
      this.expenseEntrySource.splice(index, 1);
    }
    this.fngetFinalTotalAmount();
  }

  fnproductGets(eve, index) {
    this.tempProdIndex = index;
    const position = eve.target.getBoundingClientRect();
    this.pTop = position.top + 15;
    this.pLeft = position.left - 10;
    const keyword = eve.target.value;
    this.searchProduct = keyword;
    if (this.radioValue == 'ExpenseEntry') {
      // this.fnExpenseHeadSearch();
    } else {
      this.fnSearchProductForpurchase();
    }
  }

  fnSearchProductForpurchase() {
    if (this.searchProduct == '') {
      this.prodAutoComplete = false;
      return;
    }
    var ServiceParams = {};
    ServiceParams['strProc'] = "ExpenseItem_Gets";
    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "ExpenseItemName";
    ProcParams["strArgmt"] = this.searchProduct;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      let jsonData = JSON.parse(data);
      this.prodFilter = jsonData;
      this.prodAutoComplete = true;
    });
  }

  fnExpenseHeadSearch() {
    // if (this.searchProduct == '') {
    //   this.expenseAutoComplete = false;
    //   return;
    // }

    var ServiceParams = {};
    ServiceParams['strProc'] = "AccountHead_Search";
    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "AC_Name";
    ProcParams["strArgmt"] = '';
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "Type";
    ProcParams["strArgmt"] = "Other";
    oProcParams.push(ProcParams);


    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.dBranchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams)

    this._appService.post('CommonQuery/fnGetDataReportNewAcc', body).subscribe(data => {
      let jsonData = JSON.parse(data);
      let rowObj;
      for (var i = 0; i < jsonData.length; i++) {
        rowObj = {
          expenseSubId: 0,
          productId: jsonData[i].AC_Id,
          prodName: jsonData[i].AC_Name,
          Qty: 1,
          rate: 0,
          taxPerc: 0,
          taxAmt: 0,
          Amt: 0,
          taxid: 0
        }
        this.expenseEntrySource.push(rowObj);
      }
      this.fnTaxGets();
    });
  }

  fnExpenseChange(eve) {
    let index = this.tempProdIndex;
    this.expenseAutoComplete = false;
    this.expenseEntrySource[index].prodName = eve.AC_Name;
    this.expenseEntrySource[index].productId = eve.AC_Id;
    this.expenseEntrySource[index].Qty = 1;
    this.strTaxOnFree = 'No'
    this.expenseEntrySource[index].taxid = eve.TaxID;

  }

  fnProductChange(eve) {
    let index = this.tempProdIndex;
    this.prodAutoComplete = false;
    this.expenseEntrySource[index].prodName = eve.ExpenseItemName;
    this.expenseEntrySource[index].productId = eve.ExpenseItem_Id;
    this.expenseEntrySource[index].taxPerc = eve.TaxPercent;
    this.strTaxOnFree = 'Yes'
    this.expenseEntrySource[index].taxid = eve.TaxID;
  }

  fnAccountHeadChange(eve) {
    this.AccHeadId = eve.AC_Id;
    this.AccHeadName = eve.AC_Name;
    this.accountHeadAutoComplete = false;
  }

  fngetTotalByRate(eve, index, event) {
    let qty = eve.Qty;
    let rate = event.target.value;
    let taxperc = eve.taxPerc;
    let taxAmt = 0;
    let amount = qty * rate;
    taxAmt = (amount * taxperc) / 100;
    let totalAmnt = amount + taxAmt;
    this.expenseEntrySource[index].taxAmt = parseFloat(taxAmt.toFixed(2));
    this.expenseEntrySource[index].Amt = parseFloat(totalAmnt.toFixed(2));
    this.expenseEntrySource[index].rate = rate;

    this.fngetFinalTotalAmount();
  }
  fngetTotalByQty(eve, index, event) {
    let qty = event.target.value;
    let rate = eve.rate;
    let taxperc = eve.taxPerc;
    let taxAmt = 0;
    let amount = qty * rate;
    taxAmt = (amount * taxperc) / 100;
    let totalAmnt = amount + taxAmt;
    this.expenseEntrySource[index].taxAmt = parseFloat(taxAmt.toFixed(2));
    this.expenseEntrySource[index].Amt = parseFloat(totalAmnt.toFixed(2));
    this.expenseEntrySource[index].Qty = qty;

    this.fngetFinalTotalAmount();
  }

  fngetFinalTotalAmount() {
    let DataSource = [];
    let taxAmnt = 0;
    let tottaxAmnt = 0;
    let Amt = 0;
    let totAmt = 0;
    let DiscAmt = 0;
    let Discperc = 0;
    let grandTot = 0;
    let rof = 0;
    let Qty: number = 0;
    let totQty: number = 0;
    DataSource = this.expenseEntrySource;
    if (DataSource.length > 0) {
      for (var i = 0; i < DataSource.length; i++) {
        taxAmnt = DataSource[i].taxAmt;
        Amt = DataSource[i].Amt;
        Qty = DataSource[i].Qty;

        totAmt = totAmt + Amt;
        tottaxAmnt = tottaxAmnt + taxAmnt
        totQty = (totQty * 1) + (Qty * 1);
      }
      this.amtBefore = Amt - taxAmnt;

      if (this.disPerc > 0) {
        Discperc = this.disPerc;
        DiscAmt = (totAmt * Discperc) / 100;
      }

      totAmt = totAmt - DiscAmt;
      grandTot = totAmt;
      if (this.ddRof == 'Yes') {
        grandTot = Math.round(totAmt);
        rof = grandTot - totAmt;
      }
      this.rofVal = parseFloat(rof.toFixed(2));
      this.totalAmount = parseFloat(totAmt.toFixed(2));
      this.grandTotal = parseFloat(grandTot.toFixed(2));
      this.discAmt = parseFloat(DiscAmt.toFixed(2));
      this.totQty = totQty;
      this.fngetTotalTax();

    }
  }
  fngetTotalTax() {
    let qty = 0;
    let amt = 0
    let taxAmt = 0;
    let Amount1 = 0; let Amount2 = 0; let Amount3 = 0; let Amount4 = 0; let Amount5 = 0; let Amount6 = 0;
    let TaxAmount1 = 0; let TaxAmount2 = 0; let TaxAmount3 = 0; let TaxAmount4 = 0; let TaxAmount5 = 0; let TaxAmount6 = 0;
    let SGSTTaxAmount1 = 0; let SGSTTaxAmount2 = 0; let SGSTTaxAmount3 = 0; let SGSTTaxAmount4 = 0; let SGSTTaxAmount5 = 0; let SGSTTaxAmount6 = 0;
    let CGSTTaxAmount1 = 0; let CGSTTaxAmount2 = 0; let CGSTTaxAmount3 = 0; let CGSTTaxAmount4 = 0; let CGSTTaxAmount5 = 0; let CGSTTaxAmount6 = 0;
    let IGSTTaxAmount1 = 0; let IGSTTaxAmount2 = 0; let IGSTTaxAmount3 = 0; let IGSTTaxAmount4 = 0; let IGSTTaxAmount5 = 0; let IGSTTaxAmount6 = 0;

    for (var i = 0; this.expenseEntrySource.length; i++) {
      qty = this.expenseEntrySource[i].Qty;
      amt = this.expenseEntrySource[i].rate;
      taxAmt = this.expenseEntrySource[i].taxAmt;

      if (this.expenseEntrySource[i].taxid == 1) {
        Amount1 = Amount1 + (qty * amt);
        TaxAmount1 = TaxAmount1 + taxAmt;
        this.jsonTaxData[0].Amount = Amount1;
        this.jsonTaxData[0].TaxAmount = TaxAmount1;
        if (this.purType == 'LOCAL') {
          SGSTTaxAmount1 = (TaxAmount1 / 2);
          CGSTTaxAmount1 = (TaxAmount1 / 2);
        }
        else {
          IGSTTaxAmount1 = TaxAmount1
        }
        this.jsonTaxData[0].SGSTTaxAmount = SGSTTaxAmount1;
        this.jsonTaxData[0].CGSTTaxAmount = CGSTTaxAmount1;
        this.jsonTaxData[0].IGSTTaxAmount = IGSTTaxAmount1;
      }
      else if (this.expenseEntrySource[i].taxid == 2) {
        Amount2 = Amount2 + (qty * amt);
        TaxAmount2 = TaxAmount2 + taxAmt;
        // this.jsonTaxData[1].Amount = Amount1;
      }
      else if (this.expenseEntrySource[i].taxid == 3) {
        Amount3 = Amount3 + (qty * amt);
        TaxAmount3 = TaxAmount3 + taxAmt;
        this.jsonTaxData[1].Amount = Amount3;
        this.jsonTaxData[1].TaxAmount = TaxAmount2;
        if (this.purType == 'LOCAL') {
          SGSTTaxAmount3 = (TaxAmount3 / 2);
          CGSTTaxAmount3 = (TaxAmount3 / 2);
        }
        else {
          IGSTTaxAmount3 = TaxAmount3
        }
        this.jsonTaxData[1].SGSTTaxAmount = SGSTTaxAmount3;
        this.jsonTaxData[1].CGSTTaxAmount = CGSTTaxAmount3;
        this.jsonTaxData[1].IGSTTaxAmount = IGSTTaxAmount3;
      }
      else if (this.expenseEntrySource[i].taxid == 4) {
        Amount4 = Amount4 + (qty * amt);
        TaxAmount4 = TaxAmount4 + taxAmt;
        this.jsonTaxData[2].Amount = Amount4;
        this.jsonTaxData[2].TaxAmount = TaxAmount4;
        if (this.purType == 'LOCAL') {
          SGSTTaxAmount4 = (TaxAmount4 / 2);
          CGSTTaxAmount4 = (TaxAmount4 / 2);
        }
        else {
          IGSTTaxAmount4 = TaxAmount4;
        }
        this.jsonTaxData[2].SGSTTaxAmount = SGSTTaxAmount4;
        this.jsonTaxData[2].CGSTTaxAmount = CGSTTaxAmount4;
        this.jsonTaxData[2].IGSTTaxAmount = IGSTTaxAmount4;
      }
      else if (this.expenseEntrySource[i].taxid == 5) {
        Amount5 = Amount5 + (qty * amt);
        TaxAmount5 = TaxAmount5 + taxAmt;
        this.jsonTaxData[3].Amount = Amount5;
        this.jsonTaxData[3].TaxAmount = TaxAmount5;
        if (this.purType == 'LOCAL') {
          SGSTTaxAmount5 = (TaxAmount5 / 2);
          CGSTTaxAmount5 = (TaxAmount5 / 2);
        }
        else {
          IGSTTaxAmount5 = TaxAmount5;
        }
        this.jsonTaxData[3].SGSTTaxAmount = SGSTTaxAmount5;
        this.jsonTaxData[3].CGSTTaxAmount = CGSTTaxAmount5;
        this.jsonTaxData[3].IGSTTaxAmount = IGSTTaxAmount5;
      }
      else if (this.expenseEntrySource[i].taxid == 6) {
        Amount6 = Amount6 + (qty * amt);
        TaxAmount6 = TaxAmount6 + taxAmt;
        this.jsonTaxData[4].Amount = Amount6;
        this.jsonTaxData[4].TaxAmount = TaxAmount6;
        if (this.purType == 'LOCAL') {
          SGSTTaxAmount6 = (TaxAmount6 / 2);
          CGSTTaxAmount6 = (TaxAmount6 / 2);
        }
        else {
          IGSTTaxAmount6 = TaxAmount6;
        }
        this.jsonTaxData[4].SGSTTaxAmount = SGSTTaxAmount6;
        this.jsonTaxData[4].CGSTTaxAmount = CGSTTaxAmount6;
        this.jsonTaxData[4].IGSTTaxAmount = IGSTTaxAmount6;
      }
    }


  }

  fngetAccountHead(name) {
    if (name == '') {
      this.accountHeadAutoComplete = false;
      return;
    }
    let ServiceParams = {};
    ServiceParams['strProc'] = "AccountHead_SearchWithAddress";
    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "AC_Name";
    ProcParams["strArgmt"] = name;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.dBranchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      this.accountHeadSource = JSON.parse(data);
      this.accountHeadAutoComplete = true;
    });
  }

  fnGetSalesMan() {

    var ServiceParams = {};
    ServiceParams['strProc'] = "SalesExecutive_GetsNew";
    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "SalesExe_Name";
    ProcParams["strArgmt"] = "";
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.dBranchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      this.salesManList = JSON.parse(data);
    });
  }

  fnSearchHead(eve) {
    if (eve.target.value == '') {
      this.bankAutoComplete = false;
      return;
    }
    var ServiceParams = {};
    ServiceParams['strProc'] = "AccountHead_SearchOpeningBalance";
    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "AC_Name";
    ProcParams["strArgmt"] = eve.target.value;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.dBranchId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "CustOrSupp";
    ProcParams["strArgmt"] = 'other';
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      let jsonData = JSON.parse(data);
      this.bankFilter = jsonData;
      this.bankAutoComplete = true;
    });
  }

  fnBankChange(eve) {
    this.headId = eve.AC_Id;
    this.headName = eve.AC_Name;
    this.bankAutoComplete = false;
  }

  fnSave() {
    if (this.expenseEntrySource.length == 0) {
      this._appService.openSnackBar('Please Enter The Products Details', 'Warning');
      return;
    }
    if (this.radioValue == 'ExpenseEntry') {
      // if (this.AccHeadId == '' || this.AccHeadId == null) {
      //   this._appService.openSnackBar('Please Select Customer', 'Warning');
      //   return;
      // }
    } else {
      if (this.AccHeadId == '' || this.AccHeadId == null) {
        this._appService.openSnackBar('Please Select Supplier', 'Warning');
        return;
      }
      if (this.salesManId == '' || this.salesManId == null) {
        this._appService.openSnackBar('Please Select The SalesMan', 'Warning');
        return;
      }
    }



    var ListExpenseEntryDetailsInfo = [];
    for (var i = 0; i < this.expenseEntrySource.length; i++) {
      let ExpenseEntryDetailsInfo = {}
      ExpenseEntryDetailsInfo["ExpenseEntryMain_Id"] = this.ExpenseEntryMain_Id;
      ExpenseEntryDetailsInfo["ExpenseEntryDetails_Id"] = this.expenseEntrySource[i].expenseSubId;
      ExpenseEntryDetailsInfo["ExpenseEntryDetails_Batch"] = "";
      ExpenseEntryDetailsInfo["ExpenseEntryDetails_PurRate"] = parseFloat(this.expenseEntrySource[i].rate || 0);
      ExpenseEntryDetailsInfo["ExpenseEntryDetails_OriginalRate"] = parseFloat(this.expenseEntrySource[i].rate || 0);
      ExpenseEntryDetailsInfo["ExpenseEntryDetails_Mrp"] = parseFloat(this.expenseEntrySource[i].rate || 0);
      ExpenseEntryDetailsInfo["ExpenseEntryDetails_Qty"] = parseFloat(this.expenseEntrySource[i].Qty || 0);
      ExpenseEntryDetailsInfo["ExpenseEntryDetails_TaxPers"] = this.expenseEntrySource[i].taxPerc;
      ExpenseEntryDetailsInfo["ExpenseEntryDetails_TaxAmt"] = this.expenseEntrySource[i].taxAmt;
      ExpenseEntryDetailsInfo["ExpenseEntryDetails_PdodDis"] = parseFloat(this.disPerc || 0);
      ExpenseEntryDetailsInfo["ExpenseEntryDetails_TaxOn"] = 'SELLING RATE';
      ExpenseEntryDetailsInfo["ExpenseEntryDetails_TaxOnFree"] = this.strTaxOnFree;
      ExpenseEntryDetailsInfo["ProductId"] = this.expenseEntrySource[i].productId;
      ExpenseEntryDetailsInfo["TaxId"] = this.expenseEntrySource[i].taxid;
      ExpenseEntryDetailsInfo["ExpenseEntryDetails_Amount"] = this.expenseEntrySource[i].Amt;
      ExpenseEntryDetailsInfo["ExpenseEntryDetails_TaxAmt"] = this.expenseEntrySource[i].taxAmt;
      ExpenseEntryDetailsInfo["ExpenseEntryDetails_SelRate"] = parseFloat(this.expenseEntrySource[i].rate || 0);
      ExpenseEntryDetailsInfo["ExpenseEntryDetails_ActualRate"] = parseFloat(this.expenseEntrySource[i].rate || 0);
      ExpenseEntryDetailsInfo["ExpenseEntryDetails_AmtBeforeTax"] = this.expenseEntrySource[i].Amt - this.expenseEntrySource[i].taxAmt;
      ExpenseEntryDetailsInfo["ExpenseEntryDetails_SGSTTaxPers"] = this.expenseEntrySource[i].taxPerc / 2;
      ExpenseEntryDetailsInfo["ExpenseEntryDetails_SGSTTaxAmount"] = this.expenseEntrySource[i].taxAmt / 2;
      ExpenseEntryDetailsInfo["ExpenseEntryDetails_SGSTAmount"] = (this.expenseEntrySource[i].Amt - this.expenseEntrySource[i].taxAmt) / 2;
      ExpenseEntryDetailsInfo["ExpenseEntryDetails_CGSTTaxPers"] = this.expenseEntrySource[i].taxPerc / 2;
      ExpenseEntryDetailsInfo["ExpenseEntryDetails_CGSTTaxAmount"] = this.expenseEntrySource[i].taxAmt / 2;
      ExpenseEntryDetailsInfo["ExpenseEntryDetails_CGSTAmount"] = (this.expenseEntrySource[i].Amt - this.expenseEntrySource[i].taxAmt) / 2;
      ExpenseEntryDetailsInfo["ExpenseEntryDetails_IGSTTaxPers"] = this.expenseEntrySource[i].taxPerc;
      ExpenseEntryDetailsInfo["ExpenseEntryDetails_IGSTTaxAmount"] = this.expenseEntrySource[i].taxAmt;
      ExpenseEntryDetailsInfo["ExpenseEntryDetails_IGSTAmount"] = (this.expenseEntrySource[i].Amt - this.expenseEntrySource[i].taxAmt);
      ExpenseEntryDetailsInfo["EntryHeadId"] = this.expenseEntrySource[i].productId;
      ExpenseEntryDetailsInfo["ExpenseEntryDetails_Remarks"] = this.expenseEntrySource[i].remarks;
      ListExpenseEntryDetailsInfo.push(ExpenseEntryDetailsInfo);
    }

    var ListExpenseEntryMainInfo = [];
    let ExpenseEntryMainInfo = {};

    ExpenseEntryMainInfo["ExpenseEntryMain_Id"] = this.ExpenseEntryMain_Id;
    ExpenseEntryMainInfo["ExpenseEntryMainDate"] = this.ConvertDateAll(this.invoiceDate);
    ExpenseEntryMainInfo["ExpenseEntryMain_DisPers"] = parseFloat(this.disPerc || 0);
    ExpenseEntryMainInfo["ExpenseEntryMain_DisAmt"] = this.discAmt;
    ExpenseEntryMainInfo["AcId"] = parseFloat(this.AccHeadId||0);
    ExpenseEntryMainInfo["SalesExeId"] = parseFloat(this.salesManId||0);
    ExpenseEntryMainInfo["ExpenseEntryMain_OtherCharge"] = parseFloat(<any>this.otherCharge || 0);
    ExpenseEntryMainInfo["ExpenseEntryMain_DTotal"] = this.amtBefore;
    ExpenseEntryMainInfo["ExpenseEntryMain_ATotal"] = this.totalAmount;
    ExpenseEntryMainInfo["ExpenseEntryMain_ROF"] = this.rofVal;
    ExpenseEntryMainInfo["ExpenseEntryMain_Total"] = this.grandTotal;
    ExpenseEntryMainInfo["ExpenseEntryMain_Cancel"] = 0;
    ExpenseEntryMainInfo["ExpenseEntryMain_PayTerms"] = this.payterms;
    ExpenseEntryMainInfo["Field1"] = this.purType;
    ExpenseEntryMainInfo["Field2"] = this.ddRof;
    ExpenseEntryMainInfo["ExpenseEnterMain_InvDate"] = this.ConvertDateAll(this.invoiceDate);
    ExpenseEntryMainInfo["ExpenseEnterMain_InvNo"] = this.invNo;
    ExpenseEntryMainInfo["StaffId"] = parseFloat(this.dStaffId || 0);
    ExpenseEntryMainInfo["BranchId"] = parseFloat(this.dBranchId || 0);
    ExpenseEntryMainInfo["ExpenseEntryMain_PostAcId"] = parseFloat(this.headId||0);
    ExpenseEntryMainInfo["ExpenseEntryMain_Type"] = this.radioValue;
    ExpenseEntryMainInfo["ExpenseEntry_Remarks"] = this.remarks;
    ListExpenseEntryMainInfo.push(ExpenseEntryMainInfo);

    var ListExpenseEntryTaxInfo = [];
    for (var i = 0; i < this.expenseEntrySource.length; i++) {
      let ExpenseEntryTaxInfo = {}
      ExpenseEntryTaxInfo["TaxId"] = this.expenseEntrySource[i].taxid;
      ExpenseEntryTaxInfo["TaxAmount"] = this.expenseEntrySource[i].taxAmt;
      ExpenseEntryTaxInfo["Amount"] = this.expenseEntrySource[i].Amt;
      ExpenseEntryTaxInfo["SGSTTaxPers"] = this.expenseEntrySource[i].taxPerc / 2;
      ExpenseEntryTaxInfo["SGSTTaxAmount"] = this.expenseEntrySource[i].taxAmt / 2;
      ExpenseEntryTaxInfo["SGSTAmount"] = (this.expenseEntrySource[i].Amt - this.expenseEntrySource[i].taxAmt) / 2;
      ExpenseEntryTaxInfo["CGSTTaxPers"] = this.expenseEntrySource[i].taxPerc / 2;
      ExpenseEntryTaxInfo["CGSTTaxAmount"] = this.expenseEntrySource[i].taxAmt / 2;
      ExpenseEntryTaxInfo["CGSTAmount"] = (this.expenseEntrySource[i].Amt - this.expenseEntrySource[i].taxAmt) / 2;
      ExpenseEntryTaxInfo["IGSTTaxPers"] = this.expenseEntrySource[i].taxPerc;
      ExpenseEntryTaxInfo["IGSTTaxAmount"] = this.expenseEntrySource[i].taxAmt;
      ExpenseEntryTaxInfo["IGSTAmount"] = (this.expenseEntrySource[i].Amt - this.expenseEntrySource[i].taxAmt);
      ListExpenseEntryTaxInfo.push(ExpenseEntryTaxInfo);
    }
    var varArguements = {};

    varArguements = {
      SoftwareName: '', CustomerForSoftware: '', AddOrMinus: 'Add',
      MrpIncluesiveSales: 'Yes', TaxIncluded: 'Yes', Rof: this.ddRof, PackCal: ''
    };

    ExpenseEntryMainInfo['ListExpenseEntryDetailsInfo'] = ListExpenseEntryDetailsInfo;
    ExpenseEntryMainInfo['ListExpenseEntryTaxInfo'] = ListExpenseEntryTaxInfo;
    var DictionaryObject = {};
    DictionaryObject["dictArgmts"] = varArguements;
    ExpenseEntryMainInfo['DictionaryObject'] = DictionaryObject;

    let body = JSON.stringify(ExpenseEntryMainInfo);
    this._appService.post('Accounts/fnSaveExpenseEntry', body).subscribe(data => {
      this._appService.openSnackBar('Saved Successfully', 'Success');
      this.fnClearAll();
      this.fnBack();
    });
  }

  ConvertDateAll(format) {
    let date = ("0" + format.getDate()).slice(-2);
    let month = ("0" + (format.getMonth() + 1)).slice(-2);
    let year = format.getFullYear();
    const dateconvert = year + '-' + month + '-' + date;
    return dateconvert;
  }
  fnBack() {
    this.createflag = false;
    this.fngetExpenseList();
    this.fnClearAll();
  }

  fngetExpenseList() {
    var ServiceParams = {};
    ServiceParams['strProc'] = "ExpenseEntry_Gets";
    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "ExpenseEntry_FromDate";
    ProcParams["strArgmt"] = this.ConvertDateAll(this.fromDate);
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "ExpenseEntry_ToDate";
    ProcParams["strArgmt"] = this.ConvertDateAll(this.toDate);
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "ExpenseEntryMain_VoucherNo";
    ProcParams["strArgmt"] = this.searchText;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.dBranchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReport', body).subscribe(data => {
      this.expenseEntryList = JSON.parse(data);
    });

  }
  create() {
    this.createflag = true;
    this.fnGetSalesMan();

    setTimeout(() => {
      this.fnExpenseHeadSearch();
    }, 500);
  }
  fnAnchorClick(data) {
    this.expenseEntrySource = [];

    this.createflag = true;
    var ServiceParams = {};
    ServiceParams['strProc'] = "ExpenseEntry_CopyBillNo";
    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "ExpenseEntryMain_Id";
    ProcParams["strArgmt"] = data.ExpenseEntryMain_Id.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.dBranchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    var JsonExpenseEntryDetailsInfo: any = "";
    var JsonExpenseEntryTaxInfo: any = "";
    var JsonExpenseEntryInfo: any = "";

    this._appService.post('CommonQuery/fnGetDataReportReturnMultiTable', body).subscribe(data => {
      let jsonData = JSON.parse(data);

      JsonExpenseEntryInfo = JSON.parse(jsonData[0]);
      JsonExpenseEntryDetailsInfo = JSON.parse(jsonData[1]);
      JsonExpenseEntryTaxInfo = JSON.parse(jsonData[2]);

      this.ExpenseEntryMain_Id = JsonExpenseEntryInfo[0].ExpenseEntryMain_Id;
      this.billDate = new Date(JsonExpenseEntryInfo[0].ExpenseEntryMainDate);
      this.invNo = JsonExpenseEntryInfo[0].ExpenseEnterMain_InvNo;
      this.ddRof = JsonExpenseEntryInfo[0].Field2;
      this.headName = JsonExpenseEntryInfo[0].PostHeadName;
      this.headId = JsonExpenseEntryInfo[0].ExpenseEntryMain_PostAcId;
      this.invoiceDate = new Date(JsonExpenseEntryInfo[0].ExpenseEnterMain_InvDate)
      this.AccHeadId = JsonExpenseEntryInfo[0].AcId;
      this.AccHeadName = JsonExpenseEntryInfo[0].AC_Name;
      this.grandTotal = parseFloat(JsonExpenseEntryInfo[0].ExpenseEntryMain_ATotal).toFixed(2);
      this.rofVal = parseFloat(JsonExpenseEntryInfo[0].ExpenseEntryMain_ROF).toFixed(2);
      this.totalAmount = parseFloat(JsonExpenseEntryInfo[0].ExpenseEntryMain_Total).toFixed(2);
      this.discAmt = parseFloat(JsonExpenseEntryInfo[0].ExpenseEntryMain_DisAmt).toFixed(2);
      this.disPerc = parseFloat(JsonExpenseEntryInfo[0].ExpenseEntryMain_DisPers).toFixed(2);
      this.payterms = JsonExpenseEntryInfo[0].ExpenseEntryMain_PayTerms;
      this.remarks = JsonExpenseEntryInfo[0].ExpenseEntryRemarks;

      for (var i = 0; i < JsonExpenseEntryDetailsInfo.length; i++) {
        let prodName = "";
        let prodId = "";
        if (this.radioValue == 'ExpenseEntry') {
          prodName = JsonExpenseEntryDetailsInfo[i].AC_Name
          prodId = JsonExpenseEntryDetailsInfo[i].AC_Id
        } else {
          prodName = JsonExpenseEntryDetailsInfo[i].ExpenseItemName
          prodId = JsonExpenseEntryDetailsInfo[i].ExpenseItem_Id
        }
        let rowObj = {};
        rowObj = {
          expenseSubId: JsonExpenseEntryDetailsInfo[i].ExpenseEntryDetails_Id,

          productId: prodId, prodName: prodName,
          Qty: JsonExpenseEntryDetailsInfo[i].ExpenseEntryDetails_Qty,
          rate: JsonExpenseEntryDetailsInfo[i].ExpenseEntryDetails_SelRate,
          taxPerc: JsonExpenseEntryDetailsInfo[i].ExpenseEntryDetails_TaxPers,
          taxAmt: JsonExpenseEntryDetailsInfo[i].ExpenseEntryDetails_TaxAmt,
          Amt: JsonExpenseEntryDetailsInfo[i].ExpenseEntryDetails_Amount,
          taxid: JsonExpenseEntryDetailsInfo[i].TaxId,
          remarks: JsonExpenseEntryDetailsInfo[i].ExpenseEntryDetails_Remarks
        };
        this.expenseEntrySource.push(rowObj);
      }
    });
    this.fngetTotalTax();
  }

  async fnTaxGets() {
    this.jsonTaxData = [];
    this.strColumnDisplay = false;
    let ServiceParams = {};
    ServiceParams['strProc'] = 'Tax_Gets';
    await this._appService.post('CommonQuery/fnGetDataReportNew', ServiceParams)
      .toPromise().then(data => {
        this.tempTaxData = JSON.parse(data);

        if (this.strGlobalTaxName != 'GST') {
          this.strColumnDisplay = true;
        }
      }).finally(() => {
        this.fnHideTaxGroup();

      }).catch((reason) => console.error(reason));
  }

  async fnHideTaxGroup() {
    let itemDataTax = [];
    let ServiceParams = { strProc: '' };
    ServiceParams.strProc = "Tax_Gets";
    await this._appService.post('CommonQuery/fnGetDataReportNewAcc', ServiceParams)
      .toPromise().then(data => {
        let jsonData = JSON.parse(data);

        jsonData.forEach(element => {
          for (const item of this.tempTaxData) {
            if (element.Active != 1 && element.TaxID == item.TaxID) {
              const index = this.tempTaxData.indexOf(item);
              itemDataTax = this.tempTaxData.splice(index, 1);
            } else {
              itemDataTax = this.tempTaxData;
            }
          }
        });


      }).finally(() => {

        itemDataTax.forEach(data => {
          let ReceiptTaxInfo = {}
          ReceiptTaxInfo["TaxId"] = parseFloat(data.TaxID || 0);
          ReceiptTaxInfo["TaxPercent"] = parseFloat(data.TaxPercent || 0);
          ReceiptTaxInfo["TaxAmount"] = 0;
          ReceiptTaxInfo["Amount"] = 0;
          ReceiptTaxInfo["SGSTTaxPers"] = parseFloat(data.SGSTTaxPers || 0);
          ReceiptTaxInfo["SGSTAmount"] = 0;
          ReceiptTaxInfo["SGSTTaxAmount"] = 0;
          ReceiptTaxInfo["CGSTTaxPers"] = parseFloat(data.CGSTTaxPers || 0);
          ReceiptTaxInfo["CGSTAmount"] = 0;
          ReceiptTaxInfo["CGSTTaxAmount"] = 0;
          ReceiptTaxInfo["IGSTTaxPers"] = parseFloat(data.IGSTTaxPers || 0);
          ReceiptTaxInfo["IGSTAmount"] = 0;
          ReceiptTaxInfo["IGSTTaxAmount"] = 0;
          ReceiptTaxInfo["CessAmt"] = 0;
          ReceiptTaxInfo["AdditionalCessAmt"] = 0;
          this.jsonTaxData.push(ReceiptTaxInfo);
          // RTax=TaxPercent RAmount RVatAmount
        });
        // this.fnBillSeries_Gets();
      });
  }
  openDialog(items, index): void {
    const dialogRef = this.dialog.open(ExpenseDialog,
      {
        width: '340px',
        hasBackdrop: true,
        data: items,
        disableClose: false
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      this.expenseEntrySource[index].remarks = result;
    });
  }
}



@Component({
  selector: 'expense-dialog',
  templateUrl: 'expense-dialog.html',
  styleUrls: ['./expense-entry.component.scss']
})

export class ExpenseDialog {
  Remarks: any;
  constructor(public dialogRef: MatDialogRef<ExpenseDialog>, @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
    this.Remarks = this.data.remarks
  }
  fnClose() {
    this.dialogRef.close(this.Remarks);
  }
  save() {
    if (this.Remarks == null || this.Remarks == undefined || this.Remarks == '') {
      alert("Please Enter Remarks...");
      return;
    }
    this.dialogRef.close(this.Remarks);
  }
}
