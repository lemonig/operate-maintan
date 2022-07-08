import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared';

import { CheckingStatRoutingModule } from './checking-stat-routing.module';
import { CheckingStatComponent } from './checking-stat/checking-stat.component';
import { CheckingProvinceComponent } from './components/checking-province/checking-province.component';
import { CheckingCityComponent } from './components/checking-city/checking-city.component';
import { CheckingContractComponent } from './components/checking-contract/checking-contract.component';
import { CheckingStaffComponent } from './components/checking-staff/checking-staff.component';
import { CheckingSiteComponent } from './components/checking-site/checking-site.component';


@NgModule({
  declarations: [CheckingStatComponent, CheckingProvinceComponent, CheckingCityComponent, CheckingContractComponent, CheckingStaffComponent, CheckingSiteComponent],
  imports: [
    CommonModule,
    SharedModule,
    CheckingStatRoutingModule,
  ]
})
export class CheckingStatModule { }
