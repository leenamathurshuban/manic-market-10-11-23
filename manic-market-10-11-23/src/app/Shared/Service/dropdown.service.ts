import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSetting } from '../Model/app-setting.model';
import { ResponseModel } from '../Model/common-model.model';
import { BaseAPIService } from './base-api.service';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  constructor(private readonly _baseService: BaseAPIService) { }

  getDDLSector(): Observable<ResponseModel>{
    return this._baseService.get(AppSetting.SectorDDLURL);

  }
  getcountryapi(): Observable<ResponseModel>{
    return this._baseService.get(AppSetting.countrylistget);

  }
  getDDLIndustry(): Observable<ResponseModel>{
    return this._baseService.get(AppSetting.industryDDLURL);

  }
}
