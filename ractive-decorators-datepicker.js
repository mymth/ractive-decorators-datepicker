/*

	ractive-decorators-datepicker
	=============================

	Version 0.1.0.

	This plugin is a decorator for bootstrap-datepicker that allows users to
	use different date formats between datepicker UI and internal data.

	==========================

	Troubleshooting: If you're using a module system in your app (AMD or
	something more nodey) then you may need to change the paths below,
	where it says `require( 'ractive' )` or `define([ 'ractive' ]...)`.

	==========================

	Usage: Include this file on your page below Ractive, e.g:

	    <script src='lib/ractive.js'></script>
	    <script src='lib/ractive-decorators-datepicker.js'></script>

	Or, if you're using a module loader, require this module:

	    // requiring the plugin will 'activate' it - no need to use
	    // the return value
	    require( 'ractive-decorators-datepicker' );

	<< more specific instructions for this plugin go here... >>

*/

(function ( global, factory ) {

	'use strict';

	// Common JS (i.e.internalFormat/browserify)
	if ( typeof module !== 'undefined' && module.exports && typeof require === 'function' ) {
		factory( require( 'ractive' ), require( 'jquery' ) );
	}

	// AMD environment
	else if ( typeof define === 'function' && define.amd ) {
		define([ 'ractive', 'jquery' ], factory );
	}

	// browser global
	else if ( global.Ractive && global.jQuery ) {
		factory( global.Ractive, global.jQuery );
	}

	else {
		throw new Error( 'Could not find Ractive! It must be loaded before the ractive-decorators-datepicker plugin' );
	}

}( typeof window !== 'undefined' ? window : this, function ( Ractive, $ ) {

	'use strict';

	var dpg = $.fn.datepicker.DPGlobal;
	// var count = 0;

	var datepickerDecorator = function ( node, type ) {
		var ractive = node._ractive.root,
			config, internalFormat,
			types = datepickerDecorator.types,
			options, format, language,
			$node = $(node),
			$holder = $('<div class="dateinput-original" />').insertBefore($node),
			inputs = [];

		this.defaults = {
			internalFormat: 'yyyy-mm-dd',
		};
		config = $.extend(this.defaults, datepickerDecorator.config);
		internalFormat = config.internalFormat;

		if (!types.hasOwnProperty('default')) {
			types.default = {};
		}

		options = (type && types.hasOwnProperty(type)) ? types[type] : types['default'];
		if (typeof options === 'function') {
			options = options.call(this, node);
		}
		format = options.format || $.fn.datepicker.defaults.format;
		language = options.language || $.fn.datepicker.defaults.language;

		function getDateObj(dateStr) {
			var dateObj;

			if (!dateStr || dateStr === '') {
				return null;
			} else if (dateStr.match(/^\d+(-\d+){2}$/)) {
				// Since both datepicker's and JS native date parsers consider the date formed with
				// numbers separated by '-' as UTC, replace the '-' with '/' so the parsers treat it
				// as local date.
				dateObj = new Date(dateStr.replace(/-/g, '/'));
			} else {
				// otherwise, use datepicker's date parser
				dateObj = dpg.parseDate(dateStr, internalFormat, language);
			}

			return isNaN(dateObj) ? null : dateObj;
		}

		function setInputs(el) {
			var $el = $(el),
				$input;

			$input = $el.clone();
			$input.removeAttr('id')
				.removeAttr('name')
				// .val(dpg.formatDate(getDateObj(el.value), format, language))
				.insertAfter($el);
			$el.attr('type', 'hidden').detach().appendTo($holder);

			inputs.push({
				node: el,
				$input: $input,
				keypath: el._ractive.binding ? el._ractive.binding.keypath : false,
				setting: false,
			});
		}

		if (node.tagName == 'INPUT') {
			setInputs(node);
			$node = inputs[0].$input;
		} else if ($node.is('.input-daterange')) {
			$node.children('input[type="text"]').each(function(index, el) {
				setInputs(el);
			});
		}
		if (inputs.length === 0) {
			// console.warn('Not supported configuration:', node);
			return;
		}

		$node.datepicker(options).on('changeDate', function () {
			for (var i in inputs) {
				var item = inputs[i], date;

				if (!item.setting) {
					item.setting = true;

					date = isNaN((date = item.$input.datepicker('getDate'))) ? null : date;
					item.node.value = dpg.formatDate(date, internalFormat, language);
					if (item.keypath) {
						ractive.updateModel(item.keypath);
					}
					item.setting = false;
				}
			}
		});

		$.map(inputs, function(item) {
			if (item.keypath) {
				item.observer = ractive.observe(item.keypath, function ( newValue ) {
					if (!item.setting) {
						item.setting = true;
						item.$input.datepicker('setDate', getDateObj(newValue));
						item.setting = false;
					}
				});
			}
		});

		return {
			teardown: function () {
				$node.datepicker('remove');
				$.map(inputs, function(item) {
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

	datepickerDecorator.config = {};
	datepickerDecorator.types = {};

	Ractive.decorators.datepicker = datepickerDecorator;
}));
