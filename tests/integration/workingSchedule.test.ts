import request from 'supertest';
import assert from 'assert';
import server from '../../src/server';
import apiMessages from "../../src/utils/apiMessages";
import WorkingSchedule from "../../src/models/WorkingSchedule";
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

describe('workingSchedule tests', () => {
    it('index - should list workingSchedules', (done) => {
        WorkingSchedule.insertMany(dummyWorkingSchedule).then(() => {
            request(server.callback())
            .get('/api/v1/working-schedules')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end(function(err, response) {
                if (err) return done(err);

                expect(response.body).toHaveProperty('data')
                expect(response.body.data).toBeInstanceOf(Array)
                assert.ok(response.body.data.length === 7)

                return done();
            })
        })
    })

    it('update - should return not found response', (done) => {
        request(server.callback())
            .put('/api/v1/working-schedules/' + (new ObjectId()).toString())
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400, apiMessages[1051])
            .end(function(err) {
                if (err) return done(err);

                return done();
            });
    })

    it('update - should return not found response', (done) => {
        request(server.callback())
            .put('/api/v1/working-schedules/' + (new ObjectId()).toString())
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400, apiMessages[1051])
            .end(function(err) {
                if (err) return done(err);

                return done();
            });
    })

    it('update - should return closing time max error', (done) => {
        WorkingSchedule.findOne().exec().then((result) => {
            request(server.callback())
                .put('/api/v1/working-schedules/' + result?._id.toString())
                .send({
                    closingTime: 25
                })
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .expect('Content-Type', /json/)
                .expect(400, apiMessages[1056])
                .end(function(err) {
                    if (err) return done(err);

                    return done();
                });
        });
    })

    it('update - should return closing time min error', (done) => {
        WorkingSchedule.findOne().exec().then((result) => {
            request(server.callback())
                .put('/api/v1/working-schedules/' + result?._id.toString())
                .send({
                    closingTime: -1
                })
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .expect('Content-Type', /json/)
                .expect(400, apiMessages[1055])
                .end(function(err) {
                    if (err) return done(err);

                    return done();
                });
        })
    })

    it('update - should return opening time max error', (done) => {
        WorkingSchedule.findOne().exec().then((result) => {
            request(server.callback())
                .put('/api/v1/working-schedules/' + result?._id.toString())
                .send({
                    openingTime: 25
                })
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .expect('Content-Type', /json/)
                .expect(400, apiMessages[1054])
                .end(function(err) {
                    if (err) return done(err);

                    return done();
                });
        });
    })

    it('update - should return closing time min error', (done) => {
        WorkingSchedule.findOne().exec().then((result) => {
            request(server.callback())
                .put('/api/v1/working-schedules/' + result?._id.toString())
                .send({
                    openingTime: -1
                })
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .expect('Content-Type', /json/)
                .expect(400, apiMessages[1053])
                .end(function(err) {
                    if (err) return done(err);

                    return done();
                });
        })
    })

    it('update - should return times are equal error', (done) => {
        WorkingSchedule.findOne().exec().then((result) => {
            request(server.callback())
                .put('/api/v1/working-schedules/' + result?._id.toString())
                .send({
                    openingTime: 10,
                    closingTime: 10,
                })
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .expect('Content-Type', /json/)
                .expect(400, apiMessages[1052])
                .end(function(err) {
                    if (err) return done(err);

                    return done();
                });
        })
    })

    it('update - should opening time later error with opening time payload', (done) => {
        WorkingSchedule.findOne().exec().then((result) => {
            request(server.callback())
                .put('/api/v1/working-schedules/' + result?._id.toString())
                .send({
                    openingTime: 23,
                })
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .expect('Content-Type', /json/)
                .expect(400, apiMessages[1052])
                .end(function(err) {
                    if (err) return done(err);

                    return done();
                });
        })
    })

    it('update - should closing time later error with closing time payload', (done) => {
        WorkingSchedule.findOne().exec().then((result) => {
            request(server.callback())
                .put('/api/v1/working-schedules/' + result?._id.toString())
                .send({
                    closingTime: 1,
                })
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .expect('Content-Type', /json/)
                .expect(400, apiMessages[1052])
                .end(function(err) {
                    if (err) return done(err);

                    return done();
                });
        })
    })

    it('update - should update', (done) => {
        WorkingSchedule.findOne().exec().then((workingSchedule) => {
            request(server.callback())
                .put('/api/v1/working-schedules/' + workingSchedule?._id.toString())
                .send({
                    openingTime: 12,
                    closingTime: 22,
                    isOpen: true,
                })
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + token)
                .expect(204)
                .end(function(err) {
                    if (err) return done(err);

                    WorkingSchedule.findById(workingSchedule?._id.toString()).then((afterUpdateResult) => {
                        expect(afterUpdateResult?.openingTime).toBe(12)
                        expect(afterUpdateResult?.closingTime).toBe(22)
                        expect(afterUpdateResult?.isOpen).toBe(true)
                    })

                    return done();
                });
        })
    })

    it('should throw 401 if no authorization header', (done) => {
        request(server.callback())
            .get('/api/v1/working-schedules')
            .expect(401)
            .expect('Authentication Error')
            .end(function(err) {
                if (err) return done(err);
                return done();
            });

        request(server.callback())
            .put('/api/v1/working-schedules/1')
            .expect(401)
            .expect('Authentication Error')
            .end(function(err) {
                if (err) return done(err);
                return done();
            });
    })
})

const dummyWorkingSchedule = [
    {
        day: 'Sunday',
        utcDayIndex: 0,
        openingTime: 10,
        closingTime: 23
    },
    {
        day: 'Monday',
        utcDayIndex: 1,
        openingTime: 10,
        closingTime: 23
    },
    {
        day: 'Tuesday',
        utcDayIndex: 2,
        openingTime: 10,
        closingTime: 23
    },
    {
        day: 'Wednesday',
        utcDayIndex: 3,
        openingTime: 10,
        closingTime: 23
    },
    {
        day: 'Thursday',
        utcDayIndex: 4,
        openingTime: 10,
        closingTime: 23
    },
    {
        day: 'Friday',
        utcDayIndex: 5,
        openingTime: 10,
        closingTime: 23
    },
    {
        day: 'Saturday',
        utcDayIndex: 6,
        openingTime: 10,
        closingTime: 23
    },
]
