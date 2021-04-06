import { Component, OnInit } from '@angular/core';
import { GoogleOauthService } from '../google-oauth.service';

@Component({
  selector: 'app-google-account',
  templateUrl: './google-account.component.html',
  styleUrls: ['./google-account.component.css']
})
export class GoogleAccountComponent implements OnInit {
  account: any = null;
  dselected: any = 'English';
  constructor(private googleOauth: GoogleOauthService) { }

  ngOnInit(): void {
      this.account = this.googleOauth.googleUser
      this.dselected= "English";
      console.log("print account")
      console.log(this.account)
      console.log("print selected")
      console.log(this.dselected)
  }
  logout() {
    this.googleOauth.disconnect();
  }

}
