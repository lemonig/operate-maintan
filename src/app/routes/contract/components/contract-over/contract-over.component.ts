import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService, UploadXHRArgs } from 'ng-zorro-antd';
import { ExcelService } from '@core/excel/excel.service';
import * as moment from 'moment';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-contract-over',
  templateUrl: './contract-over.component.html',
  styleUrls: ['./contract-over.component.less']
})
export class ContractOverComponent implements OnInit {

  constructor(
    public fb: FormBuilder,
    public _http: _HttpClient,
    public msg: NzMessageService,
    private modal: NzModalService,
    public ExcelService: ExcelService,
    public router: ActivatedRoute,
    private routerl: Router,
  ) { }
  tableData: any[] = [];
  loading = false;
  q: any = {
    pageIndex: 1,
    pageSize: 20,
    total: 0,
  }
  queryName: any;
  stationName: any;
  state: any;


  btnLoading = false;
  showAddPage = false;
  addDataForm: FormGroup;
  fileList: any[] = [];

  showRenewalPage = false;
  // modify
  showModifyPage = false;
  modifyDataForm: FormGroup;







  noSelectKeyword: any = '';
  SelectedKeyword: any = '';
  noSelectKeywordC: any = '';
  SelectedKeywordC: any = '';
  noSelectKeywordT: any = '';
  SelectedKeywordT: any = '';
  // 表格选中操作
  // 未选
  isIndeterminate = false;
  isAllChecked = false;
  checkedStation: any[] = [];
  // 已选
  isIndeterminateS = false;
  isAllCheckedS = false;
  checkedStationS: any[] = [];
  areaData: any = {
    province: [],
    city: [],
    area: [],
  }
  province: any;
  city: any;
  area: any;

  stations: any[] = [];
  selectedStations: any[] = [];
  cars: any[] = [];
  selectedCars: any[] = [];
  selectedTools: any[] = [];
  tools: any[] = [];
  carCount: any;
  toolCount: any;
  targetId: any;
  flag: number;

  // 配置运维站点
  showconfigStation = false;

  stationCount: any;

  // 表格选中操作
  // 未选
  isIndeterminateC = false;
  isAllCheckedC = false;
  checkedCar: any[] = [];
  // 已选
  isIndeterminateCS = false;
  isAllCheckedCS = false;
  checkedCarS: any[] = [];


  contractStateList: any = [];

  // 根据省市区获取站点列表
  // 完整的站点返回列表
  allStations: any = [];

  // 完整的车辆返回列表
  allCars: any = [];
  // 表格选中操作
  // 未选
  isIndeterminateT = false;
  isAllCheckedT = false;
  checkedTool: any[] = [];
  // 已选
  isIndeterminateTS = false;
  isAllCheckedTS = false;
  checkedToolS: any[] = [];

