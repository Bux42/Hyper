import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaCategoriesComponent } from './media-categories.component';

describe('MediaCategoriesComponent', () => {
    let component: MediaCategoriesComponent;
    let fixture: ComponentFixture<MediaCategoriesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MediaCategoriesComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MediaCategoriesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
