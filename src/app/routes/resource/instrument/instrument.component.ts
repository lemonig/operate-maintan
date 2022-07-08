import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService, UploadXHRArgs } from 'ng-zorro-antd';
import { ExcelService } from '@core/excel/excel.service';
import * as moment from 'moment';

@Component({
  selector: 'app-instrument',
  templateUrl: './instrument.component.html',
  styleUrls: ['./instrument.component.less']
})
export class InstrumentComponent implements OnInit {
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
  companyList: any[] = [];
  keyword: any;

  btnLoading = false;
  showAddPage = false;
  addDataForm: FormGroup;
  fileList1: any[] = [];
  fileList2: any[] = [];
  // modify
  showModifyPage = false;
  modifyDataForm: FormGroup;

  showconfigPage = false;
  flag: number;
  targetId: any;
  queryName: any;
  queryCompany: any;
  instrumentList: any[] = [];
  queryInstrumentName: any;
  modalInitData: any[] = [];
  goodsList: any[] = [];
  goodsListCopy: any[] = [];
  isAllChecked = false;
  isIndeterminate = false;

  selectedGoodsList: any[] = [];
  isIndeterminateS = false;
  isAllCheckedS = false;

  checkedGoods: any[] = [];
  checkedSelectedGoods: any[] = [];
  userInfo:any;
  company:any;
  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.getTableData();
    // 获取元数据
    this._http.get('api/meta').subscribe((res: any) => {
      if (res.success) {
        this.companyList = res.data.instrumentCompany;
      } else {
        this.msg.error(res.message)
      }
    })
  }
  getTableData() {
    const obj = {
      name: this.keyword ? this.keyword : '',
      company: this.company
    };
    this.loading = true;
    this._http.post('api/instrument/list', obj).subscribe((res: any) => {
      this.loading = false;
      if (res.success) {
        this.tableData = res.data;
      } else {
        this.msg.error(res.message);
      }
    })
  }
  search() {
    this.getTableData();
  }
  add() {
    this.initAddForm();
    this.fileList1 = [];
    this.fileList2 = [];
    this.showAddPage = true;
  }
  initAddForm() {
    this.addDataForm = this.fb.group({
      name: [null, Validators.required],
      version: [null, Validators.required],
      company: [null, Validators.required],
      factor: [null, Validators.required],
      analyse_method: [null],
      description: [null],
    })
  }
  saveNewData() {
    for (const i in this.addDataForm.controls) {
      this.addDataForm.controls[i].markAsDirty();
      this.addDataForm.controls[i].updateValueAndValidity();
    }
    if (this.addDataForm.invalid) {
      return
    }
    const params = JSON.parse(JSON.stringify(this.addDataForm.value));
    // 文件
    params.oss_instruction = this.fileList1[0] ? this.fileList1[0].response : '';
    params.oss_component_list = this.fileList2[0] ? this.fileList2[0].response : '';
    this.btnLoading = true;
    this._http.put('api/instrument', params).subscribe((res: any) => {
      this.btnLoading = false;
      if (res.success) {
        // 跳转到列表页面
        this.getTableData();
        this.showAddPage = false;
      } else {
        this.msg.error(res.message);
      }
    })
  }
  modify(id: any) {
    this.initModifyForm(id);
  }
  initModifyForm(id: any) {
    this._http.get(`api/instrument/${id}`).subscribe((res: any) => {
      if (res.success) {
        this.modifyDataForm = this.fb.group({
          id: [res.data.id],
          name: [res.data.name, Validators.required],
          version: [res.data.version, Validators.required],
          company: [res.data.company, Validators.required],
          factor: [res.data.factor, Validators.required],
          analyse_method: [res.data.analyse_method],
          description: [res.data.description],
        })
        // 返回文件信息


        this.showModifyPage = true;
      } else {
        this.msg.error(res.message);
      }
    })
  }
  saveModifyData() {
    for (const i in this.modifyDataForm.controls) {
      this.modifyDataForm.controls[i].markAsDirty();
      this.modifyDataForm.controls[i].updateValueAndValidity();
    }
    if (this.modifyDataForm.invalid) {
      return
    }
    const params = JSON.parse(JSON.stringify(this.modifyDataForm.value));
    // 文件
    params.oss_instruction = this.fileList1[0] ? this.fileList1[0].response : '';
    params.oss_component_list = this.fileList2[0] ? this.fileList2[0].response : '';

    this.btnLoading = true;
    this._http.post('api/instrument', params).subscribe((res: any) => {
      this.btnLoading = false;
      if (res.success) {
        // 刷新数据
        this.getTableData();
        this.showModifyPage = false;
      } else {
        this.msg.error(res.message);
      }
    })
  }
  // delete
  delete(id: any) {
    this.modal.info({
      nzContent: '确定删除此条数据？',
      nzOkText: '确认',
      nzCancelText: '取消',
      nzTitle: '删除',
      nzOnOk: () => {
        this._http.get(`api/instrument/${id}`).subscribe((res: any) => {
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
  download() {
    this.ExcelService.download('api/instrument/export', {}, `仪器清单`);
  }
  // 上传文件
  fileUpload = (item: UploadXHRArgs) => {
    const formData = new FormData();
    formData.append('file', item.file as any);
    this._http.post(`api/upload/7/file`, formData).subscribe((res: any) => {
      if (res.success) {
        item.onSuccess(res.data, item.file, {});
      } else {
        item.onError({}, item.file);
      }
    })
  }


  // 获取试剂列表
  getReagentList() {
    const params = {
      start: 1,
      limit: 999999,
      isGroup:1
    }
    return new Promise((resove, reject) => {
      this._http.post(`api/reagent/list`, params).subscribe((res: any) => {
        if (res.success) {
          this.goodsListCopy = res.data;
          this.initData(res.data);
          resove();
          this.showconfigPage = true;
        } else {
          this.msg.error(res.message);
          reject();
        }
      })
    })
  }
  // 获取配件列表
  getPartsList() {
    const params = {
      start: 1,
      limit: 999999
    }
    return new Promise((resove, reject) => {
      this._http.post(`api/part/list`, params).subscribe((res: any) => {
        if (res.success) {
          this.goodsListCopy = res.data;
          this.initData(res.data);
          resove();
          this.showconfigPage = true;
        } else {
          this.msg.error(res.message);
          reject();
        }
      })
    })
  }

  // 数据整理
  initData(list: any[]) {
    // 厂家
    const companyList = Array.from(new Set(list.map((item: any) => {
      return item.company;
    })))
    /* let instrumentlist: any[] = []
    companyList.map((item: any) => {
      let obj = {
        companyName: item,
        dataList: []
      }
      instrumentlist.push(obj);
    })
    instrumentlist.map((item: any) => {
      list.map((item1: any) => {
        if (item1.company == item.companyName) {
          item.dataList.push(item1.instrument);
        }
      })
    })
    //仪器去重
    instrumentlist.map((item: any) => {
      item.dataList = Array.from(new Set(item.dataList));
    }) */
    this.modalInitData = companyList;
  }
  async config(id: any, flag: number) {
    this.flag = flag;
    this.targetId = id;
    // 初始化数据
    this.queryName = null;
    this.queryCompany = null;
    this.instrumentList = [];
    this.queryInstrumentName = null;
    this.modalInitData = [];
    if (flag == 1) {
      await this.getReagentList();
      this.getSelectedGoodsList1();
    } else {
      await this.getPartsList();
      this.getSelectedGoodsList2();
    }
  }
  // 查询条件变化
  queryChange() {
    this.goodsList.map((item: any) => {
      item.checked = false;
    })
    this.refreshStatus();
  }
  // 厂家变化
  companyChange() {
    this.queryInstrumentName = null;
    this.instrumentList = [];
    this.modalInitData.map((item: any) => {
      if (item.companyName == this.queryCompany) {
        this.instrumentList = item.dataList;
      }
    })
    this.queryChange();
  }
  // 全选
  checkAll($event: any) {
    setTimeout(() => {
      this.goodsList.map((item: any) => {
        if (item.name && item.name.includes(this.queryName ? this.queryName : '') &&
          item.company && item.company.includes(this.queryCompany ? this.queryCompany : '') &&
          item.instrument && item.instrument.includes(this.queryInstrumentName ? this.queryInstrumentName : '')) {
          item.checked = $event;
        }
      })
    });
    this.refreshStatus();
  }
  refreshStatus() {
    setTimeout(() => {
      this.checkedGoods = this.goodsList.filter((item: any) => {
        return item.checked;
      })
      const showList = this.goodsList.filter((item: any) => {
        return item.name && item.name.includes(this.queryName ? this.queryName : '') &&
          item.company && item.company.includes(this.queryCompany ? this.queryCompany : '') &&
          item.instrument && item.instrument.includes(this.queryInstrumentName ? this.queryInstrumentName : '')
      })
      this.isAllChecked = (showList.length == this.checkedGoods.length) && showList.length !== 0
      this.isIndeterminate = (showList.length !== this.checkedGoods.length) && this.checkedGoods.length !== 0;
    });
  }
  checkAllS($event: boolean) {
    this.selectedGoodsList.map((item: any) => {
      item.checked = $event;
    });
    this.refreshStatusS();
  }
  refreshStatusS() {
    setTimeout(() => {
      this.checkedSelectedGoods = this.selectedGoodsList.filter((item: any) => {
        return item.checked;
      })
      this.isAllCheckedS = (this.selectedGoodsList.length == this.checkedSelectedGoods.length) && this.selectedGoodsList.length !== 0
      this.isIndeterminateS = (this.selectedGoodsList.length !== this.checkedSelectedGoods.length) && this.checkedSelectedGoods.length !== 0;
    });
  }
  // 保存权限
  saveGoods($event: any) {
    $event.target.disabled = true;
    const idList = this.checkedGoods.map((item: any) => {
      return item.id;
    })
    if (this.flag == 1) {
      this._http.post(`api/instrument/${this.targetId}/reagent/add`, idList).subscribe((res: any) => {
        $event.target.disabled = false;
        // 刷新已选列表
        this.getSelectedGoodsList1();
      })
    }
    if (this.flag == 2) {
      this._http.post(`api/instrument/${this.targetId}/part/add`, idList).subscribe((res: any) => {
        $event.target.disabled = false;
        // 刷新已选列表
        this.getSelectedGoodsList2();
      })
    }
  }
  // 删除权限
  deleteGoods($event: any) {
    $event.target.disabled = true;
    const idList = this.checkedSelectedGoods.map((item: any) => {
      return item.id;
    })
    if (this.flag == 1) {
      this._http.post(`api/instrument/${this.targetId}/reagent/delete`, idList).subscribe((res: any) => {
        $event.target.disabled = false;
        // 刷新已选列表
        this.getSelectedGoodsList1();
      })
    }
    if (this.flag == 2) {
      this._http.post(`api/instrument/${this.targetId}/part/delete`, idList).subscribe((res: any) => {
        $event.target.disabled = false;
        // 刷新已选列表
        this.getSelectedGoodsList2();
      })
    }
  }
  // 获取已配试剂列表
  getSelectedGoodsList1() {
    this._http.get(`api/instrument/${this.targetId}/reagent`).subscribe((res: any) => {
      this.selectedGoodsList = res.data ? res.data : [];
      // 刷新状态
      this.refreshStatusS()
      // 过滤数据
      this.filterStations();
    })
  }
  getSelectedGoodsList2() {
    this._http.get(`api/instrument/${this.targetId}/part`).subscribe((res: any) => {
      this.selectedGoodsList = res.data ? res.data : [];
      // 刷新状态
      this.refreshStatusS()
      // 过滤数据
      this.filterStations();
    })
  }
  // 过滤站点列表
  filterStations() {
    const idList = this.selectedGoodsList.map((item: any) => {
      return item.id;
    })
    // 通过所有站点过滤
    const data = this.goodsListCopy.filter((item: any) => {
      return (idList.indexOf(item.id) === -1) ? true : false;
    })
    data.map((item: any) => {
      item.checked = false;
    })
    this.goodsList = data;
    this.refreshStatus();
  }
}
