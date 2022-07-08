import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// 用户
import { UserComponent } from './user/user.component';
// 巡检项目
import { PlanComponent } from './plan/plan.component';
// 权限
import { DataPowerComponent } from './data-power/data-power.component';
// 快捷输入
import { FastInputComponent } from './fast-input/fast-input.component';
// 知识库
import { KnowledgeBaseComponent } from './knowledge-base/knowledge-base.component';
// 巡检模板
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
const routes: Routes = [
  { path: 'user', component: UserComponent },
  { path: 'plan', component: PlanComponent },
  { path: 'dataPower', component: DataPowerComponent },
  { path: 'fastInput', component: FastInputComponent },
  { path: 'knowledgeBase', component: KnowledgeBaseComponent },
  { path: 'template', component: ItemTemplateComponent },
  { path: 'stagPoint', component: StagPointComponent },
  { path: 'contract', component: ContractComponent },
  { path: 'stationInfo', component: StationInfoComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'power', component: PowerComponent },
  { path: 'alarm', component: AlarmComponent},
  { path: 'newplan', component: NewPlanComponent},
  { path: 'newtemplate', component: NewTemplateComponent},
  { path: 'contractStatis', component: ContractStatisComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
