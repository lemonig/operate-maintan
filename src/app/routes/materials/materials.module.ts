import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { MaterialsRoutingModule } from './materials-routing.module';
// 组件
import { RecordComponent } from './record/record.component';
import { UseRecordComponent } from './use-record/use-record.component';
import { HelpRecordComponent } from './help-record/help-record.component';
import { HelpUseRecordComponent } from './help-use-record/help-use-record.component';
import { ToolRecordComponent } from './tool-record/tool-record.component';


@NgModule({
  declarations: [RecordComponent, UseRecordComponent, HelpRecordComponent, HelpUseRecordComponent, ToolRecordComponent],
  imports: [
    SharedModule,
    MaterialsRoutingModule
  ]
})
export class MaterialsModule { }
