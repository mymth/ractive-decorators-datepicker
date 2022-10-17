import { terser } from 'rollup-plugin-terser';

const pkgName = process.env.npm_package_name;
let banner = `/*
  ${pkgName}
  ===============================================

  Version <%= pkg.version %>.

  This plugin is a decorator for bootstrap-datepicker.

  ==========================
*/
`.replace('<%= pkg.version %>', process.env.npm_package_version);

const commonOutputOpts = {
    name: 'datepickerDecorator',
    globals: {
      ractive: 'Ractive',
      jquery: '$',
    },
    format: 'umd',
    banner,
};

export default {
  external: ['ractive', 'jquery'],
  input: `./src/${pkgName}.js`,
  output: [
    {
      file: `${pkgName}.js`,
    },
    {
      file: `${pkgName}.min.js`,
      plugins: [terser()],
    },
  ].map(opts => Object.assign({}, commonOutputOpts, opts)),
};
