import supertest from 'supertest';
import app from '../../../../../../src';
import vars from '../../../../../../src/config/vars';
import {TokenType} from '../../../../../../src/entities/networking';
import {UsersRepository} from '../../../../../../src/frameworks/repositories/postgres';

const request = supertest(app);
const API_PREFIX = vars.apiPrefix;

describe('Auth Service Router Tests', (): void => {
    let A_TOKEN: string;
    let R_TOKEN: string;

    beforeAll(async (): Promise<void> => {
        await UsersRepository.add({
            username: 'testUser1',
            password: 'password123',
            firstName: 'Testing',
            lastName: 'Testing'
        });
    });

    afterAll(async (): Promise<void> => {
        await UsersRepository.deleteAllSessions?.();
        await UsersRepository.deleteAll();
    });

    describe('Sign Up Tests', (): void => {
        it('User should be signed up and signed in when attempting to sign up', async (): Promise<void> => {
            const response = await request.post(`${API_PREFIX}/sign-up`)
                .type('json')
                .send({
                    username: 'testUser2',
                    password: 'password123',
                    firstName: 'Testing',
                    lastName: 'Testing'
                });
            A_TOKEN = response.headers['set-cookie'][0].split(';')[0];
            R_TOKEN = response.headers['set-cookie'][1].split(';')[0];

            expect(A_TOKEN).toBeDefined();
            expect(R_TOKEN).toBeDefined();
            expect(response.status).toBe(200);
            expect(response.body.status).toBe(200);
            expect(response.body.message).toContain('You are now signed up');
        });
    });

    describe('Sign In Tests', (): void => {
        it('User should be signed in when attempting to sign in', async (): Promise<void> => {
            const response = await request.post(`${API_PREFIX}/sign-in`)
                .type('json')
                .send({
                    username: 'testUser1',
                    password: 'password123'
                });
            const accessToken = response.headers['set-cookie'][0].split(';')[0];
            const refreshToken = response.headers['set-cookie'][1].split(';')[0];

            expect(accessToken).toBeDefined();
            expect(refreshToken).toBeDefined();
            expect(response.status).toBe(200);
            expect(response.body.status).toBe(200);
            expect(response.body.message).toContain('You are signed in');
        });
    });

    describe('Sign Out Tests', (): void => {
        it('User should be signed out when attempting to sign out', async (): Promise<void> => {
            const response = await request.post(`${API_PREFIX}/sign-out`).set('Cookie', [A_TOKEN, R_TOKEN]);
            const accessToken = response.headers['set-cookie'][0].split(';')[0];
            const refreshToken = response.headers['set-cookie'][1].split(';')[0];

            expect(accessToken).toContain(TokenType.Access);
            expect(refreshToken).toContain(TokenType.Refresh);
            expect(response.status).toBe(200);
            expect(response.body.status).toBe(200);
            expect(response.body.message).toContain('You have successfully signed out');
        });
    });
});
