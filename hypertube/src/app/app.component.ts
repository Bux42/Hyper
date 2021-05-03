import { Component, OnInit } from '@angular/core';
import { LanguageService } from './language.service';
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
    constructor(private userService: UserService, private languageService: LanguageService) {}

    ngOnInit() {
        this.userService.pingBackend().subscribe(result => {
            if (result.userSession) {
                this.userService.user = result.userSession;
                this.languageService.setLanguage(this.userService.user.Account.language);
                this.userService.getUser().then((user) => {
                    this.backendAvailable = true;
                });
            } else {
                this.userService.getUser().then((user) => {
                    if (!user) {
                        this.backendAvailable = true;
                    } else {
                        this.userService.setUser(user).subscribe((userInfos) => {
                            this.userService.user = userInfos.Account;
                            this.languageService.setLanguage(this.userService.user.Account.language);
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
