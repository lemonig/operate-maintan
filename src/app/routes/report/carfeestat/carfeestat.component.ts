import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ExcelService } from '@core/excel/excel.service';
import * as moment from 'moment';

@Component({
  selector: 'app-carfeestat',
  templateUrl: './carfeestat.component.html',
  styleUrls: ['./carfeestat.component.less']
})
export class CarfeestatComponent implements OnInit {
  tableData: any[] = [];
  loading = false;
  q: any = {
    pageIndex: 1,
    pageSize: 20,
  }
  // search
  dateRange: any[] = [new Date(new Date().getTime() - 7 * 24 * 3600 * 1000), new Date()];
  constructor(
    public fb: FormBuilder,
    public _http: _HttpClient,
    public msg: NzMessageService,
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
    }
    this.loading = true;
    this._http.post('api/report/car/feeusage/stat', obj).subscribe((res: any) => {
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
    this.ExcelService.download('api/report/exportCarFeeUsageStatByContract', obj, `车辆费用统计`);
  }

}
