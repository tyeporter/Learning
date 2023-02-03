import {Product, Order, User} from '..';
import {OrderProduct, ProductCategory, UserSession} from '../auxiliary';

interface DataStorable<T> {
    add(item: T, options?:{protected:boolean}): Promise<T>;
    update(item: T, options?:{protected:boolean}): Promise<T | null>;
    delete(id: string | number, options?:{protected:boolean}): Promise<T | null>;
    getById(id: string | number, options?:{protected:boolean}): Promise<T | null>;
    getAll(options?:{protected:boolean}): Promise<T[]>;
    deleteAll(options?:{protected:boolean}): Promise<T[]>;

    // User Specific
    getUserByUsername?(username: string, options?:{protected:boolean}): Promise<User | null>;
    authenticate?(username: string, password: string): Promise<User | null>;
    addSession?(secret: string, userId: string): Promise<UserSession>;
    deleteSession?(secret: string, userId: string): Promise<UserSession | null>;
    getSession?(sessionId: number): Promise<UserSession | null>;
    getSessionForUser?(userId: string): Promise<UserSession | null>;
    getAllSessions?(): Promise<UserSession[]>;
    deleteAllSessions?(): Promise<UserSession[]>;

    // Product Specific
    getProductsByCategory?(categoryId: number, options?:{protected:boolean}): Promise<Product[]>;
    addCategory?(categoryName: string): Promise<ProductCategory>;
    deleteCategory?(categoryId: number): Promise<ProductCategory | null>;
    getCategory?(categoryId: number): Promise<ProductCategory | null>;
    getAllCategories?(): Promise<ProductCategory[]>;
    deleteAllCategories?(): Promise<ProductCategory[]>;

    // Order Specific
    getOrdersForUser?(userId: string, options?:{protected:boolean}): Promise<Order[]>;
    getActiveOrderForUser?(userId: string, options?:{protected:boolean}): Promise<Order>;
    getUserOrder?(orderId: number, userId: string, options?:{protected:boolean}): Promise<Order | null>;
    addProductToOrder?(quantity: number, orderId: number, productId: string): Promise<{name: string, quantity: number, price: number} | null>;
    removeProductFromOrder?(orderId: number, productId: string): Promise<{name: string, quantity: number, price: number} | null>;
    getProductsInOrder?(orderId: number): Promise<{name: string, quantity: number, price: number}[]>;
    deleteAllOrdersForUser?(userId: string, options?:{protected:boolean}): Promise<Order[]>;
    deleteAllProductsInOrder?(orderId: number): Promise<{name: string, quantity: number, price: number}[]>;
    getAllOrderProducts?(): Promise<OrderProduct[]>;
    deleteAllOrderProducts?(): Promise<OrderProduct[]>;
}

export default DataStorable;