  // 完整的固定资产返回列表
  allTools: any = [];
  userInfo: any;
  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    /* if(this.router.queryParams.value.isOver){
      } */
    if (this.router.queryParams["value"]["isOver"]) {
    }
    this.getRegionList()
    this.getTableData();
    this.getProvinceList();
    this.getContractStateList();
  }
  // 关键词变化搜索
  handleSortKeyChange() {
    console.log(this.stationName);


  }
  regionList: [] = []
  provinceKey: any = '' //已选中省
  // 获取城市
  getRegionList() {
    this._http.get('api/org/region/list/work').subscribe((res: any) => {
      if (res.success) {
        this.regionList = res.data;
      } else {
        this.msg.error(res.message);
      }
    })
  }
  getTableData() {
    const params = {
      name: this.queryName,
      state: this.state,
      stationName: this.stationName,
      startPage: this.q.pageIndex,
      limit: this.q.pageSize,
      // active: this.active
    };
    this.loading = true;
    this._http.post('api/contract/list', params).subscribe((res: any) => {
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
    this.getTableData();
  }
  pageSizeChange(num: number) {
    this.q.pageSize = num;
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
  // add() {
  //   this.initAddForm();
  //   this.fileList = [];
  //   this.showAddPage = true;
  // }
  // initAddForm() {
  //   this.addDataForm = this.fb.group({
  //     name: [null, Validators.required],
  //     num: [null, Validators.required],
  //     project_manager: [null, Validators.required],
  //     daily_count: [null, Validators.required],
  //     start_date: [null, Validators.required],
  //     end_date: [null, Validators.required],
  //     company: [null, Validators.required],
  //     contacter: [null, Validators.required],
  //     phone: [null, Validators.required],
  //     description: [null],
  //     region_key: [null, Validators.required],
  //     total: [null],
  //     ops_money: [null],
  //     state: [null],
  //     ops_start_date: [null],
  //     ops_end_date: [null],
  //     check_date: [null],
  //   })
  // }
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
    this._http.put('api/contract', params).subscribe((res: any) => {
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

  // renewal续签
  // renewal(id: any) {
  //   this.targetId = id;
  //   this.initRenewalForm(id);
  // }
  initRenewalForm(id: any) {
    this._http.get(`api/contract/${id}`).subscribe((res: any) => {
      if (res.success) {
        this.modifyDataForm = this.fb.group({
          id: [res.data.id],
          name: [res.data.name, Validators.required],
          num: [null, Validators.required],
          project_manager: [res.data.project_manager, Validators.required],
          daily_count: [res.data.daily_count, Validators.required],
          start_date: [null, Validators.required],
          end_date: [null, Validators.required],
          company: [res.data.company, Validators.required],
          contacter: [res.data.contacter, Validators.required],
          phone: [res.data.phone, Validators.required],
          description: [res.data.description],
          region_key: [res.data.region_key, Validators.required],
          total: [res.data.total],
          ops_money: [res.data.ops_money],
          state: [res.data.state],
          ops_start_date: [null],
          ops_end_date: [null],
          check_date: [null]
        })
        // 返回文件信息
        this.showRenewalPage = true;
      } else {
        this.msg.error(res.message);
      }
    })
  }
  saveRenewalData() {
    for (const i in this.modifyDataForm.controls) {
      this.modifyDataForm.controls[i].markAsDirty();
      this.modifyDataForm.controls[i].updateValueAndValidity();
    }
    if (this.modifyDataForm.invalid) {
      return
    }
    const params = JSON.parse(JSON.stringify(this.modifyDataForm.value));
    this.btnLoading = true;
    this._http.post('api/contract/renewal', params).subscribe((res: any) => {
      this.btnLoading = false;
      if (res.success) {
        // 刷新数据
        this.getTableData();
        this.showRenewalPage = false;
      } else {
        this.msg.error(res.message);
      }
    })
  }
  modify(id: any) {
    let extraDataObj = {
      queryParams: {
        id: id
      }
    };
    this.routerl.navigate(['contract/config'], extraDataObj)
  }
  initModifyForm(id: any) {
    this._http.get(`api/contract/${id}`).subscribe((res: any) => {
      if (res.success) {
        this.modifyDataForm = this.fb.group({
          id: [res.data.id],
          name: [res.data.name, Validators.required],
          num: [res.data.num, Validators.required],
          project_manager: [res.data.project_manager, Validators.required],
          daily_count: [res.data.daily_count, Validators.required],
          start_date: [res.data.start_date, Validators.required],
          end_date: [res.data.end_date, Validators.required],
          company: [res.data.company, Validators.required],
          contacter: [res.data.contacter, Validators.required],
          phone: [res.data.phone, Validators.required],
          description: [res.data.description],
          region_key: [res.data.region_key, Validators.required],
          total: [res.data.total],
          ops_money: [res.data.ops_money],
          state: [res.data.state],
          ops_start_date: [res.data.ops_start_date],
          ops_end_date: [res.data.ops_end_date],
          check_date: [res.data.check_date]
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
    this.btnLoading = true;
    this._http.post('api/contract', params).subscribe((res: any) => {
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
        this._http.delete(`api/contract/${id}`).subscribe((res: any) => {
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
  checkAll($event: boolean) {
    this.stations.map((item: any) => {
      // 关键字搜索需要屏蔽
      if (item.name.includes(this.noSelectKeyword) ||
        item.pinyin.includes(this.noSelectKeyword.toUpperCase()) ||
        item.jianpin.includes(this.noSelectKeyword.toUpperCase())) {
        item.checked = $event;
      }
    });
    this.refreshStatus();
  }
  refreshStatus() {
    setTimeout(() => {
      this.checkedStation = this.stations.filter((item: any) => {
        return item.checked;
      })
      this.isAllChecked = (this.stations.length == this.checkedStation.length) && this.stations.length !== 0
      this.isIndeterminate = (this.stations.length !== this.checkedStation.length) && this.checkedStation.length !== 0;
    });
  }
  checkAllS($event: boolean) {
    this.selectedStations.map((item: any) => {
      if (item.name.includes(this.SelectedKeyword) ||
        item.pinyin.includes(this.SelectedKeyword.toUpperCase()) ||
        item.jianpin.includes(this.SelectedKeyword.toUpperCase())) {
        item.checked = $event;
      }
    });
    this.refreshStatusS();
  }
  refreshStatusS() {
    setTimeout(() => {
      this.checkedStationS = this.selectedStations.filter((item: any) => {
        return item.checked;
      })
      this.isAllCheckedS = (this.selectedStations.length == this.checkedStationS.length) && this.selectedStations.length !== 0
      this.isIndeterminateS = (this.selectedStations.length !== this.checkedStationS.length) && this.checkedStationS.length !== 0;
    });
  }
  // 获取省市区下拉数据
  getProvinceList() {
    this._http.get('api/org/async').subscribe((res: any) => {
      this.areaData.province = res.data ? res.data : [];
    })
  }
  provinceChange($event: any) {
    // 初始化数据
    this.city = null;
    this.area = null;
    this._http.get('api/org/async', { key: $event }).subscribe((res: any) => {
      this.areaData.city = res.data ? res.data : [];
    })
    this.getStationList();
  }
  cityChange($event: any) {
    this.area = null;
    this.areaData.area = [];
    if ($event) {
      this._http.get('api/org/async', { key: $event }).subscribe((res: any) => {
        this.areaData.area = res.data ? res.data : [];
      })
    }
    this.getStationList();
  }
  areaChange($event: any) {
    this.getStationList();
  }
  configStation(id: any, num: number) {
    this.flag = num;
    this.targetId = id;
    // 初始化站点数据
    this.stations = [];
    this.selectedStations = [];
    this.selectedCars = [];
    this.cars = [];
    this.SelectedKeyword = '';
    this.noSelectKeyword = '';
    this.SelectedKeywordC = '';
    this.noSelectKeywordC = '';

    this.stationCount = 0;
    // 初始化省份
    this.province = this.areaData.province[0].key;
    this.city = null;
    this.area = null;
    this.areaData.city = [];
    this.areaData.area = [];
    this.provinceChange(this.province);

    this.getSelectedStation()
    this.showconfigStation = true;
  }
  // 获取运维已选站点
  getSelectedStation() {
    this._http.get(`api/contract/${this.targetId}/station`).subscribe((res: any) => {
      this.selectedStations = res.data ? res.data : [];
      this.stationCount = this.selectedStations.length;
      // 刷新状态
      this.refreshStatusS()
      // 过滤数据
      this.filterStations();
    })
  }

  // 保存站点
  saveStation($event: any) {
    $event.target.disabled = true;
    const selectedList = this.stations.filter((item: any) => {
      return item.checked;
    });
    const idList = selectedList.map((item: any) => {
      return item.id;
    })
    const obj = {
      stationIdList: idList,
      targetId: this.targetId,
    }
    this._http.post(`api/contract/station/add`, obj).subscribe((res: any) => {
      $event.target.disabled = false;
      // 刷新已选列表
      this.getSelectedStation();
    })
  }
  // 删除站点
  deleteStation($event: any) {
    $event.target.disabled = true;
    const selectedList = this.selectedStations.filter((item: any) => {
      return item.checked;
    });
    const idList = selectedList.map((item: any) => {
      return item.id;
    })
    const obj = {
      stationIdList: idList,
      targetId: this.targetId,
    }
    this._http.post(`api/contract/station/delete`, obj).subscribe((res: any) => {
      $event.target.disabled = false;
      // 刷新已选列表
      this.getSelectedStation();
    })
  }

  // 获取车辆已选站点
  getSelectedCar() {
    this._http.get(`api/contract/${this.targetId}/car`).subscribe((res: any) => {
      this.selectedCars = res.data ? res.data : [];
      this.carCount = this.selectedCars.length;
      // 刷新状态
      this.refreshStatusC();
      this.refreshStatusCS();
      // 过滤数据
      this.filterCars();
    })
  }

  // 保存车辆
  saveCar($event: any) {
    $event.target.disabled = true;
    const selectedList = this.cars.filter((item: any) => {
      return item.checked;
    });
    const idList = selectedList.map((item: any) => {
      return item.id;
    })
    const obj = {
      targetIdList: idList,
      contractId: this.targetId,
    }
    this._http.post(`api/contract/car/add`, obj).subscribe((res: any) => {
      $event.target.disabled = false;
      // 刷新已选列表
      this.getSelectedCar();
    })
  }
  // 删除车辆
  deleteCar($event: any) {
    $event.target.disabled = true;
    const selectedList = this.selectedCars.filter((item: any) => {
      return item.checked;
    });
    const idList = selectedList.map((item: any) => {
      return item.id;
    })
    const obj = {
      targetIdList: idList,
      contractId: this.targetId,
    }
    this._http.post(`api/contract/car/delete`, obj).subscribe((res: any) => {
      $event.target.disabled = false;
      // 刷新已选列表
      this.getSelectedCar();
    })
  }
  checkAllC($event: boolean) {
    this.cars.map((item: any) => {
      // 关键字搜索需要屏蔽
      if (item.name.includes(this.noSelectKeywordC)) {
        item.checked = $event;
      }
    });
    this.refreshStatusC();
  }
  refreshStatusC() {
    setTimeout(() => {
      this.checkedCar = this.cars.filter((item: any) => {
        return item.checked;
      })
      this.isAllCheckedC = (this.cars.length == this.checkedCar.length) && this.cars.length !== 0
      this.isIndeterminateC = (this.cars.length !== this.checkedCar.length) && this.checkedCar.length !== 0;
    });
  }
  checkAllCS($event: boolean) {
    this.selectedCars.map((item: any) => {
      if (item.name.includes(this.SelectedKeywordC)) {
        item.checked = $event;
      }
    });
    this.refreshStatusCS();
  }
  refreshStatusCS() {
    setTimeout(() => {
      this.checkedCarS = this.selectedCars.filter((item: any) => {
        return item.checked;
      })
      this.isAllCheckedCS = (this.selectedCars.length == this.checkedCarS.length) && this.selectedCars.length !== 0
      this.isIndeterminateCS = (this.selectedCars.length !== this.checkedCarS.length) && this.checkedCarS.length !== 0;
    });
  }
  getContractStateList() {
    this._http.get(`api/contract/state`).subscribe((res: any) => {
      this.contractStateList = res.data ? res.data : [];
    })
  }
  getStationList() {
    let key: any;
    if (this.area) {
      key = this.area;
    } else if (this.city) {
      key = this.city;
    } else if (this.province) {
      key = this.province;
    } else {
      key = '';
    }
    this._http.get(`api/org/${key}/station`).subscribe((res: any) => {
      this.allStations = res.data ? res.data : [];
      // 过滤数据
      this.filterStations();
    })
  }
  // 过滤站点列表
  filterStations() {
    const idList = this.selectedStations.map((item: any) => {
      return item.id;
    })
    // 通过所有站点过滤
    const data = this.allStations.filter((item: any) => {
      return (idList.indexOf(item.id) === -1) ? true : false;
    })
    data.map((item: any) => {
      item.checked = false;
    })
    this.stations = data;
    this.refreshStatus();
  }
  getCarList() {
    let key: any;
    if (this.area) {
      key = this.area;
    } else if (this.city) {
      key = this.city;
    } else if (this.province) {
      key = this.province;
    } else {
      key = '';
    }
    this._http.get(`api/car/simple`).subscribe((res: any) => {
      this.allCars = res.data ? res.data : [];
      // 过滤数据
      this.filterCars();
    })
  }

  // 过滤车辆列表
  filterCars() {
    const idList = this.selectedCars.map((item: any) => {
      return item.id;
    })
    // 通过所有车辆过滤
    const data = this.allCars.filter((item: any) => {
      return (idList.indexOf(item.id) === -1) ? true : false;
    })
    data.map((item: any) => {
      item.checked = false;
    })
    this.cars = data;
    this.refreshStatusC();
  }

  getCarInfo() {
    this.getSelectedCar();
    this.getCarList();
  }

  // 固定资产
  getToolInfo() {
    this.getSelectedTool();
    this.getToolList();
  }
  // 获取固定资产已选站点
  getSelectedTool() {
    this._http.get(`api/contract/${this.targetId}/tool`).subscribe((res: any) => {
      this.selectedTools = res.data ? res.data : [];
      this.toolCount = this.selectedTools.length;
      // 刷新状态
      this.refreshStatusT();
      this.refreshStatusTS();
      // 过滤数据
      this.filterTools();
    })
  }
  // 保存固定资产
  saveTool($event: any) {
    $event.target.disabled = true;
    const selectedList = this.tools.filter((item: any) => {
      return item.checked;
    });
    const idList = selectedList.map((item: any) => {
      return item.id;
    })
    const obj = {
      targetIdList: idList,
      contractId: this.targetId,
    }
    this._http.post(`api/contract/tool/add`, obj).subscribe((res: any) => {
      $event.target.disabled = false;
      // 刷新已选列表
      this.getSelectedTool();
    })
  }
  // 删除车辆
  deleteTool($event: any) {
    $event.target.disabled = true;
    const selectedList = this.selectedTools.filter((item: any) => {
      return item.checked;
    });
    const idList = selectedList.map((item: any) => {
      return item.id;
    })
    const obj = {
      targetIdList: idList,
      contractId: this.targetId,
    }
    this._http.post(`api/contract/tool/delete`, obj).subscribe((res: any) => {
      $event.target.disabled = false;
      // 刷新已选列表
      this.getSelectedTool();
    })
  }
  checkAllT($event: boolean) {
    this.tools.map((item: any) => {
      // 关键字搜索需要屏蔽
      if (item.name.includes(this.noSelectKeywordT)) {
        item.checked = $event;
      }
    });
    this.refreshStatusT();
  }
  refreshStatusT() {
    setTimeout(() => {
      this.checkedTool = this.tools.filter((item: any) => {
        return item.checked;
      })
      this.isAllCheckedT = (this.tools.length == this.checkedTool.length) && this.tools.length !== 0
      this.isIndeterminateT = (this.tools.length !== this.checkedTool.length) && this.checkedTool.length !== 0;
    });
  }
  checkAllTS($event: boolean) {
    this.selectedTools.map((item: any) => {
      if (item.name.includes(this.SelectedKeywordT)) {
        item.checked = $event;
      }
    });
    this.refreshStatusTS();
  }
  refreshStatusTS() {
    setTimeout(() => {
      this.checkedToolS = this.selectedTools.filter((item: any) => {
        return item.checked;
      })
      this.isAllCheckedTS = (this.selectedTools.length == this.checkedToolS.length) && this.selectedTools.length !== 0
      this.isIndeterminateTS = (this.selectedTools.length !== this.checkedToolS.length) && this.checkedToolS.length !== 0;
    });
  }

  // 过滤固定资产列表
  filterTools() {
    const idList = this.selectedTools.map((item: any) => {
      return item.id;
    })
    // 通过所有工具过滤
    const data = this.allTools.filter((item: any) => {
      return (idList.indexOf(item.id) === -1) ? true : false;
    })
    data.map((item: any) => {
      item.checked = false;
    })
    this.tools = data;
    this.refreshStatusT();
  }
  getToolList() {
    let key: any;
    if (this.area) {
      key = this.area;
    } else if (this.city) {
      key = this.city;
    } else if (this.province) {
      key = this.province;
    } else {
      key = '';
    }
    const param = {
      limit: 9999
    }
    this._http.post(`api/tool/list`, param).subscribe((res: any) => {
      this.allTools = res.data ? res.data : [];
      // 过滤数据
      this.filterTools();
    })
  }

  download() {
    const obj = {
      name: this.queryName ? this.queryName : null,
      state: this.state ? this.state : null,
      stationName: this.stationName ? this.stationName : null,
      // active: this.active ? this.active : null,
      startPage: this.q.pageIndex,
      limit: this.q.pageSize,
    };
    this.ExcelService.download('api/contract/export', obj, `合同信息`);
  }
}
