import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CartLeftFormComponent} from './cart-left-form.component';

describe('CartLeftFormComponent', () => {
    let component: CartLeftFormComponent;
    let fixture: ComponentFixture<CartLeftFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CartLeftFormComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CartLeftFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
