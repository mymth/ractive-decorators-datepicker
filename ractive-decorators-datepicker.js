/*
  ractive-decorators-datepicker
  ===============================================

  Version 0.4.0.

  This plugin is a decorator for bootstrap-datepicker.

  ==========================
*/

import { Datepicker, DateRangePicker } from 'vanillajs-datepicker';

function datepickerDecorator(node, type = 'default') {
  const {internalFormat, types} = datepickerDecorator;
  const options = types[type] || types.default;
  const format = internalFormat || options.format || 'mm/dd/yyyy';
  const language = options.language || 'en';
  const origInputs = new WeakMap();
  let dateInputs;
  let datepicker;

  const prepareDateInput = (element) => {
    const keypath = this.getContext(element).getBindingPath();
    if (!keypath) {
      origInputs.set(element, {});
      return element;
    }

    const orignalType = element.type;
    const input = element.cloneNode();

    if (element.id) {
      input.id = `${element.id}-datepicker`;
    }
    input.removeAttribute('name');
    // remove initial value to prevent it from being parsed to a wrong date
    // when internalFormat != datepicker's format
    // the inital value will be set by the observer callback as it's called
    // immediately when added
    input.value = '';
    element.type = 'hidden';
    element.after(input);

    origInputs.set(input, {element, keypath, orignalType});
    return input;
  };
  const restoreOriginalInput = (dateInput) => {
    const origInput = origInputs.get(dateInput);
    dateInput.remove();
    origInput.element.type = origInput.orignalType;
  };

  if (node.tagName === 'INPUT') {
    const input = prepareDateInput(node);
    dateInputs = [input];
    datepicker = new Datepicker(input, options);
  } else {
    const rangePickerOptions = Object.assign({}, options);
    const inputs = options.inputs || Array.from(node.querySelectorAll('input[type="text"]'));
    dateInputs = rangePickerOptions.inputs = inputs.slice(0, 2).map(prepareDateInput);
    datepicker = new DateRangePicker(node, rangePickerOptions);
  }
  if (!datepicker) {
    dateInputs.forEach(restoreOriginalInput);
    return {
      teardown() {},
    };
  }

  dateInputs.forEach((dateInput) => {
    const keypath = origInputs.get(dateInput).keypath;
    if (!keypath) {
      return;
    }
    let setting = false;

    const changeDateListenr = dateInput.changeDateListenr = () => {
      if (setting === dateInput) {
        return
      }

      setting = dateInput;
      this.set(keypath, dateInput.datepicker.getDate(format) || null);
      setting = false;
    };
    dateInput.addEventListener('changeDate', changeDateListenr);

    dateInput.obsHandle = this.observe(keypath, (newValue) => {
      if (setting === dateInput) {
        return;
      }

      const values = newValue
        ? (Array.isArray(newValue) ? newValue : [newValue])
        : [];
      const newDates = values.map(date => Datepicker.parseDate(date, format, language));

      setting = dateInput;
      dateInput.datepicker.setDate(newDates, {clear: true});
      setting = false;
    });
  });

  return {
    teardown() {
      datepicker.destroy();
      dateInputs.forEach((dateInput) => {
        if (!origInputs.get(dateInput).keypath) {
          return;
        }
        dateInput.obsHandle.cancel();
        dateInput.removeEventListener('changeDate', dateInput.changeDateListenr);
        restoreOriginalInput(dateInput);
      });
    }
  };
}

datepickerDecorator.internalFormat = null;
datepickerDecorator.types = {
  default: {},
};

export { datepickerDecorator as default };
