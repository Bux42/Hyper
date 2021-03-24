import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MediaDetailsEpisodesComponent } from '../media-details-episodes/media-details-episodes.component';
import { MediaDetailsComponent } from '../media-details/media-details.component';

@Component({
    selector: 'app-media-list-item',
    templateUrl: './media-list-item.component.html',
    styleUrls: ['./media-list-item.component.css']
})
export class MediaListItemComponent implements OnInit {
    @Input() media: any;
    @Input() mediaCategory: any;
    constructor(public dialog: MatDialog) { }

    ngOnInit(): void {
    }

    mediaMouseClick() {
        if (this.mediaCategory == "movies") {
            const dialogRef = this.dialog.open(MediaDetailsComponent, {
                width: '80vh',
                height: '80vh',
                data: {
                    media: this.media
                },
                panelClass: 'custom-dialog-container'
            });
        } else {
            const dialogRef = this.dialog.open(MediaDetailsEpisodesComponent, {
                width: '80vh',
                height: '80vh',
                data: {
                    media: this.media,
                    mediaCategory: this.mediaCategory
                },
                panelClass: 'custom-dialog-container'
            });
        }
    }
}
