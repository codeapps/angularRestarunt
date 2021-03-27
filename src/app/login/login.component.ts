import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  branchSource:any = [];
  returnUrl: string;
  loading = false;
  branchload = true;
  profileForm = new FormGroup({
    userName: new FormControl(''),
    password: new FormControl(''),
    branchId: new FormControl('0'),
  });
  constructor(private appService: AppService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.getBranch();

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  getBranch() {
    this.appService.get('GetRepository/branchGet').subscribe(data => {
      this.branchSource = data;
      this.profileForm.get('branchId').setValue(data[0].BranchId);

     setTimeout(() => {
      document.getElementById('txtUsername').focus();
     }, 500);
      this.branchload = false;
    }, error => {
        this.appService.openSnackBar('Api connection', 'error');
        this.branchload = false;
    })
  }

  onSubmit() {
    const form = this.profileForm.value;
    if (!form.userName) {
      // this.appService.openSnackBar('enter username', 'warning');
      return
    }
    if (!form.password) {
      // this.appService.openSnackBar('enter password', 'warning');
      return
    }
    if (!form.branchId) {
      this.appService.openSnackBar('Invalid branch', 'warning');
      return
    }
    this.loading = true;
    this.appService.login(form).pipe(first())
    .subscribe(
        data => {
          const auth = JSON.parse(data);
          if (auth.length) {
            let masterLogin = auth.map(data => data.Id);
            if (masterLogin[0]) {
              localStorage.setItem('SessionStaffId', '0');
              localStorage.setItem('SessionAccessLevelId','1');
             }
             else {
              localStorage.setItem('SessionStaffId', auth[0].StaffId);
              localStorage.setItem('SessionAccessLevelId', auth[0].AccessLevel);
             }
            localStorage.setItem('SessionBranchId', form.branchId);
            // localStorage.setItem('SessionBranchName', this.dBranchName);
            this.loading = false;
            this.appService.openSnackBar('Login', 'successfully');
            this.router.navigate([this.returnUrl]);
          } else {
            this.appService.openSnackBar('Invalid Login', 'warning');
            this.loading = false;
            return
          }
        },
        error => {
          this.appService.openSnackBar('server 500 response', 'warning');
            this.loading = false;
        });

  }
}
