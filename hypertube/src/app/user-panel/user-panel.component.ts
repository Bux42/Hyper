import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
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

    emailLogin = new FormControl('', [Validators.required, Validators.email]);

    newLastName: any = "";
    newFirstName: any = "";
    newImg: any = "";
    newUsername: any = "";
    newEmail: any = "";
    previousPassword: any = "";
    newPassword: any = "";
    changeMailPassword: any = "";
    changePasswordPassword: any = "";
    newPasswordConfirm: any = "";
    hide: any = true;
    hide2: any = true;
    hide3: any = true;
    hide4: any = true;
    busy: any = false;
    updatedProfileErrors: any = {};
    updatedProfileSuccess: any = false;
    updatedEmailErrors: any = {};
    updatedEmailSuccess: any = false;
    updatedPasswordErrors: any = {};
    updatedPasswordSuccess: any = false;
    constructor(public languageService: LanguageService, private userService: UserService, private googleOauth: GoogleOauthService) { }

    ngOnInit(): void {
        this.account = this.userService.user.Account;
        if (this.account) {
            this.newLastName = this.account.last_name;
            this.newFirstName = this.account.first_name;
            this.newImg = this.account.img;
            this.newUsername = this.account.username;
            this.dselected = this.languageService.getLangCodeToLanguage(this.account.language);
            if (this.userService.user.AccountType == "Google") {
                this.svgPath = "/assets/google.svg";
            }
            if (this.userService.user.AccountType == "School") {
                this.svgPath = "/assets/42.svg";
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
    updateProfile() {
        this.busy = true;
        this.userService.updateProfile({
            newLastName: this.newLastName,
            newFirstName: this.newFirstName,
            newUsername: this.newUsername,
            newImg: this.newImg
        }).subscribe(result => {
            this.busy = false;
            this.updatedProfileErrors = result.Errors;
            if (result.UpdatedProfile) {
                this.updatedProfileSuccess = true;
                this.userService.user.Account.first_name = result.UpdatedProfile.first_name;
                this.userService.user.Account.last_name = result.UpdatedProfile.last_name;
                this.userService.user.Account.username = result.UpdatedProfile.username;
                this.userService.user.Account.img = result.UpdatedProfile.img;
                this.userService.updateTopBarImg();
                this.account = this.userService.user.Account;
            } else {
                this.updatedProfileSuccess = false;
            }
        })
    }
    updateEmail() {
        this.busy = true;
        this.userService.updateEmail({
            changeMailPassword: this.changeMailPassword,
            newEmail: this.newEmail
        }).subscribe(result => {
            this.busy = false;
            this.updatedEmailErrors = result.Errors;
            if (result.UpdatedProfile) {
                this.updatedEmailSuccess = true;
                this.userService.user.Account.email = result.UpdatedProfile.email;
                this.account = this.userService.user.Account;
            } else {
                this.updatedEmailSuccess = false;
            }
        })
    }
    updatePassword() {
        this.busy = true;
        this.userService.updatePassword({
            changePasswordPassword: this.changePasswordPassword,
            newPassword: this.newPassword,
            newPasswordConfirm: this.newPasswordConfirm
        }).subscribe(result => {
            this.busy = false;
            this.updatedPasswordErrors = result.Errors;
            if (result.UpdatedProfile) {
                this.updatedPasswordSuccess = true;
                this.account = this.userService.user.Account;
            } else {
                this.updatedPasswordSuccess = false;
            }
        })
    }
}
