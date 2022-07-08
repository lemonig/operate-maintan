import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
declare var AMap: any;
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.less']
})
export class MapComponent implements OnInit {

  constructor(
    public _http: _HttpClient,
    public msg: NzMessageService,
  ) {
    this.systemBelong = localStorage.getItem('footerMessage');
  }
@ViewChild('mapContainer', { static: false }) container: ElementRef;
  systemBelong: any;
  map: any;
  mapMode: any;
  traceDay:any = new Date(new Date().getTime() - 1 * 24 * 3600 * 1000);
  opsList: any[] = [];
  opsListCopy: any[] = [];
  tableData: any;
  factorList: any[] = [];
  // 点击marker
  infoWindow: any = new AMap.InfoWindow({
    offset: new AMap.Pixel(0, -30)
  });
  ngOnInit() {

  }

  select(){
    this.getMapData();
  }
  nzFilterOption = () => { true };
  getOpsList() {
    this._http.get('api/car/simple').subscribe((res: any) => {
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
      if (item.car_num.includes($event)) {
        return true;
      }
      if (item.imei.includes($event)) {
        return true;
      }
      /*
      if ((item.pinyin.toUpperCase()).includes($event.toUpperCase())) {
        return true;
      }
      if ((item.jianpin.toUpperCase()).includes($event.toUpperCase())) {
        return true;
      } */
      return false;
    })
  }
  ngAfterViewInit() {
    this.getOpsList();
    this.map = new AMap.Map(this.container.nativeElement);
    this.getMapData();
    this.getStationData();
  }
  getStationData() {
    this._http.get(`api/station/list`).subscribe((res: any) => {
      if (res.success) {
        this.tableData = res.data;
        // 绘制marker
        this.drawStation();

      } else {
        this.msg.error(res.message);
      }
    })
  }

  // 获取地图数据
  getMapData() {
    const params = {
      imei:this.mapMode,
      day:this.traceDay
    };
    this._http.post(`api/car/trace`, params).subscribe((res: any) => {
      if (res.success) {
        this.tableData = res.data;
        // 绘制marker
        this.drawMarker(this.tableData);

      } else {
        this.msg.error(res.message);
      }
    })
  }
  lineArr:any[] = [];
 polyline = new AMap.Polyline({
            isOutline: true,
            outlineColor: '#ffeeff',
            borderWeight: 3,
            strokeColor: "#3366FF",
            strokeOpacity: 1,
            strokeWeight: 6,
            // 折线样式还支持 'dashed'
            strokeStyle: "solid",
            // strokeStyle是dashed时有效
            strokeDasharray: [10, 5],
            lineJoin: 'round',
            lineCap: 'round',
            zIndex: 50,
        })
        carIcon = new AMap.Icon({
            // 图标尺寸
            type: 'image',
            image: 'https://webapi.amap.com/images/car.png',
            size: [30, 60],
            imageSize: new AMap.Size(40, 30),
            anchor: 'bottom-center',
            //imageOffset: new AMap.Pixel(4, 10)
        });
carMarker = new AMap.Marker({
        map: this.map,
        icon: this.carIcon,
        offset: new AMap.Pixel(-26, -13),
        autoRotation: true,
        angle:-90,
    });

 passedPolyline = new AMap.Polyline({
        map: this.map,
        // path: lineArr,
        strokeColor: "#AF5",  //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6,      //线宽
        // strokeStyle: "solid"  //线样式
    });
  startAnimation () {
        this.carMarker.moveAlong(this.lineArr, 6000);
    }

     pauseAnimation () {
        this.carMarker.pauseMove();
    }

     resumeAnimation () {
        this.carMarker.resumeMove();
    }

