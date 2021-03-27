import { Component, OnInit } from '@angular/core';
import { KotListService } from './kot-list.service';

@Component({
  selector: 'app-kot-list',
  templateUrl: './kot-list.component.html',
  styleUrls: ['./kot-list.component.scss']
})
export class KotListComponent implements OnInit {
  kotListSource:any = [];

  constructor(private kotService: KotListService) { }

  ngOnInit(): void {
    this.fnKotBillGetOnTableDetailId();
  }

  fnKotBillGetOnTableDetailId() {

    this.kotService.onKotBillGetOnTableDetailId()
    .subscribe(data => {
      this.kotListSource = JSON.parse(data);

    })
  }

}
