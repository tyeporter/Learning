import {Order, Product} from '../../../entities';
import {OrderProduct} from '../../../entities/auxiliary';
import {OrderStatus} from '../../../entities/enums';
import {DataStorable} from '../../../entities/protocols';
import {MockDatabase} from '../../databases/mock';

const OrdersRepository: DataStorable<Order> = {
    async add(order: Order, options?): Promise<Order> {
        if (!order.id) {
            order.id = MockDatabase.orders.length;
        }

        MockDatabase.orders.push(order);

        if (options?.protected) {
            return {
                id:order.id,
                status:order.status
            };
        }
        return order;
    },
    async update(order: Order, options?): Promise<Order | null> {
        const index = MockDatabase.orders.findIndex((item: Order) => item.id === order.id);
        if (index < 0) return null;

        MockDatabase.orders[index] = order;

        if (options?.protected) {
            return {
                id:order.id,
                status:order.status
            };
        }
        return order;
    },
    async delete(id: string | number, options?): Promise<Order | null> {
        const index = MockDatabase.orders.findIndex((item: Order) => item.id === id);
        if (index < 0) return null;

        const _order = MockDatabase.orders.splice(index, 1)[0];

        if (options?.protected) {
            return {
                id:_order.id,
                status:_order.status
            };
        }
        return _order;
    },
    async getById(id: number, options?): Promise<Order | null> {
        const order = MockDatabase.orders.find((item: Order) => item.id === id);
        if (!order) return null;

        if (options?.protected) {
            return {
                id:order.id,
                status:order.status
            };
        }
        return order;
    },
    async getAll(options?): Promise<Order[]> {
        if (options?.protected) {
            return MockDatabase.orders.map((order: Order) => ({
                id:order.id,
                status:order.status
            }));
        }
        return MockDatabase.orders;
    },
    async deleteAll(options?): Promise<Order[]> {
        const orders = MockDatabase.orders;
        MockDatabase.orders.length = 0;
        if (options?.protected) {
            return orders.map((order: Order) => ({
                id:order.id,
                status:order.status
            }));
        }
        return orders;
    },
    async getOrdersForUser(userId: string, options?): Promise<Order[]> {
        const userOrders = MockDatabase.orders.filter((item: Order) => item.userId === userId);
        if (options?.protected) {
            return userOrders.map((order: Order) => ({
                id:order.id,
                status:order.status
            }));
        }

        return userOrders;
    },
    async getActiveOrderForUser(userId: string, options?): Promise<Order> {
        const index = MockDatabase.orders.findIndex((order: Order) => (
            order.userId === userId && order.status === OrderStatus.Active
        ));

        let order: Order;
        if (index < 0) {
            order = {
                id: MockDatabase.orders.length,
                status: OrderStatus.Active,
                userId
            };

            MockDatabase.orders.push(order);
        } else {
            order = MockDatabase.orders[index];
        }

        if (options?.protected) {
            return {
                id:order.id,
                status:order.status
            };
        }

        return order;
    },
    async getUserOrder(orderId: number, userId: string, options?): Promise<Order | null> {
        const order = MockDatabase.orders.find((order: Order) => order.id === orderId && order.userId === userId);
        if (!order) return null;

        if (options?.protected) {
            return {
                id:order.id,
                status:order.status
            };
        }
        return order;
    },
    async addProductToOrder(quantity: number, orderId: number, productId: string): Promise<{name: string, quantity: number, price: number} | null> {
        const product = MockDatabase.products.find((product: Product) => product.id === productId);
        if (!product) return null;

        const possibleExistingOrderProductIndex = MockDatabase.orderProducts.findIndex((orderProduct: OrderProduct) => (
            orderProduct.orderId === orderId && orderProduct.productId === productId
        ));

        let orderProduct: OrderProduct;
        if (possibleExistingOrderProductIndex >= 0) {
            MockDatabase.orderProducts[possibleExistingOrderProductIndex].quantity += quantity;
            orderProduct = MockDatabase.orderProducts[possibleExistingOrderProductIndex];
        } else {
            orderProduct = {
                id: MockDatabase.orderProducts.length,
                quantity,
                orderId,
                productId
            };
            MockDatabase.orderProducts.push(orderProduct);
        }

        return {
            name:product.name,
            quantity:orderProduct.quantity,
            price:product.price
        };
    },
    async removeProductFromOrder(orderId: number, productId: string): Promise<{name: string, quantity: number, price: number} | null> {
        const product = MockDatabase.products.find((product: Product) => product.id === productId);
        if (!product) return null;

        const index = MockDatabase.orderProducts.findIndex((orderProduct: OrderProduct) => {
            return orderProduct.orderId === orderId && orderProduct.productId === productId;
        });
        if (index < 0) return null;


        const orderProduct = MockDatabase.orderProducts.splice(index, 1)[0];
        return {
            name:product.name,
            quantity:orderProduct.quantity,
            price:product.price
        };
    },
    async getProductsInOrder(orderId: number): Promise<{name: string, quantity: number, price: number}[]> {
        const orderProducts = MockDatabase.orderProducts.filter((item: OrderProduct) => item.orderId === orderId);
        if (!orderProducts.length) return [];

        const products = orderProducts.map((orderProduct: OrderProduct) => {
            return MockDatabase.products.find((product: Product) => product.id === orderProduct.productId);
        });

        return orderProducts.map((orderProduct: OrderProduct, index: number) => ({
            name: (products[index] as Product).name,
            quantity: orderProduct.quantity,
            price: (products[index] as Product).price
        }));
    },
    async deleteAllOrdersForUser(userId: string, options?): Promise<Order[]> {
        const orders = MockDatabase.orders.filter((order: Order) => order.userId === userId);
        MockDatabase.orders = MockDatabase.orders.filter((order: Order) => order.userId !== userId);

        if (options?.protected) {
            return orders.map((order: Order) => ({
                id:order.id,
                status:order.status
            }));
        }
        return orders;
    },
    async deleteAllProductsInOrder(orderId: number): Promise<{name: string, quantity: number, price: number}[]> {
        const orderProducts = MockDatabase.orderProducts.filter((orderProduct: OrderProduct) => {
            return orderProduct.orderId === orderId;
        });

        MockDatabase.orderProducts = MockDatabase.orderProducts.filter((orderProduct: OrderProduct) => {
            return orderProduct.orderId !== orderId;
        });

        const products = orderProducts.map((orderProduct: OrderProduct) => {
            return MockDatabase.products.find((product: Product) => product.id === orderProduct.productId);
        });

        return orderProducts.map((orderProduct: OrderProduct, index: number) => ({
            name: (products[index] as Product).name,
            quantity: orderProduct.quantity,
            price: (products[index] as Product).price
        }));
    },
    async getAllOrderProducts(): Promise<OrderProduct[]> {
        return MockDatabase.orderProducts;
    },
    async deleteAllOrderProducts(): Promise<OrderProduct[]> {
        const orderProducts = MockDatabase.orderProducts;
        MockDatabase.orderProducts.length = 0;
        return orderProducts;
    }
};

Object.freeze(OrdersRepository);
export default OrdersRepository;
