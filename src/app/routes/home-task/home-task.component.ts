import { Component, OnInit, HostListener } from '@angular/core';
import { FullContentService } from '@delon/abc';
import * as screenfull from 'screenfull';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import * as moment from 'moment';
import { NzIconModule } from 'ng-zorro-antd/icon';
@Component({
  selector: 'app-home-task',
  templateUrl: './home-task.component.html',
  styleUrls: ['./home-task.component.less']
})
export class HomeTaskComponent implements OnInit {

  constructor(private fullContentService: FullContentService,
  private _http: _HttpClient,
  private msg: NzMessageService,
  private fb: FormBuilder,
  private modal: NzModalService,) { }

  ngOnInit() {
    this.getTaskMate();
    this.getTableData();
    this.getReadList();
    this.getChangeList();
    this.getTaskAge();
    this.getTaskWords();
  }
  colorList1: any[] = [
      '#1C47BF', '#DA4688', '#14BA87', '#DB5230',
      '#9161F3', '#1085E5', '#A7198C', '#1D7733',
      '#432585', '#958310', '#931515', '#FFD666',
      '#BAE637', '#73D13D', '#5CDBD3', '#69C0FF',
      '#85A5FF', '#B37FEB', '#FF85C0', '#A8071A',
      '#AD6800', '#5B8C00', '#006D75', '#0050B3',
    ];
    taskStatistics:any = {
      dealType: 0,
      endTimePie: {},
      moreRead: 0,
      overDoPercentage: 0,
      overEndPercentage: 0,
      overtimePercentage: 0,
      productCaused: 0,
      taskCompanyInstument: 0,
      taskCompletion: 0,
      taskCompletion2: 0,
      taskCount: 0,
      taskInstrumentCount: 0,
      taskInstrumentList: [],
      taskReadList: 0,
      taskStationCountList: [],
      taskStationFrequency: 0,
      taskUnitCount: 0,
      taskUnitList: [],
      terminationCount: 0,
      readCount:0
    };
    taskInstrumentCompanyList:Array<{ name: string; value: number; label: string; [key: string]: string | number }>=[{name:"",value:0,label:""}]
    showInstrumentCompanyList:Array<{ name: string; value: number; label: string; [key: string]: string | number }> = [
    ...this.taskInstrumentCompanyList
  ];
    powerList:any[]= [
     { label: '省级管理', value: 'is_ops_region_manager' ,checked: true},
     { label: '市级管理', value: 'is_ops_city_manager',checked: true },
     { label: '数据管理', value: 'is_datamanager' },];
    doubleBar:any;
    taskUnit:any;
    taskInstrument:any;
    endTimePie:any;
    taskMate:any[] = [];
    taskRead:any;
    taskChange:any;
    taskAge:any;
    taskWord1:any;
    taskWord2:any;
    taskWord3:any;
    taskWord4:any;
    taskStationFrequency:any;
    taskCompanyInstument:any;
    regionKey1:any;
    regionKey2:any;
    regionKey3:any;
    regionKey4:any;
    regionKey5:any;
    regionKey6:any;
    regionKey7:any;
    startYear:any = new Date();
    dateRange: any[] = [new Date(new Date().getTime() - 30 * 24 * 3600 * 1000), new Date()];
    dateRange2:any[] = [new Date(new Date().getTime() - 30 * 24 * 3600 * 1000), new Date()];
    dateRange3:any[] = [new Date(new Date().getTime() - 30 * 24 * 3600 * 1000), new Date()];
    instrmentTable:boolean = false;
    getTableData() {
      let param = {
        startYear:this.startYear?moment(this.startYear).format('YYYY-MM-DD') : null,
      }
    this._http.post(`api/task/statistics`,param).subscribe((res: any) => {
          if (res.success) {
            this.taskStatistics = res.data;
            this.doubleBar = this.drawDoubleBar(res.data.taskStationCountList,["站点","异常任务","异常站点"]);
            this.taskUnit = this.drawUnitPieChart(res.data.taskUnitList);
            this.taskInstrument= this.drawInstrumentChart(res.data.taskInstrumentList,20,true);
            this.getInstrumentMate(res.data.taskInstrumentList)
            this.endTimePie = this.drawTimePieChart(res.data.endTimePie);
            this.taskCompanyInstument = this.drawInstrumentChart(res.data.taskCompanyInstument,30,false);
            this.taskStationFrequency = this.drawInstrumentChart(res.data.taskStationFrequency,5,false);
          } else {
            this.msg.error(res.message);
          }
        })
    }

