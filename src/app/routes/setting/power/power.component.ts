import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService, UploadXHRArgs } from 'ng-zorro-antd';
import { ExcelService } from '@core/excel/excel.service';
import * as moment from 'moment';
@Component({
  selector: 'app-power',
  templateUrl: './power.component.html',
  styleUrls: ['./power.component.less']
})
export class PowerComponent implements OnInit {

  constructor(
  private _http: _HttpClient,
  private msg: NzMessageService,
  private fb: FormBuilder,
  private modal: NzModalService) { }
password:any;
flag:any = false;
settingForm:FormGroup;
instrumentForm:FormGroup;
btnLoading = false;
userInfo:any;
oldMode: any[];
newMode: any;
instrumentList:any[];
instrumentListCopy:any[];
  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.initAddForm();
    this.getInstrumentList();
  }

check(){
  if(this.password ==  moment(new Date()).format('YYYYMMDD')){
    this.flag = true;
  }
}
initAddForm() {
    this.settingForm = this.fb.group({
      stage_str: [null, Validators.required],
      car_num: [null, Validators.required],
      mileage: [null, Validators.required],
    })
  }
nzFilterOption = () => { true };
delInstrument(){
  let params = {
    instrument:this.newMode,
    oldInstrumentId:this.oldMode
  }
  this._http.post('api/instrument/delete/repeat',params).subscribe((res: any) => {
    if (res.success) {
     this.msg.success("操作成功!");
    } else {
      this.msg.error(res.message);
    }
  })
}
getInstrumentList() {
    this._http.get('api/instrument').subscribe((res: any) => {
      if (res.success) {
        this.instrumentList = res.data;
        this.instrumentListCopy = JSON.parse(JSON.stringify(res.data));
      } else {
        this.msg.error(res.message);
      }
    })
  }
filterOpsList($event: any) {
    this.instrumentList = this.instrumentListCopy.filter((item: any) => {
      if (item.name.includes($event)) {
        return true;
      }
      if (item.version.includes($event)) {
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
  delData() {
    for (const i in this.settingForm.controls) {
      this.settingForm.controls[i].markAsDirty();
      this.settingForm.controls[i].updateValueAndValidity();
    }
    if (this.settingForm.invalid) {
      return
    }
    const params = JSON.parse(JSON.stringify(this.settingForm.value));
    this.btnLoading = true;
    this._http.post('api/power/del/mileage', params).subscribe((res: any) => {
      this.btnLoading = false;
      if (res.success) {
        // 跳转到列表页面
        this.initAddForm();
        this.msg.success("删除成功！");
      } else {
        this.msg.error(res.message);
      }
    })
  }
}
