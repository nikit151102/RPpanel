import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagerStatComponent } from './manager-stat.component';

const routes: Routes = [
  {
    path: '', 
    component: ManagerStatComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],  
  exports: [RouterModule]
})
export class ManagerStatRoutingModule { }