import {Component, Input, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    @Input() cartCount: number = 0;
    countSubscription!: Subscription;

    constructor() { }

    ngOnInit(): void {
    }
}
