import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AppService } from '../app.service';
import { NavigationEnd, Router } from '@angular/router';
import { CalculatorComponent } from '../shared/calculator/calculator.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  constructor(private router: Router, private appService: AppService, public dialog: MatDialog) { }
  @ViewChild('sidenav') private menu: MatSidenav;
  public config: PerfectScrollbarConfigInterface = {};
  mode = 'over' // 'side';
  opened = true;
  ngOnInit(): void {
    // this.appService.user.subscribe(x => );
    if (!this.appService.userValue) {
      this.router.navigate(['/']);
    }

    if (window.innerWidth < 960) {
      this.mode = 'over';
      this.opened = false;
    }

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          this.menu.close()
        }, 100);

      }
    });
    setTimeout(() => {
      this.menu.close()
    }, 100);
  }
  logout() {
    this.appService.logout();
  }

  ncount = 0;
  openCalculator() {
    this.ncount += 1;
    this.dialog.open(CalculatorComponent, {
      width: 'auto',
      hasBackdrop: false,
      autoFocus: true,
      data: { count: this.ncount }
    });

  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.keyCode == 81) {
      this.openCalculator();
    }
  }
}
