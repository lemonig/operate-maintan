import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';

import { ContractRoutingModule } from './contract-routing.module';
import { ContractComponent } from './contract/contract.component';
import { ContractPendingComponent } from './components/contract-pending/contract-pending.component';
import { ContractOverComponent } from './components/contract-over/contract-over.component';
import { ContractConfigComponent } from './contract-config/contract-config.component';

@NgModule({
  declarations: [ContractComponent, ContractPendingComponent, ContractOverComponent, ContractConfigComponent],
  imports: [
    CommonModule,
    SharedModule,
    ContractRoutingModule
  ],
})
export class ContractModule { }
