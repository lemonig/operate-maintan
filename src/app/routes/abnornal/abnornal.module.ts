import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared';

import { AbnornalRoutingModule } from './abnornal-routing.module';
import { AbnormalComponent } from './abnormal/abnormal.component';
import { PendingComponent } from './components/pending/pending.component';
import { ProcessingComponent } from './components/processing/processing.component';
import { AllTaskComponent } from './components/all-task/all-task.component';


@NgModule({
  declarations: [AbnormalComponent, PendingComponent, ProcessingComponent, AllTaskComponent],
  imports: [
    SharedModule,
    CommonModule,
    AbnornalRoutingModule
  ]
})
export class AbnornalModule { }
