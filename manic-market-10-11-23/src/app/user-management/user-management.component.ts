import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { AppComponent } from '../app.component';
import { AppSetting } from '../Shared/Model/app-setting.model';
import { BaseAPIService } from '../Shared/Service/base-api.service';
import { Router } from '@angular/router';

declare const clicktable: any;

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  usersList = [];
  listFilter: string;
  searchField;
  searchText: any;
  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: 10,
    ordering: true,
    searching: true,
  };
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(
    private _baseApi: BaseAPIService,
    private readonly _router: Router,
    private readonly appCoponent: AppComponent
  ) {
    this.appCoponent.setLayout(true, true, true);
  }

  ngOnInit(): void {
    clicktable();
    this.getUsers();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  getUsers() {
    // this._baseApi.get(AppSetting.userManagement + "?page="+ 1+"&limit=100").subscribe((usersList) => {
    //   this.rerender();
    //   this.usersList = usersList.data;
    // });
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      order: [0, 'asc'],
      serverSide: true,
      ajax: (dataTablesParameters: any, callback) => {
        this._baseApi
          .get(
            AppSetting.userManagement +
              '?page=' +
              (dataTablesParameters.start / 10 + 1) +
              '&limit=10&field=' +
              dataTablesParameters.columns[dataTablesParameters.order[0].column]
                .data +
              '&direction=' +
              (dataTablesParameters.order[0].dir == 'asc' ? 'ASC' : 'DESC')
          )
          .subscribe((usersList) => {
            if (usersList.isSuccess) {
              this.usersList = usersList.data;
              callback({
                recordsTotal: usersList.total_users,
                recordsFiltered: usersList.total_users,
                data: [],
              });
              this.appCoponent.showLoaderEvent(false);
            }
          });
      },
      columns: [{ data: 'email' },{ data: 'username' }, { data: 'date_joined' }, ],
    };
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next();
    });
  }

  deleteUser(user) {
    this._baseApi
      .Delete(AppSetting.deleteUser + `${user.id}/`)
      .subscribe(() => {
        this.rerender();
      });
  }

  searchUser(e) {
    this._baseApi
      .get(AppSetting.userSearch + `?email=${e}`)
      .subscribe((res) => {
        if (res?.results?.length>0) {
          this.usersList = res.results;
        }
      });
      this._baseApi
      .get(AppSetting.userSearch + `?username=${e}`)
      .subscribe((res) => {
        if (res?.results?.length>0) {
          this.usersList = res.results;
        }
    });
  }
  clearSearchField() {
    this.searchField = '';
    this._router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      this._router.navigate(['user-management']);
    });

  }

}
