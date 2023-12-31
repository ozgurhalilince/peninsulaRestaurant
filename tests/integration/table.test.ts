import request from 'supertest';
import assert from 'assert';
import server from '../../src/server';
import apiMessages from "../../src/utils/apiMessages";
import Table from "../../src/models/Table";
import User from "../../src/models/User";
import bcrypt from "bcryptjs";
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

let token: null|string = null;

beforeAll((done) => {
    mongoose.connection.dropDatabase()

    // @TODO create method for token
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
            .end(function(err) {
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
            .end(function(err) {
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
            .end(function(err) {
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
            .end(function(err) {
                if (err) return done(err);
                return done();
            });
    })

    it('show - should return not found response', (done) => {
        request(server.callback())
            .get('/api/v1/tables/' + (new ObjectId()).toString())
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400, apiMessages[1043])
            .end(function(err) {
                if (err) return done(err);

                return done();
            });
    })

    it('show - should return table details', (done) => {
        Table.create({
            name: 'Germany',
            seatCount: 10,
        }).then((createdTable) => {
            request(server.callback())
                .get('/api/v1/tables/' + createdTable._id.toString())
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, response) {
                    if (err) return done(err);

                    expect(response.body).toHaveProperty('data')
                    expect(response.body.data).toHaveProperty('_id')
                    expect(response.body.data).toHaveProperty('name')
                    expect(response.body.data).toHaveProperty('seatCount')
                    expect(response.body.data._id).toEqual(createdTable._id.toString())
                    expect(response.body.data.name).toEqual(createdTable.name)
                    expect(response.body.data.seatCount).toEqual(createdTable.seatCount)

                    return done();
                });
        })
    })

    it('update - should return not found response', (done) => {
        request(server.callback())
            .put('/api/v1/tables/' + (new ObjectId()).toString())
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400, apiMessages[1043])
            .end(function(err) {
                if (err) return done(err);

                return done();
            });
    })

    it('update - should update', (done) => {
        Table.create({
            name: 'Spain',
            seatCount: 10,
        }).then((createdTable) => {
            request(server.callback())
                .put('/api/v1/tables/' + createdTable._id.toString())
                .send({
                    seatCount: 3,
                    description: 'some text',
                })
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .set('Accept', 'application/json')
                .expect(204)
                .end(function(err) {
                    if (err) return done(err);
                    
                    Table.findById(createdTable._id.toString())
                        .select(['id', 'seatCount', 'description'])
                        .exec()
                        .then((result) => {
                            expect(result?.seatCount).toEqual(3)
                            expect(result?.description).toEqual('some text')
                        })

                    return done()
                });
        })
    })

    it('destroy - should return not found response', (done) => {
        request(server.callback())
            .del('/api/v1/tables/' + (new ObjectId()).toString())
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400, apiMessages[1043])
            .end(function(err) {
                if (err) return done(err);

                return done();
            });
    })

    it('destroy - should delete', (done) => {
        Table.create({
            name: 'Netherlands',
            seatCount: 10,
        }).then((createdTable) => {
            request(server.callback())
                .del('/api/v1/tables/' + createdTable._id.toString())
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .set('Accept', 'application/json')
                .expect(204)
                .end(function(err) {
                    if (err) return done(err);
                    
                    Table.findById(createdTable._id.toString())
                        .select(['id', 'isDeleted'])
                        .exec()
                        .then((result) => {
                            expect(result?.isDeleted).toEqual(true)
                        })

                    return done()
                });
        })
    })

    it('should throw 401 if no authorization header', (done) => {
        request(server.callback())
            .get('/api/v1/tables')
            .expect(401)
            .expect('Authentication Error')
            .end(function(err) {
                if (err) return done(err);
                return done();
            });
        request(server.callback())
            .post('/api/v1/tables')
            .expect(401)
            .expect('Authentication Error')
            .end(function(err) {
                if (err) return done(err);
                return done();
            });
        request(server.callback())
            .get('/api/v1/tables/1')
            .expect(401)
            .expect('Authentication Error')
            .end(function(err) {
                if (err) return done(err);
                return done();
            });
        request(server.callback())
            .put('/api/v1/tables/1')
            .expect(401)
            .expect('Authentication Error')
            .end(function(err) {
                if (err) return done(err);
                return done();
            });
        request(server.callback())
            .del('/api/v1/tables/1')
            .expect(401)
            .expect('Authentication Error')
            .end(function(err) {
                if (err) return done(err);
                return done();
            });
    })
})

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
