import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '../app.component';
import { BaseAPIService } from '../Shared/Service/base-api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  htmlString: any;
  htmlData;
  show: boolean = false;
  renderingURL = 'https://api.manicmarket.com/api/v1/streaming/company/get-symbol-annual-report/';
  constructor(
    private appComponent: AppComponent,
    private readonly _route: ActivatedRoute,
    private _baseService: BaseAPIService,
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {
    this.appComponent.setLayout(true, true, true)
  }

  ngOnInit(): void {
    this.show = false;
    this.renderingURL = this.renderingURL + this._route.snapshot.params.year + "/" + this._route.snapshot.params.url;
    // this.renderingURL += this._route.snapshot.params.url;
    this.loadReport();
  }

  loadReport() {
    const headers = new HttpHeaders({
      'Content-Type': 'text/plain',
       //'Access-Control-Allow-Origin': '*',
      //https://api.manicmarket.com/api/v1/streaming/company/get-symbol-annual-report/'
    });
    const request = this.http.get(this.renderingURL, {
      headers,
      responseType: 'text'
    }).subscribe((res) => {
      if (res) {
        this.show = false;
      }
      this.htmlString = res
      this.htmlData = this.sanitizer.bypassSecurityTrustHtml(this.htmlString); // this line bypasses angular security
    }, error => {
      this.show = true;
      console.log(error);
    });
  }


}
