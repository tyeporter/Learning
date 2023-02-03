import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DataService } from '../../services/data.service';
import { DialogService } from '../../services/dialog.service';
import { BookComponent } from '../book/book.component';
import Home from './home';

@Component({
    selector: 'app-homes',
    templateUrl: './homes.component.html',
    styleUrls: ['./homes.component.css']
})
export class HomesComponent implements OnInit {

    public homes$!: Observable<Home[]>;

    constructor(
        private dataService: DataService,
        private dialogService: DialogService
    ) {}

    ngOnInit(): void {
        this.homes$ = this.dataService.getHomes$();
    }

    openDialog(home: Home) {
        this.dialogService.open(BookComponent, {
            width: '450px',
            data: { home }
        });
    }
}
