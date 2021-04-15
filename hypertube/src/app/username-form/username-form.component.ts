import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
    selector: 'app-username-form',
    templateUrl: './username-form.component.html',
    styleUrls: ['./username-form.component.css']
})
export class UsernameFormComponent implements OnInit {
    usernameInput: any = "";
    @Input() user: any;
    loading: any = false;
    busy: any = false;
    searchTimeout: any;
    constructor(private userService: UserService) { }

    ngOnInit(): void {
        console.log(this.user);
    }
    usernameInputChanged() {
        console.log(this.usernameInput);
        clearInterval(this.searchTimeout);
        var that = this;
        this.searchTimeout = setTimeout(function () {
            that.loading = true;

        }, 300);
    }
    checkUsername() {
        this.userService.checkUsername(this.usernameInput).subscribe(usernameAvailable => {
            console.log(usernameAvailable);
            if (usernameAvailable) {
                this.userService.setUsername(this.usernameInput, this.user.UserData.userId).subscribe(usernameSet => {
                    console.log(usernameSet);
                    if (usernameSet) {
                        window.location.reload();
                    }
                })
            }
        })
    }
}
