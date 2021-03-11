import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class MediaService {

    constructor(private http: HttpClient) { }

    fetchMedia(filters: any) {
        const params = new HttpParams()
            .set('mediaCategory', filters.MediaCategory);
        return (this.http.get<any>('http://localhost:3000/media-list', { params, withCredentials: true }));
    }
}
