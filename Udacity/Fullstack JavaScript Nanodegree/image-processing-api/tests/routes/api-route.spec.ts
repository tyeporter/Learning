import supertest from 'supertest'
import app from '../../src/index';

// ANCHOR: - Top-Level Constants

const request = supertest(app);

// SECTION: - API Endpoint Tests

describe(`API Endpoint Tests`, () => {

    // ANCHOR: - Response Status Tests

    describe('Response Status Tests', () => {

        it(`'/api' Endpoint Should Return 200 Response Status`, async () => {
            const response = await request.get('/api');
            expect(response.status).toEqual(200);
        });

    });

    // ANCHOR: - Response Header Tests

    describe('Response Header Tests', () => {

        it(`'/api' Endpoint Should Return Content Type of HTML`, async () => {
            const response = await request.get('/api');
            expect(response.headers['content-type']).toMatch(/^text\/html/);
        });

    });

});
