import { AppService } from './../../../../app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-receipt-voucher',
  templateUrl: './receipt-voucher.component.html',
  styleUrls: ['./receipt-voucher.component.scss']
})
export class ReceiptVoucherComponent implements OnInit {
  createFlag: boolean = true;
  selectAreaFlag: boolean = false;
  receiptTypeFlag: boolean = false;
  bankFilterFlag: boolean = false;
  colBankHeader = [{ col: 'BankName', width: '150px' }];
  BankHeader = ['Bank Name'];
  colTypeHeader = [{ col: 'Type', width: '150px' }, { col: 'Amount', width: '150px' }];
  recieptTypeHeader = ['Type', 'Amount'];
  filteredOptions: any[];
  colAreaHeader = [{ col: 'AC_Name', width: '230px' }, { col: 'Addr1', width: '230px' }];
  areaHeader = ['AccountHead Name', 'Address']
  options: any;
  fromDate = new Date();
  toDate = new Date();
  searchText: any = '';
  radioValue = 'CASH';
  typeOfDate = 'EnterDate';
  dBranchId: any = localStorage.getItem("SessionBranchId");
  dStaffId: any = localStorage.getItem("SessionStaffId");
  salesManList: any;
  recieptSource = {
    voucherId: 0, voucherNo: '', balanceAmount: 0, recieptType: 'CASH', accountHeadId: '', selectBank: '', address: '',
    voucherDate: new Date(), outStanding: '', AdjuRetAmtPending: '', salesManId: '', recievedAmt: 0, remarks: '',
    voucherAmount: 0
  };
  bankSource = {
    bankId: '', bankName: '', chequeNo: '', chequeDate: new Date(), transferType: ''
  };
  AcName: any;
  tempAccountHeadsList: any;
  voucherList: any;
  voucherNo: any;

  constructor(public _appService: AppService) { }

  ngOnInit() {
    this.fnVoucherGets();
  }

