module.exports = {
    // Specifies the ESLint parser for TypeScript
    parser: '@typescript-eslint/parser',
  
    // Environment settings
    env: {
      browser: true, // Enables browser global variables (e.g., `window`, `document`)
      node: true,    // Enables Node.js global variables (e.g., `module`, `require`)
      es2021: true,  // Enables ES2021 global variables and syntax
    },
  
    // Extends recommended configurations
    extends: [
      'eslint:recommended', // ESLint's recommended rules
      'plugin:@typescript-eslint/recommended', // TypeScript ESLint's recommended rules
      'plugin:prettier/recommended', // Integrates Prettier with ESLint (optional)
    ],
  
    // Parser options
    parserOptions: {
      ecmaVersion: 'latest', // Use the latest ECMAScript version
      sourceType: 'module', // Allows the use of `import`/`export` statements
      project: './tsconfig.json', // Path to your TypeScript configuration file
    },
  
    // Plugins
    plugins: [
      '@typescript-eslint', // TypeScript ESLint plugin
      'prettier', // Prettier plugin (optional)
    ],
  
    // Custom rules
    rules: {
      // TypeScript ESLint rules
      '@typescript-eslint/no-unused-vars': 'warn', // Warns about unused variables
      '@typescript-eslint/no-explicit-any': 'warn', // Warns about using `any` type
      '@typescript-eslint/explicit-function-return-type': 'off', // Disables explicit return type requirement
      '@typescript-eslint/no-inferrable-types': 'off', // Disables inferrable type warnings
  
      // ESLint rules
      'no-console': 'warn', // Warns about `console` statements
      'no-undef': 'error', // Errors on undefined variables
      'no-unused-vars': 'off', // Disables ESLint's unused variable rule (handled by TypeScript ESLint)
      'prefer-const': 'error', // Enforces the use of `const` for variables that are never reassigned
  
      // Prettier rules (optional)
      'prettier/prettier': 'warn', // Warns about Prettier formatting issues
    },
  
    // Override rules for specific file types
    overrides: [
      {
        files: ['*.test.ts', '*.spec.ts'], // Applies to test files
        env: {
          jest: true, // Enables Jest global variables
        },
        rules: {
          '@typescript-eslint/no-unused-vars': 'off', // Disables unused variable warnings in tests
        },
      },
    ],
  };