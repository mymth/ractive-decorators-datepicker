# Ractive.js datepicker decorator plugin

This plugin is a decorator for [bootstrap-datepicker](https://github.com/eternicode/bootstrap-datepicker) that allows you to use different date formats between datepicker UI and internal data.


*Find more Ractive.js plugins at [http://docs.ractivejs.org/latest/plugins](http://docs.ractivejs.org/latest/plugins)*

[See the demo here.](index.html)

## Usage

Include this file on your page below Ractive, e.g:

```html
<script src='lib/ractive.js'></script>
<script src='lib/ractive-decorators-datepicker.js'></script>
```

Or, if you're using a module loader, require this module:

```js
// requiring the plugin will 'activate' it - no need to use the return value
require( 'ractive-decorators-datepicker' );
```

Then, add `decorator` attribute to the input tag or the div tag for date-range in your template.

```html
<!-- single date input -->
<input type="text" decorator="datepicker" value="{{date}}">

<!-- date-range -->
<div class="input-group input-daterange" decorator="datepicker">
    <input type="text" value="{{startDate}}">
    <span class="input-group-addon">to</span>
    <input type="text" value="{{endDate}}">
</div>
```
-
Components are not supported at the moment. Howerver, you can create an equivalent like an example below when you need it.

```html
<!-- component -->
<div class="input-group date">
    <input type="text" decorator="datepicker" value="{{date}}">
    <span class="input-group-addon"><i class="glyphicon glyphicon-th"></i></span>
</div>

<script>
	$('.input-group.date').find('.input-group-addon').on('click', function () {
		$(this).siblings('input').datepicker('show');
	});
</script>
```
-

### Customization

#### Changing the configuration

Set your configuration object to `Ractive.decorators.datepicker.config`.

```js
Ractive.decorators.datepicker.config = {
	internalFormat: 'yyyy-mm-dd',
};
```

#### Changing the default options

Set your options object to `Ractive.decorators.datepicker.types.default`.

```js
Ractive.decorators.datepicker.types.default = {
	autoclose: true,
	clearBtn: true
};
```

#### Adding another option set

Add an options object into `Ractive.decorators.datepicker.types` as a new property.

```js
Ractive.decorators.datepicker.types.todayBtn = {
	todayBtn: true,
	todayHighlight: true
};
```

Then use the property name as the modifier of `decorator` attribute.

```html
<input type="text" decorator='datepicker:todayBtn' value='{{date}}'>
```

#### Using a function

Function that returns an options object can also be used. The DOM node which datepicker is applied to is passed as the argument.

```js
Ractive.decorators.datepicker.types.todayBtn = function (node) {
	return {
		todayBtn: true,
		todayHighlight: true
	};
};
```

## License

Copyright (c) 2014 Hidenao Miyamoto. Licensed MIT

Created with the [Ractive.js plugin template](https://github.com/ractivejs/plugin-template) for Grunt.
