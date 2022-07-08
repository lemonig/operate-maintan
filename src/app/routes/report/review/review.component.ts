import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ExcelService } from '@core/excel/excel.service';
import * as moment from 'moment';
import { Router, ActivatedRoute, NavigationEnd,NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.less']
})
export class ReviewComponent implements OnInit {

 constructor(
   public fb: FormBuilder,
   public _http: _HttpClient,
   public msg: NzMessageService,
   public ExcelService: ExcelService,
   public router: Router,) { }
   loading = false;
   readList:any [] = [];
   userInfo:any;
   loadingBtn = false;
   // 分页
   public pageIndex = 1;
   q: any = {
     pageIndex: 1,
     pageSize: 20,
     total: 0,
   }
   //人员分布
   region:boolean = true;
   city:boolean = false;
   dataManager:boolean = false;
   ops:boolean = false;
   manager:boolean = false;
nickname:any='';
   orgKey:any;
   dateRange: any[] = [new Date(new Date().getTime() - 30 * 24 * 3600 * 1000), new Date()];
   regionList: any[] = [];
   powerList:any[]= [
    { label: '省级管理', value: 'is_ops_region_manager' ,checked: true},
    { label: '市级管理', value: 'is_ops_city_manager' },
    { label: '运维人员', value: 'is_ops' },
    { label: '数据管理', value: 'is_datamanager' },];

   ngOnInit() {
     this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
     this.getTableData();
     this.getRegionList();
   }

goTaskOver(id:number){
 this.router.navigate(['/error'],{queryParams:{userId:id,isOver:true}});
}
goTaskRead(id:number){
this.router.navigate(['/error'],{queryParams:{userId:id,read:false}});
}
goTaskCount(id:number){
  this.router.navigate(['/error'],{queryParams:{userId:id}});
}
goOpsRead(id:number){
this.router.navigate(['/checking'],{queryParams:{userId:id,read:false}});
}

getRegionList(){
    this._http.get('api/org/region/list/work').subscribe((res: any) => {
      if (res.success) {
        this.regionList = res.data;
      } else {
        this.msg.error(res.message);
      }
    })
  }

 chooserUser(id:any){
   this._http.get('api/statistics/read/'+id).subscribe((res: any) => {
     if (res.success) {
         this.readList = res.data;
     } else {
       this.msg.error(res.message);
     }
   });
 }
 // 分页
 pageIndexChange($event: any) {
   this.q.pageIndex = $event;
   this.getTableData();
 }
 pageSizeChange($event: any) {
   this.q.pageSize = $event;
   this.getTableData();
 }
 search(){
   this.q = {
     pageIndex: 1,
     pageSize: 20,
     total: 0,
   }
   this.getTableData();
   }

   log($event){
     console.log($event);
   }

     getTableData() {
       let checkedList = this.powerList.filter(item=>{
           return item.checked
       }).map(item=>{
           return item.value
       })
      let param = {
        name:this.nickname,
        orgKey:this.orgKey,
        startDate: this.dateRange.length ? moment(this.dateRange[0]).format('YYYY-MM-DD') : null,
        endDate: this.dateRange.length ? moment(this.dateRange[1]).format('YYYY-MM-DD') : null,
        checkedList:checkedList,
        limit:this.q.pageSize,
        startPage:this.q.pageIndex
      }
     this.loading= true;
     this._http.post('api/statistics/read',param).subscribe((res: any) => {
       this.loading= false;
       if (res.success) {
           this.readList = res.data;
           this.q.total = res.additional_data.total;
       } else {
         this.msg.error(res.message);
       }
     });
   }

   export(){
     let checkedList = this.powerList.filter(item=>{
         return item.checked
     }).map(item=>{
         return item.value
     })
     let param = {
       name:this.nickname,
       orgKey:this.orgKey,
       startDate: this.dateRange.length ? moment(this.dateRange[0]).format('YYYY-MM-DD') : null,
       endDate: this.dateRange.length ? moment(this.dateRange[1]).format('YYYY-MM-DD') : null,
       checkedList:checkedList,
       limit:this.q.pageSize,
       startPage:this.q.pageIndex
     }
     this.ExcelService.download('api/statistics/read/export', param, `阅读统计`);
   }
}
