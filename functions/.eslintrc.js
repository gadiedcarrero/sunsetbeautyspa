module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "prettier", // 👈 CLAVE: desactiva reglas de estilo de ESLint
  ],
  ignorePatterns: [
    "/lib/**/*", // Ignore built files
    "/generated/**/*", // Ignore generated files
  ],
  plugins: ["@typescript-eslint", "import"],
  rules: {
    /**
     * 🎯 IMPORTANTE
     * El formato (quotes, indent, max-len) lo maneja Prettier
     * ESLint solo valida lógica y calidad
     */
    quotes: "off",
    indent: "off",
    "max-len": "off",

    // Reglas útiles que NO chocan con Prettier
    "import/no-unresolved": 0,
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-explicit-any": "off", // útil en Firebase
    "require-jsdoc": "off", // regla molesta de google
  },
};
