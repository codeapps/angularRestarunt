import { Component, OnInit } from '@angular/core';
import { AccountHeadService } from '../master/account-head/account-head.service';
import { DailySalesService } from '../reports/sales-report/daily-sales/daily-sales.service';
import { KotListService } from '../restarunt/kot-list/kot-list.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dBranchId = localStorage.getItem("SessionBranchId");

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Sales Orders';
  single = [ ];
  chartData = [];

  public reportview = [];

  public totalCustomerCount: number = 0;
  public totalKotBillCount: number = 0;
  public totalSalesCount: number = 0;
  public totalSalesMonthCount:number = 0;
  constructor(private accService: AccountHeadService,public dailyService: DailySalesService,
    private kotService: KotListService) { }
  ngOnInit(): void {
    this.onCustomerGet();
  }

  onCustomerGet() {
    this.accService.fnAccountGets('Customer', '').subscribe(res => {
      let customerData = JSON.parse(res);
      this.totalCustomerCount = customerData.length;
      this.kotList();
    })
  }

  kotList() {

    this.kotService.onKotBillGetOnTableDetailId()
    .subscribe(data => {
      const kotListSource = JSON.parse(data);
      this.totalKotBillCount = kotListSource.length;
      this.fnGetAllSales();
    })
  }
  fnGetAllSales() {
    this.dailyService.onGetAllSAles()
      .subscribe(res => {
        const jsonObj:any[] = JSON.parse(res);
        this.totalSalesCount = jsonObj.length;

        let chrtarray:any = []
        jsonObj.forEach(element => {
          let year = new Date(element.Issues_Date).getFullYear();

          let obj = {
                "name": year,
                "value": element.Issues_Total
          }
          chrtarray.push(obj)
        });

        let clean = chrtarray.filter((arr, index, self) =>
          index === self.findIndex((t) => (t.name === arr.name && t.value === arr.value)));
          this.single = clean;
          let clean2 = chrtarray.filter((arr, index, self) =>
          index === self.findIndex((t) => (t.name === arr.name)));

        let arrayChart = [];
          clean2.map((arr, index, self) => {
            let findArr = clean.filter(ele => ele.name === arr.name);

            let objArray = {
              "name": `Order ${arr.name}`,
              "series": findArr
            }
            arrayChart.push(objArray)
          });

        this.chartData = arrayChart;
        this.chartData.push({
          "name": "order 2010",
          "series": [
            {
              "name": "2010",
              "value": 7300000
            },
            {
              "name": "2011",
              "value": 8940000
            }
          ]
        },)



      this.onDailySaleGet();
    })
  }
  onDailySaleGet() {
    const from:any = new Date(new Date().setDate(1));
    const toDate = new Date();

    this.dailyService.onGetDailyReportTable(from, toDate)
      .subscribe(res => {

        const jsonObj = JSON.parse(res);
        this.totalSalesMonthCount = jsonObj.length;
      this.onReportView();
    })
  }
  onReportView() {
    let average:any = ((this.totalSalesMonthCount / this.totalSalesCount) * 100);
    this.reportview = [{
      name: 'Total Orders',
      count: Number(this.totalKotBillCount),
      color: 'red'
    }, {
      name: 'Total Customers',
      count: this.totalCustomerCount,
      color: 'blue'
    }, {
      name: 'Avg. Sales per Month',
      count: `${parseFloat(average || 0).toFixed(2)} %`,
      color: 'green'
    }, {
      name: 'Table Revenue',
      count: '145.00',
      color: 'darkmagenta'
    }, {
      name: 'Total Sales',
      count: Number(this.totalSalesCount),
      color: 'coral'
    }, {
      name: 'Total Menus',
      count: '40%',
      color: 'violet'
    }
    ];


  }
}
