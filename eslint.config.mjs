import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import i18next from "eslint-plugin-i18next";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Flags hardcoded JSX text so new UI copy goes through the pt-BR
  // catalog instead of being written as a literal (see openspec
  // change add-i18n-support). Scoped to app/ and components/ pages;
  // components/ui/* primitives and test files are exempt.
  {
    files: ["app/**/*.tsx", "components/**/*.tsx"],
    ignores: ["**/*.test.tsx", "components/ui/**"],
    plugins: { i18next },
    rules: {
      "i18next/no-literal-string": [
        "error",
        {
          // Brand names and proper nouns are never translated (see
          // design.md's Decisions section on the add-i18n-support change).
          words: { exclude: ["[0-9!-/:-@[-`{-~]+", "[A-Z_-]+", "Kafe", "Google", "Apple"] },
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
