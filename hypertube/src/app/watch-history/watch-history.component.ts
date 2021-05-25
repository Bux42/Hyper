import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
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
        this.fetchMovies().then(result => {
            this.fetchShows().then(result => {
                this.history.sort((a,b) => (a.Details.date < b.Details.date) ? 1 : ((b.Details.date < a.Details.date) ? -1 : 0));
                console.log(this.history);
                this.loadHistory = false;
            });
        });
    }
    updateWatchHistory() {
        this.fetchMovies().then(result => {
            this.fetchShows().then(result => {
                this.history.sort((a,b) => (a.Details.date < b.Details.date) ? 1 : ((b.Details.date < a.Details.date) ? -1 : 0));
                console.log(this.history);
                this.loadHistory = false;
            });
        });
    }

    async fetchShows() {
        const promises = this.userService.user.WatchHistoryShows.map((wh: any) => this.fetchShowPromise(wh.imdb_id));
        return await Promise.all(promises).then((results: any) => {
            results.forEach((result: any) => {
                var historyItem = {"Type": "shows", "Details": this.userService.user.WatchHistoryShows.find((x: any) => x.imdb_id == result.imdb_id), "Data": result};
                var checkShow = this.history.find((x: any) => x.Data.imdb_id == result.imdb_id);
                if (!checkShow) {
                    this.history.push(historyItem);
                } else {
                    console.log(checkShow, historyItem);
                }
            })
        });
    }

    async fetchMovies() {
        var watchHistoryClean = this.userService.user.WatchHistory.filter((wh: any) => wh.watch_time > 0);
        const promises = watchHistoryClean.map((wh: any) => this.fetchMoviePromise(wh.media_id));
        return await Promise.all(promises).then((results: any) => {
            results.forEach((result: any) => {
                var historyItem = {"Type": "movies", "Details": watchHistoryClean.find((x: any) => x.media_id == result.imdb_id), "Data": result};
                this.history.push(historyItem);
            })
        });
    }

    fetchShowPromise(media_id: any) {
        return (new Promise(resolve => {
            this.mediaService.fetchShow(media_id).subscribe(result => {
                resolve(result);
            })
        }));
    }

    fetchMoviePromise(media_id: any) {
        return (new Promise(resolve => {
            this.mediaService.fetchMovie(media_id).subscribe(result => {
                resolve(result);
            })
        }));
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
