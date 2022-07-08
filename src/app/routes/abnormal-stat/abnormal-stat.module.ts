import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared';

import { AbnormalStatRoutingModule } from './abnormal-stat-routing.module';
import { AbnormalStatComponent } from './abnormal-stat/abnormal-stat.component';
import { AbnormalCityComponent } from './components/abnormal-city/abnormal-city.component';
import { AbnormalSiteComponent } from './components/abnormal-site/abnormal-site.component';
import { AbnormalContractComponent } from './components/abnormal-contract/abnormal-contract.component';
import { AbnormalStaffComponent } from './components/abnormal-staff/abnormal-staff.component';


@NgModule({
  declarations: [AbnormalStatComponent, AbnormalCityComponent, AbnormalSiteComponent, AbnormalContractComponent, AbnormalStaffComponent],
  imports: [
    SharedModule,
    CommonModule,
    AbnormalStatRoutingModule
  ]
})
export class AbnormalStatModule { }
