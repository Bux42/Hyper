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
            if (result.userSession) {
                console.log("userSession", result);
                this.userService.user = result.userSession;
                this.userService.getUser().then((user) => {
                    this.backendAvailable = true;
                });
            } else {
                this.userService.getUser().then((user) => {
                    console.log(user);
                    if (!user) {
                        this.backendAvailable = true;
                    } else {
                        this.userService.setUser(user).subscribe((userInfos) => {
                            console.log("setUser2", userInfos);
                            this.userService.user = userInfos.Account;
                            this.backendAvailable = true;
                        });
                    }
                    
                });
            }
        },
        error => {
            this.errorMessage = error.message;
            console.log(error);
        })
    }
}
