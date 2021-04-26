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
                    resolve({
                        "AccountType": "Google",
                        "UserData": googleUser
                    });
                } else {
                    resolve(null);
                }
            })
        });
    }
    setUser(user: any) {
        return (this.http.post<any>('http://localhost:3000/authenticate', user, { withCredentials: true }));
    }
    setUsername(username: any) {
        return (this.http.post<any>('http://localhost:3000/set-username', {username: username}, { withCredentials: true }));
    }
    checkUsername(username: any) {
        const params = new HttpParams()
            .set('username', username);
        return (this.http.get<any>('http://localhost:3000/check-username', { params, withCredentials: true }));
    }
    setShowWatchTime(tvdb_id: any, show_imdb_id: any, watchTime: any, userVolume: any, episode_number: any, season_number: any) {
        if (this.user && this.user.watchHistoryShows) {
            this.user.UserData.volume = userVolume;
            console.log("prevWH:", this.user.watchHistoryShows);
            var mediaResume = this.user.watchHistoryShows.find((x: any) => x.tvdb_id == tvdb_id);
            if (mediaResume) {
                mediaResume.watch_time = watchTime;
            } else {
                this.user.watchHistoryShows.push({
                    show_imdb_id: show_imdb_id,
                    media_id: tvdb_id,
                    watch_time: watchTime
                });
            }
            console.log("newWH:", this.user.watchHistory);
        }
        const params = new HttpParams()
            .set('tvdb_id', tvdb_id)
            .set('show_imdb_id', show_imdb_id)
            .set('user_volume', userVolume)
            .set('episode_number', episode_number)
            .set('season_number', season_number)
            .set('watch_time', watchTime);
        return (this.http.get<any>('http://localhost:3000/set-show-watch-time', { params, withCredentials: true }));
    }
    setWatchTime(media_id: any, watchTime: any, userVolume: any) {
        if (this.user && this.user.watchHistory) {
            this.user.UserData.volume = userVolume;
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
            .set('user_volume', userVolume)
            .set('watch_time', watchTime);
        return (this.http.get<any>('http://localhost:3000/set-watch-time', { params, withCredentials: true }));
    }
    register(form: any) {
        return (this.http.post<any>('http://localhost:3000/register', {
            firstName: form.firstName,
            lastName: form.lastName,
            username: form.username,
            emailInput: form.emailInput,
            password1: form.password1,
            password2: form.password2,
        }, { withCredentials: true }));
    }
    login(form: any) {
        return (this.http.post<any>('http://localhost:3000/login', {
            email: form.email,
            password: form.password
        }, { withCredentials: true }));
    }
    logout() {
        return (this.http.get<any>('http://localhost:3000/logout', {  withCredentials: true }));
    }
}
