import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
    selector: 'app-comment-list-item',
    templateUrl: './comment-list-item.component.html',
    styleUrls: ['./comment-list-item.component.css']
})
export class CommentListItemComponent implements OnInit {
    @Input() comment: any;
    profilePicUrl: any = "";
    username: any = "";
    schoolUser: any = false;
    constructor(private userService: UserService) { }

    ngOnInit(): void {
        this.comment.dateStr = this.userService.getRelativeTime(this.comment.date);
        this.userService.getUserInfos(this.comment.user_id).subscribe(result => {
            console.log(result);
            if (result.type == "School") {
                this.schoolUser = true;
            }
            this.profilePicUrl = result.profilePic;
            this.username = result.username;
        });
    }

}
