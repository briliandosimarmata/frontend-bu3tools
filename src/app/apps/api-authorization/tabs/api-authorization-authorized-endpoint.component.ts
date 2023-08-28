import { Component } from "@angular/core";
import { ApiAuthorizationService } from "../api-authorization.service";

@Component({
    selector: 'app-api-authorization-enpoint',
    templateUrl: 'api-authorization-authorized-endpoint.component.html'
}) export class ApiAuthorizationEndpointComponent{

    data !: any[];
    ids : String[] = [];
    item :any = {
                'uri': 'api/private/',
                'httpMethod': 'GET',
                'permission' : 'EXECUTE',
                'description' : ''
              };
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

    showModal = false;
    toggleModal(){
      this.showModal = !this.showModal;
    }

  setItem(data:any){
    this.item = data;
    this.toggleModal();
  }

  addItem(){
    this.item = {
      'uri': 'api/private/',
      'httpMethod': 'GET',
      'permission' : 'EXECUTE',
      'description' : ''
    };
    this.toggleModal();
  }

  isChecked(isSelected: Boolean, id: String) {
    if(isSelected){
      this.ids.push(id);
    }else{
      let itemIndex = this.ids.indexOf(id);
      this.ids.splice(itemIndex,1)
    }
    
    }

    deleteBatch() {
      this.service.deleteBatchEndpoint({'ids':this.ids}).subscribe()
    }
}