import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContractComponent } from './contract/contract.component';
import { ContractConfigComponent } from './contract-config/contract-config.component';

const routes: Routes = [
  { path: 'list', component: ContractComponent, data: { keep: true } },
  { path: 'config', component: ContractConfigComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractRoutingModule { }
