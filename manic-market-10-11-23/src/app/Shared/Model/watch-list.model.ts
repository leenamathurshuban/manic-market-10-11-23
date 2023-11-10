
export class WatchListViewModel {
    id: number;
    user: User;
        company: Company;
    created_at: Date;
    updated_at: Date;
    
}

    export class User {
        id: number;
        last_login: Date;
        is_superuser: boolean;
        username: string;
        first_name: string;
        last_name: string;
        email: string;
        is_staff: boolean;
        is_active: boolean;
        date_joined: Date;
        is_email: boolean;
        key?: any;
        login_ip?: any;
        updated_at: Date;
        groups: any[];
        user_permissions: any[];
    }

    export class Symbol {
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
    }

    export class WatchlistCompanyQuoteData {
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
        peRatio?: number;
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

    export class WatchlistCompanyKeyStat {
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
        exDividendDate: string;
        nextEarningsDate: string;
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

    export class Company {
        symbol: string|Symbol;
        companyName: string;
        exchange: string;
        industry: string;
        website: string;
        description: string;
        CEO: string;
        securityName: string;
        issueType: string;
        sector: string;
        primarySicCode?: number;
        employees?: any;
        tags: string;
        address: string;
        address2: string;
        state: string;
        city: string;
        zipCode: string;
        country: string;
        phone: string;
        top: boolean;
        created_at: Date;
        updated_at: Date;
        company_quote_data: WatchlistCompanyQuoteData[];
        company_key_stats: WatchlistCompanyKeyStat[];
        news: any[];
    }

    export class WatchListNewsViewModel{
        
        symbol: string;
        title: string;
        source_name: string;
        date: string;
        time: string;
    }

