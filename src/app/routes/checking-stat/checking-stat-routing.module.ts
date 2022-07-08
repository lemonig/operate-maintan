import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckingStatComponent } from './checking-stat/checking-stat.component';

const routes: Routes = [
  { path: '', component: CheckingStatComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckingStatRoutingModule { }
