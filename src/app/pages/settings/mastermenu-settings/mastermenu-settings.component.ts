import { AppService } from 'src/app/app.service';
import { TreeViewComponent, NodeSelectEventArgs } from '@syncfusion/ej2-angular-navigations';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-mastermenu-settings',
  templateUrl: './mastermenu-settings.component.html',
  styleUrls: ['./mastermenu-settings.component.scss']
})
export class MastermenuSettingsComponent implements OnInit {
  ddlUser = 1;
  MenuList: any;
  dTempAccessLevel = localStorage.getItem("SessionAccessLevelId");
  checkedMenus: any[] = [];
  JsonMenuParentList: any
  field: Object = { dataSource: [], id: 'id', parentID: 'pid', text: 'name', hasChildren: 'hasChild' };
  showCheckBox: boolean = true;

  constructor(private _appService: AppService) { }

  @ViewChild('treeview')
  public tree: TreeViewComponent;

  ngOnInit() {
    this.fnMenuGets();
  }

  nodeChecked(args): void {
    this._appService.openSnackBar("The checked node's id is: " + this.tree.checkedNodes, 'Checked');
  }

  fnMenuGets() {
    this.JsonMenuParentList = [];
    var MenuParentList = {};
    this.checkedMenus = [];

    var ServiceParams = {};
    ServiceParams['strProc'] = 'MenuHierarchyGets';
    var oProcParams = [];

    var ProcParams = {};
    ProcParams['strKey'] = '@ParamsLoginAccessLevelId';
    ProcParams['strArgmt'] = this.dTempAccessLevel.toString();
    oProcParams.push(ProcParams);

    ProcParams = {};
    ProcParams['strKey'] = '@ParamsAccessLevelId';
    ProcParams['strArgmt'] = this.ddlUser.toString();
    oProcParams.push(ProcParams);

    ServiceParams['oProcParams'] = oProcParams;
    let body = JSON.stringify(ServiceParams);
    this._appService.post('CommonQuery/fnGetDataReportFromScriptJsonFile', body).subscribe(data => {
      this.MenuList = [];
      let jsonmenudata = JSON.parse(data.JsonDetails[0]);
      var LevelId = 0;
      var ParentId = 0;
      var hasChild = false;
      var isChecked = false;
      var MenuId = 0;

      for (var i = 0; i < jsonmenudata.length; i++) {

        LevelId = parseFloat(jsonmenudata[i].MenuLevel || 0);
        ParentId = parseFloat(jsonmenudata[i].pid || 0);
        MenuId = parseFloat(jsonmenudata[i].id || 0);
        isChecked = false;
        hasChild = false;

        if (jsonmenudata[i].Menu_AllowFlag == "Yes") {
          isChecked = true;
          this.checkedMenus.push(MenuId);
        }

        if (String(jsonmenudata[i].hasChild).toUpperCase() == "TRUE") {
          hasChild = true;
        }

        MenuParentList = {};
        MenuParentList['MenuId'] = MenuId;
        MenuParentList['ParentId'] = ParentId;
        MenuParentList['hasChild'] = hasChild;
        this.JsonMenuParentList.push(MenuParentList);
        if (ParentId == 0) {
          this.MenuList.push({ id: jsonmenudata[i].id, name: jsonmenudata[i].name, hasChild: hasChild, isChecked: isChecked, expanded: false });
        }
        else {
          this.MenuList.push({ id: jsonmenudata[i].id, pid: ParentId, name: jsonmenudata[i].name, hasChild: hasChild, isChecked: isChecked, expanded: false });
        }
      }
      this.field = { dataSource: this.MenuList, id: 'id', parentID: 'pid', text: 'name', hasChildren: 'hasChild' }
    });
  }

  fnSaveMenuList() {    
    this.checkedMenus = this.tree.checkedNodes;
    var dAccessLevelId: any = this.ddlUser;
    if (dAccessLevelId == 1) {
      this._appService.openSnackBar('Cannot Update Super Admin', 'Warning');
      return;
    }
    var ListMenuSetForUserInfo = [];
    var MenuSetForUserInfo = {};

    for (var i = 0; i < this.checkedMenus.length; i++) {
      MenuSetForUserInfo = {}
      MenuSetForUserInfo["Menu_Id"] = parseFloat(this.checkedMenus[i] || 0);
      MenuSetForUserInfo["StaffId"] = dAccessLevelId;
      MenuSetForUserInfo["MenuSet_AllowFlag"] = "Yes";
      ListMenuSetForUserInfo.push(MenuSetForUserInfo);
    }

    if (this.checkedMenus.length == 0) {
      MenuSetForUserInfo = {}
      MenuSetForUserInfo["Menu_Id"] = 0;
      MenuSetForUserInfo["StaffId"] = dAccessLevelId;
      MenuSetForUserInfo["MenuSet_AllowFlag"] = "Yes";
      ListMenuSetForUserInfo.push(MenuSetForUserInfo);
    }
    let body = JSON.stringify(ListMenuSetForUserInfo);
    this._appService.post('Master/fnSaveMenuSettingsUserwise', body).subscribe(data => {
      this._appService.openSnackBar('Saved Successfully..', 'Success');
      this.fnMenuGets();
    });
  }


}
