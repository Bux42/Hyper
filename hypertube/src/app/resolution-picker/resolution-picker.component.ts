import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MediaPlayerComponent } from '../media-player/media-player.component';
import { MediaService } from '../media.service';

@Component({
    selector: 'app-resolution-picker',
    templateUrl: './resolution-picker.component.html',
    styleUrls: ['./resolution-picker.component.css']
})
export class ResolutionPickerComponent implements OnInit {
    @Input() media: any;
    busy: any = false;
    resolutions: any[] = ["480p", "720p", "1080p", "2160p"];
    displayedColumns: string[] = ['resolution', 'size', 'seeds', 'peers', 'watch', 'state'];
    torrents: any[] = [];
    constructor(public dialogRef: MatDialogRef<ResolutionPickerComponent>, public dialog: MatDialog, private mediaService: MediaService) { }

    ngOnInit(): void {
        this.resolutions.forEach(res => {
            if (this.media.torrents.en[res]) {
                this.torrents.push({
                    "resolution": res,
                    "size": this.media.torrents.en[res].filesize,
                    "seeds": this.media.torrents.en[res].seed,
                    "peers": this.media.torrents.en[res].peer,
                    "state": "Idle"
                });
            }
        });
    }
    watch(el: any) {
        this.busy = true;
        el.state = "Check magnet";

        console.log(this.media.torrents.en[el.resolution].url);
        this.mediaService.selectMedia(this.media.torrents.en[el.resolution].url, this.media._id).subscribe(data => {
            console.log(data);
            var int = setInterval(() => {
                this.mediaService.getMediaState(this.media.torrents.en[el.resolution].url).subscribe(data => {
                    console.log(data);
                    if (data.ok) {
                        var buffer = data.progressPercent * 20;

                        if (buffer > 100) {
                            buffer = 100;
                        }
                        el.state = "Buffer: " + buffer.toFixed(2) + "%";
                        if (buffer == 100) {
                            this.busy = false;
                            clearInterval(int);
                            const dialogRef = this.dialog.open(MediaPlayerComponent, {
                                width: '70vh',
                                height: '70vh',
                                data: {
                                    media: this.media,
                                    selectedResolution: el.resolution
                                },
                                panelClass: 'custom-dialog-container'
                            });
                            dialogRef.afterClosed().subscribe(result => {
                                this.mediaService.playerClosed(this.media.torrents.en[el.resolution].url).subscribe(data => {
                                    console.log(data);
                                });
                            });
                        }
                    }
                });
            }, 500);
        });
    }
}
