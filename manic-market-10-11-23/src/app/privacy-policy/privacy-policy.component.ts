import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {

  constructor(private readonly appCoponent: AppComponent) {
    this.appCoponent.setLayout(true, true, true);
   }

  ngOnInit(): void {
  }

}
