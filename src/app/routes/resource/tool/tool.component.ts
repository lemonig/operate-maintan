import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService, UploadXHRArgs } from 'ng-zorro-antd';
import { ExcelService } from '@core/excel/excel.service';

@Component({
  selector: 'app-tool',
  templateUrl: './tool.component.html',
  styleUrls: ['./tool.component.less']
})
export class ToolComponent implements OnInit {
  constructor(
    public fb: FormBuilder,
    public _http: _HttpClient,
    public msg: NzMessageService,
    private modal: NzModalService,
    public ExcelService: ExcelService,
  ) { }
  tableData: any[] = [];
  loading = false;
  keyword: any;
  q: any = {
    pageIndex: 1,
    pageSize: 20,
    total: 0,
  }
  oldList: any[] = ['报废', '一成新', '二成新', '三成新', '四成新', '五成新', '六成新', '七成新', '八成新', '九成新', '全新']
  toolKeepingList:any[];
  toolTypeList:any[];
  toolNameList:any[];
  toolState:any[];
  toolCapital:any[];
  toolResult:any[];
  toolAssets:any[];
  type:any;
  // 获取运维人员
  peopleList: any[] = [];
  peopleListCopy: any[] = [];

  opsList: any[] = [];
  opsListCopy: any[] = [];

  areaData: any = {
    province: [],
    city: [],
    area: [],
  }
  idMark: any;


  btnLoading = false;
  showAddPage = false;
  addDataForm: FormGroup;
  // modify
  showModifyPage = false;
  modifyDataForm: FormGroup;
  userInfo:any;
  ngOnInit() {
     this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.getTableData();
    // 获取所有人员
    this.getPeopleList();
    this.getProvinceList();
    this.getToolMate();
    this.getOpsList();
  }
  getToolMate(){
    this._http.get('api/tool/mate').subscribe((res: any) => {
      if (res.success) {
        this.toolCapital = res.data.toolCapital;
        this.toolTypeList = res.data.toolType;
        this.toolNameList = res.data.toolName;
       this.toolAssets = res.data.toolAssets;
       this.toolState = res.data.toolState;
       this.toolResult = res.data.toolResult;

      } else {
        this.msg.error(res.message);
      }
    })
  }
  getPeopleList() {
    this._http.get('api/user').subscribe((res: any) => {
      if (res.success) {
        this.peopleList = res.data;
        this.peopleListCopy = JSON.parse(JSON.stringify(res.data));
      } else {
        this.msg.error(res.message);
      }
    })
  }
  nzFilterOption = () => { true };
  filterPeopleList($event: any) {
    this.peopleList = this.peopleListCopy.filter((item: any) => {
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
  getOpsList() {
    this._http.get('api/user').subscribe((res: any) => {
      if (res.success) {
        this.opsList = res.data;
        this.opsListCopy = JSON.parse(JSON.stringify(res.data));
      } else {
        this.msg.error(res.message);
      }
    })
  }
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
  // 获取省市区下拉数据
  getProvinceList() {
    this._http.get('api/org/async').subscribe((res: any) => {
      this.areaData.province = res.data ? res.data : [];
    })
  }
  provinceChange($event: any) {
    // 初始化数据
    if (this.idMark) {
      this.modifyDataForm.get('city_key').setValue(null);
    } else {
      this.addDataForm.get('city_key').setValue(null);
    }
    this._http.get('api/org/async', { key: $event }).subscribe((res: any) => {
      this.areaData.city = res.data ? res.data : [];
    })
  }
  cityChange($event: any) {
    this._http.get('api/org/async', { key: $event }).subscribe((res: any) => {
      this.areaData.area = res.data ? res.data : [];
    })
  }

  getTableData() {
    const obj = {
      keyword: this.keyword ? this.keyword : '',
      startPage: this.q.pageIndex,
      limit: this.q.pageSize,
      type:this.type?this.type:7
    };
    this.loading = true;
    this._http.post('api/tool/list', obj).subscribe((res: any) => {
      this.loading = false;
      if (res.success) {
        this.tableData = res.data;
        this.q.total = res.additional_data.total;
      } else {
        this.msg.error(res.message);
      }
    })
  }
  pageIndexChange(num: number) {
    this.q.pageIndex = num;
    // 查询数据
    this.getTableData();
  }
  pageSizeChange(num: number) {
    this.q.pageSize = num;
    // 查询数据
    this.getTableData();
  }
  search() {
    // 初始化分页
    this.q = {
      pageSize: 20,
      pageIndex: 1,
      total: 0,
    }
    this.getTableData();
  }
  add() {
    this.initAddForm();
    this.showAddPage = true;
  }
  initAddForm() {
    this.addDataForm = this.fb.group({
      material_code: [null, Validators.required],
      version: [null, Validators.required],
      unit: [null, Validators.required],
      count: [null, Validators.required],
      region_key: [null, Validators.required],
      asset_code: [null, Validators.required],
      city_key: [null, Validators.required],
      user_id: [null, Validators.required],
      production_date:[null,Validators.required],
      phone:[null,Validators.required],
      borrower_id:[null,Validators.required],
      type:[null, Validators.required],
	  description:[null],
	  result:[null],
	  residual:[null],
	  equity:[null],
	  use_age:[null,Validators.required],
	  location:[null,Validators.required],
	  borrow_department:[null,Validators.required],
	  money:[null,Validators.required],
	  production_company:[null,Validators.required],
	  supplier:[null,Validators.required],
	  use_state:[null,Validators.required],
	  use_date:[null,Validators.required],
	  buy_date:[null,Validators.required],
	  brand:[null,Validators.required],
	  increase_capital:[null,Validators.required],
	  increase_assets:[null,Validators.required],
    name: [null, Validators.required],
    })
  }
  saveNewData() {
    for (const i in this.addDataForm.controls) {
      this.addDataForm.controls[i].markAsDirty();
      this.addDataForm.controls[i].updateValueAndValidity();
    }
    if (this.addDataForm.invalid) {
      return
    }
    const params = JSON.parse(JSON.stringify(this.addDataForm.value));
    this.btnLoading = true;
    this._http.put('api/tool', params).subscribe((res: any) => {
      this.btnLoading = false;
      if (res.success) {
        // 跳转到列表页面
        this.getTableData();
        this.showAddPage = false;
      } else {
        this.msg.error(res.message);
      }
    })
  }
  modify(id: any) {
    this.idMark = id;
    this.initModifyForm(id);
  }
  initModifyForm(id: any) {
    this._http.get(`api/tool/${id}`).subscribe((res: any) => {
      if (res.success) {
        this.modifyDataForm = this.fb.group({
          id: [res.data.id],
          name: [res.data.name, Validators.required],
          material_code: [res.data.material_code, Validators.required],
          version: [res.data.version, Validators.required],
          unit: [res.data.unit, Validators.required],
          count: [res.data.count, Validators.required],
          asset_code: [res.data.asset_code, Validators.required],
          user_id: [res.data.user_id, Validators.required],
          region_key: [res.data.region_key, Validators.required],
          city_key: [res.data.city_key, Validators.required],
          production_date:[res.data.production_date],
          phone:[res.data.phone],
          borrower_id:[res.data.borrower_id],
          type:[res.data.type, Validators.required],
          description:[res.data.description],
          result:[res.data.result],
          residual:[res.data.residual],
          equity:[res.data.equity],
          use_age:[res.data.use_age,Validators.required],
          location:[res.data.location,Validators.required],
          borrow_department:[res.data.borrow_department,Validators.required],
          money:[res.data.money,Validators.required],
          production_company:[res.data.production_company,Validators.required],
          supplier:[res.data.supplier,Validators.required],
          use_state:[res.data.use_state,Validators.required],
          use_date:[res.data.use_date,Validators.required],
          buy_date:[res.data.buy_date,Validators.required],
          brand:[res.data.brand,Validators.required],
          increase_capital:[res.data.increase_capital,Validators.required],
          increase_assets:[res.data.increase_assets,Validators.required],
        })
        if (res.data.region_key) {
          this._http.get('api/org/async', { key: res.data.region_key }).subscribe((res: any) => {
            this.areaData.city = res.data ? res.data : [];
          })
        }

        this.showModifyPage = true;
      } else {
        this.msg.error(res.message);
      }
    })
  }

  saveModifyData() {
    for (const i in this.modifyDataForm.controls) {
      this.modifyDataForm.controls[i].markAsDirty();
      this.modifyDataForm.controls[i].updateValueAndValidity();
    }
    if (this.modifyDataForm.invalid) {
      return
    }
    const params = JSON.parse(JSON.stringify(this.modifyDataForm.value));
    this._http.post('api/tool', params).subscribe((res: any) => {
      if (res.success) {
        // 刷新数据
        this.getTableData();
        this.showModifyPage = false;
      } else {
        this.msg.error(res.message);
      }
    })
  }

  // delete
  delete(id: any) {
    this.modal.info({
      nzContent: '确定删除此条数据？',
      nzOkText: '确认',
      nzCancelText: '取消',
      nzTitle: '删除',
      nzOnOk: () => {
        this._http.delete(`api/tool/${id}`).subscribe((res: any) => {
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
  // 导出
  download() {
    this.ExcelService.download('api/tool/export', {}, `工具清单`);
  }

}
