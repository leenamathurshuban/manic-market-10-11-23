import { Injectable } from '@angular/core';
import { LoginModel, SignUpPostModel, UserViewModel } from '../Model/account.model';
import { AppSetting } from '../Model/app-setting.model';
import { BaseAPIService } from './base-api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ResponseModel } from '../Model/common-model.model';
import { CommonHelperService } from './common-helper.service';
import { Router } from '@angular/router';
import { SocialAuthService, GoogleLoginProvider, FacebookLoginProvider, SocialUser } from 'angularx-social-login';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  UserViewModel = new UserViewModel();
  private loggedIn = new BehaviorSubject<boolean>(false); // {1}
  private topfive = new BehaviorSubject<boolean>(false); // {1}
  userDetail = new BehaviorSubject<UserViewModel>(this.UserViewModel);
  get isLoggedIn() {
    return this.loggedIn.asObservable(); // {2}
  }


  get istopfive() {
    return this.topfive.asObservable(); // {2}
  }
  changetopfive() {
    this.topfive.next(!this.topfive);
  }

  constructor(private readonly _baseService: BaseAPIService,
    private _commonService: CommonHelperService,
    private readonly _router: Router,
    private socialAuthService: SocialAuthService,

  ) {
    this.getLoginUserDetail();
  }

  signUp(model: SignUpPostModel): Observable<ResponseModel> {
    const formData = new FormData();
    formData.append('username', model.Username);
    formData.append('password', model.Password);
    formData.append('email', model.Email);
    formData.append('first_name', model.First_name);
    formData.append('last_name', model.Last_name);
    formData.append('image', model.image);
    return this._baseService.post(AppSetting.signUpUserUrl, formData);

  }

  login(model: LoginModel): Observable<ResponseModel> {
    const formData = new FormData();
    formData.append('username_or_email', model.Username);
    formData.append('password', model.Password);
    return this._baseService.post(AppSetting.loginUserUrl, formData);

  }
  googlelogin(model): Observable<ResponseModel> {
    const formData = new FormData();
    formData.append('auth_token', model);
    return this._baseService.post(AppSetting.googleloginUserUrl, formData);
  }
  facebooklogin(model): Observable<ResponseModel> {
    const formData = new FormData();
    formData.append('auth_token', model);
    return this._baseService.post(AppSetting.facebookloginUserUrl, formData);
  }
  setGoogleLoginuserDetail(model:any) {
    if (model) {
      this._commonService.setStorage("SessionTime", String(new Date().setHours(24)));
      this._commonService.setStorage("isAuthenticated", "true");
      this._commonService.setStorage("userDetail", JSON.stringify(model));
      this._commonService.setStorage("token", model?.tokens?.access);
      this.loggedIn.next(true);
      this.userDetail.next(model);
    }

  }
  setLoginuserDetail(model: UserViewModel) {
    if (model) {

      this._commonService.setStorage("SessionTime", String(new Date().setHours(24)));
      this._commonService.setStorage("isAuthenticated", "true");
      this._commonService.setStorage("userDetail", JSON.stringify(model));
      this._commonService.setStorage("token", model.token);


      this.loggedIn.next(true);
      this.userDetail.next(model);
    }

  }

  updateUserInfo(userInfo) {
    this._commonService.setStorage("userDetail", JSON.stringify(userInfo));
    this.userDetail.next(userInfo);
  }

  getLoginUserDetail(): UserViewModel {

    if (this._commonService.getStorage("isAuthenticated") && this._commonService.getStorage("isAuthenticated") == "true" && Number(this._commonService.getStorage("SessionTime")) > Number(new Date().getTime())) {
      this.loggedIn.next(true);
      this.UserViewModel = JSON.parse(this._commonService.getStorage("userDetail"));
      this.userDetail.next(this.UserViewModel)
      return this.UserViewModel;
    } else {
      this._commonService.removeStorage("isAuthenticated")
      this._commonService.removeStorage("userDetail")
      this._commonService.removeStorage("token")
      this.loggedIn.next(false);
    }
    return this.UserViewModel;
  }


  UserLogout(): Observable<ResponseModel> {
    return this._baseService.Delete(AppSetting.userlogOut);
  }
  deleteProfile(): Observable<ResponseModel> {
    return this._baseService.Delete(AppSetting.deleteuserSelf);
  }
  // logOut() {
  //   this.logoutApi()
  //   this.socialAuthService.signOut()
  //   this._commonService.removeStorage("isAuthenticated");
  //   this._commonService.removeStorage("userDetail");
  //   this._commonService.removeStorage("token");
  //   this.loggedIn.next(false);
  //   this._router.navigate(['login']);
    

  // }

}
