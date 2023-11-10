import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AppComponent } from '../app.component';
import { AppSetting } from '../Shared/Model/app-setting.model';
import { AccountsService } from '../Shared/Service/accounts.service';
import { BaseAPIService } from '../Shared/Service/base-api.service';
import { CommonHelperService } from '../Shared/Service/common-helper.service';
import { Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.css']
})
export class ProfileUpdateComponent implements OnInit {
  userInfo;
  url = 'https://api.manicmarket.com';
  changePassword = false;
  password = { old_password: '', password: ''};
  passwordFlag = false;
  feedbackInput = '';
  image = '';
  imageSelec;
  watchlist_view = '';
  login:any;
  token:any;
  user: any;
  constructor(
    private _baseService: BaseAPIService,
    private common: CommonHelperService,
    public readonly _accountService: AccountsService,
    private readonly appCoponent: AppComponent,
    private readonly _router: Router,
    private account: AccountsService,
    private _baseApi: BaseAPIService,
    private socialAuthService: SocialAuthService,
    public _commonService: CommonHelperService,
  ) {
    
    this._accountService.isLoggedIn.subscribe(data => {
      this.login=data;
    
    });
    this.appCoponent.setLayout(true, true, true);
  }

  ngOnInit(): void {
     if(this.login === false){
      this._router.navigate(['login']);
     }
    this.getActiveUser();
  }

  getActiveUser() {
    this._baseService.get(AppSetting.getProfile).subscribe((user) => {
      this.userInfo = user.data;
      if (this.userInfo.image) {
        this.userInfo.image = this.userInfo.image;
        this.common.profilePic = this.userInfo.image;
      }
    });
  }

  saveDetails() {
    const form = new FormData();
    form.append('username', this.userInfo.username)
    form.append('first_name', this.userInfo.first_name);
    form.append('last_name', this.userInfo.last_name);
    form.append('email', this.userInfo.email);
    form.append('watchlist_view', this.userInfo.watchlist_view);
    if (this.imageSelec)
      form.append('image', this.imageSelec);
    this.updatePassword();
    this._baseService.post(AppSetting.editProfile, form)
      .subscribe((user) => {
        if (user.isSuccess) {
          this.getActiveUser();
          this.account.updateUserInfo(user.data);
          //this.common.showSuccessAlert('User Updated');
            setTimeout(function(){
              window.location.reload();
            },100);
        } 
        else {
          this.common.showErrorAlert('Not able to update');
         }
      });
  }

  showPasswordBox() {
    this.passwordFlag = true;
  }

  uploadFile($event) {
    const ele = document.getElementById('file');
    ele.click();
    if ($event.target.files && $event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL($event.target.files[0]);
      this.imageSelec = $event.target.files[0]; // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.userInfo.image = event.target.result;
      }
    }
    // this.imageSelec = $event.target.files[0];
    // if ($event.target.files[0]) {
    //   const form = new FormData();
    //   // form.append('image', $event.target.files[0]);
    //   // form.append('first_name', this.userInfo.first_name);
    //   // form.append('last_name', this.userInfo.last_name);
    //   // this.userInfo['image'] = $event.target.files[0];
    //   this._baseService.post('https://api.manicmarket.com/api/v1/account/user/profile/edit/', form)
    //   .subscribe((updatedUser) => {
    //     if (updatedUser.isSuccess) {
    //       this.common.showSuccessAlert('Profile Updated');
    //     } else {
    //       this.common.showErrorAlert('Not able to update');
    //     }
    //   });
    // }
  }

  resetChanges() {
    this.getActiveUser();
    this.passwordFlag = false;
    this.password.old_password = '';
    this.password.password = '';
  }

  updatePassword() {
    if (this.password.old_password && this.password.password) {
      const form = new FormData();
      form.append('old_password', this.password.old_password);
      form.append('password', this.password.password);
      this._baseService.post(AppSetting.updatePassword, form)
      .subscribe((updated) => {
        if (updated.message == 'Successfully password changed') {
          this.changePassword = false;
          this.password.old_password = '';
          this.password.password = '';
          // this.common.showSuccessAlert('Password Updated');
        } 
        // else {
        //   // this.common.showErrorAlert('Incorrect Password Information');
        // }
      });
      
    }
  }
  saveFeedback() {
    const feedback = {
      // email: this.userInfo.email,
      feedback: this.feedbackInput
    }
    this._baseService.post(AppSetting.feebackCreate+ (this.userInfo.id)+ '/', feedback).subscribe(() => {
       this.common.showSuccessAlert('Thank you for the feedback! Please continue to share any ideas to help improve the site!');
    })
  }

  deleteProfile() {
    this._accountService.deleteProfile().subscribe((response) => {
      if (response.status) {
        this.socialAuthService.signOut();
        this._commonService.removeStorage('isAuthenticated');
        this._commonService.removeStorage('userDetail');
        this._commonService.removeStorage('token');
        this._router.navigate(['login']);
        // setTimeout(function(){
        //     window.location.reload();
        // },100);
      }
    });
  }
  gotoLoginPage() {
    if ((!this.login)) {
      this._router.navigate(['/login']);
    }
  }
}
