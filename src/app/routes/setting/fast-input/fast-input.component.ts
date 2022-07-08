import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'fast-input',
  templateUrl: './fast-input.component.html',
  styleUrls: ['./fast-input.component.css']
})
export class FastInputComponent implements OnInit {
  constructor(
    private _http: _HttpClient,
    private msg: NzMessageService,
    private fb: FormBuilder,
    private modal: NzModalService
  ) { }
  public loading = false; // 表格加载数据
  public tableData: any[] = [];
  public isOkLoading = false;
  public pageIndex = 1;
  public PageSize = 20;
  public newDataModal = false;
  public addDataForm: FormGroup;

  ngOnInit() {
    this.getTableData();
  }
  getTableData() {
    this.loading = true;
    this._http.get('api/shortcut/default').subscribe((res: any) => {
      this.loading = false;
      if (res.success) {
        this.tableData = res.data ? res.data : [];
      } else {
        this.tableData = [];
        this.msg.error(res.message);
      }
    })
  }
  add() {
    this._http.get(`api/shortcut/default`).subscribe((res: any) => {
      if (res.success) {
        this.addDataForm = this.fb.group({
          shortcuts: [res.data.join('\n'), [Validators.required]],
        })
        this.newDataModal = true;
      } else {
        this.msg.error(res.message);
      }
    })
  }
  validateForm(name: string) {
    return this.addDataForm.get(name);
  }
  handleNewData() {
    for (const i in this.addDataForm.controls) {
      this.addDataForm.controls[i].markAsDirty();
      this.addDataForm.controls[i].updateValueAndValidity();
    }
    if (this.addDataForm.invalid) {
      return
    }
    const shortcuts = this.addDataForm.value.shortcuts.split("\n").filter((item: any) => {
      return item;
    });
    this.isOkLoading = true;
    this._http.put('api/shortcut/default', shortcuts).subscribe((res: any) => {
      this.isOkLoading = false;
      if (res.success) {
        this.newDataModal = false;
        // 刷新数据
        this.getTableData();
      } else {
        this.msg.error(res.message);
      }
    })
  }

}
