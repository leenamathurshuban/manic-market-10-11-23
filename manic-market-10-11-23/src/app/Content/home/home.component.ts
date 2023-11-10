import { Select2Model } from './../../Shared/Model/common-model.model';
import { CompanyService } from './../../Shared/Service/company.service';
import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CompanySearchViewModel } from 'src/app/Shared/Model/company.model';
import { Subject } from 'rxjs';
import { SuggestionViewModel } from 'src/app/Shared/Model/suggestion-view-model.model';
import { AppComponent } from '../../app.component';
import { Router } from '@angular/router';
import { NgSelectComponent } from '@ng-select/ng-select';
import { BaseAPIService } from 'src/app/Shared/Service/base-api.service';
import { CommonHelperService } from 'src/app/Shared/Service/common-helper.service';
import { AccountsService } from 'src/app/Shared/Service/accounts.service';
import { Title } from "@angular/platform-browser";
import { AppSetting } from 'src/app/Shared/Model/app-setting.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  model: SuggestionViewModel[] = [];
  select2Model: Select2Model[] = [];
  trendingList = [];
  searchValue: string;
  isOpenSearchBar = false;
  isLoading = false;
  @ViewChild('ngSelect') ngSelect: NgSelectComponent;
  feedbackInput = '';
  isLoggedIn: boolean;
  randomSymbol;
  timeout: any = null;
  status: boolean = false;
  interval: any;
  userInfo
  item: any;
  constructor(private readonly appCoponent: AppComponent,
    private readonly _router: Router,
    private readonly _companyService: CompanyService,
    public base: BaseAPIService,
    public common: CommonHelperService,
    public _accountService: AccountsService,
    private titleService: Title
  ) {
    this.titleService.setTitle("Manic Market - Stock Quotes, Stock Research, Business & Finance News manicmarket.com");
    this.appCoponent.setLayout(false, false, true);
    this.appCoponent.showLoaderEvent(false);
    this._accountService.isLoggedIn.subscribe(data => {
      this.isLoggedIn = data;
    });
    this.openRandomComp();
  }
  ngAfterViewInit() {
    // setTimeout(() => {
    //   this.ngSelect.focus();
    // });
  }
  openRandomComp() {
    this.base.get(AppSetting.randCompany)
      .subscribe((res) => {
        this.randomSymbol = res.data.symbol;
      })
  }
  ngOnInit(): void {
    this.getActiveUser();
    this.trendingsymbol();
    let body = document.getElementsByTagName('header')[0];
    body.classList.add('xshide_head');
  }
  ngOnDestroy(): void {
    this.isLoading = false;
    this.appCoponent.showLoaderEvent(true);
    let body = document.getElementsByTagName('header')[0];
    body.classList.remove("xshide_head");
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
  onClear() {
    this.select2Model = [];
    this.searchValue = undefined;
    this.onFocus()
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
  
  onSearch(value) { 
    this.getSearchData();
  }
  onFocus() {
    this.isOpenSearchBar = ( this.searchValue ? (this.select2Model?.length > 0 ? true : false) : (this.trendingList.length > 0 ? true : false));
  }
  redirectToRoute(value) {
    if(value == undefined) {
    }else{
    this._router.navigate(['/company-profile', value]);
    // setTimeout(function(){
    //   window.location.reload();
    // }, 100);
    }
  }
  getActiveUser() {
    this.base.get(AppSetting.getProfile).subscribe((user) => {
      this.userInfo = user.data;
    });
  }
  saveFeedback() {
    const feedback = {
      feedback: this.feedbackInput
    }
    this.base.post(+ (this.userInfo.id)+ '/', feedback).subscribe(() => {
      this.common.showSuccessAlert('Thank you for the feedback! Please continue to share any ideas to help improve the site!');
    })
  }
  gotoLoginPage() {
    if ((!this.isLoggedIn)) {
      this._router.navigate(['/login']);
    }
  }
}
