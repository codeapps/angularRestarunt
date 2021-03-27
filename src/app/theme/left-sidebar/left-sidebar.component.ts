import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { sidenavMenuItems } from './sidebarmenu';
import { MatAccordion } from '@angular/material/expansion';


@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSidebarComponent implements OnInit {
  @ViewChild('accordions') accordion: any;
  menuSource = sidenavMenuItems;
  constructor(private appService: AppService) {

  }


  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.fnStaffMenuSet();
  }

  fnCloseAll() {

    this.accordion.accordion.closeAll();


  }
  fnStaffMenuSet() {
    let ServiceParams = {};
    let dStaffId: any = 0;
    dStaffId = localStorage.getItem('SessionStaffId');
    if (dStaffId == '0') {
      dStaffId = 0
    }
    if (dStaffId != 0) {
      ServiceParams['strProc'] = 'Menu_GetDisabledReportType';
    } else {
      ServiceParams['strProc'] = 'Menu_SoftwareSettingMenu';
    }

    let oProcParams = [];

    let ProcParams = {};

    if (dStaffId != 0) {

      ProcParams = {};
      ProcParams['strKey'] = 'StaffId';
      ProcParams['strArgmt'] = dStaffId;
      oProcParams.push(ProcParams);
      ServiceParams['oProcParams'] = oProcParams;
    }

    let body = JSON.stringify(ServiceParams);
    this.appService.post('CommonQuery/fnGetDataReport', body)
      .subscribe(data => {
        let jsonobj = JSON.parse(data);
        if (!jsonobj.length)
            return
        for (let i = 0; i < jsonobj.length; i++) {


          let s = document.getElementById(jsonobj[i].Menu_FormName);
          if (s != null) {
            s.style.display = 'block';
          }
        }
      })
  }
}
