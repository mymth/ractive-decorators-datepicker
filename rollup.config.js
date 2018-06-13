import babel from 'rollup-plugin-babel';
import multidest from 'rollup-plugin-multidest';
import { uglify } from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';

const pkgName = process.env.npm_package_name;
let banner = `/*
  ${pkgName}
  ===============================================

  Version <%= pkg.version %>.

  This plugin is a decorator for bootstrap-datepicker.

  ==========================
*/
`.replace('<%= pkg.version %>', process.env.npm_package_version);

const input = `./src/${pkgName}.js`;
const external = ['ractive', 'jquery'];
const babelOpts = {
  exclude: 'node_modules/**',
  babelrc: false,
  presets: ['es2015-rollup'],
};
const commonOutputOpts = {
    name: 'datepickerDecorator',
    globals: {
      ractive: 'Ractive',
      jquery: '$',
    },
    format: 'umd',
    banner,
};

export default [
  {
    input,
    external,
    plugins: [babel(babelOpts)],
    output: Object.assign({file: `${pkgName}.js`}, commonOutputOpts),
  },
  {
    input,
    external,
    plugins: [babel(babelOpts), uglify({}, minify)],
    output: Object.assign({file: `${pkgName}.min.js`}, commonOutputOpts),
  },
];
