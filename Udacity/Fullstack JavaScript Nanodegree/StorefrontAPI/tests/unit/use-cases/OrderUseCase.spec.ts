import {Order, Product, User} from '../../../src/entities';
import {Dependable} from '../../../src/entities/protocols';
import {OrdersRepository, ProductsRepository, UsersRepository} from '../../../src/frameworks/repositories/postgres';
import {OrderUseCase, ProductUseCase, UserUseCase} from '../../../src/use-cases';
import {v4 as uuid} from 'uuid';
import {OrderStatus} from '../../../src/entities/enums';

describe('Order Use-Case Tests', (): void => {
    let testOrder: Order;
    let testUser: User;
    let testProduct: Product;
    let dependencies: Dependable<Order>;

    beforeAll((): void => {
        testOrder = {
            status: OrderStatus.Active
        };
        testUser = {
            username: '@testUser',
            password: 'password123',
            level: 0
        };
        testProduct = {
            name: 'My Product',
            description: 'My product\'s description',
            price: 15.99
        };
        dependencies = {
            repository: OrdersRepository
        };
    });

    afterEach(async (): Promise<void> => {
        await OrderUseCase.deleteAllOrderProducts?.(dependencies).execute();
        await OrderUseCase.deleteAll(dependencies).execute();
        await UserUseCase.deleteAll({repository:UsersRepository}).execute();
    });

    describe('add() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('Order should be returned when added', async (): Promise<void> => {
                const addedUser = await UserUseCase.add({repository:UsersRepository}).execute(testUser);
                const addedOrder = await OrderUseCase.add(dependencies).execute({...testOrder, userId:addedUser.id});

                expect(addedOrder).toBeDefined();
                expect(addedOrder.id).toBeDefined();
                expect(addedOrder.status).toBe(testOrder.status);
                expect(addedOrder.userId).toBe(addedUser.id);
            });

            it('Partial order should be returned when added with protected option', async (): Promise<void> => {
                const addedUser = await UserUseCase.add({repository:UsersRepository}).execute(testUser);
                const partialOrder = await OrderUseCase.add(dependencies).execute({...testOrder, userId:addedUser.id},{protected:true});

                expect(partialOrder).toBeDefined();
                expect(partialOrder.id).toBeDefined();
                expect(partialOrder.status).toBe(testOrder.status);
                expect(partialOrder.userId).toBeUndefined();
            });
        });

        describe('Validation Tests', (): void => {
            it('Promise should be rejected when order added without status', async (): Promise<void> => {
                await expectAsync(OrderUseCase.add(dependencies).execute({
                    status:((null as unknown) as OrderStatus),
                    userId:uuid()
                })).toBeRejected();
            });

            it('Promise should be rejected when order added without userId', async (): Promise<void> => {
                await expectAsync(OrderUseCase.add(dependencies).execute({
                    status:testOrder.status,
                    userId:((null as unknown) as string)
                })).toBeRejected();
            });

            it('Promise should be rejected when order added without userId as guid', async (): Promise<void> => {
                await expectAsync(OrderUseCase.add(dependencies).execute({
                    status:testOrder.status,
                    userId:'fizz_buzz'
                })).toBeRejected();
            });
        });
    });

    describe('update() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('Order should be returned when updated', async (): Promise<void> => {
                const addedUser = await UserUseCase.add({repository:UsersRepository}).execute(testUser);
                const addedOrder = await OrderUseCase.add(dependencies).execute({...testOrder, userId:addedUser.id});
                const updatedOrder = await OrderUseCase.update(dependencies).execute({
                    ...addedOrder,
                    status:OrderStatus.Inactive
                });

                expect(updatedOrder).toBeDefined();
                expect(updatedOrder?.id).toBe(addedOrder.id);
                expect(updatedOrder?.status).not.toBe(addedOrder.status);
                expect(updatedOrder?.userId).toBe(addedOrder.userId);
            });

            it('Partial order should be returned when updated with protected option', async (): Promise<void> => {
                const addedUser = await UserUseCase.add({repository:UsersRepository}).execute(testUser);
                const addedOrder = await OrderUseCase.add(dependencies).execute({...testOrder, userId:addedUser.id});
                const updatedOrder = await OrderUseCase.update(dependencies).execute({
                    ...addedOrder,
                    status:OrderStatus.Inactive,
                },{protected:true});

                expect(updatedOrder).toBeDefined();
                expect(updatedOrder?.id).toBe(addedOrder.id);
                expect(updatedOrder?.status).not.toBe(addedOrder.status);
                expect(updatedOrder?.userId).toBeUndefined();
            });
        });

        describe('Validation Tests', (): void => {
            it('Promise should be rejected when order updated without id', async (): Promise<void> => {
                await expectAsync(OrderUseCase.update(dependencies).execute({
                    id:((null as unknown) as number),
                    status:OrderStatus.Inactive,
                    userId:uuid()
                })).toBeRejected();
            });

            it('Promise should be rejected when order updated without status', async (): Promise<void> => {
                await expectAsync(OrderUseCase.update(dependencies).execute({
                    id:0,
                    status:((null as unknown) as OrderStatus),
                    userId:uuid()
                })).toBeRejected();
            });

            it('Promise should be rejected when order updated without userId', async (): Promise<void> => {
                await expectAsync(OrderUseCase.update(dependencies).execute({
                    id:0,
                    status:OrderStatus.Inactive,
                    userId:((null as unknown) as string)
                })).toBeRejected();
            });

            it('Promise should be rejected when order updated without userId as guid', async (): Promise<void> => {
                await expectAsync(OrderUseCase.update(dependencies).execute({
                    id:0,
                    status:OrderStatus.Inactive,
                    userId:'fizz_buzz'
                })).toBeRejected();
            });
        });
    });

    describe('delete() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('Order should be returned when deleted', async (): Promise<void> => {
                const addedUser = await UserUseCase.add({repository:UsersRepository}).execute(testUser);
                const addedOrder = await OrderUseCase.add(dependencies).execute({...testOrder, userId:addedUser.id});
                const deletedOrder = await OrderUseCase.delete(dependencies).execute((addedOrder.id as number));

                expect(deletedOrder).toBeDefined();
                expect(deletedOrder?.id).toBe(addedOrder.id);
                expect(deletedOrder?.status).toBe(addedOrder.status);
                expect(deletedOrder?.userId).toBe(addedOrder.userId);
            });

            it('Partial order should be returned when deleted with protected option', async (): Promise<void> => {
                const addedUser = await UserUseCase.add({repository:UsersRepository}).execute(testUser);
                const addedOrder = await OrderUseCase.add(dependencies).execute({...testOrder, userId:addedUser.id});
                const deletedOrder = await OrderUseCase.delete(dependencies).execute((addedOrder.id as number),{protected:true});

                expect(deletedOrder).toBeDefined();
                expect(deletedOrder?.id).toBe(addedOrder.id);
                expect(deletedOrder?.status).toBe(addedOrder.status);
                expect(deletedOrder?.userId).toBeUndefined();
            });
        });

        describe('Validation Tests', (): void => {
            it('Promise should be rejected when order deleted without id', async (): Promise<void> => {
                await expectAsync(OrderUseCase.delete(dependencies).execute(((null as unknown) as number))).toBeRejected();
            });
        });
    });

    describe('getById() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('Order should be returned when getting order by id', async (): Promise<void> => {
                const addedUser = await UserUseCase.add({repository:UsersRepository}).execute(testUser);
                const addedOrder = await OrderUseCase.add(dependencies).execute({...testOrder, userId:addedUser.id});
                const returnedOrder = await OrderUseCase.getById(dependencies).execute((addedOrder.id as number));

                expect(returnedOrder).toBeDefined();
                expect(returnedOrder?.id).toBe(addedOrder.id);
                expect(returnedOrder?.status).toBe(addedOrder.status);
                expect(returnedOrder?.userId).toBe(addedOrder.userId);
            });

            it('Partial order should be returned when getting order by id with protected option', async (): Promise<void> => {
                const addedUser = await UserUseCase.add({repository:UsersRepository}).execute(testUser);
                const addedOrder = await OrderUseCase.add(dependencies).execute({...testOrder, userId:addedUser.id});
                const returnedOrder = await OrderUseCase.getById(dependencies).execute((addedOrder.id as number),{protected:true});

                expect(returnedOrder).toBeDefined();
                expect(returnedOrder?.id).toBe(addedOrder.id);
                expect(returnedOrder?.status).toBe(addedOrder.status);
                expect(returnedOrder?.userId).toBeUndefined();
            });
        });

        describe('Validation Tests', (): void => {
            it('Promise should be rejected when getting order by id without id', async (): Promise<void> => {
                await expectAsync(OrderUseCase.getById(dependencies).execute(
                    ((null as unknown) as number)
                )).toBeRejected();
            });
        });
    });

    describe('getAll() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('Array of orders should be returned when getting all orders', async (): Promise<void> => {
                const addedUser = await UserUseCase.add({repository:UsersRepository}).execute(testUser);
                const addedOrder = await OrderUseCase.add(dependencies).execute({...testOrder, userId:addedUser.id});
                const returnedOrders = await OrderUseCase.getAll?.(dependencies).execute();

                expect(returnedOrders).toBeDefined();
                expect(returnedOrders.length).toBe(1);
                expect(returnedOrders[0].id).toBe(addedOrder.id);
                expect(returnedOrders[0].status).toBe(addedOrder.status);
                expect(returnedOrders[0].userId).toBe(addedOrder.userId);
            });

            it('Array of partial orders should be returned when getting all orders with protected option', async (): Promise<void> => {
                const addedUser = await UserUseCase.add({repository:UsersRepository}).execute(testUser);
                const addedOrder = await OrderUseCase.add(dependencies).execute({...testOrder, userId:addedUser.id});
                const returnedOrders = await OrderUseCase.getAll?.(dependencies).execute({protected:true});

                expect(returnedOrders).toBeDefined();
                expect(returnedOrders.length).toBe(1);
                expect(returnedOrders[0].id).toBe(addedOrder.id);
                expect(returnedOrders[0].status).toBe(addedOrder.status);
                expect(returnedOrders[0].userId).toBeUndefined();
            });
        });
    });

    describe('deleteAll() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('Array of order should be returned when deleting all orders', async (): Promise<void> => {
                const addedUser = await UserUseCase.add({repository:UsersRepository}).execute(testUser);
                const addedOrder = await OrderUseCase.add(dependencies).execute({...testOrder, userId:addedUser.id});
                const deletedOrders = await OrderUseCase.deleteAll?.(dependencies).execute();

                expect(deletedOrders).toBeDefined();
                expect(deletedOrders.length).toBe(1);
                expect(deletedOrders[0].id).toBe(addedOrder.id);
                expect(deletedOrders[0].status).toBe(addedOrder.status);
                expect(deletedOrders[0].userId).toBe(addedOrder.userId);
            });

            it('Array of partial orders should be returned when deleting all orders with protected option', async (): Promise<void> => {
                const addedUser = await UserUseCase.add({repository:UsersRepository}).execute(testUser);
                const addedOrder = await OrderUseCase.add(dependencies).execute({...testOrder, userId:addedUser.id});
                const deletedOrders = await OrderUseCase.deleteAll?.(dependencies).execute({protected:true});

                expect(deletedOrders).toBeDefined();
                expect(deletedOrders.length).toBe(1);
                expect(deletedOrders[0].id).toBe(addedOrder.id);
                expect(deletedOrders[0].status).toBe(addedOrder.status);
                expect(deletedOrders[0].userId).toBeUndefined();
            });
        });
    });

    describe('getOrdersForUser() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('Array of orders should be returned when getting orders for user', async (): Promise<void> => {
                const addedUser = await UserUseCase.add({repository:UsersRepository}).execute(testUser);
                const addedOrder = await OrderUseCase.add(dependencies).execute({...testOrder, userId:addedUser.id});
                const returnedOrders = await OrderUseCase.getOrdersForUser?.(dependencies).execute((addedUser.id as string));

                expect(returnedOrders).toBeDefined();
                expect(returnedOrders?.length).toBe(1);
                expect(returnedOrders?.[0].id).toBe(addedOrder.id);
                expect(returnedOrders?.[0].status).toBe(addedOrder.status);
                expect(returnedOrders?.[0].userId).toBe(addedOrder.userId);
            });

            it('Array of partial orders should be returned when getting orders for user with protected option', async (): Promise<void> => {
                const addedUser = await UserUseCase.add({repository:UsersRepository}).execute(testUser);
                const addedOrder = await OrderUseCase.add(dependencies).execute({...testOrder, userId:addedUser.id});
                const returnedOrders = await OrderUseCase.getOrdersForUser?.(dependencies).execute((addedUser.id as string),{protected:true});

                expect(returnedOrders).toBeDefined();
                expect(returnedOrders?.length).toBe(1);
                expect(returnedOrders?.[0].id).toBe(addedOrder.id);
                expect(returnedOrders?.[0].status).toBe(addedOrder.status);
                expect(returnedOrders?.[0].userId).toBeUndefined();
            });
        });

        describe('Validation Tests', (): void => {
            it('Promise should be rejected when getting orders for user without userId', async (): Promise<void> => {
                await expectAsync(OrderUseCase.getOrdersForUser?.(dependencies).execute(
                    ((null as unknown) as string)
                )).toBeRejected();
            });
        });
    });

    describe('getActiveOrderForUser() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('Order should be returned when getting active order for user', async (): Promise<void> => {
                const addedUser = await UserUseCase.add({repository:UsersRepository}).execute(testUser);
                const addedOrder = await OrderUseCase.add(dependencies).execute({...testOrder, userId:addedUser.id});
                const returnedOrder = await OrderUseCase.getActiveOrderForUser?.(dependencies).execute((addedUser.id as string));

                expect(returnedOrder).toBeDefined();
                expect(returnedOrder?.id).toBe(addedOrder.id);
                expect(returnedOrder?.status).toBe(OrderStatus.Active);
                expect(returnedOrder?.userId).toBe(addedOrder.userId);
            });

            it('Partial order should be returned when getting active order for user with protected option', async (): Promise<void> => {
                const addedUser = await UserUseCase.add({repository:UsersRepository}).execute(testUser);
                const addedOrder = await OrderUseCase.add(dependencies).execute({...testOrder, userId:addedUser.id});
                const returnedOrder = await OrderUseCase.getActiveOrderForUser?.(dependencies).execute((addedUser.id as string),{protected:true});

                expect(returnedOrder).toBeDefined();
                expect(returnedOrder?.id).toBe(addedOrder.id);
                expect(returnedOrder?.status).toBe(OrderStatus.Active);
                expect(returnedOrder?.userId).toBeUndefined();
            });
        });

        describe('Validation Tests', (): void => {
            it('Promise should be rejected when getting active order for user without userId', async (): Promise<void> => {
                await expectAsync(OrderUseCase.getOrdersForUser?.(dependencies).execute(
                    ((null as unknown) as string)
                )).toBeRejected();
            });
        });
    });

    describe('getUserOrder() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('Order should be returned when getting user order', async (): Promise<void> => {
                const addedUser = await UserUseCase.add({repository:UsersRepository}).execute(testUser);
                const addedOrder = await OrderUseCase.add(dependencies).execute({...testOrder, userId:addedUser.id});
                const returnedOrder = await OrderUseCase.getUserOrder?.(dependencies).execute((addedOrder.id as number),(addedUser.id as string));

                expect(returnedOrder).toBeDefined();
                expect(returnedOrder?.id).toBe(addedOrder.id);
                expect(returnedOrder?.status).toBe(addedOrder.status);
                expect(returnedOrder?.userId).toBe(addedOrder.userId);
            });

            it('Partial order should be returned when getting user order with protected option', async (): Promise<void> => {
                const addedUser = await UserUseCase.add({repository:UsersRepository}).execute(testUser);
                const addedOrder = await OrderUseCase.add(dependencies).execute({...testOrder, userId:addedUser.id});
                const returnedOrder = await OrderUseCase.getUserOrder?.(dependencies).execute((addedOrder.id as number),(addedUser.id as string),{protected:true});

                expect(returnedOrder).toBeDefined();
                expect(returnedOrder?.id).toBe(addedOrder.id);
                expect(returnedOrder?.status).toBe(addedOrder.status);
                expect(returnedOrder?.userId).toBeUndefined();
            });
        });

        describe('Validation Tests', (): void => {
            it('Promise should be rejected when getting user order without orderId', async (): Promise<void> => {
                await expectAsync(OrderUseCase.getUserOrder?.(dependencies).execute(
                    ((null as unknown) as number),
                    uuid()
                )).toBeRejected();
            });

            it('Promise should be rejected when getting user order without userId', async (): Promise<void> => {
                await expectAsync(OrderUseCase.getUserOrder?.(dependencies).execute(
                    0,
                    ((null as unknown) as string),
                )).toBeRejected();
            });
        });
    });

    describe('addProductToOrder() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('Product should be returned when product added to order', async (): Promise<void> => {
                const addedUser = await UserUseCase.add({repository:UsersRepository}).execute(testUser);
                const addedProduct = await ProductUseCase.add({repository:ProductsRepository}).execute(testProduct);
                const addedOrder = await OrderUseCase.add(dependencies).execute({...testOrder, userId:addedUser.id});
                const orderProduct = await OrderUseCase.addProductToOrder?.(dependencies).execute(
                    2,
                    (addedOrder.id as number),
                    (addedProduct.id as string)
                );

                expect(orderProduct).toBeDefined();
                expect(orderProduct?.name).toBe(addedProduct.name);
                expect(orderProduct?.quantity).toBe(2);
                expect(orderProduct?.price).toBe(addedProduct.price);
            });
        });

        describe('Validation Tests', (): void => {
            it('Promise should be rejected when product added to order without quantity', async (): Promise<void> => {
                await expectAsync(OrderUseCase.addProductToOrder?.(dependencies).execute(
                    ((null as unknown) as number),
                    0,
                    uuid()
                )).toBeRejected();
            });

            it('Promise should be rejected when product added to order without orderId', async (): Promise<void> => {
                await expectAsync(OrderUseCase.addProductToOrder?.(dependencies).execute(
                    2,
                    ((null as unknown) as number),
                    uuid()
                )).toBeRejected();
            });

            it('Promise should be rejected when product added to order without productId', async (): Promise<void> => {
                await expectAsync(OrderUseCase.addProductToOrder?.(dependencies).execute(
                    2,
                    0,
                    ((null as unknown) as string)
                )).toBeRejected();
            });
        });
    });

    describe('removeProductFromOrder() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('Product should be returned when product added to order', async (): Promise<void> => {
                const addedUser = await UserUseCase.add({repository:UsersRepository}).execute(testUser);
                const addedProduct = await ProductUseCase.add({repository:ProductsRepository}).execute(testProduct);
                const addedOrder = await OrderUseCase.add(dependencies).execute({...testOrder, userId:addedUser.id});
                await OrderUseCase.addProductToOrder?.(dependencies).execute(
                    2,
                    (addedOrder.id as number),
                    (addedProduct.id as string)
                );
                const orderProduct = await OrderUseCase.removeProductFromOrder?.(dependencies).execute(
                    (addedOrder.id as number),
                    (addedProduct.id as string)
                );

                expect(orderProduct).toBeDefined();
                expect(orderProduct?.name).toBe(addedProduct.name);
                expect(orderProduct?.quantity).toBe(2);
                expect(orderProduct?.price).toBe(addedProduct.price);
            });
        });

        describe('Validation Tests', (): void => {
            it('Promise should be rejected when product remove from order without orderId', async (): Promise<void> => {
                await expectAsync(OrderUseCase.removeProductFromOrder?.(dependencies).execute(
                    ((null as unknown) as number),
                    uuid()
                )).toBeRejected();
            });

            it('Promise should be rejected when product removed from order without productId', async (): Promise<void> => {
                await expectAsync(OrderUseCase.removeProductFromOrder?.(dependencies).execute(
                    0,
                    ((null as unknown) as string)
                )).toBeRejected();
            });
        });
    });

    describe('getProductsInOrder() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('Array of products should be returned when getting product in order', async (): Promise<void> => {
                const addedUser = await UserUseCase.add({repository:UsersRepository}).execute(testUser);
                const addedProduct = await ProductUseCase.add({repository:ProductsRepository}).execute(testProduct);
                const addedOrder = await OrderUseCase.add(dependencies).execute({...testOrder, userId:addedUser.id});
                const orderProduct = await OrderUseCase.addProductToOrder?.(dependencies).execute(
                    2,
                    (addedOrder.id as number),
                    (addedProduct.id as string)
                );
                const orderProducts = await OrderUseCase.getProductsInOrder?.(dependencies).execute(
                    (addedOrder.id as number)
                );

                expect(orderProducts).toBeDefined();
                expect(orderProducts?.length).toBe(1);
                expect(orderProducts?.[0].name).toBe(orderProduct?.name);
                expect(orderProducts?.[0].quantity).toBe(orderProduct?.quantity);
                expect(orderProducts?.[0].price).toBe(orderProduct?.price);
            });
        });

        describe('Validation Tests', (): void => {
            it('Promise should be rejected when getting products in order without orderId', async (): Promise<void> => {
                await expectAsync(OrderUseCase.getProductsInOrder?.(dependencies).execute(
                    ((null as unknown) as number),
                )).toBeRejected();
            });
        });
    });

    describe('deleteAllOrdersForUser() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('Array of orders should be returned when deleting all orders for user', async (): Promise<void> => {
                const addedUser = await UserUseCase.add({repository:UsersRepository}).execute(testUser);
                const addedOrder = await OrderUseCase.add(dependencies).execute({...testOrder, userId:addedUser.id});
                const returnedOrders = await OrderUseCase.deleteAllOrdersForUser?.(dependencies).execute(
                    (addedUser.id as string)
                );

                expect(returnedOrders).toBeDefined();
                expect(returnedOrders?.length).toBe(1);
                expect(returnedOrders?.[0].id).toBe(addedOrder.id);
                expect(returnedOrders?.[0].status).toBe(addedOrder.status);
                expect(returnedOrders?.[0].userId).toBe(addedOrder.userId);
            });

            it('Array of partial orders should be returned when deleting all orders for user with protected option', async (): Promise<void> => {
                const addedUser = await UserUseCase.add({repository:UsersRepository}).execute(testUser);
                const addedOrder = await OrderUseCase.add(dependencies).execute({...testOrder, userId:addedUser.id});
                const returnedOrders = await OrderUseCase.deleteAllOrdersForUser?.(dependencies).execute(
                    (addedUser.id as string),
                    {protected: true}
                );

                expect(returnedOrders).toBeDefined();
                expect(returnedOrders?.length).toBe(1);
                expect(returnedOrders?.[0].id).toBe(addedOrder.id);
                expect(returnedOrders?.[0].status).toBe(addedOrder.status);
                expect(returnedOrders?.[0].userId).toBeUndefined();
            });
        });

        describe('Validation Tests', (): void => {
            it('Promise should be rejected when deleting all orders for user without userId', async (): Promise<void> => {
                await expectAsync(OrderUseCase.deleteAllOrdersForUser?.(dependencies).execute(
                    ((null as unknown) as string),
                )).toBeRejected();
            });
        });
    });

    describe('deleteAllProductsInOrder() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('Array of order products should be returned when deleting all products in order', async (): Promise<void> => {
                const addedUser = await UserUseCase.add({repository:UsersRepository}).execute(testUser);
                const addedProduct = await ProductUseCase.add({repository:ProductsRepository}).execute(testProduct);
                const addedOrder = await OrderUseCase.add(dependencies).execute({...testOrder, userId:addedUser.id});
                await OrderUseCase.addProductToOrder?.(dependencies).execute(
                    2,
                    (addedOrder.id as number),
                    (addedProduct.id as string)
                );
                const returnedOrderProducts = await OrderUseCase.deleteAllProductsInOrder?.(dependencies).execute(
                    (addedOrder.id as number)
                );

                expect(returnedOrderProducts).toBeDefined();
                expect(returnedOrderProducts?.length).toBe(1);
                expect(returnedOrderProducts?.[0].name).toBe(addedProduct.name);
                expect(returnedOrderProducts?.[0].quantity).toBe(2);
                expect(returnedOrderProducts?.[0].price).toBe(addedProduct.price);
            });
        });

        describe('Validation Tests', (): void => {
            it('Promise should be rejected when deleting all products in order without orderId', async (): Promise<void> => {
                await expectAsync(OrderUseCase.deleteAllProductsInOrder?.(dependencies).execute(
                    ((null as unknown) as  number),
                )).toBeRejected();
            });
        });
    });

    describe('getAllOrderProducts() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('Array of order products should be returned when getting all order products', async (): Promise<void> => {
                const addedUser = await UserUseCase.add({repository:UsersRepository}).execute(testUser);
                const addedProduct = await ProductUseCase.add({repository:ProductsRepository}).execute(testProduct);
                const addedOrder = await OrderUseCase.add(dependencies).execute({...testOrder, userId:addedUser.id});
                await OrderUseCase.addProductToOrder?.(dependencies).execute(
                    2,
                    (addedOrder.id as number),
                    (addedProduct.id as string)
                );
                const returnedOrderProducts = await OrderUseCase.getAllOrderProducts?.(dependencies).execute();

                expect(returnedOrderProducts).toBeDefined();
                expect(returnedOrderProducts?.length).toBe(1);
                expect(returnedOrderProducts?.[0].id).toBeDefined();
                expect(returnedOrderProducts?.[0].quantity).toBe(2);
                expect(Number(returnedOrderProducts?.[0].orderId)).toBe((addedOrder?.id as number));
                expect(returnedOrderProducts?.[0].productId).toBe(addedProduct.id);
            });
        });
    });

    describe('deleteAllOrderProducts() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('Array of order products should be returned when deleting all order products', async (): Promise<void> => {
                const addedUser = await UserUseCase.add({repository:UsersRepository}).execute(testUser);
                const addedProduct = await ProductUseCase.add({repository:ProductsRepository}).execute(testProduct);
                const addedOrder = await OrderUseCase.add(dependencies).execute({...testOrder, userId:addedUser.id});
                await OrderUseCase.addProductToOrder?.(dependencies).execute(
                    2,
                    (addedOrder.id as number),
                    (addedProduct.id as string)
                );
                const returnedOrderProducts = await OrderUseCase.deleteAllOrderProducts?.(dependencies).execute();

                expect(returnedOrderProducts).toBeDefined();
                expect(returnedOrderProducts?.length).toBe(1);
                expect(returnedOrderProducts?.[0].id).toBeDefined();
                expect(returnedOrderProducts?.[0].quantity).toBe(2);
                expect(Number(returnedOrderProducts?.[0].orderId)).toBe((addedOrder?.id as number));
                expect(returnedOrderProducts?.[0].productId).toBe(addedProduct.id);
            });
        });
    });
});
