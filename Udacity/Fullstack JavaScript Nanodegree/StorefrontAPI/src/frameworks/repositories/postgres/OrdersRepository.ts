import {Order, Product} from '../../../entities';
import {OrderProduct} from '../../../entities/auxiliary';
import {OrderStatus} from '../../../entities/enums';
import {DataStorable} from '../../../entities/protocols';
import {PostgresDatabase} from '../../databases/postgres';

const selectClause = 'SELECT id, status, user_id AS "userId"';
const returningClause = 'RETURNING id, status, user_id AS "userId"';
const orderProductSelectClause = 'SELECT id, quantity, order_id AS "orderId", product_id AS "productId"';
const orderProductReturningClause = 'RETURNING id, quantity, order_id AS "orderId", product_id AS "productId"';
const protectify = (order: Order): Order => {
    delete order.userId;
    return order;
};

const OrdersRepository: DataStorable<Order> = {
    async add(order: Order, options?): Promise<Order> {
        const {status,userId} = order;
        try {
            const conn = await PostgresDatabase.connect();
            const result = await conn.query(
                `INSERT INTO orders (status, user_id) VALUES ($1, $2) ${returningClause}`,
                [status,userId]
            );
            conn.release();
            const _order = result.rows[0];
            if (options?.protected) return protectify({..._order});
            return _order;
        } catch (error) {
            throw new Error('Error while adding order');
        }
    },
    async update(order: Order, options?): Promise<Order | null> {
        const {id,status,userId} = order;
        try {
            const conn = await PostgresDatabase.connect();
            const result = await conn.query(
                `UPDATE orders SET status = ($1) WHERE id = ($2) AND user_id = ($3) ${returningClause}`,
                [status,id,userId]
            );
            conn.release();

            if (!result.rows.length) return null;

            const _order = result.rows[0];
            if (options?.protected) return protectify({..._order});
            return _order;
        } catch (error) {
            throw new Error('Error while updating order');
        }
    },
    async delete(id: string | number, options?): Promise<Order | null> {
        try {
            const conn = await PostgresDatabase.connect();
            const result = await conn.query(
                `DELETE FROM orders WHERE id = ($1) ${returningClause}`,
                [id]
            );
            conn.release();

            if (!result.rows.length) return null;

            const _order = result.rows[0];
            if (options?.protected) return protectify({..._order});
            return _order;
        } catch (error) {
            throw new Error('Error while deleting order');
        }
    },
    async getById(id: number, options?): Promise<Order | null> {
        try {
            const conn = await PostgresDatabase.connect();
            const result = await conn.query(
                `${selectClause} FROM orders WHERE id = ($1)`,
                [id]
            );
            conn.release();

            if (!result.rows.length) return null;

            const order = result.rows[0];
            if (options?.protected) return protectify({...order});
            return order;
        } catch (error) {
            throw new Error('Error while getting order by id');
        }
    },
    async getAll(options?): Promise<Order[]> {
        try {
            const conn = await PostgresDatabase.connect();
            const result = await conn.query(`${selectClause} FROM orders`);
            conn.release();
            if (options?.protected) {
                return result.rows.map((order: Order) => protectify({...order}));
            }
            return result.rows;
        } catch (error) {
            throw new Error('Error while getting all orders');
        }
    },
    async deleteAll(options?): Promise<Order[]> {
        try {
            const conn = await PostgresDatabase.connect();
            const result = await conn.query(`DELETE FROM orders ${returningClause}`);
            conn.release();
            if (options?.protected) {
                return result.rows.map((order: Order) => protectify({...order}));
            }
            return result.rows;
        } catch (error) {
            throw new Error('Error while deleting all orders');
        }
    },
    async getOrdersForUser(userId: string, options?): Promise<Order[]> {
        try {
            const conn = await PostgresDatabase.connect();
            const result = await conn.query(
                `${selectClause} FROM orders WHERE user_id = ($1)`,
                [userId]
            );
            conn.release();
            if (options?.protected) {
                return result.rows.map((order: Order) => protectify({...order}));
            }
            return result.rows;
        } catch (error) {
            throw new Error('Error while getting orders for user');
        }
    },
    async getActiveOrderForUser(userId: string, options?): Promise<Order> {
        try {
            const conn = await PostgresDatabase.connect();
            let result = await conn.query(
                `${selectClause} FROM orders WHERE user_id = ($1) AND status = ($2)`,
                [userId,OrderStatus.Active]
            );

            if (!result.rows.length) {
                result = await conn.query(
                    `INSERT INTO orders (status, user_id) VALUES ($1, $2) ${returningClause}`,
                    [OrderStatus.Active,userId]
                );
            }

            conn.release();
            const order = result.rows[0];
            if (options?.protected) return protectify({...order});
            return order;
        } catch (error) {
            throw new Error('Error while getting active order for user');
        }
    },
    async getUserOrder(orderId: number, userId: string, options?): Promise<Order | null> {
        try {
            const conn = await PostgresDatabase.connect();
            const result = await conn.query(
                `${selectClause} FROM orders WHERE id = ($1) AND user_id = ($2)`,
                [orderId,userId]
            );
            conn.release();

            if (!result.rows.length) return null;

            const order = result.rows[0];
            if (options?.protected) return protectify({...order});
            return order;
        } catch (error) {
            throw new Error('Error while getting user order');
        }

    },
    async addProductToOrder(quantity: number, orderId: number, productId: string): Promise<{name: string, quantity: number, price: number} | null> {
        try {
            const conn = await PostgresDatabase.connect();
            let result = await conn.query(
                'SELECT * FROM products WHERE id = ($1)',
                [productId]
            );

            if (!result.rows.length) return null;
            const product = result.rows[0] as Product;

            result = await conn.query(
                `${orderProductSelectClause} FROM order_products WHERE order_id = ($1) AND product_id = ($2)`,
                [orderId,productId]
            );

            let orderProduct: OrderProduct;
            if (result.rows.length) {
                orderProduct = result.rows[0];
                result = await conn.query(
                    `UPDATE order_products SET quantity = ($1) WHERE order_id = ($2) AND product_id = ($3) ${orderProductReturningClause}`,
                    [orderProduct.quantity+quantity,orderId,productId]
                );
                orderProduct = result.rows[0];
            } else {
                result = await conn.query(
                    `INSERT INTO order_products (quantity, order_id, product_id) VALUES ($1, $2, $3) ${orderProductReturningClause}`,
                    [quantity,orderId,productId]
                );
                orderProduct = result.rows[0];
            }
            conn.release();

            return {
                name:product.name,
                quantity:orderProduct.quantity,
                price:product.price
            };
        } catch (error) {
            throw new Error('Error while adding product to order');
        }
    },
    async removeProductFromOrder(orderId: number, productId: string): Promise<{name: string, quantity: number, price: number} | null> {
        try {
            const conn = await PostgresDatabase.connect();
            let result = await conn.query(
                'SELECT * FROM products WHERE id = ($1)',
                [productId]
            );

            if (!result.rows.length) return null;

            const product = result.rows[0] as Product;

            result = await conn.query(
                `DELETE FROM order_products WHERE order_id = ($1) AND product_id = ($2) ${orderProductReturningClause}`,
                [orderId,productId]
            );

            conn.release();

            if (!result.rows.length) return null;

            const orderProduct = result.rows[0] as OrderProduct;
            return {
                name:product.name,
                quantity:orderProduct.quantity,
                price:product.price
            };
        } catch (error) {
            throw new Error('Error while removing product from order');
        }
    },
    async getProductsInOrder(orderId: number): Promise<{name: string, quantity: number, price: number}[]> {
        try {
            const conn = await PostgresDatabase.connect();
            let result = await conn.query(
                `${orderProductSelectClause} FROM order_products WHERE order_id = ($1)`,
                [orderId]
            );

            if (!result.rows.length) return [];
            const orderProducts = result.rows as OrderProduct[];
            const products: Product[] = [];

            for (const orderProduct of orderProducts) {
                result = await conn.query(
                    'SELECT * FROM products WHERE id = ($1)',
                    [orderProduct.productId]
                );
                products.push((result.rows[0] as Product));
            }

            conn.release();

            return orderProducts.map((orderProduct: OrderProduct, index: number) => ({
                name: products[index].name,
                quantity: orderProduct.quantity,
                price: products[index].price
            }));
        } catch (error) {
            throw new Error('Error while getting products in order');
        }
    },
    async deleteAllOrdersForUser(userId: string, options?): Promise<Order[]> {
        try {
            const conn = await PostgresDatabase.connect();
            const result = await conn.query(
                `DELETE FROM orders WHERE user_id = ($1) ${returningClause}`,
                [userId]
            );
            conn.release();
            if (options?.protected) {
                return result.rows.map((order: Order) => protectify({...order}));
            }
            return result.rows;
        } catch (error) {
            throw new Error('Error while deleting all orders for user');
        }
    },
    async deleteAllProductsInOrder(orderId: number): Promise<{name: string, quantity: number, price: number}[]> {
        try {
            const conn = await PostgresDatabase.connect();
            let result = await conn.query(
                `DELETE FROM order_products WHERE order_id = ($1) ${orderProductReturningClause}`,
                [orderId]
            );

            const orderProducts = result.rows as OrderProduct[];
            const products: Product[] = [];

            for (const orderProduct of orderProducts) {
                result = await conn.query(
                    'SELECT * FROM products WHERE id = ($1)',
                    [orderProduct.productId]
                );
                products.push((result.rows[0] as Product));
            }

            conn.release();

            return orderProducts.map((orderProduct: OrderProduct, index: number) => ({
                name: products[index].name,
                quantity: orderProduct.quantity,
                price: products[index].price
            }));
        } catch (error) {
            throw new Error('Error while deleting all products in order');
        }
    },
    async getAllOrderProducts(): Promise<OrderProduct[]> {
        try {
            const conn = await PostgresDatabase.connect();
            const result = await conn.query(`${orderProductSelectClause} FROM order_products`);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error('Error while getting all order products');
        }
    },
    async deleteAllOrderProducts(): Promise<OrderProduct[]> {
        try {
            const conn = await PostgresDatabase.connect();
            const result = await conn.query(`DELETE FROM order_products ${orderProductReturningClause}`);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error('Error while deleting all order products');
        }
    },
};

Object.freeze(OrdersRepository);
export default OrdersRepository;
