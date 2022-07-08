import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService, UploadXHRArgs } from 'ng-zorro-antd';
import { ExcelService } from '@core/excel/excel.service';
import * as moment from 'moment';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-checking',
  templateUrl: './checking.component.html',
  styleUrls: ['./checking.component.less']
})
export class CheckingComponent implements OnInit {
  constructor(
    public fb: FormBuilder,
    public _http: _HttpClient,
    public msg: NzMessageService,
    private modal: NzModalService,
    public ExcelService: ExcelService,
    public router: ActivatedRoute,
    private activatedRoute: ActivatedRoute
  ) { }
  tableData: any[] = [];
  loading = false;
  q: any = {
    pageIndex: 1,
    pageSize: 20,
    total: 0,
  }
  orgNodes: any[] = [];
  // search
  dateRange: any[] = [new Date(new Date().getTime() - 30 * 24 * 3600 * 1000), new Date()]
  hadArrivedStation: any = null;
  acceptTransfer: any = null;
  stationId: any;
  orgKey: any; //已选择的省
  cityKey: any; //已选择的市
  opsTaskDone: any;
  opsId: any
  org: any
  active: any;
  isRead: any;
  isReadId: any;

  regionList: any[] = []; // 省列表
  cityList: any[] = [];  //市列表


  // 获取运维人员
  opsList: any[] = [];
  opsListCopy: any[] = [];
  allStationList: any[] = [];
  selectStationList: any[] = [];

  showDetailPage = false;
  detailData: any;
  // 获评论
  commentList: any[] = [];

  showBigImg = false;
  bigImgUrl: any;
  userInfo: any;
  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (this.router.queryParams["value"]["isOver"] == "true") {
      this.active = 1;
    }
    if (this.router.queryParams["value"]["userId"] != null) {
      this.isReadId = parseInt(this.router.queryParams["value"]["userId"]);
    }
    if (this.router.queryParams["value"]["read"] != null) {
      this.isRead = this.router.queryParams["value"]["read"] == "false" ? 0 : 1;
    }
    // 获取选项信息
    this.getRegionList();
    this.getOpsList();
    this.getStationList();
    // 跳转来的
    let routeVal = parseInt(this.activatedRoute.queryParams['value']['status'])
    console.log(typeof routeVal);
    if (typeof routeVal == 'number') {
      this.opsTaskDone = routeVal
      console.log(this.opsTaskDone);

      this.getTableData();

    }
  }
  // 获取省
  getRegionList() {
    this._http.get('api/org/region/list').subscribe((res: any) => {
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
    this._http.get(`/api/org/async?key=${this.orgKey}`).subscribe((res: any) => {
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
      cityKey: this.cityKey,
      stationId: this.stationId ? this.stationId : null,
      opsId: this.opsId ? this.opsId : null,
      taskStateTitle: this.opsTaskDone,
      startPage: this.q.pageIndex,
      limit: this.q.pageSize,
      queryAll: true,
      active: this.active,
      isRead: this.isRead,
      isReadId: this.isReadId,
    }
    this.loading = true;
    this._http.post('api/opsitem/record', obj).subscribe((res: any) => {
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
      cityKey: this.cityKey,
      stationId: this.stationId ? this.stationId : null,
      opsId: this.opsId ? this.opsId : null,
      taskStateTitle: this.opsTaskDone,
      queryAll: true,
      active: this.active,
      isRead: this.isRead,
      isReadId: this.isReadId,
    }
    this.ExcelService.download('api/opsitem/record/export', obj, `巡检任务`);
  }
  detail(id: any) {
    this._http.get(`api/opsitem/record/${id}`).subscribe((res: any) => {
      if (res.success) {
        this.detailData = res.data;
        this.showDetailPage = true;

      } else {
        this.msg.error(res.message);
      }
    })
    this.getcommentList(id);
  }
  // 重置
  resetCheck(id: any) {

  }
  getcommentList(id: any) {
    const obj = {
      itemId: id,
      itemType: 3,
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
  bigImg(url: any) {
    this.bigImgUrl = url;
    this.showBigImg = true;
  }

}
