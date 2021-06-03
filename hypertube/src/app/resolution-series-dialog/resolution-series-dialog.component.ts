import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { LanguageService } from '../language.service';

export interface DialogData {
  selectedEpisode: any;
  media: any;
  episodeNumber : any;
  selectedSeason : any;
}

@Component({
  selector: 'app-resolution-series-dialog',
  templateUrl: './resolution-series-dialog.component.html',
  styleUrls: ['./resolution-series-dialog.component.css']
})
export class ResolutionSeriesDialogComponent {

  selectedEpisode: any;
  media: any;
  episodeNumber : any;
  selectedSeason : any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, public languageService: LanguageService) { 
      this.selectedEpisode = data.selectedEpisode, 
      this.media = data.media, 
      this.episodeNumber = data.episodeNumber, 
      this.selectedSeason = data.selectedSeason
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ResolutionSeriesDialogComponent, {
      width: '100%',
      data: {selectedEpisode: this.selectedEpisode, media: this.media, episodeNumber: this.episodeNumber, selectedSeason: this.selectedSeason }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.episodeNumber = result;
    });
  }

}
