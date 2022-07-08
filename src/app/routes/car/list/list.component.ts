import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class ListComponent implements OnInit {
  constructor(
    private _http: _HttpClient,
    private msg: NzMessageService,
    private fb: FormBuilder,
    private modal: NzModalService
  ) { }
  // public driver_id: any;
  public tableData = [];
  public loading = false;// 表格loading
  public newDataModal = false;
  public modifyDataModal = false; // 修改数据modal
  public addDataForm: FormGroup;
  public modifyDataForm: FormGroup;
  public isOkLoading = false;
  public metaData: any = {
    provinces: [],
    users: [],
  };
  keyword: any;
  // 分页
  public pageIndex = 1;
  contract:any;

  // 获取运维人员
  opsList: any[] = [];
  opsListCopy: any[] = [];
  count:any = 0;
  carContract:any;
  userInfo:any;
  ngOnInit() {
    this.getMeatData();
    this.getOpsList();
    this.getTableData();
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
  }
  // 获取元数据
  getMeatData() {
    this._http.get('api/org/region/list').subscribe((res: any) => {
      if (res.success) {
        this.metaData.provinces = res.data;
      } else {
        this.metaData.provinces = [];
      }
    });
  }

changeActive(id:any){
  this._http.delete('api/car/'+id).subscribe((res: any) => {
    if (res.success) {
     this.getTableData();
    } else {
      this.metaData.provinces = [];
    }
  });
}
  getOpsList() {
    this._http.get('api/user?ops=true').subscribe((res: any) => {
      if (res.success) {
        this.opsList = res.data;
        this.opsListCopy = JSON.parse(JSON.stringify(res.data));
      } else {
        this.msg.error(res.message);
      }
    })
  }
  nzFilterOption = () => { true };
  filterOpsList($event: any) {
    this.opsList = this.opsListCopy.filter((item: any) => {
      if (item.nickname.includes($event)) {
        return true;
      }
      if ((item.pinyin.toUpperCase()).includes($event.toUpperCase())) {
        return true;
      }
      if ((item.jianpin.toUpperCase()).includes($event.toUpperCase())) {
        return true;
      }
      return false;
    })
  }

  refresh() {
    this.getTableData();
  }
  // 获取表格数据
  getTableData() {
    const obj = {
      keyword: this.keyword ? this.keyword : '',
      contract: this.contract ? this.contract:''
    }
    this.loading = true;
    this._http.get('api/car', obj).subscribe((res: any) => {
      this.loading = false;
      if (res.success) {
        this.count = res.data.length;
        for (const item of res.data) {
          if (item.driverList) {
            item.nicknameString = item.driverList.map((a: any) => {
              return a.nickname;
            }).join(',')
          } else {
            item.nicknameString = null;
          }
        }
        this.tableData = res.data;
      } else {
        this.msg.error(res.message);
      }
    })
  }
  add() {
    // 初始化表单
    this.initAddDataForm()
    this.newDataModal = true;
  }
  handleNewData() {
    for (const i in this.addDataForm.controls) {
      this.addDataForm.controls[i].markAsDirty();
      this.addDataForm.controls[i].updateValueAndValidity();
    }
    if (this.addDataForm.invalid) {
      return
    }
    const formOkData = JSON.parse(JSON.stringify(this.addDataForm.value));
    // 整理用户数据
    const userId = [];
    this.metaData.users.map((item: any) => {
      if (item.direction === 'right') {
        userId.push(item.key);
      }
    })
    formOkData.driverIdList = userId;
    this.isOkLoading = true;
    this._http.put('api/car', formOkData).subscribe((res: any) => {
      this.isOkLoading = false;
      if (res.success) {
        this.newDataModal = false;
        // 刷新数据
        this.getTableData();
      } else {
        this.msg.error(res.message);
      }
    })
  }
  // 修改
  modifyData(id: any) {
    this.initModifyDataForm(id);
  }
  handleModifyData() {
    for (const i in this.modifyDataForm.controls) {
      this.modifyDataForm.controls[i].markAsDirty();
      this.modifyDataForm.controls[i].updateValueAndValidity();
    }
    if (this.modifyDataForm.invalid) {
      return
    }
    const formOkData = JSON.parse(JSON.stringify(this.modifyDataForm.value));
    // 整理用户数据
    const userId = [];
    this.metaData.users.map((item: any) => {
      if (item.direction === 'right') {
        userId.push(item.key);
      }
    })
    formOkData.driverIdList = userId;
    this.isOkLoading = true;
    this._http.post('api/car', formOkData).subscribe((res: any) => {
      this.isOkLoading = false;
      if (res.success) {
        this.modifyDataModal = false;
        // 刷新数据
        this.getTableData();
      } else {
        this.msg.error(res.message);
      }
    })
  }
  // 删除
  delete(id: any) {
    this.modal.info({
      nzContent: '确定删除此条数据？',
      nzOkText: '确认',
      nzCancelText: '取消',
      nzTitle: '删除',
      nzOnOk: () => {
        this._http.delete(`api/car/${id}`).subscribe((res: any) => {
          if (res.success) {
            this.msg.success('删除成功');
            // 刷新数据
            this.getTableData();
          } else {
            this.msg.error(res.message);
          }
        })
      },
      nzOnCancel: () => { }
    })
  }

  initAddDataForm() {
    this.addDataForm = this.fb.group({
      car_num: [null, [Validators.required]],
      vehicleModel: [null, [Validators.required]],
      engine: [null],
      vid: [null],
      imei: [null],
      buyTime: [null, [Validators.required]],
      regionKey: [null, [Validators.required]],
      city: [null, [Validators.required]],
      driver_id: [null],
      description:[null]
    })
    // 初始化数据
    this.metaData.users.map((item: any) => {
      item.checked = false;
      item.direction = 'left';
    })
  }
  validateForm(name: string) {
    return this.addDataForm.get(name);
  }
  validateForm1(name: string) {
    return this.modifyDataForm.get(name);
  }
  initModifyDataForm(id: any) {
    // 初始化数据
    this.metaData.users.map((item: any) => {
      item.checked = false;
      item.direction = 'left';
    })
    this._http.get(`api/car/${id}`).subscribe((res: any) => {
      if (res.success) {
        this.modifyDataForm = this.fb.group({
          id: [res.data.id],
          car_num: [res.data.car_num, [Validators.required]],
          vehicleModel: [res.data.vehicleModel, [Validators.required]],
          engine: [res.data.engine],
          vid: [res.data.vid],
          imei: [res.data.imei],
          buyTime: [res.data.buyTime, [Validators.required]],
          regionKey: [res.data.regionKey, [Validators.required]],
          city: [res.data.city, [Validators.required]],
          driver_id: [res.data.driver_id],
          description: [res.data.description]
        })
        this.carContract = res.data.contract;
        // 返回用户数据
        const userId = res.data.driverList ? res.data.driverList.map((item: any) => {
          return item.id;
        }) : [];
        for (const item of this.metaData.users) {
          if (userId.indexOf(item.key) !== -1) {
            item.direction = 'right';
          }
        }
        this.modifyDataModal = true;
      } else {
        this.msg.error(res.message);
      }
    })
  }
  // transfer
  change($event: any) {
    $event.list.map((item: any) => {
      item.direction = $event.to;
    })
  }
}
