import { Component, Input, OnInit } from '@angular/core';
import { LanguageService } from '../language.service';
import { UserService } from '../user.service';

@Component({
    selector: 'app-comment-list-item',
    templateUrl: './comment-list-item.component.html',
    styleUrls: ['./comment-list-item.component.css']
})
export class CommentListItemComponent implements OnInit {
    @Input() comment: any;
    userInfos: any = null;
    constructor(public languageService: LanguageService, private userService: UserService) { }

    ngOnInit(): void {
        this.comment.dateStr = this.userService.getRelativeTime(this.comment.date);
        this.userService.getUserInfos(this.comment.user_id).subscribe(result => {
            this.userInfos = result;
        });
    }

}
