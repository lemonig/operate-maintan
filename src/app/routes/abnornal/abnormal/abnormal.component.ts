import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService, UploadXHRArgs } from 'ng-zorro-antd';
import { ExcelService } from '@core/excel/excel.service';
import * as moment from 'moment';
import { ActivatedRoute, } from '@angular/router';
@Component({
  selector: 'app-abnormal',
  templateUrl: './abnormal.component.html',
  styleUrls: ['./abnormal.component.less']
})
export class AbnormalComponent implements OnInit {
  
  currentTab: number = 0
  constructor(
    public fb: FormBuilder,
    public _http: _HttpClient,
    public msg: NzMessageService,
    private modal: NzModalService,
    public ExcelService: ExcelService,
    private activatedRoute: ActivatedRoute
  ) { }
  // add
  showAddPage = false;
  addDataForm: FormGroup;
  fileList: any[] = [];
  loading = false;
  btnLoading = false;
  remindList: any[] = [];
  stationList: any[] = [];
  isDataManager: any;
  ngOnInit() {
    this.getMetaData();
    // 为路由跳过来的
    if (this.activatedRoute.queryParams['value']['status']) {
      this.currentTab = 2
    }
    console.log(this.activatedRoute.queryParams['value']['status']);
  }
  changeTab() {

  }

  add() {
    this.initAddForm();
    this.fileList = [];
    this.showAddPage = true;
  }
  getMetaData() {
    this._http.get('api/meta').subscribe((res: any) => {
      if (res.success) {
        this.remindList = res.data.remind;
        this.isDataManager = res.data.dataManager;
      } else {
        this.msg.error(res.message);
      }
    })
    this._http.get('api/station/datamanager').subscribe((res: any) => {
      if (res.success) {
        this.stationList = res.data;
      } else {
        this.msg.error(res.message);
      }
    })
  }
  initAddForm() {
    this.addDataForm = this.fb.group({
      stationId: [null, Validators.required],
      content: [null, Validators.required],
      // picturesContent
      gmt_happen: [new Date(), Validators.required],
      deadline: [new Date(new Date().getTime() + 8 * 3600 * 1000), Validators.required],
      remind: [this.remindList[0].value, Validators.required], // 默认第一个
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
    const pictures = this.fileList.map((item: any) => {
      return item.response;
    })
    params.picturesContent = pictures;
    this.btnLoading = true;
    this._http.put('api/task', params).subscribe((res: any) => {
      this.btnLoading = false;
      if (res.success) {
        // 跳转到列表页面
        this.showAddPage = false;
      } else {
        this.msg.error(res.message);
      }
    })
  }
  fileUpload = (item: UploadXHRArgs) => {
    // const formData = new FormData();
    // formData.append('file', item.file as any);
    // 将文件转成base64格式
    const reader = new FileReader();
    reader.readAsDataURL(item.file as any);
    reader.onload = (e: any) => {
      const file = e.target.result;
      return this._http.post(`api/upload/1/image`, { file }).subscribe((res: any) => {
        if (res.success) {
          item.onSuccess(res.data, item.file, {});
        } else {
          item.onError({}, item.file);
        }
      })
    }
  }
  /************详情***********/
  showDetailPage = false;
  detailData: any;
  commentList: any[] = [];
  processList: any[] = [];
  showBigImg = false;
  bigImgUrl: any;


  bigImg(url: any) {
    this.bigImgUrl = url;
    this.showBigImg = true;
  }

  showDetailPageEmitter($event: any) {
    this._http.get(`api/task/${$event}`).subscribe((res: any) => {
      if (res.success) {
        this.detailData = res.data;
        this.showDetailPage = true;
      } else {
        this.msg.error(res.message);
      }
    })
    this.getcommentList($event)
    this.getProcessing($event);
  }
  getcommentList(id: any) {
    const obj = {
      itemId: id,
      itemType: 1,
      startPage: 1,
      limit: 99999,
    }
    this._http.post(`api/comment/list`, obj).subscribe((res: any) => {
      if (res.success) {
        this.commentList = res.data;
      } else {
        this.msg.error(res.message);
      }
    })
  }
  getProcessing(id: any) {
    this._http.get(`api/task/${id}/status`).subscribe((res: any) => {
      if (res.success) {
        this.processList = res.data.logList;
      } else {
        this.msg.error(res.message);
      }
    })
  }
}
