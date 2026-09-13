const path = require('path');

module.exports = require('@flarum/jest-config')({
  // Allow the config's helpers to be transformed through pnpm's nested layout.
  transformIgnorePatterns: ['/node_modules/(?!(?:\\.pnpm/|@flarum/jest-config/))', '\\.pnp\\.[^\\/]+$'],
  modulePaths: [
    path.join(__dirname, 'node_modules'),
    // Vendored core also needs access to the config's runtime dependencies.
    path.resolve(path.dirname(require.resolve('@flarum/jest-config')), '../..'),
  ],
});
