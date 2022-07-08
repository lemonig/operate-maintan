import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { CarRoutingModule } from './car-routing.module';

import { ListComponent } from './list/list.component';
import { MapComponent } from './map/map.component';
import { StatComponent } from './stat/stat.component';


@NgModule({
  declarations: [ListComponent, MapComponent, StatComponent],
  imports: [
    SharedModule,
    CarRoutingModule
  ]
})
export class CarModule { }
