import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService, UploadXHRArgs } from 'ng-zorro-antd';
import { ExcelService } from '@core/excel/excel.service';
import * as moment from 'moment';
declare var AMap: any;

@Component({
  selector: 'app-station-info',
  templateUrl: './station-info.component.html',
  styleUrls: ['./station-info.component.less']
})
export class StationInfoComponent implements OnInit {
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
  allOriginData: any = {};
  areaData: any = {
    province: [],
    city: [],
    area: [],
  }
  keyword: any;
  contract: any;
  idMark: any;
  waterLevel: any[] = [
    { value: 0, label: 'Ⅰ' },
    { value: 1, label: 'Ⅱ' },
    { value: 2, label: 'Ⅲ' },
    { value: 3, label: 'Ⅳ' },
    { value: 4, label: 'Ⅴ' },
    { value: 5, label: '劣Ⅴ' },
  ]
  allStationList: any[] = [];


  btnLoading = false;
  showAddPage = false;
  addDataForm: FormGroup;
  // modify
  showModifyPage = false;
  modifyDataForm: FormGroup;

  instruData: any[] = [{}];
  // 编辑仪器
  showModifyInstru = false;
  modifyInstruForm: FormGroup;
  // 配置仪器
  showConfigInstru = false;
  instruList: any[] = [];


  helpInstruData: any[] = [{}];
  showConfigHelpInstru = false;
  addOrMoidfy: any = true //true为add   false为modify



  // 站点关联人员
  regionManagerList: any[] = [];
  regionManagerListCopy: any[] = [];
  // 站点关联人员
  areaManagerList: any[] = [];
  areaManagerListCopy: any[] = [];
  projectManagerList: any[] = [];
  projectManagerListCopy: any[] = [];
  cityManagerList: any[] = [];
  cityManagerListCopy: any[] = [];

  dataManageList: any[] = [];
  dataManageListCopy: any[] = [];
  assistantList: any[] = [];
  assistantListCopy: any[] = [];
  opsList: any[] = [];
  opsListCopy: any[] = [];

