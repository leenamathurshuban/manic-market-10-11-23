import { AccountsService } from './../Shared/Service/accounts.service';
import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ActivatedRoute, NavigationStart, Router, Event, ParamMap } from '@angular/router';
import { Select2Model } from '../Shared/Model/common-model.model';
import { SuggestionViewModel } from '../Shared/Model/suggestion-view-model.model';
import { CompanyService } from '../Shared/Service/company.service';
import { UserViewModel } from '../Shared/Model/account.model';
import { AppComponent } from '../app.component';
import { CommonHelperService } from '../Shared/Service/common-helper.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { MessageTitleEnum, PopupMessageTypeEnum } from '../Shared/Enum/fixed-value.enum';
import * as $ from 'jquery';
import { ChangeDetectorRef } from '@angular/core';
import { BaseAPIService } from '../Shared/Service/base-api.service';
import { AppSetting } from '../Shared/Model/app-setting.model';
import { SocialAuthService } from 'angularx-social-login';
import { websocketurl, imagepath } from 'src/environments/environment';
import { webSocket } from 'rxjs/webSocket';
import { WatchListService } from 'src/app/Shared/Service/watch-list.service';

declare const clicktable: any;
interface ReplacementItem {
  symbol : string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  loggedIn: any;
  // socialAuthService: any;
  isAuthenticated: Observable<boolean>;
  url = 'https://api.manicmarket.com';
  userDetail: Observable<UserViewModel>;
  _userDetail = new UserViewModel();
  @Input() isShowSearchBar: boolean = true;
  @Input() isShowLogo: boolean = true;
  select2Model: Select2Model[] = [];
  searchValue:any;
  timeout: any = null;
  isOpenSearchBar = false;
  model: SuggestionViewModel[] = [];
  isLoading = false;
  isLoggedIn: boolean;
  trendingList = [];
  randomSymbol;
  isSuperUser = false;
  isMobile = false;
  login:any;
  interval:any;
  changeFinance:any[] = [];
  is_blue_bar: any;
  value:string = "";
  changeSocket: any;
  Watchlistsymbollist: any;
  replacementArray: ReplacementItem[] = [
    {symbol : 'RUS'},
    {symbol : 'S&P'},
    {symbol : 'NAS'},
    {symbol : 'DJI'},
    {symbol : 'US05Y'},
    {symbol : 'VIX'},
    {symbol : '10Y'},
    {symbol : 'US30Y'},
  ];
  changeFinanceData: any;
  @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;
  constructor(public readonly _accountService: AccountsService,
    private readonly _router: Router,
    public _commonService: CommonHelperService,
    public base: BaseAPIService,
    private cdRef: ChangeDetectorRef,
    private readonly _companyService: CompanyService,
    private socialAuthService: SocialAuthService,
    private router: Router,
    private readonly _watchListService: WatchListService,
    private readonly _appCoponent: AppComponent, private _baseService: BaseAPIService) {
    this.isAuthenticated = this._accountService.isLoggedIn;
    this._accountService.isLoggedIn.subscribe(data => {
      this.isLoggedIn = data;
    });
    // this._accountService.isLoggedIn.subscribe(data => {
    //   this.login = data;
    // });
    this.userDetail = this._accountService.userDetail;
    this.openRandomComp()
    
  }
  getActiveUser() {
    this._baseService.get(AppSetting.getProfile).subscribe((user) => {
      this._userDetail = user.data;
      if (this._userDetail) {
        this._commonService.profilePic = this._userDetail.image
      }
    });
  
  }
  ngOnInit(): void {
    this.headerSoket();
    this.headerChange();
    this.trendingsymbol()
    this.checkForWidth();
    clicktable();
    this.userDetail.subscribe(data => {
      this._userDetail = data;
      this._commonService.profilePic = this._userDetail.image
      if (this._userDetail.is_superuser) {
        this.isSuperUser = true; 
      }
      // this.getActiveUser();
    });
  }
 
