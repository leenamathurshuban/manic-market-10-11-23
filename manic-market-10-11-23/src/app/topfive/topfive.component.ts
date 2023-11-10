import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { UserViewModel } from '../Shared/Model/account.model';
import { CommonHelperService } from '../Shared/Service/common-helper.service';
import { webSocket } from 'rxjs/webSocket';
import { websocketurl } from 'src/environments/environment';
import { AccountsService } from './../Shared/Service/accounts.service';
import { WatchListService } from 'src/app/Shared/Service/watch-list.service';
import { LoaderService } from 'src/app/Shared/Helpers/loader.service';
import { AppComponent } from 'src/app/app.component';
import { shareReplay } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragEnter, CdkDragMove } from '@angular/cdk/drag-drop';

interface ReplacementItem {
  symbol : string;
}

@Component({
  selector: 'app-topfive',
  templateUrl: './topfive.component.html',
  styleUrls: ['./topfive.component.css']
})
export class TopfiveComponent implements OnInit {
  dragtopsix = true;
  width = 160;
  oldY = 0;
  grabber = false;
  PriceSocket: any;
  login: any;
  eventSource: any;
  edittopname: any = false;
  TopSocketdata: any;
  TopSocketdata2: any;
  topfivesymbol: any = [];
  testarray: any = [];
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
  isAuthenticated: Observable<boolean>;
  userDetail: Observable<UserViewModel>;
  _userDetail = new UserViewModel();
  @ViewChild('dropListContainer') dropListContainer?: ElementRef;
  dropListReceiverElement?: HTMLElement;
  dragDropInfo?: {
    dragIndex: number;
    dropIndex: number;
  };
  constructor(public readonly _accountService: AccountsService,
    private readonly _watchListService: WatchListService,
    private readonly _commonService: CommonHelperService,
    private cdRef: ChangeDetectorRef,
    private loaderService: LoaderService,
    private readonly appCoponent: AppComponent,
  ) {
    this.userDetail = this._accountService.userDetail;
    this._accountService.isLoggedIn.subscribe(data => {
      this.login = data;
    });
    this._accountService.istopfive.subscribe(data => {
      this.getwebsocketdata()
    });
  }
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.grabber) {
      return;
    }
    this.resizer(event.clientX - this.oldY);
    this.oldY = event.clientX;
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.grabber = false;
  }

  // @HostListener('document:mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.grabber = true;
    this.oldY = event.clientX;
  }

  resizer(offsetX: number) {
    this.width += offsetX;
  }

  ngOnInit(): void {
    this.userDetail.subscribe(data => {
      this._userDetail = data;
    });
    // this.getwebsocketdata()
  }
  ngAfterViewChecked(): void {
    
    this.loaderService.windowload.subscribe((res) => {
      this.cdRef.detectChanges();
    });
  }
  edittoplist() {
    this.edittopname = !this.edittopname;
  }
  getwebsocketdata() {
    this.PriceSocket && this.PriceSocket.complete();
    this._watchListService.GetWatchListTop().subscribe(response => {
      if (response.isSuccess) {
        this.TopSocketdata = response?.data;
        this.TopSocketdata2 = response?.data;
        this.topfivesymbol = response?.symbol;
        this.testarray = Object.keys(response.data)
        this.getpricewebsocket();
        this.headerSoket(this.topfivesymbol);
      }
    });
  }
  dragEntered(event: CdkDragEnter<number>) {
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
  dragwatchlistlist() {
    this.appCoponent.showLoaderEvent(false);
    this._watchListService.TopfiveindexDrag(this.testarray).subscribe(response => {
      this.appCoponent.showLoaderEvent(true);
      if (response.isSuccess) {
        for (let i = 0; i < this.testarray.length; i++) {
          document.getElementById("topfiveid" + i).style.removeProperty('display')
        }
      } else {
        this._commonService.showErrorAlert(response.message);
      }
    });
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
  getpricewebsocket() {
    this.PriceSocket = webSocket(`${websocketurl.url}/ws/stock-price/${this.topfivesymbol}/`);
    this.PriceSocket.subscribe(
      (msg) => {
        for (let key of Object.keys(this.TopSocketdata)) {
          if (this.TopSocketdata[key]?.symbol == msg?.message[key]?.symbol) {
            this.TopSocketdata[key].latestPrice = msg?.message[key]?.latestPrice;
            this.TopSocketdata[key].latestVolume = msg?.message[key]?.latestVolume;
            this.TopSocketdata[key].changePercent = msg?.message[key]?.changePercent;
            this.TopSocketdata[key].change = msg?.message[key]?.change;
            this.TopSocketdata[key].avgTotalVolume = msg?.message[key]?.avgTotalVolume;
            this.TopSocketdata[key].postMarketChange = msg?.message[key]?.postMarketChange;
            this.TopSocketdata[key].postMarketChangePercent = msg?.message[key]?.postMarketChangePercent;
            this.TopSocketdata[key].postMarketPrice = msg?.message[key]?.postMarketPrice;
            this.TopSocketdata[key].preMarketChange = msg?.message[key]?.preMarketChange;
            this.TopSocketdata[key].preMarketChangePercent = msg?.message[key]?.preMarketChangePercent;
            this.TopSocketdata[key].preMarketPrice = msg?.message[key]?.preMarketPrice;
            this.loaderService.window();
          }
        }
        setTimeout(() => {
          this.PriceSocket.next({});
        }, 60000)
      },
      (err) => console.log(err)
    );
    this.PriceSocket.next({});
  }
  removewtachlist(slug) {
    this._watchListService.removeWatchListTop(slug).subscribe(res => {
      if (res.isSuccess) {
        // this._commonService.showSuccessAlert(res.message);
        this._accountService.changetopfive();
      } else {
        // this._commonService.showErrorAlert(res.message);
      }
    })
  }
  headerSoket(topfivesymbol) {
    this.changeSocket = webSocket(`${websocketurl.url}/ws/change-percent/${topfivesymbol}/`);
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