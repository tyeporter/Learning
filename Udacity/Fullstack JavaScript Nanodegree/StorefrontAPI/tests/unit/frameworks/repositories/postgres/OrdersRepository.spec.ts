import {Order, User} from '../../../../../src/entities';
import {OrderProduct} from '../../../../../src/entities/auxiliary';
import {OrderStatus} from '../../../../../src/entities/enums';
import {OrdersRepository, ProductsRepository, UsersRepository} from '../../../../../src/frameworks/repositories/postgres';

describe('Postgres Order Repository Tests', (): void => {
    let testOrder: Order;
    let testUser: User;

    beforeAll(async (): Promise<void> => {
        testOrder = {
            status: OrderStatus.Active
        };
        testUser = {
            username: '@testUser',
            password: 'password123'
        };

        await ProductsRepository.add({
            name: 'Soap Bar',
            description: 'Very nice soap!',
            price: 5.99
        });

        await ProductsRepository.add({
            name: 'Aluminum Foil',
            description: 'Use it to cook anything!',
            price: 2.73
        });
    });

    afterAll(async (): Promise<void> => {
        await ProductsRepository.deleteAll?.();
    });

    afterEach(async (): Promise<void> => {
        await OrdersRepository.deleteAllOrderProducts?.();
        await OrdersRepository.deleteAll();
        await UsersRepository.deleteAll();
    });

    describe('add() Tests', (): void => {
        it('Adding order should add and return order', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const addedOrder = await OrdersRepository.add({...testOrder, userId:addedUser.id});

            expect(addedOrder).toBeDefined();
            expect(addedOrder.id).toBeDefined();
            expect(addedOrder.status).toBe(OrderStatus.Active);
            expect(addedOrder.userId).toBe(addedUser.id);
        });

        it('Adding order with protected option should return partial order', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const addedOrder = await OrdersRepository.add({...testOrder, userId:addedUser.id},{protected:true});

            expect(addedOrder).toBeDefined();
            expect(addedOrder.id).toBeDefined();
            expect(addedOrder.status).toBe(OrderStatus.Active);
            expect(addedOrder.userId).toBeUndefined();
        });
    });

    describe('update() Tests', (): void => {
        it('Updating order should update and return order', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const addedOrder = await OrdersRepository.add({...testOrder, userId:addedUser.id});
            const updatedOrder = await OrdersRepository.update({
                ...addedOrder,
                status:OrderStatus.Inactive
            });

            expect(updatedOrder).toBeDefined();
            expect(updatedOrder?.id).toBe(addedOrder.id);
            expect(updatedOrder?.userId).toBe(addedOrder.userId);
            expect(updatedOrder?.status).not.toBe(addedOrder.status);
        });

        it('Updating order with protected options should return partial order', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const addedOrder = await OrdersRepository.add({...testOrder, userId:addedUser.id});
            const updatedOrder = await OrdersRepository.update({
                ...addedOrder,
                status:OrderStatus.Inactive
            },{protected:true});

            expect(updatedOrder).toBeDefined();
            expect(updatedOrder?.id).toBe(addedOrder.id);
            expect(updatedOrder?.status).not.toBe(addedOrder.status);
            expect(updatedOrder?.userId).toBeUndefined();
        });

        it('Updating order with invalid id should return null', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const addedOrder = await OrdersRepository.add({...testOrder, userId:addedUser.id});
            const updatedOrder = await OrdersRepository.update({
                ...addedOrder,
                id: -1,
                status:OrderStatus.Inactive
            });

            expect(updatedOrder).toBeNull();
        });
    });

    describe('delete() Tests', (): void => {
        it('Deleting order should delete and return order', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const addedOrder = await OrdersRepository.add({...testOrder, userId:addedUser.id});
            const deletedOrder = await OrdersRepository.delete((addedOrder.id as number));

            expect(deletedOrder).toBeDefined();
            expect(deletedOrder?.id).toBe(addedOrder.id);
            expect(deletedOrder?.status).toBe(addedOrder.status);
            expect(deletedOrder?.userId).toBe(addedOrder.userId);
        });

        it('Deleting order with protected option should return partial order', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const addedOrder = await OrdersRepository.add({...testOrder, userId:addedUser.id});
            const deletedOrder = await OrdersRepository.delete((addedOrder.id as number),{protected:true});

            expect(deletedOrder).toBeDefined();
            expect(deletedOrder?.id).toBe(addedOrder.id);
            expect(deletedOrder?.status).toBe(addedOrder.status);
            expect(deletedOrder?.userId).toBeUndefined();
        });

        it('Deleting order with invalid id should return null', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            await OrdersRepository.add({...testOrder, userId:addedUser.id});
            const deletedOrder = await OrdersRepository.delete(-1);

            expect(deletedOrder).toBeNull();
        });
    });

    describe('getById() Tests', (): void => {
        it('Getting order by id should return order', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const addedOrder = await OrdersRepository.add({...testOrder, userId:addedUser.id});
            const returnedOrder = await OrdersRepository.getById((addedOrder.id as number));

            expect(returnedOrder).toBeDefined();
            expect(returnedOrder?.id).toBe(addedOrder.id);
            expect(returnedOrder?.status).toBe(addedOrder.status);
            expect(returnedOrder?.userId).toBe(addedOrder.userId);
        });

        it('Getting order with protected option should return partial order', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const addedOrder = await OrdersRepository.add({...testOrder, userId:addedUser.id});
            const returnedOrder = await OrdersRepository.getById((addedOrder.id as number),{protected:true});

            expect(returnedOrder).toBeDefined();
            expect(returnedOrder?.id).toBe(addedOrder.id);
            expect(returnedOrder?.status).toBe(addedOrder.status);
            expect(returnedOrder?.userId).toBeUndefined();
        });

        it('Getting order with invalid id should return null', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            await OrdersRepository.add({...testOrder, userId:addedUser.id});
            const returnedOrder = await OrdersRepository.getById(-1);

            expect(returnedOrder).toBeNull();
        });
    });

    describe('getAll() Test', (): void => {
        it('Getting all orders should return an array of orders', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            await OrdersRepository.add({...testOrder, userId:addedUser.id});
            await OrdersRepository.add({
                status: OrderStatus.Inactive,
                userId:addedUser.id
            });
            const orders = await OrdersRepository.getAll();

            expect(orders).toBeDefined();
            expect(orders.length).toBe(2);
            expect(orders[0]).toBeDefined();
            expect(orders[1]).toBeDefined();
            expect(orders[0].id).not.toBe(orders[1].id);
            expect(orders[0].status).not.toBe(orders[1].status);
            expect(orders[0].userId).toBe(orders[1].userId);
        });

        it('Getting all orders with protected option should return an array of partial orders', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            await OrdersRepository.add({...testOrder, userId:addedUser.id});
            await OrdersRepository.add({
                status: OrderStatus.Inactive,
                userId:addedUser.id
            });
            const orders = await OrdersRepository.getAll({protected:true});

            expect(orders).toBeDefined();
            expect(orders.length).toBe(2);
            expect(orders[0]).toBeDefined();
            expect(orders[1]).toBeDefined();
            expect(orders[0].id).not.toBe(orders[1].id);
            expect(orders[0].status).not.toBe(orders[1].status);
            expect(orders[0].userId).toBeUndefined();
        });
    });

    describe('deleteAll() Tests', (): void => {
        it('Deleting all orders should return an array or orders', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const addedOrder = await OrdersRepository.add({...testOrder, userId:addedUser.id});
            const deletedOrders = await OrdersRepository.deleteAll();

            expect(deletedOrders).toBeDefined();
            expect(deletedOrders.length).toBe(1);
            expect(deletedOrders[0].id).toBe(addedOrder.id);
            expect(deletedOrders[0].status).toBe(addedOrder.status);
            expect(deletedOrders[0].userId).toBe(addedOrder.userId);
        });

        it('Deleting all orders with protected option should return an array or partial orders', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const addedOrder = await OrdersRepository.add({...testOrder, userId:addedUser.id});
            const deletedOrders = await OrdersRepository.deleteAll({protected:true});

            expect(deletedOrders).toBeDefined();
            expect(deletedOrders.length).toBe(1);
            expect(deletedOrders[0].id).toBe(addedOrder.id);
            expect(deletedOrders[0].status).toBe(addedOrder.status);
            expect(deletedOrders[0].userId).toBeUndefined();
        });
    });

    describe('getOrdersForUser() Tests', (): void => {
        it('Getting orders for user should return an array or orders', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            await OrdersRepository.add({...testOrder, userId:addedUser.id});
            await OrdersRepository.add({
                status: OrderStatus.Inactive, userId:addedUser.id
            });
            const returnedOrders = await OrdersRepository.getOrdersForUser?.((addedUser.id as string)) as Order[];

            expect(returnedOrders).toBeDefined();
            expect(returnedOrders?.length).toBe(2);
            expect(returnedOrders[0]).toBeDefined();
            expect(returnedOrders[1]).toBeDefined();
            expect(returnedOrders[0].id).toBeDefined();
            expect(returnedOrders[0].status).toBeDefined();
            expect(returnedOrders[0].userId).toBe(returnedOrders[1].userId);
        });

        it('Getting orders for user with protected option should return an array or partial orders', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            await OrdersRepository.add({...testOrder, userId:addedUser.id});
            await OrdersRepository.add({
                status: OrderStatus.Inactive, userId:addedUser.id
            });
            const returnedOrders = await OrdersRepository.getOrdersForUser?.((addedUser.id as string),{protected:true}) as Order[];

            expect(returnedOrders).toBeDefined();
            expect(returnedOrders?.length).toBe(2);
            expect(returnedOrders[0]).toBeDefined();
            expect(returnedOrders[1]).toBeDefined();
            expect(returnedOrders[0].id).toBeDefined();
            expect(returnedOrders[0].status).toBeDefined();
            expect(returnedOrders[0].userId).toBeUndefined();
        });
    });

    describe('getActiveOrderForUser() Tests', (): void => {
        it('Getting active order for user should return order', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            await OrdersRepository.add({...testOrder, userId:addedUser.id});
            await OrdersRepository.add({
                status: OrderStatus.Inactive,
                userId: addedUser.id
            });
            const activeOrder = await OrdersRepository.getActiveOrderForUser?.((addedUser.id as string));

            expect(activeOrder).toBeDefined();
            expect(activeOrder?.id).toBeDefined();
            expect(activeOrder?.status).toBe(OrderStatus.Active);
            expect(activeOrder?.userId).toBe(addedUser.id);
        });

        it('Getting active order for user without previously added order should return order', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const activeOrder = await OrdersRepository.getActiveOrderForUser?.((addedUser.id as string));

            expect(activeOrder).toBeDefined();
            expect(activeOrder?.id).toBeDefined();
            expect(activeOrder?.status).toBe(OrderStatus.Active);
            expect(activeOrder?.userId).toBe(addedUser.id);
        });

        it('Getting active order for user with protected option should return partial orders', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const activeOrder = await OrdersRepository.getActiveOrderForUser?.((addedUser.id as string),{protected:true});

            expect(activeOrder).toBeDefined();
            expect(activeOrder?.id).toBeDefined();
            expect(activeOrder?.status).toBe(OrderStatus.Active);
            expect(activeOrder?.userId).toBeUndefined();
        });
    });

    describe('getUserOrder() Tests', (): void => {
        it('Getting user order with order id and user id should return order', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const addedOrder = await OrdersRepository.add({...testOrder, userId:addedUser.id});
            const returnedOrder = await OrdersRepository.getUserOrder?.((addedOrder.id as number),(addedUser.id as string));

            expect(returnedOrder).toBeDefined();
            expect(returnedOrder?.id).toBeDefined();
            expect(returnedOrder?.status).toBe(OrderStatus.Active);
            expect(returnedOrder?.userId).toBe(addedUser.id);
        });

        it('Getting user order with order id, user id, and protected option should return partial order', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const addedOrder = await OrdersRepository.add({...testOrder, userId:addedUser.id});
            const returnedOrder = await OrdersRepository.getUserOrder?.((addedOrder.id as number),(addedUser.id as string),{protected:true});

            expect(returnedOrder).toBeDefined();
            expect(returnedOrder?.id).toBeDefined();
            expect(returnedOrder?.status).toBe(OrderStatus.Active);
            expect(returnedOrder?.userId).toBeUndefined();
        });
    });

    describe('addProductToOrder() Tests', (): void => {
        it('Adding product to order should return product order', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const addedOrder = await OrdersRepository.add({...testOrder, userId:addedUser.id});
            const returnedProducts = await ProductsRepository.getAll();
            const orderProduct = await OrdersRepository.addProductToOrder?.(2,(addedOrder.id as number),(returnedProducts[0].id as string));

            expect(orderProduct).toBeDefined();
            expect(orderProduct?.name).toBe(returnedProducts[0].name);
            expect(orderProduct?.price).toBe(returnedProducts[0].price);
            expect(orderProduct?.quantity).toBe(2);
        });
    });

    describe('removeProductFromOrder() Tests', (): void => {
        it('Removing product from order should return order', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const addedOrder = await OrdersRepository.add({...testOrder, userId:addedUser.id});
            const returnedProducts = await ProductsRepository.getAll();
            await OrdersRepository.addProductToOrder?.(2,(addedOrder.id as number),(returnedProducts[0].id as string));
            const removedOrderProduct = await OrdersRepository.removeProductFromOrder?.((addedOrder.id as number),(returnedProducts[0].id as string));

            expect(removedOrderProduct).toBeDefined();
            expect(removedOrderProduct?.name).toBe(returnedProducts[0].name);
            expect(removedOrderProduct?.price).toBe(returnedProducts[0].price);
            expect(removedOrderProduct?.quantity).toBe(2);
        });
    });

    describe('getProductsInOrder() Tests', (): void => {
        it('Getting products in order should return an array of order products', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const addedOrder = await OrdersRepository.add({...testOrder, userId:addedUser.id});
            const returnedProducts = await ProductsRepository.getAll();
            await OrdersRepository.addProductToOrder?.(2,(addedOrder.id as number),(returnedProducts[0].id as string));
            await OrdersRepository.addProductToOrder?.(1,(addedOrder.id as number),(returnedProducts[1].id as string));
            const orderProducts = await OrdersRepository.getProductsInOrder?.((addedOrder.id as number));

            expect(orderProducts).toBeDefined();
            expect(orderProducts?.length).toBe(2);
            expect(orderProducts?.[0].name).toBe(returnedProducts?.[0].name);
            expect(orderProducts?.[0].price).toBe(returnedProducts?.[0].price);
            expect(orderProducts?.[0].quantity).toBe(2);
            expect(orderProducts?.[1].quantity).toBe(1);
        });
    });

    describe('deleteAllOrdersForUsers() Tests', (): void => {
        it('Deleting all orders for user should return an array of orders', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            await OrdersRepository.add({...testOrder, userId:addedUser.id});
            await OrdersRepository.add({status:OrderStatus.Inactive, userId:addedUser.id});
            const deletedOrders = await OrdersRepository.deleteAllOrdersForUser?.((addedUser.id as string));

            expect(deletedOrders).toBeDefined();
            expect(deletedOrders?.length).toBe(2);
            expect(deletedOrders?.[0]).toBeDefined();
            expect(deletedOrders?.[1]).toBeDefined();
            expect(deletedOrders?.[0].id).toBeDefined();
            expect(deletedOrders?.[0].status).toBe(OrderStatus.Active);
            expect(deletedOrders?.[0].userId).toBe(addedUser.id);
        });

        it('Deleting all orders for user with protected option should return an array of partial orders', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            await OrdersRepository.add({...testOrder, userId:addedUser.id});
            await OrdersRepository.add({status:OrderStatus.Inactive, userId:addedUser.id});
            const deletedOrders = await OrdersRepository.deleteAllOrdersForUser?.((addedUser.id as string),{protected:true});

            expect(deletedOrders).toBeDefined();
            expect(deletedOrders?.length).toBe(2);
            expect(deletedOrders?.[0]).toBeDefined();
            expect(deletedOrders?.[1]).toBeDefined();
            expect(deletedOrders?.[0].id).toBeDefined();
            expect(deletedOrders?.[0].status).toBe(OrderStatus.Active);
            expect(deletedOrders?.[0].userId).toBeUndefined();
        });
    });

    describe('deleteAllProductsInOrder() Tests', (): void => {
        it('Deleting all products in order should return an array of order products', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const addedOrder = await OrdersRepository.add({...testOrder, userId:addedUser.id});
            const returnedProducts = await ProductsRepository.getAll();
            await OrdersRepository.addProductToOrder?.(2,(addedOrder.id as number),(returnedProducts[0].id as string));
            await OrdersRepository.addProductToOrder?.(1,(addedOrder.id as number),(returnedProducts[1].id as string));
            const deletedProducts = await OrdersRepository.deleteAllProductsInOrder?.((addedOrder.id as number)) as {name: string, quantity: number, price: number}[];

            expect(deletedProducts).toBeDefined();
            expect(deletedProducts?.length).toBe(2);
            expect(deletedProducts[0]).toBeDefined();
            expect(deletedProducts[1]).toBeDefined();
            expect(deletedProducts[0].name).toBe(returnedProducts[0].name);
            expect(deletedProducts[0].price).toBe(returnedProducts[0].price);
            expect(deletedProducts[0].quantity).toBe(2);
        });
    });

    describe('getAllOrderProducts() Tests', (): void => {
        it('Getting all order products should return an array of order products', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const addedOrder = await OrdersRepository.add({...testOrder, userId:addedUser.id});
            const returnedProducts = await ProductsRepository.getAll();
            await OrdersRepository.addProductToOrder?.(2,(addedOrder.id as number),(returnedProducts[0].id as string));
            await OrdersRepository.addProductToOrder?.(1,(addedOrder.id as number),(returnedProducts[1].id as string));
            const orderProducts = await OrdersRepository.getAllOrderProducts?.() as OrderProduct[];

            expect(orderProducts).toBeDefined();
            expect(orderProducts?.length).toBe(2);
            expect(orderProducts[0].id).toBeDefined();
            expect(orderProducts[0].quantity).toBe(2);
            expect(Number(orderProducts[0].orderId)).toBe((addedOrder.id as number));
            expect(orderProducts[0].productId).toBe((returnedProducts[0].id as string));
        });
    });

    describe('deleteAllOrderProducts() Tests', (): void => {
        it('Deleting all order products should return an array of order products', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const addedOrder = await OrdersRepository.add({...testOrder, userId:addedUser.id});
            const returnedProducts = await ProductsRepository.getAll();
            await OrdersRepository.addProductToOrder?.(2,(addedOrder.id as number),(returnedProducts[0].id as string));
            await OrdersRepository.addProductToOrder?.(1,(addedOrder.id as number),(returnedProducts[1].id as string));
            const deletedOrderProducts = await OrdersRepository.deleteAllOrderProducts?.() as OrderProduct[];

            expect(deletedOrderProducts).toBeDefined();
            expect(deletedOrderProducts?.length).toBe(2);
            expect(deletedOrderProducts[0].id).toBeDefined();
            expect(deletedOrderProducts[0].quantity).toBe(2);
            expect(Number(deletedOrderProducts[0].orderId)).toBe((addedOrder.id as number));
            expect(deletedOrderProducts[0].productId).toBe((returnedProducts[0].id as string));
        });
    });
});
