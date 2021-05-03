import { Component, OnInit } from '@angular/core';
import { GoogleOauthService } from '../google-oauth.service';
import { LanguageService } from '../language.service';

@Component({
  selector: 'app-google-oauth',
  templateUrl: './google-oauth.component.html',
  styleUrls: ['./google-oauth.component.css']
})
export class GoogleOauthComponent implements OnInit {

  constructor(private googleOauth: GoogleOauthService, public languageService: LanguageService) { }

  ngOnInit(): void {
  }
  authenticate() {
      this.googleOauth.authenticate();
  }
}
