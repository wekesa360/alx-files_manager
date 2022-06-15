const redis = require('redis');
const { promisify } = require('util');

class RedisClient {
    constructor() {
        this.clnt = redis.createClient();
        this.getAsync = promisify(this.client.get).bind(this.client);
        
        this.client.on('error', (err) => {
            console.log(`${error}`);
        });
    }

    isAlive() {
        return this.client.connected;
    }

    async get(key) {
        const value = await this.getAsync(key);
        return value;
    }

    async set(key, value, d) {
        this.client.set(key, value);
        this.client.expire(key, d);
    }

    async del(key) {
        this.client.del(key);
    }
}

const redisClient = new RedisClient();
export default redisClient;