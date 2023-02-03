import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import Product from 'src/app/models/Product';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
    @Input() products: Product[] = [];
    @Output() addToCartClick: EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngOnInit(): void {
    }

    handleAddToCart(product: Product): void {
        this.addToCartClick.emit(product);
    }
}
