import { SignupComponent } from './signup/signup.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './Content/home/home.component';
import { ScreenerComponent } from './Content/screener/screener.component';
import { WatchListComponent } from './Content/watch-list/watch-list.component';
import { LoginComponent } from './login/login.component';
import { CompanyProfileComponent } from './Content/company-profile/company-profile.component';
import { NewsComponent } from './news/news.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { ProfileUpdateComponent } from './profile-update/profile-update.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { ReportComponent } from './report/report.component';
import { DictionaryComponent } from './dictionary/dictionary.component';
import { QuotesComponent } from './quotes/quotes.component';
import { EmailconfirmationComponent } from './emailconfirmation/emailconfirmation.component';
import { MobilechatComponent } from './mobilechat/mobilechat.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { NewnewsComponent } from './newnews/newnews.component';

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "home" },
  { path: "login", component: LoginComponent },
  { path: "login/:redirectForm", component: LoginComponent },
  { path: "login/:redirectForm/:symbol", component: LoginComponent },
  { path: "login/:redirectForm/:symbol/:isAddToWatchList", component: LoginComponent },
 
  { path: "home", component: HomeComponent },
  { path: "screener", component: ScreenerComponent },
  { path: "watchlist", component: WatchListComponent },
  { path: "sign-up", component: SignupComponent },
  { path: "email-confirmation", component: EmailconfirmationComponent },
  { path: "company-profile/:symbol", component: CompanyProfileComponent },

  { path: "company-profile/:symbol/:IsAddToWatchList", component: CompanyProfileComponent },
  { path: "company-profile/:symbol/:IsAddToWatchList/:date/:newsslug", component: NewnewsComponent },
  { path: "news", component: NewsComponent },
  { path: "new-news", component: NewnewsComponent },

  { path: "user-management", component: UserManagementComponent },
  { path: "profile", component: ProfileUpdateComponent },
  { path: "change-password", component: ChangepasswordComponent },
  { path: "forget-password", component: ForgetpasswordComponent },
  { path: "privacy-policy", component: PrivacyPolicyComponent },
  { path: "terms-conditions", component: TermsConditionsComponent },
  { path: "report", component: ReportComponent },
  { path: "investor-dictionary", component: DictionaryComponent },
  { path: "investor-dictionary/:alpha", component: DictionaryComponent },
  { path: "investor-dictionary/:alpha/:slug", component: DictionaryComponent },
  { path: "quotes", component: QuotesComponent },
  { path: "mobilechat", component: MobilechatComponent },
  
  
  { path: "**", redirectTo: "home" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false, onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
