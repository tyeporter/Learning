import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import OrderProduct from 'src/app/models/OrderProduct';

@Component({
    selector: 'app-cart-left-form',
    templateUrl: './cart-left-form.component.html',
    styleUrls: ['./cart-left-form.component.css']
})
export class CartLeftFormComponent implements OnInit {
    @Input() orderProduct!: OrderProduct;
    quantity: number = 1;
    @Output() quantityChange: EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngOnInit(): void {
        this.quantity = this.orderProduct.quantity;
    }

    sanitizeInput(e: any): void {
        if (!e.key || isNaN(+e.key) || (+e.target.value === 0 && e.key === '0') || +e.target.value > 99) {
            e.preventDefault();
        }
    }

    handleQuantityChange(e: any): void {
        if (!this.quantity) {
            e.target.value = 1;
            this.quantity = 1;
        }

        const payload = {
            product: this.orderProduct.product,
            quantity: this.quantity
        }
        this.quantityChange.emit(payload);
    }
}
