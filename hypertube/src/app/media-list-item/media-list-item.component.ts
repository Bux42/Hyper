import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MediaDetailsEpisodesComponent } from '../media-details-episodes/media-details-episodes.component';
import { MediaDetailsComponent } from '../media-details/media-details.component';
import { UserService } from '../user.service';

@Component({
    selector: 'app-media-list-item',
    templateUrl: './media-list-item.component.html',
    styleUrls: ['./media-list-item.component.css']
})
export class MediaListItemComponent implements OnInit {
    @Input() media: any;
    @Input() mediaCategory: any;
    svgRatingPaths: any[] = [];
    constructor(public dialog: MatDialog, private userService: UserService) { }

    ngOnInit(): void {
        if (this.userService.user && this.userService.user.WatchHistory) {
            this.media.resume = this.userService.user.WatchHistory.find((x: any) => x.media_id == this.media._id);
        }
        for (var i = 0; i < 5; i++) {
            var percent = (this.media.rating.percentage / 10) / 2;
            if (percent > i + 0.5) {
                this.svgRatingPaths.push("/assets/star.svg");
            } else if (percent > i) {
                this.svgRatingPaths.push("/assets/star-half.svg");
            } else {
                this.svgRatingPaths.push("/assets/star-empty.svg");
            }
        }
    }

    mediaMouseClick() {
        if (!this.userService.user) {
            this.userService.toggleBodyDrawer();
            return;
        }
        if (this.mediaCategory == "movies") {
            const dialogRef = this.dialog.open(MediaDetailsComponent, {
                width: '90%',
                height: '80vh',
                data: {
                    media: this.media,
                    mediaCategory: this.mediaCategory
                },
                panelClass: 'custom-dialog-container'
            });
        } else {
            const dialogRef = this.dialog.open(MediaDetailsEpisodesComponent, {
                width: '90%',
                height: '90vh',
                data: {
                    media: this.media,
                    mediaCategory: this.mediaCategory
                },
                panelClass: 'custom-dialog-container'
            });
        }
    }
}
