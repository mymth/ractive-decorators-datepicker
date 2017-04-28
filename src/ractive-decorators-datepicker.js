import Ractive from 'ractive';
import $ from 'jquery';

const datepickerDecorator = function (node, type = 'default') {
  const internalFormat = datepickerDecorator.internalFormat;
  const types = datepickerDecorator.types;
  const dpg = $.fn.datepicker.DPGlobal;
  const dateInputs = [];
  let $node = $(node);
  let setting = false;

  const options = types.hasOwnProperty(type) ? types[type] : types.default;
  const format = internalFormat || options.format || $.fn.datepicker.defaults.format;
  const language = options.language || $.fn.datepicker.defaults.language;
  const $holder = $('<div class="dateinput-original" />').insertBefore($node);

  const prepareDateInputs = (el) => {
    const $el = $(el);
    const keypath = Ractive.getNodeInfo(el).getBindingPath();
    const $input = $el.clone();

    $input.removeAttr('id').removeAttr('name').insertAfter($el);
    $el.attr('type', 'hidden').detach().appendTo($holder);

    dateInputs.push({node: el, $input, keypath});
  }

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

      const date = item.$input.datepicker('getDate');

      setting = true;
      this.set(item.keypath, dpg.formatDate(date, format, language) || null);
      setting = false;
    });
  });

  dateInputs.forEach((item) => {
    if (!item.keypath) {
      return;
    }

    item.observer = this.observe(item.keypath, (newValue) => {
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
      setting = false;
    });
  });

  return {
    teardown() {
      $node.datepicker('remove');
      dateInputs.forEach((item) => {
        if (item.observer) {
          item.observer.cancel();
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
  default: {},
};

export default datepickerDecorator;
