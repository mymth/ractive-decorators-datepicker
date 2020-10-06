/*
  ractive-decorators-datepicker
  ===============================================

  Version 0.2.3.

  This plugin is a decorator for bootstrap-datepicker.

  ==========================
*/

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('jquery')) :
  typeof define === 'function' && define.amd ? define(['jquery'], factory) :
  (global.datepickerDecorator = factory(global.$));
}(this, (function ($) { 'use strict';

  $ = $ && $.hasOwnProperty('default') ? $['default'] : $;

  var datepickerDecorator = function datepickerDecorator(node) {
    var _this = this;

    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'default';

    var internalFormat = datepickerDecorator.internalFormat;
    var types = datepickerDecorator.types;
    var dpg = $.fn.datepicker.DPGlobal;
    var dateInputs = [];
    var $node = $(node);
    var setting = false;

    var options = types.hasOwnProperty(type) ? types[type] : types.default;
    var format = internalFormat || options.format || $.fn.datepicker.defaults.format;
    var language = options.language || $.fn.datepicker.defaults.language;
    var $holder = $('<div class="dateinput-original" />').insertBefore($node);

    var prepareDateInputs = function prepareDateInputs(el) {
      var $el = $(el);
      var keypath = _this.getContext(el).getBindingPath();
      var $input = $el.clone();
      var id = $el.attr('id');

      if (id) {
        $input.attr('id', id + '-datepicker');
      }
      $input.removeAttr('name').addClass('dateinput').insertAfter($el);
      $el.attr('type', 'hidden').detach().appendTo($holder);

      dateInputs.push({ node: el, $input: $input, keypath: keypath });
    };

    if (node.tagName == 'INPUT') {
      prepareDateInputs(node);
      $node = dateInputs[0].$input;
    } else if ($node.hasClass('input-daterange')) {
      $node.children('input[type="text"]').each(function (index, el) {
        prepareDateInputs(el);
      });
    }
    if (dateInputs.length === 0) {
      return {
        teardown: function teardown() {}
      };
    }

    $node.datepicker(options).on('changeDate', function () {
      dateInputs.forEach(function (item) {
        if (!item.keypath || setting) {
          return;
        }

        var date = item.$input.datepicker('getUTCDate');

        setting = true;
        _this.set(item.keypath, dpg.formatDate(date, format, language) || null);
        // input[type=hiden] does not fire chnage event automatically. so we do it manually.
        $(item.node).trigger('change');
        setting = false;
      });
    });

    dateInputs.forEach(function (item) {
      if (!item.keypath) {
        return;
      }

      item.obsHandle = _this.observe(item.keypath, function (newValue) {
        if (setting) {
          return;
        }

        var date = dpg.parseDate(newValue, format, language);
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
        $(item.node).val(newValue).trigger('change');
        setting = false;
      });
    });

    return {
      teardown: function teardown() {
        $node.datepicker('destroy');
        dateInputs.forEach(function (item) {
          if (item.obsHandle) {
            item.obsHandle.cancel();
          }
          $(item.node).detach().insertBefore(item.$input).attr('type', 'text');
          item.$input.remove();
        });
        $holder.remove();
      }
    };
  };

  datepickerDecorator.internalFormat = null;
  datepickerDecorator.types = {
    default: {}
  };

  return datepickerDecorator;

})));
