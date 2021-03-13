import { Component, Input, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
    selector: 'app-media-details',
    templateUrl: './media-details.component.html',
    styleUrls: ['./media-details.component.css']
})
export class MediaDetailsComponent implements OnInit {
    @Input() media: any;
    resolutions: any[] = ["480p", "720p", "1080p", "2160p"];
    mediaResolutions: any[] = [];
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<MediaDetailsComponent>) { }

    ngOnInit(): void {
        this.media = this.data.media;
        console.log(this.media);
        this.resolutions.forEach((el) => {
            if (this.media.torrents.en[el]) {
                this.mediaResolutions.push(el);
            }
        })
        
    }

}
