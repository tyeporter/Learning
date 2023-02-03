import {Injectable} from '@angular/core';
import Order from '../models/Order';
import {v4 as uuid} from 'uuid';

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private _storageId = 'ng_store_orders';
    private _orders: Record<string, Order> = {};

    constructor() { }

    generateOrder(customer: string, total: number): Order {
        const id = uuid();
        this._orders[id] = {id, customer, total};
        this.saveOrders();
        return this._orders[id];
    }

    getOrder(id: string): Order | null {
        return this._orders[id] || null;
    }

    saveOrders(): void {
        localStorage.setItem(this._storageId, JSON.stringify(this._orders));
    }

    loadOrders(): void {
        const data = localStorage.getItem(this._storageId);
        if (data) {
            this._orders = JSON.parse(data);
        }
    }
}
