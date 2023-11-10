import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoaderService } from '../../Helpers/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit,AfterViewChecked  {
  loading: boolean;
  constructor(private loaderService: LoaderService,private cdRef : ChangeDetectorRef) {
    
  }
  ngOnInit(): void {
  
  }
  ngAfterViewChecked(): void {
    setTimeout(() => {
    this.loaderService.isLoading.subscribe((isLoading) => {
      this.loading = isLoading;
      this.cdRef.detectChanges();
    });
  }, 1000);
}

}
