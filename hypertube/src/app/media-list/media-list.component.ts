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
    loaded = false;
    mediaItems: any = null;
    constructor(private mediaService: MediaService) { }

    ngOnInit(): void {
        var filters = {
            "MediaCategory": this.mediaCategory
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
}
