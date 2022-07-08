import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService, UploadXHRArgs } from 'ng-zorro-antd';
import { ExcelService } from '@core/excel/excel.service';
import * as moment from 'moment';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-pending',
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.less']
})
export class PendingComponent implements OnInit {

  @Output() showDetailPageEmitter: any = new EventEmitter<any>();
  constructor(
    public fb: FormBuilder,
    public _http: _HttpClient,
    public msg: NzMessageService,
    private modal: NzModalService,
    public router: ActivatedRoute,
    public ExcelService: ExcelService,
    private activatedRoute: ActivatedRoute
  ) { }
  tableData: any[] = [];
  loading = false;
  btnLoading = false;
  q: any = {
    pageIndex: 1,
    pageSize: 20,
    total: 0,
  }
  fileList: any[] = [];

  // 是否数据管理员
  isDataManager: any;

  orgNodes: any[] = [];
  // search
  dateRange: any[] = [new Date(new Date().getTime() - 30 * 24 * 3600 * 1000), new Date()];
  status: any;
  orgKey: any;
  cityKey: any;
  executorId: any;
  stationId: any;
  creatorId: any;
  acceptTransfer: any;
  hadArrivedStation: any;
  active: any;
  isRead: any;
  isReadId: any;



  regionList: any[] = [];
  cityList: any[] = [];  //市列表


  // 获取运维人员
  opsList: any[] = [];
  opsListCopy: any[] = [];
  // 获取数据管理远
  dataManageList: any[] = [];
  dataManageListCopy: any[] = [];
  allStationList: any[] = [];

  selectStationList: any[] = [];

  showConfirmPage = false;
  modifyResult: any;
  rejectReason: any;
  confirmId: any;

  remindList: any[] = [];
  stationList: any[] = [];
  // modify
  showModifyPage = false;
  modifyDataForm: FormGroup;



  commentList: any[] = [];
  processList: any[] = [];

