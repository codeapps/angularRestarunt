import { Injectable } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private _appService: AppService) { }

 public fngetCategory(searchText){
   return this._appService.get('GetRepository/SearchCategory?terms=' + searchText)
  }
}
