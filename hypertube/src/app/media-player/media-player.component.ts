import { Component, ElementRef, HostListener, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MediaService } from '../media.service';
import { ResumeDialogComponent } from '../resume-dialog/resume-dialog.component';
import { UserService } from '../user.service';

export interface DialogData {
    resumeData: any;
}

@Component({
    selector: 'app-media-player',
    templateUrl: './media-player.component.html',
    styleUrls: ['./media-player.component.css']
})
export class MediaPlayerComponent implements OnInit, OnDestroy {
    @Input() media: any;
    @Input() subtitlesSrc: any;
    @Input() season_number: any;
    @Input() episode_number: any;
    torrentUrl: any = null;
    torrentFile: any = null;

    i: any = 0;
    showStats: any = false;
    playerOpened: any = true;
    timeStamp: any = "undefined";
    currentTime: any = "undefined";
    lastEvent: any = Date.now();
    currentVolume: any;
    mouseMoveInterval: any;

    showOverlay: any = false;

    @ViewChild('videoTag') videoTag: ElementRef | undefined;
    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        if (event) {
        }
    }
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private userService: UserService, public dialog: MatDialog, private mediaService: MediaService) {
        this.media = data.media;
        this.subtitlesSrc = data.subtitles;
        this.season_number = data.season_number;
        this.episode_number = data.episode_number;
        this.currentVolume = 0.5;
        this.torrentUrl = data.torrentUrl;
        this.torrentFile = data.torrentFile;
        if (this.userService.user) {
            this.currentVolume = this.userService.user.Account.volume;
        }
    }
    ngOnDestroy(): void {
        this.playerOpened = false;
    }

    ngOnInit(): void {
        if (this.media.episode) {
            this.episode_number = this.media.episode.toString();
        }
        if (this.media.season) {
            this.season_number = this.media.season.toString();
        }
        if (this.media.resume) {
            var resumeTime = this.mediaService.watchTimeToString(this.media.resume.watch_time);
            const dialogRef = this.dialog.open(ResumeDialogComponent, {
                width: '250px',
                data: { resumeData: resumeTime },
                panelClass: 'custom-resume-dialog-container'
            });

            dialogRef.afterClosed().subscribe(result => {
                var video = this.videoTag?.nativeElement;
                if (result) {
                    if (video) {
                        video.currentTime = this.media.resume.watch_time;
                    }
                }
                if (video) {
                    video.play();
                }
            });
        }
    }
    
    ngAfterViewInit() {
        //console.log(this.videoTag);
    }
    loaded(e: Event) {
        //console.log(e);
        this.timeStamp = e.timeStamp;
        this.currentTime = this.videoTag?.nativeElement.currentTime;
    }
    loadeddata(e: Event) {
        //console.log(e);
        this.timeStamp = e.timeStamp;
        this.currentTime = this.videoTag?.nativeElement.currentTime;
    }
    progress(e: Event) {
        //console.log(e);
        this.timeStamp = e.timeStamp;
        this.currentTime = this.videoTag?.nativeElement.currentTime;
    }
    timeupdate(e: Event) {
        //console.log(e);
        this.timeStamp = e.timeStamp;
        this.currentTime = this.videoTag?.nativeElement.currentTime;

        if (Date.now() - this.lastEvent > 5000 && parseInt(this.videoTag?.nativeElement.currentTime) > 10) {
            var resumingTime = parseInt(this.videoTag?.nativeElement.currentTime) - 5;
            this.lastEvent = Date.now();
            
            if (this.media._id) {
                if (!this.media.resume) {
                    this.media.resume = {
                        media_id: this.media._id,
                        watch_time: resumingTime
                    }
                } else {
                    this.media.resume.watch_time = resumingTime;
                }
                this.userService.setWatchTime(this.media._id, resumingTime, this.currentVolume).subscribe();
            } else {
                if (!this.media.resume) {
                    this.media.resume = {
                        date: Date.now(),
                        tvdb_id: this.media.tvdb_id,
                        watch_time: resumingTime,
                    }
                } else {
                    this.media.resume.watch_time = resumingTime;
                }
                this.userService.setShowWatchTime(this.media.tvdb_id, this.media.show_imdb_id, resumingTime, this.currentVolume, this.episode_number, this.season_number).subscribe();
            }
        }
    }
    volumeChanged(e: any) {
        if (this.videoTag) {
            this.currentVolume = this.videoTag?.nativeElement.volume;
        }
    }
    videoMouseMove(e: any) {
        clearInterval(this.mouseMoveInterval);
        var that = this;
        this.showOverlay = true;
        this.mouseMoveInterval = setTimeout(function() {
            that.showOverlay = false;
        }, 2500);
    }
    closePlayer() {
        this.userService.mediaPlayerDialogRef.close();
    }
}