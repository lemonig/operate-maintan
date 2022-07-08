import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordComponent } from './record/record.component';
import { UseRecordComponent } from './use-record/use-record.component';
import { HelpRecordComponent } from './help-record/help-record.component';
import { HelpUseRecordComponent } from './help-use-record/help-use-record.component';
import { ToolRecordComponent } from './tool-record/tool-record.component';


const routes: Routes = [
  { path: 'record', component: RecordComponent },
  { path: 'useRecord', component: UseRecordComponent },
  { path: 'helpRecord', component: HelpRecordComponent },
  { path: 'helpUseRecord', component: HelpUseRecordComponent },
  { path: 'toolRecord', component: ToolRecordComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialsRoutingModule { }
