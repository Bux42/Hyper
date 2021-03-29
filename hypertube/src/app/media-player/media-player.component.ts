import { Component, ElementRef, HostListener, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MediaService } from '../media.service';
import { UserService } from '../user.service';

export interface DialogData {
    resumeData: any;
}

@Component({
    selector: 'app-media-player',
    templateUrl: './media-player.component.html',
    styleUrls: ['./media-player.component.css']
})
export class MediaPlayerComponent implements OnInit {
    @Input() media: any;
    i: any = 0;
    showStats: any = false;
    timeStamp: any = "undefined";
    currentTime: any = "undefined";
    lastEvent: any = Date.now();

    @ViewChild('videoTag') videoTag: ElementRef | undefined;
    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        if (event) {
            if (event.key == "s") {
                this.showStats = !this.showStats;
            }
            if (event.key == "r") {
                var video = this.videoTag?.nativeElement;
                if (video) {
                    video.currentTime = 100;
                }
            }
        }
    }
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private userService: UserService, public dialog: MatDialog, private mediaService: MediaService) {
        this.media = data.media;
    }

    ngOnInit(): void {
        console.log(this.media);
        if (this.media.resume) {
            var resumeTime = this.mediaService.watchTimeToString(this.media.resume.watch_time);
            const dialogRef = this.dialog.open(ResumeDialog, {
                width: '250px',
                data: { resumeData: resumeTime }
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
                
                console.log('The dialog was closed', result);
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
            console.log("resumingTime:", resumingTime);
            this.lastEvent = Date.now()
            this.userService.setWatchTime(this.media._id, resumingTime).subscribe();
        }
    }
}

@Component({
    selector: 'resume-dialog',
    templateUrl: 'resume-dialog.html',
})
export class ResumeDialog {
    constructor(
        public dialogRef: MatDialogRef<ResumeDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

    onNoClick(): void {
        this.dialogRef.close();
    }
    resume(resume: any) {
        this.dialogRef.close(resume);
    }
}