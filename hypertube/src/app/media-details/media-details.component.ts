import { Component, Input, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
    selector: 'app-media-details',
    templateUrl: './media-details.component.html',
    styleUrls: ['./media-details.component.css']
})
export class MediaDetailsComponent implements OnInit {
    @Input() media: any;
    @Input() mediaCategory: any;
    mediaGenres: any[] = [];
    count:any = 0;
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<MediaDetailsComponent>, public dialog: MatDialog) { }

    ngOnInit(): void {
        this.count = 0;
        this.media = this.data.media;
        this.mediaCategory = this.data.mediaCategory;
        this.mediaGenres = this.media.genres.join(" / ");
    }
    ngMouseMove(): void {
        this.count += 1;
    }
}
