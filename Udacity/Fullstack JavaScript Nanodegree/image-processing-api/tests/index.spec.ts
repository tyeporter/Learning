
import supertest from 'supertest'
import app from '../src/index';

// ANCHOR: - Top-Level Constants

const request = supertest(app);

// SECTION: - Index Endpoint Tests

describe('Index Endpoint Tests', () => {

    // ANCHOR: - Response Status Tests

    describe('Response Status Tests', () => {

        it(`'/' Endpoint Should Return 200 Response Status`, async () => {
            const response = await request.get('/');
            expect(response.status).toEqual(200);
        });

        it('Invalid Endpoint Should Return 404 Response Status', async () => {
            const response = await request.get('/test');
            expect(response.status).toEqual(404);
        });

    });

    // ANCHOR: - Response Header Tests

    describe('Response Header Tests', () => {

        it(`'/' Endpoint Should Return Content Type of HTML`, async () => {
            const response = await request.get('/');
            expect(response.headers['content-type']).toMatch(/^text\/html/);
        });

        it('Invalid Endpoint Should Return Content Type of HTML', async () => {
            const response = await request.get('/test');
            expect(response.headers['content-type']).toMatch(/^text\/html/);
        });

    });

});
