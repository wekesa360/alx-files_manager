import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
    static getStatus(req, res) {
        const alive = {
            redis: redisClient.isAlive(),
            db: dbClient.isAlive(),
        };
        return res.status(200).send(alive);
    }

    static async getStats(req, res) {
        const stats = {
            users: await dbClient.nbUsers(),
            files: await dbClient.nbFiles(),
        };
        return res.status(200).send(stats);
    }
}

export default AppController;