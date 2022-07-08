import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarfeeComponent } from './carfee/carfee.component';
import { MileageComponent } from './mileage/mileage.component';
import { StationfeeComponent } from './stationfee/stationfee.component';
import { CarComponent } from './car/car.component';
import { MileageStatComponent } from './mileage-stat/mileage-stat.component';
import { SnapfeeComponent } from './snapfee/snapfee.component';
import { CarfeestatComponent } from './carfeestat/carfeestat.component';
import { MileageachievementsComponent } from './mileageachievements/mileageachievements.component';
import { ReadstatisticsComponent } from './readstatistics/readstatistics.component';
import { ReviewComponent } from './review/review.component';
const routes: Routes = [
  { path: 'mileageStat', component: MileageStatComponent },
  { path: 'car', component: CarComponent },
  { path: 'carfee', component: CarfeeComponent },
  { path: 'mileage', component: MileageComponent },
  { path: 'stationfee', component: StationfeeComponent },
  { path: 'snapfee', component: SnapfeeComponent },
  { path: 'carfeestat', component: CarfeestatComponent },
  { path: 'mileageAchievement' ,component: MileageachievementsComponent },
  { path: 'readstatistics' ,component: ReadstatisticsComponent },
  { path: 'review' ,component: ReviewComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
