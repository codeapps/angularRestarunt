import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { ManufactureService } from './manufacture.service';

@Component({
  selector: 'app-manufacture',
  templateUrl: './manufacture.component.html',
  styleUrls: ['./manufacture.component.scss']
})
export class ManufactureComponent implements OnInit {
  allManufacture: any;
  createFlag: boolean = true;
  ManufactureGroup: any;
  manufactureSource = {
    ManufactureId: 0, ManufactureName: '', ManufactureMfrno: '', ManufactureAddr1: '', ManufactureAddr2: '',
    ManufactureAddr3: '', ManufacturePhone: '', ManufactureFax: '', ManufactureEmail: '', ManufactureWebaddress: '',
    ManufactureTransporter: '', ManufactureBank: '', ManufactureBankAddr1: '', ManufactureBankAddr2: '', ManufactureBankAddr3: '',
    ManufactureDlno1: '', ManufactureDlno2: '', ManufactureTinNo1: '', ManufactureTinNo2: '', ManufactureCstno1: '',
    ManufactureCstno2: '', ManufactureGrpId: 0, Active: true, StaffId: '', EnterDate: '', BranchId: '', Manufacture_Code: '',
    ManufactureProdCodeNextNo: '', ManufactureInclusiveSales: 'Yes'
  }
  searchText: any = ''
  StaffId: any = localStorage.getItem("SessionStaffId");
  BranchId: any = localStorage.getItem("SessionBranchId");
  constructor(public _appService: AppService, public _manufactureService: ManufactureService) { }

  ngOnInit() {        
    this.fnCompanyGroup();
  }
  fnmanufactureGets() {
    this._manufactureService.fngetmanufacture(this.searchText).subscribe(data => {
      let DataObj = JSON.parse(data);
      this.allManufacture = DataObj;
    });
  }
  fnAnchorClick(eve) {
    this.createFlag = false;
    this.manufactureSource = {
      ManufactureId: eve.Manufacture_Id, ManufactureName: eve.Manufacture_Name,
      ManufactureMfrno: eve.Manufacture_MFRNo, ManufactureAddr1: eve.Manufacture_Addr1,
      ManufactureAddr2: eve.Manufacture_Addr2, ManufactureAddr3: eve.Manufacture_Addr3,
      ManufacturePhone: eve.Manufacture_Phone, ManufactureFax: eve.Manufacture_Fax,
      ManufactureEmail: eve.Manufacture_Email, ManufactureWebaddress: eve.Manufacture_Webaddress,
      ManufactureTransporter: eve.Manufacture_Transporter, ManufactureBank: eve.Manufacture_Bank,
      ManufactureBankAddr1: eve.Manufacture_BankAddr1, ManufactureBankAddr2: eve.Manufacture_BankAddr2,
      ManufactureBankAddr3: eve.Manufacture_BankAddr3, ManufactureDlno1: eve.Manufacture_DLno1,
      ManufactureDlno2: eve.Manufacture_DLno2, ManufactureTinNo1: eve.Manufacture_TinNo1,
      ManufactureTinNo2: eve.Manufacture_TinNo2, ManufactureCstno1: eve.Manufacture_CSTNo1,
      ManufactureCstno2: eve.Manufacture_CSTNo2, ManufactureGrpId: eve.Manufacture_GrpId,
      Active: eve.Active, StaffId: eve.StaffId, EnterDate: eve.EnterDate, BranchId: eve.BranchId,
      Manufacture_Code: eve.Manufacture_Code, ManufactureProdCodeNextNo: eve.Manufacture_ProdCodeNextNo,
      ManufactureInclusiveSales: eve.Manufacture_InclusiveSales
    }

  }
  fnCreate() {
    this.createFlag = false;
  }
  fnSave() {
    if (this.manufactureSource.ManufactureName == '') {
      this._appService.openSnackBar('Please Enter The Name', 'Warning');
      return;
    }
    if (this.manufactureSource.ManufactureMfrno == "") {
      this._appService.openSnackBar('Please Enter The MFRNO', 'Warning');
    }
    let dictArgmts = {
      ManufactureId: this.manufactureSource.ManufactureId,
      ManufactureName: this.manufactureSource.ManufactureName,
      ManufactureMfrno: this.manufactureSource.ManufactureMfrno,
      ManufactureAddr1: this.manufactureSource.ManufactureAddr1,
      ManufactureAddr2: this.manufactureSource.ManufactureAddr2,
      ManufactureAddr3: this.manufactureSource.ManufactureAddr3,
      ManufacturePhone: this.manufactureSource.ManufacturePhone,
      ManufactureFax: this.manufactureSource.ManufactureFax,
      ManufactureEmail: this.manufactureSource.ManufactureEmail,
      ManufactureWebaddress: this.manufactureSource.ManufactureWebaddress,
      ManufactureTransporter: this.manufactureSource.ManufactureTransporter,
      ManufactureBank: this.manufactureSource.ManufactureBank,
      ManufactureBankAddr1: this.manufactureSource.ManufactureBankAddr1,
      ManufactureBankAddr2: this.manufactureSource.ManufactureBankAddr2,
      ManufactureBankAddr3: this.manufactureSource.ManufactureBankAddr3,
      ManufactureDlno1: this.manufactureSource.ManufactureDlno1,
      ManufactureDlno2: this.manufactureSource.ManufactureDlno2,
      ManufactureTinNo1: this.manufactureSource.ManufactureTinNo1,
      ManufactureTinNo2: this.manufactureSource.ManufactureTinNo2,
      ManufactureCstno1: this.manufactureSource.ManufactureCstno1,
      ManufactureCstno2: this.manufactureSource.ManufactureCstno2,
      ManufactureGrpId: this.manufactureSource.ManufactureGrpId,
      Active: this.manufactureSource.Active,
      StaffId: parseFloat(this.StaffId || 0),
      EnterDate:this.ConvertDateAll(new Date()),
      BranchId: parseFloat(this.BranchId || 0),
      ManufactureCode: this.manufactureSource.Manufacture_Code,
      ManufactureProdCodeNextNo: parseFloat(<any>this.manufactureSource.ManufactureProdCodeNextNo || 0),
      ManufactureInclusiveSales: this.manufactureSource.ManufactureInclusiveSales
    }
      let body = JSON.stringify(dictArgmts);
      this._appService.post('PostRepository/Manufacture_Insert', body).subscribe(data => {
        let jsonObj = data;        
        if (jsonObj.ManufactureId == 0) {
          this._appService.openSnackBar('Already Exists', 'Warning');
          return;
        }
        this._appService.openSnackBar('Saved Successfully', 'Successful');
        this.BackToList();
      });    
  }

