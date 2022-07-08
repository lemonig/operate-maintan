import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService, UploadXHRArgs } from 'ng-zorro-antd';

@Component({
  selector: 'knowledge-base',
  templateUrl: './knowledge-base.component.html',
  styleUrls: ['./knowledge-base.component.less']
})
export class KnowledgeBaseComponent implements OnInit {
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
  constructor(
    private _http: _HttpClient,
    private msg: NzMessageService,
    private modal: NzModalService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    // 获取元数据
    this._http.get('api/doc/meta').subscribe((res: any) => {
      if (res.success) {
        this.metaData = res.data;
        // 默认选择第一个
        this.selectDocumentType = this.metaData[0].value;
        // 获取表格数据
        this.getTableData();
      }
    })
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
    this._http.get(`api/category/${this.selectDocumentType}/doc`).subscribe((res: any) => {
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
  // 上传图片
  fileUpload = (item: UploadXHRArgs) => {
    if (this.fileList.length >= 1) {
      this.msg.error('一次只能上传一个文件！');
      setTimeout(() => {
        item.onError('一次只能上传一个文件！', item.file);
      }, 0);
      return;
    }
    const formData = new FormData();
    formData.append('file', item.file as any);
    return this._http.post('api/upload/2/file', formData).subscribe((res: any) => {
      if (res.success) {
        // 需要的参数放第一个参数中
        item.onSuccess({ data: res.data }, item.file, ''); // 将上传图片的ajax设置为成功
      } else {
        this.msg.error(res.message);
        item.onError({}, item.file);
      }
    })
  }

}
