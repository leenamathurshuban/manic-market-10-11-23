import { Component, OnInit } from '@angular/core';
import { AccountsService } from './../Shared/Service/accounts.service';
import { Observable } from 'rxjs/internal/Observable';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { UserViewModel } from '../Shared/Model/account.model';
import { websocketurl, imagepath } from 'src/environments/environment';
import { webSocket } from 'rxjs/webSocket';
import { CompanyService } from 'src/app/Shared/Service/company.service';
import { SymbolViewModel } from 'src/app/Shared/Model/company.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AppSetting } from 'src/app/Shared/Model/app-setting.model';
import { BaseAPIService } from 'src/app/Shared/Service/base-api.service';
import { CommonHelperService } from '../Shared/Service/common-helper.service';

interface TimeStamp {
  startTime: Date;
  stopTime: Date;
}

@Component({
  selector: 'app-mobilechat',
  templateUrl: './mobilechat.component.html',
  styleUrls: ['./mobilechat.component.css']
})
export class MobilechatComponent implements OnInit {
  showchat: any = false;
  showRestore: any = false;
  chatno: any = 1224;
  message: any = '';
  imagepath = imagepath;
  userDetail: Observable<UserViewModel>;
  _userDetail = new UserViewModel();
  ChatSocket: any;
  chatdata: any = [];
  tempChat: any = [];
  chatSymbol: any = [];
  participant: any = [];
  login: any;
  feedbackInput = '';
  checked: boolean;
  timeStamp: TimeStamp;
  userget: any;
  isLoggedIn: boolean;
  showPortal = false;
  symbol: string;
  model: any;
  comanyLogoget: any = [];
  logoGet: any = [];
  specialWords: any = [];
  UserSocket: any;
  loginCount: any;
  showTime:boolean = false
  usersCount: any;
  userInfo;
  constructor(
    private readonly _companyService: CompanyService,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _commonService: CommonHelperService,
    public base: BaseAPIService,
    public readonly _accountService: AccountsService
  ) {
    this._accountService.isLoggedIn.subscribe((data) => {
      this.login = data;
    });
    this.userDetail = this._accountService.userDetail;
    if (this._route.snapshot.params.symbol) {
      this.symbol = this._route.snapshot.params.symbol;
    }
  }

  ngOnInit(): void {
    this.getlogoThis();
    this.userCount();
    this.getActiveUser();
    this.userDetail.subscribe((data) => {
      this._userDetail = data;
      this.ChatSocket && this.ChatSocket.complete();
      this.chatconnect();
    });
    
  }
  chatconnect() {
    this.ChatSocket = webSocket(
      `${websocketurl.url}/ws/chat/stock/${this._userDetail?.username}/`
    );
    this.ChatSocket.subscribe(
      (msg: any) => {
        if (msg.message) {
          let messageWithLOGO;
          var words = msg.message.split(' ');
          this.tempChat.push(msg);
          var result = msg.message.match(/(\$\S+\b)/gi);
          if (result) {
            let TempResult = result;
            result.forEach((element: any, i: any) => {
              var wordss = element.replace(/[^a-zA-Z ]/g, '');
              let abs = this.chatSymbol[0].find(
                (o) => o.symbol === wordss.toUpperCase()
              );
              let SymbolLink= `https://manicmarket.com/company-profile/${abs.symbol}`;
              if (abs !== undefined) {
                var index = words.indexOf(TempResult[i]);
                words[index] = `<a href=${SymbolLink} ><img class="chatLogo" src=${abs.logo} /></a>`;
                messageWithLOGO = words.join(' ');
              }
            });
            if (messageWithLOGO !== undefined) {
              var index2 = this.tempChat.findIndex(
                (img) => img.message === msg.message
              );
              this.tempChat[index2].message = messageWithLOGO;
              this.chatdata.push(this.tempChat[index2]);
            } else {
              this.chatdata.push(msg);
            }
          } else {
            this.chatdata.push(msg);
          }
        }
        const checkparticipant = this.participant.some(
          (obj) => obj.username === msg.username
        );
        if (!checkparticipant) {
          this.participant.push(msg);
        }
      },
      (err) => console.log(err)
    );
  }

  inputchange(e) {
    this.message = e.target.value;
  }

  messagesend() {
    if (this.message && this.ChatSocket) {
      this.ChatSocket.next({
        message: this.message,
      });
      this.message = '';
    }
  }

  getlogoThis() {
    this.base.get(AppSetting.getAllSymbolLogo).subscribe((symbollLogoget) => {
      this.comanyLogoget = symbollLogoget.data;
      this.chatSymbol.push(symbollLogoget.data);
    });
  }

  userCount() {
    this.UserSocket = webSocket(`${websocketurl.url}/ws/stock/user/login/count/`);
    this.UserSocket.subscribe((msg) => {
      this.loginCount = msg.login_count;
      this.usersCount = msg.users;
      setTimeout(() => {
        this.UserSocket.next({});
       }, 5000)
    });
  }

  onclick() {  
    this.showTime = !this.showTime
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
}