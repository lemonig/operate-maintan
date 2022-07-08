import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService, UploadXHRArgs } from 'ng-zorro-antd';
import { ExcelService } from '@core/excel/excel.service';
import * as moment from 'moment';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.less']
})
export class SignComponent implements OnInit {
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
  orgKey: any;
  orgNodes: any[] = [];
  // search
  dateRange: any[] = [new Date(new Date().getTime() - 2 * 24 * 3600 * 1000), new Date()]
  stationId: any;
  userId: any
  org: any


   // 获取省份
   regionList: any[] = [];


  // 获取运维人员
  opsList: any[] = [];
  opsListCopy: any[] = [];
  allStationList: any[] = [];

  showDetailPage = false;
  detailData: any;

  showBigImg = false;
  bigImgUrl: any;

  ngOnInit() {
    this.getOpsList();
    this.getTableData();
    this.getRegionList();
  }
   getRegionList(){
     this._http.get('api/org/region/list/work').subscribe((res: any) => {
       if (res.success) {
         this.regionList = res.data;
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
  getTableData() {
    const obj = {
      startDate: this.dateRange.length ? moment(this.dateRange[0]).format('YYYY-MM-DD') : null,
      endDate: this.dateRange.length ? moment(this.dateRange[1]).format('YYYY-MM-DD') : null,
      orgKey: this.orgKey,
      stationId: this.stationId ? this.stationId : null,
      userId: this.userId ? this.userId : null,
      startPage: this.q.pageIndex,
      limit: this.q.pageSize,
      queryAll: true,
    }
    this.loading = true;
    this._http.post('api/attend/record', obj).subscribe((res: any) => {
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
      orgKey: this.orgKey,
      queryAll: true,
    }
    this.ExcelService.download('api/attend/record/export', obj, `签到`);
  }
  detail(id: any) {
    this._http.get(`api/attend/${id}`).subscribe((res: any) => {
      if (res.success) {
        this.detailData = res.data;
        this.showDetailPage = true;
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
