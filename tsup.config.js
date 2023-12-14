import { defineConfig } from "tsup";

const config = defineConfig({
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    splitting: true,
    sourcemap: false,
    minify: true,
    clean: true,
    skipNodeModulesBundle: true,
    dts: true,
    cjsInterop: true,
    external: ["node_modules"],
});

// eslint-disable-next-line import/no-default-export -- Default export required
export default config;
