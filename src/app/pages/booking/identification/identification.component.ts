import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-identification',
  templateUrl: './identification.component.html',
  styleUrls: ['./identification.component.scss']
})
export class IdentificationComponent implements OnInit {
  createFlag: boolean = true;
  searchText: any = '';
  identificationList: any;
  dBranchId: any = localStorage.getItem('SessionBranchId');

  identificationSource = {
    IdentificationId: 0, IdentificationName: '', IdentificationDescription: '', IdentificationDescription2: '',
    IdentificationDescription3: '', BranchId: parseFloat(this.dBranchId || 0)
  }


  constructor(public _appService: AppService) { }

  ngOnInit() {
    this.getIdentification();
  }

  getIdentification() {
    this._appService.get('GetRepository/getIdentfications?terms=' + this.searchText)
      .subscribe(result => {
        this.identificationList = result;

      }, error => console.error(error));
  }

  fnCreate() {
    this.createFlag = false;
  }

  fnsearchText(eve) {
    this.searchText = eve.target.value;
    this.getIdentification();
  }

  fnAnchorClick(data) {
    this.createFlag = false;
    this.identificationSource = {
      IdentificationId: data.IdentificationId,
      IdentificationName: data.IdentificationName,
      IdentificationDescription: data.IdentificationDescription,
      IdentificationDescription2: data.IdentificationDescription2,
      IdentificationDescription3: data.IdentificationDescription3,
      BranchId: parseFloat(this.dBranchId || 0)
    }
  }

  fnBack() {
    this.createFlag = true;
    this.getIdentification();
    this.fnClear();
  }

  fnClear() {
    this.identificationSource = {
      IdentificationId: 0, IdentificationName: '', IdentificationDescription: '', IdentificationDescription2: '',
      IdentificationDescription3: '', BranchId: parseFloat(this.dBranchId || 0)
    }
  }

  fnSave() {
    if (this.identificationSource.IdentificationName == '' || this.identificationSource.IdentificationName == null) {
      this._appService.openSnackBar('Please Enter The IdentificationName', 'Warning');
      return;
    }
    if (this.identificationSource.IdentificationDescription == '' || this.identificationSource.IdentificationDescription == null) {
      this._appService.openSnackBar('Please Enter The Description', 'Warning');
      return;
    }

    let body = JSON.stringify(this.identificationSource)
    this._appService.post('PostRepository/postIdentificaton', body).subscribe(data => {
      this._appService.openSnackBar('Saved Successfully', 'Success');
      this.fnBack();
    });
  }

}
