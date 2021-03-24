import { Component, OnInit } from '@angular/core';
import { GoogleOauthService } from '../google-oauth.service';

@Component({
  selector: 'app-google-account',
  templateUrl: './google-account.component.html',
  styleUrls: ['./google-account.component.css']
})
export class GoogleAccountComponent implements OnInit {
    account: any = null;
  constructor(private googleOauth: GoogleOauthService) { }

  ngOnInit(): void {
      this.account = this.googleOauth.googleUser;
      console.log(this.account);
  }
  logout() {
    this.googleOauth.disconnect();
  }

}
