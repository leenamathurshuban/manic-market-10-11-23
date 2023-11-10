import { Injectable } from '@angular/core';
import { IDictionary } from '../Model/dictionary.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class BaseAPIService {


  constructor(private readonly _httpClient: HttpClient) { }

  get(endPoint: string, params?: IDictionary<string>) {
      let httpParams;
      if (params) {
          httpParams = this.buildParams(params);
      }
      var data = this._httpClient.get(endPoint,
          { params: httpParams }).pipe(map(res =>
              JSON.parse(JSON.stringify(res))));
      return data;
  }

  post(endPoint: string, requestObject: any) {
      return this._httpClient.post(endPoint, requestObject, { headers: { 'Accept': 'application/*' } }).pipe(map(res => JSON.parse(JSON.stringify(res))));
  }

  public put(endPoint: string, requestObject: any) {
      return this._httpClient.put(endPoint, requestObject).pipe(map(res => JSON.parse(JSON.stringify(res))));
  }

  public Delete(endPoint: string, params?: any) {
      let httpParams;
      if (params) {
          httpParams = this.buildParams(params);
      }
      return this._httpClient.delete(endPoint, httpParams).pipe(map(res => JSON.parse(JSON.stringify(res))));
  }

  getList(endPoint: string, params?: IDictionary<string>) {
      let httpParams;
      if (params) {
          httpParams = this.buildParams(params);
      }
      var data = this._httpClient.get(endPoint, { params: httpParams }).pipe(map(res => JSON.parse(JSON.stringify(res))));
      return data;
  }

  /**
    * buildParams - Converts from Dictionary to HttpParams
    */
  public buildParams(params: IDictionary<string>): HttpParams {
      let httpParams = new HttpParams();
      if (params) {
          const keys: string[] = params.Keys();
          keys.forEach(key => {
              httpParams = httpParams.append(key, params.Item(key));
          });
      }
      return httpParams;
  }

}
