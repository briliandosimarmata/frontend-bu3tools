import { RouterModule, Routes } from "@angular/router";
import { ApiAuthorizationComponent } from "./api-authorization.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
    {
      path: '',
      component: ApiAuthorizationComponent,
    }
  ];

@NgModule({
    imports : [RouterModule.forChild(routes)],
    exports : [RouterModule]
}) export class ApiAuthorizationRoutingModule{}