    getTaskMate() {
      let param = {
        startYear:this.startYear?moment(this.startYear).format('YYYY-MM-DD') : null
      }
    this._http.post(`api/task/statistics/mate`,param).subscribe((res: any) => {
          if (res.success) {
            this.taskMate = res.data;
          } else {
            this.msg.error(res.message);
          }
        })
    }
    onChangeYear(result: Date){
      this.getTaskMate();
      this.getTableData();
      this.getReadList();
      this.getChangeList();
      this.getTaskAge();
      this.getTaskWords();
    }
    getTaskAge(){
      let param = {
        startDate: this.dateRange3.length ? moment(this.dateRange[0]).format('YYYY-MM-DD') : null,
        endDate: this.dateRange3.length ? moment(this.dateRange[1]).format('YYYY-MM-DD') : null,
        orgKey:this.regionKey7,
        startYear:this.startYear?moment(this.startYear).format('YYYY-MM-DD') : null,
      }
      this._http.post(`api/task/statistics/age`,param).subscribe((res: any) => {
            if (res.success) {
              this.taskAge= this.drawTaskAgeBar(res.data);
            } else {
              this.msg.error(res.message);
            }
          })
    }
    getTaskWords(){
      let param = {
        startYear:this.startYear?moment(this.startYear).format('YYYY-MM-DD') : null
      }
      this._http.post(`api/task/statistics/words`,param).subscribe((res: any) => {
            if (res.success) {
              let data1  = res.data.filter(item=>item.count==1);
              this.taskWord1 = this.drawInstrumentChart(data1,20,false);
              let data2  = res.data.filter(item=>item.count==2);
              this.taskWord2 = this.drawInstrumentChart(data2,20,false);
              let data3  = res.data.filter(item=>item.count==3);
              this.taskWord3 = this.drawInstrumentChart(data3,20,false);
              let data4  = res.data.filter(item=>item.count==4);
              this.taskWord4 = this.drawInstrumentChart(data4,20,false);
            } else {
              this.msg.error(res.message);
            }
          })
    }
    getNewDraw(choose:any){
      let param = {
        startYear:this.startYear?moment(this.startYear).format('YYYY-MM-DD') : null,
        orgKey:null
      }
      if(choose==1){
        param.orgKey = this.regionKey1
        this._http.post(`api/task/statistics/time`,param).subscribe((res: any) => {

              if (res.success) {
                this.endTimePie = this.drawTimePieChart(res.data);
                this.endTimePieChart.setOption(this.endTimePie);
              } else {
                this.msg.error(res.message);
              }
            })
      }
      if(choose==2){
        param.orgKey = this.regionKey2
        this._http.post(`api/task/statistics/unit`,param).subscribe((res: any) => {

              if (res.success) {

               this.taskUnit = this.drawUnitPieChart(res.data);
               this.taskUnitChart.setOption(this.taskUnit);
              } else {
                this.msg.error(res.message);
              }
            })
      }
      if(choose==3){
        this.getInstrumentCompanyList(null,40);
      }
      if(choose==4){
        param.orgKey = this.regionKey4
        this._http.post(`api/task/statistics/company`,param).subscribe((res: any) => {
              if (res.success) {
                this.taskCompanyInstument= this.drawInstrumentChart(res.data,30,false);
                this.taskCompanyInstumentChart.setOption(this.taskCompanyInstument);
              } else {
                this.msg.error(res.message);
              }
            })
      }
      if(choose==5){
        param.orgKey = this.regionKey5
        this._http.post(`api/task/statistics/frequency/`,param).subscribe((res: any) => {
              if (res.success) {
                this.taskStationFrequency= this.drawInstrumentChart(res.data,5,false);
                this.taskStationFrequencyChart.setOption(this.taskStationFrequency);
              } else {
                this.msg.error(res.message);
              }
            })
      }
      if(choose==6){
        this.getChangeList();
        this.taskChangeChart.setOption(this.taskChange);
      }if(choose==7){
        this.getTaskAge();
        this.taskAgeChart.setOption(this.taskAge);
      }
    }
    sortName:any;
    sortValue:any;
    changeType(){
      if(this.instrmentTable){
        this.instrmentTable = false;
      }else{
        this.instrmentTable = true;
      }
    }
    sort(sort: { key: string; value: string }): void {
        this.sortName = sort.key;
        this.sortValue = sort.value;
        this.instrumentSearch();
      }
    listOfName:any[]= [];
    listOfCompany:Array<{ text: string; value: any;}>= [];
    listOfSearchName:any[] = [];
    listOfSearchCompany:any[] = [];
    filter(names: string[], companys: string[]): void {
        this.listOfSearchName = names;
        this.listOfSearchCompany = companys;
        this.instrumentSearch();
      }
      instrumentSearch(){
        /** filter data **/
        const filterFunc = (item: { name: string; value: number; label: string }) =>
        (this.listOfSearchCompany.length ? this.listOfSearchCompany.some(label => item.label.indexOf(label) !== -1) : true) &&
          (this.listOfSearchName.length ? this.listOfSearchName.some(name => item.name.indexOf(name) !== -1) : true)
      const data = this.taskInstrumentCompanyList.filter(item => filterFunc(item));
      /** sort data **/
      if (this.sortName && this.sortValue) {
            this.showInstrumentCompanyList = data.sort((a, b) =>{
              if(this.sortValue === 'ascend'){
                if(a[this.sortName!] > b[this.sortName!]){
                  return 1
                }else{
                  return -1;
                }
              }else{
                if(b[this.sortName!] > a[this.sortName!]){
                  return 1;
                }else{
                  return -1;
                }
              }
            })
          } else {
            this.showInstrumentCompanyList = data;
          }
      }
    getReadList(){
      let checkedList = this.powerList.filter(item=>{
          return item.checked
      }).map(item=>{
          return item.value
      })
      let param = {
        startDate: this.dateRange.length ? moment(this.dateRange[0]).format('YYYY-MM-DD') : null,
        endDate: this.dateRange.length ? moment(this.dateRange[1]).format('YYYY-MM-DD') : null,
        checkedList:checkedList,
        startYear:this.startYear?moment(this.startYear).format('YYYY-MM-DD') : null,
      }
      this._http.post(`api/task/statistics/read`,param).subscribe((res: any) => {
            if (res.success) {
              this.taskRead= this.drawDoubleBar(res.data,["阅读数","异常任务数"]);
            } else {
              this.msg.error(res.message);
            }
          })
    }
    getChangeList(){
      let param = {
        startDate: this.dateRange2.length ? moment(this.dateRange2[0]).format('YYYY-MM-DD') : null,
        endDate: this.dateRange2.length ? moment(this.dateRange2[1]).format('YYYY-MM-DD') : null,
        orgKey:this.regionKey6,
        startYear:this.startYear?moment(this.startYear).format('YYYY-MM-DD') : null
      }
      this._http.post(`api/task/statistics/change`,param).subscribe((res: any) => {
            if (res.success) {
              this.taskChange= this.drawTaskChangeLine(res.data);
            } else {
              this.msg.error(res.message);
            }
          })
    }
    getInstrumentCompanyList(keyword:any,long:any){
      let param = {
        orgKey:this.regionKey3,
        keyword:keyword,
        startYear:this.startYear?moment(this.startYear).format('YYYY-MM-DD') : null
      }
      this._http.post(`api/task/statistics/instrument`,param).subscribe((res: any) => {
            if (res.success) {
              this.getInstrumentMate(res.data);
              this.taskInstrument= this.drawInstrumentChart(res.data,long,true);
              this.taskInstrumentChart.setOption(this.taskInstrument);
            } else {
              this.msg.error(res.message);
            }
          })
    }
    getInstrumentMate(data:any){
      this.taskInstrumentCompanyList = data;
      let only = Array.from(new Set(this.taskInstrumentCompanyList.map(item=>item.name)));
      let only2 = Array.from(new Set(this.taskInstrumentCompanyList.map(item=>item.label)));

      this.listOfName = only.map(item=>{ return {text:item,value:item}})
      this.listOfCompany = only2.map(item=>{ return {text:item,value:item}})
      this.instrumentSearch();
    }
    endTimePieChart:any;
    onChart1($event:any){
      this.endTimePieChart = $event;
    }
    taskInstrumentChart:any;
    onChart3($event:any){
      this.taskInstrumentChart = $event;
    }
    taskCompanyInstumentChart:any;
    onChart5($event:any){
      let that = this;
      this.taskCompanyInstumentChart = $event;
      this.taskCompanyInstumentChart.on('mouseover', function (params) {
         that.getInstrumentCompanyList(params.data[1],100);
      });
      this.taskCompanyInstumentChart.on('mouseout', function (params) {
        that.getInstrumentCompanyList(null,20);
      });
    }
    taskStationFrequencyChart:any;
    onChart6($event:any){
      this.taskStationFrequencyChart = $event;
    }
    taskUnitChart:any;
    onChart2($event:any){
      this.taskUnitChart = $event;
    }
    taskReadChart:any;
    onChart4($event:any){
      this.taskReadChart = $event;
    }
    taskChangeChart:any;
    onChart7($event:any){
      this.taskChangeChart = $event;
    }
    taskAgeChart:any;
    onChart8($event:any){
      this.taskAgeChart = $event;
    }
    drawTaskChangeLine(list:any[]){
      let xData = list.map(item=>item.regionTitle);
      let y1Data = list.map(item=>item.one);
      let y2Data = list.map(item=>item.two);
      let y3Data = list.map(item=>item.three);
      let y4Data = list.map(item=>item.four);
      let y5Data = list.map(item=>item.five);
      return {
            tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}'
          },
          legend: {
            left: 'left'
          },
          xAxis: {
            type: 'category',
            data: xData,
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '创建',
              data: y1Data,
              type: 'line'
            },
            {
              name: '执行',
              type: 'line',
              data: y2Data
            },
            {
              name: '已完成',
              type: 'line',
              data: y3Data
            },
            {
              name: '已关闭',
              type: 'line',
              data: y4Data
            },
            {
              name: '已终止',
              type: 'line',
              data: y5Data
            },
          ]
      }
    }
    drawInstrumentChart(list: any[],end:any,flag:boolean){
      let dataList = [];
      list.forEach(item=>{
        let list = [item.value,item.name,item.value,item.label,item.count];
        dataList.push(list);
      })

      /* list.forEach(item=>{
        let list = [item.value,item.name,item.value,item.label];
        dataList.push(list);
      }) */
    	return {
        tooltip: {
          show:flag,
           axisPointer:{
             type:'line',
             //formatter:function(params){ return params.data[3]}
           },
             trigger: 'axis',
             formatter:function(params){
                   let html = `<div>${params[0].axisValue}</div>`;
                   params.map((item: any) => {
                     if (item.value || item.value === 0) {
                       html += `<div>${item.value[3]}：${item.value[0]} 个,相关站点个数:${item.value[4]}个</div>`;
                     }
                   })
                   return html;
               }
           },
    	  dataset: {
            dimensions: ['score', 'amount', 'product','label','count'],
    	      source: dataList
    	    },
    	    grid: {
    	    left: "10%",
    	    bottom:"35%",
    	    },
    	    visualMap: {
    	      orient: 'vertical',
    	      left: 'left',
    	      min: 0,
    	      max: list[0].value,
    	      text: ['多', '少'],
    	      // Map the score column to color
    	      dimension: 0,
    	      inRange: {
    	        color: ['#65B581', '#FFCE34', '#FD665F']
    	      }
    	    },
    	    dataZoom: [{
    	        type: 'slider',
    	        show: true,
    	        xAxisIndex: [0],
    	        left: '9%',
    	        bottom: -5,
    	        start: 0,
    	        end: end //初始化滚动条
    	    }],
    	    xAxis: { type: 'category',axisTick:{alignWithLabel:true, interval:0}, boundaryGap:true,
           axisLabel: {
                             interval: 0,
                             rotate:40,

                           }},
    	    yAxis: { type: 'value' },
    	    series: [
    	      {
    	        type: 'bar',
    	        dimensions: ['score', 'amount', 'product','label','count'],
    	        encode: {
    	          // Map the "amount" column to X axis.
    	          x: 'amount',
    	          // Map the "product" column to Y axis
    	          y: 'product'
    	        },

    	      }
    	    ],
    		}
    	}
    drawDoubleBar(list: any[],name:any[]){
      var xtitle = [];
      var x1data = [];
      var x2data = [];
      var x3data = [];
      list.forEach(item=>{
        xtitle.push(item.regionTitle);
        x1data.push(item.stationCount);
        x2data.push(item.taskCount);
        x3data.push(item.errorStationCount);
      })
      var max =  0;
      if(Math.max.apply(null,x1data)>Math.max.apply(null,x2data)){
        max = Math.max.apply(null,x1data);
      }else{
        max = Math.max.apply(null,x2data);
      }

      var colors = ['#5470C6', '#91CC75', '#EE6666'];
      if(name.length>2){
        return{
            color: this.colorList1,
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross'
              }
            },
            grid: {
              right: '20%'
            },
            legend: {
              data: name
            },
            xAxis: [
              {
                type: 'category',
                axisTick: {
                  alignWithLabel: true
                },
                axisLabel: {
                                  interval: 0,
                                  rotate:40,
                                },
                // prettier-ignore
                data: xtitle
              }
            ],
            yAxis: [
              {
                type: 'value',
                name: name[1]+'数量',
                min: 0,
                max: max,
                position: 'left',
                axisLine: {
                  show: true,
                },
                axisLabel: {
                  formatter: '{value}（个）'
                }
              }
            ],
            series: [
              {
                name: name[0],
                type: 'bar',
                data: x1data
              },
              {
                name: name[1],
                type: 'bar',
                data: x2data
              },
              {
                name: name[2],
                type: 'bar',
                data: x3data
              },
            ]
        }
      }else{
        return{
            color: this.colorList1,
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross'
              }
            },
            grid: {
              right: '20%'
            },
            legend: {
              data: name
            },
            xAxis: [
              {
                type: 'category',
                axisTick: {
                  alignWithLabel: true
                },
                axisLabel: {
                                  interval: 0,
                                  rotate:40,
                                },
                // prettier-ignore
                data: xtitle
              }
            ],
            yAxis: [
              {
                type: 'value',
                name: name[1]+'数量',
                min: 0,
                max: max,
                position: 'left',
                axisLine: {
                  show: true,
                },
                axisLabel: {
                  formatter: '{value}（个）'
                }
              }
            ],
            series: [
              {
                name: name[0],
                type: 'bar',
                data: x1data
              },
              {
                name: name[1],
                type: 'bar',
                data: x2data
              },
            ]
        }
      }

      }
      drawTimePieChart(list: any){
      return{
        color:this.colorList1,
    	    tooltip: {
    	      trigger: 'item'
    	    },
    	    legend: {
    	      orient: 'vertical',
    	      left: 'left'
    	    },
    	    series: [
    	      {
    	        name: '任务个数',
    	        type: 'pie',
    	        radius: '50%',
              center: ["50%", "65%"],
    	        data: [
                { value: list.one, name: '0~5小时' },
                { value: list.two, name: '5~10小时' },
                { value: list.three, name: '10~24小时' },
                { value: list.four, name: '24~48小时' },
                { value: list.five, name: '48~200小时' },
                { value: list.six, name: '>200小时' },
              ],
    	  itemStyle: {
    	                      emphasis: {
    	                          shadowBlur: 10,
    	                          shadowOffsetX: 0,
    	                          shadowColor: 'rgba(0, 0, 0, 0.5)'
    	                      },
    	                      normal:{
    	                          label:{
    	                              show: true,
    	                              formatter: '{b} : {c} ({d}%)'
    	                          },
    	                          labelLine :{show:true}
    	                      }
    	                  }
    	              },

    	    ]
    		}
    	}
      drawUnitPieChart(list: any){
      return{
        color:this.colorList1,
    	    tooltip: {
    	      trigger: 'item'
    	    },
    	    legend: {
    	      orient: 'vertical',
    	      left: 'left'
    	    },
    	    series: [
    	      {
    	        name: '单元个数',
    	        type: 'pie',
    	        radius: '50%',
              center: ["50%", "65%"],
    	        data: list,
    	  itemStyle: {
    	                      emphasis: {
    	                          shadowBlur: 10,
    	                          shadowOffsetX: 0,
    	                          shadowColor: 'rgba(0, 0, 0, 0.5)'
    	                      },
    	                      normal:{
    	                          label:{
    	                              show: true,
    	                              formatter: '{b} : {c} ({d}%)'
    	                          },
    	                          labelLine :{show:true}
    	                      }
    	                  }
    	              },

    	    ]
    		}
    	}
      log($event){
        this.getReadList();
        this.taskReadChart.setOption(this.taskRead);
      }
      posList:any[] = [
        'left',
        'right',
        'top',
        'bottom',
        'inside',
        'insideTop',
        'insideLeft',
        'insideRight',
        'insideBottom',
        'insideTopLeft',
        'insideTopRight',
        'insideBottomLeft',
        'insideBottomRight'
      ]
      app:any = {
        configParameters:{
          rotate: {
            min: -90,
            max: 90
          },
          align: {
            options: {
              left: 'left',
              center: 'center',
              right: 'right'
            }
          },
          verticalAlign: {
            options: {
              top: 'top',
              middle: 'middle',
              bottom: 'bottom'
            }
          },
          position: {
            options: this.posList.reduce(function (map, pos) {
              map[pos] = pos;
              return map;
            }, {})
          },
          distance: {
            min: 0,
            max: 100
          }
        },
        config:{
        rotate: 90,
        align: 'left',
        verticalAlign: 'middle',
        position: 'insideBottom',
        distance: 15,
        onChange: function () {
          const labelOption = {
            rotate: 90,
            align: 'left',
            verticalAlign: 'middle',
            position: 'insideBottom',
            distance: 15
          };
          this.taskAgeChart.setOption({
            series: [
              {
                label: labelOption
              },
              {
                label: labelOption
              },
              {
                label: labelOption
              },
              {
                label: labelOption
              }
            ]
          });
        }
      }
      }

      labelOption:any = {
        show: true,
        position: 'insideBottom',
        distance: 15,
        align: 'left',
        verticalAlign: 'middle',
        rotate: 90,
        formatter: '{c}  {name|{a}}',
        fontSize: 16,
        rich: {
          name: {}
        }
      }
      drawTaskAgeBar(list:any[]){
        let yData =  list.map(item=>{
          return [item.one,item.two,item.three,item.four,item.five]
        })

        return{
          tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            legend: {
              data: ['创建', '接受/第一次阅读', '已解决', '已关闭']
            },
            xAxis: [
              {
                type: 'category',
                axisTick: { show: false },
                data: ['0~5小时', '5~10小时', '10~24小时', '24~48小时', '>48小时']
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ],
            series: [
              {
                name: '创建',
                type: 'bar',
                barGap: 0,
                //label: this.labelOption,
                emphasis: {
                  focus: 'series'
                },
                data: yData[0]
              },
              {
                name: '接受/第一次阅读',
                type: 'bar',
                //label: this.labelOption,
                emphasis: {
                  focus: 'series'
                },
                data: yData[1]
              },
              {
                name: '已解决',
                type: 'bar',
                //label: this.labelOption,
                emphasis: {
                  focus: 'series'
                },
                data: yData[2]
              },
              {
                name: '已关闭',
                type: 'bar',
                //label: this.labelOption,
                emphasis: {
                  focus: 'series'
                },
                data: yData[3]
              }
            ]
        }
      }
}