  gotoAdminDic() {
    this._commonService.adminDictonary = true;
    this._router.navigate(['investor-dictionary']);
  }
  gotologinpage() {
    this._commonService.loginpage.next(!this._commonService.loginpage);
    this._router.navigate(['login']);
  }
  gotoAdminQuotes() {
    this._commonService.adminQuote = true;
    this._router.navigate(['quotes']);
  }
  checkForWidth() {
    const width = window.innerWidth;
    if (width < 700) {
      this.isMobile = true;
    }
  }
  profileUpdate(): void {
    this._router.navigate(['profile']);
  }
  gotoUserManagement() {
    this._router.navigate(['user-management']);
  }
  searchapicall() {
  }
  trendingsymbol() {
    this._companyService.Trending().subscribe(responseData => {
      if (responseData.isSuccess) {
        this.model = responseData.data as SuggestionViewModel[];
        this.trendingList = this.model.map(
          function (item) {
            return { value: item.symbols, label: item.companyName, changePercent: item.changePercent ? item.changePercent : 0 };
            
          });
      }
    }
    );
  }

getSearchData() {
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(() => {
      this.model = [];
      this.select2Model = [];
      if (this.searchValue && this.searchValue.trim().length > 0) {
        this.isLoading = true;
        this._companyService.SuggestionList(this.searchValue).subscribe(responseData => {
          if (responseData.isSuccess) {
            this.model = responseData.data as SuggestionViewModel[];
            this.select2Model = this.model.map(
              function (item): Select2Model {
                return { value: item.symbols, label: item.companyName, changePercent: item.changePercent ? item.changePercent : 0 };
              });
              if (this.select2Model?.length > 0) {
                this.isOpenSearchBar = true;
              }else{
                this.isOpenSearchBar = false;
              }
          }
          this.isLoading = false;
        },
          error => {
            this.isLoading = false;
            console.error(error.message)
          }
        );
      }
    }, 1000);
  }
  openRandomComp() {
    this._baseService.get(AppSetting.randCompany)
      .subscribe((res) => {
        this.randomSymbol = res.data.symbol;
      })
  }
  ngOnDestroy(): void {
    this.isLoading = false;
    this._appCoponent.showLoaderEvent(true);
  }
  showHideOptions() {
    this.isOpenSearchBar = (this.searchValue ? (this.select2Model?.length > 0 ? true : false) : (this.trendingList.length > 0 ? true : false));
  }
  onSearch() {
    this.getSearchData();
  }
  clearSearch() {
    this.searchValue = null;
  }
  onClear() {
    this.select2Model = [];
    this.searchValue = undefined;
    this.showHideOptions()
  }
  redirectToRoute(value) {
    if(value == undefined) {
    } else {
      this.searchValue = undefined;
      this.searchValue = null;
      this.onClear();
      $(".mobile_head_sercbox").slideToggle();
      this._router.navigate(['/company-profile', value]);
      const inputElement = document.activeElement as HTMLInputElement;
      if (inputElement) {
        inputElement.blur();
      }
    }
  }

  redirectToRoute2(value) {
    this.searchValue = undefined;
    this.searchValue = null;
    this.onClear();
    // this._router.navigate(['/company-profile', value]);
    
    $(".mobile_head_sercbox").slideToggle();
    this.router.navigate(['/company-profile', value])
    const inputElement = document.activeElement as HTMLInputElement;
    if (inputElement) {
      inputElement.blur();
    }
    
  }

  openNormalDic() {
    this._commonService.adminDictonary = false;
    this._router.navigate(['investor-dictionary/']);
  }
  openNormalQuotes() {
    this._commonService.adminQuote = false;
    this._router.navigate(['quotes']);
    this._router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      this._router.navigate(['quotes']);
    });
  }
  onClickScreener() {
    // this._commonService.updateScreener.next(true);
  //   this._router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
  //     this._router.navigate(['screener']);
      
  // });
  this._router.navigate(['screener']);
  }
  onClickWhishlist() {
    if ((this.isLoggedIn)) {
      this._router.navigate(['/watchlist']);
    }
    else {
      this._router.navigate(['login']);
      //this._commonService.showAlert("Opps!", MessageTitleEnum.UnauthorizedAccess, PopupMessageTypeEnum.Info)
    }
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
      setTimeout(function() {
        window.location.reload();
      },100);
    }
  });
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
  } else {
    this.router.navigate([page]);
  }
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

gotoLoginPage() {
  if ((!this.isLoggedIn)) {
    this._router.navigate(['/login']);
  }
}

headerChange() {
  this.base.get(AppSetting.financeChanges).subscribe((resp) => {
    this.changeFinance = resp.data
    this.changeFinance.forEach((item1, index) => {
      if (this.replacementArray[index]) {
        this.changeFinance[index].symbol = this.replacementArray[index].symbol;
      }
    });

  });
}

headerSoket() {
  this.changeSocket = webSocket(`${websocketurl.url}/ws/change-percent/GOOGL/`);
    this.changeSocket.subscribe((msg) => {
      this.changeFinance = msg.data;
      this.changeFinance.forEach((item1, index) => {
        if (this.replacementArray[index]) {
          this.changeFinance[index].symbol = this.replacementArray[index].symbol;
        }
      });
    setTimeout(() => {
      this.changeSocket.next({});
    }, 60000)
  });
}
  hasRoute(route: string) {
    return this.router.url.includes(route);
  }
}
