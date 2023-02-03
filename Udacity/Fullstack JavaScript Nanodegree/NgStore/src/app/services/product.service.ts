import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import Product from '../models/Product';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private _products: Record<number, Product> = {};

    constructor(private http: HttpClient) { }

    generateCache(products: Product[]): void {
        for (let product of products) {
            this._products[product.id] = product;
        }
    }

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>('assets/products.json');
    }

    getCachedProduct(id: number): Product | undefined {
        return this._products[id];
    }

    getProduct(id: number): Observable<Product> {
        return this.http.get<Product>(`assets/products/${id}.json`);
    }
}
