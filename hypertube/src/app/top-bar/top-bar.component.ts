import { Component, Input, OnInit } from '@angular/core';
import { BodyComponent } from '../body/body.component';
import { UserService } from '../user.service';

@Component({
    selector: 'app-top-bar',
    templateUrl: './top-bar.component.html',
    styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {
    @Input() body: BodyComponent | undefined;
    profilePic: any = "/assets/profile-user.svg";
    constructor(private userService: UserService) { }

    ngOnInit(): void {
        if (this.userService.user) {
            console.log(this.userService.user); 
            this.profilePic = this.userService.user.Account.img;
        }
    }
    emitDrawerToggle() {
        this.body?.toggleDrawer();
    }
}