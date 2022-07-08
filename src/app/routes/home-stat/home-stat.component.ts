import { Component, OnInit, HostListener } from '@angular/core';
import { FullContentService } from '@delon/abc';
import * as screenfull from 'screenfull';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import * as moment from 'moment';
@Component({
  selector: 'app-home-stat',
  templateUrl: './home-stat.component.html',
  styleUrls: ['./home-stat.component.less']
})
export class HomeStatComponent implements OnInit {

  private get sf(): screenfull.Screenfull {
    return screenfull as screenfull.Screenfull;
  }
  constructor(private fullContentService: FullContentService,
  private _http: _HttpClient,
  private msg: NzMessageService,
  private fb: FormBuilder,
  private modal: NzModalService,
) { }
  full = false;
colorList1: any[] = [
    '#1C47BF', '#DA4688', '#14BA87', '#DB5230',
    '#9161F3', '#1085E5', '#A7198C', '#1D7733',
    '#432585', '#958310', '#931515', '#FFD666',
    '#BAE637', '#73D13D', '#5CDBD3', '#69C0FF',
    '#85A5FF', '#B37FEB', '#FF85C0', '#A8071A',
    '#AD6800', '#5B8C00', '#006D75', '#0050B3',
  ];
dateRange: any[] = [new Date(new Date().getTime() - 7 * 24 * 3600 * 1000), new Date()];
contractStatistics:any = {
  activeCompanyCout: 0,
  contractCompanyCountList: [],
  contractCount: 0,
  contractNum: 0,
  contractStationCountList: [],
  contractStationRegionList: [],
  contractTime: [],
  doContractCount: 0,
  doStationCount: 0,
  lostCompanyCount: 0,
  nearOverContratCount: 0,
  nearOverStationCount: 0,
  oneYearContractNum: 0,
  renewal: 0,
  turnover: 0,
  stationCount:0,
  newCompanyCount:0,
};
contractStationRegionList:any[] = [];
contractStationCountList:any[] = [];
contractCompanyCountList:any[] = [];
contractTime:any;
chartPiepolice: any;
doubleBar:any;
companyContract:any;
contractStationCountPie:any;
contractMoney:any;
startYear:any = new Date();
  ngOnInit() {
    this.getTableData();
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if(event.key === "Enter"){
      this.fullContentService.toggle();
      this.sf.toggle();
    }
  }

onChangeYear(result: Date){
      this.getTableData();
    }

getTableData() {
  let param = {
    startYear:this.startYear?moment(this.startYear).format('YYYY-MM-DD') : null,
  }
this._http.post(`api/contract/statistics`,param).subscribe((res: any) => {
      if (res.success) {
        this.contractStatistics = res.data;
        this.contractStationRegionList = res.data.contractStationRegionList;
        this.contractStationCountList = res.data.contractStationCountList;
        this.contractTime = this.drawYearPieChart(res.data.contractTime);
        this.contractStationCountPie = this.drawContractStationPieChart(res.data.contractStationCountPie);
        this.chartPiepolice = this.drawPiepoliceChart(res.data.contractStationCountList);
        this.companyContract = this.drawCompanyContract(res.data.contractCompanyCountList);
        this.contractCompanyCountList=res.data.contractCompanyCountList;
        this.doubleBar = this.drawDoubleBar(res.data.contractStationRegionList);
        this.contractMoney =this.drawContractMoneyChart(res.data.contractMoney);
      } else {
        this.msg.error(res.message);
      }
    })
}
getContractStationCountPie(num:any){
  let param = {
    startYear:this.startYear?moment(this.startYear).format('YYYY-MM-DD') : null,
    num:num
  }
  this._http.post(`api/contract/statistics/stationcount`,param).subscribe((res: any) => {
        if (res.success) {
          this.contractStationCountPie = this.drawContractStationPieChart(res.data);
          this.contractStationCountchart.setOption(this.contractStationCountPie);
        } else {
          this.msg.error(res.message);
        }
      })
}
getContractMoneyPie(num:any){
  let param = {
    startYear:this.startYear?moment(this.startYear).format('YYYY-MM-DD') : null,
    num:num
  }
  this._http.get(`api/contract/statistics/contractmoney`,param).subscribe((res: any) => {
        if (res.success) {
          this.contractMoney = this.drawContractMoneyChart(res.data);
          this.contractMoneyChart.setOption(this.contractMoney);
        } else {
          this.msg.error(res.message);
        }
      })
}
timechart:any;
onChart1($event:any){
  var that = this;
  this.timechart = $event;
  this.timechart.on('mouseover', function (params) {
     that.getContractStationCountPie(params.data.id);
     that.getContractMoneyPie(params.data.id);
  });
  this.timechart.on('mouseout', function (params) {
     that.getContractStationCountPie(0);
     that.getContractMoneyPie(0);
  });
}
contractStationCountchart:any;
onChart2($event:any){
  this.contractStationCountchart = $event;
  /* this.timechart.on('click', function (params) {
        console.log(params);
  }); */
}
contractMoneyChart:any;
onChart3($event:any){
  this.contractMoneyChart = $event;
  /* this.timechart.on('click', function (params) {
        console.log(params);
  }); */
}
drawCompanyContract(list: any[]){
  let dataList = [];
  list.forEach(item=>{
    let list = [item.value,item.name,item.value];
    dataList.push(list);
  })
  return {
    dataset: {
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
          color: this.colorList1
        }
      },
      dataZoom: [{
          type: 'slider',
          show: true,
          xAxisIndex: [0],
          left: '9%',
          bottom: -5,
          start: 0,
          end: 8 //初始化滚动条
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
          dimensions: ['score', 'amount', 'product'],
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
drawPiepoliceChart(list: any[]){
  let dataList = [];
  list.forEach(item=>{
    let list = [item.percentage,item.name,item.value,item.label];
    dataList.push(list);
  })

	return {
	  dataset: {
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
	      max: list[0].percentage,
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
	        end: 14 //初始化滚动条
	    }],
	    xAxis: { type: 'category',axisTick:{alignWithLabel:true, interval:0}, boundaryGap:true,
       axisLabel: {
                         interval: 0,
                         rotate:40,

                       }
                       },
	    yAxis: { type: 'value' },
	    series: [
	      {
	        type: 'bar',
	        dimensions: ['score', 'amount', 'product','label'],
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
  drawDoubleBar(list: any[]){
    var xtitle = [];
    var x1data = [];
    var x2data = [];
    list.forEach(item=>{
      xtitle.push(item.regionTitle);
      x1data.push(item.stationCount);
      x2data.push(item.contractCount);
    })
    var colors = ['#5470C6', '#91CC75', '#EE6666'];
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
          data: [ '站点', '合同']
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
                              interval: 0,
                              rotate:20,
                            },
            // prettier-ignore
            data: xtitle
          }
        ],
        yAxis: [
          {
                type: 'value',
                name: '站点',
                min: 0,
                max: Math.max.apply(null,x1data),
                position: 'left',
                axisLine: {
                  show: true,
                },
                axisLabel: {
                  formatter: '{value} (个)'
                }
          },
          {
                type: 'value',
                name: '合同',
                min: 0,
                max: Math.max.apply(null,x2data),
                position: 'right',
                axisLine: {
                  show: true,
                },
                axisLabel: {
                  formatter: '{value} (个)'
                }
          }
        ],
        series: [
          {
            name: '站点',
            type: 'bar',
            data: x1data
          },
          {
            name: '合同',
            type: 'bar',
            data: x2data
          },
          /*{
            name: 'Temperature',
            type: 'line',
            yAxisIndex: 2,
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
          }*/
        ]
    }
  }
  drawYearPieChart(list: any){
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
  	        name: '站点个数',
  	        type: 'pie',
  	        radius: '50%',
            center: ["50%", "65%"],
  	        data: [
  	          { value: list.one, name: '一年及以内',id:1 },
  	          { value: list.two, name: '1~2年',id:2 },
  	          { value: list.three, name: '>2年',id:3 },
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
  	                      },

  	                  }
  	              },

  	    ]
  		}

  	}

    drawContractMoneyChart(list: any){

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
    	        name: '站点个数',
    	        type: 'pie',
    	        radius: '50%',
              center: ["50%", "65%"],
    	        data: [
    	          { value: list.one, name: '30万以内' },
    	          { value: list.two, name: '30万~100万' },
    	          { value: list.three, name: '100万~200万' },
                { value: list.four, name: '200万~500万' },
                { value: list.five, name: '500万+' },
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

    drawContractStationPieChart(list: any){
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
    	        name: '站点个数',
    	        type: 'pie',
    	        radius: '50%',
              center: ["50%", "65%"],
    	        data: [
    	          { value: list.one, name: '1~3' },
    	          { value: list.two, name: '3~10' },
    	          { value: list.three, name: '10~20' },
                { value: list.four, name: '20~50' },
                { value: list.five, name: '50+' },
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
}
