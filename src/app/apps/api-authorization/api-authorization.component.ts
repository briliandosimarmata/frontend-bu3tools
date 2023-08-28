import { Component } from "@angular/core";
import { ApiAuthorizationService } from "./api-authorization.service";

@Component({
    selector: 'app-api-authorization',
    templateUrl: './api-authorization.component.html'
}) export class ApiAuthorizationComponent {
    openTab = 1;
    data !:Object[];
    toggleTabs($tabNumber: number) {
        this.openTab = $tabNumber;
    }

    showModal = false;
  toggleModal(){
    this.showModal = !this.showModal;
  }
    constructor(private service:ApiAuthorizationService) { 
      this.getDataEndpoint();
    }

  getDataEndpoint(){
    this.service.getListEndpoint().subscribe({
      next: (res) => {
        if(res.data){
          this.data = res.data;
        }
      }
    })
  }
}