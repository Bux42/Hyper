import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-body',
    templateUrl: './body.component.html',
    styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {
    drawerOpened: any = false;
    constructor() { }

    ngOnInit(): void {
    }

    toggleDrawer() {
        this.drawerOpened = !this.drawerOpened;
    }
}