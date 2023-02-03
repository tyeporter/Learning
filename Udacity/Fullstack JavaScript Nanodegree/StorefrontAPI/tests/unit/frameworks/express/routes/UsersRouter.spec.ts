import supertest from 'supertest';
import app from '../../../../../src';
import {User} from '../../../../../src/entities';
import {UsersRepository} from '../../../../../src/frameworks/repositories/postgres';

const request = supertest(app);
const API_PREFIX = '/api/v1';

describe('Users Router Tests', () => {
    let userId: string;
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

        const user = await UsersRepository.add({
            username: 'customer',
            password: 'password123',
            firstName: 'Peter',
            lastName: 'Parker',
            level: 0
        });

        userId = user.id as string;
    });

    afterAll(async (): Promise<void> => {
        await UsersRepository.deleteAllSessions?.();
        await UsersRepository.deleteAll();
    });

    describe('Unauthenticated User Tests', () => {
        it('Response status 404 should be returned when getting users without being authenticated', async (): Promise<void> => {
            const response = await request.get(`${API_PREFIX}/users`);
            expect(response.status).toEqual(404);
        });

        it('Response status 404 should be returned when getting user without being authenticated', async (): Promise<void> => {
            const response = await request.get(`${API_PREFIX}/users/${userId}`);
            expect(response.status).toEqual(404);
        });

        it('Response status 404 should be returned when creating user without being authenticated', async (): Promise<void> => {
            const response = await request.post(`${API_PREFIX}/users`);
            expect(response.status).toEqual(404);
        });

        it('Response status 404 should be returned when updating user without being authenticated', async (): Promise<void> => {
            const response = await request.put(`${API_PREFIX}/users`);
            expect(response.status).toEqual(404);
        });

        it('Response status 404 should be returned when deleting user without being authenticated', async (): Promise<void> => {
            const response = await request.delete(`${API_PREFIX}/users`);
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

        it('Response with array of users should be returned when getting users', async (): Promise<void> => {
            const response = await request.get(`${API_PREFIX}/users`).set('Cookie', [A_TOKEN, R_TOKEN]);

            expect(response.status).toBe(200);
            expect(response.body.status).toBe(200);
            expect(response.body.message.length).toBe(2);
        });

        it('Response with user object should be returned when getting user by id', async (): Promise<void> => {
            const response = await request.get(`${API_PREFIX}/users/${userId}`).set('Cookie', [A_TOKEN, R_TOKEN]);

            expect(response.status).toBe(200);
            expect(response.body.status).toBe(200);
            expect(response.body.message.id).toBeDefined();
            expect(response.body.message.username).toBe('customer');
            expect(response.body.message.firstName).toBe('Peter');
            expect(response.body.message.lastName).toBe('Parker');
            expect(response.body.message.level).toBe(0);
        });

        it('Response with user object should be returned when creating user', async (): Promise<void> => {
            const response = await request.post(`${API_PREFIX}/users`)
                .set('Cookie', [A_TOKEN, R_TOKEN])
                .type('json')
                .send({
                    username: 'testUser',
                    password: 'password123',
                    firstName: 'Test',
                    lastName: 'User',
                    level: 0
                });

            expect(response.status).toBe(200);
            expect(response.body.status).toBe(200);
            expect(response.body.message.username).toBe('testUser');
            expect(response.body.message.firstName).toBe('Test');
            expect(response.body.message.lastName).toBe('User');
            expect(response.body.message.level).toBe(0);
        });

        it('Response with user object should be returned when updating user', async (): Promise<void> => {
            const response = await request.get(`${API_PREFIX}/users/${userId}`).set('Cookie', [A_TOKEN, R_TOKEN]);
            const user = response.body.message as User;
            const userResponse = await request.put(`${API_PREFIX}/users`)
                .set('Cookie', [A_TOKEN, R_TOKEN])
                .type('json')
                .send({
                    ...user,
                    firstName: 'Miles',
                    lastName: 'Morales'
                });

            expect(userResponse.status).toBe(200);
            expect(userResponse.body.status).toBe(200);
            expect(userResponse.body.message.id).toBe(user.id);
            expect(userResponse.body.message.username).toBe(user.username);
            expect(userResponse.body.message.firstName).not.toBe(user.firstName);
            expect(userResponse.body.message.lastName).not.toBe(user.lastName);
            expect(userResponse.body.message.level).toBe(user.level);
        });

        it('Response with user object should be returned when deleting user', async (): Promise<void> => {
            const response = await request.delete(`${API_PREFIX}/users/${userId}`).set('Cookie', [A_TOKEN, R_TOKEN]);

            expect(response.status).toBe(200);
            expect(response.body.status).toBe(200);
            expect(response.body.message.id).toBeDefined();
            expect(response.body.message.username).toBe('customer');
            expect(response.body.message.firstName).toBe('Miles');
            expect(response.body.message.lastName).toBe('Morales');
            expect(response.body.message.level).toBe(0);
        });
    });

    describe('Authenticated Customer Tests', () => {
        beforeAll(async (): Promise<void> => {
            try {
                const response = await request.post(`${API_PREFIX}/sign-in`)
                    .type('json')
                    .send({
                        username: 'testUser',
                        password: 'password123'
                    });
                A_TOKEN = response.headers['set-cookie'][0].split(';')[0];
                R_TOKEN = response.headers['set-cookie'][1].split(';')[0];
            } catch (error) {
                console.log(error);
            }
        });

        it('Response status 404 should be returned when getting users as customer', async (): Promise<void> => {
            const response = await request.get(`${API_PREFIX}/users`).set('Cookie', [A_TOKEN, R_TOKEN]);
            expect(response.status).toBe(404);
        });

        it('Response status 404 should be returned when getting user as customer', async (): Promise<void> => {
            const response = await request.get(`${API_PREFIX}/users/${userId}`).set('Cookie', [A_TOKEN, R_TOKEN]);
            expect(response.status).toBe(404);
        });

        it('Response status 404 should be returned when creating user as customer', async (): Promise<void> => {
            const response = await request.post(`${API_PREFIX}/users`).set('Cookie', [A_TOKEN, R_TOKEN]);
            expect(response.status).toBe(404);
        });

        it('Response status 404 should be returned when updating user as customer', async (): Promise<void> => {
            const response = await request.put(`${API_PREFIX}/users`).set('Cookie', [A_TOKEN, R_TOKEN]);
            expect(response.status).toBe(404);
        });

        it('Response status 404 should be returned when deleting user as customer', async (): Promise<void> => {
            const response = await request.delete(`${API_PREFIX}/users`).set('Cookie', [A_TOKEN, R_TOKEN]);
            expect(response.status).toBe(404);
        });
    });
});
