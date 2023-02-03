import supertest from 'supertest';
import app from '../../../../../src';
import {Product} from '../../../../../src/entities';
import {ProductsRepository, UsersRepository} from '../../../../../src/frameworks/repositories/postgres';

const request = supertest(app);
const API_PREFIX = '/api/v1';

describe('Products Router Tests', () => {
    let productId: string;
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
            username: 'customer',
            password: 'password123',
            firstName: 'Peter',
            lastName: 'Parker',
            level: 0
        });

        await ProductsRepository.add({
            name: 'Soap Bar',
            description: 'Very nice soap!',
            price: 5.99
        });

        const product = await ProductsRepository.add({
            name: 'Aluminum Foil',
            description: 'Use it to cook anything!',
            price: 2.73
        });

        productId = product.id as string;
    });

    afterAll(async (): Promise<void> => {
        await ProductsRepository.deleteAll?.();
        await ProductsRepository.deleteAllCategories?.();
        await UsersRepository.deleteAllSessions?.();
        await UsersRepository.deleteAll();
    });

    describe('Unauthenticated User Tests', () => {
        it('Response status 404 should be returned when getting products without being authenticated', async (): Promise<void> => {
            const response = await request.get(`${API_PREFIX}/products`);
            expect(response.status).toEqual(404);
        });

        it('Response status 404 should be returned when getting product without being authenticated', async (): Promise<void> => {
            const response = await request.get(`${API_PREFIX}/products/${productId}`);
            expect(response.status).toEqual(404);
        });

        it('Response status 404 should be returned when creating product without being authenticated', async (): Promise<void> => {
            const response = await request.post(`${API_PREFIX}/products`);
            expect(response.status).toEqual(404);
        });

        it('Response status 404 should be returned when updating product without being authenticated', async (): Promise<void> => {
            const response = await request.put(`${API_PREFIX}/products`);
            expect(response.status).toEqual(404);
        });

        it('Response status 404 should be returned when deleting product without being authenticated', async (): Promise<void> => {
            const response = await request.delete(`${API_PREFIX}/products`);
            expect(response.status).toEqual(404);
        });
    });

    describe('Authenticated Admin Tests', () => {
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

        it('Response with array of products should be returned when getting products', async (): Promise<void> => {
            const response = await request.get(`${API_PREFIX}/products`).set('Cookie', [A_TOKEN, R_TOKEN]);

            expect(response.status).toBe(200);
            expect(response.body.status).toBe(200);
            expect(response.body.message.length).toBe(2);
        });

        it('Response with product object should be returned when getting product', async (): Promise<void> => {
            const response = await request.get(`${API_PREFIX}/products/${productId}`).set('Cookie', [A_TOKEN, R_TOKEN]);

            expect(response.status).toBe(200);
            expect(response.body.status).toBe(200);
            expect(response.body.message.id).toBeDefined();
            expect(response.body.message.name).toBeDefined();
            expect(response.body.message.description).toBeDefined();
            expect(response.body.message.price).toBeDefined();
        });

        it('Response with product object should be returned when creating product', async (): Promise<void> => {
            const response = await request.post(`${API_PREFIX}/products`)
                .set('Cookie', [A_TOKEN, R_TOKEN])
                .type('json')
                .send({
                    name: 'Milk',
                    description: 'Drink me and grow strong bones!',
                    price: 4.99
                });

            expect(response.status).toBe(200);
            expect(response.body.status).toBe(200);
            expect(response.body.message.id).toBeDefined();
            expect(response.body.message.name).toBe('Milk');
            expect(response.body.message.description).toBe('Drink me and grow strong bones!');
            expect(Number(response.body.message.price)).toBe(4.99);
        });

        it('Response with product object should be returned when updating product', async (): Promise<void> => {
            const response = await request.get(`${API_PREFIX}/products/${productId}`).set('Cookie', [A_TOKEN, R_TOKEN]);
            const product = response.body.message as Product;
            const productResponse = await request.put(`${API_PREFIX}/products`)
                .set('Cookie', [A_TOKEN, R_TOKEN])
                .type('json')
                .send({
                    ...product,
                    price: 3.99
                });

            expect(productResponse.status).toBe(200);
            expect(productResponse.body.status).toBe(200);
            expect(productResponse.body.message.id).toBeDefined();
            expect(productResponse.body.message.name).toBeDefined();
            expect(productResponse.body.message.description).toBeDefined();
            expect(Number(productResponse.body.message.price)).toBe(3.99);
        });

        it('Response with product object should be returned when deleting product', async (): Promise<void> => {
            const response = await request.delete(`${API_PREFIX}/products/${productId}`).set('Cookie', [A_TOKEN, R_TOKEN]);

            expect(response.status).toBe(200);
            expect(response.body.status).toBe(200);
            expect(response.body.message.id).toBeDefined();
            expect(response.body.message.name).toBeDefined();
            expect(response.body.message.description).toBeDefined();
            expect(response.body.message.price).toBeDefined();
        });
    });

    describe('Authenticated Customer Tests', () => {
        beforeAll(async (): Promise<void> => {
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

        it('Response status 404 should be returned when getting products as customer', async (): Promise<void> => {
            const response = await request.get(`${API_PREFIX}/products`).set('Cookie', [A_TOKEN, R_TOKEN]);
            expect(response.status).toBe(404);
        });

        it('Response status 404 should be returned when getting product as customer', async (): Promise<void> => {
            const response = await request.get(`${API_PREFIX}/products/${productId}`).set('Cookie', [A_TOKEN, R_TOKEN]);
            expect(response.status).toBe(404);
        });

        it('Response status 404 should be returned when creating product as customer', async (): Promise<void> => {
            const response = await request.post(`${API_PREFIX}/products`).set('Cookie', [A_TOKEN, R_TOKEN]);
            expect(response.status).toBe(404);
        });

        it('Response status 404 should be returned when updating product as customer', async (): Promise<void> => {
            const response = await request.put(`${API_PREFIX}/products`).set('Cookie', [A_TOKEN, R_TOKEN]);
            expect(response.status).toBe(404);
        });

        it('Response status 404 should be returned when deleting product as customer', async (): Promise<void> => {
            const response = await request.delete(`${API_PREFIX}/products`).set('Cookie', [A_TOKEN, R_TOKEN]);
            expect(response.status).toBe(404);
        });
    });
});
