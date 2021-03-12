import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { MediaCategoriesComponent } from './media-categories/media-categories.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';

import { MatTabsModule } from '@angular/material/tabs';
import { MediaListComponent } from './media-list/media-list.component';
import { MediaListItemComponent } from './media-list-item/media-list-item.component';
import { MediaDetailsComponent } from './media-details/media-details.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { UserPanelComponent } from './user-panel/user-panel.component';
import { BodyComponent } from './body/body.component';

@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    MediaCategoriesComponent,
    MediaListComponent,
    MediaListItemComponent,
    MediaDetailsComponent,
    UserPanelComponent,
    BodyComponent
  ],
  imports: [
    MatTabsModule,
    MatDialogModule,
    MatSidenavModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
