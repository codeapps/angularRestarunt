import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-backuptaken',
  templateUrl: './backuptaken.component.html',
  styleUrls: ['./backuptaken.component.scss']
})
export class BackuptakenComponent implements OnInit {
  backupFolderPath = ''
  constructor(public _appService: AppService) { }

  ngOnInit() {
    this.fnBrowserPathGet();
  }
  fnBrowserPathGet() {
    var ServiceParams = {};
    ServiceParams['strProc'] = 'Settings_GetBackUpPath';

    let body = JSON.stringify(ServiceParams);
    this._appService.post('CommonQuery/fnGetDataReport', body).subscribe(data => {
      let JsonObj = JSON.parse(data);
      this.backupFolderPath = JsonObj[0].value;
    });
  }
  fnTakenBackup() {
    var ServiceParams = {};
    ServiceParams['strProc'] = 'BackUpDataBase';
    var oProcParams = [];

    var ProcParams = {};
    ProcParams['strKey'] = 'BackUpPath';
    ProcParams['strArgmt'] = this.backupFolderPath;
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);

    this._appService.post('CommonQuery/fnGetDataReport', body).subscribe(data => {
      let jsonObj = JSON.parse(data)
      if (jsonObj.length > 0) {
        this._appService.openSnackBar(jsonObj[0].Flag, 'Success');
      }

    })
  }
}
