import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../app.component';
import { LoginModel } from '../Shared/Model/account.model';
import { AccountsService } from '../Shared/Service/accounts.service';
import { Symbol } from '../Shared/Model/watch-list.model';
import { CommonHelperService } from '../Shared/Service/common-helper.service';
import { MessageTitleEnum, PopupMessageTypeEnum } from '../Shared/Enum/fixed-value.enum';
import { BaseAPIService } from '../Shared/Service/base-api.service';
import { AppSetting } from '../Shared/Model/app-setting.model';
import { WatchListService } from 'src/app/Shared/Service/watch-list.service';
import { SocialAuthService, GoogleLoginProvider, FacebookLoginProvider, SocialUser } from 'angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user!: SocialUser;
  model = new LoginModel();
  redirectForm: string;
  symbol: string;
  frmGroup: FormGroup;
  IsAddToWatchList: boolean = false;
  feedbackInput = '';
  confirmemail: any;
  email: any;
  isLoggedIn: boolean;
  userInfo;
  message
  constructor(private readonly _accountService: AccountsService,
    private readonly fb: FormBuilder,
    private readonly _router: Router,
    private readonly _watchListService: WatchListService,
    private socialAuthService: SocialAuthService,
    private _route: ActivatedRoute, private readonly appCoponent: AppComponent,
    private readonly _commonService: CommonHelperService,
    private base: BaseAPIService
  ) {
    this._accountService.isLoggedIn.subscribe(data => {
      this.isLoggedIn = data;
    });
    this._commonService.loginpage.subscribe(data => {
      this.confirmemail = false;
    });
    if (this._route.snapshot.params.redirectForm) {
      this.redirectForm = this._route.snapshot.params.redirectForm;
    }
    if (this._route.snapshot.params.symbol) {
      this.symbol = this._route.snapshot.params.symbol;
    }
    if (this._route.snapshot.params.IsAddToWatchList) {
      this.IsAddToWatchList = this._route.snapshot.params.IsAddToWatchList as boolean;
    }
    this.appCoponent.setLayout(true, true, true);
  }
  ngOnInit(): void {
    this.confirmemail = false;
    this.formInit();
    this.getActiveUser();
  }
  facebookSignin(): void {
    // this.socialAuthService.signOut()
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then(x => {
      if (x.authToken) {
        this._accountService.facebooklogin(x.authToken).subscribe(response => {
          if (response.isSuccess) {
            this._accountService.setLoginuserDetail(response.data)
            if (this.symbol?.length > 0) {
              switch (this.redirectForm) {
                case "company-profile":
                  this._router.navigate([this.redirectForm + '/' + this.symbol + '/' + this.IsAddToWatchList]);
                  break;
                default:
                  this._router.navigate([this.redirectForm]);
                  break;
              }
            } else {
              this._router.navigate(['watchlist']);
            }
            
          }
        })
      }
    }
    );
  }
  signInWithGoogle(): void {
    // this.socialAuthService.signOut()
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(x => {
      if (x.idToken) {
        this._accountService.googlelogin(x.idToken).subscribe(response => {
            if (response.isSuccess) {
              this._accountService.setLoginuserDetail(response.data)
              if (this.symbol?.length > 0) {
                switch (this.redirectForm) {
                  case "company-profile":
                    this._router.navigate([this.redirectForm + '/' + this.symbol + '/' + this.IsAddToWatchList]);
                    break;
                  default:
                    this._router.navigate([this.redirectForm]);
                    break;
                }
              } else {
                this._router.navigate(['watchlist']);
                setTimeout(function() {
                  window.location.reload();
                },100);
              }
            }
          })
      }
    }
    );;
  }
  formInit() {
    this.frmGroup = this.fb.group({
      Username: [null, Validators.compose([Validators.required])],
      Password: [null, Validators.compose([Validators.required])],
    });
  }

  onSubmit() {
    this.frmGroup.markAllAsTouched();
    if (this.frmGroup.valid) {
      this._accountService.login(this.model).subscribe(
        response => {
          if (response.isSuccess) {
            this._accountService.setLoginuserDetail(response.data)
            if (this.symbol?.length > 0) {
              switch (this.redirectForm) {
                case "company-profile":
                  this._router.navigate([this.redirectForm + '/' + this.symbol + '/' + this.IsAddToWatchList]);
                  break;
                default:
                  this._router.navigate([this.redirectForm]);
                  break;
                }
            } else {
              this._router.navigate(['watchlist']);
            }
          }
          else {
            if (response.isSuccess == false && response?.data?.is_email == false) {
              this.email = response?.data?.email;
              this.confirmemail = true;
            }
            else {
              //  this._commonService.showAlert("Opps!", response.message, PopupMessageTypeEnum.Warning)
              this.message = response.message;
            }
          }
        }, error => {
          //this._commonService.showAlert("Opps!", MessageTitleEnum.InvalidUser, PopupMessageTypeEnum.Warning)
        }
      );
    } else {
    }
  }
  resendmail() {
    this.email && (
      this._watchListService.Resendemail(this.email).subscribe(response => {
        if (response.isSuccess) {
          // this._commonService.showAlert("Sucess!", response?.message, PopupMessageTypeEnum.Success)
        } 
        // else {
        //  this._commonService.showAlert("Opps!", response?.message, PopupMessageTypeEnum.Info)
        // }
      })
    )
  }
  getActiveUser() {
    this.base.get(AppSetting.getProfile).subscribe((user) => {
      this.userInfo = user.data;
    });
  }
  saveFeedback() {
    const feedback = {
      // email: '',
      feedback: this.feedbackInput
    }
    this.base.post(AppSetting.feebackCreate + (this.userInfo.id)+ '/', feedback).subscribe(() => {
      this._commonService.showSuccessAlert('Thank you for the feedback! Please continue to share any ideas to help improve the site!');
    })
  }
  gotoLoginPage() {
    if ((!this.isLoggedIn)) {
      this._router.navigate(['/login']);
    }
  }
}