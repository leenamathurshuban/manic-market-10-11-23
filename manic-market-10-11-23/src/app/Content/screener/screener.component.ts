import { Router } from '@angular/router';
import { DropDownModel, ScreenerFilterModel, ScreenerFilterVisibiltyModel } from './../../Shared/Model/common-model.model';
import { Component, ElementRef, HostListener, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { IndexModel } from 'src/app/Shared/Model/common-model.model';
import { CompanySearchViewModel } from 'src/app/Shared/Model/company.model';
import { CompanyService } from 'src/app/Shared/Service/company.service';
import { MessageTitleEnum, PopupMessageTypeEnum } from 'src/app/Shared/Enum/fixed-value.enum';
import { CommonHelperService } from '../../Shared/Service/common-helper.service';
import { DropdownService } from 'src/app/Shared/Service/dropdown.service';
import * as $ from "jquery";
import { BaseAPIService } from 'src/app/Shared/Service/base-api.service';
import { Title } from "@angular/platform-browser";
import { AppSetting } from 'src/app/Shared/Model/app-setting.model';
import { AccountsService } from 'src/app/Shared/Service/accounts.service';
import { websocketurl } from 'src/environments/environment';
import { webSocket } from 'rxjs/webSocket';
declare const clicktable: any;
interface ReplacementItem {
  symbol : string;
}

@Component({
  selector: 'app-screener',
  templateUrl: './screener.component.html',
  styleUrls: ['./screener.component.css']
})
export class ScreenerComponent implements OnInit {
  model: CompanySearchViewModel[] = [];
  filterModel = new ScreenerFilterModel();
  filterConfigModel = new ScreenerFilterVisibiltyModel()
  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: this.filterModel.PageSize,
    ordering: true,
    paging: false,
    info: false
  };
  strCountry: string;
  MarketCapFilterValues = ["Small Cap", "Mid Cap", "Large Cap", "Mega Cap", "All Cap"];
  dtTrigger: Subject<any> = new Subject<any>();
  Columns = [];
  ddlSector: DropDownModel[] = [];
  countrylist: any = [];
  ddlIndustry = [];
  feedbackInput = '';
  isLoggedIn: boolean;
  filterapply: any;
  diffrent: any = 50;
  startpos: any = 0;
  startpos1: any = 1;
  startpos2: any = 2;
  shownextpage: any = 5;
  pageselect: any = 1;
  pagenum: any = 0;
  show: any;
  datefilter: any = "";
  demoarray: any = [];
  showpage: any;
  modell: any =[];
  userInfo;
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
  videoSource =
    'https://static.videezy.com/system/resources/previews/000/044/479/original/banana.mp4';
  
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  private _base: any;
  constructor(private readonly appCoponent: AppComponent,
    private readonly _companyService: CompanyService,
    public readonly _commonService: CommonHelperService,
    private readonly _dropdownService: DropdownService,
    private readonly _router: Router,
    public base: BaseAPIService,
    private titleService: Title,
    public _accountService: AccountsService,
    private baseService: BaseAPIService
  ) {
    this._accountService.isLoggedIn.subscribe(data => {
      this.isLoggedIn = data;
    });
    this.appCoponent.setLayout(true, true, true);
    this.titleService.setTitle("Stock Screener - Manic Market manicmarket.com");
    _commonService.updateScreener.subscribe(res => {
      if (res) {
        this.ResetFilter('all', true);
        this.reLoadResult();
      }
    });
    
  }
  
  ngOnInit(): void {
    // this.headerSoket()
    this.getListData();
    clicktable();
    this.getActiveUser();
  }
  
 
  
  // screenerget() {
  //   this._base.post(`${AppSetting.screenerListURL}?page=${'1'}&limit=${'20'}`).subscribe(responseData => {
  //     this.modell = responseData.data;
  //   });
  // }
  pageChange(value) {
    if (value >= 1) {
      window.scrollTo(0, 0)
      this.screenerListget(value)
    }
  }
  valuecheck(val1, val2) {
    return (val1 - val2) > 1
  }
  bindDropDown() {
    if (this.ddlSector == undefined || this.ddlSector.length == 0) {
      this.getDDLSector();
    }
    if (this.countrylist == undefined || this.countrylist.length == 0) {
      this.getcountrylist();
    }
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  reLoadResult(): void {
    if (this.dtElement) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
      });
    }
    this.dtTrigger.next();
  }
  screenerListget(page) {
    this.pageselect = page;
    this.demoarray = [];
    this._companyService.ScreenerList(this.filterModel, page).subscribe(responseData => {
      if (responseData.isSuccess) {
        this.model = responseData.data as CompanySearchViewModel[];
        this.pagenum = responseData?.page;
        this.newpagebutton();
      }
    });
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
            for (let j = this.startpos; j <= (this.shownextpage * this.startpos2); j++) {
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
    window.scrollTo(0, 0)
  }
  getListData() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: this.filterModel.PageSize,
      serverSide: true,
      paging: false,
      ordering: true,
      order: [2, 'asc'],
      searching: true,
      info: false,
      ajax: (dataTablesParameters: any, callback) => {
        this.filterModel.OrderBy = dataTablesParameters.order[0].dir == 'asc' ? true : false;
        this.filterModel.ColumnName = dataTablesParameters.columns[dataTablesParameters.order[0].column].data;
        this.model = [];
        this.screenerListget(1)
        callback({
          recordsTotal: this.pagenum,
          recordsFiltered: this.pagenum,
          data: []
        });
      },
      columns: [{  data: 'symbol' },{ name: 'Company Name', data: 'company' }, { name: 'Market Cap', data: 'marketcap' }, { name: 'P/E', data: 'peratio' }, { name: 'Sector', data: 'sector' }, { name: 'Industry', data: 'industry' },
      { name: 'Country', data: 'country' },{ name: 'Price', data: 'price' }, { name: 'Change', data: 'change' },{ name: 'Volume', data: 'volume' },{ name: 'Avg. Vol.', data: 'avg. vol.',}]
    };
   
  }

  onAddCountry() {
    if (!this.filterModel.Country) {
      this.filterModel.Country = [];
    }
    if (this.strCountry && !this.filterModel.Country.includes(this.strCountry)) {
      this.filterModel.Country.push(this.strCountry);
    }
    else if (this.strCountry && this.filterModel.Country.includes(this.strCountry)) {
      //this._commonService.showAlert("Opps!", MessageTitleEnum.AlreadyAdded, PopupMessageTypeEnum.Warning)
    }
    // else {
    //   //this._commonService.showAlert("hmm!", "Please Enter Country...!", PopupMessageTypeEnum.Info)
    // }
    this.strCountry = undefined;
  }
  onRemoveCountry(index: number) {
    // this.filterModel.Country.splice(index, 1);
    this.filterModel.Country = this.filterModel.Country.filter((v, i) => i != index);
  //old  // this._commonService.showAlert("Opps!", MessageTitleEnum.RemoveSuccess, PopupMessageTypeEnum.Info)
  }
  onRemoveIndustry(index: number) {
    this.filterModel.Industry = this.filterModel.Industry.filter((v, i) => i != index);
  }
  onRemoveSector(index: number) {
    this.filterModel.Sector = this.filterModel.Sector.filter((v, i) => i != index);
  }
  ResetFilter(key, isReset) {
    if (isReset) {
      switch (key) {
        case 'country':
          // this.filterConfigModel.IsShowCountry = false;
          this.strCountry = '';
          this.filterModel.Country = undefined;
          // this.filterModel.Country = [];
          break;
        case 'marketcap':
          this.filterConfigModel.IsShowMarketCap = false;
          this.filterModel.MarketCap = undefined;
          break;
        case 'price':
          // this.filterConfigModel.IsShowPrice = false;
          this.filterModel.Price.Min = undefined;
          this.filterModel.Price.Max = undefined;
          break;
        case 'sector':
          // this.filterConfigModel.IsShowSector = false;
          this.filterModel.Sector = undefined;
          break;
        case 'industry':
          // this.filterConfigModel.IsShowIndustry = false;
          this.filterModel.Industry = undefined;
          break;
        case 'all':
          this.filterModel.Country = [];
          this.filterModel.MarketCap = undefined;
          this.filterModel.Price.Min = undefined;
          this.filterModel.Price.Max = undefined;
          this.filterModel.Sector = undefined;
          this.filterModel.Industry = undefined;
          break;
        default:
          break;
      }
    }
  }
  selectedSector(value) {
    this.base.get(AppSetting.sectorSelection + `?sectors=${value.join()}`).subscribe((res) => {
      this.ddlIndustry = undefined;
      this.ddlIndustry = res.data;
    })
  }
  getDDLIndustry() {
    this._dropdownService.getDDLIndustry().subscribe(responseData => {
      if (responseData.isSuccess) {
        this.ddlIndustry = responseData.data as DropDownModel[];
      }
    }, error => {
    });
  }
  getDDLSector() {
    this._dropdownService.getDDLSector().subscribe(responseData => {
      if (responseData.isSuccess) {
        this.ddlSector = responseData.data as DropDownModel[];
      }
    }, error => {
    });
  }
  getcountrylist() {
    this._dropdownService.getcountryapi().subscribe(responseData => {
      if (responseData.isSuccess) {
        this.countrylist = responseData.data;
      }
    }, error => {
    });
  }
  redirectToProfile(symbol) {
    this._router.navigate(['company-profile', symbol]);
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
  gotoLoginPage() {
    if ((!this.isLoggedIn)) {
      this._router.navigate(['/login']);
    }
  }
//   headerSoket() {
//   this.changeSocket = webSocket(`${websocketurl.url}/ws/change-percent/GOOGL/`);
//     this.changeSocket.subscribe((msg) => {
//       this.changeFinance = msg.data;
//       this.changeFinance.forEach((item1, index) => {
//         if (this.replacementArray[index]) {
//           this.changeFinance[index].symbol = this.replacementArray[index].symbol;
//         }
//       });
//     setTimeout(() => {
//       this.changeSocket.next({});
//     }, 60000)
//   });
// }
}



