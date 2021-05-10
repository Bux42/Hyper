import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../media-player/media-player.component';

@Component({
    selector: 'app-resume-dialog',
    templateUrl: './resume-dialog.component.html',
    styleUrls: ['./resume-dialog.component.css']
})
export class ResumeDialogComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<ResumeDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

    ngOnInit(): void {
    }
    onNoClick(): void {
        this.dialogRef.close();
    }
    resume(resume: any) {
        this.dialogRef.close(resume);
    }
}
