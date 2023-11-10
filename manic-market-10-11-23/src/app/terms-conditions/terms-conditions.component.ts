import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.css']
})
export class TermsConditionsComponent implements OnInit {

  constructor(private readonly appCoponent: AppComponent) {
    this.appCoponent.setLayout(true, true, true);
   }

  ngOnInit(): void {
  }

}
