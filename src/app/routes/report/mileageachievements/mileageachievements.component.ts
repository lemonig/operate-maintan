import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService, UploadXHRArgs } from 'ng-zorro-antd';
import { ExcelService } from '@core/excel/excel.service';
import * as moment from 'moment';

@Component({
  selector: 'app-mileageachievements',
  templateUrl: './mileageachievements.component.html',
  styleUrls: ['./mileageachievements.component.less']
})
export class MileageachievementsComponent implements OnInit {

  public pageIndex = 1;

  tableData: any[] = [];
  loading = false;
  startDate:any = new Date();
  q: any = {
    pageIndex: 1,
    pageSize: 20,
    total: 0,
  }
  dateRange: any[] = [new Date(new Date().getTime() - 30 * 24 * 3600 * 1000), new Date()];
  constructor(
    public fb: FormBuilder,
    public _http: _HttpClient,
    public msg: NzMessageService,
    private modal: NzModalService,
    public ExcelService: ExcelService,
  ) { }
userInfo:any;
  ngOnInit() {
	  this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.getTableData();
  }

  getTableData() {
    const obj = {
      startDate: this.dateRange.length ? moment(this.dateRange[0]).format('YYYY-MM-DD') : null,
      endDate: this.dateRange.length ? moment(this.dateRange[1]).format('YYYY-MM-DD') : null,
      startPage: this.q.pageIndex,
      limit: this.q.pageSize,
    }
    this.loading = true;
    this._http.post('api/report/car/mileage/achievements', obj).subscribe((res: any) => {
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
  download() {
    const obj = {
      startDate: this.dateRange.length ? moment(this.dateRange[0]).format('YYYY-MM-DD') : null,
      endDate: this.dateRange.length ? moment(this.dateRange[1]).format('YYYY-MM-DD') : null,
    }
    this.ExcelService.download('api/report/car/mileage/achievement/export', obj, `????????????????????????`);
  }
  // ??????
  pageIndexChange($event: any) {
    this.q.pageIndex = $event;
    this.getTableData();
  }
  pageSizeChange($event: any) {
    this.q.pageSize = $event;
    this.getTableData();
  }
}
