import { Component, OnInit } from '@angular/core';
import { BaseAPIService } from '../Shared/Service/base-api.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  htmlComponent = '';
  constructor(
    private _baseService: BaseAPIService,
  ) {
    this.getContent();
  }

  public getContent() {
    // return this._baseService.getNews('http://api.manicmarket.com/media/annual-report/A.html').then((html) => {
    //   this.htmlComponent = html;
    // });
  }

  ngOnInit(): void {
  }

}
