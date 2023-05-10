module.exports = {
    root: true,
    extends: [
        require.resolve("@vercel/style-guide/eslint/node"),
        require.resolve("@vercel/style-guide/eslint/typescript"),
    ],
    ignorePatterns: ["packages/*/dist/**"],
};
