import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService, UploadXHRArgs } from 'ng-zorro-antd';
import { ExcelService } from '@core/excel/excel.service';
import * as moment from 'moment';

@Component({
  selector: 'app-stag-point',
  templateUrl: './stag-point.component.html',
  styleUrls: ['./stag-point.component.less']
})
export class StagPointComponent implements OnInit {
  constructor(
    public fb: FormBuilder,
    public _http: _HttpClient,
    public msg: NzMessageService,
    private modal: NzModalService,
    public ExcelService: ExcelService,
  ) { }
  tableData: any[] = [];
  loading = false;
  q: any = {
    pageIndex: 1,
    pageSize: 20,
    total: 0,
  }
  areaData: any = {
    province: [],
    city: [],
    area: [],
  }
  allOriginData: any = {};
  idMark: any;
  keyword: any;

  btnLoading = false;
  showAddPage = false;
  addDataForm: FormGroup;
  // modify
  showModifyPage = false;
  modifyDataForm: FormGroup;
userInfo:any;
  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.getProvinceList();
    // 加载原数据
    this._http.get('api/meta').subscribe((res: any) => {
      if (res.success) {

        this.allOriginData = res.data;
      }
    })
    this.getTableData();
  }
  getTableData() {
    const obj = {
      // name: this.keyword ? this.keyword : '',
      startPage: this.q.pageIndex,
      limit: this.q.pageSize,
    };
    this.loading = true;
    this._http.get('api/agency', obj).subscribe((res: any) => {
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
    this.getTableData();
  }
  pageSizeChange(num: number) {
    this.q.pageSize = num;
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
    this.idMark = null;
  }
  initAddForm() {
    this.addDataForm = this.fb.group({
      name: [null, Validators.required],
      agent: [null],
      agent_phone: [null],
      landlord: [null],
      landlord_phone: [null],
      count_room: [null],
      count_room_used: [null],
      start_date: [null],
      end_date: [null],
      rent_of_year: [null],
      fee_of_year: [null],
      pay_method: [null],
      has_returnable_deposit: [null],
      region_key: [null],
      city_key: [null],
      district_key: [null],
      coordinate1: [null],
      coordinate2: [null],
      address: [null],
      contacter: [null],
      contacter_phone: [null],
      roommates: [null],
      tools: [null],
      instruments: [null],
      reagent_store: [null],
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
    this._http.put('api/agency', params).subscribe((res: any) => {
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
    this._http.get(`api/agency/${id}`).subscribe((res: any) => {
      if (res.success) {
        this.modifyDataForm = this.fb.group({
          id: [res.data.id],
          name: [res.data.name, Validators.required],
          agent: [res.data.agent],
          agent_phone: [res.data.agent_phone],
          landlord: [res.data.landlord],
          landlord_phone: [res.data.landlord_phone],
          count_room: [res.data.count_room],
          count_room_used: [res.data.count_room_used],
          start_date: [res.data.start_date],
          end_date: [res.data.end_date],
          rent_of_year: [res.data.rent_of_year],
          fee_of_year: [res.data.fee_of_year],
          pay_method: [res.data.pay_method*1],
          has_returnable_deposit: [res.data.has_returnable_deposit],
          region_key: [res.data.region_key],
          city_key: [res.data.city_key],
          district_key: [res.data.district_key],
          coordinate1: [res.data.coordinate1],
          coordinate2: [res.data.coordinate2],
          address: [res.data.address],
          contacter: [res.data.contacter],
          contacter_phone: [res.data.contacter_phone],
          roommates: [res.data.roommates],
          tools: [res.data.tools],
          instruments: [res.data.instruments],
          reagent_store: [res.data.reagent_store],
        })
        // 返回省市区列表数据
        if (res.data.region_key) {
          this._http.get('api/org/async', { key: res.data.region_key }).subscribe((res: any) => {
            this.areaData.city = res.data ? res.data : [];
          })
        }
        if (res.data.city_key) {
          this._http.get('api/org/async', { key: res.data.city_key }).subscribe((res: any) => {
            this.areaData.area = res.data ? res.data : [];
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
    this.btnLoading = true;
    this._http.post('api/agency', params).subscribe((res: any) => {
      this.btnLoading = false;
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
        this._http.delete(`api/agency/${id}`).subscribe((res: any) => {
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
      this.modifyDataForm.get('district_key').setValue(null)
    } else {
      this.addDataForm.get('city_key').setValue(null);
      this.addDataForm.get('district_key').setValue(null)
    }
    this._http.get('api/org/async', { key: $event }).subscribe((res: any) => {
      this.areaData.city = res.data ? res.data : [];
    })
  }
  cityChange($event: any) {
    if (this.idMark) {
      this.modifyDataForm.get('district_key').setValue(null)
    } else {
      this.addDataForm.get('district_key').setValue(null)
    }
    this._http.get('api/org/async', { key: $event }).subscribe((res: any) => {
      this.areaData.area = res.data ? res.data : [];
    })
  }
}
