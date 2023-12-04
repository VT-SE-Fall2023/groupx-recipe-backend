const request = require('supertest');
const app = require('../app');
const rand = Date.now()

// Test for /api/v1/user/register
describe('POST /api/v1/user/register', () => {
    it('should respond with a 400 status code for invalid email address', async () => {
        const response = await request(app)
            .post('/api/v1/user/register')
            .send({
                email: 'newuser',
                password: 'password123'
            });
        expect(response.statusCode).toBe(400);
    });

    it('should respond with a 400 status code for short password', async () => {
        const response = await request(app)
            .post('/api/v1/user/register')
            .send({
                email: `test${rand}@example.com`,
                password: '123'
            });
        expect(response.statusCode).toBe(400);
    });

    it('should respond with a 400 status code for missing password field', async () => {
        const response = await request(app)
            .post('/api/v1/user/register')
            .send({
                email: `test${rand}@example.com`,
            });
        expect(response.statusCode).toBe(400);
    });

    it('should respond with a 400 status code for missing email field', async () => {
        const response = await request(app)
            .post('/api/v1/user/register')
            .send({
                password: '123'
            });
        expect(response.statusCode).toBe(400);
    });
    
    it('should respond with a 400 status code for missing fields', async () => {
        const response = await request(app)
            .post('/api/v1/user/register')
            .send({});
        expect(response.statusCode).toBe(400);
    });

    it('should respond with a 500 status code for invalid email', async () => {
        const response = await request(app)
            .post('/api/v1/user/register')
            .send({
                email: 'invalid',
                password: 'password123'
            });
        expect(response.statusCode).toBe(400);
    });

    it('should respond with a 201 status code for successful registration', async () => {
        const response = await request(app)
            .post('/api/v1/user/register')
            .send({
                email: `test${rand}@example.com`,
                password: 'password123'
            });
        expect(response.statusCode).toBe(201);
    });

    it('should respond with a 409 status code for duplicate email', async () => {
        const response = await request(app)
            .post('/api/v1/user/register')
            .send({
                email: `test${rand}@example.com`,
                password: 'password123'
            });
        expect(response.statusCode).toBe(409);
    });
});

// Test for /api/v1/user/login
describe('POST /api/v1/user/login', () => {
    it('should respond with a 400 status code for missing password field', async () => {
        const response = await request(app)
            .post('/api/v1/user/login')
            .send({
                email: `test${rand}@example.com`,
            });
        expect(response.statusCode).toBe(400);
    });

    it('should respond with a 400 status code for missing email field', async () => {
        const response = await request(app)
            .post('/api/v1/user/login')
            .send({
                password: '123'
            });
        expect(response.statusCode).toBe(400);
    });
    
    it('should respond with a 400 status code for missing fields', async () => {
        const response = await request(app)
            .post('/api/v1/user/login')
            .send({});
        expect(response.statusCode).toBe(400);
    });

    it('should respond with a 400 status code for failed login', async () => {
        const response = await request(app)
            .post('/api/v1/user/login')
            .send({
                email: `test${rand}@example.com`,
                password: 'wrongpassword'
            });
        expect(response.statusCode).toBe(400);
    });

    it('should respond with a 400 status code for invalid email', async () => {
        const response = await request(app)
            .post('/api/v1/user/login')
            .send({
                email: `ta${rand}da`,
                password: 'password123'
            });
        expect(response.statusCode).toBe(400);
    });

    it('should respond with a 200 status code for successful login', async () => {
        const response = await request(app)
            .post('/api/v1/user/login')
            .send({
                email: `test${rand}@example.com`,
                password: 'password123'
            });
        expect(response.statusCode).toBe(200);
    });

});


