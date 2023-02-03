import supertest from 'supertest';
import app from '../../../../../src';
import {Order} from '../../../../../src/entities';
import {OrderStatus} from '../../../../../src/entities/enums';
import {OrdersRepository, UsersRepository} from '../../../../../src/frameworks/repositories/postgres';

const request = supertest(app);
const API_PREFIX = '/api/v1';

describe('Orders Router Tests', (): void => {
    let customerId: string;
    let orderId: number;
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

        const customer = await UsersRepository.add({
            username: 'customer',
            password: 'password123',
            firstName: 'Peter',
            lastName: 'Parker',
            level: 0
        });

        customerId = customer.id as string;

        await OrdersRepository.add({
            status: OrderStatus.Inactive,
            userId: customerId
        });

        const order = await OrdersRepository.add({
            status: OrderStatus.Active,
            userId: customerId
        });

        orderId = order.id as number;
    });

    afterAll(async (): Promise<void> => {
        await OrdersRepository.deleteAll();
        await UsersRepository.deleteAllSessions?.();
        await UsersRepository.deleteAll();
    });

    describe('Unauthenticated User Tests', (): void => {
        it('Response status 404 should be returned when getting orders without being authenticated', async (): Promise<void> => {
            const response = await request.get(`${API_PREFIX}/orders`);
            expect(response.status).toEqual(404);
        });

        it('Response status 404 should be returned when getting order without being authenticated', async (): Promise<void> => {
            const response = await request.get(`${API_PREFIX}/orders/${orderId}`);
            expect(response.status).toEqual(404);
        });

        it('Response status 404 should be returned when creating order without being authenticated', async (): Promise<void> => {
            const response = await request.post(`${API_PREFIX}/orders`);
            expect(response.status).toEqual(404);
        });

        it('Response status 404 should be returned when updating order without being authenticated', async (): Promise<void> => {
            const response = await request.put(`${API_PREFIX}/orders`);
            expect(response.status).toEqual(404);
        });

        it('Response status 404 should be returned when deleting order without being authenticated', async (): Promise<void> => {
            const response = await request.delete(`${API_PREFIX}/orders`);
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

        it('Response with array of orders should be returned when getting orders', async (): Promise<void> => {
            const response = await request.get(`${API_PREFIX}/orders`).set('Cookie', [A_TOKEN, R_TOKEN]);

            expect(response.status).toBe(200);
            expect(response.body.status).toBe(200);
            expect(response.body.message.length).toBe(2);
        });

        it('Response with order object should be returned when getting order', async (): Promise<void> => {
            const response = await request.get(`${API_PREFIX}/orders/${orderId}`).set('Cookie', [A_TOKEN, R_TOKEN]);

            expect(response.status).toBe(200);
            expect(response.body.status).toBe(200);
            expect(response.body.message.id).toBeDefined();
            expect(response.body.message.status).toBeDefined();
            expect(response.body.message.userId).toBeDefined();
        });

        it('Response with order object should be returned when creating order', async (): Promise<void> => {
            const response = await request.post(`${API_PREFIX}/orders`)
                .set('Cookie', [A_TOKEN, R_TOKEN])
                .type('json')
                .send({
                    status: OrderStatus.Active,
                    userId: customerId
                });

            expect(response.status).toBe(200);
            expect(response.body.status).toBe(200);
            expect(response.body.message.id).toBeDefined();
            expect(response.body.message.status).toBeDefined();
            expect(response.body.message.userId).toBeDefined();
        });

        it('Response with order object should be returned when updating order', async (): Promise<void> => {
            const response = await request.get(`${API_PREFIX}/orders/${orderId}`).set('Cookie', [A_TOKEN, R_TOKEN]);
            const order = response.body.message as Order;
            const orderResponse = await request.put(`${API_PREFIX}/orders`)
                .set('Cookie', [A_TOKEN, R_TOKEN])
                .type('json')
                .send({
                    ...order,
                    status: OrderStatus.Inactive
                });

            expect(orderResponse.status).toBe(200);
            expect(orderResponse.body.status).toBe(200);
            expect(orderResponse.body.message.id).toBeDefined();
            expect(orderResponse.body.message.status).toBeDefined();
            expect(orderResponse.body.message.userId).toBeDefined();
        });

        it('Response with order object should be returned when deleting order', async (): Promise<void> => {
            const response = await request.delete(`${API_PREFIX}/orders/${orderId}`).set('Cookie', [A_TOKEN, R_TOKEN]);

            expect(response.status).toBe(200);
            expect(response.body.status).toBe(200);
            expect(response.body.message.id).toBeDefined();
            expect(response.body.message.status).toBeDefined();
            expect(response.body.message.userId).toBeDefined();
        });
    });
});
