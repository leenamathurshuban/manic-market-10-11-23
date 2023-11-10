export class CommonModel {
}
export class Select2Model {
  /** value  */
  value: string | number | boolean;;
  /** label of option */
  label: string;
  changePercent?:any;
  /** no selectable is disabled */
  disabled?: boolean;
  /** for identification */
  id?: string;
  /** add classes  */
  classes?: string;
  /** template id  */
  templateId?: string;
  /** template data  */
  data?: any;
  /** hide this option */
  hide?: boolean;
}

export class ResponseModel {
  data: any;
  symbol:any;
  news: any;
  message: string;
  status: number;
  isSuccess: boolean;
  page?: number | null;
  is_next:any;
  num_pages:any;
  filter:any;
  news_publishers:any;
  filter_symbol:any;
  publishers:any;
}

export class SiteConfig {
  isShowLogo: boolean;
  isSearchBar: boolean;
  isShowFooter: boolean;
}

export class IndexModel {
  Page: number;
  PageSize: number;
  Search: string;
  OrderBy: string;
  OrderByAsc: number;
  IsPostBack: boolean;
  AdvanceSearchModel: any;
  constructor() {
    this.Page = 1;
    this.PageSize = 10;
    this.Search = "";
    this.OrderBy = null;
    this.OrderByAsc = 0;
    this.IsPostBack = false;
    this.AdvanceSearchModel = null;
  }
}

export class ScreenerFilterModel {
  constructor(){
    this.Price= new PriceValueModel();
    this.Country=[];
    this.Page = 1;
    this.PageSize = window.innerWidth < 400 ? 10 : 20;
  }
  Country: string[]=[];
  MarketCap: string;
  Price: PriceValueModel;
  Sector: string[]=[];
  Industry: string[]=[];
  ColumnName: string;
  OrderBy: boolean;
  Page: number=1;
  PageSize: number = window.innerWidth < 400 ? 10 : 20 ;
}
export class PriceValueModel {
  Min: number | string="";
  Max: number | string=""
};

export class ScreenerFilterVisibiltyModel {
  IsShowCountry: boolean = true;
  IsShowMarketCap: boolean = true;
  IsShowPrice: boolean = true;
  IsShowSector: boolean = true;
  IsShowIndustry: boolean = true;

}


export class DropDownModel {
 id?:string;
 value:string;

}