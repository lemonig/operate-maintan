import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService, UploadXHRArgs } from 'ng-zorro-antd';
import { ExcelService } from '@core/excel/excel.service';
import { Router, ActivatedRoute, NavigationEnd,NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-alarm',
  templateUrl: './alarm.component.html',
  styleUrls: ['./alarm.component.less']
})
export class AlarmComponent implements OnInit {

  constructor(private _http: _HttpClient,
  private msg: NzMessageService,
  private fb: FormBuilder,
  public router: Router,
  private modal: NzModalService) { }
  opsOverCount:any;
  taskSoonOverCount:any;
  contractOverCount:any;
  contractSoonOverCount:any;
  taskOverCount:any;
  opsSoonOverCount:any;
  userInfo:any;
  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.getData();
  }

  handle(index:any){

    if(index == 1){
      this.router.navigate(['/error'],{queryParams:{isOver:true}});
    }
    if(index == 2){
      this.router.navigate(['/checking'],{queryParams:{isOver:true}});
    }
    if(index == 3){
      this.router.navigate(['/setting/contract'],{queryParams:{isOver:true}});
    }
  }
  getData() {
    this._http.post('api/alarm/list').subscribe((res: any) => {
      if (res.success) {
        // 跳转到列表页面
        this.opsOverCount = res.data.opsOverCount;
        this.taskSoonOverCount = res.data.taskSoonOverCount;
        this.contractOverCount = res.data.contractOverCount;
        this.contractSoonOverCount = res.data.contractSoonOverCount;
        this.taskOverCount = res.data.taskOverCount;
        this.opsSoonOverCount = res.data.opsSoonOverCount;
      } else {
        this.msg.error(res.message);
      }
    })
  }
}
