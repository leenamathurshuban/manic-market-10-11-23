import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../app.component';
import { MessageTitleEnum, PopupMessageTypeEnum } from '../Shared/Enum/fixed-value.enum';
import { SignUpPostModel } from '../Shared/Model/account.model';
import { AccountsService } from '../Shared/Service/accounts.service';
import { CommonHelperService } from '../Shared/Service/common-helper.service';
import { WatchListService } from 'src/app/Shared/Service/watch-list.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  model = new SignUpPostModel();
  frmGroup: FormGroup;
  fieldTextType: boolean = false;
  userimage: any;
  email:any ;
  confirmemail: any;
  constructor(private readonly _accountService: AccountsService,
    private readonly fb: FormBuilder,
    private readonly _watchListService: WatchListService,
    private readonly _router: Router,
    private _route: ActivatedRoute, private readonly appCoponent: AppComponent,
    private readonly _commonService: CommonHelperService
  ) {
    this.confirmemail = false;
    this.appCoponent.setLayout(true, true, true);
  }

  ngOnInit(): void {
    this.confirmemail = false;
    this.formInit();
  }


  formInit() {
    this.frmGroup = this.fb.group({
      Email: [null, Validators.compose([Validators.required, Validators.email])],
      Username: [null, Validators.compose([Validators.required, Validators.pattern('^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$')])],
      Password: [null, Validators.compose([Validators.required, this.ComparePasswordVlidator.bind(this)])],
      First_name: [null, Validators.compose([Validators.required])],
      Last_name: [null, Validators.compose([Validators.required])],
      image: [null],
      ConfirmPassword: [null, Validators.compose([Validators.required, this.CompareConfirmPasswordVlidator.bind(this)])],

    });
  }

  CompareConfirmPasswordVlidator(control: FormControl): any {

    if (control.pristine) {
      return null;
    }


    const passwordValue = control.parent.value.Password;
    const confirmPasswordValue = control.value;

    if (passwordValue != undefined && confirmPasswordValue != undefined && passwordValue !== confirmPasswordValue) {
      return { ConfirmPasswordValidationError: true }
    }


    return null;
  }

  ComparePasswordVlidator(control: FormControl): any {

    if (control.pristine) {
      return null;
    }


    const passwordValue = control.value;
    const confirmPasswordValue = control.parent.value.ConfirmPassword;

    if (passwordValue != undefined && confirmPasswordValue != undefined && passwordValue !== confirmPasswordValue) {
      return { PasswordValidationError: true }
    }


    return null;
  }

  onSubmit() {

    this.frmGroup.markAllAsTouched();
    if (this.frmGroup.valid) {
      this._accountService.signUp(this.model).subscribe(
        response => {
          if (response.isSuccess) {
            this.confirmemail = true;
            this.email = response?.data?.email;
            this._router.navigate(['login']);
             //this._commonService.showAlert("Sucess!", MessageTitleEnum.SignUpSucess, PopupMessageTypeEnum.Success)          
          } 
          // else {
          //    this._commonService.showAlert("Opps!", response?.message, PopupMessageTypeEnum.Info)
          // }
        }, error => {
          //this._commonService.showAlert("Opps!", MessageTitleEnum.SomthingWrong, PopupMessageTypeEnum.Error)
        }
      );
    } else {

    }
  }
  resendmail(){
    this.email && (
      this._watchListService.Resendemail(this.email).subscribe(response => {
      if (response.isSuccess) {
        //this._commonService.showAlert("Sucess!", response?.message, PopupMessageTypeEnum.Success)
      } 
      // else {
      //    this._commonService.showAlert("Opps!", response?.message, PopupMessageTypeEnum.Info)
      // }
    })
    )
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  uploadFile($event) {
    if ($event.target.files && $event.target.files[0]) {
      this.model.image = $event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL($event.target.files[0]);
      reader.onload = (event) => {
        this.userimage = event.target.result;
      }
    }
  }
}
