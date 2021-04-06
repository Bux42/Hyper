import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolutionPickerComponent } from './resolution-picker.component';

describe('ResolutionPickerComponent', () => {
  let component: ResolutionPickerComponent;
  let fixture: ComponentFixture<ResolutionPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResolutionPickerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResolutionPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
