import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarfeeComponent } from './carfee/carfee.component';
import { MileageComponent } from './mileage/mileage.component';
import { StationfeeComponent } from './stationfee/stationfee.component';
import { SharedModule } from '@shared/shared.module';

import { ReportRoutingModule } from './report-routing.module';
import { CarComponent } from './car/car.component';
import { MileageStatComponent } from './mileage-stat/mileage-stat.component';
import { SnapfeeComponent } from './snapfee/snapfee.component';
import { CarfeestatComponent } from './carfeestat/carfeestat.component';
import { MileageachievementsComponent } from './mileageachievements/mileageachievements.component';
import { ReadstatisticsComponent } from './readstatistics/readstatistics.component';
import { ReviewComponent } from './review/review.component';

@NgModule({
  declarations: [CarfeeComponent, MileageComponent, StationfeeComponent, CarComponent, MileageStatComponent, SnapfeeComponent, CarfeestatComponent, MileageachievementsComponent, ReadstatisticsComponent, ReviewComponent],
  imports: [
    CommonModule, ReportRoutingModule, SharedModule
  ]
})
export class ReportModule { }
