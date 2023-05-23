import fs from 'fs';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';

const pkgName = process.env.npm_package_name;
let banner = `/*
  ${pkgName}
  ===============================================

  Version <%= pkg.version %>.

  This plugin is a decorator for bootstrap-datepicker.

  ==========================
*/
`.replace('<%= pkg.version %>', process.env.npm_package_version);

const external = ['vanillajs-datepicker'];
const input = `./src/${pkgName}.js`;
const commonOutputOpts = {
    name: 'datepickerDecorator',
    globals: {
      Datepicker: 'Datepicker',
      DateRangePicker: 'DateRangePicker',
    },
    format: 'iife',
    banner,
};

export default [
  {
    external,
    input: 'src/esm_entry_point.js',
    plugins: [
      replace({
        values: {
          '__src__': fs.readFileSync(input, 'utf8'),
        },
        preventAssignment: true,
      }),
    ],
    output: {
      file: `./${pkgName}.js`,
      format: 'es',
      banner,
    },
  },
  {
    external,
    input,
    output: [
      {
        file: `dist/${pkgName}.js`,
      },
      {
        file: `dist/${pkgName}.min.js`,
        plugins: [terser()],
      },
    ].map(opts => Object.assign({}, commonOutputOpts, opts)),
  }
];
