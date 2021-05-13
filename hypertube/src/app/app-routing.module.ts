import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { SchoolOauthComponent } from './school-oauth/school-oauth.component';

const routes: Routes = [{
    path: 'school-oauth', component: SchoolOauthComponent
}];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
