import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-media-list-item',
  templateUrl: './media-list-item.component.html',
  styleUrls: ['./media-list-item.component.css']
})
export class MediaListItemComponent implements OnInit {
    @Input() media: any;
    @Input() mediaCategory: any;
  constructor() { }

  ngOnInit(): void {
  }

  mediaMouseClick() {
      
  }

}
