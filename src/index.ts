import { createClient } from "@vercel/kv";

export default function create() {
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

    return createClient({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
}

export { createClient };
