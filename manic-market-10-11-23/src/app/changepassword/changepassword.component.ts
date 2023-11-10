import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { WatchListService, } from 'src/app/Shared/Service/watch-list.service';
import { MessageTitleEnum, PopupMessageTypeEnum } from '../Shared/Enum/fixed-value.enum';

import { CommonHelperService } from '../Shared/Service/common-helper.service';
@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {
  tokenvarifyed = false;
  token: any;
  email: any;
  password:any;
  paramsObject: any;
  message: any = "Token verification is happening ..."
  constructor(private readonly appCoponent: AppComponent,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _watchListService: WatchListService,    
    private readonly _commonService: CommonHelperService,


  ) {
    this.appCoponent.setLayout(true, true, true);
  }


  ngOnInit(): void {
    this._route.queryParamMap
      .subscribe((params) => {
        this.paramsObject = { ...params };
        this.token = this.paramsObject?.params?.token
        this.email = this.paramsObject?.params?.email
       
      }
      );
  }

  // tokenVarify() {
  //   this._watchListService.forgetPassword(this.token, this.email,this.password).subscribe(response => {
  //     if (response.isSuccess) {
  //       this.tokenvarifyed = true;
  //       this.email = '';
  //     } else {
  //       this.message = response?.message;
  //     }
  //   });
  // }

  changePassword() {
    if (this.password) {
      this._watchListService.forgetPassword(this.token, this.email,this.password).subscribe((res) => {
        if(res.isSuccess){
          this.gotologin()
          //this._commonService.showAlert("Sucess!", res?.message, PopupMessageTypeEnum.Success)
        }
        // else{
        //   //this._commonService.showAlert("Opps!", res.message, PopupMessageTypeEnum.Warning)
        // }
      });
    }
  }

  gotologin() {

    this._router.navigate(['login']);
  }

}
