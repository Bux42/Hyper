import { Component, Input, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MediaPlayerComponent } from '../media-player/media-player.component';
import { MediaService } from '../media.service';

@Component({
    selector: 'app-media-details',
    templateUrl: './media-details.component.html',
    styleUrls: ['./media-details.component.css']
})
export class MediaDetailsComponent implements OnInit {
    @Input() media: any;
    resolutions: any[] = ["480p", "720p", "1080p", "2160p"];
    mediaResolutions: any[] = [];
    selectedResolution: any = "";
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<MediaDetailsComponent>, public dialog: MatDialog, private mediaService: MediaService) { }

    ngOnInit(): void {
        this.media = this.data.media;
        console.log(this.media);
        this.resolutions.forEach((el) => {
            if (this.media.torrents.en[el]) {
                this.mediaResolutions.push(el);
                this.selectedResolution = el;
            }
        })
    }
    watch() {
        this.mediaService.selectMedia(this.media.torrents.en[this.selectedResolution].url).subscribe(data => {
            console.log(data);
            const dialogRef = this.dialog.open(MediaPlayerComponent, {
                width: '70vh',
                height: '70vh',
                data: {
                    media: this.media,
                    selectedResolution: this.selectedResolution
                },
                panelClass: 'custom-dialog-container'
            });
            dialogRef.afterClosed().subscribe(result => {
                this.mediaService.playerClosed(this.media.torrents.en[this.selectedResolution].url).subscribe(data => {
                    console.log(data);
                });
            });
        });

    }
    changeResolution(resolution: any) {
        this.selectedResolution = resolution
    }

}
