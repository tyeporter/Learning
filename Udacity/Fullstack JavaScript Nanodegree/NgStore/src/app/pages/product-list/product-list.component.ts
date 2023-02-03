import {Component, OnInit} from '@angular/core';
import Product from 'src/app/models/Product';
import {ProductService} from 'src/app/services/product.service';
import {CartService} from 'src/app/services/cart.service';
import {NotificationService} from 'src/app/services/notification.service';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
    products$: Product[] = [];

    constructor(
        private productService: ProductService,
        private cartService: CartService,
        private notificationService: NotificationService
    ) { }

    ngOnInit(): void {
        this.productService.getProducts().subscribe((products: Product[]) => {
            this.products$ = products;
            this.productService.generateCache(products);
        });
    }

    handleAddToCartClick(product: Product): void {
        this.cartService.addItemToCart(product, 1);
        this.notificationService.showSuccessNotification(
            'Item Added! 🛍',
            `You added 1 ${product.name} to your cart`
        );
    }
}
