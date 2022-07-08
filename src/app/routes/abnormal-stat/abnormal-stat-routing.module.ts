import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AbnormalStatComponent } from './abnormal-stat/abnormal-stat.component';

const routes: Routes = [
  { path: '', component: AbnormalStatComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AbnormalStatRoutingModule { }
