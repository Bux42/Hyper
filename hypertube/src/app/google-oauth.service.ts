import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class GoogleOauthService {
    public gapiSetup: boolean = false; // marks if the gapi library has been loaded
    public authInstance!: gapi.auth2.GoogleAuth;
    public error!: string;
    public user!: gapi.auth2.GoogleUser;
    googleUser: any = null;

    constructor() { }

    async getUser() {
        return new Promise((resolve, reject) => {
            if (this.googleUser) {
                resolve(this.googleUser);
            } else {
                this.checkGoogleUser().then(isConnected => {
                    if (isConnected) {
                        resolve(this.googleUser);
                    } else {
                        resolve(null);
                    }
                })
            }
        });
    }
    async checkGoogleUser() {
        return (new Promise((resolve, reject) => {
            this.checkGoogle().then(() => {
                if (this.googleUser) {
                    resolve(true);
                }
                resolve(false);
            });
        }));
    }
    async checkGoogle() {
        if (await this.checkIfUserAuthenticated()) {
            this.googleUser = this.authInstance.currentUser.get();
        }
    }
    async checkIfUserAuthenticated(): Promise<boolean> {
        // Initialize gapi if not done yet
        if (!this.gapiSetup) {
            await this.initGoogleAuth();
        }
        return this.authInstance.isSignedIn.get();
    }
    async initGoogleAuth(): Promise<void> {
        //  Create a new Promise where the resolve function is the callback
        // passed to gapi.load
        const pload = new Promise((resolve) => {
            gapi.load('auth2', resolve);
        });

        // When the first promise resolves, it means we have gapi loaded
        // and that we can call gapi.init
        return pload.then(async () => {
            await gapi.auth2
                .init({ client_id: '330877404089-fv092abq9a4dnsfa1p93mb98ppdjpe7a.apps.googleusercontent.com' })
                .then(auth => {
                    this.gapiSetup = true;
                    this.authInstance = auth;
                });
        });
    }
    async authenticate(): Promise<gapi.auth2.GoogleUser> {
        // Initialize gapi if not done yet
        if (!this.gapiSetup) {
            await this.initGoogleAuth();
        }

        // Resolve or reject signin Promise
        return new Promise(async () => {
            await this.authInstance.signIn().then(
                user => {
                    this.user = user;
                    window.location.reload();
                },
                error => {
                    this.error = error;
                });
        });
    }
    disconnect() {
        this.authInstance.signOut();
        window.location.reload();
    }
}
