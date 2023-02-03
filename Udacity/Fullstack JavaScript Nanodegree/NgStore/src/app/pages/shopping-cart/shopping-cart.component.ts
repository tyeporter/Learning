import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import OrderProduct from 'src/app/models/OrderProduct';
import {CartService} from 'src/app/services/cart.service';
import {OrderService} from 'src/app/services/order.service';
import {Router} from '@angular/router';
import {NotificationService} from 'src/app/services/notification.service';
import Product from 'src/app/models/Product';

@Component({
    selector: 'app-shopping-cart',
    templateUrl: './shopping-cart.component.html',
    styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
    cartItems: OrderProduct[] = [];
    cartTotal$: number = 0;
    totalSubscription!: Subscription;

    constructor(
        private cartService: CartService,
        private orderService: OrderService,
        private notificationService: NotificationService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.cartItems = this.cartService.getCartItems();
        this.totalSubscription = this.cartService.getCartTotal().subscribe((total: number) => {
            this.cartTotal$ = total;
        });
        this.cartService.updateTotal();
    }

    handleRemoveClick(product: Product): void {
        this.cartService.removeItem(product.id);
        this.cartItems = this.cartService.getCartItems();
        this.notificationService.showDangerNotification(
            'Item Removed! 🗑',
            `${product.name} removed from cart`
        );
    }

    handleCartLeftQuantityChange(payload: {product: Product, quantity: number}): void {
        this.cartService.updateQuantity(payload.product.id, payload.quantity);
        this.notificationService.showUpdateNotification(
            'Item Updated! 🔄',
            `${payload.product.name} quantity updated to ${payload.quantity}`
        );
    }

    handleCartRightFormSubmit(customer: {firstName: string, lastName: string}): void {
        const order = this.orderService.generateOrder(`${customer.firstName} ${customer.lastName}`, this.cartTotal$);
        this.cartService.removeAllItems();
        this.router.navigate(
            ['/order-confirmation'],
            {queryParams: {orderId: order.id}}
        );
    }

    ngOnDestroy(): void {
        this.totalSubscription.unsubscribe();
    }
}
