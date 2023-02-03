import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { spyOnClass } from 'jasmine-es6-spies';
import { DataService } from '../../services/data.service';
import { DialogService } from '../../services/dialog.service';
import { HomesComponent } from './homes.component';

describe('HomesComponent', () => {
    let component: HomesComponent;
    let fixture: ComponentFixture<HomesComponent>;
    let dataService: jasmine.SpyObj<DataService>;
    let dialogService: jasmine.SpyObj<DialogService>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HomesComponent],
            providers: [
                { provide: DataService, useFactory: () => spyOnClass(DataService) },
                { provide: DialogService, useFactory: () => spyOnClass(DialogService) }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HomesComponent);
        component = fixture.componentInstance;
    });

    beforeEach(() => {
        dataService = TestBed.get(DataService)
        dialogService = TestBed.get(DialogService);

        const homes = require('../../../../assets/homes.json');
        dataService.getHomes$.and.returnValue(of(homes));

        fixture.detectChanges();
    });

    it('should show homes', () => {
        expect(fixture.nativeElement.querySelectorAll('[data-test="home"]').length).toBe(3);
    });

    it('should show home info', () => {
        const home = fixture.nativeElement.querySelector('[data-test="home"]');
        expect(home.querySelector('[data-test="title"]').innerText).toEqual('Home 1')
        expect(home.querySelector('[data-test="location"]').innerText).toEqual('NEW YORK');
        expect(home.querySelector('[data-test="image"]')).toBeTruthy();
    });

    it('should show book button', () => {
        const home = fixture.nativeElement.querySelector('[data-test="home"]');
        expect(home.querySelector('[data-test="book-btn"]').innerText).toBeTruthy();
    });

    it('should use dialogue service to open a dialogue when clicking on the book button', () => {
        // Get the button
        const bookButton = fixture.nativeElement.querySelector('[data-test="home"] button');
        // Click the button
        bookButton.click();
        // Assert dialog service  wa used to open dialog
        expect(dialogService.open).toHaveBeenCalled();
    });
});
