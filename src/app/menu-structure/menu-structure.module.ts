import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuStructureService } from './menu-structure.service';
import { HttpModule } from '../http/http.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MenuStructureRoutingModule } from './menu-structure-routing.module';
import { MenuStructureComponent } from './menu-structure.component';
import { AutocompleteModule } from '../ui-component/autocomplete/autocomplete.module';

@NgModule({
  declarations: [
    MenuStructureComponent
  ],
  imports: [
    CommonModule,
    MenuStructureRoutingModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    AutocompleteModule
  ],
  exports: [
    MenuStructureComponent
  ],
  providers: [
    MenuStructureService
  ]
})
export class MenuStructureModule { }
