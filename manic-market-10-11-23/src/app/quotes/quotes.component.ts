import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { UserViewModel } from '../Shared/Model/account.model';
import { AppSetting } from '../Shared/Model/app-setting.model';
import { BaseAPIService } from '../Shared/Service/base-api.service';
import { CommonHelperService } from '../Shared/Service/common-helper.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Title } from "@angular/platform-browser";

declare const clicktable: any;

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.css']
})
export class QuotesComponent implements OnInit {
  _userDetail = new UserViewModel();
  isSuperUser: boolean = false;
  islogin = false;
  isnextpage = false;
  timeout: any = null;
  page = 1;
  is_video:any;
  dataget: any = true;
  adderror: any;
  editerror: any;
  inthispage: any = true;
  quoteList = [];
  
  quoteListid = [];
  newQuote = {
    quote: '',
    author: '',
    source_text: '',
    source_url: '',
    is_video: ''
  };
  editQuote = {
    id: '',
    quote: '',
    author: '',
    source_text: '',
    source_url: '',
    is_video: ''
  };
  likeddata = {
    id: '',
    message: "",
  }
  showlikeddata = false;
  searhedLabel = '';
  feedbackInput = '';
  searhedElement;
  listdata: any [];
  isHere: boolean = false;
  userInfo;
  constructor(
    private appComponent: AppComponent,
    private baseService: BaseAPIService,
    public commonService: CommonHelperService,
    private readonly _router: Router,
    private readonly _appCoponent: AppComponent,
    private titleService: Title
  ) {
    this.appComponent.setLayout(true, true, true);
    this.titleService.setTitle("Manic Market");
  }
  deleteQuote() {
    this.baseService.Delete(AppSetting.quoteDelete + `${this.editQuote.id}/`).subscribe((res) => {
      this.emptyAllInstances();
      this.getAllQuotes();
    });
  }
  clearFilter() {
    this.searhedLabel = null;
    this.searhedElement = '';
    this.emptyAllInstances();
    this.getAllQuotes()
  }
  change() {
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(() => {
      if (this.searhedElement) {
        this.searchQuote()
      }else{
        this.getAllQuotes()
      }
    }, 1000)
  } 
  explorebtn() {
    this._router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      this._router.navigate(['quotes']);
  });
  }
  searchQuote() {
    this.page = 1;
    this._appCoponent.showLoaderEvent(false);
    this.baseService.get(this.showlikeddata ? (AppSetting.searchQuote + `liked/${this.searhedElement}/`) : (AppSetting.searchQuote + `${this.searhedElement}/`)).subscribe((res) => {
      this.searhedLabel = this.searhedElement;
      this._appCoponent.showLoaderEvent(true);
      this.emptyAllInstances();
      this.quoteList = res?.data;
      this.isnextpage = res?.is_next;
    });
  }
  ngOnInit(): void {
    this.getActiveUser();
    clicktable();
    window.addEventListener('scroll', () => this.scrollHandler(), true);
    this.inthispage = true;
    this.isnextpage = false;
    this.showlikeddata = false;
    this.getUserDetails();
    this.getAllQuotes();
  }
  ngOnDestroy() {
    this.page = 1;
    this.inthispage = false;
    window.removeEventListener('scroll', this.scrollHandler, true);
  }
  scrollHandler() {
    if (this.inthispage && this.isnextpage) {
      if (document.body?.scrollHeight === (window.innerHeight + window.scrollY) || (document.body?.scrollHeight <= (window.innerHeight + window.scrollY + 10))) {
        if (this.dataget) {
          this.dataget = false;
          this.page = this.page + 1;
          this.baseService.get(
            this.searhedElement ? (this.showlikeddata ? (AppSetting.searchQuote + `liked/${this.searhedElement}/` + "?page=" + this.page) : (AppSetting.searchQuote + `${this.searhedElement}/`+ "?page=" + this.page)): (this.showlikeddata ? (AppSetting.getQuoteLike + "?page=" + this.page) : (AppSetting.getQuote + "?ids=" + this.quoteListid))
            ).subscribe((list) => {
            this.isnextpage = list?.is_next;
            if (list?.data.length > 0) {
              this.quoteList = this.quoteList.concat(list?.data)
              this.quoteList.map((res)=>{
                if(!this.quoteListid.includes(res.id))
                this.quoteListid.push(res.id)
              })
            }
            this.dataget = true;
          });
        }
      }
    }
  }
  addNewQuote() {
    this.baseService.post(AppSetting.addQuote, this.newQuote).subscribe((res) => {
      if (res?.isSuccess) {
        this.emptyAllInstances();
        this.getAllQuotes();
        const ele = document.getElementById('closeadd');
        ele.click();
      } else {
        this.adderror = res?.message;
      }
    });
  }
  getEditableContent(item) {
    this.baseService.get(AppSetting.getQuote + `${item.id}/`).subscribe((res) => {
      this.editQuote = res.data;
    });
  }
  editingQuote() {
    this.baseService.put(AppSetting.editQuote + `${this.editQuote.id}/`, this.editQuote).subscribe((res) => {
      if (res?.isSuccess) {
        this.emptyAllInstances();
        this.getAllQuotes();
        const edit = document.getElementById('editclose');
        edit.click();
      } else {
        this.editerror = res?.message;
      }
    });
  }
  
  likeingQuote(id) {
    this._appCoponent.showLoaderEvent(false);
    if (this.islogin) {
      this.baseService.post(AppSetting.likeQuote + `${id}/`, '').subscribe((res) => {
       
        const indexxx=this.quoteList.findIndex(x => x.id === res.data.id)
        if (indexxx !== -1) {
          this.quoteList[indexxx]=res.data;
        }
        if (res.isSuccess) {
          this.likeddata.id = id;
          this.likeddata.message = res.message;
          setTimeout(() => {
            this.likeddata.id = '';
            this.likeddata.message = '';
          }, 1000)
          if (this.searhedElement) {
            this.searchQuote();
          } else {
            // this.getAllQuotes();
             
          }
        }
      });
    } else {
      this._router.navigate(['login/quotes/' + "true"]);
    }
  }

  getAllQuotes() {
    this.quoteListid = [];
    this.page = 1;
    this.isnextpage = false;
    this.baseService.get(this.showlikeddata ? AppSetting.getQuoteLike : AppSetting.getQuote).subscribe((list) => {
      this.isnextpage = list?.is_next;
      this.quoteList = list.data;
      this.quoteList.map((res)=>{
        if(!this.quoteListid.includes(res.id))
        this.quoteListid.push(res.id);
        this.isHere = true;
      })
    });
  }
  showliked(show) {
    if (this.islogin) {
      this.page = 1;
      this.showlikeddata = !show;
      if (this.searhedElement) {
        this.searchQuote();
      } else {
        this.quoteListid = [];
        this.getAllQuotes();
      }
    } else {
      this._router.navigate(['login/quotes/' + "true"]);
    }
  }
  emptyAllInstances() {
    this.quoteList = [];
    this.newQuote = {
      quote: '',
      author: '',
      source_text: '',
      source_url: '',
      is_video: ''
    };
  }

  getUserDetails() {
    this.baseService.get(AppSetting.getProfile).subscribe((user) => {
      this._userDetail = user.data;
      if (user.data) {
        this.islogin = true;
      } else {
        this.islogin = false;
      }
      if (this._userDetail && this._userDetail.is_superuser) {
        this.isSuperUser = true;
       
      }
    });
  }
  getActiveUser() {
    this.baseService.get(AppSetting.getProfile).subscribe((user) => {
      this.userInfo = user.data;
    });
  }
  saveFeedback() {
    const feedback = {
      // email: '',
      feedback: this.feedbackInput
    }
    this.baseService.post(AppSetting.feebackCreate + (this.userInfo.id)+ '/', feedback).subscribe(() => {
       this.commonService.showSuccessAlert('Thank you for the feedback! Please continue to share any ideas to help improve the site!');
    })
  }
  gotoLoginPage() {
    if ((!this.islogin)) {
      this._router.navigate(['/login']);
    }
  }

}
