import { Component, Inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'header-user',
  template: `
    <div
      class="alain-default__nav-item d-flex align-items-center px-sm"
      nz-dropdown
      nzPlacement="bottomRight"
      [nzDropdownMenu]="userMenu"
    >
      <nz-avatar [nzSrc]="userInfo.avatar" nzSize="small" class="mr-sm"></nz-avatar>
      {{ userInfo.name }}
    </div>
    <nz-dropdown-menu #userMenu="nzDropdownMenu">
      <div nz-menu class="width-sm">
        <div nz-menu-item (click)="logout(userInfo.id)">
          <i nz-icon nzType="logout" class="mr-sm"></i>
          退出
        </div>
      </div>
    </nz-dropdown-menu>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderUserComponent implements OnInit {
  constructor(
    public settings: SettingsService,
    private router: Router,
    private _http: _HttpClient,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) { }

  userInfo: any
  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
  }
  logout(id:any) {
    /* if(id!=null){
      this._http.get(`api/login/${id}/out`).subscribe((res: any) => {
        if (res.success) {

        }
      })
    } */
    this.tokenService.clear();
    this.router.navigateByUrl('passport/login');
  }
}
