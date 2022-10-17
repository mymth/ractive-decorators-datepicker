/*
  ractive-decorators-datepicker
  ===============================================

  Version 0.3.0.

  This plugin is a decorator for bootstrap-datepicker.

  ==========================
*/

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('jquery')) :
  typeof define === 'function' && define.amd ? define(['jquery'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.datepickerDecorator = factory(global.$));
})(this, (function ($) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var $__default = /*#__PURE__*/_interopDefaultLegacy($);

  const datepickerDecorator = function (node, type = 'default') {
    const internalFormat = datepickerDecorator.internalFormat;
    const types = datepickerDecorator.types;
    const dpg = $__default["default"].fn.datepicker.DPGlobal;
    const dateInputs = [];
    let $node = $__default["default"](node);
    let setting = false;

    const options = types.hasOwnProperty(type) ? types[type] : types.default;
    const format = internalFormat || options.format || $__default["default"].fn.datepicker.defaults.format;
    const language = options.language || $__default["default"].fn.datepicker.defaults.language;
    const $holder = $__default["default"]('<div class="dateinput-original" />').insertBefore($node);

    const prepareDateInputs = (el) => {
      const $el = $__default["default"](el);
      const keypath = this.getContext(el).getBindingPath();
      const $input = $el.clone();
      const id = $el.attr('id');

      if (id) {
        $input.attr('id', `${id}-datepicker`);
      }
      $input.removeAttr('name').addClass('dateinput').insertAfter($el);
      $el.attr('type', 'hidden').detach().appendTo($holder);

      dateInputs.push({node: el, $input, keypath});
    };

    if (node.tagName == 'INPUT') {
      prepareDateInputs(node);
      $node = dateInputs[0].$input;
    } else if ($node.hasClass('input-daterange')) {
      $node.children('input[type="text"]').each((index, el) => {
        prepareDateInputs(el);
      });
    }
    if (dateInputs.length === 0) {
      return {
        teardown() {},
      };
    }

    $node.datepicker(options).on('changeDate', () => {
      dateInputs.forEach((item) => {
        if (!item.keypath || setting) {
          return;
        }

        const date = item.$input.datepicker('getUTCDate');

        setting = true;
        this.set(item.keypath, dpg.formatDate(date, format, language) || null);
        // input[type=hiden] does not fire chnage event automatically. so we do it manually.
        $__default["default"](item.node).trigger('change');
        setting = false;
      });
    });

    dateInputs.forEach((item) => {
      if (!item.keypath) {
        return;
      }

      item.obsHandle = this.observe(item.keypath, (newValue) => {
        if (setting) {
          return;
        }

        let date = dpg.parseDate(newValue, format, language);
        if (date) {
          // adjust the time so the parsed Date becomes 00:00:00 localtime of that date
          // because Datepicker parses date as UTC regardless of the format
          date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        } else {
          date = '';
        }

        setting = true;
        item.$input.datepicker('setDate', date);
        // input[type=hiden] does not fire chnage event automatically. so we do it manually.
        // and since ractive updates bound element's value after observer completes its process,
        // we manually update the element's value here so the change event handler(s) can use
        // the new value.
        $__default["default"](item.node).val(newValue).trigger('change');
        setting = false;
      });
    });

    return {
      teardown() {
        $node.datepicker('destroy');
        dateInputs.forEach((item) => {
          if (item.obsHandle) {
            item.obsHandle.cancel();
          }
          $__default["default"](item.node).detach().insertBefore(item.$input).attr('type', 'text');
          item.$input.remove();
        });
        $holder.remove();
      }
    };
  };

  datepickerDecorator.internalFormat = null;
  datepickerDecorator.types = {
    default: {},
  };

  return datepickerDecorator;

}));
