import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService, UploadXHRArgs } from 'ng-zorro-antd';
import { ExcelService } from '@core/excel/excel.service';
import * as moment from 'moment';

@Component({
  selector: 'app-reagent',
  templateUrl: './reagent.component.html',
  styleUrls: ['./reagent.component.less']
})
export class ReagentComponent implements OnInit {
  constructor(
    public fb: FormBuilder,
    public _http: _HttpClient,
    public msg: NzMessageService,
    private modal: NzModalService,
    public ExcelService: ExcelService,
  ) { }
  tableData: any[] = [];
  loading = false;
  keyword: any;
  q: any = {
    pageIndex: 1,
    pageSize: 20,
    total: 0,
  }
  isGroup: any;


  btnLoading = false;
  showAddPage = false;
  addDataForm: FormGroup;


  // modify
  showModifyPage = false;
  modifyDataForm: FormGroup;

  // 试剂添加弹窗
  showconfigPage = false;
  goodsList: any[] = [];
  goodsListCopy: any[] = [];
  modalInitData: any[] = [];
  queryName: any;
  queryCompany: any;
  instrumentList: any[] = [];
  queryInstrumentName: any;
  isIndeterminate = false;
  checkedGoods: any[] = [];
  isAllChecked = false;
  targetId: any;
  selectedGoodsList: any[] = [];


  isIndeterminateS = false;
  isAllCheckedS = false;

  checkedSelectedGoods: any[] = [];
  userInfo:any;
  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.getTableData();
  }

  getTableData() {
    const obj = {
      keyword: this.keyword ? this.keyword : '',
      startPage: this.q.pageIndex,
      limit: this.q.pageSize,
      isGroup: this.isGroup,
    };
    this.loading = true;
    this._http.post('api/reagent/list', obj).subscribe((res: any) => {
      this.loading = false;
      if (res.success) {
        this.tableData = res.data;
        this.q.total = res.additional_data.total;
      } else {
        this.msg.error(res.message);
      }
    })
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
    // 初始化分页
    this.q = {
      pageSize: 20,
      pageIndex: 1,
      total: 0,
    }
    this.getTableData();
  }
  add() {
    this.initAddForm();
    this.showAddPage = true;
  }
  initAddForm() {
    this.addDataForm = this.fb.group({
      name: [null, Validators.required],
      material_code: [null],
      bottling: [null],
      consistency: [null],
      in_date: [null],
      recipe_code: [null],
      recipe_name: [null],
      instrument: [null],
      company: [null,Validators.required],
      model:[null],
      is_group:[null,Validators.required]
      // 备注
      // dec: [null],
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
    this.btnLoading = true;
    this._http.put('api/reagent', params).subscribe((res: any) => {
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
    this._http.get(`api/reagent/${id}`).subscribe((res: any) => {
      if (res.success) {
        this.modifyDataForm = this.fb.group({
          id: [res.data.id],
          name: [res.data.name, Validators.required],
          material_code: [res.data.material_code],
          bottling: [res.data.bottling],
          consistency: [res.data.consistency],
          in_date: [res.data.in_date],
          recipe_code: [res.data.recipe_code],
          recipe_name: [res.data.recipe_name],
          instrument: [res.data.instrument],
          company: [res.data.company],
          model:[res.data.model],
          is_group:[res.data.is_group?1:0,Validators.required]
          // 备注
          // dec: [res.data.dec],
        })
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
    this.btnLoading = true;
    this._http.post('api/reagent', params).subscribe((res: any) => {
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
        this._http.delete(`api/reagent/${id}`).subscribe((res: any) => {
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
  // 导出
  download() {
    this.ExcelService.download('api/reagent/export', {}, `试剂清单`);
  }
  async config(id: any) {
    this.targetId = id;
    // 初始化数据
    this.queryName = null;
    this.queryCompany = null;
    this.instrumentList = [];
    this.queryInstrumentName = null;
    this.modalInitData = [];
      await this.getReagentList();
      this.getSelectedGoodsList1();
  }

  // 保存权限
  saveGoods($event: any) {
    $event.target.disabled = true;
    const idList = this.checkedGoods.map((item: any) => {
      return item.id;
    })
      this._http.post(`api/reagent/${this.targetId}/reagent/add`, idList).subscribe((res: any) => {
        $event.target.disabled = false;
        // 刷新已选列表
        this.getSelectedGoodsList1();
      })
  }
  // 删除权限
  deleteGoods($event: any) {
    $event.target.disabled = true;
    const idList = this.checkedSelectedGoods.map((item: any) => {
      return item.id;
    })
      this._http.post(`api/reagent/${this.targetId}/reagent/delete`, idList).subscribe((res: any) => {
        $event.target.disabled = false;
        // 刷新已选列表
        this.getSelectedGoodsList1();
      })
  }
// 全选
  checkAll($event: any) {
    setTimeout(() => {
      this.goodsList.map((item: any) => {
        if (item.name && item.name.includes(this.queryName ? this.queryName : '') &&
          item.company && item.company.includes(this.queryCompany ? this.queryCompany : '')
          ) {
          item.checked = $event;
        }
      })
    });
    this.refreshStatus();
  }
  checkAllS($event: boolean) {
    this.selectedGoodsList.map((item: any) => {
      item.checked = $event;
    });
    this.refreshStatusS();
  }
  // 获取已配试剂列表
  getSelectedGoodsList1() {
    this._http.get(`api/reagent/${this.targetId}/reagent`).subscribe((res: any) => {
      this.selectedGoodsList = res.data ? res.data : [];
      // 刷新状态
      this.refreshStatusS()
      // 过滤数据
      this.filterStations();
    })
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

  // 查询条件变化
  queryChange() {
    this.goodsList.map((item: any) => {
      item.checked = false;
    })
    this.refreshStatus();
  }
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
  refreshStatus() {
    setTimeout(() => {
      this.checkedGoods = this.goodsList.filter((item: any) => {
        return item.checked;
      })
      const showList = this.goodsList.filter((item: any) => {
        return item.name && item.name.includes(this.queryName ? this.queryName : '') &&
          item.company && item.company.includes(this.queryCompany ? this.queryCompany : '')
      })
      this.isAllChecked = (showList.length == this.checkedGoods.length) && showList.length !== 0
      this.isIndeterminate = (showList.length !== this.checkedGoods.length) && this.checkedGoods.length !== 0;
    });
  }
// 获取试剂列表
  getReagentList() {
    const params = {
      start: 1,
      limit: 999999,
      isGroup: 0,
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

  // 数据整理
  initData(list: any[]) {
    // 厂家
    const companyList = Array.from(new Set(list.map((item: any) => {
      return item.company;
    })))
    const instrumentlist: any[] = []
    companyList.map((item: any) => {
      const obj = {
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
    // 仪器去重
    instrumentlist.map((item: any) => {
      item.dataList = Array.from(new Set(item.dataList));
    })
    this.modalInitData = instrumentlist;
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
