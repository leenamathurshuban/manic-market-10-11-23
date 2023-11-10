import { WatchListService } from 'src/app/Shared/Service/watch-list.service';
import { AfterViewInit, Component,Input, ChangeDetectorRef, OnInit } from '@angular/core';
import { CompanyFinanceViewModel } from 'src/app/Shared/Model/company.model';
import { CompanyService } from 'src/app/Shared/Service/company.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { AccountsService } from '../../Shared/Service/accounts.service';
import { CommonHelperService } from '../../Shared/Service/common-helper.service';
import { MessageTitleEnum, PopupMessageTypeEnum } from 'src/app/Shared/Enum/fixed-value.enum';
import { param } from 'jquery';
import { News } from '../../Shared/Model/company.model';
import { BaseAPIService } from 'src/app/Shared/Service/base-api.service';
import { Title } from "@angular/platform-browser";
import { DecimalPipe } from '@angular/common';
import { AppSetting } from 'src/app/Shared/Model/app-setting.model';
import { webSocket } from 'rxjs/webSocket';
import { websocketurl } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { Select2Model } from '../../Shared/Model/common-model.model';
import { SuggestionViewModel } from '../../Shared/Model/suggestion-view-model.model';

declare const TradingView: any;
declare const clicktable: any;
interface ReplacementItem {
  symbol : string;
}

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css'],
})
export class CompanyProfileComponent implements OnInit, AfterViewInit {
  model: any = {};
  showNewsPopup = false;
  selectedNews;
  symbol: string;
  PriceSocket: any;
  NewsSocket: any;
  NewssearchSocket: any;
  News_data: any = [];
  search_symbol: any = '';
  newspage: any = 1;
  neswlimit: any = 25;
  reset: any = 1;
  dataget: any = true;
  filterapplyed = false;
  newsfilterpopup = false;
  newspageshow = true;
  watchlistname: any = [];
  Publicerlist: any = [];
  Filterbynews: any = [];
  Filterbynews2: any = [];
  SelectFilterbynews: any = [];
  PriceSocketdata: any;
  SymbolSocketdata: any = [];
  SymbolSocketdata2:any;
  changePercentValue: any = [];
  isLoggedIn: boolean;
  windowchange: boolean = false;
  feedbackInput = '';
  isnextpage = false;
  test = "1900-01-01 13:09:52";
  demovalue: any = 0;
  searchText;
  diffrent: any = 50;
  startpos:any=0;
  startpos1:any=1;
  startpos2:any=2;
  shownextpage:any=5;
  pageselect: any = 1;
  pagenum: any = 0;
  show: any;
  datefilter:any="";
  data:any;
  demoarray: any = [];
  showpage: any;
  getdata: any = [];
  getcashdata: any = [];
  getincomedata: any = [];
  questions: any;
  searchNews;
  companyList = [];
  timeout: any = null;
  @Input() select2Model: Select2Model[] = [];
  searchValue:any;
  isLoading = false;
  isOpenSearchBar = false;
  randomSymbol;
  trendingList = [];
  balanceGet = [];
  balance2 = [];
  symbol1=null;
  symbol2:null;
  cashsym1: null;
  cashsym2: null;
  numsymbol: null;
  numsymbol2: null;
  cashflowGet = [];
  cashflowGet2 = [];
  incomeGet = [];
  incomeGet2 = [];
  numberGet = [];
  numberGet2 = [];
  incomeSym1: null;
  incomeSym2: null;
  getNumberedata: any = [];
  isSuperUser = false;
  isSuperUser1 = false;
  isIncome = false;
  isIncome1 = false;
  iscashFlow = false;
  iscashFlow1 = false;
  element: HTMLElement;
  tab_Value : string="balance-tab";
  isSuperBalance = false;
  isSuperBal1 = false;
  keyitem: any = [];
  similarItems: any = [];
  parentTabValue: number = 1;
  interval:any;
  testsym: any;
  isAssets = false;
  isCurrent = false;
  isnoncurrent = false;
  isLiabilities = false;
  iscurrentLiabilities = false;
  isnonLiabilities = false;
  isIcon = false;
  isIcon1 = false;
  isIcon2 = false;
  isIcon3 = false;
  isIcon4 = false;
  isIcon5 = false;
  showSimilarDiv=true;
  userInfo;
  mydata: any = [];
  changeSocket: any;
  changeFinance:any[] = [];
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
  @Input() isShowSearchBar: boolean = true;
  @Input() isShowLogo: boolean = true;
  formattedNumber: string;
  constructor(private readonly _companyService: CompanyService,
    private readonly _watchListService: WatchListService,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly appCoponent: AppComponent,
    public readonly _accountService: AccountsService,
    private readonly _commonService: CommonHelperService,
    public base: BaseAPIService,
    private _baseApi: BaseAPIService,
    private titleService: Title,
    private _decimalPipe: DecimalPipe,
    private cdRef: ChangeDetectorRef,
    public datepipe: DatePipe,
    private readonly _appCoponent: AppComponent, private _baseService: BaseAPIService,
    
  ) {
    
    this._accountService.isLoggedIn.subscribe(data => {
      this.isLoggedIn = data;
    });
    
    this.appCoponent.setLayout(true, true, true);
    if (this._route.snapshot.params.symbol) {
      this.symbol = this._route.snapshot.params.symbol;
    }
  }