  fnNextVoucherNo() {
    let value;
    if (this.recieptSource.recieptType == 'BANK') {
      value = 3;
      this.recieptSource.selectBank = ''
    } else {
      value = 1;
      this.recieptSource.selectBank = 'CASH ACCOUNTS'
    }

    var ServiceParams = {};
    ServiceParams['strProc'] = "VoucherPrefix_GetVoucherNoOnVoucherId";
    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "Value";
    ProcParams["strArgmt"] = value.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.dBranchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      let jsonData = JSON.parse(data);
      // this.recieptSource.voucherNo = jsonData[0].VoucherNo;
      this.voucherNo = jsonData[0].VoucherNo;
    });
  }

  fngetSalesMan() {
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
    this._appService.post('CommonQuery/fnGetDataReportNewAcc', body).subscribe(data => {
      this.salesManList = JSON.parse(data);
      this.fnSearchAccounthead();
    });

  }

  fnSearchAccounthead() {
    var ServiceParams = {};
    ServiceParams['strProc'] = "AccountHead_SearchForAccountReceipt";
    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "AC_Name";
    ProcParams["strArgmt"] = '';
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.dBranchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportNewAcc', body).subscribe(data => {
      let jsonData = JSON.parse(data);
      this.tempAccountHeadsList = jsonData;
    })
  }

  fnFilterAccountHead(eve) {
    if (!eve) {
      this.selectAreaFlag = false;
      this.recieptSource.accountHeadId = '';
      return;
    }
    const filterValue = eve.toLowerCase();
    const data = this.tempAccountHeadsList.filter(res => res.AC_Name.toLowerCase().indexOf(filterValue) === 0);
    if (data.length > 0) {
      this.selectAreaFlag = true;
      this.filteredOptions = data;
    } else {
      this.selectAreaFlag = true;
      this.filteredOptions = [];
    }
    this.options = data;
  }

  fnRecieptChange(eve) {
    this.AcName = eve.AC_Name;
    this.recieptSource.accountHeadId = eve.AC_Id;
    this.selectAreaFlag = false
    this.filteredOptions = [];
    this.fnGetLeadgerBalanceOnAccountId(eve.AC_Id);
  }

  fnGetLeadgerBalanceOnAccountId(id) {
    var ServiceParams = {};
    ServiceParams['strProc'] = "GetLeaderAmtOnAcId";
    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.dBranchId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "AcId";
    ProcParams["strArgmt"] = id.toString();
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      let jsonData = JSON.parse(data);
      this.recieptSource.balanceAmount = jsonData[0].OpeningBalance;
      this.recieptSource.AdjuRetAmtPending = jsonData[0].ReturnAmt;
    });
    this.fnRetAdjustmentAmtOnAcId(id);
  }

  fnRetAdjustmentAmtOnAcId(AcId) {
    var ServiceParams = {};
    ServiceParams['strProc'] = "ReturnAdjustmentLog_GetsOnAcIdForAccountsReceipt";

    let oProcParams = [];
    let ProcParams = {};
    ProcParams["strKey"] = "AcId";
    ProcParams["strArgmt"] = AcId.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.dBranchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      let jsonData = JSON.parse(data);
      let RetAmount = jsonData[0].Amount

      this.filteredOptions = [{ Type: 'Reciept', Amount: 0.00 }, { Type: 'Adjustment', Amount: RetAmount }];
      this.receiptTypeFlag = true;
    });
  }

  fnSearchBankName(eve) {
    var ServiceParams = {};
    ServiceParams['strProc'] = "AccountHead_GetBanksNew";
    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "Search";
    ProcParams["strArgmt"] = eve;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.dBranchId;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReportNew', body).subscribe(data => {
      this.filteredOptions = JSON.parse(data);
      this.bankFilterFlag = true;
    });
  }

  fnBankChange(eve) {
    this.recieptSource.selectBank = eve.BankName;
    this.bankSource.bankId = eve.AC_Id;
    this.bankFilterFlag = false;
    this.filteredOptions = [];
    let element = <HTMLInputElement>document.getElementById('recievedAmt');
    element.focus();
    element.select();
  }

  fnSelectRecieptType() {
    this.fnNextVoucherNo();
  }
  fnSelectRecieptTypeChange(eve) {
    if (eve.Type == 'Reciept') {
      if (this.recieptSource.recieptType == 'BANK') {
        let element = <HTMLInputElement>document.getElementById('selectbank');
        element.focus();
      } else {
        let element = <HTMLInputElement>document.getElementById('recievedAmt');
        element.focus();
        element.select();
      }
    } else {
      //open model

    }
    this.receiptTypeFlag = false;
  }

  fnGetTotalAmount(eve) {
    let amnt = eve.target.value;
    this.recieptSource.balanceAmount = 0;
    this.recieptSource.voucherAmount = 0;
    let BalanceAmt = parseFloat(<any>this.recieptSource.balanceAmount || 0) - parseFloat(amnt || 0);
    let balancetotal = parseFloat(<any>this.recieptSource.balanceAmount || 0) + parseFloat(amnt || 0)

    this.recieptSource.balanceAmount = BalanceAmt;
    this.recieptSource.voucherAmount = balancetotal;
  }
  fnBack() {
    this.fnClear();
    this.fnVoucherGets();
    this.createFlag = true;
  }
  fnCreate() {
    this.fnNextVoucherNo();
    setTimeout(() => {
      this.fngetSalesMan();
    }, 500);


    this.createFlag = false;
  }
  fnClear() {
    this.recieptSource = {
      voucherId: 0, voucherNo: '', balanceAmount: 0, recieptType: 'CASH', accountHeadId: '', selectBank: '', address: '',
      voucherDate: new Date(), outStanding: '', AdjuRetAmtPending: '', salesManId: '', recievedAmt: 0, remarks: '',
      voucherAmount: 0
    };
    this.bankSource = {
      bankId: '', bankName: '', chequeNo: '', chequeDate: new Date(), transferType: ''
    };
    this.filteredOptions = [];
  }

  fnSave() {

    if (this.recieptSource.recievedAmt == 0 || this.recieptSource.recievedAmt == null) {
      this._appService.openSnackBar("Please Enter The Recieved Amount", 'Warning');
      return;
    }
    if (this.recieptSource.accountHeadId == '' || this.recieptSource.accountHeadId == null) {
      this._appService.openSnackBar('Please Select The AccountHead', 'Warning');
      return;
    }
    if (this.recieptSource.salesManId == '' || this.recieptSource.salesManId == null) {
      this._appService.openSnackBar('Please Select Salesman..', 'Warning');
      return;
    }
    if (this.recieptSource.recieptType == 'BANK') {
      var ServiceParams = {};
      ServiceParams['strProc'] = "ChequeNoExistsCheck";
      let oProcParams = [];

      let ProcParams = {};
      ProcParams["strKey"] = "ChequeNo";
      ProcParams["strArgmt"] = this.bankSource.chequeNo;
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams["strKey"] = "Voucher_VoucherNo";
      ProcParams["strArgmt"] = parseFloat(<any>this.recieptSource.voucherNo || 0).toString();
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams["strKey"] = "UniqueVoucherId";
      ProcParams["strArgmt"] = '0';
      oProcParams.push(ProcParams);

      ProcParams = {};
      ProcParams["strKey"] = "BranchId";
      ProcParams["strArgmt"] = this.dBranchId;
      oProcParams.push(ProcParams);

      ServiceParams['oProcParams'] = oProcParams;
      let body = JSON.stringify(ServiceParams);
      this._appService.post('CommonQuery/fnGetDataReportNew', body).subscribe(data => {
        let jsonData = JSON.parse(data);
        if (jsonData.length != 0) {
          this._appService.openSnackBar('Cheque No Already Exist', 'Warning');
          return;
        }
      });
    }
    let dPrefixId;
    if (this.recieptSource.recieptType == 'BANK') {
      dPrefixId = 3;
    } else {
      dPrefixId = 1;
    }

    var ListOutstandingInfo = [];
    let OutstandingInfo = {}
    OutstandingInfo["VType_SlNo"] = 0;
    OutstandingInfo["Voucher_VoucherNo"] = this.recieptSource.voucherId;
    OutstandingInfo["ReceiveAmt"] = this.recieptSource.recievedAmt;
    OutstandingInfo["DisAmt"] = 0;
    OutstandingInfo["RetAmt"] = this.recieptSource.AdjuRetAmtPending;
    OutstandingInfo["BillNo"] = 0;
    OutstandingInfo["UniqueNo"] = 0;
    OutstandingInfo["Issue_Amount"] = this.recieptSource.voucherAmount;
    OutstandingInfo["UniqueVoucherId"] = 0;
    ListOutstandingInfo.push(OutstandingInfo);

    var ListVoucherDetailsInfo = [];
    let VoucherDetailsInfo = {};

    VoucherDetailsInfo["Remarks"] = this.recieptSource.remarks;
    VoucherDetailsInfo["Voucher_Date"] = this.ConvertDateAll(this.recieptSource.voucherDate);
    VoucherDetailsInfo["Voucher_ChequeNo"] = this.bankSource.chequeNo;
    VoucherDetailsInfo["Voucher_ChequeDate"] = this.ConvertDateAll(this.bankSource.chequeDate);
    VoucherDetailsInfo["Voucher_Amt"] = this.recieptSource.voucherAmount;
    VoucherDetailsInfo["Voucher_BankName"] = this.bankSource.bankName;
    VoucherDetailsInfo["VPrefix_No"] = dPrefixId;
    VoucherDetailsInfo["AC_Id"] = this.recieptSource.accountHeadId;
    VoucherDetailsInfo["Voucher_Description2"] = '';
    VoucherDetailsInfo["BalanceAmt"] = this.recieptSource.balanceAmount;
    VoucherDetailsInfo["BankId"] = parseFloat(<any>this.bankSource.bankId || 0);
    VoucherDetailsInfo["RepId"] = this.recieptSource.salesManId;
    VoucherDetailsInfo["BranchId"] = parseFloat(this.dBranchId || 0);
    VoucherDetailsInfo["StaffId"] = parseFloat(this.dStaffId || 0);
    VoucherDetailsInfo["Voucher_VoucherNo"] = parseFloat(<any>this.recieptSource.voucherNo || 0);
    VoucherDetailsInfo["UniqueVoucherId"] = this.recieptSource.voucherId;
    VoucherDetailsInfo["Field4"] = this.bankSource.transferType;
    VoucherDetailsInfo["VoucherGroupId"] = 0;

    ListVoucherDetailsInfo.push(VoucherDetailsInfo);
    VoucherDetailsInfo["ListOutstandingInfo"] = ListOutstandingInfo;
    let body = JSON.stringify(VoucherDetailsInfo);
    this._appService.post('Accounts/fnReceiptSave', body).subscribe(data => {
      this._appService.openSnackBar('Saved SuccessFully', 'Success');
      this.fnNextVoucherNo();
      this.fnClear();

    })
  }
  fnVoucherGets() {
    var dPrefixId = 0;
    if (this.radioValue == 'CASH') {
      dPrefixId = 1;
    } else {
      dPrefixId = 3;
    }
    var varArguements = {};
    varArguements = {
      FromDate: this.ConvertDateAll(this.fromDate),
      ToDate: this.ConvertDateAll(this.toDate), Search: this.searchText, PrefixId: dPrefixId, BranchId: this.dBranchId
    }
    var DictionaryObject = {};

    DictionaryObject["dictArgmts"] = varArguements;
    DictionaryObject["ProcName"] = 'VoucherDetails_Gets';

    var strQuery = "DECLARE @BranchId          VARCHAR(10)     " +
      "\n DECLARE @FromDate          VARCHAR(10)       " +
      "\n DECLARE @ToDate            VARCHAR(10)  " +
      "\n DECLARE @search            VARCHAR(300)  " +
      "\n DECLARE @VoucherPrefixId   VARCHAR(10)   " +
      "\n DECLARE @DateCondition     VARCHAR(30)   " +
      "\n set @BranchId=   @@@" + this.dBranchId + "@@@    " +
      "\n set @FromDate=   @@@" + this.ConvertDateAll(this.fromDate) + "@@@    " +
      "\n set @ToDate =  @@@" + this.ConvertDateAll(this.toDate) + "@@@    " +
      "\n set @search= @@@" + this.searchText + "@@@ " +
      "\n set @VoucherPrefixId = " + dPrefixId + "   " +
      "\n set @DateCondition  = @@@" + this.typeOfDate + "@@@ " +
      "\n if(@DateCondition  = @@@EnterDate@@@)" +
      "\n begin" +
      "\n  set @DateCondition = @@@EnterDate@@@" +
      "\n end" +
      "\n else" +
      "\n begin" +
      "\n   set @DateCondition = @@@Voucher_Date@@@  " +
      "\n end" +
      "\n DECLARE @dbPrefix as VARCHAR(100) " +
      "\n DECLARE @nFromMonth as VARCHAR(5)  " +
      "\n DECLARE @nToMonth as VARCHAR(5)     " +
      "\n DECLARE @nFromYear as VARCHAR(5)  " +
      "\n DECLARE @nToYear as VARCHAR(5)   " +
      "\n declare @query as VARCHAR(max)   " +
      "\n declare @QtyDecPlace varchar(10) " +

      "\n select @QtyDecPlace =Value from Settings where KeyValue=@@@DecimalPlace@@@     " +

      "\n SET     @nFromMonth=substring(@FromDate,6,2)   " +
      "\n SET     @nToMonth=substring(@ToDate,6,2)   " +
      "\n SET     @nFromYear=substring(@FromDate,1,4) " +
      "\n SET     @nToYear=substring(@ToDate,1,4)    " +
      "\n SELECT  @dbPrefix= Value from Settings where KeyValue=@@@dbname@@@" +

      "\n create table #tblStaff" +
      "\n (" +
      "\n StaffId  numeric(18,0)," +
      "\n EmployeeName  varchar(1200)" +

      "\n )                " +

      "\n insert into #tblStaff(StaffId,EmployeeName) select AC_Id,AC_Name from AccountHead where StaffFlag=1  " +
      "\n Create Table #tbl                " +
      "\n (   " +
      "\n UniqueId            numeric(18,0) identity(1,1) primary key,   " +
      "\n VoucherNo             VARCHAR(40)     ,                " +
      "\n VoucherDate           VARCHAR(20)     ,      " +
      "\n AccountName           VARCHAR(1500)   ," +
      "\n VoucherAmt            decimal(18,3)   ,   " +
      "\n VoucherNo1            NUMERIC(18,0)   ,  " +
      "\n VoucherDate1          datetime        ,  " +
      "\n VoucherPrefixNo       NUMERIC(18,0)    ,  " +
      "\n EmployeeName          varchar(300)     ," +
      "\n UniqueVoucherId       numeric(18,0)    ," +
      "\n Voucher_VoucherPrefix  varchar(100)    ," +
      "\n Flag                   varchar(120)    ," +
      "\n Remarks                varchar(2000)   ," +
      "\n Addr1                  varchar(2000)	 " +
      "\n )                 " +

      "\n SET  @search  = ISNULL( @search,@@@@@@)   " +
      "\n if(@search like @@@%[0-9]%@@@ and  @search<>@@@@@@ )  " +
      "\n begin   " +


      "\n set @query=@@@  insert into #tbl   " +
      "\n SELECT  VoucherDetails.Voucher_VoucherPrefix+@@@@@@-@@@@@@+CONVERT(varchar(18),voucher_voucherno) VoucherNo,  " +
      "\n @@@@@@ @@@@@@+CONVERT(varchar(10), Voucher_Date,103) VoucherDate, AC_Name AccountName," +
      "\n Voucher_Amt,Voucher_VoucherNo,Voucher_Date,VPrefix_No ,ISNULL(EmployeeName,@@@@@@@@@@@@) EmployeeName," +
      "\n UniqueVoucherId,Voucher_VoucherPrefix,@@@@@@@@@@@@,isnull(Remarks,@@@@@@@@@@@@) Remarks,isnull(addr1,@@@@@@@@@@@@) FROM dbo.VoucherDetails    " +
      "\n inner join dbo.AccountHead on VoucherDetails.AC_Id=AccountHead.AC_Id   " +
      "\n left outer join #tblStaff on VoucherDetails.StaffId=#tblStaff.StaffId   " +
      "\n WHERE VoucherDetails.Field3=1 and VoucherDetails.BranchId=@@@@@@@@@+@BranchId+@@@@@@@@@       and VPrefix_No=@@@@@@@@@+@VoucherPrefixId+@@@@@@@@@ " +
      "\n and ( CONVERT(varchar(18),voucher_voucherno)  like @@@@@@@@@+ @search+@@@%@@@@@@ " +
      "\n or CONVERT(varchar(18),isnull( Voucher_ChequeNo,@@@@@@@@@@@@))  like @@@@@@@@@+ @search+@@@%@@@@@@ or CONVERT(varchar(18),isnull( Remarks,@@@@@@@@@@@@))  like @@@@@@@@@+ @search+@@@%@@@@@@ ) and " +
      "\n convert(datetime,@@@+@DateCondition+@@@,120) >=@@@@@@@@@+@FromDate+@@@@@@@@@ " +
      "\n AND convert(datetime,@@@+@DateCondition+@@@,120) <=@@@@@@@@@+@ToDate +@@@@@@@@@  " +
      "\n order by EnterDate desc, voucher_voucherno ASC@@@             " +
      "\n exec(@query) " +

      "\n set @query=@@@  insert into #tbl    " +
      "\n SELECT distinct EditVoucherDetails.Voucher_VoucherPrefix+@@@@@@-@@@@@@+CONVERT(varchar(18),voucher_voucherno) VoucherNo,  " +
      "\n @@@@@@ @@@@@@ VoucherDate, @@@@@@@@@@@@ AccountName, 0,Voucher_VoucherNo,null,VPrefix_No ,@@@@@@@@@@@@ EmployeeName,UniqueVoucherId,Voucher_VoucherPrefix," +
      "\n @@@@@@Cancelled@#@#@VoucherDetail@@@@@@ ,isnull(Remarks,@@@@@@@@@@@@) Remarks,isnull(addr1,@@@@@@@@@@@@) FROM dbo.EditVoucherDetails     " +
      "\n inner join dbo.AccountHead on EditVoucherDetails.AC_Id=AccountHead.AC_Id " +
      "\n left outer join #tblStaff on EditVoucherDetails.StaffId=#tblStaff.StaffId   " +
      "\n WHERE 	  UniqueVoucherId not in " +
      "\n ( select UniqueVoucherId from VoucherDetails where VPrefix_No=@@@@@@@@@+@VoucherPrefixId+@@@@@@@@@  and VoucherDetails.BranchId=@@@@@@@@@+@BranchId+@@@@@@@@@ ) and Voucher_VoucherNo not in " +
      "\n ( select Voucher_VoucherNo from VoucherDetails where VPrefix_No=@@@@@@@@@+@VoucherPrefixId+@@@@@@@@@ and VoucherDetails.BranchId=@@@@@@@@@+@BranchId+@@@@@@@@@ )  and " +
      "\n EditVoucherDetails.Field3=1 and EditVoucherDetails.BranchId=@@@@@@@@@+@BranchId+@@@@@@@@@       and VPrefix_No=@@@@@@@@@+@VoucherPrefixId+@@@@@@@@@       " +
      "\n and ( CONVERT(varchar(18),voucher_voucherno)  like @@@@@@@@@+ @search+@@@%@@@@@@ " +
      "\n or CONVERT(varchar(18),isnull( Voucher_ChequeNo,@@@@@@@@@@@@))  like @@@@@@@@@+ @search+@@@%@@@@@@ or CONVERT(varchar(18),isnull( Remarks,@@@@@@@@@@@@))  like @@@@@@@@@+ @search+@@@%@@@@@@ ) and   " +
      "\n convert(datetime,@@@+@DateCondition+@@@,120) >=@@@@@@@@@+@FromDate+@@@@@@@@@   " +
      "\n            AND convert(datetime,@@@+@DateCondition+@@@,120) <=@@@@@@@@@+@ToDate +@@@@@@@@@     " +
      "\n order by voucher_voucherno ASC,Voucher_VoucherPrefix asc@@@" +

      "\n exec(@query) " +

      "\n END" +
      "\n ELSE" +
      "\n BEGIN" +

      "\n set @query=@@@  insert into #tbl  " +
      "\n  SELECT  VoucherDetails.Voucher_VoucherPrefix+@@@@@@-@@@@@@+CONVERT(varchar(18),voucher_voucherno) VoucherNo," +
      "\n @@@@@@ @@@@@@+CONVERT(varchar(10), Voucher_Date,103) VoucherDate, AC_Name AccountName,    " +
      "\n Voucher_Amt,Voucher_VoucherNo,Voucher_Date,VPrefix_No ,ISNULL(EmployeeName,@@@@@@@@@@@@) EmployeeName,UniqueVoucherId " +
      "\n ,Voucher_VoucherPrefix,@@@@@@@@@@@@,isnull(Remarks,@@@@@@@@@@@@) Remarks,isnull(addr1,@@@@@@@@@@@@)  FROM dbo.VoucherDetails    " +
      "\n inner join dbo.AccountHead on VoucherDetails.AC_Id=AccountHead.AC_Id   " +
      "\n left outer join #tblStaff on VoucherDetails.StaffId=#tblStaff.StaffId " +
      "\n WHERE VoucherDetails.Field3=1  and VoucherDetails.BranchId=@@@@@@@@@+@BranchId+@@@@@@@@@  and VPrefix_No=@@@@@@@@@+@VoucherPrefixId+@@@@@@@@@" +
      "\n and (AC_Name like @@@@@@@@@+@search+@@@%@@@@@@ or CONVERT(varchar(18),voucher_voucherno)  like @@@@@@@@@+ @search+@@@%@@@@@@" +
      "\n or CONVERT(varchar(18),isnull( Voucher_ChequeNo,@@@@@@@@@@@@))  like @@@@@@@@@+ @search+@@@%@@@@@@ or CONVERT(varchar(18),isnull( Remarks,@@@@@@@@@@@@))  like @@@@@@@@@+ @search+@@@%@@@@@@ ) and   " +
      "\n convert(date,@@@+@DateCondition+@@@,120) >=@@@@@@@@@+@FromDate+@@@@@@@@@          " +
      "\n AND convert(date,@@@+@DateCondition+@@@,120) <=@@@@@@@@@+@ToDate +@@@@@@@@@  " +
      "\n order by EnterDate desc, voucher_voucherno desc,Voucher_VoucherPrefix asc  @@@   " +
      "\n exec(@query)" +

      "\n set @query=@@@  insert into #tbl       " +
      "\n SELECT distinct EditVoucherDetails.Voucher_VoucherPrefix+@@@@@@-@@@@@@+CONVERT(varchar(18),voucher_voucherno) VoucherNo,    " +
      "\n @@@@@@ @@@@@@ VoucherDate, @@@@@@@@@@@@ AccountName,      " +
      "\n 0,Voucher_VoucherNo,null,VPrefix_No ,@@@@@@@@@@@@ EmployeeName,UniqueVoucherId,Voucher_VoucherPrefix," +
      "\n @@@@@@Cancelled@#@#@VoucherDetail@@@@@@,isnull(Remarks,@@@@@@@@@@@@) Remarks ,isnull(addr1,@@@@@@@@@@@@) FROM dbo.EditVoucherDetails     " +
      "\n inner join dbo.AccountHead on EditVoucherDetails.AC_Id=AccountHead.AC_Id   " +
      "\n left outer join #tblStaff on EditVoucherDetails.StaffId=#tblStaff.StaffId " +
      "\n WHERE " +
      "\n UniqueVoucherId not in" +
      "\n ( select UniqueVoucherId from VoucherDetails where VPrefix_No=@@@@@@@@@+@VoucherPrefixId+@@@@@@@@@  and VoucherDetails.BranchId=@@@@@@@@@+@BranchId+@@@@@@@@@) and Voucher_VoucherNo not in " +
      "\n ( select Voucher_VoucherNo from VoucherDetails where VPrefix_No=@@@@@@@@@+@VoucherPrefixId+@@@@@@@@@  and VoucherDetails.BranchId=@@@@@@@@@+@BranchId+@@@@@@@@@) and " +
      "\n EditVoucherDetails.Field3=1 and EditVoucherDetails.BranchId=@@@@@@@@@+@BranchId+@@@@@@@@@       and VPrefix_No=@@@@@@@@@+@VoucherPrefixId+@@@@@@@@@  " +
      "\n and (AC_Name like @@@@@@@@@+@search+@@@%@@@@@@ or CONVERT(varchar(18),voucher_voucherno)  like @@@@@@@@@+ @search+@@@%@@@@@@ " +
      "\n or CONVERT(varchar(18),isnull( Voucher_ChequeNo,@@@@@@@@@@@@))  like @@@@@@@@@+ @search+@@@%@@@@@@ or CONVERT(varchar(18),isnull( Remarks,@@@@@@@@@@@@))  like @@@@@@@@@+ @search+@@@%@@@@@@ ) and " +
      "\n convert(datetime,@@@+@DateCondition+@@@,120) >=@@@@@@@@@+@FromDate+@@@@@@@@@       AND convert(datetime,@@@+@DateCondition+@@@,120) <=@@@@@@@@@+@ToDate +@@@@@@@@@ " +
      "\n order by voucher_voucherno ASC,Voucher_VoucherPrefix asc@@@ " +

      "\n exec(@query) " +

      "\n END   " +

      "\n UPDATE #TBL SET #TBL.VoucherDate=CONVERT(varchar(10) ,EditVoucherDetails.Voucher_Date,103) ,#tbl.VoucherDate1=EditVoucherDetails.Voucher_Date, " +
      "\n AccountName=AccountHead.AC_Name+ @@@,@@@ +isnull(AccountHead.Addr1,@@@@@@),#tbl.VoucherAmt=EditVoucherDetails.Voucher_Amt, " +
      "\n #TBL.EmployeeName=isnull( #tblStaff.EmployeeName,@@@@@@) " +
      "\n  from #tbl  " +
      "\n inner join EditVoucherDetails on #tbl.VoucherNo1=EditVoucherDetails.Voucher_VoucherNo " +
      "\n inner join dbo.AccountHead on EditVoucherDetails.AC_Id=AccountHead.AC_Id   " +
      "\n left outer join #tblStaff on EditVoucherDetails.StaffId=#tblStaff.StaffId  " +
      "\n and #tbl.UniqueVoucherId=EditVoucherDetails.UniqueVoucherId where #tbl.Flag=@@@Cancelled@#@#@VoucherDetail@@@ and  EditVoucherDetails.Field3=1 " +
      "\n and VPrefix_No=@VoucherPrefixId " +
      "\n and EditVoucherDetails.BranchId=@BranchId " +

      "\n update #tbl set VoucherAmt= convert(decimal(18,3),(-1))*VoucherAmt where VoucherAmt<0     " +

      "\n if(@QtyDecPlace=@@@3@@@)  " +
      "\n BEGIN     " +
      "\n select  * from #tbl order by VoucherNo1   desc   " +
      "\n END  " +
      "\n ELSE  " +
      "\n BEGIN  " +
      "\n select top 200 VoucherNo , VoucherDate , AccountName ,Addr1,CONVERT(DECIMAL(18,2), VoucherAmt)   VoucherAmt,VoucherNo1, VoucherDate1 , VoucherPrefixNo,EmployeeName , " +
      "\n UniqueVoucherId,Flag   ,Remarks  " +
      "\n from #tbl order by VoucherNo1   desc    " +
      "\n  END    ";

    var objDictionary = { strQuery: strQuery };
    let body = JSON.stringify(objDictionary)
    this._appService.post('CommonQuery/fnGetDataReportFromQuery', body).subscribe(data => {
      this.voucherList = JSON.parse(data);

    });
  }
  fnAnchorClick(data) {
    this.createFlag = false;
    var varArguements = {};
    varArguements = { VoucherNo: data.VoucherNo1.toString(), PrefixId: data.VoucherPrefixNo.toString(), UniqueVoucherId: data.UniqueVoucherId.toString(), BranchId: this.dBranchId };
    var DictionaryObject = {};
    DictionaryObject["dictArgmts"] = varArguements;
    DictionaryObject["ProcName"] = 'AccountLogFile_Get';

    let body = JSON.stringify(DictionaryObject);
    this._appService.post('Accounts/fnOutstandingPaidAmtForCopy', body).subscribe(data => {
      let AdjustBill = JSON.parse(data.AdjustBill);
      let BankDetails = JSON.parse(data.BankDetails);
      let VoucherDetails = JSON.parse(data.VoucherDetails);
      let ajdamt = '0';
      // if (AdjustBill[0].AdjustAmt != null || AdjustBill[0].AdjustAmt != undefined) { ajdamt = AdjustBill[0].AdjustAmt }
      this.recieptSource = {
        voucherId: VoucherDetails[0].Voucher_VoucherNo,
        voucherNo: VoucherDetails[0].Voucher_VoucherNo,
        balanceAmount: VoucherDetails[0].BalanceAmt,
        recieptType: 'CASH',
        accountHeadId: VoucherDetails[0].AC_Id,
        selectBank: VoucherDetails[0].Voucher_Field7,
        address: VoucherDetails[0].Addr1,
        voucherDate: new Date(VoucherDetails[0].Voucher_Date),
        outStanding: '',
        AdjuRetAmtPending: ajdamt,
        salesManId: VoucherDetails.StaffId,
        recievedAmt: VoucherDetails[0].Voucher_Amt,
        remarks: VoucherDetails[0].Remarks,
        voucherAmount: VoucherDetails[0].Voucher_Amt
      };
      if (VoucherDetails[0].VPrefix_No == 1) {
        this.recieptSource.recieptType = 'CASH'
      } else {
        this.recieptSource.recieptType = 'BANK'
      }
      this.AcName = VoucherDetails[0].AC_Name;
      this.voucherNo = VoucherDetails[0].Voucher_VoucherNo;
      this.bankSource = {
        bankId: '',
        bankName: VoucherDetails[0].Voucher_BankName,
        chequeNo: VoucherDetails[0].Voucher_ChequeNo,
        chequeDate: new Date(VoucherDetails[0].Voucher_ChequeDate),
        transferType: VoucherDetails[0].Field4
      };
    })
  }
  ConvertDateAll(format) {
    let date = ("0" + format.getDate()).slice(-2);
    let month = ("0" + (format.getMonth() + 1)).slice(-2);
    let year = format.getFullYear();
    const dateconvert = year + '-' + month + '-' + date;
    return dateconvert;
  }
}



