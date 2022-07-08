import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { switchMap } from 'rxjs/operators';
import * as moment from 'moment';
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.less']
})
export class HistoryComponent implements OnInit {

  public tableData = [];
  public loading = false;// 表格loading
  public newDataModal = false;
  public modifyDataModal = false; // 修改数据modal

  public addDataForm: FormGroup;
  public modifyDataForm: FormGroup;

  private hasValid = true;
  private idMark: any;
  // 查询字段
  public selectDocumentType: any;

  public isOkLoading = false;
  // 文件列表
  public fileList = [];
  public metaData: any = [];
  // 提交表单数据
  private formOkData: any;
  q: any = {
    pageIndex: 1,
    pageSize: 20,
    total: 0,
  }
  dateRange: any[] = [new Date(new Date().getTime() - 7 * 24 * 3600 * 1000), new Date()];
  constructor(
    private _http: _HttpClient,
    private msg: NzMessageService,
    private modal: NzModalService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    // 获取元数据
        // 获取表格数据
        this.getTableData();
  }
  // 初始化表单
  initNewDataForm() {
    this.addDataForm = this.fb.group({
      category: [null, [Validators.required]],
    })
  }
  validateForm(name: string) {
    return this.addDataForm.get(name);
  }
  // 获取列表
  getTableData() {
    this.loading = true;
    const params = {
      startDate: this.dateRange.length ? moment(this.dateRange[0]).format('YYYY-MM-DD') : null,
      endDate: this.dateRange.length ? moment(this.dateRange[1]).format('YYYY-MM-DD') : null,
      startPage: this.q.pageIndex,
      limit: this.q.pageSize,
    };
    this._http.post(`api/log/list`,params).subscribe((res: any) => {
      if (res.success) {
        this.tableData = res.data ? res.data : [];
        this.loading = false;
      } else {
        this.loading = false;
        this.msg.error(res.message);
      }
    })
  }
  // 上传
  upload() {
    this.newDataModal = true;
    this.initNewDataForm();
    // 初始化数据
    this.fileList = [];
  }
  handleData(num: number) {
    this.hasValid = true;
    // 表单验证
    if (num == 1) {
      for (const i in this.addDataForm.controls) {
        this.addDataForm.controls[i].markAsDirty();
        this.addDataForm.controls[i].updateValueAndValidity();
      }
      for (const i in this.addDataForm.controls) {
        if (this.addDataForm.controls[i].invalid == true) {
          this.hasValid = false;
        }
      }
      // 没有通过验证
      if (!this.hasValid) {
        return;
      }
      if (!this.fileList.length) {
        this.msg.error('请选择文件');
        return;
      }
      this.isOkLoading = true;
      this.formOkData = JSON.parse(JSON.stringify(this.addDataForm.value));
      this.formOkData.name = this.fileList[0].name;
      this.formOkData.ossKey = this.fileList[0].response.data;
      this._http.put('api/doc', this.formOkData).subscribe((res: any) => {
        this.isOkLoading = false;
        if (res.success) {
          this.newDataModal = false;
          // 初始化数据
          this.fileList = [];
          // 刷新数据
          this.getTableData();
        } else {
          this.msg.error(res.message);
        }
      })
    } else {
      for (const i in this.modifyDataForm.controls) {
        this.modifyDataForm.controls[i].markAsDirty();
        this.modifyDataForm.controls[i].updateValueAndValidity();
      }
      for (const i in this.modifyDataForm.controls) {
        if (this.modifyDataForm.controls[i].invalid == true) {
          this.hasValid = false;
        }
      }
      // 没有通过验证
      if (!this.hasValid) {
        return;
      }
      this.isOkLoading = true;
      this.formOkData = JSON.parse(JSON.stringify(this.modifyDataForm.value));
      this.formOkData.id = this.idMark;
      this._http.post('api/doc', this.formOkData).subscribe((res: any) => {
        this.isOkLoading = false;
        if (res.success) {
          // 刷新数据
          this.getTableData();
          this.modifyDataModal = false;
          this.idMark = null;
        } else {
          this.msg.error(res.message);
        }
      })
    }
  }
  validateForm1(name: string) {
    return this.modifyDataForm.get(name);
  }
  // 修改
  modifyData(data: any) {
    this.modifyDataForm = this.fb.group({
      category: [data.category, [Validators.required]],
    })
    this.modifyDataModal = true;
    this.idMark = data.id;
  }
  // 删除
  delete(id: any) {
    this.modal.info({
      nzContent: '确定删除此条数据？',
      nzOkText: '确认',
      nzCancelText: '取消',
      nzTitle: '删除',
      nzOnOk: () => {
        this._http.delete(`api/doc/${id}`).subscribe((res: any) => {
          if (res.success) {
            this.msg.success('删除成功');
            // 刷新数据
            this.getTableData();
          } else {
            this.msg.error(res.message);
          }
        })
      },
      nzOnCancel: () => { }
    })
  }
  // 查询
  search() {
    this.getTableData();
  }

}
