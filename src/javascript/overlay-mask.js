AUI.add('overlay-mask', function(A) {

var L = A.Lang,
	isString = L.isString,
	isNumber = L.isNumber,

	UA = A.UA,

	isDoc = false,
	isWin = false,
	ie6 = (UA.ie && UA.version.major <= 6),

	ABSOLUTE = 'absolute',
	ALIGN = 'align',
	BACKGROUND = 'background',
	BOUNDING_BOX = 'boundingBox',
	FIXED = 'fixed',
	HEIGHT = 'height',
	OFFSET_HEIGHT = 'offsetHeight',
	OFFSET_WIDTH = 'offsetWidth',
	OPACITY = 'opacity',
	OVERLAY_MASK = 'overlaymask',
	POSITION = 'position',
	TARGET = 'target',
	WIDTH = 'width';

function OverlayMask(config) {
 	OverlayMask.superclass.constructor.apply(this, arguments);
}

A.mix(OverlayMask, {
	NAME: OVERLAY_MASK,

	ATTRS: {
		align: {
            value: { node: null, points: [ 'tl', 'tl' ] }
        },

		background: {
			lazyAdd: false,
			value: '#000',
			validator: isString,
			setter: function(v) {
				this.get(BOUNDING_BOX).setStyle(BACKGROUND, v);

				return v;
			}
		},

		target: {
			lazyAdd: false,
			value: document,
			setter: function(v) {
				var target = A.get(v);

				isDoc = target.compareTo(document);
				isWin = target.compareTo(window);

				return target;
			}
		},

		opacity: {
			value: .5,
			validator: isNumber,
			setter: function(v) {
				return this._setOpacity(v);
			}
		},

		shim: {
			value: A.UA.ie
		},

		visible: {
			value: false
		},

		zIndex: {
			value: 1000
		}
	}
});

A.extend(OverlayMask, A.ComponentOverlay, {
	/*
	* Lifecycle
	*/
	bindUI: function() {
		var instance = this;

		OverlayMask.superclass.bindUI.apply(this, arguments);

		instance.after('targetChange', instance._afterTargetChange);

		// window:resize YUI normalized event is not working, bug?
		A.on('windowresize', A.bind(instance.refreshMask, instance));
	},

	syncUI: function() {
		var instance = this;

		instance.refreshMask();
	},

	/*
	* Methods
	*/
	getTargetSize: function() {
		var instance = this;
		var target = instance.get(TARGET);

		var height = target.get(OFFSET_HEIGHT);
		var width = target.get(OFFSET_WIDTH);

		if (ie6) {
			// IE6 doesn't support height/width 100% on doc/win
			if (isWin) {
				width = A.DOM.winWidth();
				height = A.DOM.winHeight();
			}
			else if (isDoc) {
				width = A.DOM.docWidth();
				height = A.DOM.docHeight();
			}
		}
		// good browsers...
		else if (isDoc || isWin) {
			height = '100%';
			width = '100%';
		}

		return { height: height, width: width };
	},

	/*
	* Methods
	*/
	refreshMask: function() {
		var instance = this;
		var align = instance.get(ALIGN);
		var target = instance.get(TARGET);
		var boundingBox = instance.get(BOUNDING_BOX);
		var targetSize = instance.getTargetSize();

		boundingBox.setStyles({
			position: ie6 ? ABSOLUTE : FIXED,
			left: 0,
			top: 0
		});

		instance.set(HEIGHT, targetSize.height);
		instance.set(WIDTH, targetSize.width);

		// if its not a full mask...
		if ( !(isDoc || isWin) ) {
			// if the target is not document|window align the overlay
			instance.align(target, align.points);
		}
	},

	/*
	* Setters
	*/
	_setOpacity: function(v) {
		var instance = this;

		instance.get(BOUNDING_BOX).setStyle(OPACITY, v);

		return v;
	},

	/*
	* Listeners
	*/
	_afterTargetChange: function(event) {
		var instance = this;

		instance.refreshMask();
	},

	_afterVisibleChange: function(event) {
		var instance = this;

		OverlayMask.superclass._afterVisibleChange.apply(this, arguments);

		if (event.newVal) {
			instance._setOpacity(
				instance.get(OPACITY)
			);
		}
	}
});

A.OverlayMask = OverlayMask;

}, '@VERSION', { requires: [ 'overlay', 'event-resize' ] });