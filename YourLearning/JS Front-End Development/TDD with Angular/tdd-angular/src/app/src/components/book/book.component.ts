import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { DataService } from '../../services/data.service';

@Component({
    selector: 'app-book',
    templateUrl: './book.component.html',
    styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
    checkIn!: string;
    checkOut!: string;
    total!: number;

    constructor(
        public dialogRef: MatDialogRef<BookComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dataService: DataService,
        private _snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        console.log(this.data);
    }

    calculateTotal(checkIn: string, checkOut: string) {
        console.log(checkIn, checkOut);

        const checkInDate = moment(checkIn, 'MM-DD-YY');
        const checkOutDate = moment(checkOut, 'MM-DD-YY');
        const nights = checkOutDate.diff(checkInDate, 'days');

        if (!nights || nights < 0) {
            this.total = 0;
        } else {
            this.total = this.data.home.price * nights;
        }

        return this.total;
    }

    bookHome() {
        this.dataService.bookHome$().subscribe(() => {
            this.dialogRef.close();
            this._snackBar.open(this.total === 0 ? '❌ Invalid Dates. Try again' : '✅ Home Booked!', undefined, {
                duration: 3000
            });
        });
    }
}
