import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LanguageService } from '../language.service';
import { MediaDetailsEpisodesComponent } from '../media-details-episodes/media-details-episodes.component';
import { MediaDetailsComponent } from '../media-details/media-details.component';
import { MediaService } from '../media.service';
import { UserService } from '../user.service';

@Component({
    selector: 'app-watch-history',
    templateUrl: './watch-history.component.html',
    styleUrls: ['./watch-history.component.css']
})
export class WatchHistoryComponent implements OnInit {
    loadHistory: any = true;
    history: any[] = [];
    constructor(private userService: UserService, public dialog: MatDialog, public languageService: LanguageService, private mediaService: MediaService) { }

    ngOnInit(): void {
        var watchHistoryClean = this.userService.user.WatchHistory.filter((wh: any) => wh.watch_time > 0);
        watchHistoryClean.forEach((wh: any) => {
            this.mediaService.fetchMovie(wh.media_id).subscribe(res => {
                this.history.push({"Type": "movies", "Details": wh, "Data": res});
            })
        })
        this.userService.user.WatchHistoryShows.forEach((whs: any) => {
            this.mediaService.fetchShow(whs.imdb_id).subscribe(res => {
                var checkShow = this.history.find((x: any) => x.Data.imdb_id == whs.imdb_id);

                if (!checkShow) {
                    this.history.push({"Type": "shows", "Details": whs, "Data": res});
                }
            });
        });
        this.loadHistory = false;
    }

    historyItemClicked(historyItem: any) {
        console.log(historyItem);
        if (historyItem.Type == "movies") {
            const dialogRef = this.dialog.open(MediaDetailsComponent, {
                width: '80vh',
                height: '80vh',
                data: {
                    media: historyItem.Data,
                    mediaCategory: historyItem.Type
                },
                panelClass: 'custom-dialog-container'
            });
        } else {
            const dialogRef = this.dialog.open(MediaDetailsEpisodesComponent, {
                width: '90vh',
                height: '90vh',
                data: {
                    media: historyItem.Data,
                    mediaCategory: historyItem.Type
                },
                panelClass: 'custom-dialog-container'
            });
        }
    }

}
