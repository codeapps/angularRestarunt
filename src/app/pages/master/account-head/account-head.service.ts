import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from 'src/app/app.service';

@Injectable({
  providedIn: 'root'
})
export class AccountHeadService {
  dbBranchId = localStorage.getItem("SessionBranchId");

  constructor(private _appService: AppService) { }


  fnAccountGets(typeOfHead, searchText) {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'AccountHead_GetsNew';

    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.dbBranchId;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "TypeFlag";
    ProcParams["strArgmt"] = typeOfHead;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "Search";
    ProcParams["strArgmt"] = searchText;
    oProcParams.push(ProcParams);
    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams)

    return this._appService.post('CommonQuery/fnGetDataReport', body)

  }

  onAccHeadGetsAll(data):Observable<any> {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'AccountHead_GetAll';
    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "AC_Id";
    ProcParams["strArgmt"] = data.AC_Id.toString();
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);
    return this._appService.post('Master/AccountHead_GetAll', body)
  }

  onAccHeadInsertOrUpdate(data):Observable<any> {
    let ServiceParams = {};
    ServiceParams['strProc'] = 'AccountHead_InsertOrUpdateAll';
    let oProcParams = [];

    let ProcParams = {};
    ProcParams["strKey"] = "AC_Id";
    ProcParams["strArgmt"] = data.AC_Id.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "AdjAmount";
    ProcParams["strArgmt"] = data.AdjAmount.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "AC_Name";
    ProcParams["strArgmt"] = data.AC_Name;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "Addr1";
    ProcParams["strArgmt"] = data.Addr1;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "Addr2";
    ProcParams["strArgmt"] = data.Addr2;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "Addr3";
    ProcParams["strArgmt"] = data.Addr3;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "DescEditFlag";
    ProcParams["strArgmt"] = data.DescEditFlag;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "Phone";
    ProcParams["strArgmt"] = data.Phone;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "Mobile";
    ProcParams["strArgmt"] = data.Mobile;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "Email";
    ProcParams["strArgmt"] = data.Email;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "Web";
    ProcParams["strArgmt"] = data.Web;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "Transporter";
    ProcParams["strArgmt"] = data.Transporter;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "Fax";
    ProcParams["strArgmt"] = data.Fax;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "DLNo1";
    ProcParams["strArgmt"] = data.DLNo1.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "DLNo2";
    ProcParams["strArgmt"] = data.DLNo2.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "Tin1";
    ProcParams["strArgmt"] = data.Tin1.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "Tin2";
    ProcParams["strArgmt"] = data.Tin2.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "CstNo1";
    ProcParams["strArgmt"] = data.CstNo1.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "CrLmtDays";
    ProcParams["strArgmt"] = data.CrLmtDays.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "CrLmtAmt";
    ProcParams["strArgmt"] = data.CrLmtAmt.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "CustOrSupp";
    ProcParams["strArgmt"] = data.CustOrSupp;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "AreaId";
    ProcParams["strArgmt"] = data.AreaId.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "Alias";
    ProcParams["strArgmt"] = data.Alias;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "Type";
    ProcParams["strArgmt"] = data.Type;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "OBalance";
    ProcParams["strArgmt"] = parseFloat(<any>data.OBalance || 0).toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "ScheduleType";
    ProcParams["strArgmt"] = data.ScheduleType.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "Schedule1";
    ProcParams["strArgmt"] = data.Schedule1.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "Schedule2";
    ProcParams["strArgmt"] = data.Schedule2.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "Schedule3";
    ProcParams["strArgmt"] = data.Schedule3.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "EntryMatch";
    ProcParams["strArgmt"] = data.EntryMatch;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "BankYesNo";
    ProcParams["strArgmt"] = data.BankYesNo;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "Flag";
    ProcParams["strArgmt"] = data.Flag.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "UserID";
    ProcParams["strArgmt"] = parseFloat(<any>data.UserID || 0).toString()
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "CreateDate";
    ProcParams["strArgmt"] = data.CreateDate;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "BranchId";
    ProcParams["strArgmt"] = this.dbBranchId;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "PurType";
    ProcParams["strArgmt"] = data.PurType;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "CategoryId";
    ProcParams["strArgmt"] = data.CategoryId.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "StartDate";
    ProcParams["strArgmt"] = data.StartDate;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "ExpiryDate";
    ProcParams["strArgmt"] = data.ExpiryDate;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "DateOfBirth";
    ProcParams["strArgmt"] = data.DateOfBirth;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "IntroducedBy";
    ProcParams["strArgmt"] = data.IntroducedBy;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "Currency";
    ProcParams["strArgmt"] = data.Currency;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "IFSCode";
    ProcParams["strArgmt"] = data.IFSCode;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "ModelPoint";
    ProcParams["strArgmt"] = data.ModelPoint.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "ModelPointAmt";
    ProcParams["strArgmt"] = data.ModelPointAmt.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "PriceMenuId";
    ProcParams["strArgmt"] = data.PriceMenuId.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "AgentPriceMenuId";
    ProcParams["strArgmt"] = data.AgentPriceMenuId.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "CustomerFlag";
    ProcParams["strArgmt"] = data.CustomerFlag.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "SupplierFlag";
    ProcParams["strArgmt"] = data.SupplierFlag.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "StaffFlag";
    ProcParams["strArgmt"] = data.StaffFlag.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "LoginFlag";
    ProcParams["strArgmt"] = data.LoginFlag.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "AgentFlag";
    ProcParams["strArgmt"] = data.AgentFlag.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "SalesmanFlag";
    ProcParams["strArgmt"] = data.SalesmanFlag.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "ActiveFlag";
    ProcParams["strArgmt"] = data.ActiveFlag.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "MediaId";
    ProcParams["strArgmt"] = data.MediaId.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "CurrencyId";
    ProcParams["strArgmt"] = data.CurrencyId.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "Field1";
    ProcParams["strArgmt"] = data.Field1.toString();
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "Field2";
    ProcParams["strArgmt"] = data.Field2;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "Field3";
    ProcParams["strArgmt"] = data.Field3;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "UserName";
    ProcParams["strArgmt"] = data.UserName;
    oProcParams.push(ProcParams)

    ProcParams = {};
    ProcParams["strKey"] = "Pwd";
    ProcParams["strArgmt"] = data.Pwd;
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "UniqueDeviceId";
    ProcParams["strArgmt"] = parseFloat(<any>data.UniqueDeviceId || 0).toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "OtherFlag";
    ProcParams["strArgmt"] = data.OtherFlag.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "AccessLevel";
    ProcParams["strArgmt"] = data.AccessLevel.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "AgentMarginPers";
    ProcParams["strArgmt"] = data.AgentMarginPers.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "bSelect";
    ProcParams["strArgmt"] = data.bSelect.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams["strKey"] = "Schedule4";
    ProcParams["strArgmt"] = data.Schedule4.toString();
    oProcParams.push(ProcParams)

    ServiceParams['oProcParams'] = oProcParams;

    let body = JSON.stringify(ServiceParams);
    return this._appService.post('Master/fnAccountHeadInsertAll', body)
  }
}
