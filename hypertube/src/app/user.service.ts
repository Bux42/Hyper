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
}
