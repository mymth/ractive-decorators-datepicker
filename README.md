# Ractive.js datepicker decorator plugin

This plugin is a decorator for [vanillajs-datepicker](https://github.com/mymth/vanillajs-datepicker).

*Find more Ractive.js plugins at [http://ractive.js.org/resources/#plugins/](http://ractive.js.org/resources/#plugins/)*

[See the demo here.](https://raw.githack.com/mymth/ractive-decorators-datepicker/v0.4.0/index.html)

## Usage

Load the plugin.

```html
<!-- on Browser (plugin is exposed to global with 'datepickerDecorator' signature) -->
<script src="https://cdn.jsdelivr.net/npm/ractive"></script>
<script src="https://cdn.jsdelivr.net/gh/mymth/ractive-decorators-datepicker@0.4.0/dist/ractive-decorators-datepicker.js"></script>
```
```js
// on Node.js
import Ractive from 'ractive';
import datepickerDecorator from 'ractive-decorators-datepicker';
```

Make the decorator available.

```js
// to all Ractive instances
Ractive.decorators.datepicker = datepickerDecorator;

// to a single instance
var ractive = new Ractive({
    el: '#container',
    template: template,
    decorators: {
        datepicker: datepickerDecorator,
    },
});

// to all instaces of RactiveDatepicker
var RactiveDatepicker = Ractive.extend({
    decorators: {
        datepicker: datepickerDecorator,
    },
})
```

Set the `as-datepicker` attribute to the `input` tag (for single date) or `input-daterange` class element (for date range) you want to use the decorator.

```html
<!-- single date input -->
<input type="text" as-datepicker value="{{date}}">

<!-- date range -->
<div class="input-group" as-datepicker>
    <input type="text" class="form-control" value="{{startDate}}">
    <span class="input-group-text">to</span>
    <input type="text" class="form-control" value="{{endDate}}">
</div>
```


### Using types

#### Customizing the default type

You can set your initialize options for bootstrap-datepicker to `datepickerDecorator.types.default`.

```js
datepickerDecorator.types.default = {
    autohide: true,
    clearButton: true
};
```

#### Adding types

You can also use multiple types of bootstrap-datepicker elements.
To use additional types, first, add new types to `datepickerDecorator.types` with their initialize options.

```js
datepickerDecorator.types.todayButton = {
    todayButton: true,
    todayHighlight: true
};
datepickerDecorator.types.multi = {
    maxNumberOfDates: 3,
};
```

Then set the type name to the `as-datepicker` attribute.
> Note: type name *must be quoted* so that the decorator can take it as a literal.

```html
<input type="text" as-datepicker="'todayButton'" value="{{date}}">
```

### Using internal date format

The plugin allows you to use different date formats between datepicker UI and internal data. To use it, set a date format to `datepickerDecorator.internalFormat`.

```js
datepickerDecorator.internalFormat = 'yyyy-mm-dd';
```

## License

Copyright (c) 2016 Hidenao Miyamoto. Licensed MIT
