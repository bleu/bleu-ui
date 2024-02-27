/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: ["en", "pt-BR"],
  catalogs: [
    {
      path: "<rootDir>/src/locales/{locale}/messages",
      include: ["src"],
    },
  ],
  format: "po",
};
