import { Component } from '@angular/core';
import { SiteConfig } from './Shared/Model/common-model.model';
import { AccountsService } from './Shared/Service/accounts.service';
import { Router } from '@angular/router'

declare const clicktable: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MMM-App';
  siteConfig = new SiteConfig();
  isVisibleLoader = true;
  isMobile = false;
  constructor(private readonly _AccountsService: AccountsService,
    public router: Router) {
    this._AccountsService.getLoginUserDetail();
    clicktable();
  }

  setLayout(isSearchBar: boolean = true, isShowLogo: boolean = true, isShowFooter = true) {
    this._AccountsService.getLoginUserDetail();
    this.siteConfig.isSearchBar = isSearchBar;
    this.siteConfig.isShowLogo = isShowLogo;
    this.siteConfig.isShowFooter = isShowFooter;
  }

  showLoaderEvent(value: boolean = true) {
    
    this.isVisibleLoader = value;
  
  }

}
