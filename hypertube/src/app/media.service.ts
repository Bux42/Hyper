import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class MediaService {

    constructor(private http: HttpClient) { }

    fetchMedia(filters: any) {
        const params = new HttpParams()
            .set('mediaCategory', filters.MediaCategory)
            .set('page', filters.Page)
            .set('genre', filters.Genre)
            .set('keywords', filters.Keywords)
            .set('filter', filters.Filter);
        return (this.http.get<any>('http://localhost:3000/media-list', { params, withCredentials: true }));
    }
    fetchMediaEpisodes(filters: any) {
        const params = new HttpParams()
            .set('mediaCategory', filters.MediaCategory)
            .set('mediaId', filters.MediaId);
        return (this.http.get<any>('http://localhost:3000/media-episodes', { params, withCredentials: true }));
    }
    selectMedia(magnet: any, torrentFile: any, mediaId: any) {
        const params = new HttpParams()
            .set('magnetUrl', magnet)
            .set('torrentFile', torrentFile)
            .set('mediaId', mediaId);
        return (this.http.get<any>('http://localhost:3000/select-media', { params, withCredentials: true }));
    }
    getMediaState(magnet: any, torrentFile: any) {
        const params = new HttpParams()
            .set('torrentFile', torrentFile)
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
    fetchMediaSubtitlesImdb(mediaInfo: any) {
        const params = new HttpParams()
            .set('imdb_id', mediaInfo.imdb_id)
            .set('media_category', mediaInfo.media_category);
        return (this.http.get<any>('http://localhost:3000/get-subtitles-imdb', { params, withCredentials: true }));
    }
    fetchMediaSubtitlesSrc(mediaInfo: any) {
        const params = new HttpParams()
            .set('imdb_id', mediaInfo.imdb_id)
            .set('media_category', mediaInfo.media_category)
            .set('lang', mediaInfo.lang);
        return (this.http.get<any>('http://localhost:3000/get-subtitles-src', { params, withCredentials: true }));
    }
    fetchMovie(imdb_id: any) {
        const params = new HttpParams()
            .set('imdb_id', imdb_id);
        return (this.http.get<any>('http://localhost:3000/fetch-movie', { params, withCredentials: true }));
    }
    fetchShow(imdb_id: any) {
        const params = new HttpParams()
            .set('imdb_id', imdb_id);
        return (this.http.get<any>('http://localhost:3000/fetch-show', { params, withCredentials: true }));
    }

    /* UTILS */
    watchTimeToString(watch_time: any) {
        var ret = "";
        var watchTimeNum = parseInt(watch_time);
        var hours = 0;
        var mins = 0;
        while (watchTimeNum >= 3600) {
            hours++;
            watchTimeNum -= 3600;
        }
        while (watchTimeNum >= 60) {
            mins++;
            watchTimeNum -= 60;
        }
        if (hours) {
            ret += hours + "h";
        }
        if (mins) {
            ret += mins + "m";
        }
        if (watchTimeNum) {
            ret += watchTimeNum + "s";
        } else {
            ret += "0s";
        }
        return (ret);
    }
}
