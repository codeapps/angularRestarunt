import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { DailySalesService } from './daily-sales.service';

@Component({
  selector: 'app-daily-sales',
  templateUrl: './daily-sales.component.html',
  styleUrls: ['./daily-sales.component.scss']
})
export class DailySalesComponent implements OnInit {
  date = new Date();
  fromDate = new Date();
  toDate = new Date();

  createFlag:boolean = true;
  datalist: any = [];
  strReportHeadName: any = 'Daily Sales Report';
  constructor(public dailyService: DailySalesService) { }

  ngOnInit() {

  }

  getDailyReportTable() {


    this.dailyService.onGetDailyReportTable(this.fromDate, this.toDate)
      .subscribe(data => {
     let jsonObj = JSON.parse(data);
     this.datalist = jsonObj;
     this.createFlag = false;
    })
  }

  myPageChange(eve) {
    this.createFlag = true;
    this.datalist = '';
  }
}
