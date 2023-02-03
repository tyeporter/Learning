import {Order, Product, User} from '..';
import {OrderProduct, ProductCategory, UserSession} from '../auxiliary';
import Dependable from './Dependable';

interface BusinessUsable<T> {
    add(dependencies: Dependable<T>): {execute: (item: T, options?:{protected:boolean}) => Promise<T>};
    update(dependencies: Dependable<T>): {execute: (item: T, options?:{protected:boolean}) => Promise<T | null>};
    delete(dependencies: Dependable<T>): {execute: (id: string | number, options?:{protected:boolean}) => Promise<T | null>};
    getById(dependencies: Dependable<T>): {execute: (id: string | number, options?:{protected:boolean}) => Promise<T | null>};
    getAll(dependencies: Dependable<T>): {execute: (options?:{protected:boolean}) => Promise<T[]>};
    deleteAll(dependencies: Dependable<T>): {execute: (options?:{protected:boolean}) => Promise<T[]>};

    // User Specific
    getUserByUsername?(dependencies: Dependable<User>): {execute: (username: string, options?:{protected:boolean}) => Promise<User | null>};
    authenticate?(dependencies: Dependable<User>): {execute: (username: string, password: string) => Promise<User | null>};
    addSession?(dependencies: Dependable<User>): {execute: (secret: string, userId: string) => Promise<UserSession>};
    deleteSession?(dependencies: Dependable<User>): {execute: (secret: string, userId: string) => Promise<UserSession | null>};
    getSession?(dependencies: Dependable<User>): {execute: (sessionId: number) => Promise<UserSession | null>};
    getSessionForUser?(dependencies: Dependable<User>): {execute: (userId: string) => Promise<UserSession | null>};
    getAllSessions?(dependencies: Dependable<User>): {execute: () => Promise<UserSession[]>};
    deleteAllSessions?(dependencies: Dependable<User>): {execute: () => Promise<UserSession[]>};

    // Product Specific
    getProductsByCategory?(dependencies: Dependable<Product>): {execute: (categoryId: number, options?:{protected:boolean}) => Promise<Product[]>};
    addCategory?(dependencies: Dependable<Product>): {execute: (categoryName: string) => Promise<ProductCategory>};
    deleteCategory?(dependencies: Dependable<Product>): {execute: (categoryId: number) => Promise<ProductCategory | null>};
    getCategory?(dependencies: Dependable<Product>): {execute: (categoryId: number) => Promise<ProductCategory | null>};
    getAllCategories?(dependencies: Dependable<Product>): {execute: () => Promise<ProductCategory[]>};
    deleteAllCategories?(dependencies: Dependable<Product>): {execute: () => Promise<ProductCategory[]>};

    // Order Specific
    getOrdersForUser?(dependencies: Dependable<Order>): {execute: (userId: string, options?:{protected:boolean}) => Promise<Order[]>};
    getActiveOrderForUser?(dependencies: Dependable<Order>): {execute: (userId: string, options?:{protected:boolean}) => Promise<Order>};
    getUserOrder?(dependencies: Dependable<Order>): {execute: (orderId: number, userId: string, options?:{protected:boolean}) => Promise<Order | null>};
    addProductToOrder?(dependencies: Dependable<Order>): {execute: (quantity: number, orderId: number, productId: string) => Promise<{name: string, quantity: number, price: number} | null>};
    removeProductFromOrder?(dependencies: Dependable<Order>): {execute: (orderId: number, productId: string) => Promise<{name: string, quantity: number, price: number} | null>};
    getProductsInOrder?(dependencies: Dependable<Order>): {execute: (orderId: number) => Promise<{name: string, quantity: number, price: number}[]>};
    deleteAllOrdersForUser?(dependencies: Dependable<Order>): {execute: (userId: string, options?:{protected:boolean}) => Promise<Order[]>};
    deleteAllProductsInOrder?(dependencies: Dependable<Order>): {execute: (orderId: number) => Promise<{name: string, quantity: number, price: number}[]>};
    getAllOrderProducts?(dependencies: Dependable<Order>): {execute: () => Promise<OrderProduct[]>};
    deleteAllOrderProducts?(dependencies: Dependable<Order>): {execute: () => Promise<OrderProduct[]>};
};

export default BusinessUsable;
