import { Component, Input, OnInit } from '@angular/core';
import { FinancialDataGridConfigModel, FinancialDetailData } from 'src/app/Shared/Model/company.model';
import { CommonHelperService } from 'src/app/Shared/Service/common-helper.service';

@Component({
  selector: 'app-financial-level-data',
  templateUrl: './financial-level-data.component.html',
  styleUrls: ['./financial-level-data.component.css'],
})
export class FinancialLevelDataComponent implements OnInit {
  @Input() childData: FinancialDetailData;
  @Input() PreFix: String;
  @Input() configModel = new FinancialDataGridConfigModel();
  constructor( public _commonService : CommonHelperService) { }

  ngOnInit(): void {

  }

  // AddRemoveClass(ele) {

  //   var element = document.getElementById(ele);
  //   if (element.classList !=undefined &&  element.classList.contains('show')) {
  //     element.classList.remove('show')

  //   } else {
  //     element.classList.add('show')

  //   }

  // }

  AddRemoveClass(current, itemElement) {

    var element = document.getElementById(itemElement);
    var iconElement = $(current.currentTarget).children('i');

    if (element.classList != undefined && element.classList.contains('show')) {
      element.classList.remove('show')

    } else {
      element.classList.add('show')

    }

    if (iconElement.hasClass('fa-angle-down')) {

      iconElement.removeClass('fa-angle-down')
      iconElement.addClass('fa-angle-right')

    } else {
      iconElement.removeClass('fa-angle-right')
      iconElement.addClass('fa-angle-down')
    }

  }

}
