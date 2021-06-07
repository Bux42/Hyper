import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-school-oauth',
  templateUrl: './school-oauth.component.html',
  styleUrls: ['./school-oauth.component.css']
})
export class SchoolOauthComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  schoolOauthClicked() {
      window.location.replace('https://api.intra.42.fr/oauth/authorize?client_id=419b5a8b20bcd909cf60fb0d28679f3857d1e7682904cc169b8ec7be6ed72412&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fschool-oauth&response_type=code');
  }
}
