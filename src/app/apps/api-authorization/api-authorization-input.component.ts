import { Component, Input, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ApiAuthorizationService } from "./api-authorization.service";

@Component({
    selector: 'app-input-endpoint',
    templateUrl: 'api-authorization-input.component.html'
}) export class ApiAuthorizationInputComponent{

    parentForm !: FormGroup;
    @ViewChild("test") test:any;
    d: any;
    @Input() public data: any;
    constructor(private fb: FormBuilder,
                private service: ApiAuthorizationService){
        if(this.data){
            this.parentForm = this.fb.group({
                uri: [this.data.uri],
                httpMethod: [this.data.httpMethod],
                permission:[this.data.permission],
                description:[this.data.description]
            });
        }
        
    }

    saveEndpoint(data: any) {
        if(data.id){
            this.service.editEndpoint(data, data.id).subscribe({
                next : (res) => {
                    console.log(res.data);
                    
                }
            })
        }else{
            this.service.saveEndpoint(data).subscribe({
                next : (res) => {
                    console.log(res.data);
                    
                }
            })
        }
        
        // console.log(this.parentForm.valueChanges);
        console.log(data)
        
    }
}