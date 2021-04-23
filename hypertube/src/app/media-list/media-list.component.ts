import { Component, Input, OnInit } from '@angular/core';
import { MediaService } from '../media.service';

@Component({
    selector: 'app-media-list',
    templateUrl: './media-list.component.html',
    styleUrls: ['./media-list.component.css']
})
export class MediaListComponent implements OnInit {
    @Input() mediaCategory: any;
    @Input() media: any;
    tv_sh_error: any = "";
    searchInput: any = "";
    searchTimeout: any;
    page = 1;
    loaded = false;
    loading = false;
    mediaItems: any[] = [];
    sortByList: string[] = ["Trending", "Popularity", "Last Added", "Year", "Title", "Rating"];
    classicCategories: string[] = ["All", "Action", "Adventure", "Animation", "Comedy", "Crime", "Disaster", "Documentary", "Drama", "Eastern", "Family", "Fan-film", "Fantasy", "Film-noir", "History", "Holiday", "Horror", "Indie", "Music", "Mystery", "Road", "Romance", "Science-fiction", "Short", "Sports", "Sporting-event", "Suspense", "Thriller", "Tv-movie", "War", "Western"];
    animeCategories: string[] = ["All", "Action", "Ecchi", "Harem", "Romance", "School", "Supernatural", "Drama", "Comedy", "Mystery", "Police", "Sports", "Mecha", "Sci-Fi", "Slice of Life", "Fantasy", "Adventure", "Gore", "Music", "Psychological", "Shoujo Ai", "Yuri", "Magic", "Horror", "Thriller", "Gender Bender", "Parody", "Historical", "Racing", "Demons", "Samurai", "Super Power", "Military", "Dementia", "Mahou Shounen", "Game", "Martial Arts", "Vampire", "Kids", "Mahou Shoujo", "Space", "Shounen Ai"];
    categories: any = { "movies": this.classicCategories, "shows": this.classicCategories, "animes": this.animeCategories };
    selectedFilter: string = "Trending";
    selectedCategory: string = "All";

    constructor(private mediaService: MediaService) { }

    ngOnInit(): void {
        this.selectedCategory = this.classicCategories[0];
        this.tv_sh_error = "";
        this.mediaService.fetchMedia(this.getFilters()).subscribe(data => {
            this.mediaItems = data;
            console.log(data);
            this.loaded = true;
            if (data == null) {
                this.tv_sh_error = "tv-v2.api-fetch.sh unreachable";
            }
        },
            error => {
                console.log(error);
            });
    }
    searchInputChanged() {
        clearInterval(this.searchTimeout);
        var that = this;
        this.searchTimeout = setTimeout(function () {
            that.loading = true;
            that.mediaService.fetchMedia(that.getFilters()).subscribe(data => {
                that.mediaItems = data;
                that.loading = false;
            },
                error => {
                    console.log(error);
                });
        }, 300);
    }
    clearSearchInput() {
        console.log("clearSearchInput");
        this.page = 1;
        this.searchInput = "";
        this.loading = true;
        this.mediaService.fetchMedia(this.getFilters()).subscribe(data => {
            this.mediaItems = data;
            console.log(data);
            this.loading = false;
        },
            error => {
                console.log(error);
            });
    }
    scrollToEnd() {
        if (!this.loading) {
            this.loading = true;
            this.page++;
            this.mediaService.fetchMedia(this.getFilters()).subscribe(data => {
                data.forEach((element: any) => {
                    this.mediaItems.push(element);
                });
                this.loading = false;
            },
                error => {
                    console.log(error);
                });
        }
    }
    genreChanged(e: any) {
        this.page = 1;
        this.searchInput = "";
        this.loading = true;
        this.selectedCategory = e;
        this.mediaService.fetchMedia(this.getFilters()).subscribe(data => {
            this.mediaItems = data;
            console.log(data);
            this.loading = false;
        },
            error => {
                console.log(error);
            });
    }
    sortChanged(e: any) {
        this.page = 1;
        this.searchInput = "";
        this.loading = true;
        this.selectedFilter = e;
        this.mediaService.fetchMedia(this.getFilters()).subscribe(data => {
            this.mediaItems = data;
            console.log(data);
            this.loading = false;
        },
            error => {
                console.log(error);
            });
    }
    getFilters() {
        return ({
            "MediaCategory": this.mediaCategory,
            "Page": this.page,
            "Genre": this.selectedCategory.toLowerCase(),
            "Keywords": this.searchInput,
            "Filter": this.selectedFilter.toLowerCase()
        });
    }
}