  filterDate(date,isShow) {

    const newsDate = new Date(date);
    
    if (newsDate >= new Date()) {
      return "";
    }
    let forDate:any;
    if(isShow){
      let forDate:any;
      if (this.datepipe.transform(date, 'yyyy') == new Date().getFullYear().toString()){
        forDate = this.datepipe.transform(date, 'MM-dd');
      } else{
        forDate = date;
      }
      return forDate;
    }
    return date;
  }

  // filterDate(date) {
  //   const newsDate = new Date(date);
  //   if (newsDate >= new Date()) {
  //     return "";
  //   }
  //   return date;
  // }
  
  // gotoAnnualReport(annual_report, year) {
  //  let url = `report;url=${annual_report};year=${year}`
  //   this._router.navigate([]).then(result => { window.open(url, '_blank'); });
  //}
  gotoAnnualReport(annual_report, year) {
    let url = `report;year=${year};url=${annual_report}`
    this._router.navigate([]).then(result => { window.open(url, '_blank'); });
  }
  gotoNews(news) {
    this._router.navigate(['company-profile/' + this.symbol + "/news/" + news.date + "/" + news.slug]);
  }
  // gotoNews(news) {
  //   this.showNewsPopup = true;
  //   this.selectedNews = news;
  // }
  closeNews() {
    this.showNewsPopup = false;
    this.selectedNews = null;
    this._router.navigate(['company-profile/' + this.symbol]);
  }
  pageChange(value) {
    if (value >= 1) {
      window.scrollTo(0, 0)
      this.demoarray = [];
      this.pageselect = value;
      this.getnewsbyslug(this.symbol, this.pageselect, this.neswlimit, this.Filterbynews,this.datefilter)
    }
  }
  valuecheck(val1, val2) {
    return (val1 - val2) > 1
  }
  datechange(e) {
    if(e.value){
      this.datefilter = this.datepipe.transform(e.value, 'yyyy-MM-dd');
    } else {
      this.datefilter=""
    }
    this.getnewsbyslug(this.symbol, 1, this.neswlimit, this.Filterbynews,this.datefilter)
  }
  newpagebutton() {
    this.show = Math.ceil(this.pagenum / this.diffrent) + this.startpos1;
    this.showpage = new Array(this.show)
    if (this.showpage) {
      for (let i = this.startpos; i < this.showpage.length; i++) {
        if (i === this.startpos) {
          this.demoarray.push(i + this.startpos1)
        } else {
          if (((this.pagenum > ((i - this.startpos1) * this.diffrent) ? ((i - this.startpos1) * this.diffrent) : this.pagenum) < (this.pageselect > this.shownextpage ? this.pageselect : this.pageselect) && (((i) * this.diffrent)) > (this.pageselect) || (this.pagenum > ((i) * this.diffrent) ? ((i) * this.diffrent) : this.pagenum) == this.pageselect)) {
            for (let j = this.startpos; j <= (this.shownextpage * this.startpos2 ); j++) {
              if (((this.pageselect + j - this.shownextpage) > this.startpos1) && (this.pagenum >= (this.pageselect + j - this.shownextpage))) {
                this.demoarray.push(this.pageselect + j - this.shownextpage)
              }
            }
            if ((this.pagenum > ((i) * this.diffrent) ? ((i) * this.diffrent) : this.pagenum) > (this.pageselect + this.shownextpage)) {
              this.demoarray.push(this.pagenum > ((i) * this.diffrent) ? ((i) * this.diffrent) : this.pagenum)
            }
          } else {
            if ((this.pageselect - this.shownextpage) > (this.pagenum > ((i) * this.diffrent) ? ((i) * this.diffrent) : this.pagenum) || (this.pagenum > ((i) * this.diffrent) ? ((i) * this.diffrent) : this.pagenum) > (this.pageselect + this.shownextpage)) {
              this.demoarray.push(this.pagenum > ((i) * this.diffrent) ? ((i) * this.diffrent) : this.pagenum)
            }
          }
        }
      }
    }
  }
  ngOnInit(): void {
    this.headerChange()
    clicktable();
    this.newspageshow = true;
    this._route.paramMap.subscribe((params: ParamMap) => {
      if (this._route.snapshot.params.symbol) {
        this.News_data = [];
        this.newspage = 1;
        this.reset = 1;
        this.isnextpage = false;
        this.SymbolSocketdata = null;
        this.filterapplyed = false;
        this.datefilter="";
        this.PriceSocket && this.PriceSocket.unsubscribe();
        this.symbol = this._route.snapshot.params.symbol;
        this.getwebsocketdata();
        this.getProfile();
        this.getnewsbyslug(this.symbol, this.newspage, this.neswlimit, [],this.datefilter)
      }
      if (this._route.snapshot.params.newsslug) {
        this.getnewsdetails(this._route.snapshot.params.newsslug)
      }
    });
    this.getFinancialDetail();
    this.getcashflowDetaill();
    this.getWatchList();
    this.getnumberDetail();
    this.getActiveUser();
  }
  ngOnDestroy() {
    this.PriceSocket && this.PriceSocket.unsubscribe();
    this.symbol = '';
    this.NewsSocket && this.NewsSocket.complete();
    this.PriceSocket && this.PriceSocket.complete();
    this.isLoading = false;
    this._appCoponent.showLoaderEvent(true);
  }
  getnewsdetails(slug) {
    this._companyService.CompanyNewsDetail(slug).subscribe(responseData => {
      if (responseData.isSuccess) {
        this.selectedNews = responseData.data;
        this.showNewsPopup = true;
      }
    }, error => {
    });
  }
  getWatchList() {
    if (this.isLoggedIn) {
      this._watchListService.GetWatchList().subscribe(response => {
        if (response.isSuccess) {
          this.watchlistname = response.data;
        }
        // else {
        //   //this._commonService.showAlert("Opps!", MessageTitleEnum.UnauthorizedAccess, PopupMessageTypeEnum.Warning)
        // }
      });
    }
  }
  savenewwatchlist(slug) {
    const watchliatnewdata = {
      name: slug,
      symbols: [this.model?.symbol_id]
    }
    this.base.put(AppSetting.watchlistcreate, watchliatnewdata).subscribe((res) => {
      // if (res.isSuccess) {
      //  this._commonService.showSuccessAlert(res.message);
      // } 
      // else {
      //   this._commonService.showErrorAlert(res.message);
      // }
    })
  }
  opennewsfilter() {
    if (this.filterapplyed) {
      this.Filterbynews = [];
      this.Filterbynews2.map(res => {
        this.Filterbynews.push(res)
      })
    } else {
      this.resetfilter(1)
    }
    this.newsfilterpopup = true;
  }
  closenewsfilter() {
    this.newsfilterpopup = false;
  }
  search_symbol_data(e) {
    this.search_symbol = e.target.value;
    // this.search_symbol = e.target.value.toUpperCase() === this.search_symbol.  e.target.value.toUpperCase();
    
  }
  filternews(e, name) {
    if (e.target.checked) {
      this.Filterbynews.push(name)
    } else {
      var i = this.Filterbynews.indexOf(name);
      if (i >= 0) {
        this.Filterbynews.splice(i, 1)
      }
    }
  }
  getwebsocketdata() {
    this.windowchange = !this.windowchange;
    this.getpricewebsocket();
  }
  getpricewebsocket() {
    this.headerSoket();
    this.PriceSocket = webSocket(`${websocketurl.url}/ws/stock-price/${this.symbol}/`);
    this.PriceSocket.subscribe(
      (msg) => {
        if (this.SymbolSocketdata?.symbol == msg?.message[this.symbol]?.symbol) {
          // console.log('ws-->', this.changePercentValue = this._decimalPipe.transform(this.SymbolSocketdata?.changePercent * 100,'1.2-2'))
          this.SymbolSocketdata = msg?.message[this.symbol];
          this.demovalue > 0 ? (this.demovalue = -5) : (this.demovalue = 10)
          this.titleService.setTitle(`${this.SymbolSocketdata.symbol} ${this._decimalPipe.transform(this.SymbolSocketdata?.changePercent * 100,'1.2-2')}%  ${this._decimalPipe.transform(this.SymbolSocketdata?.latestPrice,'1.2-2')} : ${this.SymbolSocketdata.companyName} - Manic Market  manicmarket.com`);
          this.cdRef.detectChanges();
        }
        setTimeout(() => {
          this.PriceSocket.next({});
        }, 60000)
      },
      (err) => console.log(err)
    );
    this.PriceSocket.next({});
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  streamynewsdata(filter) {
    this.NewsSocket && this.NewsSocket.complete();
    if (this.symbol.length > 0) {
      this.NewsSocket = webSocket(`${websocketurl.url}/ws/news/${this.symbol}/?page=1&limit=25&filter=${filter}`);
      this.NewsSocket.subscribe(
        (msg) => {
            if (msg?.message?.news_publishers) {
              this.Publicerlist = msg?.message?.news_publishers;
            }
            if (msg?.message?.data) {
              msg?.message?.data?.reverse()?.map((res) => {
                if (res?.date > this.News_data[0]?.date) {
                  this.News_data.unshift(res);
                  this.cdRef.detectChanges();
                } else if (res?.date == this.News_data[0]?.date && res?.time > this.News_data[0]?.time) {
                  this.News_data.unshift(res)
                  this.cdRef.detectChanges();
                }
              });
            }
            setTimeout(() => {
                this.NewsSocket.next({});
            }, 60000)
        },
        (err) => console.log(err)
      );
      this.NewsSocket.next({});
    }
  }
  getnewsbyslug(slug, page, limit, filter ,date) {
    this._watchListService.GetnewsByfilter(slug, page, limit, filter,date).subscribe(responseData => {
      if (responseData?.isSuccess) {
        this.demoarray = [];
        this.dataget = true;
        this.News_data = responseData?.data;
        this.pageselect = page;
        this.pagenum = responseData?.num_pages;
        this.isnextpage = responseData?.is_next;
        this.Filterbynews2 = responseData?.filter;
        this.Publicerlist = responseData?.news_publishers;
        this.resetfilter(this.reset)
        this.streamynewsdata(filter);
        if(this.pagenum > 0){
          this.newpagebutton();
        }
      }
      //  else {
      //   //this._commonService.showAlert("Opps!", responseData.message, PopupMessageTypeEnum.Warning)
      // }
    });
  }
  resetfilter(value) {
    if (value === 1) {
      this.Filterbynews = [];
      this.reset = 2;
      this.Publicerlist.map(res => {
        this.Filterbynews.push(res?.source_name)
      })
    }
  }
  applynewsfilters() {
    this.newspage = 1;
    this.News_data = [];
    this.getnewsbyslug(this.symbol, this.newspage, this.neswlimit, this.Filterbynews,this.datefilter)
    this.closenewsfilter();
    this.filterapplyed = true;
  }
  removefilternews(name) {
    var i = this.Filterbynews.indexOf(name);
    if (i >= 0) {
      this.Filterbynews.splice(i, 1)
    }
    this.applynewsfilters()
  }
  getProfile() {
    this._companyService.CompanyDetail(this.symbol).subscribe(responseData => {
      if (responseData.isSuccess) {
        this.SymbolSocketdata = responseData.data;
        this.SymbolSocketdata2 = responseData.data;
        // console.log('api-->',this.changePercentValue = this._decimalPipe.transform(this.SymbolSocketdata?.changePercent,'1.2-2'))
        this.model = responseData.data;
        this.mydata = responseData.data;
        this.keyitem = responseData.data.key_leader;
        this.similarItems = responseData.data.recommendedSymbols;
        this.titleService.setTitle(`${this.model.symbol} ${this._decimalPipe.transform(this.model?.changePercent * 100,'1.2-2')}%  ${this._decimalPipe.transform(this.model?.latestPrice,'1.2-2')} : ${this.model.companyName} - Manic Market  manicmarket.com`);
        this.AddChart();
        this.AddChart2();
        this.getFinancialDetail();
        this.getcashflowDetaill();
        this.getincomeDetaill();
        this.getnumberDetail();
      }
    }, error => {
    });
  }

  
  addCommaFilter(value) {
    return value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  getFinancialDetail() {
    this.model.company_finance = new CompanyFinanceViewModel();
    this._companyService.CompanyFinancial(this.symbol).subscribe(responseData => {
      if (responseData.isSuccess) {
        this.getdata = responseData.data;
        this.model.company_finance = responseData.data as CompanyFinanceViewModel;
      }
    }, error => {
    });
    
  }

  getcashflowDetaill() {
    this.model.company_finance = new CompanyFinanceViewModel();
    this._companyService.Companycashflow(this.symbol).subscribe(cashflow => {
      if (cashflow.isSuccess) {
        this.getcashdata = cashflow.data; 
        this.model.company_finance = cashflow.data as CompanyFinanceViewModel;
      }
    }, error => {
    });
  }
  
  getincomeDetaill() {
    this.model.company_finance = new CompanyFinanceViewModel();
    this._companyService.CompanyIncome(this.symbol).subscribe(incomeresponse => {
      if (incomeresponse.isSuccess) {
        this.getincomedata = incomeresponse.data;
        this.model.company_finance = incomeresponse.data as CompanyFinanceViewModel;
      }
    }, error => {
    });
  }
  getnumberDetail() {
    this.model.company_finance = new CompanyFinanceViewModel();
    this._companyService.CompanyNumber(this.symbol).subscribe(numberresponse => {
      if (numberresponse.isSuccess) {
        this.getNumberedata = numberresponse.data;
        this.model.company_finance = numberresponse.data as CompanyFinanceViewModel;
      }
    }, error => {
    });
    
  }
  ngAfterViewInit() {
  }
  AddChart() {
    if(this.model.symbol == '^DJI'){
      this.model.symbol = 'DJI';
    }
    if(this.model.symbol == '^IXIC'){
       this.model.symbol = 'IXIC';
    }

    if(this.model.symbol == '^GSPC'){
      this.model.symbol = 'SPX';
    }

    if(this.model.symbol == '^RUT'){
      this.model.symbol = 'RUT';
    }

    if(this.model.symbol == '^VIX'){
      this.model.symbol = 'VIX';
    }

    if(this.model.symbol == '^TNX'){
      this.model.symbol = 'US10Y';
    }

    if(this.model.symbol == '^TYX'){
      this.model.symbol = 'US30Y';
    }

    if(this.model.symbol == '^FVX'){
      this.model.symbol = 'US05Y';
    }
    
    if(this.model.symbol == 'YM=F'){
      this.model.symbol = 'YM1!';
    }
    if(this.model.symbol == 'NQ=F'){
       this.model.symbol = 'NQ1!';
    }

    if(this.model.symbol == 'ES=F'){
      this.model.symbol = 'ES1!';
    }

    if(this.model.symbol == 'RTY=F'){
      this.model.symbol = 'RTY1!';
    }

    new TradingView.MediumWidget(
      {
        "container_id": "tradingview_ceb0f",
        "symbols":
          [
            this.model.symbol
          ],
          
        "chartOnly": true,
        "width": "100%",
        "height": 260,
        "locale": "en",
        "colorTheme": "light",
        "gridLineColor": "rgba(42, 46, 57, 0.06)",
        "fontColor": "#787B86",
        "isTransparent": false,
        "autosize": false,
        "showVolume": false,
        "hideDateRanges": false,
        "scalePosition": "right",
        "scaleMode": "Normal",
        "fontFamily": "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
        "noTimeScale": false,
        "valuesTracking": "1",
        "chartType": "area",
        "lineWidth": 3,
        "lineColor": "#2962ff",
        "topColor": "rgba(49, 121, 245, 0.95)",
        "bottomColor": "rgba(41, 98, 255, 0)",
      }
    );
  }
  AddChart2() {
    if(this.model.symbol == '^DJI'){
      this.model.symbol = 'DJI';
    }
    if(this.model.symbol == '^IXIC'){
       this.model.symbol = 'IXIC';
    }

    if(this.model.symbol == '^GSPC'){
      this.model.symbol = 'SPX';
    }

    if(this.model.symbol == '^RUT'){
      this.model.symbol = 'RUT';
    }

    if(this.model.symbol == '^VIX'){
      this.model.symbol = 'VIX';
    }

    if(this.model.symbol == '^TNX'){
      this.model.symbol = 'US10Y';
    }

    if(this.model.symbol == '^TYX'){
      this.model.symbol = 'US30Y';
    }

    if(this.model.symbol == '^FVX'){
      this.model.symbol = 'US05Y';
    }
    
    if(this.model.symbol == 'YM=F'){
      this.model.symbol = 'YM1!';
    }
    if(this.model.symbol == 'NQ=F'){
       this.model.symbol = 'NQ1!';
    }

    if(this.model.symbol == 'ES=F'){
      this.model.symbol = 'ES1!';
    }

    if(this.model.symbol == 'RTY=F'){
      this.model.symbol = 'RTY1!';
    }

    new TradingView.MediumWidget(
      {
        "container_id": "tradingview_ceb0f2",
        "symbols":
          [
            this.model.symbol
          ],
        "chartOnly": true,
        "width": "100%",
        "height": 260,
        "locale": "en",
        "colorTheme": "light",
        "gridLineColor": "rgba(42, 46, 57, 0.06)",
        "fontColor": "#787B86",
        "isTransparent": false,
        "autosize": false,
        "showVolume": false,
        "hideDateRanges": false,
        "scalePosition": "right",
        "scaleMode": "Normal",
        "fontFamily": "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
        "noTimeScale": false,
        "valuesTracking": "1",
        "chartType": "area",
        "lineWidth": 3,
        "lineColor": "#2962ff",
        "topColor": "rgba(49, 121, 245, 0.95)",
        "bottomColor": "rgba(41, 98, 255, 0)",
      }
    );
  }
  deleteWatchListItem() {
    if ((this.isLoggedIn)) {
      if (this.model.id) {
        this._watchListService.DeleteWatchList(this.model.id).subscribe(responseData => {
          if (responseData.isSuccess) {
            this.model.isAddedWatchList = false;
            //this._commonService.showAlert("Sucess!", responseData.message, PopupMessageTypeEnum.Success)
          } 
          else {
            this._router.navigate(['login/company-profile/' + this.model.symbol.toString()]);
             //this._commonService.showAlert("Opps!", responseData.message, PopupMessageTypeEnum.Warning)
          } 
        });
      }
      // else {
      //    //this._commonService.showAlert("Opps!", MessageTitleEnum.InvalidOperation, PopupMessageTypeEnum.Warning)
      // }
    }
    else {
      this._router.navigate(['login/company-profile/' + this.model.symbol.toString()]);
      //this._commonService.showAlert("Opps!", MessageTitleEnum.UnauthorizedAccess, PopupMessageTypeEnum.Info)
      
    }
  }
  AddWatchListItem() {
    if ((this.isLoggedIn)) {
    } else {
      if (!this._route?.snapshot?.params?.newsslug) {
        this._router.navigate(['login/company-profile/' + this.model.symbol.toString() + "/" + "true"]);
        //this._commonService.showAlert("Opps!", MessageTitleEnum.UnauthorizedAccess, PopupMessageTypeEnum.Info)
      }
    }
  }
  redirectToExternalUrl(url: string) {
    if (url.length > 0) {
      const link = document.createElement("a");
      link.setAttribute("href", url.indexOf('http') < 0 ? 'http://' + url.replace(/(^\w+:|^)\/\//, '') : url);
      link.setAttribute("target", "_blank");
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  }
  formatUrl(url: string): string {
    if (url) {
      return url.replace(/^http(s?):\/\//i, "").replace("www.", "").replace("/", "");
    } else {
      return null;
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
    this.base.post(AppSetting.feebackCreate + (this.userInfo.id)+ '/', feedback).subscribe(() => {
      this._commonService.showSuccessAlert('Thank you for the feedback! Please continue to share any ideas to help improve the site!');
    })
  }

  searchNewsFilter(news) {
    this._baseApi.get(AppSetting.companynewsSearch + `${this.symbol}/?page=1&limit=25&title=${news}`)
      .subscribe((res) => {
        if (res?.isSuccess) {
          this.demoarray = [];
          this.dataget = true;
          this.pagenum = res?.num_pages;
          this.isnextpage = res?.is_next;
          this.News_data = res.data;
          if(this.pagenum > 0){
            this.newpagebutton()
          }
        }
        this.News_data = res.data;
      });
  }
  hideoption(){
  }
  getSearchData() {
    console.log(this.isOpenSearchBar)
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this._appCoponent.showLoaderEvent(false);
      this.isLoading = false;
      this.model = [];
      this.select2Model = [];
      this.timeout = setInterval(() => {
      if (this.searchValue && this.searchValue.trim().length > 0) {
        // this.isLoading = true;
        this.isLoading = false;
        this._companyService.SuggestionList(this.searchValue).subscribe(responseData => {
          // this._appCoponent.showLoaderEvent(true);
          if (responseData.isSuccess) {
            this.isLoading = false;
            this.model = responseData.data as SuggestionViewModel[];
            this.select2Model = this.model.map(
              function (item): Select2Model {
                return { value: item.symbols,  label: item.companyName, changePercent: item.changePercent ? item.changePercent : 0};
              });
            if (this.select2Model?.length > 0) {
              this.isOpenSearchBar = false;
            } else {
              this.isOpenSearchBar = false;
            }
            this.cdRef.detectChanges();
          }
          this.isLoading = false;
        },
          () => {
            this.isLoading = false;
            // this._appCoponent.showLoaderEvent(true);
            this._appCoponent.showLoaderEvent(false);
          }
        );
      }
    }, 1000);
  }, 100);
  }
  // redirectToRoute(value) {
  //   this.searchValue = undefined;
  //   this._router.navigate(['/company-profile', value]);
  //   $(".mobile_head_sercbox").slideToggle();
  //   this._router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
  //     this._router.navigate(['/company-profile', value]);
  // });
  // }
  openRandomComp() {
    this._baseService.get(AppSetting.randCompany)
      .subscribe((res) => {
        this.randomSymbol = res.data.symbol;
      })
  }
  showHideOptions() {
   this.isOpenSearchBar = (this.searchValue ? (this.select2Model?.length > 0 ? true : false) : (this.trendingList.length > 0 ? true : false));
  
  }
  onSearch() {
      this.getSearchData();
  }
  onClear() {
    //this.select2Model = undefined;
    this.searchValue = undefined;
    this.showHideOptions()
    
  }
  // this.compareget=[]
  
  comparebalance(sym) {
    if(sym == undefined) {
    } else {
    if (sym!==null) {
      this._baseApi
        .get(AppSetting.getFinanceinfo + `${sym}`).subscribe((responseData) => {
          if (this.balanceGet.length == 0) {
            this.searchValue = null;
            this.isSuperBalance = true;
            this.symbol1 = sym;
            this.balanceGet = responseData.data;
            document.getElementById('balanceSheet1').classList.add('compare_add');
          } else if (this.balance2.length == 0) {
            this.searchValue = null;
            this.isSuperBal1 = true;
            this.symbol2 = sym;
            this.balance2 = responseData.data;
            
          } else {
            this.searchValue = null;
            this.symbol1 = this.symbol2;
            this.symbol2 = sym;
            this.balanceGet = this.balance2;
            this.balance2 = responseData.data;
          }
        });
    }

    if(sym!==null) {
      this._baseApi.get(AppSetting.getcashflowinfo + `${sym}`).subscribe(responseData => {
        if(this.cashflowGet.length == 0){
          this.searchValue = null;
          this.iscashFlow = true;
          this.cashsym1=sym;
          this.cashflowGet = responseData.data;
          // document.getElementById('balanceSheet1').classList.add('bal_sheet1');
        } else if(this.cashflowGet2.length == 0){
          this.searchValue = null;
          this.iscashFlow1 = true;
          this.cashsym2=sym;
          this.cashflowGet2 = responseData.data;
        }else {
          this.searchValue = null;
          this.cashsym1 = this.cashsym2;
          this.cashsym2 = sym;
          this.cashflowGet = this.cashflowGet2;
          this.cashflowGet2 = responseData.data;
        }
      });
    }
    if(sym!==null) {
      this._baseApi.get(AppSetting.getIncomeinfo + `${sym}`).subscribe(responseData => {
        if(this.incomeGet.length == 0){
          this.searchValue = null;
          this.isIncome = true;
         this.incomeSym1=sym;
          this.incomeGet = responseData.data;
        } else if(this.incomeGet2.length == 0){
          this.searchValue = null;
          this.isIncome1 = true;
          this.incomeSym2=sym;
          this.incomeGet2 = responseData.data;
        } else {
          this.searchValue = null;
          this.incomeSym1 = this.incomeSym2;
          this.incomeSym2 = sym;
          this.incomeGet = this.incomeGet2;
          this.incomeGet2 = responseData.data;
        }
      });
    }
    if(sym!==null) {
      this._baseApi.get(AppSetting.getNumberinfo + `${sym}`).subscribe(responseData => {
        if(this.numberGet.length == 0){
          this.searchValue = null;
          this.isSuperUser = true;
          this.numsymbol=sym;
          this.numberGet = responseData.data;
        } else if(this.numberGet2.length == 0){
          this.showSimilarDiv = false;
          this.searchValue = null;
          this.isSuperUser1 = true;
          this.numsymbol2=sym;
          this.numberGet2 = responseData.data;
          if(this.parentTabValue == 2) {
            document.getElementById('full_section').classList.add('full_width_sec');
          }
        } else {
          this.searchValue = null;
          this.numsymbol = this.numsymbol2;
          this.numsymbol2 = sym;
          this.numberGet = this.numberGet2;
          this.numberGet2 = responseData.data;
        }
      });
    }
  }
  }

  // compareNumber(sym) {
  //   if(sym!==null) {
  //     this._baseApi.get(AppSetting.getNumberinfo + `${sym}`).subscribe(responseData => {
  //       if(this.numberGet.length == 0){
  //         this.searchValue = null;
  //         this.isSuperUser = true;
  //         this.numsymbol=sym;
  //         this.numberGet = responseData.data;
  //       } else if(this.numberGet2.length == 0){
  //         this.showSimilarDiv=false;
  //         this.searchValue = null;
  //         this.isSuperUser1 = true;
  //         this.numsymbol2=sym;
  //         this.numberGet2 = responseData.data;
  //       } else {
  //         this.searchValue = null;
  //         this.numsymbol = this.numsymbol2;
  //         this.numsymbol2 = sym;
  //         this.numberGet = this.numberGet2;
  //         this.numberGet2 = responseData.data;
  //       }
  //     });
  //   }
  // }

  tabValue(symbol) {
    this.tab_Value=symbol;
  }

  pageshow(value) {
    this.tab_Value = 'balance-tab'
    this.parentTabValue = value;
    if(this.parentTabValue == 3) {
      document.getElementById('full_section').classList.remove('full_width_sec');
    }
    if(this.balance2.length !== 0) {
      if(this.parentTabValue == 3) {
        document.getElementById('full_section').classList.remove('full_width_sec');
      }
    }
    if(this.parentTabValue == 1) {
      document.getElementById('full_section').classList.remove('full_width_sec');
    }
    if(this.parentTabValue == 4) {
      document.getElementById('full_section').classList.remove('full_width_sec');
    }
    if(this.numberGet2.length !== 0) {
      if(this.parentTabValue == 2) {
        document.getElementById('full_section').classList.add('full_width_sec');
      }
    }

  }
  
  // clearSearch() {
  //   this.searchValue = null;
  // }
  gotoLoginPage() {
    if ((!this.isLoggedIn)) {
      this._router.navigate(['/login']);
    }
  }
  
  totalAssets() {
    this.isAssets = !this.isAssets;
    this.isIcon = !this.isIcon;
    this.isCurrent = false;
    this.isnoncurrent = false;
    this.isIcon1 = false;
    this.isIcon2 = false;
  }
  currentAssets() {
    this.isCurrent = !this.isCurrent;
    this.isIcon1 = !this.isIcon1;
  }
  noncurrentAssets() {
    this.isnoncurrent = !this.isnoncurrent;
    this.isIcon2 = !this.isIcon2;
  }
  totalLiabilities() {
    this.isLiabilities = !this.isLiabilities;
    this.iscurrentLiabilities = false;
    this.isnonLiabilities = false;
    this.isIcon3 = !this.isIcon3;
    this.isIcon4 = false;
    this.isIcon5 = false;
  }
  currentLiabilities() {
    this.iscurrentLiabilities = !this.iscurrentLiabilities;
    this.isIcon4 = !this.isIcon4;
  }
  noncurrentLiabilities() {
    this.isnonLiabilities = !this.isnonLiabilities;
    this.isIcon5 = !this.isIcon5;
  }

  clearbalance() {
    this.showSimilarDiv = true;
    this.balanceGet=this.balance2;
    this.symbol1=this.symbol2;
    this.symbol2 = null;
    this.balance2=[]
    this.isSuperBal1 = false;
    this.cashflowGet=this.cashflowGet2;
    this.cashsym1=this.cashsym2;
    this.cashsym2 = null;
    this.cashflowGet2=[]
    this.iscashFlow1 = false;
    this.numberGet=this.numberGet2;
    this.numsymbol=this.numsymbol2;
    this.numsymbol2 = null;
    this.numberGet2=[]
    this.isSuperUser1 = false;
    this.incomeGet=this.incomeGet2;
    this.incomeSym1=this.incomeSym2;
    this.incomeSym2 = null;
    this.incomeGet2=[]
    this.isIncome1 = false;
    document.getElementById('balanceSheet1').classList.remove('compare_add');
    document.getElementById('full_section').classList.remove('full_width_sec');
    
  }
  clearbala2() {
    this.showSimilarDiv = true;
    this.symbol2 = null;
    this.balance2=[]
    this.isSuperBal1 = false;
    this.cashsym2 = null;
    this.cashflowGet2=[]
    this.iscashFlow1 = false;
    this.numsymbol2 = null;
    this.numberGet2=[]
    this.isSuperUser1 = false;
    this.incomeSym2 = null;
    this.incomeGet2=[]
    this.isIncome1 = false;
    document.getElementById('full_section').classList.remove('full_width_sec');
    document.getElementById('hide_section').classList.remove('hide_div');
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
    this.changeSocket = webSocket(`${websocketurl.url}/ws/change-percent/${this.symbol}/`);
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
}

