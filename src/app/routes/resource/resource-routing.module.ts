import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InstrumentComponent } from './instrument/instrument.component';
import { DeviceComponent } from './device/device.component';
import { ToolComponent } from './tool/tool.component';
import { ReagentComponent } from './reagent/reagent.component';
import { PartsComponent } from './parts/parts.component';

const routes: Routes = [
  { path: 'instrument', component: InstrumentComponent },
  { path: 'device', component: DeviceComponent },
  { path: 'tool', component: ToolComponent },
  { path: 'reagent', component: ReagentComponent },
  { path: 'parts', component: PartsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResourceRoutingModule { }
