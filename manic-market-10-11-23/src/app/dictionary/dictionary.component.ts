import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { UserViewModel } from '../Shared/Model/account.model';
import { BaseAPIService } from '../Shared/Service/base-api.service';
import { CommonHelperService } from '../Shared/Service/common-helper.service';
import { Title } from "@angular/platform-browser";
import { AppSetting } from '../Shared/Model/app-setting.model';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AccountsService } from 'src/app/Shared/Service/accounts.service';


declare const clicktable: any;

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.css']
})
export class DictionaryComponent implements OnInit {
  Object = Object;
  _userDetail = new UserViewModel();
  isSuperUser: boolean = false;
  popUpDrop = false;
  title = '';
  isLoggedIn: boolean;
  dictonaryContent: any = [];
  newDicArray: any = [
    {
      title: '',
      description: '',
    }
  ];
  editingDic = false;
  alphabaticList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '1'];
  numberList = ['1','2','3','4','5','6','7','8','9','0'].slice(1);
  contentObject:any = {};
  selectedDicContent: any;
  isContent = false;
  feedbackInput = '';
  selectedAplha = {};
  paramsObject: any;
  alpha: any;
  slug: any;
  searchText;
  searchField;
  filteredUsers = [];
  variable = true;
  alp:any ={};
  userInfo;
  
  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    public _accountService: AccountsService,
    private appComponent: AppComponent,
    private baseService: BaseAPIService,
    public commonService: CommonHelperService,
    private titleService: Title,
  ) {
    this._accountService.isLoggedIn.subscribe(data => {
      this.isLoggedIn = data;
    });
    this.titleService.setTitle("Investor Dictionary - Manic Market  manicmarket.com");
    this.appComponent.setLayout(true, true, true);
  }

  ngOnInit(): void {
    
    this.getActiveUser();
    clicktable();
    this.contentObject = {};
    this.setNewDic();
    this.getDictonaryInfo();
    this.getUserDetails();
    this._route.paramMap.subscribe((params: ParamMap) => {
      this.paramsObject = { ...params };
      this.alpha = this.paramsObject?.params?.alpha;
      this.slug = this.paramsObject?.params?.slug;
      if (this.alpha && this.slug) {
        this.getForSlugs(this.slug, this.alpha)
      }
      if (this.alpha && !this.slug) {
    this.titleService.setTitle(" Investor Dictionary Terms Starting With '"+ this.alpha +"' - Manic Market manicmarket.com");
      }
    });
  }
  showContent() {
    setTimeout(() => {
    this.variable = false;
  },0);
  }
  setNewDic() {
    this.title = '';
    this.newDicArray = [
      {
        title: '',
        description: '',
      }
    ];
  }

  filter($event, element) {
    this.selectedAplha = {};
    this.isContent = false;
      this.clearRestOfSelection(element);
      // document.getElementById(`${element}`).classList.add('active');
      if(document.getElementById(`head${element}`) && this.contentObject == undefined){
        if(element == "1" ) {
          this.selectedAplha[element] = this.contentObject[element].sort((a,b)=>b-a);
          this.selectedAplha["1"] = this.contentObject["1"].sort((a,b)=>b-a);
          this.selectedAplha["2"] = this.contentObject["2"].sort((a,b)=>b-a);
          this.selectedAplha["3"] = this.contentObject["3"].sort((a,b)=>b-a);
          this.selectedAplha["4"] = this.contentObject["4"].sort((a,b)=>b-a);
          this.selectedAplha["5"] = this.contentObject["5"].sort((a,b)=>b-a);
          this.selectedAplha["6"] = this.contentObject["6"].sort((a,b)=>b-a);
          this.selectedAplha["7"] = this.contentObject["7"].sort((a,b)=>b-a);
          this.selectedAplha["8"] = this.contentObject["8"].sort((a,b)=>b-a);
          this.selectedAplha["9"] = this.contentObject["9"].sort((a,b)=>b-a);
          this.selectedAplha["0"] = this.contentObject["9"].sort((a,b)=>b-a);
        } else {
          this.selectedAplha[element] = this.contentObject[element].sort((a,b)=>a.title.localeCompare(b.title,'en-US', {numeric:"true"}));
        }
      } else {
        if (this.contentObject[element] != undefined) {
          this.selectedAplha[element] = this.contentObject[element].sort((a,b)=>a.title.localeCompare(b.title,'en-US', {numeric:"true"}));
        } else {
          this._router.navigate(['investor-dictionary']);
        }
      }
      if (element=="#") {
        this._router.navigate(['investor-dictionary']);
      } else {
        this._router.navigate(['investor-dictionary/' + element]);
      }
  }

  getalpha(element) {
    this.variable = false;
    this.selectedAplha = {};
    this.isContent = false;
    setTimeout(() => {
      this.clearRestOfSelection(element);
      // document.getElementById(`${element}`).classList.add('active');
      if (document.getElementById(`head${element}`)) {
        this.selectedAplha[element] = this.contentObject[element].sort((a, b) => a.title.localeCompare(b.title));
      } else {
        if (element != undefined) {
         // this.commonService.showErrorAlert(`No Data for ${element} alphabet`)
        }
      }
   });
  }

  clearRestOfSelection(element) {
    [...this.alphabaticList, '#'].forEach((alpha) => {
      if (alpha !== element) {
      //  document.getElementById(alpha).classList.remove('active');
      }
    });
  }

  openPopup() {
    this.popUpDrop = true;
  }

  addNewContent() {
    if (this.editingDic) {
      this.newDicArray.push(
        {
          id: null,
          title: '',
          description: '',
        }
      );
    } else {
      this.newDicArray.push(
        {
          title: '',
          description: '',
        }
      );
    }
  }

  removeContent() {
    this.newDicArray.pop();
  }

  savingNewDicValue() {
    const value = {
      title: this.title,
      dictionaries: this.newDicArray
    };
    this.baseService.post(AppSetting.dictonaryCreate, value)
      .subscribe((res) => {
        if (res.isSuccess) {
          this.popUpDrop = false;
          this.setNewDic();
          this.contentObject = {};
          this.getDictonaryInfo();
        }
      });
  }

  editDictonary() {
    const value = {
      title: this.title,
      dictionaries: this.newDicArray
    };
    this.baseService.put(AppSetting.editDictonary + `${this.selectedDicContent.id}/`, value)
      .subscribe((res) => {
        this.popUpDrop = false;
        this.setNewDic();
        this.contentObject = {};
        this.getDictonaryInfo();
      });
  }

  getUserDetails() {
    this.baseService.get(AppSetting.getProfile).subscribe((user) => {
      this._userDetail = user.data;
      if (this._userDetail && this._userDetail.is_superuser) {
        this.isSuperUser = true;
      }
    });
  }

  deleteUser() {
    this.baseService.Delete(AppSetting.deleteDictonary + `${this.selectedDicContent.id}/`).subscribe((res) => {
      this.popUpDrop = false;
      this.setNewDic();
      this.contentObject = {};
      this.getDictonaryInfo();
    });
  }

  clearInputs() {
    this.setNewDic();
    this.editingDic = false;
    this.selectedDicContent = null;
  }

  checkForSlugs(element, alpha): void {
  this._router.navigate(['investor-dictionary/' + alpha + "/" + element?.slug]);
  this.baseService.get(AppSetting.getDictonary + element?.slug).subscribe((content) => {
    window.scroll({ 
      top: 0,
      behavior: "auto",
    });
  if (this.isSuperUser && this.commonService.adminDictonary) {
    this.popUpDrop = true;
    this.newDicArray = content.data.main_heading;
    this.editingDic = true;
    this.selectedDicContent = content.data;
    this.title = content.data.title;
  } else {
    this.selectedDicContent = content.data;
    this.isContent = true;
    
  }
  this.titleService.setTitle(`${this.selectedDicContent?.title} - Manic Market manicmarket.com`)
});
    // this.clearRestOfSelection(alpha);
    // this.titleService.setTitle(` Investor Dictionary Terms Starting With ${alpha.toUpperCase()} - Manic Market  manicmarket.com`)
    // document.getElementById(`${alpha}`).classList.add('active');
    // this.baseService.get(AppSetting.getDictonary + `${element.slug}/`).subscribe((content) => {
    //   if (this.isSuperUser && this.commonService.adminDictonary) {
    //     this.popUpDrop = true;
    //     this.newDicArray = content.data.main_heading;
    //     this.editingDic = true;
    //     this.selectedDicContent = content.data;
    //     this.title = content.data.title;
    //  } else {
    //   this.selectedDicContent = content.data;
    //   this.isContent = true;
    //  }
    // });
  }

  getForSlugs(slug, alpha) {
    this.clearRestOfSelection(alpha);
    this.titleService.setTitle(` Investor Dictionary Terms Starting With ${alpha.toUpperCase()} - Manic Market  manicmarket.com`)
    // document.getElementById(`${alpha}`).classList.add('active');
    this.baseService.get(AppSetting.getDictonary + `${slug}/`).subscribe((content) => {
      if (this.isSuperUser && this.commonService.adminDictonary) {
        this.popUpDrop = true;
        this.newDicArray = content.data.main_heading;
        this.editingDic = true;
        this.selectedDicContent = content.data;
        this.title = content.data.title;
      } else {
        this.selectedDicContent = content.data;
        this.isContent = true;
      }
      this.titleService.setTitle(`${this.selectedDicContent?.title} - Manic Market manicmarket.com`)
    });
  }
  
  gobacktolist() {
    this.selectedDicContent = null;
    this.isContent = null;
    this._router.navigate(['investor-dictionary/' + this.alpha]);
    if (this.alpha == undefined) {
      this._router.navigate(['investor-dictionary/']);
    }
  }
  
   stringIsNumber(s) {
    var x = +s; // made cast obvious for demonstration
    return x.toString() === s;
  }

  filterAccordingToAlphabet() {
    this.alphabaticList.forEach((alpha) => {
      this.dictonaryContent.forEach((data) => {
        if (data.title.startsWith(alpha) || data.title.startsWith(alpha.toLowerCase())) {
          if (this.contentObject[alpha] && this.contentObject[alpha].length) {
            this.contentObject[alpha] = [...this.contentObject[alpha], data];
            this.contentObject[alpha].sort((a,b)=>a.title.localeCompare(b.title,))
            
          }
          else {
            this.contentObject[alpha] = [data];
          }
        }
      });
    });
    this.numberList.forEach((num) => {
      this.dictonaryContent.forEach((data) => {
        if (data.title.startsWith(num)){
          this.contentObject['1'] = [...this.contentObject[1], data];
        }
      });
    });
    this.alphabaticList.forEach((alp) => {
     if (this.contentObject == undefined) {
      this.contentObject[alp].sort((a, b) => a.title.localeCompare(b.title));
     }
      if (this.alpha && this.slug) {
      } else if (this.alpha) {
        this.getalpha(this.alpha)
      }
    })
  }

  getDictonaryInfo() {
    this.baseService.get(AppSetting.getDictonary).subscribe((res) => {
        if (res.isSuccess) {
          this.dictonaryContent = res.data;
          this.filteredUsers = [...this.dictonaryContent];
          this.filterAccordingToAlphabet();
          // this.checkForSlugs(res.data);
        }
      });
  }

  filterDictionary() {
    this.contentObject = {};
    this.filteredUsers = [...this.dictonaryContent.filter(info => info.title.toLowerCase().includes(this.searchField.toLowerCase()))];
    this.alphabaticList.forEach((alpha) => {
      this.filteredUsers.forEach((data) => {
        if (data.title.startsWith(alpha) || data.title.startsWith(alpha.toLowerCase())) {
          if (this.contentObject[alpha] && this.contentObject[alpha].length) {
            this.contentObject[alpha] = [...this.contentObject[alpha], data];
          }
          else {
            this.contentObject[alpha] = [data];
          }
        }
      });
    });
    this.numberList.forEach((num) => {
      this.filteredUsers.forEach((data) => {
        if (data.title.startsWith(num)){
          this.contentObject['1'] = [...this.contentObject[1], data];
        }
      });
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
    });
  }

  clearSearchField() {
    this.searchField = '';
    this._router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      this._router.navigate(['investor-dictionary']);
    });
  }
  
  gotoLoginPage() {
    if ((!this.isLoggedIn)) {
      this._router.navigate(['/login']);
    }
  }

}
