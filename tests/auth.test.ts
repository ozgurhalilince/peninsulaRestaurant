import request from 'supertest';
import assert from 'assert';
import server from '../src/index';
import apiMessages from "../src/utils/apiMessages";
import User from "../src/models/User";
import bcrypt from "bcryptjs";
import mongoose from 'mongoose';

describe('auth tests', () => {
    it('should throw 401 if no authorization header', (done) => {
        request(server.callback())
            .get('/')
            .expect(401)
            .expect('Authentication Error')
            .end(function(err, response) {
                if (err) return done(err);
                return done();
            });;
    })

    it('register - should return email is required', (done) => {
        const payload = {
            firstname: 'doe',
            lastname: 'doe',
            password: 'example',
        }
        request(server.callback())
            .post('/api/v1/auth/register')
            .send(payload)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400, apiMessages[1001])
            .end(function(err, response) {
                if (err) return done(err);
                return done();
            });
    })

    it('register - should return password is required', (done) => {
        const payload = {
            firstname: 'john',
            lastname: 'doe',
            email: 'john-' + new Date().getTime() + '@peninsula.com',
        }
        request(server.callback())
            .post('/api/v1/auth/register')
            .send(payload)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400, apiMessages[1002])
            .end(function(err, response) {
                if (err) return done(err);
                return done();
            });
    })

    it('register - should return firstname is required', (done) => {
        const payload = {
            lastname: 'doe',
            email: 'john-' + new Date().getTime() + '@peninsula.com',
            password: 'example',
        }
        request(server.callback())
            .post('/api/v1/auth/register')
            .send(payload)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400, apiMessages[1003])
            .end(function(err, response) {
                if (err) return done(err);
                return done();
            });
    })

    it('register - should return lastname is required', (done) => {
        const payload = {
            firstname: 'john',
            email: 'john-' + new Date().getTime() + '@peninsula.com',
            password: 'example',
        }
        request(server.callback())
            .post('/api/v1/auth/register')
            .send(payload)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400, apiMessages[1004])
            .end(function(err, response) {
                if (err) return done(err);
                return done();
            });
    })

    it('register - should return email in use error', (done) => {
        const userData = {
            firstname: 'John',
            lastname: 'Doe',
            email: 'john-' + new Date().getTime() + '@peninsula.com',
            password: bcrypt.hashSync('example', 5),
            isDeleted: false,
        };

        User.create(userData).then(() => {
            const payload = {
                firstname: 'John',
                lastname: 'Doe',
                email: userData.email,
                password: bcrypt.hashSync('example', 5),
                isDeleted: false,
            }

            request(server.callback())
                .post('/api/v1/auth/register')
                .send(payload)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400, apiMessages[1005])
                .end(function(err, response) {
                    if (err) return done(err);
                    return done();
                });
        });
    })

    it('register - should successfully register', (done) => {
        const payload = {
            firstname: 'john',
            lastname: 'doe',
            email: 'john-' + new Date().getTime() + '@peninsula.com',
            password: 'example',
        }

        request(server.callback())
            .post('/api/v1/auth/register')
            .send(payload)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .end(function(err, res) {
                if (err) return done(err);
                return done();
            });
    })
})

afterAll(done => {
    mongoose.connection.close()
    done()
})