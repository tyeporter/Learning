import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import Product from 'src/app/models/Product';

@Component({
    selector: 'app-product-right',
    templateUrl: './product-right.component.html',
    styleUrls: ['./product-right.component.css']
})
export class ProductRightComponent implements OnInit {
    @Input() product!: Product;
    quantity: number = 1;
    @Output() addToCartClick: EventEmitter<any> = new EventEmitter();
    @Output() buyNowClick: EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngOnInit(): void {
    }

    handleAddToCartClick(product: Product): void {
        const orderProduct = {
            product,
            quantity: this.quantity
        };
        this.addToCartClick.emit(orderProduct);
    }

    handleBuyItNowClick(product: Product): void {
        const orderProduct = {
            product,
            quantity: this.quantity
        };
        this.buyNowClick.emit(orderProduct);
    }
}
