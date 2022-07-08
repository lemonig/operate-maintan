import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ExcelService } from '@core/excel/excel.service';
import * as moment from 'moment';


@Component({
  selector: 'app-checking-contract',
  templateUrl: './checking-contract.component.html',
  styleUrls: ['./checking-contract.component.less']
})
export class CheckingContractComponent implements OnInit {

  tableData: any[] = [];
  loading = false;
  q: any = {
    pageIndex: 1,
    pageSize: 20,
  }
  orgKey: any;
  dateRange: any[] = [new Date(new Date().getTime() - 7 * 24 * 3600 * 1000), new Date()];
  userInfo: any;
  opsTaskDone: Boolean;
  // 获取省份
  regionList: any[] = [];
  constructor(
    public fb: FormBuilder,
    public _http: _HttpClient,
    public msg: NzMessageService,
    public ExcelService: ExcelService,
  ) { }

  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.getRegionList();
    this.getTableData();
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
  getTableData() {
    const params = {
      startDate: this.dateRange.length ? moment(this.dateRange[0]).format('YYYY-MM-DD') : null,
      endDate: this.dateRange.length ? moment(this.dateRange[1]).format('YYYY-MM-DD') : null
    }
    this.loading = true;
    this._http.post('api/opsitem/record/statestat', params).subscribe((res: any) => {
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
    this.ExcelService.download('api/ops/exportOpsTaskStateStat', obj, `巡检统计`);
  }

}
