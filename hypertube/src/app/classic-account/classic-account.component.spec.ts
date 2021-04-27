import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassicAccountComponent } from './classic-account.component';

describe('ClassicAccountComponent', () => {
  let component: ClassicAccountComponent;
  let fixture: ComponentFixture<ClassicAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClassicAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassicAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
