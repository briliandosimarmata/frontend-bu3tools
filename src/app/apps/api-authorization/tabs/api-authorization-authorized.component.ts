import { Component } from '@angular/core';
import { ApiAuthorizationService } from '../api-authorization.service';

@Component({
    selector: 'app-api-authorization-authorized',
    templateUrl: 'api-authorization-authorized.component.html',
})
export class ApiAuthorizedComponent {
    data!: any[];

    constructor(private service: ApiAuthorizationService) {
        this.getDataEndpointModul()
     }

    getDataEndpointModul() {
        this.service.getListEndpointModul().subscribe({
            next: (res) => {
                console.log(res);
                if (res.data) {
                    
                    this.data = res.data;
                }
            },
        });
    }
}
