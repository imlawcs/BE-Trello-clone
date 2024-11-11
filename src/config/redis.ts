import { createClient } from 'redis';

class RedisClient {
    public static instance: ReturnType<typeof createClient>;

    public async getInstance() {
        if (!RedisClient.instance) {
        const client = createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379',
        });

        client.on('error', (err) => console.error('Redis Client Error', err));
        
        await client.connect();
        console.log('Redis Client Connected');
        RedisClient.instance = client;
        }

        return RedisClient.instance;
    }
}

export default new RedisClient();
