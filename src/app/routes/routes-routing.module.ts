import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SimpleGuard } from '@delon/auth';
import { environment } from '@env/environment';
// layout
import { LayoutDefaultComponent } from '../layout/default/default.component';
import { LayoutFullScreenComponent } from '../layout/fullscreen/fullscreen.component';
import { LayoutPassportComponent } from '../layout/passport/passport.component';


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

const routes: Routes = [
  {
    path: '',
    component: LayoutDefaultComponent,
    canActivate: [SimpleGuard],
    canActivateChild: [SimpleGuard],
    children: [
      { path: '', redirectTo: '/passport/login', pathMatch: 'full' },
      { path: 'home', component: HomeStatComponent },
      { path: 'error', loadChildren: () => import('./abnornal/abnornal.module').then(m => m.AbnornalModule), },
      { path: 'errorStatis', loadChildren: () => import('./abnormal-stat/abnormal-stat.module').then(m => m.AbnormalStatModule), },
      { path: 'errorAchievement', component: ErrorAchievementsComponent },
      { path: 'checking', component: CheckingComponent },
      { path: 'checkingStatis', loadChildren: () => import('./checking-stat/checking-stat.module').then(m => m.CheckingStatModule) },
      { path: 'checkingAchievement', component: CheckingAchievementsComponent },
      { path: 'sign', component: SignComponent },
      { path: 'correctiveItem', component: CorrectiveItemComponent },
      { path: 'hometask', component: HomeTaskComponent },
      { path: 'homeops', component: HomeOpsComponent },
      { path: 'homecar', component: HomeCarComponent },
      // 合同管理
      { path: 'contract', loadChildren: () => import('./contract/contract.module').then(m => m.ContractModule) },
      // 各类上报
      {
        path: 'report',
        loadChildren: () => import('./report/report.module').then(m => m.ReportModule),
      },
      {
        path: 'car',
        loadChildren: () => import('./car/car.module').then(m => m.CarModule),
      },
      // 物料管理
      {
        path: 'resource',
        loadChildren: () => import('./resource/resource.module').then(m => m.ResourceModule),
      },
      // 物料使用
      {
        path: 'materials',
        loadChildren: () => import('./materials/materials.module').then(m => m.MaterialsModule),
      },
      {
        path: 'setting',
        loadChildren: () => import('./setting/setting.module').then(m => m.SettingModule),
      },
    ],
  },

  // passport
  {
    path: 'passport',
    component: LayoutPassportComponent,
    children: [
      {
        path: 'login',
        component: UserLoginComponent,
        data: { title: '登录', titleI18n: 'app.login.login' },
      },
    ],
  },
  { path: '**', redirectTo: 'exception/404' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: environment.useHash,
      // NOTICE: If you use `reuse-tab` component and turn on keepingScroll you can set to `disabled`
      // Pls refer to https://ng-alain.com/components/reuse-tab
      scrollPositionRestoration: 'top',
    }),
  ],
  exports: [RouterModule],
})
export class RouteRoutingModule { }
