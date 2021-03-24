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
    page = 1;
    loaded = false;
    loading = false;
    mediaItems: any[] = [];
    constructor(private mediaService: MediaService) { }

    ngOnInit(): void {
        var filters = {
            "MediaCategory": this.mediaCategory,
            "Page": this.page
        };
        this.mediaService.fetchMedia(filters).subscribe(data => {
            this.mediaItems = data;
            console.log(data);
            this.loaded = true;
        },
            error => {
                console.log(error);
            });
    }
    scrollToEnd() {
        if (!this.loading) {
            this.loading = true;
            this.page++;
            var filters = {
                "MediaCategory": this.mediaCategory,
                "Page": this.page
            };
            this.mediaService.fetchMedia(filters).subscribe(data => {
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
}
