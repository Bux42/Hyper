import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { MediaCategoriesComponent } from './media-categories/media-categories.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { MediaListComponent } from './media-list/media-list.component';
import { MediaListItemComponent } from './media-list-item/media-list-item.component';
import { MediaDetailsEpisodesComponent } from './media-details-episodes/media-details-episodes.component';
import { MediaDetailsComponent } from './media-details/media-details.component';
import { UserPanelComponent } from './user-panel/user-panel.component';
import { BodyComponent } from './body/body.component';
import { MediaPlayerComponent } from './media-player/media-player.component';
import { StickyHeaderDirective } from './sticky-header.directive';
import { GoogleOauthComponent } from './google-oauth/google-oauth.component';
import { SchoolOauthComponent } from './school-oauth/school-oauth.component';
import { ResolutionPickerComponent } from './resolution-picker/resolution-picker.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { UsernameFormComponent } from './username-form/username-form.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { WatchHistoryComponent } from './watch-history/watch-history.component';
import { ResumeDialogComponent } from './resume-dialog/resume-dialog.component';
import { CommentListComponent } from './comment-list/comment-list.component';
import { CommentListItemComponent } from './comment-list-item/comment-list-item.component';
import { ResolutionSeriesDialogComponent } from './resolution-series-dialog/resolution-series-dialog.component';


@NgModule({
    declarations: [
        AppComponent,
        TopBarComponent,
        MediaCategoriesComponent,
        MediaListComponent,
        MediaListItemComponent,
        MediaDetailsComponent,
        UserPanelComponent,
        BodyComponent,
        MediaDetailsEpisodesComponent,
        MediaPlayerComponent,
        StickyHeaderDirective,
        GoogleOauthComponent,
        SchoolOauthComponent,
        ResolutionPickerComponent,
        RegisterFormComponent,
        UsernameFormComponent,
        LoginFormComponent,
        WatchHistoryComponent,
        ResumeDialogComponent,
        CommentListComponent,
        CommentListItemComponent,
        ResolutionSeriesDialogComponent
    ],
    imports: [
        MatTabsModule,
        MatDialogModule,
        MatSidenavModule,
        MatButtonToggleModule,
        MatExpansionModule,
        MatButtonModule,
        MatChipsModule,
        MatGridListModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatDividerModule,
        MatSelectModule,
        MatInputModule,
        MatIconModule,
        MatCardModule,
        MatSnackBarModule,
        MatTableModule,
        MatMenuModule,
        HttpClientModule,
        ScrollingModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        InfiniteScrollModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
