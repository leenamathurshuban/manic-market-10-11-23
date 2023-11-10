import { BaseAPIService } from './base-api.service';
import { Injectable } from '@angular/core';
import { AppSetting } from '../Model/app-setting.model';
import { Dictionary } from '../Model/dictionary.model';
import { Observable } from 'rxjs';
import { CompanySearchViewModel } from '../Model/company.model';
import { SuggestionViewModel } from '../Model/suggestion-view-model.model';
import { ResponseModel, IndexModel, ScreenerFilterModel } from '../Model/common-model.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private readonly _baseService: BaseAPIService) { }

 
  CompanySearch(key: string): Observable<ResponseModel> {
    var param = new Dictionary<any>();
    param.Add("key", encodeURI(key));

    return this._baseService.get(AppSetting.companySearchURL + encodeURI(key));
  }

  CompanyDetail(key: string): Observable<ResponseModel> {

    return this._baseService.get(AppSetting.companyDetailURL + encodeURI(key));
  }
  CompanyNewsDetail(slug: string): Observable<ResponseModel> {

    return this._baseService.get(AppSetting.getNewsUrlslug + encodeURI(slug));
  }
  CompanyNews(key: string): Observable<ResponseModel> { 
    return this._baseService.get(AppSetting.getNewsUrl + encodeURI(key));
  }

  CompanyFinancial(key: string): Observable<ResponseModel> {

    return this._baseService.get(AppSetting.getFinanceinfo + encodeURI(key));
  }
  
  Companycashflow(key: string): Observable<ResponseModel> {

    return this._baseService.get(AppSetting.getcashflowinfo + encodeURI(key));
  }
  CompanyIncome(key: string): Observable<ResponseModel> {

    return this._baseService.get(AppSetting.getIncomeinfo + encodeURI(key));
  }
  CompanyNumber(key: string): Observable<ResponseModel> {

    return this._baseService.get(AppSetting.getNumberinfo + encodeURI(key));
  }
  // CompanyLogoget(key: string): Observable<ResponseModel> {

  //   return this._baseService.get(AppSetting.symbollLogoget + encodeURI(key));
  // }

  CompanyList(model: IndexModel): Observable<ResponseModel> {
    var param = new Dictionary<any>();
    param.Add("page", model.Page);
    param.Add("limit", model.PageSize);


    return this._baseService.get(AppSetting.screenerListURL, param);
  }


  ScreenerList(model: ScreenerFilterModel,page): Observable<ResponseModel> {
    const formData = new FormData();

    if (model.Country.length > 0) {
      formData.append('country', model.Country ? model.Country.toString() : "")
    }
    if (model.MarketCap && model.MarketCap.length > 0) {
      formData.append('MarketCap', model.MarketCap)
    }
    if (model.Sector != undefined) {
      formData.append('sector', model.Sector ? model.Sector.toString() : "")
    }
    if (model.Industry != undefined) {
      formData.append('industry', model.Industry ? model.Industry.toString() : "")
    }
    if (model.Price.Min > 0 || model.Price.Max > 0) {
      formData.append('Price', model.Price ? JSON.stringify(model.Price) : "")
    }
    formData.append('ColumnName', model.ColumnName.toLowerCase());
    formData.append('OrderBy', model.OrderBy ? "0" : "1");

    return this._baseService.post(`${AppSetting.screenerListURL}?page=${page}&limit=${model.PageSize}`, formData);
  }

  SuggestionList(key: string): Observable<ResponseModel> {
    return this._baseService.get(AppSetting.companySugestionURL + encodeURI(key));
  }
  Trending(): Observable<ResponseModel> {
    return this._baseService.get(AppSetting.companytrending);
  }


}