  showBigImg = false;
  bigImgUrl: any;
  userInfo: any;
  themeType: any; //业务类型
  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (this.router.queryParams["value"]["isOver"] == "true") {
      this.active = 3;
    }
    if (this.router.queryParams["value"]["userId"] != null) {
      this.executorId = parseInt(this.router.queryParams["value"]["userId"]);
    }
    if (this.router.queryParams["value"]["read"] != null) {
      this.isRead = this.router.queryParams["value"]["read"] == "false" ? 0 : 1;
    }
    this.getOpsList();
    this.getDataManageList();
    this.getMetaData();
    this.getRegionList();
    this.getTableData();
    this.getStationList();

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
  getRegionList() {
    this._http.get('api/org/region/list/work').subscribe((res: any) => {
      if (res.success) {
        this.regionList = res.data;
      } else {
        this.msg.error(res.message);
      }
    })
  }
  // 省变化
  handleProvinceChange() {
    this.getCityList()
  }
  // 获取市
  getCityList() {
    this._http.get(`api/org/async`, { key: this.orgKey }).subscribe((res: any) => {
      if (res.success) {
        this.cityList = res.data;
      } else {
        this.msg.error(res.message);
      }
    })
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
  getDataManageList() {
    this._http.get('api/user?dataManager=true').subscribe((res: any) => {
      if (res.success) {
        this.dataManageList = res.data;
        this.dataManageListCopy = JSON.parse(JSON.stringify(res.data));
      } else {
        this.msg.error(res.message);
      }
    })
  }
  filterDataManageList($event: any) {
    this.dataManageList = this.dataManageListCopy.filter((item: any) => {
      if (item.nickname.includes($event)) {
        return true;
      }
      if ((item.pinyin.toUpperCase()).includes($event.toUpperCase())) {
        return true;
      }
      if ((item.jianpin.toUpperCase()).includes($event.toUpperCase())) {
        return true;
      }
      if (item.name.includes($event)) {
        return true;
      }
      return false;
    })
  }
  nzFilterOption = () => { true };
  filterStationList($event: any) {
    this._http.get('api/station/search', { key: $event, queryAll: true }).subscribe((res: any) => {
      if (res.success) {
        this.allStationList = res.data;
      } else {
        this.msg.error(res.message);
      }
    })
  }

  getStationList() {
    if (this.selectStationList.length == 0) {
      this._http.get('api/station/list').subscribe((res: any) => {
        if (res.success) {
          this.selectStationList = res.data;
          this.allStationList = res.data;
        } else {
          this.msg.error(res.message);
        }
      })
    } else {
      this.allStationList = this.selectStationList;
    }

  }
  getTableData() {
    const obj = {
      startDate: this.dateRange.length ? moment(this.dateRange[0]).format('YYYY-MM-DD') : null,
      endDate: this.dateRange.length ? moment(this.dateRange[1]).format('YYYY-MM-DD') : null,
      hadArrivedStation: (this.hadArrivedStation || this.hadArrivedStation === false) ? this.hadArrivedStation : null,
      acceptTransfer: (this.acceptTransfer || this.acceptTransfer === false) ? this.acceptTransfer : null,
      orgKey: this.orgKey,
      stationId: this.stationId ? this.stationId : null,
      creatorId: this.creatorId ? this.creatorId : null,
      executorId: this.executorId ? this.executorId : null,
      taskState: this.status ? this.status : null,
      startPage: this.q.pageIndex,
      limit: this.q.pageSize,
      queryAll: true,
      active: this.active,
      isRead: this.isRead,
    }
    this.loading = true;
    this._http.post('/api/task/list/todo', obj).subscribe((res: any) => {
      this.loading = false;
      if (res.success) {
        this.tableData = res.data;
        this.q.total = res.additional_data.total;
      } else {
        this.msg.error(res.message);
      }
    });
  }
  search() {
    this.q = {
      pageIndex: 1,
      pageSize: 20,
      total: 0,
    }
    this.getTableData();
  }
  // 分页
  pageIndexChange($event: any) {
    this.q.pageIndex = $event;
    this.getTableData();
  }
  pageSizeChange($event: any) {
    this.q.pageSize = $event;
    this.getTableData();
  }
  download() {
    const obj = {
      startDate: this.dateRange.length ? moment(this.dateRange[0]).format('YYYY-MM-DD') : null,
      endDate: this.dateRange.length ? moment(this.dateRange[1]).format('YYYY-MM-DD') : null,
      hadArrivedStation: (this.hadArrivedStation || this.hadArrivedStation === false) ? this.hadArrivedStation : null,
      acceptTransfer: (this.acceptTransfer || this.acceptTransfer === false) ? this.acceptTransfer : null,
      orgKey: this.orgKey,
      stationId: this.stationId ? this.stationId : null,
      creatorId: this.creatorId ? this.creatorId : null,
      executorId: this.executorId ? this.executorId : null,
      taskState: this.status ? this.status : null,
      startPage: this.q.pageIndex,
      limit: this.q.pageSize,
      queryAll: true,
      active: this.active,
      isRead: this.isRead,
    }
    this.ExcelService.download('/api/task/list/todo/export', obj, `异常任务-待处理`);
  }
  confirm(id: any) {
    this.confirmId = id;
    this.modifyResult = null;
    this.rejectReason = null;
    this.showConfirmPage = true;
  }
  confirmSubmit() {
    if (!this.modifyResult) {
      this.msg.error('请选择修复结果');
      return
    }
    if (this.modifyResult == 1) {
      // 已修复
      this.btnLoading = true;
      this._http.post(`api/task/${this.confirmId}/close`).subscribe((res: any) => {
        this.btnLoading = false;
        if (res.success) {
          // 刷新数据
          this.getTableData();
          this.showConfirmPage = false;
        } else {
          this.msg.error(res.message);
        }
      })
    }
    if (this.modifyResult == 2) {
      // 未修复
      if (this.rejectReason) {
        this._http.post(`api/task/${this.confirmId}/reject`, { message: this.rejectReason }).subscribe((res: any) => {
          if (res.success) {
            // 刷新数据
            this.getTableData();
            this.showConfirmPage = false;
          } else {
            this.msg.error(res.message);
          }
        })
      } else {
        this.msg.error('请输入未修复原因！');
      }
    }
  }

  modify(id: any) {
    this.initModifyForm(id);
  }
  initModifyForm(id: any) {
    this._http.get(`api/task/${id}`).subscribe((res: any) => {
      if (res.success) {
        this.modifyDataForm = this.fb.group({
          id: [res.data.id],
          stationId: [res.data.stationId, Validators.required],
          content: [res.data.content, Validators.required],
          gmt_happen: [res.data.gmt_happen, Validators.required],
          deadline: [res.data.deadline, Validators.required],
          remind: [res.data.remind, Validators.required],
        })
        // 返回图片信息
        if (res.data.picturesContentPreview) {
          res.data.picturesContentPreview.map((item: any) => {
            item.response = item.picture;
          })
          this.fileList = res.data.picturesContentPreview;
        } else {
          this.fileList = [];
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
    const pictures = this.fileList.map((item: any) => {
      return item.response;
    })
    params.picturesContent = pictures;
    this.btnLoading = true;
    this._http.post('api/task/edit', params).subscribe((res: any) => {
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

  bigImg(url: any) {
    this.bigImgUrl = url;
    this.showBigImg = true;
  }
  detail(id) {
    this.showDetailPageEmitter.emit(id);
  }

}
