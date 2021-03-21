import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'hypertube';
    backendAvailable: any = false;
    errorMessage: any = null;
    constructor(private userService: UserService) {}

    ngOnInit() {
        this.userService.pingBackend().subscribe(result => {
            this.backendAvailable = true;
        },
        error => {
            this.errorMessage = error.message;
            console.log(error);
        })
    }
}
