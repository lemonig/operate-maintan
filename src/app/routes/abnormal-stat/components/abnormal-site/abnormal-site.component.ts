import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ExcelService } from '@core/excel/excel.service';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-abnormal-site',
  templateUrl: './abnormal-site.component.html',
  styleUrls: ['./abnormal-site.component.less']
})
export class AbnormalSiteComponent implements OnInit {

  tableData: any[] = [];
  loading = false;
  q: any = {
    pageIndex: 1,
    pageSize: 20,
  }
  dateRange: any[] = [new Date(new Date().getTime() - 7 * 24 * 3600 * 1000), new Date()];
  userInfo: any;
  constructor(
    public fb: FormBuilder,
    public _http: _HttpClient,
    public msg: NzMessageService,
    public ExcelService: ExcelService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.getTableData();
  }
  getTableData() {
    const params = {
      startDate: this.dateRange.length ? moment(this.dateRange[0]).format('YYYY-MM-DD') : null,
      endDate: this.dateRange.length ? moment(this.dateRange[1]).format('YYYY-MM-DD') : null
    }
    this.loading = true;
    this._http.post('/api/task/stat/station', params).subscribe((res: any) => {
      this.loading = false;
      if (res.success) {
        this.tableData = res.data;
      } else {
        this.msg.error(res.message);
      }
    });
  }
  search() {
    this.q = {
      pageIndex: 1,
      pageSize: 20,
    }
    this.getTableData();
  }
  download() {
    const obj = {
      startDate: this.dateRange.length ? moment(this.dateRange[0]).format('YYYY-MM-DD') : null,
      endDate: this.dateRange.length ? moment(this.dateRange[1]).format('YYYY-MM-DD') : null,
    }
    this.ExcelService.download('api/task/exportTaskStateStat', obj, `异常统计`);
  }
  // 跳转
  goAbnormalAllPage(status) {
    let extraDataObj = {
      queryParams: {
        status: status
      }
    };
    this.router.navigate(['error'], extraDataObj)
  }

}
