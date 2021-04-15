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
            this.userService.getUser().then((user) => {
                console.log(user);
                this.backendAvailable = true;
                this.userService.setUser(user).subscribe((userInfos) => {
                    console.log(userInfos);
                    this.userService.user.UserData.username = userInfos.account.username
                    this.userService.user.UserData.userId = userInfos.account.userId;
                    if (this.userService.user) {
                        this.userService.user.watchHistory = userInfos.watchHistory;
                    }
                });
            })
        },
        error => {
            this.errorMessage = error.message;
            console.log(error);
        })
    }
}
