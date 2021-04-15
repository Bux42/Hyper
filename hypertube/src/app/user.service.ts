import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GoogleOauthService } from './google-oauth.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    user: any = null;
    constructor(private http: HttpClient, private googleOauth: GoogleOauthService) { }

    pingBackend() {
        return (this.http.get<any>('http://localhost:3000/ping', { withCredentials: true }));
    }
    getUser() {
        return new Promise((resolve, reject) => {
            this.googleOauth.getUser().then(googleUser => {
                if (googleUser) {
                    this.user = { "AccountType": "Google", "UserData": googleUser };
                    resolve(this.user);
                } else {
                    resolve(null);
                }
            })
        });
    }
    setUser(user: any) {
        return (this.http.post<any>('http://localhost:3000/authenticate', user, { withCredentials: true }));
    }
    setUsername(username: any, userId: any) {
        return (this.http.post<any>('http://localhost:3000/set-username', {username: username, userId: userId}, { withCredentials: true }));
    }
    checkUsername(username: any) {
        const params = new HttpParams()
            .set('username', username);
        return (this.http.get<any>('http://localhost:3000/check-username', { params, withCredentials: true }));
    }
    setWatchTime(media_id: any, watchTime: any) {
        if (this.user && this.user.watchHistory) {
            console.log("prevWH:", this.user.watchHistory);
            var mediaResume = this.user.watchHistory.find((x: any) => x.media_id == media_id);
            if (mediaResume) {
                mediaResume.watch_time = watchTime;
            } else {
                this.user.watchHistory.push({
                    media_id: media_id,
                    watch_time: watchTime
                });
            }
            console.log("newWH:", this.user.watchHistory);
        }
        const params = new HttpParams()
            .set('mediaId', media_id)
            .set('watchTime', watchTime);
        return (this.http.get<any>('http://localhost:3000/set-watch-time', { params, withCredentials: true }));
    }
}
