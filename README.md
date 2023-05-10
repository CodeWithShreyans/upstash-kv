# upstash-kv

A client that works with Upstash with the DX of @vercel/kv.

## Install

```sh
npm install upstash-kv
```

## Purpose

![](https://github.com/DestroyerXyz/upstash-kv/raw/main/vercel-upstash-comparison.png)

Vercel KV is just a whitelabeled implementation of Upstash Redis and uses the same HTTP API. This package provides feature parity with the DX of @vercel/kv.

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

### Custom Environment Variables

By default `upstash-kv` reads the `UPSTASH_REST_API_URL` and `UPSTASH_REST_API_TOKEN` environment variables. Use the following function in case you need to define custom values

```js
import { createClient } from "upstash-kv";

const kv = createClient({
    url: "https://<endpoint_name>.upstash.io",
    token: "<token>",
});

await kv.set("key", "value");
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
import dotenvExpand from 'dotenv-expand';
import { loadEnv, defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  // This check is important!
  if (mode === 'development') {
    const env = loadEnv(mode, process.cwd(), '');
    dotenvExpand.expand({ parsed: env });
  }

  return {
    ...
  };
});
```

2. You can provide the credentials explicitly, instead of relying on a zero-config setup. For example, this is how you could create a client in SvelteKit, which makes private environment variables available via `$env/static/private`:

```diff
import { createClient } from 'upstash-kv';
+ import { KV_URL, UPSTASH_REST_API_TOKEN } from '$env/static/private';

const kv = createClient({
-  url: 'https://<hostname>.redis.vercel-storage.com',
-  token: '<token>',
+  url: UPSTASH_REST_API_URL,
+  token: UPSTASH_REST_API_TOKEN,
});

await kv.set('key', 'value');
```
