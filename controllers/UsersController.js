import sha1 from 'sha1';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const { ObjectID } = require('mongodb');

class UsersController {
    static async postNew(req, res) {
        const userEmail = req.body.email;
        if (!userEmail) {
            return res.status(400).send({ error: 'Email is required' });
        }

        const userPassword = req.body.password;
        if (!userPassword) {
            return res.status(400).send({ error: 'Password is required' });
        }
        
        const user  = await dbClient.users.findOne({ email: userEmail });
        if (user) {
            return res.status(400).send({ error: 'User already exists' });
        }

        const encryptPassword = sha1(password);
        const newUser = { 
            email: userEmail,
            password: encryptPassword,
        };
        const result = await dbClient.users.insertOne(newUser);
        if (result.insertedCount === 0) {
            return res.status(400).send({ error: 'Failed to create user' });
        }
        const returnUser = {
            id: result.insertedId,
            email: userEmail,
        };
        return res.status(201).send(returnUser);
    }

    static async getMe(req, res) {
        const token = req.header('X-Token') || null;
        if (!token) return req.status(401).send({ error: 'Unauthorized' });
        const userId = await redisClient.get(`auth_${token}`);
        const user = await dbClient.users.findOne({ _id: ObjectID(userId) });
        if (!user) return res.status(401).send({ error: 'Unauthorized' });
        const returnedUser = {
            id: user._id,
            email: user.email,
        };
        delete user.password;
        return res.status(200).send(returnedUser);
    }
}

export default UsersController;