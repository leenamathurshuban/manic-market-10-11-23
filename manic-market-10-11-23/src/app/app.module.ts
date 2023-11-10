import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './Content/home/home.component';
import { ScreenerComponent } from './Content/screener/screener.component';
import { WatchListComponent } from './Content/watch-list/watch-list.component';
import { CompanyProfileComponent } from './Content/company-profile/company-profile.component';
import { BaseAPIService } from './Shared/Service/base-api.service';
import { CommonModule, HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DataTablesModule } from "angular-datatables";

import { NgSelectModule } from '@ng-select/ng-select';
import { LoaderInterceptor } from './Shared/Helpers/loader.Interceptor';
import { LoaderService } from './Shared/Helpers/loader.service';
import { LoaderComponent } from './Shared/globalComponent/loader/loader.component';
import { CustomThousandSuffixesPipePipe } from './Shared/Helpers/custom-thousand-suffixes-pipe.pipe';
import { FinancialDataComponent } from './Content/company-profile/financial-data/financial-data.component';
import { FinancialLevelDataComponent } from './Content/company-profile/financial-data/financial-level-data/financial-level-data.component';
import { NewsComponent } from './news/news.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { ProfileUpdateComponent } from './profile-update/profile-update.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ReportComponent } from './report/report.component';
import { DictionaryComponent } from './dictionary/dictionary.component';
import { QuotesComponent } from './quotes/quotes.component';
import { DecimalPipe } from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { EmailconfirmationComponent } from './emailconfirmation/emailconfirmation.component';
import { TopfiveComponent } from './topfive/topfive.component';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';

import { FacebookLoginProvider, GoogleLoginProvider ,SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { MobilechatComponent } from './mobilechat/mobilechat.component';
import { DatePipe } from '@angular/common';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { CKEditorModule } from 'ckeditor4-angular';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTreeModule} from '@angular/material/tree';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { PortalModule } from '@angular/cdk/portal';
import { WindowComponent } from './window.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { NewnewsComponent } from './newnews/newnews.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatTabsModule} from '@angular/material/tabs';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    ScreenerComponent,
    WatchListComponent,
    CompanyProfileComponent,
    LoaderComponent,
    CustomThousandSuffixesPipePipe,
    FinancialDataComponent,
    FinancialLevelDataComponent,
    NewsComponent,
    UserManagementComponent,
    ProfileUpdateComponent,
    ReportComponent,
    DictionaryComponent,
    QuotesComponent,
    PrivacyPolicyComponent,
    TermsConditionsComponent,
    EmailconfirmationComponent,
    TopfiveComponent,
    ChatroomComponent,
    WindowComponent,
    MobilechatComponent,
    ChangepasswordComponent,
    ForgetpasswordComponent,
    NewnewsComponent,
  ],
  imports: [
    MatNativeDateModule,
    PortalModule,
    MatTreeModule,
    MatTabsModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    CKEditorModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatRippleModule,
    SocialLoginModule,
    DragDropModule,
    CommonModule,
    HttpClientModule,
    BrowserModule,
    Ng2SearchPipeModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DataTablesModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
  ],
  providers: [BaseAPIService,
    DecimalPipe,
    DatePipe,
    LoaderService, { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }, 
    // { provide: LocationStrategy, useClass: HashLocationStrategy }, 
    // {
    //   provide: 'SocialAuthServiceConfig',
    //   useValue: {
    //     autoLogin: false,
    //     providers: [
    //       {
    //         id: GoogleLoginProvider.PROVIDER_ID,
    //         provider: new GoogleLoginProvider('559795483387-idaeg9043u0h5qrkv052ilmqtvko1uo8.apps.googleusercontent.com'),
    //       },
    //     ],
    //   } as SocialAuthServiceConfig,
    // },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(
              '976434266402691'
            )
          },
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '354048035191-8ukaqqtur3uresbrboipikt007kakrc0.apps.googleusercontent.com'
            )
          },
        
        ]
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
