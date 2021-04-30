import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-classic-account',
  templateUrl: './classic-account.component.html',
  styleUrls: ['./classic-account.component.css']
})
export class ClassicAccountComponent implements OnInit {
    account: any = null;
    dselected: any = null;
    constructor(private userService: UserService) { }

    ngOnInit(): void {
        this.account = this.userService.user.Account;
        this.dselected = this.account.language;
    }
    logout() {
        this.userService.logout().subscribe(() => {
            window.location.reload();
        });
    }

}