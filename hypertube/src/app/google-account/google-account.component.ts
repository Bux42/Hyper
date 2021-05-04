import { Component, OnInit } from '@angular/core';
import { GoogleOauthService } from '../google-oauth.service';
import { LanguageService } from '../language.service';
import { UserService } from '../user.service';

@Component({
    selector: 'app-google-account',
    templateUrl: './google-account.component.html',
    styleUrls: ['./google-account.component.css']
})
export class GoogleAccountComponent implements OnInit {
    account: any = null;
    dselected: any = 'English';
    availableLanguages: string[] = ["English", "Français"];
    constructor(private userService: UserService, private googleOauth: GoogleOauthService, public languageService: LanguageService) { }

    ngOnInit(): void {
        this.account = this.userService.user.Account;
        if (this.account) {
            this.dselected = this.languageService.getLangCodeToLanguage(this.account.language);
        }
    }
    logout() {
        this.userService.logout().subscribe(() => {
            this.googleOauth.disconnect();
        });
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
}
