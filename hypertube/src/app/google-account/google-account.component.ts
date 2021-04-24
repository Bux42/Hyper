import { Component, OnInit } from '@angular/core';
import { GoogleOauthService } from '../google-oauth.service';
import { UserService } from '../user.service';

@Component({
    selector: 'app-google-account',
    templateUrl: './google-account.component.html',
    styleUrls: ['./google-account.component.css']
})
export class GoogleAccountComponent implements OnInit {
    account: any = null;
    dselected: any = 'English';
    constructor(private userService: UserService, private googleOauth: GoogleOauthService) { }

    ngOnInit(): void {
        this.account = this.userService.user.Account;
        this.dselected = "English";
        console.log("print account")
        console.log(this.account)
        console.log("print selected")
        console.log(this.dselected)
    }
    logout() {
        this.userService.logout().subscribe(() => {
            this.googleOauth.disconnect();
        });
    }
}
