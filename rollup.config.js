import babel from 'rollup-plugin-babel';
import multidest from 'rollup-plugin-multidest';
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-js-harmony';

const pkgName = process.env.npm_package_name;
let banner = `/*
  ${pkgName}
  ===============================================

  Version <%= pkg.version %>.

  This plugin is a decorator for bootstrap-datepicker that allows users to
  use different date formats between datepicker UI and internal data.

  ==========================
*/
`.replace('<%= pkg.version %>', process.env.npm_package_version);

export default {
  entry: `./src/${pkgName}.js`,
  moduleName: 'datepickerDecorator',
  banner,
  format: 'umd',
  plugins: [
    babel({
      exclude: 'node_modules/**',
      babelrc: false,
      presets: ['es2015-rollup'],
    }),
    multidest([
      {
        dest: `${pkgName}.min.js`,
        plugins: [
          uglify({}, minify),
        ],
      },
    ]),
  ],
  dest: `${pkgName}.js`,
};
