/* eslint-disable @typescript-eslint/no-var-requires */
// module.exports = {
//   plugins: {
//     tailwindcss: {},
//     autoprefixer: {},
//   },
// }

// PostCSS configuration
module.exports = cfg => {
  // import tokens as Sass variables
  // const variables = require('./tokens.json');

  const dev = cfg.env === "development",
    scss = cfg.file?.extname === ".scss"

  return {
    map: dev ? { inline: false } : false,
    parser: "postcss-scss",
    plugins: [
      require("tailwindcss"),
      require("postcss-advanced-variables"),
      require("postcss-map-get"),
      require("postcss-nested"),
      require("postcss-sort-media-queries"),
      // require('postcss-assets')({
      //   loadPaths: ['src/images/']
      // }),
      require("autoprefixer"),
    ],
  }
}
