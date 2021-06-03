import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LanguageService } from '../language.service';
import { MediaPlayerComponent } from '../media-player/media-player.component';
import { MediaService } from '../media.service';
import { UserService } from '../user.service';

@Component({
    selector: 'app-resolution-picker',
    templateUrl: './resolution-picker.component.html',
    styleUrls: ['./resolution-picker.component.css']
})
export class ResolutionPickerComponent implements OnInit, OnDestroy {
    @Input() media: any;
    @Input() show_imdb_id: any;
    @Input() episode_number: any;
    @Input() season_number: any;
    @Input() mediaCategory: any;
    busy: any = false;
    busyElement: any;
    mediaStateInterval: any;
    torrentUrl: any;
    torrentFile: any;
    resolutions: any[] = ["480p", "720p", "1080p", "2160p"];
    displayedColumns: string[] = ['resolution', 'size', 'seeds', 'peers', 'watch', 'state'];
    subtitlesList: string[] = ["none"];
    selectedSubtitles: string = "none";
    subtitlesSrc: any = null;
    torrents: any[] = [];
    constructor(public languageService: LanguageService, public dialogRef: MatDialogRef<ResolutionPickerComponent>, public dialog: MatDialog, private mediaService: MediaService, private userService: UserService) { }

    inputChanged() {
        this.subtitlesList = [];
        this.torrents = [];

        if (this.media.imdb_id) {
            if (this.userService.user && this.userService.user.WatchHistory) {
                this.media.resume = this.userService.user.WatchHistory.find((x: any) => x.media_id == this.media.imdb_id);
            }
            this.mediaService.fetchMediaSubtitlesImdb({
                imdb_id: this.media.imdb_id,
                media_category: this.mediaCategory
            }).subscribe(data => {
                Object.keys(data).forEach(el => {
                    this.subtitlesList.push(el);
                });
            })
        } else if (this.media.tvdb_id) {
            this.displayedColumns = ['resolution', 'seeds', 'peers', 'watch', 'state'];
            this.media.show_imdb_id = this.show_imdb_id;
            if (this.userService.user && this.userService.user.WatchHistoryShows) {
                this.media.resume = this.userService.user.WatchHistoryShows.find((x: any) => x.tvdb_id == this.media.tvdb_id);
            }
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

    ngOnChanges(changes: any) {
        this.inputChanged();
    }

    ngOnInit(): void {

    }
    ngOnDestroy(): void {
        this.cancelWatch(null);
    }
    subtitleChanged(e: any) {
        if (e != "none") {
            this.mediaService.fetchMediaSubtitlesSrc({
                imdb_id: this.media.imdb_id,
                media_category: this.mediaCategory,
                lang: e
            }).subscribe(data => {
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
            
        });
    }
    watch(el: any) {
        this.busy = true;
        this.busyElement = el;
        el.state = "Check magnet";
        el.buff = "0";

        if (this.media.tvdb_id) {
            this.media.show_imdb_id = this.show_imdb_id;
        }

        this.torrentUrl = this.media.torrents.en ? this.media.torrents.en[el.resolution].url : this.media.torrents[el.resolution].url;
        this.torrentFile = this.media.torrents.en ? this.media.torrents.en[el.resolution].file : this.media.torrents[el.resolution].file;
        this.mediaService.selectMedia(this.torrentUrl, this.torrentFile, this.media._id).subscribe(data => {
            this.mediaStateInterval = setInterval(() => {
                this.mediaService.getMediaState(this.torrentUrl, this.torrentFile).subscribe(data => {
                    if (!this.busyElement) {
                        clearInterval(this.mediaStateInterval);
                        return;
                    }
                    if (data.ok) {
                        var buffer = data.progressPercent * 10;
                        if (this.mediaCategory != "movies") {
                            buffer = data.progressPercent * 5;
                        }
                        if (buffer > 100) {
                            buffer = 100;
                        }
                        el.state = "Buffer: " + buffer.toFixed(2) + "%";
                        el.buff = buffer.toFixed(2);
                        if (buffer == 100) {
                            el.state = "Ready";
                            this.busy = false;
                            clearInterval(this.mediaStateInterval);
                            const dialogRef = this.dialog.open(MediaPlayerComponent, {
                                width: '70vh',
                                height: '70vh',
                                data: {
                                    torrentUrl: this.torrentUrl,
                                    torrentFile: this.torrentFile,
                                    media: this.media,
                                    selectedResolution: el.resolution,
                                    subtitles: this.subtitlesSrc,
                                    episode_number: this.episode_number,
                                    season_number: this.season_number
                                },
                                panelClass: 'custom-dialog-container'
                            });
                            this.userService.setMediaPlayerDialogRef(dialogRef);
                            dialogRef.afterClosed().subscribe(result => {
                                this.mediaService.playerClosed(this.torrentUrl).subscribe(data => {
                                    
                                });
                            });
                        }
                    }
                });
            }, 500);
        });
    }
}
