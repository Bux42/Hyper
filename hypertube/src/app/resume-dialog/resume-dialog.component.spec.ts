import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeDialogComponent } from './resume-dialog.component';

describe('ResumeDialogComponent', () => {
  let component: ResumeDialogComponent;
  let fixture: ComponentFixture<ResumeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumeDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
