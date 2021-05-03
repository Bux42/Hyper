import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../language.service';
import { UserService } from '../user.service';

@Component({
    selector: 'app-media-categories',
    templateUrl: './media-categories.component.html',
    styleUrls: ['./media-categories.component.css']
})
export class MediaCategoriesComponent implements OnInit {

    constructor(public languageService: LanguageService) { }

    ngOnInit(): void {
    }
}
