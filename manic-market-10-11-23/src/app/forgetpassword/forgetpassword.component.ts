import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AppComponent } from '../app.component';
import { AppSetting } from '../Shared/Model/app-setting.model';
import { AccountsService } from '../Shared/Service/accounts.service';
import { BaseAPIService } from '../Shared/Service/base-api.service';
import { CommonHelperService } from '../Shared/Service/common-helper.service';
import { Router } from '@angular/router';
import { MessageTitleEnum, PopupMessageTypeEnum } from '../Shared/Enum/fixed-value.enum';


@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.css']
})
export class ForgetpasswordComponent implements OnInit {
  email: ''
  login:any;

  constructor(
    private _baseService: BaseAPIService,
    private common: CommonHelperService,
    public readonly _accountService: AccountsService,
    private readonly appCoponent: AppComponent,
    private readonly _router: Router,
    private account: AccountsService,
    private readonly _commonService: CommonHelperService,
  ) {
    this._accountService.isLoggedIn.subscribe(data => {
      this.login=data;
    
    });
    this.appCoponent.setLayout(true, true, true);
   }

  ngOnInit(): void {
    if(this.login === true){
      this._router.navigate(['home']);
     }
  }

  forgetPassword() {
    if (this.email) {
      const form = new FormData();
      form.append('email', this.email);
      this._baseService.post(AppSetting.passwordChange, form)
      .subscribe((res) => {
        if(res.isSuccess){
          this.gotologin()
           //this._commonService.showAlert("Sucess!", res?.message, PopupMessageTypeEnum.Success)
        }
        // else{
        //    this._commonService.showAlert("Opps!", res.message, PopupMessageTypeEnum.Warning)
        // }
      });
    }
  }

  gotologin() {
    this._router.navigate(['login']);
  }
}
