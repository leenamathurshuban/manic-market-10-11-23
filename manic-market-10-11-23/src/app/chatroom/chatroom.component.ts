import { Component, OnInit, ViewChild,ElementRef} from '@angular/core';
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
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css'],
})
export class ChatroomComponent implements OnInit {
  @ViewChild('chatContainer') private chatContainerRef: ElementRef;
  showchat: any = false;
  showRestore: any = false;
  chatno: any = 1224;
  message: any = '';
  imagepath = imagepath;
  userDetail: Observable<UserViewModel>;
  _userDetail = new UserViewModel();
  ChatSocket: any;
  chatdata: any = [];
  participant: any = [];
  tempChat: any = [];
  chatSymbol: any = [];
  login: any;
  feedbackInput = '';
  checked: boolean;
  userget: any;
  visible: boolean = true;
  showPortal = false;
  symbol: string;
  model: any;
  comanyLogoget: any = [];
  logoGet: any = [];
  specialWords: any = [];
  searchValue: string = "";
  UserSocket: any;
  loginCount: any;
  usersCount: any = [];
  showTime:boolean = false;
  scrollHeight: any = {};
  windowOpen: any;
  popChat: any;
  psshow = false;
  constructor(
    private readonly _companyService: CompanyService,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly appCoponent: AppComponent,
    public base: BaseAPIService,
    public readonly _accountService: AccountsService
  ) {
    this._accountService.isLoggedIn.subscribe((data) => {
      this.login = data;
    });
    this.userDetail = this._accountService.userDetail;
    this.appCoponent.setLayout(true, true, true);
    if (this._route.snapshot.params.symbol) {
      this.symbol = this._route.snapshot.params.symbol;
    }
    
  }

  ngOnInit(): void {
    this.getlogoThis();
    this.userCount();
    this.userDetail.subscribe((data) => {
      this._userDetail = data;
      this.ChatSocket && this.ChatSocket.complete();
      this.chatconnect();
      // this.allchatlogo()
    });
    
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  scrollToBottom(): void {
    try {
      this.chatContainerRef.nativeElement.scrollTop = this.chatContainerRef.nativeElement.scrollHeight;
    } catch (err) {}
  }
  chatconnect() {
    this.ChatSocket = webSocket(
      `${websocketurl.url}/ws/chat/stock/${this._userDetail?.username}/`
    );
    this.ChatSocket.subscribe(
      (msg: any) => {
        if (msg.message) {
          this.chatdata.push(msg);
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

  onclickbtn() {
    this.visible = !this.visible;
  }

  getlogoThis() {
    this.base.get(AppSetting.getAllSymbolLogo).subscribe((symbollLogoget) => {
      this.comanyLogoget = symbollLogoget.data;
      this.chatSymbol.push(symbollLogoget.data);
    });
  }

  onclick() {  
    this.showTime = !this.showTime
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
  // new window open

  psShow() {
    this.psshow = !this.psshow
  }
}
