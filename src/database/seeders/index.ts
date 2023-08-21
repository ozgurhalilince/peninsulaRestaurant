import mongoose from 'mongoose'
import config from "../../utils/config";
import bcrypt from 'bcryptjs'
import User from '../../models/User'
import Table from "../../models/Table";
import WorkingSchedule from "../../models/WorkingSchedule";

mongoose.connect(config.mongoUri, { dbName: config.dbName })
    .then(async (mongooseConnection) => {
        await mongoose.connection.db.dropDatabase()
        await seedUsers()
        await seedTables()
        await seedWorkingSchedules()

        process.exit()
    });

async function seedTables(): Promise<void> {
    await Table.insertMany(dummyTables);
}
async function seedWorkingSchedules(): Promise<void> {
    await WorkingSchedule.insertMany(dummyWorkingSchedule);
}
async function seedUsers(): Promise<void> {
    await User.create([
        {
            firstname: 'John',
            lastname: 'Doe',
            email: 'john.doe@peninsula.com',
            password: await bcrypt.hash('example', 5),
            isDeleted: false,
        },
    ]);
}

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
    },
    {
        name: 'Germany',
        description: 'Germany table',
        seatCount: 5,
    },
    {
        name: 'Netherlands',
        description: 'Netherlands table',
        seatCount: 3,
    },
    {
        name: 'Portugal',
        description: 'Portugal table',
        seatCount: 10,
    },
    {
        name: 'Spain',
        description: 'Spain table',
        seatCount: 10,
    },
]
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