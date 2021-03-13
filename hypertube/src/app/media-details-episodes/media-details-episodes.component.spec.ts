import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaDetailsEpisodesComponent } from './media-details-episodes.component';

describe('MediaDetailsEpisodesComponent', () => {
  let component: MediaDetailsEpisodesComponent;
  let fixture: ComponentFixture<MediaDetailsEpisodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaDetailsEpisodesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaDetailsEpisodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
