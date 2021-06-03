import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
    selector: 'app-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
    loading: any = false;

    email: any = "";
    emailError: any = "";

    password: any = "";
    passwordError: any = "";

    hide = true;
    constructor(private userService: UserService) { }

    ngOnInit(): void {
    }
    login() {
        this.userService.login({
            email: this.email,
            password: this.password
        }).subscribe(result => {
            
        })
    }
}
