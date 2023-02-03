import supertest from 'supertest'
import app from '../../../src/index';

// ANCHOR: - Top-Level Constants

const request = supertest(app);

// SECTION: - Images Endpoint Tests

describe(`Images Endpoint Tests`, () => {

    // ANCHOR: - Response Status Tests


    describe('Response Status Tests', () => {

        it(`'/api/images' Endpoint Should Return 200 Response Status`, async () => {
            const response = await request.get('/api/images');
            expect(response.status).toEqual(200);
        });

        it(`Request Without 'imageName' Parameter Should Return 400 Response Status`, async () => {
            const response = await request.get('/api/images?test');
            expect(response.status).toEqual(400);
        });

        it(`Request Without 'width' Parameter Should Return 400 Response Status`, async () => {
            const response = await request.get('/api/images?imageName=test');
            expect(response.status).toEqual(400);
        });

        it(`Request Invalid 'imageName' Parameter Value Should Return 400 Response Status`, async () => {
            const response = await request.get('/api/images?imageName=test&width=200');
            expect(response.status).toEqual(400);
        });

        it(`Request With Invalid 'width' Parameter Value Should Return 400 Response Status`, async () => {
            const response = await request.get('/api/images?imageName=santamonica&width=test');
            expect(response.status).toEqual(400);
        });

        it(`Request With Invalid 'height' Parameter Value Should Return 400 Response Status`, async () => {
            const response = await request.get('/api/images?imageName=santamonica&width=200&height=test');
            expect(response.status).toEqual(400);
        });

        it(`Request With Valid Parameter Values Should Return 200 Response Status`, async () => {
            const response = await request.get('/api/images?imageName=santamonica&width=200&height=200');
            expect(response.status).toEqual(200);
        });

        it(`Request Without 'height' Parameter Should Return 200 Response Status`, async () => {
            const response = await request.get('/api/images?imageName=santamonica&width=200');
            expect(response.status).toEqual(200);
        });



    });

    // ANCHOR: - Response Header Tests

    describe('Response Header Tests', () => {

        it(`'/api/images' Endpoint Should Return Content Type of HTML`, async () => {
            const response = await request.get('/api/images');
            expect(response.headers['content-type']).toMatch(/^text\/html/);
        });

        it(`Request Without 'imageName' Parameter Should Return Content Type of HTML`, async () => {
            const response = await request.get('/api/images?test');
            expect(response.headers['content-type']).toMatch(/^text\/html/);
        });

        it(`Request Without 'width' URL Parameter Should Return Content Type of HTML`, async () => {
            const response = await request.get('/api/images?imageName=test');
            expect(response.headers['content-type']).toMatch(/^text\/html/);
        });

        it(`Request With Invalid 'imageName' Parameter Value Should Return Content Type of HTML`, async () => {
            const response = await request.get('/api/images?imageName=test&width=200');
            expect(response.headers['content-type']).toMatch(/^text\/html/);
        });

        it(`Request With Invalid 'width' Parameter Value Should Return Content Type of HTML`, async () => {
            const response = await request.get('/api/images?imageName=santamonica&width=test');
            expect(response.headers['content-type']).toMatch(/^text\/html/);
        });

        it(`Request With Invalid 'height' Parameter Value Should Return Content Type of HTML`, async () => {
            const response = await request.get('/api/images?imageName=santamonica&width=200&height=test');
            expect(response.headers['content-type']).toMatch(/^text\/html/);
        });

        it(`Request With Valid Parameter Values Should Return Content Type of Image / JPEG`, async () => {
            const response = await request.get('/api/images?imageName=santamonica&width=200&height=200');
            expect(response.headers['content-type']).toMatch(/^image\/jpeg/);
        });

        it(`Request Without 'height' Parameter Should Return Content Type of Image / JPEG`, async () => {
            const response = await request.get('/api/images?imageName=santamonica&width=200');
            expect(response.headers['content-type']).toMatch(/^image\/jpeg/);
        });

    });

});
