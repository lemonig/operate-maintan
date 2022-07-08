import { SettingsService, } from '@delon/theme';
import { Component, Inject, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import {
  TokenService,
  DA_SERVICE_TOKEN,
} from '@delon/auth';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'passport-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class UserLoginComponent {
  form: FormGroup;
  loading = false;
  public userInfo: any = {
    avatar: "",
    name: "",
    id: 0,
    manager: "",
    dataManager: false,
    ops: false,
    opsRegionManager: false,
    opsCityManager: false
  };
  constructor(
    fb: FormBuilder,
    private router: Router,
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private settingsService: SettingsService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
    private _http: _HttpClient
  ) {
    this.form = fb.group({
      username: [null, [Validators.required, Validators.minLength(3)]],
      password: [null, Validators.required],
      remember: [true],
    });
    modalSrv.closeAll();
  }


  get username() {
    return this.form.controls.username;
  }
  get password() {
    return this.form.controls.password;
  }

  submit() {
    this.username.markAsDirty();
    this.username.updateValueAndValidity();
    this.password.markAsDirty();
    this.password.updateValueAndValidity();
    if (this.username.invalid || this.password.invalid) return;

    this.loading = true;
    this._http.post('api/login/admin', this.form.value).subscribe((res: any) => {
      this.loading = false;
      if (res.success) {
        const token = {
          token: 'eeeacc3ed60c4c9d87c9cb3834e79b20',
          name: res.data.nickname,
          avatar: res.data.avatar
        };
        const user: any = {
          avatar: res.data.avatar,
          name: res.data.nickname,
          id: res.data.id,
          manager: res.data.manager,
          dataManager: res.data.dataManager,
          ops: res.data.ops,
          opsRegionManager: res.data.opsRegionManager,
          opsCityManager: res.data.opsCityManager
        }
        this.userInfo = user;
        // 将userInfo保存
        localStorage.setItem('userInfo', JSON.stringify(user));
        this.tokenService.set(token);
        this.router.navigateByUrl('error');
      } else {
        this.msg.error(res.message);
      }
    });
  }
}