  BackToList() {
    this.fnClear();
    this.fnmanufactureGets();
    this.createFlag = true;
  }
  fnCompanyGroup() {
    let id = 16;
    this._appService.get(`GetRepository/Category_GetOnTypeId?typeId=${id}`).subscribe(data => {
      let JsonObj = data;    
      this.ManufactureGroup = JsonObj;

    });
    this.fnmanufactureGets();
  }
  fnsearchText(eve) {
    this.searchText = eve.target.value;
    this.fnmanufactureGets();
  }
  fnClear() {
    this.manufactureSource = {
      ManufactureId: 0, ManufactureName: '', ManufactureMfrno: '', ManufactureAddr1: '', ManufactureAddr2: '',
      ManufactureAddr3: '', ManufacturePhone: '', ManufactureFax: '', ManufactureEmail: '', ManufactureWebaddress: '',
      ManufactureTransporter: '', ManufactureBank: '', ManufactureBankAddr1: '', ManufactureBankAddr2: '', ManufactureBankAddr3: '',
      ManufactureDlno1: '', ManufactureDlno2: '', ManufactureTinNo1: '', ManufactureTinNo2: '', ManufactureCstno1: '',
      ManufactureCstno2: '', ManufactureGrpId: 0, Active: true, StaffId: '', EnterDate: '', BranchId: '', Manufacture_Code: '',
      ManufactureProdCodeNextNo: '', ManufactureInclusiveSales: 'Yes'
    }
  }
  ConvertDateAll(format) {
    let date = ("0" + format.getDate()).slice(-2);
    let month = ("0" + (format.getMonth() + 1)).slice(-2);
    let year = format.getFullYear();
    const dateconvert = year + '-' + month + '-' + date;
    return dateconvert;
  }
}
