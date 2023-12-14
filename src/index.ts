import { createClient, VercelKV as UpstashKV } from "@vercel/kv";
import { RedisConfigNodejs } from "@upstash/redis";

const kv = new Proxy(
    {},
    {
        get(_, prop) {
            if (
                !process.env.UPSTASH_REDIS_REST_URL &&
                !process.env.UPSTASH_REDIS_REST_TOKEN
            ) {
                throw new Error(
                    "upstash-kv: Missing required environment variables UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN"
                );
            } else if (!process.env.UPSTASH_REDIS_REST_URL) {
                throw new Error(
                    "upstash-kv: Missing required environment variable UPSTASH_REDIS_REST_URL"
                );
            } else if (!process.env.UPSTASH_REDIS_REST_TOKEN) {
                throw new Error(
                    "upstash-kv: Missing required environment variable UPSTASH_REDIS_REST_TOKEN"
                );
            }

            const kv = createClient({
                url: process.env.UPSTASH_REDIS_REST_URL,
                token: process.env.UPSTASH_REDIS_REST_TOKEN,
            });

            return Reflect.get(kv, prop);
        },
    }
) as UpstashKV;

const createKVClient = createClient as (config: RedisConfigNodejs) => UpstashKV;

export { kv, createKVClient as createClient, UpstashKV };
export default kv;
