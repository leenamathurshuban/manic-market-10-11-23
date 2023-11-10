import { DecimalPipe } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FinancialDataGridConfigModel, FinancialDetailData } from 'src/app/Shared/Model/company.model';
import { CommonHelperService } from '../../../Shared/Service/common-helper.service';

@Component({
  selector: 'app-financial-data',
  templateUrl: './financial-data.component.html',
  styles: [],
  

})
export class FinancialDataComponent implements OnInit {
  @Input() data: FinancialDetailData;
  @Input() PreFix: String;
  configModel = new FinancialDataGridConfigModel();
  //@Input() configModel = new FinancialDataGridConfigModel();
  @Input() childData: FinancialDetailData;


  constructor(public _commonService : CommonHelperService) {

  }

  ngOnInit(): void {

  }
  ngOnChanges(): void {
    this.checkDataColumn();
  }
  checkDataColumn() {
    if (this.data && this.data.Heading1) {
      this.configModel.IsShowCol1 = true;
      this.configModel.ColspanValue++;

    }
    if (this.data && this.data.Heading2) {
      this.configModel.IsShowCol2 = true;
      this.configModel.ColspanValue++;


    }
    if (this.data && this.data.Heading3) {
      this.configModel.IsShowCol3 = true;
      this.configModel.ColspanValue++;


    }
    if (this.data && this.data.Heading4) {
      this.configModel.IsShowCol4 = true;
      this.configModel.ColspanValue++;


    }
    if (this.data && this.data.Heading5) {
      this.configModel.IsShowCol5 = true;
      this.configModel.ColspanValue++;


    }

  }

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