     stopAnimation () {
        this.carMarker.stopMove();
    }
  // 绘制marker
  drawMarker(list: any) {
    // 清空地图
    //this.map.clearMap();
//        [[118.972969,29.009591],[118.971778,29.00924],[118.97096,29.008578],[118.970089,29.007524],[118.969351,29.007051],[118.968178,29.006442],[118.967289,29.005391],[118.965893,29.004847],[118.964382,29.004222],[118.963093,29.003349],[118.962089,29.002729],[118.961156,29.002229],[118.96016,29.001313],[118.959502,29.000029],[118.958773,28.998822],[118.95776,28.997702],[118.956791,28.996636],[118.955716,28.995447],[118.954738,28.994378],[118.953831,28.993364],[118.95288,28.992313],[118.951938,28.991244],[118.950924,28.990144],[118.950169,28.989573],[118.948747,28.989096],[118.947182,28.988622],[118.945627,28.988131],[118.944062,28.987647],[118.942524,28.987147],[118.941324,28.986738],[118.940098,28.986358],[118.938853,28.986084]];
        const that = this;
        if(list.carTraceList == null){
          this.map.remove(this.carMarker);
          this.map.remove(this.polyline);
        }
        let path = list.carTraceList;

    AMap.convertFrom(path, 'gps', function (status, result) {
      if (result.info === 'ok') {
        path = result.locations; // Array.<LngLat>
        that.polyline.setPath(path);
        that.polyline.setMap(that.map);
        that.carMarker.setPosition(path[0]);
        /* that.carMarker.on('moving', function (e) {
                that.passedPolyline.setPath(e.passedPath);
            }); */
        that.lineArr = path;

        that.map.add(that.carMarker);
        // 缩放地图到合适的视野级别
        that.map.setFitView([ that.polyline ])
      }
    });

  }
  taskList:any[] = [];
  opsTaksList:any[] = [];
  getTask(item:any){
    let param = {
      stationId:item.id,
      startDate:this.traceDay
    }
    this._http.post(`api/statistics/dayTask`, param).subscribe((res: any) => {
      if (res.success) {
        this.taskList = res.data.taskList;
        this.opsTaksList = res.data.opsList;
      } else {
        this.msg.error(res.message);
      }
    })
  }
  drawStation(){
    const carNearStation = this.tableData;
      // 创建一个 Icon
        var startIcon = new AMap.Icon({
            // 图标尺寸
            type: 'image',
            image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
            size: [30, 30],
            imageSize: new AMap.Size(10, 15),
            anchor: 'bottom-center',
            imageOffset: new AMap.Pixel(4, 10)
        });
    const icon = {
                type: 'image',
                image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
                size: [6, 9],
                anchor: 'bottom-center',
            };
    //const circles = [];
    var markers = [];
    for(let i = 0;i<carNearStation.length;i++){
      /* const circle = new AMap.Circle({
              center: [carNearStation[i].coordinate1, carNearStation[i].coordinate2],
              radius: 3000, // 半径
              borderWeight: 3,
              strokeColor: "#FF33FF",
              strokeOpacity: 0.2,
              strokeWeight: 6,
              fillOpacity: 0.4,
              strokeStyle: 'dashed',
              strokeDasharray: [10, 10],
              // 线样式还支持 'dashed'
              fillColor: '#1791fc',
              zIndex: 50,
      });
      circles.push(circle); */
      var labelContent = "<div>"+carNearStation[i].name+"</div>"
      var marker = new AMap.Marker({
                  position: new AMap.LngLat(carNearStation[i].coordinate1, carNearStation[i].coordinate2),
                  icon:startIcon
              });
      //存储数据
      marker.params = carNearStation[i];
      //添加点击事件
      marker.on('mouseover', (e: any) => {
        this.markerClick(e);
      });

      marker.on('mouseout', (e: any) => {
        this.markerClose(e);
      });

       //marker.emit('click', {target: marker});

    markers.push(marker);
    }

    //this.map.add(circles);
    this.map.add(markers);
  }
  markerClose(e:any){
    //this.circle.hide( );
  }
  circle = new AMap.Circle({
          radius: 3000, // 半径
          borderWeight: 3,
          strokeColor: "#FF33FF",
          strokeOpacity: 0.2,
          strokeWeight: 6,
          fillOpacity: 0.4,
          strokeStyle: 'dashed',
          strokeDasharray: [10, 10],
          // 线样式还支持 'dashed'
          fillColor: '#1791fc',
          zIndex: 50,
  });
  markerClick(e: any) {
    var data: any = e.target.params;
    this.getTask(data);
    // 获取数据
    var html = `<div class="info_warp">
      <div class="info_title">${data.name!=null?data.name:""}</div>

	   `;
     if(this.taskList!=null){
        html = html+`<div class="info_body">该日解决异常任务数：`+this.taskList.length+`</div>`;
       for(var i=1;i<=this.taskList.length;i++){
         html = html+`<div class="info_body">异常任务`+i+`：`;
         html = html+`${this.taskList[i-1].content!=null?this.taskList[i-1].content:""}</div>`;
         html = html+`<div class="info_body">原因：${this.taskList[i-1].reason!=null?this.taskList[i-1].reason:""}</div>`
         html = html+`<div class="info_body">解决办法：${this.taskList[i-1].solution!=null?this.taskList[i-1].solution:""}</div>`;
       }
     }
     if(this.opsTaksList!=null){
       html = html+`<div class="info_body">该日完成该站巡检任务数：`+this.opsTaksList.length+`</div>`;
     }
     html = html+`</div>`;
     this.circle.setCenter(new AMap.LngLat(data.coordinate1, data.coordinate2),);
     this.map.add(this.circle);
    this.infoWindow.setContent(html);
    this.infoWindow.open(this.map, e.target.getPosition());
  }


  changeMode($event: any) {
    this.drawMarker(this.tableData);
  }

  getColorClass(wtLevel: any) {
    if (wtLevel == 1) {
      return 'level1';
    }
    if (wtLevel == 2) {
      return 'level2';
    }
    if (wtLevel == 3) {
      return 'level3';
    }
    if (wtLevel == 4) {
      return 'level4';
    }
    if (wtLevel == 5) {
      return 'level5';
    }
    if (wtLevel == 6) {
      return 'level6';
    }
    // 无水质类别
    return 'noLevel';
  }

  getAlarmColorClass(wtLevel: any) {
    if (wtLevel == 1) {
      return 'alarm1';
    }
    if (wtLevel == 2) {
      return 'alarm2';
    }
    if (wtLevel == 3) {
      return 'alarm3';
    }
    if (wtLevel == 4) {
      return 'alarm4';
    }
    if (wtLevel == 5) {
      return 'alarm5';
    }
    if (wtLevel == 6) {
      return 'alarm6';
    }
    // 无水质类别
    return 'noLevel';
  }
  getLevelString(level: any) {
    if (level == 1) {
      return '固定';
    }
    if (level == 2) {
      return '流动';
    }
    if (level == 3) {
      return '观察';
    }
    if (level == 4) {
      return 'Ⅳ';
    }
    if (level == 5) {
      return 'Ⅴ';
    }
    if (level == 6) {
      return '劣Ⅴ';
    }
    return "无";
  }

getAlarmString(level: any) {
    if (level == 1) {
      return '正常';
    }
    if (level == 2) {
      return '低风险';
    }
    if (level == 3) {
      return '高风险';
    }
    if (level == 4) {
      return 'Ⅳ';
    }
    if (level == 5) {
      return 'Ⅴ';
    }
    if (level == 6) {
      return '劣Ⅴ';
    }
    return "无";
  }
}
