import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { WatchListService } from 'src/app/Shared/Service/watch-list.service';

@Component({
  selector: 'app-emailconfirmation',
  templateUrl: './emailconfirmation.component.html',
  styleUrls: ['./emailconfirmation.component.css']
})
export class EmailconfirmationComponent implements OnInit {
  tokenvarifyed = false;
  token: any;
  email: any;
  paramsObject: any;
  message: any = "Token verification is happening ..."
  constructor(private readonly appCoponent: AppComponent,
    private readonly _route: ActivatedRoute,
    private readonly _router: Router,
    private readonly _watchListService: WatchListService,

  ) {
    this.appCoponent.setLayout(true, true, true);
  }


  ngOnInit(): void {
    this._route.queryParamMap
      .subscribe((params) => {
        this.paramsObject = { ...params };
        this.token = this.paramsObject?.params?.token
        this.email = this.paramsObject?.params?.email
        this.token && this.email && this.tokenVarify()
      }
      );
  }

  tokenVarify() {
    this._watchListService.TokenVarify(this.token, this.email).subscribe(response => {
      if (response.isSuccess) {
        this.tokenvarifyed = true;
      } else {
        this.message = response?.message;
      }
    });
  }
  gotologin() {
    this._router.navigate(['login']);
  }


}
