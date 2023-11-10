import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { MessageTitleEnum, PopupMessageTypeEnum } from 'src/app/Shared/Enum/fixed-value.enum';
import { CompanySearchViewModel } from 'src/app/Shared/Model/company.model';
import { WatchListViewModel } from 'src/app/Shared/Model/watch-list.model';
import { WatchListService } from 'src/app/Shared/Service/watch-list.service';
import { CommonHelperService } from '../../Shared/Service/common-helper.service';
import { AccountsService } from '../../Shared/Service/accounts.service';
import { DataTableDirective } from 'angular-datatables';
import { WatchListNewsViewModel } from '../../Shared/Model/watch-list.model';
import { Select2Model } from 'src/app/Shared/Model/common-model.model';
import { SuggestionViewModel } from 'src/app/Shared/Model/suggestion-view-model.model';
import { CompanyService } from 'src/app/Shared/Service/company.service';
import { Router } from '@angular/router';
import { BaseAPIService } from 'src/app/Shared/Service/base-api.service';
import { Title } from "@angular/platform-browser";
import { AppSetting } from 'src/app/Shared/Model/app-setting.model';
import { webSocket } from 'rxjs/webSocket';
import { websocketurl } from 'src/environments/environment';
import { LoaderService } from 'src/app/Shared/Helpers/loader.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragEnter, CdkDragMove } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { shareReplay } from 'rxjs/operators';

declare const clicktable: any;
interface ReplacementItem {
  symbol : string;
}

