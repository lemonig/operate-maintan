/*
 * @Author: 李大钊
 * @Date: 2022-03-17 14:27:57
 * @LastEditors: 李大钊
 * @LastEditTime: 2022-06-02 14:24:03
 * @FilePath: \ops_web\src\app\routes\routes.module.ts
 */
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared';
import { RouteRoutingModule } from './routes-routing.module';

// passport pages
import { UserLoginComponent } from './passport/login/login.component';

import { CheckingComponent } from './checking/checking.component';
import { SignComponent } from './sign/sign.component';
import { HomeStatComponent } from './home-stat/home-stat.component';
import { ErrorAchievementsComponent } from './error-achievements/error-achievements.component';
import { CheckingAchievementsComponent } from './checking-achievements/checking-achievements.component';
import { CorrectiveItemComponent } from './corrective-item/corrective-item.component';
import { HomeTaskComponent } from './home-task/home-task.component';
import { HomeOpsComponent } from './home-ops/home-ops.component';
import { HomeCarComponent } from './home-car/home-car.component';




const COMPONENTS = [
  // passport pages
  UserLoginComponent,
];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, RouteRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT, CheckingComponent, SignComponent, HomeStatComponent, ErrorAchievementsComponent, CheckingAchievementsComponent, CorrectiveItemComponent, HomeTaskComponent, HomeOpsComponent, HomeCarComponent],
  entryComponents: COMPONENTS_NOROUNT,
})
export class RoutesModule { }
