import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MediaService } from '../media.service';

@Component({
    selector: 'app-media-details-episodes',
    templateUrl: './media-details-episodes.component.html',
    styleUrls: ['./media-details-episodes.component.css']
})

export class MediaDetailsEpisodesComponent implements OnInit {
    @Input() media: any;
    @Input() mediaCategory: any;
    selectedSeason: any;
    selectedEpisode: any;
    mediaEpisodes: any;
    seasons: any = [];
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<MediaDetailsEpisodesComponent>, private mediaService: MediaService) { }

    ngOnInit(): void {
        this.media = this.data.media;
        this.mediaCategory = this.data.mediaCategory;

        var filters = {
            "MediaCategory": this.mediaCategory,
            "MediaId": this.media._id
        };
        console.log(this.mediaCategory);
        this.mediaService.fetchMediaEpisodes(filters).subscribe(data => {
            this.mediaEpisodes = data;
            console.log(this.mediaEpisodes);

            for (var i = 0; i < this.mediaEpisodes.episodes.length; i++) {
                var season = this.seasons.find((x: { season: any; }) => x.season == this.mediaEpisodes.episodes[i].season);
                if (!season) {
                    this.seasons.push({ "season": this.mediaEpisodes.episodes[i].season, "episodes": [this.mediaEpisodes.episodes[i]] });
                } else {
                    season.episodes.push(this.mediaEpisodes.episodes[i]);
                }
            }
            this.seasons.sort(function (a: { season: number; }, b: { season: number; }) { return (a.season > b.season) ? 1 : ((b.season > a.season) ? -1 : 0); });
            this.selectedSeason = this.seasons[0];
            this.selectedEpisode = this.selectedSeason.episodes[0];

            for (var i = 0; i < this.seasons.length; i++) {
                this.seasons[i].episodes.sort(function (a: { episode: number; }, b: { episode: number; }) { return (a.episode > b.episode) ? 1 : ((b.episode > a.episode) ? -1 : 0); });
            }
            this.selectedEpisode = this.selectedSeason.episodes[0];
            console.log(this.seasons);
        },
            error => {
                console.log(error);
            });
    }
    switchSeason(season: any) {
        console.log(season);
        this.selectedSeason = this.seasons.find((x: any) => x.season == season);
        this.selectedEpisode = this.selectedSeason.episodes[0];
    }
    selectEpisode(episode: any) {
        console.log(episode);
    }
}
