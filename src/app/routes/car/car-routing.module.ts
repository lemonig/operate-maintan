import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComponent } from './list/list.component';
import { MapComponent } from './map/map.component';
import { StatComponent } from './stat/stat.component';
const routes: Routes = [
  
  { path: 'list', component: ListComponent },
  { path: 'map', component: MapComponent },
  { path: 'stat', component: StatComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarRoutingModule { }
