import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
        const dialogRef = this.dialog.open(MediaDetailsComponent, {
            width: '70vh',
            height: '70vh',
            data: {
                media: this.media
            },
            panelClass: 'custom-dialog-container'
        });
    }

}
