import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GoogleOauthService } from './google-oauth.service';
import { BodyComponent } from './body/body.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { WatchHistoryComponent } from './watch-history/watch-history.component';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    user: any = null;
    body: any;
    topBar: any;
    watchHistory: any;
    mediaPlayerDialogRef: any;
    constructor(private http: HttpClient, private googleOauth: GoogleOauthService) { }

    getSession() {
        return (this.http.get<any>('http://localhost:3000/auth/session', { withCredentials: true }));
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
        return (this.http.post<any>('http://localhost:3000/get-user', user, { withCredentials: true }));
    }
    setUsername(username: any) {
        return (this.http.post<any>('http://localhost:3000/set-username', { username: username }, { withCredentials: true }));
    }
    checkUsername(username: any) {
        const params = new HttpParams()
            .set('username', username);
        return (this.http.get<any>('http://localhost:3000/check-username', { params, withCredentials: true }));
    }
    recoverPassword(email: any) {
        const params = new HttpParams()
            .set('email', email);
        return (this.http.get<any>('http://localhost:3000/recover-password', { params, withCredentials: true }));
    }
    changePassword(form: any) {
        return (this.http.post<any>('http://localhost:3000/change-password', { form: form }, { withCredentials: true }));
    }
    checkRecoveryCode(form: any) {
        return (this.http.post<any>('http://localhost:3000/check-recovery-code', { form: form }, { withCredentials: true }));
    }
    setShowWatchTime(tvdb_id: any, show_imdb_id: any, watchTime: any, userVolume: any, episode_number: any, season_number: any) {
        if (this.user && this.user.WatchHistoryShows) {
            this.user.Account.volume = userVolume;
            var mediaResume = this.user.WatchHistoryShows.find((x: any) => x.tvdb_id == tvdb_id);
            if (mediaResume) {
                mediaResume.watch_time = watchTime;
                mediaResume.date = Date.now();
            } else {
                this.user.WatchHistoryShows.push({
                    imdb_id: show_imdb_id,
                    tvdb_id: tvdb_id,
                    watch_time: watchTime,
                    date: Date.now(),
                    season_number: season_number,
                    episode_number: episode_number
                });
            }
            var mediaResume = this.user.WatchHistory.find((x: any) => x.media_id == show_imdb_id);
            if (!mediaResume) {
                this.user.WatchHistory.push({
                    media_id: show_imdb_id,
                    watch_time: 0,
                    date: Date.now()
                });
            } else {
                mediaResume.date = Date.now();
            }
            this.updateWatchHistory();
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
        if (this.user && this.user.WatchHistory) {
            this.user.Account.volume = userVolume;
            var mediaResume = this.user.WatchHistory.find((x: any) => x.media_id == media_id);
            if (mediaResume) {
                mediaResume.watch_time = watchTime;
                mediaResume.date = Date.now();
            } else {
                this.user.WatchHistory.push({
                    media_id: media_id,
                    watch_time: watchTime,
                    date: Date.now()
                });
            }
            this.updateWatchHistory();
        }
        const params = new HttpParams()
            .set('mediaId', media_id)
            .set('user_volume', userVolume)
            .set('watch_time', watchTime);
        return (this.http.get<any>('http://localhost:3000/set-watch-time', { params, withCredentials: true }));
    }
    setLanguage(langCode: string) {
        return (this.http.post<any>('http://localhost:3000/set-language', {
            langCode: langCode
        }, { withCredentials: true }));
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
        return (this.http.get<any>('http://localhost:3000/logout', { withCredentials: true }));
    }
    getLatestSeenEpisode(imdb_id: any): any {
        var watchHistoryClean = this.user.WatchHistoryShows.filter((wh: any) => wh.imdb_id == imdb_id);

        if (watchHistoryClean.length > 0) {
            var lastestEpisode = watchHistoryClean[0];
            for (var i = 0; i < watchHistoryClean.length; i++) {
                if (watchHistoryClean[i].season_number > lastestEpisode.season_number) {
                    lastestEpisode = watchHistoryClean[i];
                } else if (watchHistoryClean[i].episode_number > lastestEpisode.episode_number) {
                    lastestEpisode = watchHistoryClean[i];
                }
            }
            return (lastestEpisode);
        } else {
            return (null);
        }
    }
    getComments(imdb_id: any): any {
        const params = new HttpParams()
            .set('imdb_id', imdb_id);
        return (this.http.get<any>('http://localhost:3000/get-comments', { params, withCredentials: true }));
    }
    postComment(comment: any, imdb_id: any): any  {
        return (this.http.post<any>('http://localhost:3000/post-comment', {
            comment: comment,
            imdb_id: imdb_id
        }, { withCredentials: true }));
    }
    getRelativeTime(date: any) {
        var delta = Math.round((+new Date - date) / 1000);

        var minute = 60,
            hour = minute * 60,
            day = hour * 24,
            week = day * 7;

        var fuzzy;

        if (delta < 30) {
            fuzzy = 'just then.';
        } else if (delta < minute) {
            fuzzy = delta + ' seconds ago.';
        } else if (delta < 2 * minute) {
            fuzzy = 'a minute ago.'
        } else if (delta < hour) {
            fuzzy = Math.floor(delta / minute) + ' minutes ago.';
        } else if (Math.floor(delta / hour) == 1) {
            fuzzy = '1 hour ago.'
        } else if (delta < day) {
            fuzzy = Math.floor(delta / hour) + ' hours ago.';
        } else if (delta < day * 2) {
            fuzzy = 'yesterday';
        } else if (delta < day * 8) {
            fuzzy = parseInt((delta / day).toString()) +  ' days ago'
        }
        return (fuzzy);
    }
    getUserInfos(user_id: any) {
        const params = new HttpParams()
            .set('user_id', user_id);
        return (this.http.get<any>('http://localhost:3000/get-user-infos', { params, withCredentials: true }));
    }
    checkSchoolLogin(code: any) {
        return (this.http.post<any>('http://localhost:3000/school-login', {
            code: code
        }, { withCredentials: true }));
    }
    updateProfile(form: any) {
        return (this.http.post<any>('http://localhost:3000/update-profile', {
            form: form
        }, { withCredentials: true }));
    }
    updateEmail(form: any) {
        return (this.http.post<any>('http://localhost:3000/update-email', {
            form: form
        }, { withCredentials: true }));
    }
    updatePassword(form: any) {
        return (this.http.post<any>('http://localhost:3000/update-password', {
            form: form
        }, { withCredentials: true }));
    }
    setBody(body: BodyComponent | undefined) {
        this.body = body;
    }
    setMediaPlayerDialogRef(dialogRef: any) {
        this.mediaPlayerDialogRef = dialogRef;
    }
    toggleBodyDrawer() {
        this.body?.toggleDrawer();
    }
    setTopBar(topBar: TopBarComponent | undefined) {
        this.topBar = topBar;
    }
    updateTopBarImg() {
        this.topBar?.profileImgUpdate();
    }
    setWatchHistory(watchHistory: WatchHistoryComponent | undefined) {
        this.watchHistory = watchHistory;
    }
    updateWatchHistory() {
        this.watchHistory?.updateWatchHistory();
    }

    // NEW ROUTES

    oauth(form: any) {
        return (this.http.post<any>('http://localhost:3000/auth/oauth', {
            form: form
        }, { withCredentials: true }));
    }
}