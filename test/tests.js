// ractive-decorators-datepicker tests
// =============================
var expect = weknowhow.expect;

describe('datepickerDecorator', function () {
  var template = '<div class="form-group"><label for="date">Date Input</label>' +
    '<input type="text" id="datepicker-test" class="form-control" as-datepicker value="{{date}}">' +
    '</div>';

  var getDatepicker = function getDatepicker(selector) {
    var $el = $(selector);
    var $input;

    if ($el.is('input')) {
      $input = $(selector).parent().next();
    } else if ($el.hasClass('input-daterange')) {
      $input = $el;
    }
    if ($input && $input.length) {
      return $input.data().datepicker;
    }
  }

  describe('types', function () {
    it('has an empty "default" type by default', function () {
      expect(datepickerDecorator.types.default, 'to be an', 'object');
      expect(datepickerDecorator.types.default, 'to be empty');
    });
  });

  describe('initialize options', function () {
    var ractive, datepicker;

    it('uses "default" type to create datepicker onto the node by default', function () {
      datepickerDecorator.types.default.autoclose = true;

      ractive = new Ractive({
        el: 'test-container',
        template: template,
        data: function () {
          return {
            date: '05/15/2014',
          };
        },
        decorators: {datepicker: datepickerDecorator},
      });
      datepicker = getDatepicker('#datepicker-test');

      expect(datepicker.o.autoclose, 'to be true');

      ractive.teardown();
    });

    it('uses the type specified by arg to create datepicker object', function () {
      datepickerDecorator.types.todayBtn = {
        todayBtn: true,
        todayHighlight: true
      };

      var templateT = '<div class="form-group"><label for="date">Date Input</label>' +
        '<input type="text" id="datepicker-test" class="form-control" as-datepicker="\'todayBtn\'" value="{{date}}">' +
        '</div>';

      ractive = new Ractive({
        el: 'test-container',
        template: templateT,
        data: function () {
          return {
            date: '04/25/2016',
          };
        },
        decorators: {datepicker: datepickerDecorator},
      });
      datepicker = getDatepicker('#datepicker-test');

      expect(datepicker.o.todayBtn, 'to be true');
      expect(datepicker.o.todayHighlight, 'to be true');

      ractive.teardown();
    });

    it('uses "default" if specified type does not exist', function () {
      datepickerDecorator.types = {default: {autoclose: true}};

      var templateN = '<div id="datepicker-test" class="input-group input-daterange" as-datepicker="\'none\'">' +
        '<input type="text" class="form-control" value="{{startDate}}">' +
        '<span class="input-group-addon">to</span>' +
        '<input type="text" class="form-control" value="{{endDate}}">' +
        '</div>';

      ractive = new Ractive({
        el: 'test-container',
        template: templateN,
        data: function () {
          return {
            startDate: '10/10/2017',
            endDate: '10/16/2017'
          };
        },
        decorators: {datepicker: datepickerDecorator},
      });

      var dateRangePicker = getDatepicker('#datepicker-test');

      expect(dateRangePicker.pickers[0].o.autoclose, 'to be true');
      expect(dateRangePicker.pickers[1].o.autoclose, 'to be true');

      ractive.teardown();
    });
  });

  describe('two-way binding', function () {
    var ractive, datepicker, dateRangePicker;

    before(function () {
      var templateM = template +
        '{{#dateRange}}' +
        '<div id="daterangepicker-test" class="input-group input-daterange" as-datepicker>' +
        '<input type="text" class="form-control" value="{{startDate}}">' +
        '<span class="input-group-addon">to</span>' +
        '<input type="text" class="form-control" value="{{endDate}}">' +
        '</div>' +
        '{{/dateRange}}';

      ractive = new Ractive({
        el: 'test-container',
        template: templateM,
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

      datepicker.setDate('');
      expect(ractive.get('date'), 'to be null');

      dateRangePicker.pickers[0].setDate('09/07/2017');
      dateRangePicker.pickers[1].setDate('10/12/2017');

      expect(ractive.get('dateRange'), 'to equal', {
        startDate: '09/07/2017',
        endDate: '10/12/2017',
      });
    });

    it('applies changes on ractive to datepicker', function () {
      ractive.set('date', '10/16/2017');
      expect(datepicker.getDate(), 'to equal', new Date('10/16/2017'));

      ractive.set('date', null);
      expect(datepicker.getDate(), 'to be null');

      ractive.set('dateRange.startDate', '06/25/2017');
      ractive.set('dateRange.endDate', '07/06/2017');

      expect(dateRangePicker.pickers[0].getDate(), 'to equal', new Date('06/25/2017'));
      expect(dateRangePicker.pickers[1].getDate(), 'to equal', new Date('07/06/2017'));
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
      expect(datepicker.getDate(), 'to equal', new Date('04/01/2017'));

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
      expect(datepicker.getDate(), 'to equal', new Date('04/01/2017'));
    });
  });
});
