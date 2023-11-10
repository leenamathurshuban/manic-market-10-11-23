import { environment,cloud_sse } from "src/environments/environment";

export class AppSetting {

    //#region << Market Data URL >>
    static companySearchURL = environment.endPoint + "streaming/company/search/";
    static screenerListURL = environment.endPoint + "streaming/company/";

    static companyDetailURL = environment.endPoint + "streaming/company/";
    static companySugestionURL = environment.endPoint + "streaming/company/suggestion/"
    static companytrending = environment.endPoint + "streaming/company/trending/ticker/"
    static getNewsUrl = environment.endPoint + "streaming/news/get/"
    static getNewsUrlslug = environment.endPoint + "streaming/news/details/get/"
    static getFinanceUrl = environment.endPoint + "streaming/finance/get/"
    static SectorDDLURL = environment.endPoint + "streaming/company/sector/get/";
    static countrylistget = environment.endPoint + "streaming/company/country/get/";

    static industryDDLURL = environment.endPoint + "streaming/company/industry/get/";


    //#endregion

    static symbollSingle = cloud_sse.streaming + "streaming/event/stream/";
    static symbollnews = cloud_sse.streaming + "streaming/event/news/stream/";
   

    //#region User Account


    static loginUserUrl = environment.endPoint + "account/login/"
    static googleloginUserUrl = environment.endPoint + "account/login/google/"
    static facebookloginUserUrl = environment.endPoint + "account/login/facebook/"
    static signUpUserUrl = environment.endPoint + "account/create/"
    static loginuserCount = environment.endPoint + "account/login/user/count/"
    static userlogOut = environment.endPoint + "account/logout/"

    //#endregion


    //#region  <<watchlist>>
    static watchListUrl = environment.endPoint + "user/watchlist/get/"
    static watchListUrlSlug = environment.endPoint + "user/watchlist/list/get/"
    static tokenvarify = environment.endPoint + "account/user/email/verify/"
    static resendEmail = environment.endPoint + "account/user/email/resend/"
    static watchListNewsUrl = environment.endPoint + "user/watchlist/get/"
    static watchListUrlslug = environment.endPoint + "user/watchlist/get/"
    static watchListCreateUrl = environment.endPoint + "user/watchlist/create/"
    static watchListDragname = environment.endPoint + "user/watchlist/index/update/"
    static topfiveindexchange = environment.endPoint + "user/watchlist/top-five/symbol/index/update/"
    static watchListDraglist = environment.endPoint + "user/watchlist/symbol/index/update/"
    static bulk_update = environment.endPoint + "streaming/company/bulk-update/"
    static watchListDeleteUrl = environment.endPoint + "user/watchlist/symbol/delete/"
    static GetnewsByfilterslug = environment.endPoint + "streaming/news/get/"
    //#endregion
    static feebackCreate = environment.endPoint + 'feedback/create/'
    static watchlistcreate = environment.endPoint + 'user/watchlist/create/'
    static watchlistdelete = environment.endPoint + 'user/watchlist/delete/'
    static watchlisteditname = environment.endPoint + 'user/watchlist/edit/'
    static addtopfive = environment.endPoint + 'user/watchlist/top-five/add/'
    static gettopfive = environment.endPoint + 'user/watchlist/top-five/get/'
    static deletetopfive = environment.endPoint + 'user/watchlist/top-five/delete/'
    static dictonaryCreate = environment.endPoint + 'streaming/dictionary/create/'
    static editProfile = environment.endPoint + 'account/user/profile/edit/'
    static updatePassword = environment.endPoint + 'account/user/profile/password-change/'
    static addQuote = environment.endPoint + 'admin/quote/create/'
    static randCompany = environment.endPoint + 'streaming/company/explore/get/'
    static sectorSelection = environment.endPoint + 'streaming/company/industry/get/'
    static getProfile = environment.endPoint + 'account/user/profile/get/'
    static getDictonary = environment.endPoint + 'streaming/dictionary/get/'
    static searchQuote = environment.endPoint + 'quote/search/'
    static getQuote = environment.endPoint + 'quote/get/'
    static getQuoteLike = environment.endPoint + 'quote/liked/get/'
    static editQuote = environment.endPoint + 'admin/quote/edit/'
    static likeQuote = environment.endPoint + 'admin/quote/like/'
    static userManagement = environment.endPoint + 'account/user-management/'
    static editDictonary = environment.endPoint + 'streaming/dictionary/edit/'
    static deleteDictonary = environment.endPoint + 'streaming/dictionary/delete/'
    static quoteDelete = environment.endPoint + 'admin/quote/delete/'
    static deleteUser = environment.endPoint + 'account/user-management/delete/'
    static getFinanceinfo = environment.endPoint + 'streaming/finance/balance-sheet/get/'
    static getcashflowinfo = environment.endPoint + 'streaming/finance/cash-flow/get/'
    static getIncomeinfo = environment.endPoint + 'streaming/finance/income/get/'
    static getNumberinfo = environment.endPoint + 'streaming/numbers/detail/'
    static getAllSymbolLogo = environment.endPoint + 'streaming/company/symbol/logo/get/';
    static passwordChange = environment.endPoint + 'account/user/profile/forgot-password/';
    static forgetpasswordChange = environment.endPoint + 'account/user/profile/forgot-password/change/';
    static userSearch = environment.endPoint + 'account/user/search/';
    static companynewsSearch = environment.endPoint + 'streaming/news/get/';
    static deleteuserSelf = environment.endPoint + 'account/user/profile/delete/';
    static financeChanges = environment.endPoint + 'streaming/finance/changes-percentage/get/';

    
}
