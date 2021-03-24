import { Component, OnInit } from '@angular/core';
import { GoogleOauthService } from '../google-oauth.service';

@Component({
  selector: 'app-google-oauth',
  templateUrl: './google-oauth.component.html',
  styleUrls: ['./google-oauth.component.css']
})
export class GoogleOauthComponent implements OnInit {

  constructor(private googleOauth: GoogleOauthService) { }

  ngOnInit(): void {
  }
  authenticate() {
      this.googleOauth.authenticate();
  }
}
