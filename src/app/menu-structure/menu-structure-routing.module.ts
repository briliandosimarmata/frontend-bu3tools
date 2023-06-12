import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuStructureComponent } from './menu-structure.component';

const routes: Routes = [
  {
    component: MenuStructureComponent,
    path: ''
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuStructureRoutingModule { }
