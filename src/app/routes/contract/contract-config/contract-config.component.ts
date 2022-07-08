import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService, UploadXHRArgs } from 'ng-zorro-antd';
import { ExcelService } from '@core/excel/excel.service';
import * as moment from 'moment';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-contract-config',
  templateUrl: './contract-config.component.html',
  styleUrls: ['./contract-config.component.less']
})
export class ContractConfigComponent implements OnInit {
  btnLoading = false;
  loading: boolean = false
  constructor(
    public fb: FormBuilder,
    public _http: _HttpClient,
    public msg: NzMessageService,
    private modal: NzModalService,
    public ExcelService: ExcelService,
    private activatedRoute: ActivatedRoute,
    private _location: Location
  ) { }

  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    console.log(this.activatedRoute.queryParams);
    let id = this.activatedRoute.queryParams['value']['id']
    this.targetId = id;
    this.initModifyForm(id);
    this.getSelectedStation();
  }
  // 返回
  goBack() {
    this._location.back()
  }

  /*******************基本信息**********/
  modifyDataForm: FormGroup;

  contractStateList: any = [];//合同状态

  stationCount: any; //站点个数
  targetId: any;
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
      } else {
        this.msg.error(res.message);
      }
    })
  }
  getContractStateList() {
    this._http.get(`api/contract/state`).subscribe((res: any) => {
      this.contractStateList = res.data ? res.data : [];
    })
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
  // 保存基本信息
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
        // 保存
      } else {
        this.msg.error(res.message);
      }
    })
  }

  /************配置站点****************/

  noSelectKeyword: any = '';
  SelectedKeyword: any = '';
  noSelectKeywordC: any = '';
  SelectedKeywordC: any = '';
  noSelectKeywordT: any = '';
  SelectedKeywordT: any = '';

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
  /*****************配置车辆****************/
  cars: any[] = [];
  selectedCars: any[] = [];
  selectedTools: any[] = [];
  tools: any[] = [];
  carCount: any;
  toolCount: any;
  // 完整的车辆返回列表
  allCars: any = [];
  // 未选
  isIndeterminateC = false;
  isAllCheckedC = false;
  checkedCar: any[] = [];
  // 已选
  isIndeterminateCS = false;
  isAllCheckedCS = false;
  checkedCarS: any[] = [];
  // 获取车辆信息
  getCarInfo() {
    this.getSelectedCar();
    this.getCarList();
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
  checkAllC($event: boolean) {
    this.cars.map((item: any) => {
      // 关键字搜索需要屏蔽
      if (item.name.includes(this.noSelectKeywordC)) {
        item.checked = $event;
      }
    });
    this.refreshStatusC();
  }
  checkAllCS($event: boolean) {
    this.selectedCars.map((item: any) => {
      if (item.name.includes(this.SelectedKeywordC)) {
        item.checked = $event;
      }
    });
    this.refreshStatusCS();
  }
  // 刷新车辆
  refreshStatusC() {
    setTimeout(() => {
      this.checkedCar = this.cars.filter((item: any) => {
        return item.checked;
      })
      this.isAllCheckedC = (this.cars.length == this.checkedCar.length) && this.cars.length !== 0
      this.isIndeterminateC = (this.cars.length !== this.checkedCar.length) && this.checkedCar.length !== 0;
    });
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
  /*****************配置固定资产*****************/
  // 完整的固定资产返回列表
  allTools: any = [];
  userInfo: any;

  // 未选
  isIndeterminateT = false;
  isAllCheckedT = false;
  checkedTool: any[] = [];
  // 已选
  isIndeterminateTS = false;
  isAllCheckedTS = false;
  checkedToolS: any[] = [];

  // 固定资产获取
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
  /*********************合同服务目录******************************/
  serveTableData: [] = []
  qs: any = {
    pageIndex: 1,
    pageSize: 20,
    total: 0,
  }
  queryName: any;
  stationName: any;
  state: any;
  active: any;
  tableData: [] = []
  getTableDataServe() {
    const params = {
      name: this.queryName,
      state: this.state,
      stationName: this.stationName,
      startPage: this.qs.pageIndex,
      limit: this.qs.pageSize,
      active: this.active
    };
    this.loading = true;
    this._http.post('api/contract/list', params).subscribe((res: any) => {
      this.loading = false;
      if (res.success) {
        this.tableData = res.data;
        this.qs.total = res.additional_data.total;
      } else {
        this.msg.error(res.message);
      }
    })
  }
  pageIndexChangeServe(num: number) {
    this.qs.pageIndex = num;
    this.getTableDataServe();
  }
  pageSizeChangeServe(num: number) {
    this.qs.pageSize = num;
    this.getTableDataServe();
  }
  searchServe() {
    // 初始化分页
    this.qs = {
      pageSize: 20,
      pageIndex: 1,
      total: 0,
    }
    this.getTableDataServe();
  }
  serveEdit(id: any) {

  }
  serveDele(id: any) {

  }


  areaData: any = { //省市县
    province: [],
    city: [],
    area: [],
  }
  province: any;
  city: any;
  area: any;

  // 站点选择有关数据
  // 未选
  isIndeterminate = false;
  isAllChecked = false;
  // 已选
  isIndeterminateS = false;
  isAllCheckedS = false;
  // 完整的站点返回列表
  allStations: any = [];
  selectedStations: any[] = [];
  stations: any[] = [];
  checkedStation: any[] = [];
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

  refreshStatus() {
    setTimeout(() => {
      this.checkedStation = this.stations.filter((item: any) => {
        return item.checked;
      })
      this.isAllChecked = (this.stations.length == this.checkedStation.length) && this.stations.length !== 0
      this.isIndeterminate = (this.stations.length !== this.checkedStation.length) && this.checkedStation.length !== 0;
    });
  }
  checkedStationS: any[] = [];
  refreshStatusS() {
    setTimeout(() => {
      this.checkedStationS = this.selectedStations.filter((item: any) => {
        return item.checked;
      })
      this.isAllCheckedS = (this.selectedStations.length == this.checkedStationS.length) && this.selectedStations.length !== 0
      this.isIndeterminateS = (this.selectedStations.length !== this.checkedStationS.length) && this.checkedStationS.length !== 0;
    });
  }
}
