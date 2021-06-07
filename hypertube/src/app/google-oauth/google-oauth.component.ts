import { Component, OnInit } from '@angular/core';
import { GoogleOauthService } from '../google-oauth.service';
import { LanguageService } from '../language.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-google-oauth',
  templateUrl: './google-oauth.component.html',
  styleUrls: ['./google-oauth.component.css']
})
export class GoogleOauthComponent implements OnInit {

  constructor(private userService: UserService, private googleOauth: GoogleOauthService, public languageService: LanguageService) { }

  ngOnInit(): void {
  }
  authenticate() {
      this.googleOauth.authenticate(this.userService).then(result => {
          console.log(result);
      });
  }
}
