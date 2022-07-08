import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ExcelService } from '@core/excel/excel.service';
import * as moment from 'moment';
import { Router, ActivatedRoute, NavigationEnd,NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-readstatistics',
  templateUrl: './readstatistics.component.html',
  styleUrls: ['./readstatistics.component.less']
})
export class ReadstatisticsComponent implements OnInit {

  constructor(
  public fb: FormBuilder,
  public _http: _HttpClient,
  public msg: NzMessageService,
  public ExcelService: ExcelService,
  public router: Router,) { }
  loading = false;
  readList:any [] = [];
  userInfo:any;
managerList:any[] = [];
regionManagerList:any[] = [];
dataManagerList:any[] = [];
cityManagerList:any[] = [];
opsList:any[] = [];
readStatistics:any = {
  userName:"",
  taskCount:"",
  taskRead:"",
  overCount:"",
  opsCount:"",
  opsRead:""
};
visible = false;
  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.getUserInfo();
    // this.getTableData(this.userInfo.id);
  }

chooserUser(id:any){
  this.loading= true;
  this._http.get('api/statistics/read/'+id).subscribe((res: any) => {
    this.loading= false;
    if (res.success) {
        this.readList = res.data;
    } else {
      this.msg.error(res.message);
    }
  });
}
getUserInfo(){
  this._http.get('api/user').subscribe((res: any) => {
    if (res.success) {
      const result = res.data;
      this.managerList = result.filter(item=>item.manager);
      this.regionManagerList = result.filter(item =>item.opsRegionManager&&!item.manager);
      this.cityManagerList = result.filter(item=>item.opsCityManager&&!item.manager&&!item.opsRegionManager&&!item.dataManager);
      this.dataManagerList = result.filter(item=>item.dataManager&&!item.manager&&!item.opsRegionManager&&!item.opsCityManager);
      this.opsList = result.filter(item=>item.ops&&!item.manager&&!item.opsRegionManager&&!item.opsCityManager&&!item.dataManager);
    } else {
      this.msg.error(res.message);
    }
  });
}
getReadStatistics(id:number){
  this._http.get('api/statistics/readone/'+id).subscribe((res: any) => {
    if (res.success) {
        this.readStatistics = res.data;
        this.visible = true;
    } else {
      this.msg.error(res.message);
    }
  });
}
handleOk(): void {
    this.visible = false;
  }

  handleCancel(): void {
    this.visible = false;
  }
goTaskOver(id:number){
 this.router.navigate(['/error'],{queryParams:{executorId:id,isOver:true}});
}
goTaskRead(id:number){
this.router.navigate(['/error'],{queryParams:{userId:id,read:false}});
}
goOpsRead(id:number){
this.router.navigate(['/checking'],{queryParams:{userId:id,read:false}});
}
search(){
  this.getTableData(this.userInfo.id);
  }
    getTableData(id:any) {

    this.loading= true;
    this._http.get('api/statistics/read/'+id).subscribe((res: any) => {
      this.loading= false;
      if (res.success) {
          this.readList = res.data;
      } else {
        this.msg.error(res.message);
      }
    });
  }
  change(value: boolean): void {
      // console.log(value);
    }

}
