import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService, UploadXHRArgs } from 'ng-zorro-antd';
import { ExcelService } from '@core/excel/excel.service';
import * as moment from 'moment';

@Component({
  selector: 'app-checking-achievements',
  templateUrl: './checking-achievements.component.html',
  styleUrls: ['./checking-achievements.component.less']
})
export class CheckingAchievementsComponent implements OnInit {

  public pageIndex = 1;
  q: any = {
    pageIndex: 1,
    pageSize: 20,
    total: 0,
  }
  tableData: any[] = [];
  loading = false;
  dateFormat = 'yyyy-MM';
  dateRange: any[] = [new Date(new Date().getTime() - 30 * 24 * 3600 * 1000), new Date()];
  userInfo:any;
  constructor(
    public fb: FormBuilder,
    public _http: _HttpClient,
    public msg: NzMessageService,
    private modal: NzModalService,
    public ExcelService: ExcelService,
  ) { }

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
    this._http.post('api/ops/achievements', obj).subscribe((res: any) => {
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
    this.ExcelService.download('api/ops/record/export', obj, `巡检绩效`);
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

}
