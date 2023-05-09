import { Redis, type RedisConfigNodejs } from "@upstash/redis";
import { type ScanCommandOptions } from "@upstash/redis/types/pkg/commands/scan";

let _kv: Redis | null = null;
process.env.UPSTASH_DISABLE_TELEMETRY = "1";

export class UpstashKV extends Redis {
    // This API is based on https://github.com/redis/node-redis#scan-iterator which is not supported in @upstash/redis
    /**
     * Same as `scan` but returns an AsyncIterator to allow iteration via `for await`.
     */
    async *scanIterator(options?: ScanCommandOptions): AsyncIterable<string> {
        let cursor = 0;
        let keys: string[];
        do {
            // eslint-disable-next-line no-await-in-loop
            [cursor, keys] = await this.scan(cursor, options);
            for (const key of keys) {
                yield key;
            }
        } while (cursor !== 0);
    }

    /**
     * Same as `hscan` but returns an AsyncIterator to allow iteration via `for await`.
     */
    async *hscanIterator(
        key: string,
        options?: ScanCommandOptions
    ): AsyncIterable<string | number> {
        let cursor = 0;
        let items: (number | string)[];
        do {
            // eslint-disable-next-line no-await-in-loop
            [cursor, items] = await this.hscan(key, cursor, options);
            for (const item of items) {
                yield item;
            }
        } while (cursor !== 0);
    }

    /**
     * Same as `sscan` but returns an AsyncIterator to allow iteration via `for await`.
     */
    async *sscanIterator(
        key: string,
        options?: ScanCommandOptions
    ): AsyncIterable<string | number> {
        let cursor = 0;
        let items: (number | string)[];
        do {
            // eslint-disable-next-line no-await-in-loop
            [cursor, items] = await this.sscan(key, cursor, options);
            for (const item of items) {
                yield item;
            }
        } while (cursor !== 0);
    }

    /**
     * Same as `zscan` but returns an AsyncIterator to allow iteration via `for await`.
     */
    async *zscanIterator(
        key: string,
        options?: ScanCommandOptions
    ): AsyncIterable<string | number> {
        let cursor = 0;
        let items: (number | string)[];
        do {
            // eslint-disable-next-line no-await-in-loop
            [cursor, items] = await this.zscan(key, cursor, options);
            for (const item of items) {
                yield item;
            }
        } while (cursor !== 0);
    }
}

export function createClient(config: RedisConfigNodejs): UpstashKV {
    return new UpstashKV(config);
}

// eslint-disable-next-line import/no-default-export
export default new Proxy(
    {},
    {
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        get(target, prop) {
            if (!_kv) {
                if (
                    !process.env.UPSTASH_REST_API_URL ||
                    !process.env.UPSTASH_REST_API_TOKEN
                ) {
                    throw new Error(
                        "@vercel/kv: Missing required environment variables UPSTASH_REST_API_URL and UPSTASH_REST_API_TOKEN"
                    );
                }

                _kv = createClient({
                    url: process.env.UPSTASH_REST_API_URL,
                    token: process.env.UPSTASH_REST_API_TOKEN,
                });
            }

            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return Reflect.get(_kv, prop);
        },
    }
) as UpstashKV;
