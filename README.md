# Ractive.js datepicker decorator plugin

This plugin is a decorator for [bootstrap-datepicker](https://github.com/eternicode/bootstrap-datepicker).

*Find more Ractive.js plugins at [http://docs.ractivejs.org/latest/plugins](http://docs.ractivejs.org/latest/plugins)*

[See the demo here.](index.html)

## Usage

Load the plugin.

```html
<!-- on Browser (plugin is exposed to global with 'datepickerDecorator' signature) -->
<script src="lib/ractive.js"></script>
<script src="lib/ractive-decorators-datepicker.js"></script>
```
```js
// on Node.js
var Ractive = require( 'ractive' );
var datepickerDecorator = require( 'ractive-decorators-datepicker' );
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
<div class="input-group input-daterange" as-datepicker>
    <input type="text" value="{{startDate}}">
    <span class="input-group-addon">to</span>
    <input type="text" value="{{endDate}}">
</div>
```

> Bootstrap-datepicker components *(not to be confused with Ractive components)* are not supported. You can create an equivalent like an example below when you need it.
> 
> ```html
> <!-- component equivalent -->
> <div class="input-group date">
>     <input type="text" as-datepicker value="{{date}}">
>     <span class="input-group-addon"><i class="glyphicon glyphicon-th"></i></span>
> </div>
> 
> <script>
>     $('.input-group.date').find('.input-group-addon').on('click', function () {
>         $(this).siblings('input').datepicker('show');
>     });
> </script>
> ```


### Using types

#### Customizing the default type

You can set your initialize options for bootstrap-datepicker to `datepickerDecorator.types.default`.

```js
datepickerDecorator.types.default = {
    autoclose: true,
    clearBtn: true
};
```

#### Adding types

You can also use multiple types of bootstrap-datepicker elements.
To use additional types, first, add new types to `datepickerDecorator.types` with their initialize options.

```js
datepickerDecorator.types.todayBtn = {
    todayBtn: true,
    todayHighlight: true
};
datepickerDecorator.types.multi = {
    multidate: true,
};
```

Then set the type name to the `as-datepicker` attribute.
> Note: type name *must be quoted* so that the decorator can take it as a literal.

```html
<input type="text" as-datepicker="'todayBtn'" value="{{date}}">
```

### Using internal date format

The plugin allows you to use different date formats between datepicker UI and internal data. To use it, set a date format to `datepickerDecorator.internalFormat`.

```js
datepickerDecorator.internalFormat = 'yyyy-mm-dd';
```

## License

Copyright (c) 2014 Hidenao Miyamoto. Licensed MIT
