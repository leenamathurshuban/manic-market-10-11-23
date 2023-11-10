import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse, HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoaderService } from './loader.service';
import { finalize } from 'rxjs/operators';
import { AccountsService } from '../Service/accounts.service';
import { CommonHelperService } from '../Service/common-helper.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];

  constructor(private loaderService: LoaderService, private _commonService: CommonHelperService) { 
 
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    
    this.loaderService.show();
    let Token = this._commonService.getStorage("token") != null ? this._commonService.getStorage("token") : null;
    if (Token != null && req?.url?.search("https://raw.githubusercontent.com") < 0) {
      req = req.clone({
        setHeaders: {
          Authorization: "Bearer " + Token,
        }
      });
    }

    return next.handle(req).pipe(
      finalize(() =>  this.loaderService.hide()));

  }
}
