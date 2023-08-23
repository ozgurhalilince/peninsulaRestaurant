import request from 'supertest';
import assert from 'assert';
import server from '../../src/server';
import apiMessages from "../../src/utils/apiMessages";
import Table from "../../src/models/Table";
import User from "../../src/models/User";
import bcrypt from "bcryptjs";
import mongoose from 'mongoose';

const dummyTables = [
    {
        name: 'Denmark',
        description: 'Denmark table',
        seatCount: 10,
    },
    {
        name: 'Turkey',
        description: 'Turkey table',
        seatCount: 15,
    }
];
let token: null|string = null;

beforeAll((done) => {
    mongoose.connection.dropDatabase()

    const userData = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john-' + new Date().getTime() + '@peninsula.com',
        password: bcrypt.hashSync('example', 5),
        isDeleted: false,
    };
    User.create(userData).then(() => {
        request(server.callback())
            .post('/api/v1/auth/login')
            .send({
                email: userData.email,
                password: 'example',
            })
            .set('Accept', 'application/json')
            .end(function(err, response) {
                token = response.body.data.token; // Or something

                done()
            });
    });
})

afterAll(done => {
    mongoose.connection.close()
    done()
})

describe('table tests', () => {
    it('index - should list tables', (done) => {
        Table.insertMany(dummyTables).then(() => {
            request(server.callback())
            .get('/api/v1/tables')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end(function(err, response) {
                if (err) return done(err);

                expect(response.body).toHaveProperty('data')
                expect(response.body.data).toBeInstanceOf(Array)
                assert.ok(response.body.data.length === 2)
                
                return done();
            })
        })
    })

    it('store - should return name is required when body is empty', (done) => {
        request(server.callback())
            .post('/api/v1/tables')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(400, apiMessages[1040])
            .end(function(err, response) {
                if (err) return done(err);
                return done();
            });
    })

    it('store - should return name is required', (done) => {
        request(server.callback())
            .post('/api/v1/tables')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .send({
                seatCount: 10,
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400, apiMessages[1040])
            .end(function(err, response) {
                if (err) return done(err);
                return done();
            });
    })

    it('store - should return seat count is required', (done) => {
        request(server.callback())
            .post('/api/v1/tables')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .send({
                name: 'Portugal',
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400, apiMessages[1041])
            .end(function(err, response) {
                if (err) return done(err);
                return done();
            });
    })

    it('store - should create table', (done) => {
        request(server.callback())
            .post('/api/v1/tables')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .send({
                name: 'Portugal',
                seatCount: 10,
            })
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .end(function(err, response) {
                if (err) return done(err);
                return done();
            });
    })

    it('should throw 401 if no authorization header', (done) => {
        request(server.callback())
            .get('/api/v1/tables')
            .expect(401)
            .expect('Authentication Error')
            .end(function(err, response) {
                if (err) return done(err);
                return done();
            });
        request(server.callback())
            .post('/api/v1/tables')
            .expect(401)
            .expect('Authentication Error')
            .end(function(err, response) {
                if (err) return done(err);
                return done();
            });
        request(server.callback())
            .get('/api/v1/tables/1')
            .expect(401)
            .expect('Authentication Error')
            .end(function(err, response) {
                if (err) return done(err);
                return done();
            });
        request(server.callback())
            .put('/api/v1/tables/1')
            .expect(401)
            .expect('Authentication Error')
            .end(function(err, response) {
                if (err) return done(err);
                return done();
            });
        request(server.callback())
            .del('/api/v1/tables/1')
            .expect(401)
            .expect('Authentication Error')
            .end(function(err, response) {
                if (err) return done(err);
                return done();
            });
    })
})
