import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {CartService} from './services/cart.service';
import {OrderService} from './services/order.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'ngStore';
    cartCount$: number = 0;
    countSubscription!: Subscription;

    constructor(
        private cartService: CartService,
        private orderService: OrderService
    ) { }

    ngOnInit(): void {
        this.countSubscription = this.cartService.getCartCount().subscribe((count: number) => {
            this.cartCount$ = count;
        });
        this.cartService.loadCart();
        this.orderService.loadOrders();
    }

    ngOnDestroy(): void {
        this.countSubscription.unsubscribe();
    }
}
