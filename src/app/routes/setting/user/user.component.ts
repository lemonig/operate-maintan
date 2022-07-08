import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less']
})
export class UserComponent implements OnInit {
  public loading: boolean = false; //表格加载数据
  public tableData: any[] = [];
  public newDataModal: boolean = false; //新增数据modal
  public modifyDataModal: boolean = false; //修改数据modal
  public isOkLoading: boolean = false;
  private formOkData: object;
  public addDataForm: FormGroup;
  public modifyDataForm: FormGroup;
  private hasValid: boolean = true;
  // public meatData: any = {
  //   deps: [], //部门
  // };
  private idMark: any;
  //查询条件
  searchQuery: any = {
    keyword: null,
    manager: null,
    ops: null,
    dataManager: null,
    mobileActive: null,
  }
  filterItem: any[] = [{ text: '是', value: true }, { text: '否', value: false }];
  constructor(
    private _http: _HttpClient,
    private msg: NzMessageService,
    private fb: FormBuilder,
    private modal: NzModalService) { }
    userInfo:any;
  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.getTableData();
    //获取部门元数据
    // this._http.get('api/user/metadata').subscribe((res: (any)) => {
    //   if (res.success) {
    //     this.meatData = res.data;
    //   } else {
    //     this.msg.error(res.message);
    //   }
    // })
  }
  validateForm(name: string) {
    return this.addDataForm.get(name);
  }
  validateForm1(name: string) {
    return this.modifyDataForm.get(name);
  }
  //初始化新增表单
  private initAddDataForm() {
    this.addDataForm = this.fb.group({
      username: [null, [Validators.required]],
      nickname: [null, [Validators.required]],
      mobile: [null, Validators.compose([Validators.pattern(/^1\d{10}$/)])],
      title: [null, [Validators.required]],
      // deptKey: [null],
      manager: [false],
      ops: [false],
      opsRegionManager: [false],
      opsCityManager: [false],
      opsAreaManager:[false],
      projectManager:[false],
      assistant: [false],
      dataManager: [false],
      support: [false],
      wxUserId: [null],
    })
  }
  private initModifyDataForm(id: any) {
    if (id) {
      //获取返回数据
      this._http.get(`api/user/${id}`).subscribe((res: any) => {
        if (res.success) {
          this.modifyDataForm = this.fb.group({
            username: [res.data.username, [Validators.required]],
            nickname: [res.data.nickname, [Validators.required]],
            mobile: [res.data.mobile, Validators.compose([Validators.pattern(/^1\d{10}$/)])],
            title: [res.data.title, [Validators.required]],
            // deptKey: [res.data.deptKey],
            manager: [res.data.manager],
            ops: [res.data.ops],
            opsRegionManager: [res.data.opsRegionManager],
            opsCityManager: [res.data.opsCityManager],
            projectManager: [res.data.projectManager],
            opsAreaManager:[res.data.opsAreaManager],
            assistant: [res.data.assistant],
            dataManager: [res.data.dataManager],
            support: [res.data.support],
            wxUserId: [res.data.wxUserId],
          })
          this.modifyDataModal = true;
        }
      })
    }
  }
  //加载表格数据
  getTableData() {
    let obj: any = {};
    if (this.searchQuery.keyword) {
      obj.nickname = this.searchQuery.keyword;
    }
    if (this.searchQuery.manager !== null) {
      obj.manager = this.searchQuery.manager;
    }
    if (this.searchQuery.ops !== null) {
      obj.ops = this.searchQuery.ops;
    }
    if (this.searchQuery.dataManager !== null) {
      obj.dataManager = this.searchQuery.dataManager;
    }
    if (this.searchQuery.mobileActive !== null) {
      obj.mobileActive = this.searchQuery.mobileActive;
    }
    this.loading = true;
    this._http.get('api/user', obj).subscribe((res: any) => {
      this.loading = false;
      if (res.success) {
        this.tableData = res.data ? res.data : [];
      } else {
        this.msg.error(res.message);
      }
    })
  }
  //刷新表格数据
  refresh() {
    this.getTableData();
  }
  //添加新数据
  add() {
    this.initAddDataForm();
    this.newDataModal = true;
  }
  //提交数据
  handleData(num: number) {
    this.hasValid = true;
    //表单验证
    if (num == 1) {
      for (const i in this.addDataForm.controls) {
        this.addDataForm.controls[i].markAsDirty();
        this.addDataForm.controls[i].updateValueAndValidity();
      }
      for (const i in this.addDataForm.controls) {
        if (this.addDataForm.controls[i].invalid == true) {
          this.hasValid = false;
        }
      }
    } else {
      for (const i in this.modifyDataForm.controls) {
        this.modifyDataForm.controls[i].markAsDirty();
        this.modifyDataForm.controls[i].updateValueAndValidity();
      }
      for (const i in this.modifyDataForm.controls) {
        if (this.modifyDataForm.controls[i].invalid == true) {
          this.hasValid = false;
        }
      }
    }
    //没有通过验证
    if (!this.hasValid) {
      return;
    }
    this.isOkLoading = true;
    if (num == 1) {
      this.formOkData = JSON.parse(JSON.stringify(this.addDataForm.value));
    } else {
      this.formOkData = JSON.parse(JSON.stringify(this.modifyDataForm.value));
    }
    //只传最后一位
    this.formOkData['deptKey'] = (this.formOkData['deptKey'] && this.formOkData['deptKey'].length) ? this.formOkData['deptKey'][this.formOkData['deptKey'].length - 1] : this.formOkData['deptKey'];

    if (num == 1) {
      //新增数据
      this._http.put('api/user', this.formOkData).subscribe((res: any) => {
        this.isOkLoading = false;
        if (res.success) {
          this.newDataModal = false;
          //刷新数据
          this.getTableData();
        } else {
          this.msg.error(res.message);
        }
      })
    } else {
      //修改数据
      this.formOkData['id'] = this.idMark;
      this._http.post('api/user', this.formOkData).subscribe((res: any) => {
        this.isOkLoading = false;
        if (res.success) {
          this.modifyDataModal = false;
          this.idMark = null;
          //刷新数据
          this.getTableData();
        } else {
          this.msg.error(res.message);
        }
      })
    }
  }
  //修改数据
  modifyData(id: any) {
    this.idMark = id;
    this.initModifyDataForm(id);
  }

  //修改登陆状态
  changeLogin(id: any) {
    this._http.post(`api/user/${id}/active `).subscribe((res: any) => {
      if (res.success) {
        //刷新数据
        this.getTableData();
      }
    })
  }

  //表格筛选
  updateManage($event: any) {
    this.searchQuery.manager = $event.length === 1 ? $event[0] : null;
    this.getTableData();
  }
  updateOps($event: any) {
    this.searchQuery.ops = $event.length === 1 ? $event[0] : null;
    this.getTableData();
  }
  updateDataManager($event: any) {
    this.searchQuery.dataManager = $event.length === 1 ? $event[0] : null;
    this.getTableData();
  }
  updateMobileActive($event: any) {
    this.searchQuery.mobileActive = $event.length === 1 ? $event[0] : null;
    this.getTableData();
  }
  //重置密码
  resetPwd(id: any) {
    this.modal.info({
      nzContent: '确定初始化此用户密码？',
      nzOkText: '确认',
      nzCancelText: '取消',
      nzTitle: '删除',
      nzOnOk: () => {
        this._http.post(`api/user/${id}/reset_password`).subscribe((res: any) => {
          if (res.success) {
            this.msg.success('提交成功');
          } else {
            this.msg.error(res.message);
          }
        })
      },
      nzOnCancel: () => { }
    })
  }
}
