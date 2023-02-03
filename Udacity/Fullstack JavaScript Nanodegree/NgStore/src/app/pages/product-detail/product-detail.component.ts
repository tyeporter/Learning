import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import Product from 'src/app/models/Product';
import {ProductService} from 'src/app/services/product.service';
import {CartService} from 'src/app/services/cart.service';
import OrderProduct from 'src/app/models/OrderProduct';
import {NotificationService} from 'src/app/services/notification.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
    product$!: Product;

    constructor(
        private route: ActivatedRoute,
        private productService: ProductService,
        private cartService: CartService,
        private notificationService: NotificationService,
        private router: Router
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.params['id'] as number;
        const product = this.productService.getCachedProduct(id);

        if (!product) {
            this.productService.getProduct(id).subscribe((item: Product) => {
                this.product$ = item;
            });
        } else {
            this.product$ = product;
        }
    }

    handleAddToCartClick(orderProduct: OrderProduct): void {
        this.cartService.addItemToCart(orderProduct.product, orderProduct.quantity);
        let reference = orderProduct.product.name;
        if (reference.charAt(reference.length - 1) !== 's' && orderProduct.quantity > 1) {
            reference += 's';
        }
        this.notificationService.showSuccessNotification(
            'Item Added 🛍',
            `You added ${orderProduct.quantity} ${reference} to your cart`
        );
    }

    handleBuyItNowClick(orderProduct: OrderProduct): void {
        this.cartService.removeAllItems();
        this.cartService.addItemToCart(orderProduct.product, orderProduct.quantity);
        this.router.navigate(['/cart']);
    }
}
