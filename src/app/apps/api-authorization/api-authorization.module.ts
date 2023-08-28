import { NgModule } from "@angular/core";
import { ApiAuthorizationComponent } from "./api-authorization.component";
import { CommonModule } from "@angular/common";
import { ApiAuthorizationRoutingModule } from "./api-authorization.routing";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ApiAuthorizedComponent } from "./tabs/api-authorization-authorized.component";
import { ApiAuthorizationEndpointComponent } from "./tabs/api-authorization-authorized-endpoint.component";
import { ApiAuthorizationInputComponent } from "./api-authorization-input.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations : [ApiAuthorizationComponent, ApiAuthorizedComponent, ApiAuthorizationEndpointComponent, ApiAuthorizationInputComponent],
    imports : [
        CommonModule,
        ApiAuthorizationRoutingModule,
        FontAwesomeModule,
        ReactiveFormsModule,
        FormsModule
        ],
    exports : [ApiAuthorizationComponent],
    providers : [ApiAuthorizationComponent]

}) export class ApiAuthorizationModule{ }