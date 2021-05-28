import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolutionSeriesDialogComponent } from './resolution-series-dialog.component';

describe('ResolutionSeriesDialogComponent', () => {
  let component: ResolutionSeriesDialogComponent;
  let fixture: ComponentFixture<ResolutionSeriesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResolutionSeriesDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResolutionSeriesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
