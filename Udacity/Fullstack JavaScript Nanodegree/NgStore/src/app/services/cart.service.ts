import {Injectable, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import OrderProduct from '../models/OrderProduct';
import Product from '../models/Product';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private _storageId = 'ng_store_cart';
    private _items: Record<string, OrderProduct> = {};
    private _cartCount: Subject<number> = new Subject();
    private _cartTotal: Subject<number> = new Subject();

    constructor() { }

    addItemToCart(item: Product, quantity: number): void {
        console.log('item:', item);
        if (`+${item.id}` in this._items) {
            this._items[`+${item.id}`].quantity += quantity;
        } else {
            this._items[`+${item.id}`] = {
                product: item,
                quantity
            }
        }

        this._updateCount();
        this.updateTotal();
        this.saveCart();
    }

    removeItem(id: number): void {
        delete this._items[`+${id}`];
        this._updateCount();
        this.updateTotal();
        this.saveCart();
    }

    removeAllItems(): void {
        Object.keys(this._items).map((key: string) => delete this._items[key]);
        this._updateCount();
        this.updateTotal();
        this.saveCart();
    }

    updateQuantity(id: number, quantity: number): void {
        if (+quantity) {
            this._items[`+${id}`].quantity = quantity;
            this._updateCount();
            this.updateTotal();
            this.saveCart();
        }
    }

    getCartItems(): OrderProduct[] {
        return Object.values(this._items);
    }

    getCartCount(): Observable<number> {
        return this._cartCount.asObservable();
    }

    getCartTotal(): Observable<number> {
        return this._cartTotal.asObservable();
    }

    saveCart(): void {
        localStorage.setItem(this._storageId, JSON.stringify(this._items));
    }

    loadCart(): void {
        const data = localStorage.getItem(this._storageId);
        if (data) {
            this._items = JSON.parse(data);
            this._updateCount();
            this.updateTotal();
        }
    }

    private _updateCount(): void {
        this._cartCount.next(
            Object.values(this._items).reduce((total, current) => total += current.quantity, 0)
        );
    }

    updateTotal(): void {
        this._cartTotal.next(
            Object.values(this._items).reduce((total, current) => total += (current.product.price * current.quantity).round(2), 0)
        );
    }
}
