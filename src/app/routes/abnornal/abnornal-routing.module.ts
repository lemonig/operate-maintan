import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AbnormalComponent } from './abnormal/abnormal.component';

const routes: Routes = [
  { path: '', component: AbnormalComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AbnornalRoutingModule { }
