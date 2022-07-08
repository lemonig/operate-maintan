import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService, UploadXHRArgs } from 'ng-zorro-antd';
import { ExcelService } from '@core/excel/excel.service';
import * as moment from 'moment';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.less']
})
export class ContractComponent implements OnInit {
  currentTab: number = 0
  btnLoading: boolean = false
  constructor(
    public fb: FormBuilder,
    public _http: _HttpClient,
    public msg: NzMessageService,
    private modal: NzModalService,
    public ExcelService: ExcelService,
    public router: ActivatedRoute,
  ) { }

  ngOnInit() {
  }
  changeTab() {

  }
  showRenewalPageReceive($event) {
    console.log($event);
    this.showRenewalPage = true
    this.initRenewalForm($event)
  }

  targetId: any
  showRenewalPage: boolean = false
  modifyDataForm: FormGroup;

  areaData: any = {
    province: [],
    city: [],
    area: [],
  }
  province: any;
  city: any;
  area: any;
  contractStateList: [] = []
  stationCount: any;
  // 获取省市区下拉数据
  getProvinceList() {
    this._http.get('api/org/async').subscribe((res: any) => {
      this.areaData.province = res.data ? res.data : [];
    })
  }
  provinceChange($event: any) {
    // 初始化数据
    this.city = null;
    this.area = null;
    this._http.get('api/org/async', { key: $event }).subscribe((res: any) => {
      this.areaData.city = res.data ? res.data : [];
    })
  }
  cityChange($event: any) {
    this.area = null;
    this.areaData.area = [];
    if ($event) {
      this._http.get('api/org/async', { key: $event }).subscribe((res: any) => {
        this.areaData.area = res.data ? res.data : [];
      })
    }
  }

  getContractStateList() {
    this._http.get(`api/contract/state`).subscribe((res: any) => {
      this.contractStateList = res.data ? res.data : [];
    })
  }

  // 获取运维已选站点
  getSelectedStation() {
    this._http.get(`api/contract/${this.targetId}/station`).subscribe((res: any) => {
      this.stationCount = res.data.length;
      // 刷新状态
      // 过滤数据
    })
  }
  initRenewalForm(id: any) {
    this._http.get(`api/contract/${id}`).subscribe((res: any) => {
      if (res.success) {
        this.modifyDataForm = this.fb.group({
          id: [res.data.id],
          name: [res.data.name, Validators.required],
          num: [null, Validators.required],
          project_manager: [res.data.project_manager, Validators.required],
          daily_count: [res.data.daily_count, Validators.required],
          start_date: [null, Validators.required],
          end_date: [null, Validators.required],
          company: [res.data.company, Validators.required],
          contacter: [res.data.contacter, Validators.required],
          phone: [res.data.phone, Validators.required],
          description: [res.data.description],
          region_key: [res.data.region_key, Validators.required],
          total: [res.data.total],
          ops_money: [res.data.ops_money],
          state: [res.data.state],
          ops_start_date: [null],
          ops_end_date: [null],
          check_date: [null]
        })
        // 返回文件信息
        this.showRenewalPage = true;
      } else {
        this.msg.error(res.message);
      }
    })
  }
  saveRenewalData() {
    for (const i in this.modifyDataForm.controls) {
      this.modifyDataForm.controls[i].markAsDirty();
      this.modifyDataForm.controls[i].updateValueAndValidity();
    }
    if (this.modifyDataForm.invalid) {
      return
    }
    const params = JSON.parse(JSON.stringify(this.modifyDataForm.value));
    this.btnLoading = true;
    this._http.post('api/contract/renewal', params).subscribe((res: any) => {
      this.btnLoading = false;
      if (res.success) {
        // 刷新数据
      } else {
        this.msg.error(res.message);
      }
    })
  }

  // 新增合同
  showAddPage = false;
  addDataForm: FormGroup;
  showAddPageReceive() {
    this.showAddPage = true
    this.initAddForm()
  }
  initAddForm() {
    this.addDataForm = this.fb.group({
      name: [null, Validators.required],
      num: [null, Validators.required],
      project_manager: [null, Validators.required],
      daily_count: [null, Validators.required],
      start_date: [null, Validators.required],
      end_date: [null, Validators.required],
      company: [null, Validators.required],
      contacter: [null, Validators.required],
      phone: [null, Validators.required],
      description: [null],
      region_key: [null, Validators.required],
      total: [null],
      ops_money: [null],
      state: [null],
      ops_start_date: [null],
      ops_end_date: [null],
      check_date: [null],
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
    this._http.put('api/contract', params).subscribe((res: any) => {
      this.btnLoading = false;
      if (res.success) {
        // 跳转到列表页面
        this.showAddPage = false;
      } else {
        this.msg.error(res.message);
      }
    })
  }
}
