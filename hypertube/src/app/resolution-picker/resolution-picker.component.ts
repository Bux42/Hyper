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
    @Input() show_imdb_id: any;
    @Input() mediaCategory: any;
    busy: any = false;
    busyElement: any;
    mediaStateInterval: any;
    torrentUrl: any;
    resolutions: any[] = ["480p", "720p", "1080p", "2160p"];
    displayedColumns: string[] = ['resolution', 'size', 'seeds', 'peers', 'watch', 'state'];
    subtitlesList: string[] = ["none"];
    selectedSubtitles: string = "none";
    subtitlesSrc: any = null;
    torrents: any[] = [];
    constructor(public dialogRef: MatDialogRef<ResolutionPickerComponent>, public dialog: MatDialog, private mediaService: MediaService) { }

    ngOnInit(): void {
        console.log(this.media, this.mediaCategory);
        if (this.media.imdb_id) {
            this.mediaService.fetchMediaSubtitlesImdb({
                imdb_id: this.media.imdb_id,
                media_category: this.mediaCategory
            }).subscribe(data => {
                console.log(data);
                Object.keys(data).forEach(el => {
                    this.subtitlesList.push(el);
                });
            })
        } else if (this.media.tvdb_id) {
            console.log("that a show", this.show_imdb_id);
            this.media.show_imdb_id = this.show_imdb_id;
        }
        this.resolutions.forEach(res => {
            if (this.media.torrents.en && this.media.torrents.en[res]) {
                this.torrents.push({
                    "resolution": res,
                    "size": this.media.torrents.en[res].filesize,
                    "seeds": this.media.torrents.en[res].seed,
                    "peers": this.media.torrents.en[res].peer,
                    "state": "Unknown"
                });
            } else if (this.media.torrents[res]) {
                console.log(this.media.torrents[res]);
                this.torrents.push({
                    "resolution": res,
                    "size": this.media.torrents[res].filesize ? this.media.torrents[res].filesize : "?",
                    "seeds": this.media.torrents[res].seeds,
                    "peers": this.media.torrents[res].peers,
                    "state": "Unknown"
                });
            }

        });
    }
    subtitleChanged(e: any) {
        if (e != "none") {
            console.log(e);
            this.mediaService.fetchMediaSubtitlesSrc({
                imdb_id: this.media.imdb_id,
                media_category: this.mediaCategory,
                lang: e
            }).subscribe(data => {
                console.log("subtitlesSrc: ", data);
                this.subtitlesSrc = data.subPath;
            })
        } else {
            this.subtitlesSrc = null;
        }
    }
    cancelWatch(el: any) {
        clearInterval(this.mediaStateInterval);
        this.busy = false;
        this.busyElement = undefined;
        this.mediaService.playerClosed(this.torrentUrl).subscribe(data => {
            console.log(data);
        });
    }
    watch(el: any) {
        this.busy = true;
        this.busyElement = el;
        el.state = "Check magnet";

        this.torrentUrl = this.media.torrents.en ? this.media.torrents.en[el.resolution].url : this.media.torrents[el.resolution].url;
        console.log(this.torrentUrl);
        this.mediaService.selectMedia(this.torrentUrl, this.media._id).subscribe(data => {
            console.log(data);
            this.mediaStateInterval = setInterval(() => {
                this.mediaService.getMediaState(this.torrentUrl).subscribe(data => {
                    if (!this.busyElement) {
                        clearInterval(this.mediaStateInterval);
                        return;
                    }
                    console.log(data);

                    if (data.ok) {
                        var buffer = data.progressPercent * 20;
                        if (buffer > 100) {
                            buffer = 100;
                        }
                        el.state = "Buffer: " + buffer.toFixed(2) + "%";
                        if (buffer == 100) {
                            el.state = "Ready";
                            this.busy = false;
                            clearInterval(this.mediaStateInterval);
                            const dialogRef = this.dialog.open(MediaPlayerComponent, {
                                width: '70vh',
                                height: '70vh',
                                data: {
                                    media: this.media,
                                    selectedResolution: el.resolution,
                                    subtitles: this.subtitlesSrc
                                },
                                panelClass: 'custom-dialog-container'
                            });
                            dialogRef.afterClosed().subscribe(result => {
                                this.mediaService.playerClosed(this.torrentUrl).subscribe(data => {
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
