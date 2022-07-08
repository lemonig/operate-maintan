import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService, UploadXHRArgs } from 'ng-zorro-antd';
import { ExcelService } from '@core/excel/excel.service';
import * as moment from 'moment';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.less']
})
export class RecordComponent implements OnInit {
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
  dateRange: any[] = [new Date(new Date().getTime() - 7 * 24 * 3600 * 1000), new Date()];
  reagentState:any[] = [];
  active:any;
  userName:any;
  contractNum:any;
  // nzFilterOption = () => { true };
  // allStationList: any[] = [];
  // filterStationList($event: any) {
  //   this._http.get('api/station/search', { key: $event, queryAll: true }).subscribe((res: any) => {
  //     if (res.success) {
  //       this.allStationList = res.data;
  //     } else {
  //       this.msg.error(res.message);
  //     }
  //   })
  // }
  // detail
  showDetailPage = false;
  detailData: any = {};
userInfo:any;
  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    // this.getReagentState();
    this.getTableData();
  }
  getReagentState(){
    this._http.get('api/apply/reagentState').subscribe((res: any) => {
      if (res.success) {
        this.reagentState = res.data;
      } else {
        this.msg.error(res.message);
      }
    })

  }
  getTableData() {
    const params = {
      startDate: this.dateRange.length ? moment(this.dateRange[0]).format('YYYY-MM-DD') : null,
      endDate: this.dateRange.length ? moment(this.dateRange[1]).format('YYYY-MM-DD') : null,
      startPage: this.q.pageIndex,
      limit: this.q.pageSize,
      active:this.active,
      keyword:this.userName,
      contractNum:this.contractNum,
    };
    this.loading = true;
    this._http.post('api/apply/reagent/record', params).subscribe((res: any) => {
      this.loading = false;
      if (res.success) {
        this.tableData = res.data;
        this.q.total = res.additional_data.total;
      } else {
        this.msg.error(res.message);
      }
    })
  }
  
  exportAll(){
    const params = {
      startDate: this.dateRange.length ? moment(this.dateRange[0]).format('YYYY-MM-DD') : null,
      endDate: this.dateRange.length ? moment(this.dateRange[1]).format('YYYY-MM-DD') : null,
      active:this.active,
      keyword:this.userName,
      contractNum:this.contractNum,
    };
    this.ExcelService.download('api/apply/exportReagentGroup/all', params, `试剂配置出库单`);
  }
  
  pageIndexChange(num: number) {
    this.q.pageIndex = num;
    // 查询数据
    this.getTableData();
  }
  pageSizeChange(num: number) {
    this.q.pageSize = num;
    // 查询数据
    this.getTableData();
  }
  search() {
    this.q = {
      pageIndex: 1,
      pageSize: 20,
      total: 0,
    }
    this.getTableData();
  }
  detail(id: any) {
    this._http.get(`api/apply/reagent/${id}`).subscribe((res: any) => {
      if (res.success) {
        this.detailData = res.data;
        this.showDetailPage = true;
      } else {
        this.msg.error(res.message);
      }
    })
  }

  // showApprovalRecord: boolean = false;
  // approvalRecordForm: FormGroup;
  // approvalRecord() {
  //   this.approvalRecordForm = this.fb.group({
  //     name: [null]
  //   })
  //   this.showApprovalRecord = true;
  // }
  // submitApprovalRecord() { }


  // showAppendLogistics: boolean = false;
  // appendLogisticsForm: FormGroup;
  // appendLogistics() {
  //   this.appendLogisticsForm = this.fb.group({
  //     name: [null]
  //   })
  //   this.showAppendLogistics = true;
  // }
  // submitAppendLogistics() { }
  // 导出
  download() {
    const params = {
      startDate: this.dateRange.length ? moment(this.dateRange[0]).format('YYYY-MM-DD') : null,
      endDate: this.dateRange.length ? moment(this.dateRange[1]).format('YYYY-MM-DD') : null,
    }
    this.ExcelService.download('api/apply/exportReagentHistory', params, `试剂申请记录`);
  }
  export(id: any){
    const params = {
      selectId: id
    }
    this.ExcelService.download('api/apply/exportReagentGroup', params, `试剂配置出库单`);
  }
}
