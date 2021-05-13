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
    schoolUser: any = false;
    constructor(private userService: UserService) { }

    ngOnInit(): void {
        if (this.userService.user) {
            if (this.userService.user.Account.type == 'School') {
                this.schoolUser = true;
            }
            this.profilePic = this.userService.user.Account.img;
            if (this.profilePic.length == 0) {
                this.profilePic = "/assets/alphabet/" + this.userService.user.Account.first_name.toUpperCase()[0] + ".png";
            }
        }
    }
    emitDrawerToggle() {
        this.body?.toggleDrawer();
    }
}