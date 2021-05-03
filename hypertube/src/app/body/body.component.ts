import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
    selector: 'app-body',
    templateUrl: './body.component.html',
    styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {
    drawerOpened: any = false;
    user: any = null;
    constructor(private userService: UserService) { }

    ngOnInit(): void {
        this.user = this.userService.user;
    }

    toggleDrawer() {
        this.drawerOpened = !this.drawerOpened;
    }
}