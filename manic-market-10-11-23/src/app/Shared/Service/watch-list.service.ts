import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AppSetting } from '../Model/app-setting.model';
import { ResponseModel } from '../Model/common-model.model';
import { BaseAPIService } from './base-api.service';

@Injectable({
  providedIn: 'root'
})
export class WatchListService {

  constructor(private readonly _baseService: BaseAPIService) { }

  GetWatchList(): Observable<ResponseModel> {
    return this._baseService.get(AppSetting.watchListUrl);
  }

  GetWatchListbyslug(slug): Observable<ResponseModel> {
    return this._baseService.get(AppSetting.watchListUrl + slug);
  }
  GetWatchListslug(slug): Observable<ResponseModel> {
    return this._baseService.get(AppSetting.watchListUrlSlug + slug);
  }
  TokenVarify(token, email): Observable<ResponseModel> {
    var stringdata = "?token=" + token + "&email=" + email
    return this._baseService.get(AppSetting.tokenvarify + stringdata);
  }
  Resendemail(key): Observable<ResponseModel> {
    const formData = new FormData();
    formData.append('username_or_email', key);
    return this._baseService.post(AppSetting.resendEmail, formData);
    
  }
  forgetPassword(token, email,password): Observable<ResponseModel> {
    const formData = new FormData();
    formData.append('token', token);
    formData.append('email', email);
    formData.append('password', password);
    return this._baseService.post(AppSetting.forgetpasswordChange, formData);
  }

  GetWatchListNewsbyslug(slug, page, limit, filter, filter_symbol,date): Observable<ResponseModel> {
    return this._baseService.get(AppSetting.watchListNewsUrl + slug + "/?page=" + page + "&limit=" + limit + "&filter=" + filter + "&filter_symbol=" + filter_symbol + "&date=" + date);
  }
  AddWatchListTop(slug): Observable<ResponseModel> {
    return this._baseService.post(AppSetting.addtopfive + slug + "/", null);
  }
  feedback(id): Observable<ResponseModel> {
    return this._baseService.post(AppSetting.feebackCreate + id + "/", null);
  }
  removeWatchListTop(slug): Observable<ResponseModel> {
    return this._baseService.Delete(AppSetting.deletetopfive + slug + "/", null);
  }
  GetWatchListTop(): Observable<ResponseModel> {
    return this._baseService.get(AppSetting.gettopfive);
  }
  loginCount(): Observable<ResponseModel> {
    return this._baseService.get(AppSetting.loginuserCount);
  }

  AddWatchList(key): Observable<ResponseModel> {
    const formData = new FormData();
    formData.append('company', key);
    return this._baseService.post(AppSetting.watchListCreateUrl, formData);
  }

  WatchListNameDrag(key): Observable<ResponseModel> {
    const formData = new FormData();
    formData.append('ids', key);
    return this._baseService.put(AppSetting.watchListDragname, formData);
  }
  TopfiveindexDrag(key): Observable<ResponseModel> {
    const formData = new FormData();
    formData.append('symbols', key);
    return this._baseService.put(AppSetting.topfiveindexchange, formData);
  }
  WatchListListyDrag(key,list): Observable<ResponseModel> {
    const formData = new FormData();
    formData.append('symbols', list);
    formData.append('slug', key);
    return this._baseService.put(AppSetting.watchListDraglist, formData);
  }
  bulk_update(key): Observable<ResponseModel> {

    return this._baseService.put(AppSetting.bulk_update + key + "/", null);
  }

  DeleteWatchList(key): Observable<ResponseModel> {
    return this._baseService.Delete(AppSetting.watchListDeleteUrl + key);
  }
  GetnewsByfilter(slug, page, limit, filter,date): Observable<ResponseModel> {
    return this._baseService.get(AppSetting.GetnewsByfilterslug + slug + "/?page=" + page + "&limit=" + limit + "&filter=" + filter +"&date="+date);
  }

  GetNewsList(): Observable<ResponseModel> {
    return this._baseService.get(AppSetting.getNewsUrl);
  }
}