  showconfigPage = false;
  targetId: any;
  queryName: any;
  queryVersion: any;
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
  userInfo: any;
  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    // 获取运维列表
    this.getOpsList();
    this.getDataManageList();
    this.getAssistantList();
    this.getCityManagerList();
    this.getRegionManagerList()
    this.getProvinceList();
    this.getAreaManagerList();
    this.getProjectManagerList();
    // 加载原数据
    this._http.get('api/meta').subscribe((res: any) => {
      if (res.success) {
        this.allOriginData = res.data;
      }
    })
    // 获取表格数据
    this.getTableData();
  }
  getTableData() {
    const obj = {
      name: this.keyword ? this.keyword : '',
      startPage: this.q.pageIndex,
      limit: this.q.pageSize,
      contract: this.contract ? this.contract : '',
    };
    this.loading = true;
    this._http.get('api/station', obj).subscribe((res: any) => {
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
  download() {
    this.ExcelService.download('api/station/export', {}, `站点列表`);
  }

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

  // 经纬度校验函数
  // 经纬度校验函数
  CheckLon() {
    return (control: any) => {
      if (control.value) { // 必须有值
        const range = (control.value >= 0 && control.value <= 180);
        return range ? null : { 'lonOkPattern': { value: control.value } };
      } else {
        return null;
      }
    }
  }
  CheckLat() {
    return (control: any) => {
      if (control.value) { // 必须有值
        // 大小验证
        const range = (control.value >= 0 && control.value <= 90);
        return range ? null : { 'latOkPattern': { value: control.value } };
      } else {
        return null;
      }
    }
  }
  add() {
    this.initAddForm();
    this.showAddPage = true;
    this.idMark = null;
    this.addOrMoidfy = true
  }
  initAddForm() {
    this.addDataForm = this.fb.group({
      name: [null, [Validators.required]],
      mn: [null, [Validators.required, Validators.maxLength(45)]],
      state: [null, [Validators.required]],
      stationType: [null, [Validators.required]],
      stationGroup: [null, [Validators.required]],
      buildDate: [null],
      controlType: [null],
      stationHouse: [null, [Validators.required]],
      riverType: [null],
      waterType: [null],
      integrator: [null],
      operator: [null],
      opsId: [null, [Validators.required]],
      dataManagerId: [null, [Validators.required]],
      opsCityManagerId: [null, [Validators.required]],
      opsRegionManagerId: [null, [Validators.required]],
      opsAreaManagerId: [null],
      opsProjectManagerId: [null],
      assistantId: [null, [Validators.required]],
      carNum: [null],
      coordinate1: [null, Validators.compose([Validators.required, this.CheckLon()])],
      coordinate2: [null, Validators.compose([Validators.required, this.CheckLat()])],
      address: [null],
      province: [null, [Validators.required]],
      city: [null, [Validators.required]],
      districtKey: [null, [Validators.required]],
      payWaterName: [null],
      payWaterAccount: [null],
      payWaterMethod: [null],
      payElectricName: [null],
      payElectricAccount: [null],
      payElectricMethod: [null],
      payNetName: [null],
      payNetAccount: [null],
      payNetMethod: [null],
      wireless: [null],
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
    params.coordinate1 = String(params.coordinate1).trim();
    params.coordinate2 = String(params.coordinate2).trim();
    this.btnLoading = true;
    this._http.put('api/station', params).subscribe((res: any) => {
      this.btnLoading = false;
      if (res.success) {
        // 跳转到列表页面、
        this.addOrMoidfy = true
        this.getTableData();
        this.showAddPage = false;
      } else {
        this.msg.error(res.message);
      }
    })
  }
  modify(id: any) {
    this.idMark = id;
    this.initModifyForm(id);
    this.addOrMoidfy = false
  }
  initModifyForm(id: any) {
    this._http.get(`api/station/${id}`).subscribe((res: any) => {
      if (res.success) {
        this.modifyDataForm = this.fb.group({
          id: [res.data.id],
          name: [res.data.name, [Validators.required]],
          mn: [res.data.mn, [Validators.required, Validators.maxLength(45)]],
          state: [res.data.state, [Validators.required]],
          stationType: [res.data.stationType, [Validators.required]],
          stationGroup: [res.data.stationGroup, [Validators.required]],
          buildDate: [res.data.buildDate],
          controlType: [res.data.controlType],
          stationHouse: [res.data.stationHouse],
          riverType: [res.data.riverType],
          waterType: [res.data.waterType],
          integrator: [res.data.integrator],
          operator: [res.data.operator],
          opsId: [res.data.opsId, [Validators.required]],
          dataManagerId: [res.data.dataManagerId, [Validators.required]],
          opsAreaManagerId: [res.data.opsAreaManagerId],
          opsProjectManagerId: [res.data.opsProjectManagerId],
          opsCityManagerId: [res.data.opsCityManagerId, [Validators.required]],
          opsRegionManagerId: [res.data.opsRegionManagerId, [Validators.required]],
          assistantId: [res.data.assistantId, [Validators.required]],
          carNum: [res.data.carNum],
          coordinate1: [res.data.coordinate1, Validators.compose([Validators.required, this.CheckLon()])],
          coordinate2: [res.data.coordinate2, Validators.compose([Validators.required, this.CheckLat()])],
          address: [res.data.address],
          province: [res.data.regionKey, [Validators.required]],
          city: [res.data.cityKey, [Validators.required]],
          districtKey: [res.data.districtKey, [Validators.required]],
          payWaterName: [res.data.payWaterName],
          payWaterAccount: [res.data.payWaterAccount],
          payWaterMethod: [res.data.payWaterMethod],
          payElectricName: [res.data.payElectricName],
          payElectricAccount: [res.data.payElectricAccount],
          payElectricMethod: [res.data.payElectricMethod],
          payNetName: [res.data.payNetName],
          payNetAccount: [res.data.payNetAccount],
          payNetMethod: [res.data.payNetMethod],
          wireless: [res.data.wireless],
        })
        // 返回省市区列表数据
        if (res.data.regionKey) {
          this._http.get('api/org/async', { key: res.data.regionKey }).subscribe((res: any) => {
            this.areaData.city = res.data ? res.data : [];
          })
        }
        if (res.data.cityKey) {
          this._http.get('api/org/async', { key: res.data.cityKey }).subscribe((res: any) => {
            this.areaData.area = res.data ? res.data : [];
          })
        }
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
    params.coordinate1 = String(params.coordinate1).trim();
    params.coordinate2 = String(params.coordinate2).trim();
    this.btnLoading = true;
    this._http.post('api/station', params).subscribe((res: any) => {
      this.btnLoading = false;
      if (res.success) {
        this.msg.success("保存成功");
        // 刷新数据
        this.addOrMoidfy = true
        this.getTableData();
        this.idMark = null;
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
        this._http.get(`api/station/${id}`).subscribe((res: any) => {
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
  modifyInstru() {
    this.modifyInstruForm = this.fb.group({
      name: [null]
    })
    this.showModifyInstru = true;
  }
  configInstru() {
    this.showConfigInstru = true;
  }
  configHelpInstru() {
    this.showConfigHelpInstru = true;
  }
  getRegionManagerList() {
    this._http.get('api/user?opsRegionManager=true').subscribe((res: any) => {
      if (res.success) {
        this.regionManagerList = res.data;
        this.regionManagerListCopy = JSON.parse(JSON.stringify(res.data));
      } else {
        this.msg.error(res.message);
      }
    })
  }
  filterRegionManagerList($event: any) {
    this.regionManagerList = this.regionManagerListCopy.filter((item: any) => {
      if (item.nickname.includes($event)) {
        return true;
      }
      if ((item.pinyin.toUpperCase()).includes($event.toUpperCase())) {
        return true;
      }
      if ((item.jianpin.toUpperCase()).includes($event.toUpperCase())) {
        return true;
      }
      return false;
    })
  }
  getAreaManagerList() {
    this._http.get('api/user?opsAreaManager=true').subscribe((res: any) => {
      if (res.success) {
        this.areaManagerList = res.data;
        this.areaManagerListCopy = JSON.parse(JSON.stringify(res.data));
      } else {
        this.msg.error(res.message);
      }
    })
  }
  filterAreaManagerList($event: any) {
    this.areaManagerList = this.areaManagerListCopy.filter((item: any) => {
      if (item.nickname.includes($event)) {
        return true;
      }
      if ((item.pinyin.toUpperCase()).includes($event.toUpperCase())) {
        return true;
      }
      if ((item.jianpin.toUpperCase()).includes($event.toUpperCase())) {
        return true;
      }
      return false;
    })
  }
  getProjectManagerList() {
    this._http.get('api/user?opsProjectManager=true').subscribe((res: any) => {
      if (res.success) {
        this.projectManagerList = res.data;
        this.projectManagerListCopy = JSON.parse(JSON.stringify(res.data));
      } else {
        this.msg.error(res.message);
      }
    })
  }
  filterProjectManagerList($event: any) {
    this.projectManagerList = this.projectManagerListCopy.filter((item: any) => {
      if (item.nickname.includes($event)) {
        return true;
      }
      if ((item.pinyin.toUpperCase()).includes($event.toUpperCase())) {
        return true;
      }
      if ((item.jianpin.toUpperCase()).includes($event.toUpperCase())) {
        return true;
      }
      return false;
    })
  }
  getCityManagerList() {
    this._http.get('api/user?opsCityManager=true').subscribe((res: any) => {
      if (res.success) {
        this.cityManagerList = res.data;
        this.cityManagerListCopy = JSON.parse(JSON.stringify(res.data));
      } else {
        this.msg.error(res.message);
      }
    })
  }
  filterCityManagerList($event: any) {
    this.cityManagerList = this.cityManagerListCopy.filter((item: any) => {
      if (item.nickname.includes($event)) {
        return true;
      }
      if ((item.pinyin.toUpperCase()).includes($event.toUpperCase())) {
        return true;
      }
      if ((item.jianpin.toUpperCase()).includes($event.toUpperCase())) {
        return true;
      }
      return false;
    })
  }
  getDataManageList() {
    this._http.get('api/user?dataManager=true').subscribe((res: any) => {
      if (res.success) {
        this.dataManageList = res.data;
        this.dataManageListCopy = JSON.parse(JSON.stringify(res.data));
      } else {
        this.msg.error(res.message);
      }
    })
  }
  filterDataManageList($event: any) {
    this.dataManageList = this.dataManageListCopy.filter((item: any) => {
      if (item.nickname.includes($event)) {
        return true;
      }
      if ((item.pinyin.toUpperCase()).includes($event.toUpperCase())) {
        return true;
      }
      if ((item.jianpin.toUpperCase()).includes($event.toUpperCase())) {
        return true;
      }
      return false;
    })
  }
  getAssistantList() {
    this._http.get('api/user?assistant=true').subscribe((res: any) => {
      if (res.success) {
        this.assistantList = res.data;
        this.assistantListCopy = JSON.parse(JSON.stringify(res.data));
      } else {
        this.msg.error(res.message);
      }
    })
  }
  filterAssistantList($event: any) {
    this.assistantList = this.assistantListCopy.filter((item: any) => {
      if (item.nickname.includes($event)) {
        return true;
      }
      if ((item.pinyin.toUpperCase()).includes($event.toUpperCase())) {
        return true;
      }
      if ((item.jianpin.toUpperCase()).includes($event.toUpperCase())) {
        return true;
      }
      return false;
    })
  }
  getOpsList() {
    this._http.get('api/user?ops=true').subscribe((res: any) => {
      if (res.success) {
        this.opsList = res.data;
        this.opsListCopy = JSON.parse(JSON.stringify(res.data));
      } else {
        this.msg.error(res.message);
      }
    })
  }
  filterOpsList($event: any) {
    this.opsList = this.opsListCopy.filter((item: any) => {
      if (item.nickname.includes($event)) {
        return true;
      }
      if ((item.pinyin.toUpperCase()).includes($event.toUpperCase())) {
        return true;
      }
      if ((item.jianpin.toUpperCase()).includes($event.toUpperCase())) {
        return true;
      }
      return false;
    })
  }

  // 获取省市区下拉数据
  getProvinceList() {
    this._http.get('api/org/async').subscribe((res: any) => {
      this.areaData.province = res.data ? res.data : [];
    })
  }
  provinceChange($event: any) {
    // 初始化数据
    if (this.idMark) {
      this.modifyDataForm.get('city').setValue(null);
      this.modifyDataForm.get('districtKey').setValue(null)
    } else {
      this.addDataForm.get('city').setValue(null);
      this.addDataForm.get('districtKey').setValue(null)
    }
    this._http.get('api/org/async', { key: $event }).subscribe((res: any) => {
      this.areaData.city = res.data ? res.data : [];
    })
  }
  cityChange($event: any) {
    if (this.idMark) {
      this.modifyDataForm.get('districtKey').setValue(null)
    } else {
      this.addDataForm.get('districtKey').setValue(null)
    }
    this._http.get('api/org/async', { key: $event }).subscribe((res: any) => {
      this.areaData.area = res.data ? res.data : [];
    })
  }

  // 配置仪器
  // 获取仪器列表
  getInstrumentList() {
    return new Promise((resove, reject) => {
      let params = {

      }
      this._http.post(`api/instrument/list`, params).subscribe((res: any) => {
        if (res.success) {
          this.goodsListCopy = res.data;
          this.initData(res.data);
          resove(void 0);
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
      return item.company_str;
    })))
    this.instrumentList = companyList;
  }
  async config(id: any) {
    this.targetId = id;
    // 初始化数据
    this.queryName = null;
    this.queryCompany = null;
    this.queryVersion = null;
    await this.getInstrumentList();
    this.getSelectedGoodsList();
  }
  // 查询条件变化
  queryChange() {
    this.goodsList.map((item: any) => {
      item.checked = false;
    })
    this.refreshStatus();
  }
  // 全选
  checkAll($event: any) {
    setTimeout(() => {
      this.goodsList.map((item: any) => {
        if (item.name && item.name.includes(this.queryName ? this.queryName : '') &&
          item.company_str && item.company_str.includes(this.queryCompany ? this.queryCompany : '') &&
          item.version && item.version.includes(this.queryVersion ? this.queryVersion : '')) {
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
          item.company_str && item.company_str.includes(this.queryCompany ? this.queryCompany : '') &&
          item.version && item.version.includes(this.queryVersion ? this.queryVersion : '')
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
    this._http.post(`api/station/${this.targetId}/instrument/add`, idList).subscribe((res: any) => {
      $event.target.disabled = false;
      // 刷新已选列表
      this.getSelectedGoodsList();
    })
  }
  // 删除权限
  deleteGoods($event: any) {
    $event.target.disabled = true;
    const idList = this.checkedSelectedGoods.map((item: any) => {
      return item.id;
    })
    this._http.post(`api/station/${this.targetId}/instrument/delete`, idList).subscribe((res: any) => {
      $event.target.disabled = false;
      // 刷新已选列表
      this.getSelectedGoodsList();
    })
  }

  // 获取已配仪器列表
  getSelectedGoodsList() {
    this._http.get(`api/station/${this.targetId}/instrument`).subscribe((res: any) => {
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


  showMapPage: boolean = false;
  mapInstance: any;
  // 经纬度与地址
  mapPosition: any = {
    lng: 0,
    lat: 0,
    hotSpot: ''
  }
  statinInput: string;//map ->input检索字段
  mapIcon = new AMap.Icon({
    image: "../../../assets/tmp/img/eventMapIcon.png",
    size: new AMap.Size(26, 44),
  });
  autoComplete: any = new AMap.Autocomplete();
  geocoder: any = new AMap.Geocoder({
    // city: '010'
  })
  // 地图选址
  getPosition() {
    this.showMapPage = true;
    this.selectPoint = null;
    setTimeout(() => {
      this.mapInstance = new AMap.Map(document.getElementById('mapContainer'), {
        maxZoom: 16,
        minZoom: 5,
      });
      // 新建还是编辑
      if (!this.addOrMoidfy) {
        let position = new AMap.LngLat(this.modifyDataForm.value.coordinate1, this.modifyDataForm.value.coordinate2);
        let currentMarker = new AMap.Marker({
          icon: this.mapIcon,
          position: position,
        });
        this.mapInstance.add(currentMarker);
        this.mapInstance.setCenter(position);
        this.geocoder.getAddress([position.lng, position.lat], (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            this.mapPosition = {
              lng: position.lng,
              lat: position.lat,
              hotSpot: result.regeocode.formattedAddress
            }
          }
        })
      }

      //地图事件
      this.mapInstance.on('click', (e: any) => {
        //清空地图
        this.mapInstance.clearMap();
        let marker = new AMap.Marker({
          icon: this.mapIcon,
          position: e.lnglat,
        });
        this.mapInstance.add(marker);
        this.geocoder.getAddress([e.lnglat.lng, e.lnglat.lat], (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            this.mapPosition.lng = e.lnglat.lng
            this.mapPosition.lat = e.lnglat.lat
            this.mapPosition.hotSpot = result.regeocode.formattedAddress
          }
        })
      });
    })
  }

  confirmMapStation() {
    if (this.addOrMoidfy) {
      this.addDataForm.patchValue({
        coordinate1: this.mapPosition.lng,
        coordinate2: this.mapPosition.lat,
      })
    } else {
      this.modifyDataForm.patchValue({
        coordinate1: this.mapPosition.lng,
        coordinate2: this.mapPosition.lat,
      })
    }

    this.showMapPage = false
  }
  closeShowPage() {
    this.showMapPage = false
  }
  // 地图弹窗关闭
  mapMaskAfterClose() {
    this.mapPosition.lng = 0
    this.mapPosition.lat = 0
    this.mapPosition.hotSpot = ""
  }

  listAddress: any[] = [];
  selectPoint: any;
  // nzFilterOption = () => { return true };
  searchAddress($event: any) {
    if ($event) {
      this.autoComplete.search($event, (status: any, result: any) => {
        setTimeout(() => {
          this.listAddress = result.tips;
        })
      })
    }
  }
  getAddress() {
    if (this.addOrMoidfy) {
      this.addDataForm.patchValue({
        coordinate1: this.selectPoint.location.lng,
        coordinate2: this.selectPoint.location.lat,
      })
    } else {
      this.modifyDataForm.patchValue({
        coordinate1: this.selectPoint.location.lng,
        coordinate2: this.selectPoint.location.lat,
      })
    }

    //绘制点
    this.mapInstance.clearMap();
    let position = new AMap.LngLat(this.selectPoint.location.lng, this.selectPoint.location.lat);

    let marker = new AMap.Marker({
      icon: this.mapIcon,
      position: position,
    });
    this.mapInstance.add(marker);
    this.mapInstance.setCenter(position);
  }
  // 地图inputchange
  stationOnchange(event: any) {
    this.statinInput = event.target.value
  }
  // 地图input框检索
  stationConfirm() {
    this.mapInstance.clearMap();
    let placeSearch: any = new AMap.PlaceSearch({ city: "全国" });
    let that = this
    placeSearch.search(this.statinInput, function (status: any, result: any) {
      let posi = result.poiList.pois[0].location
      let marker = new AMap.Marker({
        icon: that.mapIcon,
        position: posi
      });
      that.mapInstance.add(marker);
      that.mapInstance.setCenter(posi);
      that.geocoder.getAddress([posi.lng, posi.lat], (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          that.mapPosition.lng = posi.lng
          that.mapPosition.lat = posi.lat
          that.mapPosition.hotSpot = result.regeocode.formattedAddress
        }
      })
    })
  }

}



