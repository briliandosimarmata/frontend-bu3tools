import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./apps/menu-structure/menu-structure.module').then(m => m.MenuStructureModule)
      },
      {
        path: 'api-authorization',
        loadChildren: () => import('./apps/api-authorization/api-authorization.module').then((m) => m.ApiAuthorizationModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
