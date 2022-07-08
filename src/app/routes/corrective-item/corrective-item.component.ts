import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
@Component({
  selector: 'app-corrective-item',
  templateUrl: './corrective-item.component.html',
  styleUrls: ['./corrective-item.component.less']
})
export class CorrectiveItemComponent implements OnInit {

  constructor(
      private _http: _HttpClient,
      private msg: NzMessageService,
      private fb: FormBuilder,
      private modal: NzModalService
    ) { }
    public tableData = [];
    public loading = false;// 表格loading
    public newDataModal = false;
    public modifyDataModal = false; // 修改数据modal
    public addDataForm: FormGroup;
    public modifyDataForm: FormGroup;
    public isOkLoading = false;
    // 分页
    public pageIndex = 1;
    // 查询参数
    public category: any;
    public metaData: any = {
      category: []
    };
    keyword:any = null;
    userInfo:any;
    ngOnInit() {
      this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
      // 获取元数据
      this._http.get('api/corrective/meta').subscribe((res: any) => {
        if (res.success) {
          this.metaData = res.data;
        }
      })
      // 获取列表数据
      this.getList();
    }
    // 获取列表
    getList() {
      this.loading = true;
      const params = {
        category: this.category ? this.category : 0,
        keyword : this.keyword
      }
      this._http.post(`api/corrective/category`,params).subscribe((res: any) => {
        this.loading = false;
        if (res.success) {
          this.tableData = res.data;
        } else {
          this.msg.error(res.message);
        }
      })
    }
    // 刷新,查询
    search() {
      this.getList();
    }
    // 新增
    initAddDataForm() {
      this.addDataForm = this.fb.group({
        category: [null, [Validators.required]],
        name: [null, [Validators.required]],
      })
    }
    initModifyDataForm(id: any) {
      this._http.get(`api/corrective/${id}/v2`).subscribe((res: any) => {
        this.modifyDataForm = this.fb.group({
          id: [res.data.id],
          category: [res.data.category, [Validators.required]],
          name: [res.data.name, [Validators.required]],
        })
        this.modifyDataModal = true;
      })
    }
    validateForm(name: string) {
      return this.addDataForm.get(name);
    }
    validateForm1(name: string) {
      return this.modifyDataForm.get(name);
    }
    add() {
      // 初始化表单
      this.initAddDataForm()
      this.newDataModal = true;
    }
    // 修改
    modifyData(id: any) {
      this.initModifyDataForm(id);
    }
    // 保存
    handleData(num: number) {
      if (num == 1) {
        for (const i in this.addDataForm.controls) {
          this.addDataForm.controls[i].markAsDirty();
          this.addDataForm.controls[i].updateValueAndValidity();
        }
        if (!this.addDataForm.valid) {
          return
        }
      } else {
        for (const i in this.modifyDataForm.controls) {
          this.modifyDataForm.controls[i].markAsDirty();
          this.modifyDataForm.controls[i].updateValueAndValidity();
        }
        if (!this.modifyDataForm.valid) {
          return
        }
      }
      this.isOkLoading = true;
      let formOkData: any;
      if (num == 1) {
        formOkData = JSON.parse(JSON.stringify(this.addDataForm.value));
      } else {
        formOkData = JSON.parse(JSON.stringify(this.modifyDataForm.value));
      }
      if (num == 1) {
        this._http.put('api/corrective/v2', formOkData).subscribe((res: any) => {
          this.isOkLoading = false;
          if (res.success) {
            this.newDataModal = false;
            // 刷新数据
            this.getList();
          } else {
            this.msg.error(res.message);
          }
        })
      } else {
        this._http.post('api/corrective/v2', formOkData).subscribe((res: any) => {
          this.isOkLoading = false;
          if (res.success) {
            this.modifyDataModal = false;
            // 刷新数据
            this.getList();
          } else {
            this.msg.error(res.message);
          }
        })
      }
    }
    // 删除
    delete(id: any) {
      this.modal.info({
        nzContent: '确定删除此条数据？',
        nzOkText: '确认',
        nzCancelText: '取消',
        nzTitle: '删除',
        nzOnOk: () => {
          this._http.delete(`api/corrective/${id}/v2`).subscribe((res: any) => {
            if (res.success) {
              this.msg.success('删除成功');
              // 刷新数据
              this.getList();
            } else {
              this.msg.error(res.message);
            }
          })
        },
        nzOnCancel: () => { }
      })
    }

}