@Component({
  selector: 'app-watch-list',
  templateUrl: './watch-list.component.html',
  styleUrls: ['./watch-list.component.css']
})
export class WatchListComponent implements OnInit {
  [x: string]: any;
  model: WatchListViewModel[] = [];
  newsListViewModel: WatchListNewsViewModel[] = [];
  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: 10,
    order:[[1, 'desc']],
    paging: false,
    searching: true,
    info: false
  };
  dataget: any = true;
  NewsSocket: any;
  showNewsPopup = false;
  whatchlistpageshow = false;
  addwatchlistpopup = false;
  addSymbolpopup = false;
  newsfilterpopup = false;
  selectedNews;
  watchsymbol: any;
  symbol: any;
  watchlistname: any = [];
  toplist: any = [];
  watchlistsymbol: any = [];
  watchlistnews: any = [];
  watchlistsymbolid: any = [];
  watchlistslug: any = '';
  newwatchlistname: any = '';
  timeout: any = null;
  PriceSocket: any;
  search_symbol: any = '';
  search_symbol2: any = '';
  newwatchlistnameerror: any = false;
  watchlistsymboliderror: any = false;
  newspage: any = 1;
  neswlimit: any = 20;
  symbols: any = [];
  PriceSocketdata: any;
  TopSocket: any;
  WatchSocket: any;
  WatchSocketdata: any;
  Publicerlist: any = [];
  Filterbynews: any = [];
  Filterbysymbol: any = [];
  Watchlistslug: any = [];
  Watchlistsymbollist: any;
  newsymbolvalue = "";
  whatchlistdatachange: any = false;
  SelectFilterbynews: any = [];
  SelectFilterbysymbol: any = [];
  Filterbynews2: any = [];
  Filterbysymbol2: any = [];
  Filterbysym: any = [];
  dtTrigger: Subject<any> = new Subject<any>();
  isLoggedIn: boolean;
  feedbackInput = '';
  userdetails: any;
  reset = 1;
  testarray: any = [];
  watchlistshowtype = "tile";
  editwatchlistname = false;
  editlistbtnid:any; 
  matMenuTimer: any;
  filterapplyed = false;
  Selectedwatchlistname = "";
  isnextpage = false;
  reanderdata = 1;
  model2: SuggestionViewModel[] = [];
  trendingList = [];
  my_filter_news:any = [];
  reset2 = 1;
  watchlist_view: any;
  selectedButton:any;
  publicSearch;
  symbolSearch;
  changeFinance:any[] = [];
  changeSocket: any;
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
  a = [1,2,3]
  b = [1,2,3]
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  @ViewChild('dropListContainer') dropListContainer?: ElementRef;
  @ViewChild('nameit') private elementRef: ElementRef;
  
  select2Model: Select2Model[] = [];
  searchValue: string;
  visible: boolean = true;
  isOpenSearchBar = false;
  dropListReceiverElement?: HTMLElement;
  dragDropInfo?: {
    dragIndex: number;
    dropIndex: number;
  };
  constructor(private readonly appCoponent: AppComponent,
    private readonly _appCoponent: AppComponent,
    private readonly _watchListService: WatchListService,
    private readonly _commonService: CommonHelperService,
    private readonly _accountService: AccountsService,
    public datepipe: DatePipe,
    private readonly _companyService: CompanyService,
    private cdRef: ChangeDetectorRef,
    public base: BaseAPIService,
    private loaderService: LoaderService,
    private titleService: Title,
    private readonly _router: Router) {
    this.userdetails = this._accountService.userDetail;
    this.appCoponent.setLayout(true, true, true);
    this.titleService.setTitle("Stock Watchlist & News - Manic Market manicmarket.com");
    this._accountService.isLoggedIn.subscribe(data => {
      this.isLoggedIn = data;
    });
    this._accountService.istopfive.subscribe(data => {
      if (this.watchlistslug) {
        this._watchListService.GetWatchListslug(this.watchlistslug).subscribe(response => {
          if (response.isSuccess) {
            this.WatchSocketdata = response?.data;
            this.WatchSocketdata2 = response?.data;
            this.rerender();
            this.testarray = Object.keys(this.WatchSocketdata)
          }
          else {
            this._commonService.showAlert("Opps!", MessageTitleEnum.UnauthorizedAccess, PopupMessageTypeEnum.Warning)
          }
        });
      }
    });
  }
  clearValue() {
    if (this.searchValuepop !== undefined) {
      this.searchValuepop = this.searchValuepop[0];
    }
  }
  clearFilter() {
    this.searchValuepop = this.searchValuepop[0];
  }
  dragEntered(event: CdkDragDrop<number>) {
    const drag = event.item;
    const dropList = event.container;
    const dragIndex = drag.data;
    const dropIndex = dropList.data;
    this.dragDropInfo = { dragIndex, dropIndex };
    const phContainer = dropList.element.nativeElement;
    const phElement = phContainer.querySelector('.cdk-drag-placeholder');
    if (phElement) {
      phContainer.removeChild(phElement);
      phContainer.parentElement?.insertBefore(phElement, phContainer);
      moveItemInArray(this.testarray, dragIndex, dropIndex);
      this.dragwatchlistlist()
    }
    
  }
  dragMoved(event: CdkDragMove<number>) {
    if (!this.dropListContainer || !this.dragDropInfo) return;
    const placeholderElement =
      this.dropListContainer.nativeElement.querySelector(
        '.cdk-drag-placeholder'
      );
    const receiverElement =
      this.dragDropInfo.dragIndex > this.dragDropInfo.dropIndex
        ? placeholderElement?.nextElementSibling
        : placeholderElement?.previousElementSibling;
    if (!receiverElement) {
      return;
    }
    receiverElement.style.display = 'none';
    this.dropListReceiverElement = receiverElement;
  }
  dragDropped(event: CdkDragDrop<number>) {
    if (!this.dropListReceiverElement) {
      return;
    }
    this.dropListReceiverElement.style.removeProperty('display');
    this.dropListReceiverElement = undefined;
    this.dragDropInfo = undefined;
  }
  
  ngOnInit(): void {
    this.headerChange()
    this.getActiveUser()
    clicktable();
    this.newspage = 1;
    this.whatchlistpageshow = true;
    this.reset = 1;
    this.reset2 = 1;
    this.filterapplyed = false;
    this.isnextpage = false;
    this.watchlistnews = [];
    if (this.isLoggedIn) {
      this.getWatchList();
      window.addEventListener('scroll', () => this.scrollHandler(), true);
    } else {
      this.model = [];
      this.newsListViewModel = [];
      this.dtTrigger.next();
      this._router.navigate(['login/watchlist']);
    }
    // this.trendingsymbol();
}
  drop(event: CdkDragDrop<string[]>) {
    this.Watchlistslug = [];
    moveItemInArray(this.watchlistname, event.previousIndex, event.currentIndex);
    this.dragwatchlistname()
  }

  cardClick(slug, symbol): void {
    this.matMenuTimer = setTimeout( () => {this.getwatchlistbyslug2(slug, symbol);}, 300); 
  }
  cardDoubleClick(i): void {
    this.editlistbtnid = i
      clearTimeout(this.matMenuTimer);
      this.editwatchlist();
  }
  soubleClick(): void {
    setTimeout(()=>{         
      clearTimeout(this.matMenuTimer);
  }, 1000);
   
  }
  editwatchlist() {
    if (!this.matMenuTimer) return;
    this.editwatchlistname = !this.editwatchlistname;
    this.elementRef.nativeElement.focus();
  }
  getwatchlistbyslug2(slug, symbol) {
    this._appCoponent.showLoaderEvent(false);
    this.headerSoket(symbol);
    this.newspage = 1;
    this.reset = 1;
    this.Watchlistsymbollist = symbol;
    this.filterapplyed = false;
    this.reset2 = 1;
    this.watchlistnews = [];
    this.watchlistslug = slug;
    this.getwatchlistbyslug(slug)
    this.getwatchlistnews(slug, 1, 20, [], [],this.datefilter)
    // this.elementRef.nativeElement.focus();
  }

  drop2(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.testarray, event.previousIndex, event.currentIndex);
    this.dragwatchlistlist();
  }
  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
    this.loaderService.windowload.subscribe((res) => {
      this.whatchlistdatachange = res;
      this.cdRef.detectChanges();
    });
  }
  dragwatchlistname() {
    this.watchlistname.map(res => {
      this.Watchlistslug.push(res?.id)
    })
    this.appCoponent.showLoaderEvent(false);
    this._watchListService.WatchListNameDrag(this.Watchlistslug).subscribe(response => {
      this.appCoponent.showLoaderEvent(true);
      if (response.isSuccess) {
        this.watchlistname = response.data;
      }
      else {
        this._commonService.showAlert("Opps!", response.message, PopupMessageTypeEnum.Warning)
      }
    });
  }
  dragwatchlistlist() {
    this.appCoponent.showLoaderEvent(false);
    this._watchListService.WatchListListyDrag(this.watchlistslug, this.testarray).subscribe(response => {
      this.appCoponent.showLoaderEvent(true);
      if (response.isSuccess) {
        for (let i = 0; i < this.testarray.length; i++) {
          document.getElementById("watchlistid" + i).style.removeProperty('display')
        }
      } 
      else {
        this._commonService.showAlert("Opps!", response.message, PopupMessageTypeEnum.Warning)
      }
    });
  }
  watchlisttype(value) {
     this.watchlistshowtype = value;
     
  }
  filterDate(date,isShow) {
    const newsDate = new Date(date);
    if (newsDate >= new Date()) {
      return "";
    }

    let forDate:any;
    if(isShow){
      let forDate:any;
      if(this.datepipe.transform(date, 'yyyy') == new Date().getFullYear().toString()){
        forDate = this.datepipe.transform(new Date(), 'MM-dd');
      }else{
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
  getWatchList() {
    this._watchListService.GetWatchList().subscribe(response => {
      if (response.isSuccess) {
        this.rerender();
        this.watchlistname = response.data;
        this.watchlistshowtype = response.data[0].watchlist_view;
        if (response.data[0]?.slug) {
          this.getwatchlistbyslug2(this.watchlistslug ? this.watchlistslug : response.data[0]?.slug, this.Watchlistsymbollist ? this.Watchlistsymbollist : response.data[0].symbol)
          this.headerSoket(this.Watchlistsymbollist);
        }
      } 
      else {
        this._commonService.showAlert("Opps!", MessageTitleEnum.UnauthorizedAccess, PopupMessageTypeEnum.Warning)
      }
    });
  }
  getwatchlistbyslug(slug) {
    this._watchListService.GetWatchListslug(slug).subscribe(response => {
      if (response.isSuccess) {
        this.reanderdata = 1;
        this.WatchSocketdata = response?.data;
        this.WatchSocketdata2 = response?.data;
        this.rerender();
        this.EventSourceApi();
        this.symbols = []
        for (let key of Object.keys(this.WatchSocketdata)) {
          this.symbols.push(this.WatchSocketdata[key]?.symbol)
        }
        this.streamynewsdata([], [])
        this.testarray = Object.keys(this.WatchSocketdata)
      }
      else {
        this._commonService.showAlert("Opps!", MessageTitleEnum.UnauthorizedAccess, PopupMessageTypeEnum.Warning)
      }
    });
  }
  
EventSourceApi() {
  this.PriceSocket = webSocket(`${websocketurl.url}/ws/stock-price/${this.Watchlistsymbollist}/`);
  this.PriceSocket.subscribe(
    (msg) => {
      for (let key of Object.keys(this.WatchSocketdata)) {
        if (this.WatchSocketdata[key]?.symbol == msg?.message[key]?.symbol) {
            this.WatchSocketdata[key].latestPrice = msg?.message[key]?.latestPrice;
            this.WatchSocketdata[key].changePercent = msg?.message[key]?.changePercent;
            this.WatchSocketdata[key].change = msg?.message[key]?.change;
            this.WatchSocketdata[key].week52high = msg?.message[key]?.week52high;
            this.WatchSocketdata[key].companyName = msg?.message[key]?.companyName;
            this.WatchSocketdata[key].week52low = msg?.message[key]?.week52low;
            this.WatchSocketdata[key].latestVolume = msg?.message[key]?.latestVolume;
            this.WatchSocketdata[key].avgTotalVolume = msg?.message[key]?.avgTotalVolume;
            this.WatchSocketdata[key].postMarketChange = msg?.message[key]?.postMarketChange;
            this.WatchSocketdata[key].postMarketChangePercent = msg?.message[key]?.postMarketChangePercent;
            this.WatchSocketdata[key].postMarketPrice = msg?.message[key]?.postMarketPrice;
            this.WatchSocketdata[key].preMarketChange = msg?.message[key]?.preMarketChange;
            this.WatchSocketdata[key].preMarketChangePercent = msg?.message[key]?.preMarketChangePercent;
            this.WatchSocketdata[key].preMarketPrice = msg?.message[key]?.preMarketPrice;
            this.loaderService.window();
          }
        }
        this.reanderdata == 1 && this.rerender2();
        setTimeout(() => {
          this.PriceSocket.next({});
        }, 60000)
      },
      (err) => console.log(err)
    );
    this.PriceSocket.next({});
  }
  getwatchlistnews(slug, page, limit, filter, filter_symbol,date) {
    this._watchListService.GetWatchListNewsbyslug(slug, page, limit, filter, filter_symbol,date).subscribe(response => {
      if (response.isSuccess) {
         this.News_data = response?.data;
        this.dataget = true;
        if (response?.filter_symbol.length == 0) {
          this.Filterbysymbol2 = response?.symbol;
        } else {
          this.Filterbysymbol2 = response?.filter_symbol;
        }
        if (response?.filter.length == 0) {
          response?.publishers.map((val:any) => (this.Filterbynews2.push(val.source_name)))
        } else {
          this.Filterbynews2 = response?.filter;
        }
        this.isnextpage = response?.is_next;
        this.Publicerlist = response?.publishers;
        // this.resetfilter(this.reset)
        // this.resetfilter2(this.reset2)
        this.watchlistnews = this.watchlistnews.concat(response?.data)
        this.streamynewsdata(filter, filter_symbol);
      }
      else {
        this._commonService.showAlert("Opps!", response?.message, PopupMessageTypeEnum.Warning)
      }
      
    });
    
  }

  streamynewsdata(filter, filter_symbol) {
    this.NewsSocket && this.NewsSocket.complete();
    if (this.symbols.length > 0) {
      this.NewsSocket = webSocket(`${websocketurl.url}/ws/news/${this.name}/?page=1&limit=20&filter=${filter}&filter_symbol=${filter_symbol}`);
      this.NewsSocket.subscribe(
        (msg) => {
          if (this.pageselect == 1 && ( this.datefilter ? this.datefilter == this.datepipe.transform(new Date(), 'MMddyyy-MMddyyy') : true)) {
            if (msg?.message?.news_publishers) {
              this.Publicerlist = msg?.message?.news_publishers;
            }
            if (msg?.message?.data) {
              msg?.message?.data?.reverse()?.map((res) => {
                if (res?.date > this.News_data[0]?.date) {
                  this.News_data.unshift(res)
                  this.cdRef.detectChanges();
                } else if (res?.date == this.News_data[0]?.date && res?.time > this.News_data[0]?.time) {
                  this.News_data.unshift(res)
                  this.cdRef.detectChanges();
                }
              })
            }
            setTimeout(() => {
              if (this.pageselect == 1 && ( this.datefilter ? this.datefilter == this.datepipe.transform(new Date(), 'MMddyyy-MMddyyy') : true)) {
                this.NewsSocket.next({});
              }
            }, 5000)
          }
        },
        (err) => console.log(err)
      );
      this.NewsSocket.next({});
    }
    
  }
  filternews(e, name) {
    if (e.target.checked) {
      this.Filterbynews2.push(name)
    } else {
      var i = this.Filterbynews2.indexOf(name);
      if (i >= 0) {
        this.Filterbynews2.splice(i, 1)
      }
    }
  }

  filternews2(e, name) {
    if (e.target.checked) {
      this.Filterbysymbol2.push(name)
    } else {
      var i = this.Filterbysymbol2.indexOf(name);
        this.Filterbysymbol2.splice(i, 1)
    }
  }

  scrollHandler() {
    if (this.watchlistnews.length >= 20 && this.isnextpage && this.whatchlistpageshow) {
      if (document.body?.scrollHeight === (window.innerHeight + window.scrollY) || (document.body?.scrollHeight <= (window.innerHeight + window.scrollY + 10))) {
        if (this.dataget) {
          this.dataget = false;
          this.newspage = this.newspage + 1;
          this.getwatchlistnews(this.watchlistslug, this.newspage, this.neswlimit, this.Filterbynews2, this.Filterbysymbol2,this.datefilter)
        }
      }
    }
  }
  ngOnDestroy(): void {
    this.NewsSocket && this.NewsSocket.complete();
    this.PriceSocket && this.PriceSocket.complete();
    this.dtTrigger.unsubscribe();
    this.whatchlistpageshow = false;
    window.removeEventListener('scroll', this.scrollHandler, true);
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }
  rerender2(): void {
    this.reanderdata = 2;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }
  gotoNews(news) {
    this.showNewsPopup = true;
    this.selectedNews = news;
  }
  closeNews() {
    this.showNewsPopup = false;
    this.selectedNews = null;
  }
  opennewsfilter() {
    if (this.filterapplyed) {
      this.Filterbynews = [];
      this.Filterbynews2.map(res => {
        this.Filterbynews.push(res)
      })
      this.Filterbysymbol = [];
      this.Filterbysymbol2.map(re => {
        this.Filterbysymbol.push(re)
      })
    } else {
      // this.resetfilter(1)
      // this.resetfilter2(1)
    }
    this.newsfilterpopup = true;
  }
  closenewsfilter() {
    this.newsfilterpopup = false;
  }
  applynewsfilters() {
    this.closenewsfilter();
    this.loaderService.show();
    this.newspage = 1;
    this.watchlistnews = [];
    this.getwatchlistnews(this.watchlistslug, 1, this.neswlimit, this.Filterbynews2, this.Filterbysymbol2,this.datefilter)
    this.filterapplyed = true;
    
  }

  resetfilter(value) {
    if (value === 1) {
      this.Filterbynews2 = [];
      this.reset = 2;
      this.Publicerlist.map(res => {
        this.Filterbynews2.push(res?.source_name)
      })
    }
  }
  resetfilter2(value) {
    if (value === 1) {
      this.Filterbysymbol2 = [];
      this.reset2 = 2;
      this.Watchlistsymbollist?.map(res => {
        this.Filterbysymbol2.push(res)
      })
    }
  }

  removefilternews(name) {
    var i = this.Filterbynews.indexOf(name);
    if (i >= 0) {
      this.Filterbynews.splice(i, 1)
    }
    this.applynewsfilters()
  }
  search_symbol_data(e) {
    this.search_symbol = e.target.value;
  }
  search_symbol_data2(e) {
    this.search_symbol2 = e.target.value.toUpperCase();
    
  }
  setnewaddsymbol(value) {
    if (value) {
      this.newsymbolvalue = value?.id;
      this.isOpenSearchBar = false;
    } else {
      this.newsymbolvalue = "";
      this.isOpenSearchBar = true;
    }
  }
  openwatchlist() {
    this.searchValue = undefined;
    this.watchlistsymbol = [];
    this.watchlistsymbolid = [];
    this.newwatchlistname = '';
    this.newwatchlistnameerror = false;
    this.watchlistsymboliderror = false;
    this.addwatchlistpopup = true;
  }
  openAddSymbol() {
    this.watchlistname.filter((res) => {
      if (res.slug === this.watchlistslug) {
        this.Selectedwatchlistname = res.name;
      }
    })
    this.watchlistsymbol = [];
    this.watchlistsymbolid = [];
    this.watchlistsymboliderror = false;
    this.addSymbolpopup = true;
  }
  closeaddsymbol() {
    this.watchlistsymboliderror = false;
    this.watchlistsymbol = [];
    this.watchlistsymbolid = [];
    this.addSymbolpopup = false;
  }
  closewatchlist() {
    this.searchValue = undefined;
    this.newwatchlistnameerror = false;
    this.watchlistsymboliderror = false;
    this.newwatchlistname = '';
    this.watchlistsymbol = [];
    this.watchlistsymbolid = [];
    this.addwatchlistpopup = false;
  }
  removeSymbol(e) {
    this.watchlistsymbol.splice(e, 1)
    this.watchlistsymbolid.splice(e, 1)
  }
  addnewsymbol(value) {
    if (value && this.watchlistsymbol.length < 10) {
      this.isOpenSearchBar = false;
      if (this.watchlistsymbolid.indexOf(value.id) < 0) {
        this.watchlistsymbol.push(value)
        this.watchlistsymbolid.push(value.id)
        this.watchlistsymboliderror = false;
        this.searchValue = undefined;
        this.onClear();
      }
    } else if (!value) {
      this.isOpenSearchBar = true;
    }
  }

  watchlistnamechange(e) {
    if (e.target.value) {
      this.newwatchlistnameerror = false;
    } else {
      this.newwatchlistnameerror = true;
    }
    this.newwatchlistname = e.target.value;
    
  }
  deleteWatchList(value) {
    this.base.Delete(AppSetting.watchlistdelete + `${value}/`).subscribe((res) => {
      if (res.isSuccess) {
        this._accountService.changetopfive();
        this._commonService.showSuccessAlert(res.message);
        if (value === this.watchlistslug) {
          this.watchlistslug = "";
        }
        this.getWatchList();
      }
       else {
        this._commonService.showErrorAlert(res.message);
      }
    });
  }
 
  watchlistnameedit(e, slug, i) {
    if (e.target.value) {
      if (e.key === "Enter") {
        if (this.watchlistname[i].name != e.target.value) {
          this.watchlistnameupdate(e.target.value, slug)
        }
      }
    }
  }

  watchlistnameupdate(value, slug) {
    const watchlistnewname = {
      name: value,
    }
    this.base.put(AppSetting.watchlisteditname + `${slug}/`, watchlistnewname).subscribe((res) => {
      if (res.isSuccess) {
        if (slug === this.watchlistslug) {
          this.watchlistslug = res?.data?.slug;
        }
        this.getWatchList()
        this._commonService.showSuccessAlert(res.message);
      }
       else {
        this._commonService.showErrorAlert(res.message);
      }
      setTimeout(()=>{         
        clearTimeout(this.matMenuTimer);
        this.outsideClick();
    }, 1000);
    });
  }

  watchlistnameout(e, slug, i) {
    if (e.target.value) {
      if (this.watchlistname[i].name != e.target.value) {
        this.watchlistnameupdate(e.target.value, slug)
       
      }
    }
  }
  outsideClick() {
    this.editwatchlistname = false;
  }
  saveaddsymbolwatchlist() {
    if (this.watchlistsymbolid.length > 0) {
      this.watchlistsymboliderror = false;
    } else {
      this.watchlistsymboliderror = true;
    }
    const watchliatnewdata = {
      name: this.watchlistslug,
      symbols: this.watchlistsymbolid,
    }
    if (this.watchlistslug && this.watchlistsymbolid.length > 0) {
      this.base.put(AppSetting.watchlistcreate, watchliatnewdata).subscribe((res) => {
        if (res.isSuccess) {
          this.closeaddsymbol()
          this.getWatchList()
           this._commonService.showSuccessAlert(res.message);
        } else {
          this.closeaddsymbol()
          this._commonService.showErrorAlert(res.message);
        }
      })
    }
  }
  saveaddsymbolwatchname() {
    const watchliatnewdata = {
      name: this.watchlistslug,
      symbols: [this.newsymbolvalue],
    }
    if (this.watchlistslug && this.newsymbolvalue) {
      this.base.put(AppSetting.watchlistcreate, watchliatnewdata).subscribe((res) => {
        this.newsymbolvalue = "";
        this.searchValue = undefined;
        if (res.isSuccess) {
          this.getWatchList()
          //old comment this.closeaddsymbol()
          // this._commonService.showSuccessAlert(res.message);
        } 
        else {
          //old comment this.closeaddsymbol()
          // this._commonService.showErrorAlert(res.message);
        }
      })
    }
  }

  onClear() {
    this.select2Model = [];
    this.searchValue = undefined;
    this.showHideOptions();
  }
  savenewwatchlist() {
    if (this.newwatchlistname) {
      this.newwatchlistnameerror = false;
    } else {
      this.newwatchlistnameerror = true;
    }
    if (this.watchlistsymbolid.length > 0) {
      this.watchlistsymboliderror = false;
    } else {
      this.watchlistsymboliderror = true;
    }
    const watchliatnewdata = {
      name: this.newwatchlistname,
      symbols: this.watchlistsymbolid,
    }
    if (this.newwatchlistname && this.watchlistsymbolid.length > 0) {
      this.base.post(AppSetting.watchlistcreate, watchliatnewdata).subscribe((res) => {
       
        if (res.isSuccess) {
          this.closewatchlist()
          this._watchListService.GetWatchList().subscribe(response => {
            if (response.isSuccess) {
              this.watchlistname = response.data;
              this.rerender();
              if (response.data[0]?.slug) {
                this.getwatchlistbyslug2(this.watchlistslug ? this.watchlistslug : response.data[0]?.slug, this.Watchlistsymbollist ? this.Watchlistsymbollist : response.data[0]?.symbol)
              }
            } 
            else {
              this._commonService.showAlert("Opps!", MessageTitleEnum.UnauthorizedAccess, PopupMessageTypeEnum.Warning)
            }
          });
           this._commonService.showSuccessAlert(res.message);
        } else {
          this.closewatchlist()
           this._commonService.showErrorAlert(res.message);
        }
      })
    }
  }

  getSearchData() {
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(() => {
      this.appCoponent.showLoaderEvent(false);
      this.select2Model = [];
      this._companyService.SuggestionList(this.searchValue).subscribe(responseData => {
        this.appCoponent.showLoaderEvent(true);
        if (responseData.isSuccess) {
          let SearchedModel = responseData.data as SuggestionViewModel[];
          this.select2Model = SearchedModel.filter((el) => {
            return this.model.findIndex((f) => f.company.symbol == el.symbols) > -1 ? false : true;
          }).map(function (item): Select2Model {
            return { value: item.symbols, label: item.companyName, id: item.id, changePercent: item.changePercent ? item.changePercent : 0 };
          });
          if (this.select2Model?.length > 0) {
            this.isOpenSearchBar = true;
          } else {
            this.isOpenSearchBar = false;
          }
        }
      },
        error => {
          this.appCoponent.showLoaderEvent(true);
        }
      );
    }, 1000);
  }

  getSearchDatapopup() {
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(() => {
      this.appCoponent.showLoaderEvent(false);
      this.select2Model = [];
      this._companyService.SuggestionList(this.searchValuepop).subscribe(responseData => {
        this.appCoponent.showLoaderEvent(true);
        if (responseData.isSuccess) {
          let SearchedModel = responseData.data as SuggestionViewModel[];
          this.select2Model = SearchedModel.filter((el) => {
            return this.model.findIndex((f) => f.company.symbol == el.symbols) > -1 ? false : true;
          }).map(function (item): Select2Model {
            return { value: item.symbols, label: item.companyName, id: item.id, changePercent: item.changePercent ? item.changePercent : 0 };
          });
          if (this.select2Model?.length > 0) {
            this.isOpenSearchBar = true;
          } else {
            this.isOpenSearchBar = false;
          }
        }
      },
        error => {
          this.appCoponent.showLoaderEvent(true);
        }
      );
    }, 1000);
  }
  showHideOptions() {
    this.isOpenSearchBar = (this.searchValue ? (this.select2Model?.length > 0 ? true : false) : (this.trendingList.length > 0 ? true : false));
  }
  getProfile() {
    if (this.isLoggedIn && this.searchValue) {
      this._companyService.CompanyDetail(this.searchValue).subscribe(responseData => {
        if (responseData.isSuccess) {
          let profile = responseData.data as CompanySearchViewModel;
          this.AddWatchListItem(profile.id);
        }
      }, error => {
        this._commonService.showAlert("Opps!", MessageTitleEnum.SomthingWrong, PopupMessageTypeEnum.Error)
      });
    }
    else if (!this.searchValue && this.searchValue.trim().length == 0) {
      this._commonService.showAlert("Opps!", MessageTitleEnum.NoCompanySelected, PopupMessageTypeEnum.Error)
    }
    else {
       this._commonService.showAlert("Opps!", MessageTitleEnum.NeedToLogin, PopupMessageTypeEnum.Info)
    }
  }
  AddWatchListItem(companyId) {
    if (this.isLoggedIn) {
      if (companyId) {
        this._watchListService.AddWatchList(companyId).subscribe(responseData => {
          if (responseData.isSuccess) {
            this.searchValue = undefined;
            this.select2Model = [];
            this.getwatchlistbyslug(this.watchlistslug)
            this._commonService.showAlert("Sucess!", MessageTitleEnum.AddSuccess, PopupMessageTypeEnum.Success)
           
          } 
          else {
             this._commonService.showAlert("Opps!", responseData.message, PopupMessageTypeEnum.Warning)
          }
        }, error => {
          this._commonService.showAlert("Opps!", MessageTitleEnum.SomthingWrong, PopupMessageTypeEnum.Error)
        });
      }
      else {
        this._commonService.showAlert("Opps!", MessageTitleEnum.InvalidOperation, PopupMessageTypeEnum.Warning)
      }
    }
  }
  addwtachlisttopfive(slug) {
    this._watchListService.AddWatchListTop(slug).subscribe(res => {
      if (res.isSuccess) {
        this.getwatchlistbyslug(this.watchlistslug)
        this._accountService.changetopfive();
         this._commonService.showSuccessAlert(res.message);
      } 
      else {
        this._commonService.showErrorAlert(res.message);
      }
    })
  }
  removewtachlist(slug) {
    this._watchListService.removeWatchListTop(slug).subscribe(res => {
      if (res.isSuccess) {
        this.getwatchlistbyslug(this.watchlistslug)
        this._accountService.changetopfive();
         this._commonService.showSuccessAlert(res.message);
      } else {
        this._commonService.showErrorAlert(res.message);
      }
    })
  }
  deleteWatchListItem(id) {
    this._watchListService.DeleteWatchList(id).subscribe(responseData => {
      if (responseData.isSuccess) {
        this.getwatchlistbyslug2(this.watchlistslug, this.Watchlistsymbollist)
        this._accountService.changetopfive();
         this._commonService.showAlert("Sucess!", MessageTitleEnum.RemoveSuccess, PopupMessageTypeEnum.Success)
        
      } 
      else {
         this._commonService.showAlert("Opps!", responseData.message, PopupMessageTypeEnum.Warning)
      }
    });
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
  CalculateWeek52Data(index) {
    return (this.WatchSocketdata[index]?.week52low / this.WatchSocketdata[index]?.week52high * 100)
  }
  CalculateVolumeData(index) {
    return (this.WatchSocketdata[index]?.avgTotalVolume / this.WatchSocketdata[index]?.latestVolume * 100) / 2;
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
  datechange(e) {
    if(e.value) {
      this.datefilter = this.datepipe.transform(e.value, 'yyyy-MM-dd');
      
    } else {
      this.datefilter=""
    }
    this.getwatchlistnews(this.watchlistslug, this.newspage, this.neswlimit, this.Filterbynews2,this.Filterbysymbol2,this.datefilter)
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
  
 headerSoket(Watchlistsymbollist) {
  this.changeSocket = webSocket(`${websocketurl.url}/ws/change-percent/${Watchlistsymbollist}/`);
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
