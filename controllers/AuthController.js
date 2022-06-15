import ha1 from 'sha1';
import uuidv4 from uuidv4;
import dbClient from '../utils/db';
import redisClient from '../utils/redis';


class AuthController {
    static async getConnect(req, res) {
        const auth = req.header ('Authorization') || null;
        if (!auth) return res.status(401).send({ error: 'Unauthorized' });
        const token = auth.split(' ')[1];
        if (!token) return res.status(401).send({ error: 'Unauthorized' });
        const emailPass = Buffer.from(token, 'base-64').toString('utf-8');
        const fltr = {
            email: emailPass.split(':')[0],
            password: ha1(emailPass.split(':')[1]),
        };
        const user = await dbClient.users.findOne(fltr);
        if (!user) return res.status(401).send({ error: 'Unauthorized' });
        const tokenId = uuidv4();
        const key = `auth_${tokenId}`;
        const expiry = 24 * 60 * 60
        await redisClient.set(key, user._id.toString(), expiry);
        return res.status(200).send({ token: tokenId });
    };

    static async getDisconnect(req, res) {
        const token = req.header ('X-Token') || null;
        if (!token) return res.status(401).send({ error: 'Unauthorized' });
        const user  = await redisClient.get(`auth_${token}`);
        if (!user) return res.status(401).send({ error: 'Unauthorized' });
        redisClient.del(key);
        return res.status(204).send({ message: 'Disconnected' });
    }
}

export default AuthController;