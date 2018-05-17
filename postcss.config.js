/* eslint-disable global-require */

module.exports = {
  plugins: [
    require('postcss-cssnext'),
    require('postcss-import'),
    require('autoprefixer')({
      browsers: ['last 4 versions'],
      flexbox: 'no-2009'
    })
  ]
};
