import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { ResourceRoutingModule } from './resource-routing.module';
import { InstrumentComponent } from './instrument/instrument.component';
import { DeviceComponent } from './device/device.component';
import { ToolComponent } from './tool/tool.component';
import { ReagentComponent } from './reagent/reagent.component';
import { PartsComponent } from './parts/parts.component';


@NgModule({
  declarations: [InstrumentComponent, DeviceComponent, ToolComponent, ReagentComponent, PartsComponent],
  imports: [
    SharedModule,
    ResourceRoutingModule
  ]
})
export class ResourceModule { }
