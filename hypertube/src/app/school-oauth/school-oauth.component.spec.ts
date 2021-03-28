import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolOauthComponent } from './school-oauth.component';

describe('SchoolOauthComponent', () => {
  let component: SchoolOauthComponent;
  let fixture: ComponentFixture<SchoolOauthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolOauthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolOauthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
