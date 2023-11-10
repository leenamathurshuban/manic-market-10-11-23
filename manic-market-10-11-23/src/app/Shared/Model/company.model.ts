export class SymbolViewModel {
    symbol: string;
    exchange: string;
    exchangeSuffix: string;
    exchangeName: string;
    name: string;
    date: string;
    symbol_type: string;
    iexId: string;
    region: string;
    currency: string;
    isEnabled: boolean;
    figi: string;
    cik: string;
    lei: string;
    created_at: Date;
    updated_at: Date;
    company_symbol: number[];
    logo_finance = new CompanyFinanceViewModel(); 
}



export class CompanyQuoteDataViewModel {
    // id: number;
    // symbol: string;
    // primaryExchange: string;
    // latestPrice: number;
    // latestSource: string;
    // latestTime: string;
    // latestUpdate: string;
    // latestVolume: number;
    // previousClose: number;
    // change: string;
    // changePercent: number;
    // avgTotalVolume: number;
    // marketCap: number;
    // peRatio: number;
    // ytdChange: string;
    // isUSMarketOpen: boolean;
    // iexBidPrice: number;
    // iexBidSize: number;
    // iexAskPrice: number;
    // iexAskSize: number;
    // iexOpen: number;
    // iexOpenTime: number;
    // iexClose: number;
    // iexCloseTime: number;
    // created_at: Date;
    // updated_at: Date;
    // company: number;


    id: number;
    symbol: string;
    primaryExchange: string;
    latestPrice: number;
    latestSource: string;
    latestTime: string;
    latestUpdate: string;
    latestVolume: number;
    previousClose: number;
    change: string;
    changePercent: string;
    avgTotalVolume: number;
    marketCap: number;
    peRatio: number;
    ytdChange: string;
    isUSMarketOpen: boolean;
    iexBidPrice?: any;
    iexBidSize?: any;
    iexAskPrice?: any;
    iexAskSize?: any;
    iexOpen: number;
    iexOpenTime: number;
    iexClose: number;
    iexCloseTime: number;
    created_at: Date;
    updated_at: Date;
    company: number;

}

export class CompanyKeyStatViewModel {
    id: number;
    marketcap: number;
    week52high: number;
    week52low: number;
    week52highSplitAdjustOnly: string;
    week52lowSplitAdjustOnly: string;
    week52change: number;
    sharesOutstanding: number;
    Float?: any;
    avg10Volume: number;
    avg30Volume: number;
    day200MovingAvg: number;
    day50MovingAvg: number;
    employees: number;
    ttmEPS: number;
    ttmDividendRate: number;
    dividendYield: number;
    nextDividendDate: string;
    exDividendDate: string | any;
    nextEarningsDate: string | any;
    beta: number;
    maxChangePercent: number;
    year5ChangePercent: number;
    year2ChangePercent: number;
    year1ChangePercent: number;
    ytdChangePercent: number;
    month6ChangePercent: number;
    month3ChangePercent: number;
    month1ChangePercent: number;
    day30ChangePercent: number;
    day5ChangePercent: number;
    created_at: Date;
    updated_at: Date;
    company: number;
}

export class NewsViewModel {
    id: number;
    headline: string;
    source: string;
    url: string;
    summary: string;
    related: string;
    image: string;
    lang: string;
    hasPaywall: boolean;
    created_at: Date;
    updated_at: Date;
    company: number[];
}


export class News {
    symbols: string;
    title: string;
    source_name: string;
    date: string;
    time: string;


}

export interface NewsListViewModel {
    symbols: string[];
    title: string;
    slug: string;
    source_name: string;
    text: string;
    topics: string;
    url: string;
    image: string;
    sentiment: string;
    type: string;
    date: string;
    time: string;
    created_at: Date;
    updated_at: Date;


}
export class CompanySearchViewModel {
    constructor() {
        this.company_quote_data = new CompanyQuoteDataViewModel();
        this.company_key_stats = new CompanyKeyStatViewModel();
        this.news = [];
        this.company_finance = new CompanyFinanceViewModel();        
    }
    // symbol: SymbolViewModel;
    // companyName: string;
    // exchange: string;
    // industry: string;
    // website: string;
    // description: string;
    // CEO: string;
    // securityName: string;
    // issueType: string;
    // sector: string;
    // primarySicCode: number;
    // employees: number;
    // tags: string;
    // address: string;
    // address2?: any;
    // state: string;
    // city: string;
    // zipCode: string;
    // country: string;
    // phone: string;
    // top: boolean;
    // created_at: Date;
    // updated_at: Date;
    // company_quote_data: CompanyQuoteDataViewModel[]=[];
    // company_key_stats: CompanyKeyStatViewModel[]=[];
    // news: News[]=[]
    id: number;
    changePercent:any;
    latestPrice:any;
    symbol: string;
    symbol_id: string;
    companyName: string;
    exchange: string;
    industry: string;
    website: string;
    sector: string;
    tags: string[];
    country: string;
    annual_report: any;
    annual_report_file:any;
    company_quote_data: CompanyQuoteDataViewModel;
    company_key_stats: CompanyKeyStatViewModel;
    news: News[];
    company_finance: CompanyFinanceViewModel;
    isAddedWatchList: boolean;
    
}

export class CompanyFinanceViewModel {
    IncomeStatement: AnnualQuarterlyViewModel;
    BalanceSheet: AnnualQuarterlyViewModel;
    CashFlow: AnnualQuarterlyViewModel;
}


export class AnnualQuarterlyViewModel {
    Annual: FinancialDetailData;
    Quarterly: FinancialDetailData;
}



export class FinancialDetailData {
    id: number;
    company: number;
    session: string;
    sheet: string;
    name: string;
    block: number;
    parent?: number;
    TTM: string;
    Heading1: string;
    Heading2: string;
    Heading3: string;
    Heading4: string;
    Heading5: any;
    block_data: FinancialDetailData[];
    children: FinancialDetailData[];
}

export class FinancialDataGridConfigModel {
    ColspanValue: number = 1;
    IsShowCol1: boolean = false;
    IsShowCol2: boolean = false;
    IsShowCol3: boolean = false;
    IsShowCol4: boolean = false;
    IsShowCol5: boolean = false;
}
