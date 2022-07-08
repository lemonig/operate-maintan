import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { SettingRoutingModule } from './setting-routing.module';


import { UserComponent } from './user/user.component';
import { PlanComponent } from './plan/plan.component';
import { DataPowerComponent } from './data-power/data-power.component';
import { FastInputComponent } from './fast-input/fast-input.component';
import { KnowledgeBaseComponent } from './knowledge-base/knowledge-base.component';
import { ItemTemplateComponent } from './item-template/item-template.component';

// 驻点信息
import { StagPointComponent } from './stag-point/stag-point.component';
// 合同信息
import { ContractComponent } from './contract/contract.component';
// 站点信息
import { StationInfoComponent } from './station-info/station-info.component';
import { HistoryComponent } from './history/history.component';
import { PowerComponent } from './power/power.component';
import { AlarmComponent } from './alarm/alarm.component';
import { NewPlanComponent } from './new-plan/new-plan.component';
import { NewTemplateComponent } from './new-template/new-template.component';
import { ContractStatisComponent } from './contract-statis/contract-statis.component';

const COMPONENTS = [
  UserComponent,
  PlanComponent,
];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    SettingRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT,
    DataPowerComponent,
    FastInputComponent,
    KnowledgeBaseComponent,
    ItemTemplateComponent,
    StagPointComponent,
    ContractComponent,
    StationInfoComponent,
    HistoryComponent,
    PowerComponent,
    AlarmComponent,
    NewPlanComponent,
    NewTemplateComponent,
    ContractStatisComponent,
   
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class SettingModule { }
