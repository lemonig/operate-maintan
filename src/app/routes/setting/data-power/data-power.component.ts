import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'data-power',
  templateUrl: './data-power.component.html',
  styleUrls: ['./data-power.component.css']
})
export class DataPowerComponent implements OnInit {
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
  // 查询条件
  searchQuery: any = {
    keyword: null,
  }
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
  userId: any;
  flag: number;

  // 配置运维站点
  showconfigStation = false;


  // 根据省市区获取站点列表
  // 完整的站点返回列表
  allStations: any = [];

  noSelectKeyword: any = '';
  SelectedKeyword: any = '';
userInfo:any;
  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.getProvinceList();
    this.getTableData();
  }
  getTableData() {
    const obj: any = {
      // dataManager: true,
    };
    if (this.searchQuery.keyword) {
      obj.nickname = this.searchQuery.keyword;
    }
    this.loading = true;
    this._http.get('api/user', obj).subscribe((res: any) => {
      this.loading = false;
      if (res.success) {
        // this.tableData = res.data ? res.data : [];
        // 过滤数据
        if (res.data) {
          this.tableData = res.data.filter((item: any) => {
            return item.ops || item.opsRegionManager || item.opsCityManager || item.dataManager || item.assistant || item.opsAreaManager || item.projectManager;
          })
        } else {
          this.tableData = [];
        }
      } else {
        this.tableData = [];
        this.msg.error(res.message);
      }
    })
  }
  // 刷新表格数据
  refresh() {
    this.getTableData();
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
    this.userId = id;
    // 初始化站点数据
    this.stations = [];
    this.selectedStations = [];
    this.SelectedKeyword = '';
    this.noSelectKeyword = '';
    // 初始化省份
    this.province = this.areaData.province[0].key;
    this.city = null;
    this.area = null;
    this.areaData.city = [];
    this.areaData.area = [];
    this.provinceChange(this.province);

    if (num == 1) {
      this.getSelectedStation1()
    }
    if (num == 2) {
      this.getSelectedStation2()
    }
    if (num == 3) {
      this.getSelectedStation3()
    }
    if (num == 4) {
      this.getSelectedStation4()
    }
    if (num == 5) {
      this.getSelectedStation5()
    }
    if (num == 6) {
      this.getSelectedStation6()
    }
    if (num == 7) {
      this.getSelectedStation7()
    }
    this.showconfigStation = true;
  }
  // 获取运维已选站点
  getSelectedStation1() {
    this._http.get(`api/station/ops/${this.userId}`).subscribe((res: any) => {
      this.selectedStations = res.data ? res.data : [];
      // 刷新状态
      this.refreshStatusS()
      // 过滤数据
      this.filterStations();
    })
  }
  // 获取地级负责人已选站点
  getSelectedStation2() {
    this._http.get(`api/station/citymanager/${this.userId}`).subscribe((res: any) => {
      this.selectedStations = res.data ? res.data : [];
      // 刷新状态
      this.refreshStatusS()
      // 过滤数据
      this.filterStations();
    })
  }
  // 获取省级负责人已选站点
  getSelectedStation3() {
    this._http.get(`api/station/regionmanager/${this.userId}`).subscribe((res: any) => {
      this.selectedStations = res.data ? res.data : [];
      // 刷新状态
      this.refreshStatusS()
      // 过滤数据
      this.filterStations();
    })
  }
  // 获取数据管理员已选站点
  getSelectedStation4() {
    this._http.get(`api/station/datamanager/${this.userId}`).subscribe((res: any) => {
      this.selectedStations = res.data ? res.data : [];
      // 刷新状态
      this.refreshStatusS()
      // 过滤数据
      this.filterStations();
    })
  }
  // 获取运维助理已选站点
  getSelectedStation5() {
    this._http.get(`api/station/assistant/${this.userId}`).subscribe((res: any) => {
      this.selectedStations = res.data ? res.data : [];
      // 刷新状态
      this.refreshStatusS()
      // 过滤数据
      this.filterStations();
    })
  }
  // 获取地区负责人已选站点
  getSelectedStation6() {
    this._http.get(`api/station/areamanager/${this.userId}`).subscribe((res: any) => {
      this.selectedStations = res.data ? res.data : [];
      // 刷新状态
      this.refreshStatusS()
      // 过滤数据
      this.filterStations();
    })
  }
  // 获取项目负责人已选站点
  getSelectedStation7() {
    this._http.get(`api/station/projectmanager/${this.userId}`).subscribe((res: any) => {
      this.selectedStations = res.data ? res.data : [];
      // 刷新状态
      this.refreshStatusS();
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
      userId: this.userId,
    }
    if (this.flag == 1) {
      this._http.post(`api/station/auth/ops`, obj).subscribe((res: any) => {
        $event.target.disabled = false;
        // 刷新已选列表
        this.getSelectedStation1();
      })
    }
    if (this.flag == 2) {
      this._http.post(`api/station/auth/citymanager`, obj).subscribe((res: any) => {
        $event.target.disabled = false;
        // 刷新已选列表
        this.getSelectedStation2();
      })
    }
    if (this.flag == 3) {
      this._http.post(`api/station/auth/regionmanager`, obj).subscribe((res: any) => {
        $event.target.disabled = false;
        // 刷新已选列表
        this.getSelectedStation3();
      })
    }
    if (this.flag == 4) {
      this._http.post(`api/station/auth/datamanager`, obj).subscribe((res: any) => {
        $event.target.disabled = false;
        // 刷新已选列表
        this.getSelectedStation4();
      })
    }
    if (this.flag == 5) {
      this._http.post(`api/station/auth/assistant`, obj).subscribe((res: any) => {
        $event.target.disabled = false;
        // 刷新已选列表
        this.getSelectedStation5();
      })
    }
    if (this.flag == 6) {
      this._http.post(`api/station/auth/areamanager`, obj).subscribe((res: any) => {
        $event.target.disabled = false;
        // 刷新已选列表
        this.getSelectedStation6();
      })
    }
    if (this.flag == 7) {
      this._http.post(`api/station/auth/projectmanager`, obj).subscribe((res: any) => {
        $event.target.disabled = false;
        // 刷新已选列表
        this.getSelectedStation7();
      })
    }
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
      userId: this.userId,
    }
    if (this.flag == 1) {
      this._http.post(`api/station/auth/ops/delete`, obj).subscribe((res: any) => {
        $event.target.disabled = false;
        // 刷新已选列表
        this.getSelectedStation1();
      })
    }
    if (this.flag == 2) {
      this._http.post(`api/station/auth/citymanager/delete`, obj).subscribe((res: any) => {
        $event.target.disabled = false;
        // 刷新已选列表
        this.getSelectedStation2();
      })
    }
    if (this.flag == 3) {
      this._http.post(`api/station/auth/regionmanager/delete`, obj).subscribe((res: any) => {
        $event.target.disabled = false;
        // 刷新已选列表
        this.getSelectedStation3();
      })
    }
    if (this.flag == 4) {
      this._http.post(`api/station/auth/datamanager/delete`, obj).subscribe((res: any) => {
        $event.target.disabled = false;
        // 刷新已选列表
        this.getSelectedStation4();
      })
    }
    if (this.flag == 5) {
      this._http.post(`api/station/auth/assistant/delete`, obj).subscribe((res: any) => {
        $event.target.disabled = false;
        // 刷新已选列表
        this.getSelectedStation5();
      })
    }
    if (this.flag == 6) {
      this._http.post(`api/station/auth/areamanager/delete`, obj).subscribe((res: any) => {
        $event.target.disabled = false;
        // 刷新已选列表
        this.getSelectedStation6();
      })
    }
    if (this.flag == 7) {
      this._http.post(`api/station/auth/projectmanager/delete`, obj).subscribe((res: any) => {
        $event.target.disabled = false;
        // 刷新已选列表
        this.getSelectedStation7();
      })
    }
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
}
