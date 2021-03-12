import { Component, Input, OnInit } from '@angular/core';
import { BodyComponent } from '../body/body.component';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {
    @Input() body: BodyComponent | undefined;
  constructor() { }

  ngOnInit(): void {
  }
  emitDrawerToggle() {
    this.body?.toggleDrawer();
  }

}
