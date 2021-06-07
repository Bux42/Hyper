import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    constructor(private _route: ActivatedRoute, private userService: UserService, private languageService: LanguageService) {
        
    }

    ngOnInit() {
        this.userService.getSession().subscribe(result => {
            if (result.userSession) {
                this.userService.user = result.userSession;
                this.languageService.setLanguage(this.userService.user.Account.language);
                this.userService.getUser().then((user) => {
                    this.backendAvailable = true;
                });
            } else {
                this._route.queryParams.subscribe(params => {
                    if (params.code) {
                        this.userService.oauth({
                            "AccountType": "School",
                            "Code": params.code
                        }).subscribe(result => {
                            window.location.replace("/");
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
                });
            }
        },
        error => {
            this.errorMessage = error.message;
            console.log(error);
        })
    }
}
