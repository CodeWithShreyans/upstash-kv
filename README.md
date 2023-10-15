# upstash-kv

Simple Upstash Redis client based on @vercel/kv
<br>

| This package is not affiliated with or endorsed by [Upstash](https://upstash.com/) |
| :--------------------------------------------------------------------------------- |

## Install

`npm`

```sh
npm install upstash-kv
```

`pnpm`

```sh
pnpm install upstash-kv
```

`yarn`

```sh
yarn add upstash-kv
```

## Purpose

Vercel KV is a whitelabeled implementation of Upstash Redis and uses the same API.

![](https://github.com/DestroyerXyz/upstash-kv/raw/main/images/vercel-upstash-comparison.png)

This package provides feature parity with the DX of Vercel KV for Upstash Redis.

## Usage

```js
import kv from "upstash-kv";

// string
await kv.set("key", "value");
let data = await kv.get("key");
console.log(data); // 'value'

await kv.set("key2", "value2", { ex: 1 });

// sorted set
await kv.zadd(
    "scores",
    { score: 1, member: "team1" },
    { score: 2, member: "team2" }
);
data = await kv.zrange("scores", 0, 0);
console.log(data); // [ 'team1' ]

// list
await kv.lpush("elements", "magnesium");
data = await kv.lrange("elements", 0, 100);
console.log(data); // [ 'magnesium' ]

// hash
await kv.hset("people", { name: "joe" });
data = await kv.hget("people", "name");
console.log(data); // 'joe'

// sets
await kv.sadd("animals", "cat");
data = await kv.spop("animals", 1);
console.log(data); // [ 'cat' ]

// scan for keys
for await (const key of kv.scanIterator()) {
    console.log(key);
}
```

### Environment Variables

Get the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` from your Upstash console and set them in your `.env` file. These are read by default.

![](https://github.com/DestroyerXyz/upstash-kv/raw/main/images/env-vars.png)

Use the following function in case you need to define custom values

```js
import { createClient } from "upstash-kv";

const kv = createClient({
    url: "https://<endpoint_name>.upstash.io",
    token: "<token>",
});

await kv.set("key", "value");
```

### Automatic Deserialization

The default `kv` client automatically deserializes values returned from the database via `JSON.parse`. If this behaviour is undesired, create a custom KV client via the `createClient` method with `automaticDeserialization: false`. All data will be returned as strings.

```js
import { kv, createClient } from "upstash-kv";

const customKvClient = createClient({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
    automaticDeserialization: false,
});

await customKvClient.set("object", { hello: "world" });

console.log(await kv.get("object")); // { hello: 'world' }
console.log(await customKvClient.get("object")); // '{"hello":"world"}'
```

## Docs

See Vercel's [documentation](https://www.vercel.com/docs/storage/vercel-kv) for details.

## A note for Vite users

`upstash-kv` reads database credentials from the environment variables on `process.env`. In general, `process.env` is automatically populated from your `.env` file during development, which is created when you run `vc env pull`. However, Vite does not expose the `.env` variables on `process.env.`

You can fix this in **one** of following two ways:

1. You can populate `process.env` yourself using something like `dotenv-expand`:

```shell
pnpm install --save-dev dotenv dotenv-expand
```

```js
// vite.config.js
import dotenvExpand from "dotenv-expand";
import { loadEnv, defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  // This check is important!
  if (mode === "development") {
    const env = loadEnv(mode, process.cwd(), "");
    dotenvExpand.expand({ parsed: env });
  }

  return {
    ...
  };
});
```

2. You can provide the credentials explicitly, instead of relying on a zero-config setup. For example, this is how you could create a client in SvelteKit, which makes private environment variables available via `$env/static/private`:

```diff
import { createClient } from "upstash-kv";
+ import { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } from "$env/static/private";

const kv = createClient({
-  url: "https://<endpoint_name>.upstash.io",
-  token: "<token>",
+  url: UPSTASH_REDIS_REST_URL,
+  token: UPSTASH_REDIS_REST_TOKEN,
});

await kv.set("key", "value");
```

## FAQ

### Does the `upstash-kv` package support [Redis Streams](https://redis.io/docs/data-types/streams/)?

No, the `upstash-kv` package does not support Redis Streams. To use Redis Streams with Upstash Redis, you must connect directly to the database server via packacges like [`io-redis`](https://github.com/redis/ioredis) or [`node-redis`](https://github.com/redis/node-redis).

```js
import { createClient } from "redis";

const client = createClient({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

await client.connect();
await client.xRead({ key: "mystream", id: "0" }, { COUNT: 2 });
```
