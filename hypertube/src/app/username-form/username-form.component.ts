import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
    selector: 'app-username-form',
    templateUrl: './username-form.component.html',
    styleUrls: ['./username-form.component.css']
})
export class UsernameFormComponent implements OnInit {
    usernameInput: any = "";
    usernameError: any = "";
    @Input() user: any;
    busy: any = false;
    constructor(private userService: UserService) { }

    ngOnInit(): void {
        console.log(this.user);
    }
    usernameInputChanged() {
        console.log(this.usernameInput);
        if (this.validUsername(this.usernameInput)) {
            this.usernameError = "";
        }
    }
    validUsername(username: any) {
        if (username.length < 3) {
            this.usernameError = "Username too short";
            return (false);
        } else if (username.length > 15) {
            this.usernameError = "Username too long";
            return (false);
        } else if (/^[A-Za-z0-9]+$/.test(username) == false) {
            this.usernameError = "Illegal characters";
            return (false);
        }
        return (true);
    }
    checkUsername() {
        this.busy = true;
        this.userService.checkUsername(this.usernameInput).subscribe(checkUsernameResult => {
            this.busy = false;
            console.log(checkUsernameResult);
            if (checkUsernameResult.Available) {
                this.usernameError = "";
                this.userService.setUsername(this.usernameInput, this.user.UserData.userId).subscribe(usernameSet => {
                    console.log(usernameSet);
                    if (usernameSet) {
                        window.location.reload();
                    }
                })
            } else {
                this.usernameError = checkUsernameResult.Error;
            }
        })
    }
}
