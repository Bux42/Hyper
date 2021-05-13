import { Component, OnInit } from '@angular/core';
import { GoogleOauthService } from '../google-oauth.service';
import { LanguageService } from '../language.service';
import { UserService } from '../user.service';

@Component({
    selector: 'app-user-panel',
    templateUrl: './user-panel.component.html',
    styleUrls: ['./user-panel.component.css']
})
export class UserPanelComponent implements OnInit {
    account: any = null;
    dselected: any = 'English';
    svgPath: any = null;
    availableLanguages: string[] = ["English", "Français"];
    constructor(public languageService: LanguageService, private userService: UserService, private googleOauth: GoogleOauthService) { }

    ngOnInit(): void {
        this.account = this.userService.user.Account;
        if (this.account) {
            this.dselected = this.languageService.getLangCodeToLanguage(this.account.language);
            if (this.userService.user.AccountType == "Google") {
                this.svgPath = "/assets/google.svg";
            }
        }
    }
    languageChanged(language: string) {
        if (language) {
            let langCode = this.languageService.getLanguageToLangCode(language);
            this.userService.setLanguage(langCode).subscribe((result) => {
                if (result.Okay) {
                    this.languageService.setLanguage(langCode);
                }
            });
        }
    }
    logout() {
        this.userService.logout().subscribe(() => {
            if (this.userService.user.AccountType == "Google") {
                this.googleOauth.disconnect();
            }
            window.location.replace("/");
        });
    }
}
