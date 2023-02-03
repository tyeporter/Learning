import supertest from 'supertest';
import app from '../../../../../../src';
import vars from '../../../../../../src/config/vars';
import {
    OrdersRepository,
    ProductsRepository,
    UsersRepository
} from '../../../../../../src/frameworks/repositories/postgres';
import {OrderStatus} from '../../../../../../src/entities/enums';

const request = supertest(app);
const API_PREFIX = vars.apiPrefix;
const STORE_PREFIX = API_PREFIX + '/store';

describe('Customer Service Router Tests', (): void => {
    let customerId: string;
    let orderId = 0;
    let categoryId = 0;
    let productId = '';
    let A_TOKEN: string;
    let R_TOKEN: string;

    beforeAll(async (): Promise<void> => {
        await UsersRepository.add({
            username: 'admin',
            password: 'password123',
            firstName: 'administrator',
            lastName: '',
            level: 1
        });

        await UsersRepository.add({
            username: 'deletableDude36',
            password: 'deleteMe123',
            firstName: 'No',
            lastName: 'Body',
            level: 0
        });

        const customer = await UsersRepository.add({
            username: 'customer',
            password: 'password123',
            firstName: 'Peter',
            lastName: 'Parker',
            level: 0
        });

        customerId = customer.id as string;
    });

    afterAll(async (): Promise<void> => {
        await OrdersRepository.deleteAllOrderProducts?.();
        await OrdersRepository.deleteAll();
        await ProductsRepository.deleteAll();
        await ProductsRepository.deleteAllCategories?.();
        await UsersRepository.deleteAllSessions?.();
        await UsersRepository.deleteAll();
    });

    describe('Unauthenticated User Tests', (): void => {
        it('Response status 404 should be returned when getting account without being authenticated', async (): Promise<void> => {
            const response = await request.get(`${STORE_PREFIX}/account`);
            expect(response.status).toEqual(404);
        });

        it('Response status 404 should be returned when updating account without being authenticated', async (): Promise<void> => {
            const response = await request.put(`${STORE_PREFIX}/account`);
            expect(response.status).toEqual(404);
        });

        it('Response status 404 should be returned when deleting account without being authenticated', async (): Promise<void> => {
            const response = await request.delete(`${STORE_PREFIX}/account`);
            expect(response.status).toEqual(404);
        });

        it('Response status 404 should be returned when getting account orders without being authenticated', async (): Promise<void> => {
            const response = await request.get(`${STORE_PREFIX}/account/orders`);
            expect(response.status).toEqual(404);
        });

        it('Response status 404 should be returned when getting account order without being authenticated', async (): Promise<void> => {
            const response = await request.get(`${STORE_PREFIX}/account/orders/${orderId}`);
            expect(response.status).toEqual(404);
        });

        it('Response status 404 should be returned when getting cart without being authenticated', async (): Promise<void> => {
            const response = await request.get(`${STORE_PREFIX}/cart`);
            expect(response.status).toEqual(404);
        });

        it('Response status 404 should be returned when removing item from cart without being authenticated', async (): Promise<void> => {
            const response = await request.delete(`${STORE_PREFIX}/cart/remove-item/${productId}`);
            expect(response.status).toEqual(404);
        });

        it('Response status 404 should be returned when checking out without being authenticated', async (): Promise<void> => {
            const response = await request.put(`${STORE_PREFIX}/checkout`);
            expect(response.status).toEqual(404);
        });

        it('Response status 404 should be returned when getting products without being authenticated', async (): Promise<void> => {
            const response = await request.get(`${STORE_PREFIX}/products`);
            expect(response.status).toEqual(404);
        });

        it('Response status 404 should be returned when getting product without being authenticated', async (): Promise<void> => {
            const response = await request.get(`${STORE_PREFIX}/products/${productId}`);
            expect(response.status).toEqual(404);
        });

        it('Response status 404 should be returned when adding product to cart without being authenticated', async (): Promise<void> => {
            const response = await request.post(`${STORE_PREFIX}/products/${productId}/add-to-cart`);
            expect(response.status).toEqual(404);
        });

        it('Response status 404 should be returned when getting categories without being authenticated', async (): Promise<void> => {
            const response = await request.get(`${STORE_PREFIX}/categories`);
            expect(response.status).toEqual(404);
        });

        it('Response status 404 should be returned when getting category without being authenticated', async (): Promise<void> => {
            const response = await request.get(`${STORE_PREFIX}/categories/${categoryId}`);
            expect(response.status).toEqual(404);
        });
    });

    describe('Authenticated Admin Tests', (): void => {
        beforeAll(async (): Promise<void> => {
            try {
                const response = await request.post(`${API_PREFIX}/sign-in`)
                    .type('json')
                    .send({
                        username: 'admin',
                        password: 'password123'
                    });
                A_TOKEN = response.headers['set-cookie'][0].split(';')[0];
                R_TOKEN = response.headers['set-cookie'][1].split(';')[0];
            } catch (error) {
                console.log(error);
            }
        });

        it('Response status 404 should be returned when getting account as admin', async (): Promise<void> => {
            const response = await request.get(`${STORE_PREFIX}/account`).set('Cookie', [A_TOKEN, R_TOKEN]);
            expect(response.status).toEqual(404);
        });

        it('Response status 404 should be returned when updating account as admin', async (): Promise<void> => {
            const response = await request.put(`${STORE_PREFIX}/account`).set('Cookie', [A_TOKEN, R_TOKEN]);
            expect(response.status).toEqual(404);
        });

        it('Response status 404 should be returned when deleting account as admin', async (): Promise<void> => {
            const response = await request.delete(`${STORE_PREFIX}/account`).set('Cookie', [A_TOKEN, R_TOKEN]);
            expect(response.status).toEqual(404);
        });

        it('Response status 404 should be returned when getting account orders as admin', async (): Promise<void> => {
            const response = await request.get(`${STORE_PREFIX}/account/orders`).set('Cookie', [A_TOKEN, R_TOKEN]);
            expect(response.status).toEqual(404);
        });

        it('Response status 404 should be returned when getting account order as admin', async (): Promise<void> => {
            const response = await request.get(`${STORE_PREFIX}/account/orders/${orderId}`).set('Cookie', [A_TOKEN, R_TOKEN]);
            expect(response.status).toEqual(404);
        });

        it('Response status 404 should be returned when getting cart as admin', async (): Promise<void> => {
            const response = await request.get(`${STORE_PREFIX}/cart`).set('Cookie', [A_TOKEN, R_TOKEN]);
            expect(response.status).toEqual(404);
        });

        it('Response status 404 should be returned when removing item from cart as admin', async (): Promise<void> => {
            const response = await request.delete(`${STORE_PREFIX}/cart/remove-item/${productId}`).set('Cookie', [A_TOKEN, R_TOKEN]);
            expect(response.status).toEqual(404);
        });

        it('Response status 404 should be returned when checking out as admin', async (): Promise<void> => {
            const response = await request.put(`${STORE_PREFIX}/checkout`).set('Cookie', [A_TOKEN, R_TOKEN]);
            expect(response.status).toEqual(404);
        });

        it('Response status 404 should be returned when getting products as admin', async (): Promise<void> => {
            const response = await request.get(`${STORE_PREFIX}/products`).set('Cookie', [A_TOKEN, R_TOKEN]);
            expect(response.status).toEqual(404);
        });

        it('Response status 404 should be returned when getting product as admin', async (): Promise<void> => {
            const response = await request.get(`${STORE_PREFIX}/products/${productId}`).set('Cookie', [A_TOKEN, R_TOKEN]);
            expect(response.status).toEqual(404);
        });

        it('Response status 404 should be returned when adding product to cart as admin', async (): Promise<void> => {
            const response = await request.post(`${STORE_PREFIX}/products/${productId}/add-to-cart`).set('Cookie', [A_TOKEN, R_TOKEN]);
            expect(response.status).toEqual(404);
        });

        it('Response status 404 should be returned when getting categories as admin', async (): Promise<void> => {
            const response = await request.get(`${STORE_PREFIX}/categories`).set('Cookie', [A_TOKEN, R_TOKEN]);
            expect(response.status).toEqual(404);
        });

        it('Response status 404 should be returned when getting category as admin', async (): Promise<void> => {
            const response = await request.get(`${STORE_PREFIX}/categories/${categoryId}`).set('Cookie', [A_TOKEN, R_TOKEN]);
            expect(response.status).toEqual(404);
        });
    });

    describe('Authenticated Customer Tests', (): void => {
        describe('Account Tests', () => {
            beforeAll(async (): Promise<void> => {
                try {
                    const response = await request.post(`${API_PREFIX}/sign-in`)
                        .type('json')
                        .send({
                            username: 'deletableDude36',
                            password: 'deleteMe123'
                        });
                    A_TOKEN = response.headers['set-cookie'][0].split(';')[0];
                    R_TOKEN = response.headers['set-cookie'][1].split(';')[0];
                } catch (error) {
                    console.log(error);
                }
            });

            it('Response with account object should be returned when getting account', async (): Promise<void> => {
                const response = await request.get(`${STORE_PREFIX}/account`).set('Cookie', [A_TOKEN, R_TOKEN]);

                expect(response.status).toBe(200);
                expect(response.body.status).toBe(200);
                expect(response.body.message.id).toBeDefined();
                expect(response.body.message.username).toBeDefined();
                expect(response.body.message.firstName).toBeDefined();
                expect(response.body.message.lastName).toBeDefined();
                expect(response.body.message.orders).toBeDefined();
                expect(response.body.message.orders.length).toBe(0);
            });

            it('Response with protected user object should be returned when updating account', async (): Promise<void> => {
                const response = await request.put(`${STORE_PREFIX}/account`)
                    .set('Cookie', [A_TOKEN, R_TOKEN])
                    .type('json')
                    .send({
                        username: 'deletableDude36',
                        firstName: 'Some',
                        lastName: 'Body'
                    });
                A_TOKEN = response.headers['set-cookie'][0].split(';')[0];
                R_TOKEN = response.headers['set-cookie'][1].split(';')[0];

                expect(response.status).toBe(200);
                expect(response.body.status).toBe(200);
                expect(response.body.message.id).toBeUndefined();
                expect(response.body.message.username).toBeDefined();
                expect(response.body.message.password).toBeUndefined();
                expect(response.body.message.firstName).toBeDefined();
                expect(response.body.message.lastName).toBeDefined();
                expect(response.body.message.level).toBeUndefined();
            });

            it('Response with farewell message should be returned when deleting account', async (): Promise<void> => {
                const response = await request.delete(`${STORE_PREFIX}/account`)
                    .set('Cookie', [A_TOKEN, R_TOKEN])
                    .type('json')
                    .send();

                expect(response.status).toBe(200);
                expect(response.body.status).toBe(200);
                expect(response.body.message).toContain('We\'re sad to see you go');
            });
        });

        describe('Order, Product, and Category Tests', (): void => {
            beforeAll(async (): Promise<void> => {
                const order = await OrdersRepository.add({
                    status: OrderStatus.Active,
                    userId: customerId
                });

                orderId = (order.id as number);

                const category = await ProductsRepository.addCategory?.('body care');

                categoryId = (category?.id as number);

                const product = await ProductsRepository.add({
                    name: 'Soap Bar',
                    description: 'Very nice soap!',
                    price: 5.99,
                    categoryId
                });

                productId = (product.id as string);

                await OrdersRepository.addProductToOrder?.(2, orderId, productId);

                try {
                    const response = await request.post(`${API_PREFIX}/sign-in`)
                        .type('json')
                        .send({
                            username: 'customer',
                            password: 'password123'
                        });
                    A_TOKEN = response.headers['set-cookie'][0].split(';')[0];
                    R_TOKEN = response.headers['set-cookie'][1].split(';')[0];
                } catch (error) {
                    console.log(error);
                }
            });

            it('Response with array of orders should be returned when getting account orders', async (): Promise<void> => {
                const response = await request.get(`${STORE_PREFIX}/account/orders`).set('Cookie', [A_TOKEN, R_TOKEN]);

                expect(response.status).toBe(200);
                expect(response.body.status).toBe(200);
                expect(response.body.message).toBeDefined();
                expect(response.body.message.length).toBe(1);
            });

            it('Response with order object should be returned when getting account order', async (): Promise<void> => {
                const response = await request.get(`${STORE_PREFIX}/account/orders/${orderId}`).set('Cookie', [A_TOKEN, R_TOKEN]);

                expect(response.status).toBe(200);
                expect(response.body.message.id).toBeDefined();
                expect(response.body.message.status).toBeDefined();
            });

            it('Response with array of order products should be returned when getting cart', async (): Promise<void> => {
                const response = await request.get(`${STORE_PREFIX}/cart`).set('Cookie', [A_TOKEN, R_TOKEN]);

                expect(response.status).toBe(200);
                expect(response.body.status).toBe(200);
                expect(response.body.message).toBeDefined();
                expect(response.body.message.length).toBe(1);
                expect(response.body.message[0].name).toBeDefined();
                expect(response.body.message[0].quantity).toBeDefined();
                expect(response.body.message[0].price).toBeDefined();
            });

            it('Response with order product object should be returned when removing item from cart', async (): Promise<void> => {
                const response = await request.delete(`${STORE_PREFIX}/cart/remove-item/${productId}`).set('Cookie', [A_TOKEN, R_TOKEN]);

                expect(response.status).toBe(200);
                expect(response.body.status).toBe(200);
                expect(response.body.message.name).toBeDefined();
                expect(response.body.message.quantity).toBeDefined();
                expect(response.body.message.price).toBeDefined();
            });

            it('Response with order product object should be returned when adding item to cart', async (): Promise<void> => {
                const response = await request.post(`${STORE_PREFIX}/products/${productId}/add-to-cart`)
                    .set('Cookie', [A_TOKEN, R_TOKEN])
                    .query({
                        quantity: 2
                    });

                expect(response.status).toBe(200);
                expect(response.body.status).toBe(200);
                expect(response.body.message.name).toBeDefined();
                expect(response.body.message.quantity).toBeDefined();
                expect(response.body.message.price).toBeDefined();
            });

            it('Response with checkout message should be returned when checking out', async (): Promise<void> => {
                const response = await request.put(`${STORE_PREFIX}/checkout`).set('Cookie', [A_TOKEN, R_TOKEN]);

                expect(response.status).toBe(200);
                expect(response.body.status).toBe(200);
                expect(response.body.message).toContain('Thank you for your order');
            });

            it('Response with array of products should be returned when getting products', async (): Promise<void> => {
                const response = await request.get(`${STORE_PREFIX}/products`).set('Cookie', [A_TOKEN, R_TOKEN]);

                expect(response.status).toBe(200);
                expect(response.body.status).toBe(200);
                expect(response.body.message).toBeDefined();
                expect(response.body.message.length).toBe(1);
                expect(response.body.message[0].name).toBeDefined();
                expect(response.body.message[0].description).toBeDefined();
                expect(response.body.message[0].price).toBeDefined();
            });

            it('Response with product object should be returned when getting product', async (): Promise<void> => {
                const response = await request.get(`${STORE_PREFIX}/products/${productId}`).set('Cookie', [A_TOKEN, R_TOKEN]);

                expect(response.status).toBe(200);
                expect(response.body.status).toBe(200);
                expect(response.body.message.name).toBeDefined();
                expect(response.body.message.description).toBeDefined();
                expect(response.body.message.price).toBeDefined();
            });

            it('Response with array of product categories should be returned when getting categories', async (): Promise<void> => {
                const response = await request.get(`${STORE_PREFIX}/categories`).set('Cookie', [A_TOKEN, R_TOKEN]);

                expect(response.status).toBe(200);
                expect(response.body.status).toBe(200);
                expect(response.body.message).toBeDefined();
                expect(response.body.message.length).toBe(1);
                expect(response.body.message[0].id).toBeDefined();
                expect(response.body.message[0].name).toBeDefined();
            });

            it('Response with array of products should be returned when getting category', async (): Promise<void> => {
                const response = await request.get(`${STORE_PREFIX}/categories/${categoryId}`).set('Cookie', [A_TOKEN, R_TOKEN]);

                expect(response.status).toBe(200);
                expect(response.body.status).toBe(200);
                expect(response.body.message).toBeDefined();
                expect(response.body.message.length).toBe(1);
                expect(response.body.message[0].name).toBeDefined();
                expect(response.body.message[0].description).toBeDefined();
                expect(response.body.message[0].price).toBeDefined();
            });
        });
    });
});
