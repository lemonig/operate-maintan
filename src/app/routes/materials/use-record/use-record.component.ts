import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService, UploadXHRArgs } from 'ng-zorro-antd';
import { ExcelService } from '@core/excel/excel.service';
import * as moment from 'moment';

@Component({
  selector: 'app-use-record',
  templateUrl: './use-record.component.html',
  styleUrls: ['./use-record.component.less']
})
export class UseRecordComponent implements OnInit {
  constructor(
    public fb: FormBuilder,
    public _http: _HttpClient,
    public msg: NzMessageService,
    private modal: NzModalService,
    public ExcelService: ExcelService,
  ) { }
  tableData: any[] = [{}];
  loading = false;
  q: any = {
    pageIndex: 1,
    pageSize: 20,
    total: 0,
  }
  allStationList: any[] = [];


  // detail
  showDetailPage = false;
userInfo:any;
  ngOnInit() {
	  this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
  }

  getTableData() { }
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
  detail(id: any) {
    this.showDetailPage = true;
  }
  download() { }

}
