import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { spyOnClass } from 'jasmine-es6-spies';
import { of } from 'rxjs';
import { DataService } from '../../services/data.service';
import Home from '../homes/home';

import { BookComponent } from './book.component';

describe('BookComponent', () => {
    let component: BookComponent;
    let fixture: ComponentFixture<BookComponent>;
    let dialogData: { home: Home; };
    let dataService: jasmine.SpyObj<DataService>;
    let dialogService: jasmine.SpyObj<MatDialogRef<BookComponent>>;
    let snackService: jasmine.SpyObj<MatSnackBar>;

    const el = (querySelector: string) => {
        return fixture.nativeElement.querySelector(querySelector);
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                FormsModule,
                MatFormFieldModule,
                MatNativeDateModule,
                MatInputModule,
                MatDatepickerModule,
                BrowserAnimationsModule
            ],
            declarations: [BookComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: DataService, useFactory: () => spyOnClass(DataService) },
                { provide: MatDialogRef, useFactory: () => spyOnClass(MatDialogRef) },
                { provide: MatSnackBar, useFactory: () => spyOnClass(MatSnackBar) },
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(BookComponent);
        component = fixture.componentInstance;
    });

    beforeEach(() => {
        dialogData = TestBed.get(MAT_DIALOG_DATA);
        dataService = TestBed.get(DataService);
        dialogService = TestBed.get(MatDialogRef);
        snackService = TestBed.get(MatSnackBar);

        const homes = require('../../../../assets/homes.json');
        dialogData.home = homes[0];
        dataService.bookHome$.and.returnValue(of({}));

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show title', () => {
        expect(el('[data-test="title"]').textContent).toContain('Home 1');
    });

    it('should show price', () => {
        expect(el('[data-test="price"]').textContent).toContain('125');
    });

    it('should show check in date field', () => {
        expect(el('[data-test="check-in"]')).toBeTruthy();
    });

    it('should show check out date field', () => {
        expect(el('[data-test="check-out"]')).toBeTruthy();
    });

    it('should show total', () => {
        const checkInEl = el('[data-test="check-in"] mat-form-field input');
        const checkOutEl = el('[data-test="check-out"] mat-form-field input');

        checkInEl.value = '12/20/19';
        checkInEl.dispatchEvent(new Event('input'));

        checkOutEl.value = '12/23/19';
        checkOutEl.dispatchEvent(new Event('input'));

        fixture.detectChanges();

        expect(el('[data-test="total"]').textContent).toContain('375');
    });

    it('should show 0 for invalid total', () => {
        const checkInEl = el('[data-test="check-in"] mat-form-field input');
        const checkOutEl = el('[data-test="check-out"] mat-form-field input');

        checkInEl.value = '';
        checkInEl.dispatchEvent(new Event('input'));

        checkOutEl.value = '';
        checkOutEl.dispatchEvent(new Event('input'));

        fixture.detectChanges();

        expect(el('[data-test="total"]').textContent).toContain('$0.00');
    });

    it('should close the dialog and show notification after click book button', () => {
        el('[data-test="book-btn"]').firstChild.click();
        expect(dataService.bookHome$).toHaveBeenCalled();
        expect(dialogService.close).toHaveBeenCalled();
        expect(snackService.open).toHaveBeenCalled();
    });
});
