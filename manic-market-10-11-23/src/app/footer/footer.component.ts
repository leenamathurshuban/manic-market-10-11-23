import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserViewModel } from '../Shared/Model/account.model';
import { AppSetting } from '../Shared/Model/app-setting.model';
import { AccountsService } from '../Shared/Service/accounts.service';
import { BaseAPIService } from '../Shared/Service/base-api.service';
import { CommonHelperService } from '../Shared/Service/common-helper.service';
import { ChatroomComponent } from '../chatroom/chatroom.component';
import { webSocket } from 'rxjs/webSocket';
import { websocketurl, imagepath } from 'src/environments/environment';
import { HeaderComponent } from '../header/header.component';
import { SocialAuthService } from 'angularx-social-login';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  public _userDetail = new UserViewModel();
  userCount: any;
  userDetail: Observable<UserViewModel>;
  url = 'https://api.manicmarket.com';
  login:any;
  ChatSocket: any;
  participant : any = [];
  isSuperUser = false;
  UserSocket: any;
  loginCount: any;
  constructor(
    private router: Router,
    private _baseService: BaseAPIService,
    public readonly _accountService: AccountsService,
    public _commonService: CommonHelperService,
    private socialAuthService: SocialAuthService,
    private readonly _router: Router,
  ) {
    this._accountService.isLoggedIn.subscribe(data => {
      this.login = data;
    });
    this.userDetail = this._accountService.userDetail;
   }
  async ngOnInit() {
    this.userDetail.subscribe(data => {
      this._userDetail = data;
      this._commonService.profilePic = this.url + this._userDetail.image
      if (this._userDetail.is_superuser) {
        this.isSuperUser = true;
      }
    });
    this.setFooterElement();
    this.userloginCount();
  }

  gotoPageTab(page) {
    document.getElementById('xs-navbar1').classList.remove('fl-open');
    if (page === 'investor-dictionary') {
      this._commonService.adminDictonary = true;
    }
    if (page === 'quotes') {
      this._commonService.adminQuote = true;
    }
    if (page == 'logout') {
      this._userDetail = null;
      this.userCount();
    } else {
      this.router.navigate([page]);
    }
  }
  getActiveUser(): Promise <any> {
    return new Promise((resolve, reject) => {
      this._baseService.get(AppSetting.getProfile).subscribe((user) => {
        this._userDetail = user.data;
        if (this._userDetail) {
          this._commonService.profilePic = this.url + this._userDetail.image
        }
        resolve(true);
      });
    })
  }
  setFooterElement() {
      setTimeout(() => {
        this.clearAllTab();
        if (this.router.url === '/screener') {
          document.getElementById('tab3').classList.add('active');
        } else if (this.router.url === '/home') {
          document.getElementById('tab1').classList.add('active');
        } else if (this.router.url === '/watchlist') {
          document.getElementById('tab2').classList.add('active');
        } else if (this.router.url === '/dictionary') {
          document.getElementById('tab4').classList.add('active');
        } else if (this.router.url === '/quotes') {
          document.getElementById('tab5').classList.add('active');
        } else if (this.router.url === '/login' && this.router.url == null) {
          document.getElementById('tab6').classList.add('active');
        }
      }, 100);
  }
  clearAllTab() {
    ['tab1', 'tab2', 'tab3', 'tab4', 'tab5', 'tab6'].forEach((element) => {
       if (document.getElementById(element)) {
        document.getElementById(element).classList.remove('active');         
       }
    });
  }
  gotoPage(page, id) {
    this.clearAllTab();
    if (page === 'investor-dictionary') {
      this._commonService.adminDictonary = false;
    }
    if (page === 'quotes') {
      this._commonService.adminQuote = false;
     
    }
    document.getElementById(id).classList.add('active');
    if (page == 'home' || page == 'screener' || page == 'investor-dictionary' || page == 'login' || page == 'quotes') {
      this.router.navigate([page]);
    }
    document.getElementById(id).classList.add('active');
    if (page == 'quotes') {
      this.router.navigate([page]);
      this._router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
        this._router.navigate(['quotes']);
    });
    }
    if (page === 'side-bar') {
      document.getElementById('xs-navbar1').classList.add('fl-open');
    }
   
  }
  closeMenu() {
    document.getElementById('xs-navbar1').classList.remove('fl-open');
  }

// code update by salim
userLogout() {
  this._accountService.UserLogout().subscribe((response) => {
    if (response.status) {
      this.socialAuthService.signOut();
      this._commonService.removeStorage('isAuthenticated');
      this._commonService.removeStorage('userDetail');
      this._commonService.removeStorage('token');
      this._router.navigate(['login']);
    }
  });
}

userloginCount() {
  this.UserSocket = webSocket(`${websocketurl.url}/ws/stock/user/login/count/`);
    this.UserSocket.subscribe((msg) => {
      this.loginCount = msg.login_count;
    });
}

}
