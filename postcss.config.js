/* eslint-disable @typescript-eslint/no-var-requires */
// PostCSS configuration
module.exports = cfg => {
	// import tokens as Sass variables
	// const variables = require('./tokens.json');

	const dev = cfg.env === 'development'

	return {
		map: dev ? { inline: false } : false,
		parser: 'postcss-scss',
		plugins: [
			require('tailwindcss'),
			require('postcss-mixins')({
				mixinsDir: './src/styles',
			}),
			require('postcss-advanced-variables'),
			require('postcss-map-get'),
			require('postcss-nested'),
			require('postcss-sort-media-queries'),
			// require('postcss-assets')({
			//   loadPaths: ['src/images/']
			// }),
			require('autoprefixer'),
		],
	}
}
