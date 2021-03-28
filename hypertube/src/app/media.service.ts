import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class MediaService {

    constructor(private http: HttpClient) { }

    fetchMedia(filters: any) {
        console.log(filters);
        const params = new HttpParams()
            .set('mediaCategory', filters.MediaCategory)
            .set('page', filters.Page)
            .set('genre', filters.Genre);
        return (this.http.get<any>('http://localhost:3000/media-list', { params, withCredentials: true }));
    }
    fetchMediaEpisodes(filters: any) {
        const params = new HttpParams()
            .set('mediaCategory', filters.MediaCategory)
            .set('mediaId', filters.MediaId);
        return (this.http.get<any>('http://localhost:3000/media-episodes', { params, withCredentials: true }));
    }
    selectMedia(magnet: any, mediaId: any) {
        const params = new HttpParams()
            .set('magnetUrl', magnet)
            .set('mediaId', mediaId);
        return (this.http.get<any>('http://localhost:3000/select-media', { params, withCredentials: true }));
    }
    getMediaState(magnet: any) {
        const params = new HttpParams()
            .set('magnetUrl', magnet);
        return (this.http.get<any>('http://localhost:3000/media-state', { params, withCredentials: true }));
    }
    playerClosed(magnet: any) {
        const params = new HttpParams()
            .set('magnetUrl', magnet);
        return (this.http.get<any>('http://localhost:3000/player-closed', { params, withCredentials: true }));
    }
    watchMedia() {
        return (this.http.get<any>('http://localhost:3000/watch-media', { withCredentials: true }));
    }
    
}
