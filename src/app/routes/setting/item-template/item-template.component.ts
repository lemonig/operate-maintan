import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'item-template',
  templateUrl: './item-template.component.html',
  styleUrls: ['./item-template.component.less']
})
export class ItemTemplateComponent implements OnInit {
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
  frequencyList: any[] = [];
  keyword:any = null;
  // 配置模板
  itemLists: any[] = []; // 项目列表
  isAllCheckedItem = false;
  isIndeterminateItem = false;

  selectedGoodsListItem: any[] = [];
  isIndeterminateItemS = false;
  isAllCheckedItemS = false;

  checkedGoods: any[] = [];
  checkedSelectedGoods: any[] = [];
  queryName: any;
  frequency:any;
  showConfigTemplate = false;
  items: any[] = [];
  templateId: any;
  // 配置站点
  showconfigStation = false;
  // 当前id
  flagId: any;
  // 关键字
  SelectedKeyword = '';
  noSelectKeyword = '';
  // 站点列表
  selectedStations: any[] = [];
  stations: any[] = [];
  // 省市区数据
  areaData: any = {
    province: [],
    city: [],
    area: [],
  }
  province: any;
  city: any;
  area: any;
  // 根据省市区获取站点列表
  // 完整的站点返回列表
  allStations: any = [];
  // 表格选中操作
  // 未选
  isIndeterminate = false;
  isAllChecked = false;
  checkedStation: any[] = [];
  // 已选
  isIndeterminateS = false;
  isAllCheckedS = false;
  checkedStationS: any[] = [];
  userInfo:any;
  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    // 获取频率列表
    this._http.get('api/meta').subscribe((res: any) => {
      if (res.success) {
        this.frequencyList = res.data.opsTaskAssignRate;
      } else {
        this.msg.error(res.message);
      }
    })
    this.getProvinceList();
    this.getTableData();
  }
  // 获取表格数据
  getTableData() {
    const obj = {
      keyword:this.keyword
    }
    this.loading = true;
    this._http.post('api/opstemplate/list',obj).subscribe((res: any) => {
      this.loading = false;
      if (res.success) {
        this.tableData = res.data;
      } else {
        this.msg.error(res.message);
      }
    })
  }
  // 刷新
  refresh() {
    this.getTableData();
  }
  // add
  initAddDataForm() {
    this.addDataForm = this.fb.group({
      name: [null, [Validators.required]],
      assignRate: [null, [Validators.required]],
      intervalDay: [null, [Validators.required]],
    })
  }
  validateForm(name: string) {
    return this.addDataForm.get(name);
  }
  add() {
    // 初始化表单
    this.initAddDataForm()
    this.newDataModal = true;
  }
  handleNewData() {
    for (const i in this.addDataForm.controls) {
      this.addDataForm.controls[i].markAsDirty();
      this.addDataForm.controls[i].updateValueAndValidity();
    }
    if (this.addDataForm.invalid) {
      return;
    }
    this.isOkLoading = true;
    this._http.put('api/opstemplate', this.addDataForm.value).subscribe((res: any) => {
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
  // modify
  initModifyDataForm(id: any) {
    this._http.get(`api/opstemplate/${id}`).subscribe((res: any) => {
      if (res.success) {
        this.modifyDataForm = this.fb.group({
          id: [res.data.id],
          name: [res.data.name, [Validators.required]],
          assignRate: [res.data.assignRate, [Validators.required]],
          intervalDay: [res.data.intervalDay, [Validators.required]],
        })
        this.modifyDataModal = true;
      } else {
        this.msg.error(res.message);
      }
    })
  }
  validateForm1(name: string) {
    return this.modifyDataForm.get(name);
  }
  modifyData(id: any) {
    this.initModifyDataForm(id);
  }
  handleModifyData() {
    for (const i in this.modifyDataForm.controls) {
      this.modifyDataForm.controls[i].markAsDirty();
      this.modifyDataForm.controls[i].updateValueAndValidity();
    }
    if (this.modifyDataForm.invalid) {
      return;
    }
    this.isOkLoading = true;
    this._http.post('api/opstemplate', this.modifyDataForm.value).subscribe((res: any) => {
      this.isOkLoading = false;
      if (res.success) {
        this.modifyDataModal = false;
        // 刷新数据
        this.getTableData();
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
        this._http.delete(`api/opstemplate/${id}`).subscribe((res: any) => {
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
  // 项目查询


  // 获取项目列表
  getItemLists(id: any) {
    this._http.get(`api/opstemplate/${id}/transfer_box`).subscribe((res: any) => {
      if (res.success) {
        res.data.map((item: any) => {
          if (item.selected) {
            item.direction = 'right';
          } else {
            item.direction = 'left';
          }
        })
        this.itemLists = res.data;
        this.cleanCheck();
        this.showConfigTemplate = true;
      } else {
        this.msg.error(res.message);
      }
    })
  }
  // transfer
  change($event: any) {
    $event.list.map((item: any) => {
      item.direction = $event.to;
    })
  }

  queryChange() {
    this.itemLists.map((item: any) => {
      if(item.direction != "right" && item.title.includes(this.queryName ? this.queryName : '') && item.frequencyTitle.includes(this.frequency ? this.frequency : '')){
        item.direction="left";
      }else if(item.direction == "right"){
        item.direction = "right";
      }else if(this.queryName==''&& this.frequency=='' &&  item.direction!="right"){
        item.direction = "left"
      }else{
        item.direction="";
      }
    })
    this.refreshStatus();
  }


  // 全选
  checkAllItem($event: any) {
    setTimeout(() => {
      this.itemLists.map((item: any) => {
        if (item.title && item.title.includes(this.queryName ? this.queryName : '')&&item.frequencyTitle && item.frequencyTitle.includes(this.frequency ? this.frequency : '') && item.direction == "left"){
          item.checked = $event;
        }
      })
    });
    this.refreshStatusItem();
  }

  refreshStatusItem() {
    setTimeout(() => {
      this.checkedGoods = this.itemLists.filter((item: any) => {
        if(item.direction == "left" && item.checked){
          return item.checked;
        }
      })
      const showList = this.itemLists.filter((item: any) => {
        return (item.title && item.title.includes(this.queryName ? this.queryName : '')
         &&item.frequencyTitle && item.frequencyTitle.includes(this.frequency ? this.frequency : '')
         && item.direction == "left");
      })
      this.isAllCheckedItem = (showList.length == this.checkedGoods.length) && showList.length !== 0;
      this.isIndeterminateItem = (showList.length !== this.checkedGoods.length) && this.checkedGoods.length !== 0;
    });
  }

  checkAllItemS($event: boolean) {
    this.itemLists.map((item: any) => {
      if (item.direction == "right") {
        item.checked = $event;
      }
    this.refreshStatusItemS();
  });
  }

  refreshStatusItemS() {
    setTimeout(() => {
      this.checkedSelectedGoods = this.itemLists.filter((item: any) => {
        if (item.direction == "right" && item.checked) {
            return item;
        }
      })
      const rigthList = this.itemLists.filter((item: any) => {
        if (item.direction == "right") {
          return item;
        }
      })
      this.isAllCheckedItemS = (rigthList.length == this.checkedSelectedGoods.length) && rigthList.length !== 0;
      this.isIndeterminateItemS = (rigthList.length !== this.checkedSelectedGoods.length) && this.checkedSelectedGoods.length !== 0;
    });
  }

  config(id: any) {
    this.templateId = id;
    // 获取项目列表
    this.getItemLists(id);
  }

  cleanCheck(){
    this.checkedGoods = [];
    this.checkedSelectedGoods = [];
    this.isAllCheckedItem=false;
    this.isIndeterminateItem=false;
    this.isIndeterminateItemS=false;
    this.isAllCheckedItemS=false;
    this.queryName="";
    this.frequency = "";
  }

  saveAddTem(num : any) {
    const opsItemList = [];
    if(num==1){
      this.itemLists.map((item: any) => {
        if (item.direction == 'right') {
          opsItemList.push(item.id);
        }
        if(item.direction == 'left' && item.checked){
          opsItemList.push(item.id);
        }
      })
    }
    if(num==2){
      this.itemLists.map((item: any) => {
        if (item.direction == 'right' && !item.checked) {
          opsItemList.push(item.id);
        }
      })
    }
    this.isOkLoading = true;
    this._http.post(`api/opstemplate/${this.templateId}/transfer_box`, opsItemList).subscribe((res: any) => {
      this.isOkLoading = false;
      if (res.success) {
        this.getItemLists(this.templateId);
        this.cleanCheck();
        this.msg.success('保存成功');
      } else {
        this.msg.error(res.message);
      }
    })
  }
  configStation(id: any) {
    this.flagId = id;
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
    this.getSelectedStation()
    this.showconfigStation = true;
  }
  getSelectedStation() {
    this._http.get(`api/opstemplate/${this.flagId}/station`).subscribe((res: any) => {
      this.selectedStations = res.data ? res.data : [];
      // 刷新状态
      this.refreshStatusS()
      // 过滤数据
      this.filterStations();
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
      templateId: this.flagId,
    }
    this._http.post(`api/opstemplate/station`, obj).subscribe((res: any) => {
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
      templateId: this.flagId,
    }
    this._http.post(`api/opstemplate/station/delete`, obj).subscribe((res: any) => {
      $event.target.disabled = false;
      // 刷新已选列表
      this.getSelectedStation();
    })
  }
}
