import { Component, Input, OnInit } from '@angular/core';
import { LanguageService } from '../language.service';
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
    constructor(public userService: UserService, public languageService: LanguageService) { }

    ngOnInit(): void {
        this.userService.getComments(this.imdb_id).subscribe((result: any) => {
            this.comments = result;
            this.loadingComments = false;
        });
    }
    postComment() {
        this.commentError = "";
        if (this.comment.length > 0) {
            if (this.comment.length > 500) {
                this.commentError = "500 characters max";
            } else {
                this.userService.postComment(this.comment, this.imdb_id).subscribe((result: any) => {
                    if (!result.Error) {
                        this.comment = "";
                        this.comments.unshift(result.Comment);
                        this.commentError = "";
                    } else {
                        this.commentError = result.Error;
                    }
                });
            }
        }
    }
}
