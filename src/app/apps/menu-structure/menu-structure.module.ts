import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuStructureService } from './menu-structure.service';
import { HttpModule } from '../../http/http.module';
import { MenuStructureComponent } from './menu-structure.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MenuStructureRoutingModule } from './menu-structure-routing.module';

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
    FontAwesomeModule
  ],
  exports: [
    MenuStructureComponent
  ],
  providers: [
    MenuStructureService
  ]
})
export class MenuStructureModule { }
