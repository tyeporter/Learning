import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import OrderProduct from 'src/app/models/OrderProduct';
import Product from 'src/app/models/Product';

@Component({
    selector: 'app-cart-left',
    templateUrl: './cart-left.component.html',
    styleUrls: ['./cart-left.component.css']
})
export class CartLeftComponent implements OnInit {
    @Input() orderProducts: OrderProduct[] = [];
    @Output() quantityChange: EventEmitter<any> = new EventEmitter();
    @Output() removeClick: EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngOnInit(): void {
    }

    handleRemoveClick(product: Product): void {
        this.removeClick.emit(product);
    }

    handleQuantityChange(payload: {product: Product, quantity: number}): void {
        this.quantityChange.emit(payload);
    }
}
