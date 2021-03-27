import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'charset=utf-8'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private userSubject: BehaviorSubject<any>;
  public user: Observable<any>;
  constructor(private router: Router, public http: HttpClient, private _snackBar: MatSnackBar) {
    this.userSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
  }


  get(endpoint: string) {

    return this.http.get(`${environment.apiUrl}/${endpoint}`);
  }

  post(endpoint: string, body: any) {
    return this.http.post<any>(`${environment.apiUrl}/${endpoint}`, body, httpOptions);
  }

  put(endpoint: string, body: any) {
    return this.http.put(`${environment.apiUrl}/${endpoint}`, body, httpOptions);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: 'top'
    });
  }

  public get userValue() {
    return this.userSubject.value;
  }

  login(form) {

    let AccountHead = {};
    AccountHead['UserName'] = form.userName;
    AccountHead['Pwd'] = form.password;
    AccountHead['BranchId'] = form.branchId;
    let body = JSON.stringify(AccountHead);

    return this.post(`Master/StaffLogin`, body)
      .pipe(map(data => {
        let user = JSON.parse(data);
        if (user.length > 0) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('user', JSON.stringify(user[0]));
          this.userSubject.next(user[0]);
        }
        return data;
      }));
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    localStorage.removeItem('SessionBranchId');
    localStorage.removeItem('SessionStaffId');
    localStorage.removeItem('SessionAccessLevelId');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
}
