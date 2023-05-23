// ractive-decorators-datepicker tests
// =============================

describe('datepickerDecorator', function () {
  const template = `<div class="field">
  <input type="text" id="datepicker-test" class="date" as-datepicker value="{{date}}">
</div>`;

  const getDatepicker = function getDatepicker(selector) {
    const el = document.querySelector(selector);
    if (!el) {
      return;
    }

    return el.matches('input')
      ? el.nextElementSibling.datepicker
      : el.rangepicker;
  }

  describe('types', function () {
    it('has an empty "default" type by default', function () {
      expect(datepickerDecorator.types.default, 'to be an', 'object');
      expect(datepickerDecorator.types.default, 'to be empty');
    });
  });

  describe('input element proxy', function () {
    it('is created by cloning the original input element w/ -datepicker suffix in id + dateinput class', function () {
      const ractive = new Ractive({
        el: 'test-container',
        template,
        decorators: {datepicker: datepickerDecorator},
      });
      const original = document.getElementById('datepicker-test');
      const input = document.querySelector('.field input[type="text"]');

      expect(original, 'to be an', HTMLInputElement);
      expect(input, 'to be an', HTMLInputElement);
      expect(input, 'to be', original.nextElementSibling);
      expect(original.type, 'to be', 'hidden');
      expect(input.id, 'to be', `${original.id}-datepicker`);
      expect(input.className, 'to equal', `${original.className} datepicker-input`);

      ractive.teardown();
    });

    it('is created for the daterage inputs as well', function () {
      const rangeTemplate = `<div id="daterangepicker-test" class="input-group" as-datepicker>
  <input type="text" id="range-from" class="date" value="{{fromDate}}">
  <span>to</span>
  <input type="text" id="range-to" class="date" value="{{toDate}}">
</div>`;
      const ractive = new Ractive({
        el: 'test-container',
        template: rangeTemplate,
        decorators: {datepicker: datepickerDecorator},
      });
      const fromOriginal = document.getElementById('range-from');
      const toOriginal = document.getElementById('range-to');
      const [fromInput, toInput] = document.querySelectorAll('.input-group input[type="text"]');

      expect(fromOriginal, 'to be an', HTMLInputElement);
      expect(fromInput, 'to be an', HTMLInputElement);
      expect(fromInput, 'to be', fromOriginal.nextElementSibling);
      expect(fromOriginal.type, 'to be', 'hidden');
      expect(fromInput.id, 'to be', `${fromOriginal.id}-datepicker`);
      expect(fromInput.className, 'to equal', `${fromOriginal.className} datepicker-input`);
      //
      expect(toOriginal, 'to be an', HTMLInputElement);
      expect(toInput, 'to be an', HTMLInputElement);
      expect(toInput, 'to be', toOriginal.nextElementSibling);
      expect(toOriginal.type, 'to be', 'hidden');
      expect(toInput.id, 'to be', `${toOriginal.id}-datepicker`);
      expect(toInput.className, 'to equal', `${toOriginal.className} datepicker-input`);

      ractive.teardown();
    });

    it('is not created if the input element has no binding', function () {
      let ractive = new Ractive({
        el: 'test-container',
        template: '<input type="text" id="datepicker-test" as-datepicker>',
        decorators: {datepicker: datepickerDecorator},
      });
      const original = document.getElementById('datepicker-test');
      const input = document.querySelector('input[type="text"]');

      expect(original, 'to be an', HTMLInputElement);
      expect(input, 'to be an', HTMLInputElement);
      expect(input, 'to be', original);
      expect(input.className, 'to equal', 'datepicker-input');

      ractive.teardown();

      ractive = new Ractive({
        el: 'test-container',
        template: `<div id="daterangepicker-test" class="input-group" as-datepicker>
  <input type="text" id="range-from">
  <span>to</span>
  <input type="text" id="range-to">
</div>`,
        decorators: {datepicker: datepickerDecorator},
      });
      const fromOriginal = document.getElementById('range-from');
      const toOriginal = document.getElementById('range-to');
      const [fromInput, toInput] = document.querySelectorAll('.input-group input[type="text"]');

      expect(fromOriginal, 'to be an', HTMLInputElement);
      expect(fromInput, 'to be an', HTMLInputElement);
      expect(fromInput, 'to be', fromOriginal);
      expect(fromInput.className, 'to equal', 'datepicker-input');
      //
      expect(toOriginal, 'to be an', HTMLInputElement);
      expect(toInput, 'to be an', HTMLInputElement);
      expect(toInput, 'to be', toOriginal);
      expect(toInput.className, 'to equal', 'datepicker-input');

      ractive.teardown();
    });
  });

  describe('initialize options', function () {
    let ractive;
    let datepicker;

    it('uses "default" type to create datepicker onto the node by default', function () {
      datepickerDecorator.types.default.autohide = true;

      ractive = new Ractive({
        el: 'test-container',
        template,
        data: function() {
          return {
            date: '05/15/2014',
          };
        },
        decorators: {datepicker: datepickerDecorator},
      });
      datepicker = getDatepicker('#datepicker-test');

      expect(datepicker.config.autohide, 'to be true');

      ractive.teardown();
    });

    it('uses the type specified by arg to create datepicker object', function () {
      datepickerDecorator.types.todayButton = {
        todayButton: true,
        todayHighlight: true,
      };

      ractive = new Ractive({
        el: 'test-container',
        template: `<div class="field">
  <input type="text" id="datepicker-test" as-datepicker="'todayButton'" value="{{date}}">
</div>`,
        data: function () {
          return {
            date: '04/25/2016',
          };
        },
        decorators: {datepicker: datepickerDecorator},
      });
      datepicker = getDatepicker('#datepicker-test');

      expect(datepicker.config.todayButton, 'to be true');
      expect(datepicker.config.todayHighlight, 'to be true');

      ractive.teardown();
    });

    it('uses "default" if specified type does not exist', function () {
      datepickerDecorator.types = {default: {autohide: true}};

      ractive = new Ractive({
        el: 'test-container',
        template: `<div id="datepicker-test" class="input-group" as-datepicker="'none'">
  <input type="text" value="{{startDate}}">
  <span>to</span>
  <input type="text" value="{{endDate}}">
</div>`,
        data: function () {
          return {
            startDate: '10/10/2017',
            endDate: '10/16/2017'
          };
        },
        decorators: {datepicker: datepickerDecorator},
      });

      var dateRangePicker = getDatepicker('#datepicker-test');

      expect(dateRangePicker.datepickers[0].config.autohide, 'to be true');
      expect(dateRangePicker.datepickers[1].config.autohide, 'to be true');

      ractive.teardown();
    });
  });

  describe('two-way binding', function () {
    let ractive;
    let datepicker;
    let dateRangePicker;

    before(function () {
      ractive = new Ractive({
        el: 'test-container',
        template: `${template}
  {{#dateRange}}
  <div id="daterangepicker-test" class="input-group" as-datepicker>
    <input type="text" value="{{startDate}}">
    <span>to</span>
    <input type="text" value="{{endDate}}">
  </div>
{{/dateRange}}`,
        data: function () {
          return {
            date: '04/25/2017',
            dateRange: {
              startDate: '09/10/2017',
              endDate: '10/10/2017',
            },
          };
        },
        decorators: {datepicker: datepickerDecorator},
      });
      datepicker = getDatepicker('#datepicker-test');
      dateRangePicker = getDatepicker('#daterangepicker-test')
    });

    after(function () {
      ractive.teardown();
    });

    it('applies changes on datepicker to ractive', function () {
      datepicker.setDate('04/28/2017');
      expect(ractive.get('date'), 'to be', '04/28/2017');

      datepicker.setDate({clear: true});
      expect(ractive.get('date'), 'to be null');

      dateRangePicker.datepickers[0].setDate('09/07/2017');
      dateRangePicker.datepickers[1].setDate('10/12/2017');

      expect(ractive.get('dateRange'), 'to equal', {
        startDate: '09/07/2017',
        endDate: '10/12/2017',
      });

      dateRangePicker.setDates({clear: true});
      expect(ractive.get('dateRange'), 'to equal', {
        startDate: null,
        endDate: null,
      });
    });

    it('applies changes on ractive to datepicker', function () {
      ractive.set('date', '10/16/2017');
      expect(datepicker.getDate('mm/dd/yyyy'), 'to be', '10/16/2017');

      ractive.set('date', null);
      expect(datepicker.getDate(), 'to be undefined');

      ractive.set('dateRange.startDate', '06/25/2017');
      ractive.set('dateRange.endDate', '07/06/2017');

      expect(dateRangePicker.getDates('mm/dd/yyyy'), 'to equal', ['06/25/2017', '07/06/2017']);
    });
  });

  describe('internalFormat', function () {
    var ractive, datepicker;

    after(function () {
      ractive.teardown();
      datepickerDecorator.internalFormat = null;
    });

    it('is null by default', function () {
      expect(datepickerDecorator.internalFormat, 'to be null');
    });

    it('specifies the format of the dates stored in ractive', function () {
      datepickerDecorator.types.GB = {format: 'dd/mm/yyyy'};

      ractive = new Ractive({
        el: 'test-container',
        template: '<input type="text" id="datepicker-test" as-datepicker="\'GB\'" value="{{date}}">',
        data: function () {
          return {
            date: null,
          };
        },
        decorators: {datepicker: datepickerDecorator},
      });
      datepicker = getDatepicker('#datepicker-test');

      datepicker.setDate('20/03/2017');
      expect(ractive.get('date'), 'to be', '20/03/2017');

      ractive.set('date', '01/04/2017');
      expect(datepicker.getDate('mm/dd/yyyy'), 'to be', '04/01/2017');

      ractive.teardown();

      datepickerDecorator.internalFormat = 'yyyy-mm-dd';

      ractive = new Ractive({
        el: 'test-container',
        template: template,
        data: function () {
          return {
            date: null,
          };
        },
        decorators: {datepicker: datepickerDecorator},
      });
      datepicker = getDatepicker('#datepicker-test');

      datepicker.setDate('03/20/2017');
      expect(ractive.get('date'), 'to be', '2017-03-20');

      ractive.set('date', '2017-04-01');
      expect(datepicker.getDate('mm/dd/yyyy'), 'to be', '04/01/2017');
    });
  });
});