// Test for /api/v1/recipe
describe('POST /api/v1/recipe', () => {
    it('should respond with a 400 status code for invalid ingredients', async () => {
        const response = await request(app)
            .post('/api/v1/recipe')
            .send({
                ingredients: 'chicken, rice',
                email: `test${rand}@example.com`,
            });
        expect(response.statusCode).toBe(400);
    });
    it('should respond with a 400 status code for missing ingredients', async () => {
        const response = await request(app)
            .post('/api/v1/recipe')
            .send({
                email: `test${rand}@example.com`,
            });
        expect(response.statusCode).toBe(400);
    });
    it('should respond with a 400 status code for invalid email', async () => {
        const response = await request(app)
            .post('/api/v1/recipe')
            .send({
                ingredients: 'chicken, rice',
                email: `testexamplcom`,
            });
        expect(response.statusCode).toBe(400);
    });
    it('should respond with a 400 status code for empty ingredients', async () => {
        const response = await request(app)
            .post('/api/v1/recipe')
            .send({
                ingredients: [],
                email: `test${rand}@example.com`,
            });
        expect(response.statusCode).toBe(400);
    });
    it('should respond with a 200 status code for successful recipe generation', async () => {
        const response = await request(app)
            .post('/api/v1/recipe')
            .send({
                ingredients: ['chicken', 'rice'],
                email: `test${rand}@example.com`,
            });
        expect(response.statusCode).toBe(200);
    }, 30000);

    it('should respond with a 200 status code for successful recipe generation', async () => {
        const response = await request(app)
            .post('/api/v1/recipe')
            .send({
                ingredients: ['chicken', 'rice'],
            });
        expect(response.statusCode).toBe(200);
    }, 30000);
});

// Test for /api/v1/recipe/rate
describe('POST /api/v1/recipe/rate', () => {
    it('should respond with a 200 status code for successful rating', async () => {
        const response = await request(app)
            .post('/api/v1/recipe/rate')
            .send({
                id: "656cd97ca8213cae1179a5b6",
                rating: "5"
            });
        expect(response.statusCode).toBe(200);
    });

    it('should respond with a 400 status code for invalid id', async () => {
        const response = await request(app)
            .post('/api/v1/recipe/rate')
            .send({
                id: 'recipeId',
                rating: "5"
            });
        expect(response.statusCode).toBe(400);
    });

    it('should respond with a 500 status code for invalid rating', async () => {
        const response = await request(app)
            .post('/api/v1/recipe/rate')
            .send({
                id: 'recipeId',
                rating: 'five'
            });
        expect(response.statusCode).toBe(400);
    });

    it('should respond with a 400 status code for rating out of range', async () => {
        const response = await request(app)
            .post('/api/v1/recipe/rate')
            .send({
                id: 'recipeId',
                rating: "6"
            });
        expect(response.statusCode).toBe(400);
    });

    it('should respond with a 400 status code for rating out of range', async () => {
        const response = await request(app)
            .post('/api/v1/recipe/rate')
            .send({
                id: 'recipeId',
                rating: "-1"
            });
        expect(response.statusCode).toBe(400);
    });

    it('should respond with a 400 status code for invalid string', async () => {
        const response = await request(app)
            .post('/api/v1/recipe/rate')
            .send({
                id: 'recipeId',
                rating: 5
            });
        expect(response.statusCode).toBe(400);
    });

    it('should respond with a 400 status code for non-existing recipe id', async () => {
        const response = await request(app)
            .post('/api/v1/recipe/rate')
            .send({
                id: 'recipeId',
                rating: "5"
            });
        expect(response.statusCode).toBe(400);
    });

    it('should respond with a 500 status code for missing id field', async () => {
        const response = await request(app)
            .post('/api/v1/recipe/rate')
            .send({
                rating: '5'
            });
        expect(response.statusCode).toBe(400);
    });
});

// Test for /api/v1/user/recipeHistory
describe('POST /api/v1/user/recipeHistory', () => {
    it('should respond with a 400 status code for invalid email', async () => {
        const response = await request(app)
            .post('/api/v1/user/recipeHistory')
            .send({
                email: `test${rand}da`,
            });
        expect(response.statusCode).toBe(400);
    });

    it('should respond with a 400 status code for missing fields', async () => {
        const response = await request(app)
            .post('/api/v1/user/recipeHistory')
            .send({});
        expect(response.statusCode).toBe(400);
    });

    it('should respond with a 200 status code for successful fetch', async () => {
        const response = await request(app)
            .post('/api/v1/user/recipeHistory')
            .send({
                email: `test${rand}@example.com`,
            });
        expect(response.statusCode).toBe(200);
    });

});

// Test for 404 Not Found
describe('GET /nonexistentroute', () => {
    it('should respond with a 404 status code', async () => {
        const response = await request(app).get('/nonexistentroute');
        expect(response.statusCode).toBe(404);
    });
});