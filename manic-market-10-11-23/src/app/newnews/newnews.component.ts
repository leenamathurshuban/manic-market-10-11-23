import { Component, OnInit } from '@angular/core';
import { BaseAPIService } from '../Shared/Service/base-api.service';
import { CompanyService } from '../Shared/Service/company.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { WatchListService } from '../Shared/Service/watch-list.service';

@Component({
  selector: 'app-newnews',
  templateUrl: './newnews.component.html',
  styleUrls: ['./newnews.component.css']
})
export class NewnewsComponent implements OnInit {  
  showNewsPopup = false;
  selectedNews;
  htmlComponent = '';
  newsSlug = '';
  symbol: string;
  pageselect: any = 1;
  neswlimit: any = 25;
  Filterbynews: any = [];
  datefilter: any = '';
 
  constructor(    private readonly _companyService: CompanyService,    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private _baseService: BaseAPIService,
    private readonly _watchListService: WatchListService,
  ) {
    this.getContent();
  }

  public getContent() {
  
  }
  
  ngOnInit(): void { 
    this._route.paramMap.subscribe((params: ParamMap) => {
      this.symbol=this._route.snapshot.params.symbol
      this.newsSlug=this._route.snapshot.params.newsslug
       if (this._route.snapshot.params.newsslug) {
        this.getnewsdetails(this.newsSlug);}
    });
  }
 
  closeNews() {
    this.showNewsPopup = false;
    this.selectedNews = null;
    this._router.navigate(['company-profile/' + this.symbol]);
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
}
