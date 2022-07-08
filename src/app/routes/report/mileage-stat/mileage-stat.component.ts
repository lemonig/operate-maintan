import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService, UploadXHRArgs } from 'ng-zorro-antd';
import { ExcelService } from '@core/excel/excel.service';
import * as moment from 'moment';

@Component({
  selector: 'app-mileage-stat',
  templateUrl: './mileage-stat.component.html',
  styleUrls: ['./mileage-stat.component.less']
})
export class MileageStatComponent implements OnInit {

  public pageIndex = 1;

  tableData: any[] = [];
  loading = false;
  startDate:any = new Date();
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
      startDate: this.startDate
    }
    this.loading = true;
    this._http.post('api/report/car/mileage/count', obj).subscribe((res: any) => {
      this.loading = false;
      if (res.success) {
        // console.log("data is " , res.data);
        this.tableData = res.data;
      } else {
        this.msg.error(res.message);
      }
    });
  }
  search() {
    this.getTableData();
  }
  download() {
    const obj = {
      startDate: this.startDate
    }
    this.ExcelService.download('api/report/car/mileage/count/export', obj, `车辆里程上报统计`);
  }
}
