import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
    selector: 'app-comment-list',
    templateUrl: './comment-list.component.html',
    styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent implements OnInit {
    @Input() imdb_id: any;
    comments: any[] = [];
    loadingComments: any = true;
    comment: any = "";
    commentError: any = "";
    constructor(public userService: UserService) { }

    ngOnInit(): void {
        console.log(this.imdb_id);
        this.userService.getComments(this.imdb_id).subscribe((result: any) => {
            console.log(result);
            this.comments = result;
            this.loadingComments = false;
        });
    }
    postComment() {
        console.log(this.comment);
        this.userService.postComment(this.comment, this.imdb_id).subscribe((result: any) => {
            console.log(result);
            if (!result.Error) {
                this.comments.unshift(result.Comment);
                this.commentError = "";
            } else {
                this.commentError = result.Error;
            }
        });
    }
}
