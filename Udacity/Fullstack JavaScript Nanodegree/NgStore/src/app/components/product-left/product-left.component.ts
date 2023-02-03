import {Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'app-product-left',
    templateUrl: './product-left.component.html',
    styleUrls: ['./product-left.component.css']
})
export class ProductLeftComponent implements OnInit {
    @Input() imageUrl: string = '';

    constructor() { }

    ngOnInit(): void { }
}
