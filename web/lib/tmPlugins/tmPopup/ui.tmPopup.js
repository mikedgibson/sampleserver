/*
 * UI Trend Micro Popup 1.0
 *
 * Copyright 2011,
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *  jquery.ui.button.js
 *	jquery.ui.draggable.js
 *	jquery.ui.mouse.js
 *	jquery.ui.position.js
 *	jquery.ui.resizable.js
 *  buttonBuild.js
 */
(function( $, undefined ) {

var uiPopupClasses =
		'ui-tmPopup ' +
		'ui-tmPopup-container ',
	sizeRelatedOptions = {
		buttons: true,
		height: true,
		maxHeight: true,
		maxWidth: true,
		minHeight: true,
		minWidth: true,
		width: true
	},
	resizableRelatedOptions = {
		maxHeight: true,
		maxWidth: true,
		minHeight: true,
		minWidth: true
	},
	// support for jQuery 1.3.2 - handle common attrFn methods for tmPopup
	attrFn = $.attrFn || {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true,
		click: true
	};
    

$.widget("ui.tmPopup", {
	options: {
		autoOpen: false,		
		buttons: null,
        checkbox: null,
		closeButton: true,
		closeOnEscape: false,
		closeText: 'close',	
		dialog: null,
		draggable: false,
		fixPosition: true,
		hide: null,
		height: 'auto',
		maxHeight: false,
		maxWidth: false,
		minHeight: 95,
		minWidth: 300,
		mask: true,
		openRefresh: false,
		openAfterLoaded: true,
		popupClass: '',
		position: {
			my: 'center',
			at: 'center',
			collision: 'fit',
			// ensure that the titlebar is never outside the document
			using: function(pos) {
				var topOffset = $(this).css(pos).offset().top;
				if (topOffset < 10) {
					$(this).css('top', pos.top - topOffset + 9);
				}
			}
		},
		resizable: false,
		show: null,
		stack: true,
		title: '',
		url: null,
		width: 'auto',
		zIndex: 1100
	},

	_create: function() {
		this._hasIframe= false,
		this._hasDialog= false;
		this._loaded= false;		
		this.element.data("hasTmPopup", false);
		var self = this,		
			options = self.options,			
			title = options.title || '&#160;',
			titleId = $.ui.tmPopup.getTitleId(self.element),			
			_uiPopup= (self.tmPopup = $('<div></div>'))
				.appendTo(document.body)
				.hide()
				.addClass(uiPopupClasses + options.popupClass)
				.css({
					zIndex: options.zIndex
				})
				// setting tabIndex makes the div focusable
				// setting outline to 0 prevents a border on focus in Mozilla
				.attr('tabIndex', -1).css('outline', 0).keydown(function(event) {
					if (options.closeOnEscape && event.keyCode &&
						event.keyCode === $.ui.keyCode.ESCAPE) {
							
						self.close(event);
						event.preventDefault();
					}
				})
				.attr({
					role: 'tmPopup',
					'aria-labelledby': titleId
				})
				.mousedown(function(event) {
					self.moveToTop(false, event);
				}),
			
			uiPopupTitlebar = (self.tmPopupTitlebar = $('<div></div>'))
				.addClass('ui-tmPopup-title-bar')
				.prependTo(_uiPopup),
			
			uiPopupTitle = (self.tmPopupTitle = $('<span></span>'))
				.addClass('ui-tmPopup-title')
				.attr('id', titleId)
				.html(title)
				.prependTo(uiPopupTitlebar),
				
			uiPopupCloseBtn = (self.tmPopupCloseBtn = $('<a href="#"></a>'))
				.addClass('ui-tmPopup-close ')
				.attr('role', 'button')
				.hover(
					function() {						
						uiPopupCloseBtn.addClass('ui-state-hover');
					},
					function() {
						uiPopupCloseBtn.removeClass('ui-state-hover');
					}
				)
				.focus(function() {
					uiPopupCloseBtn.addClass('ui-state-focus');
				})
				.blur(function() {
					uiPopupCloseBtn.removeClass('ui-state-focus');
				})
				.click(function(event) {
					self.close(event);
					return false;
				})
				.prependTo(_uiPopup),
				
			uiPopupContent = (self.tmPopupContent = $("<div></div>"))
				.show()				
				.addClass('ui-tmPopup-content')
				.appendTo(_uiPopup),
			
			uiPopupContentIframe,uiPopupDialog,
				
			uiPopupBackground= (self.tmPopupBackground = $("<div></div>"))			
				.addClass('ui-tmPopup ui-tmPopup-background')
				.css({
					zIndex: _uiPopup.css("zIndex") - 1
				})
				.insertBefore(_uiPopup);
           
			self._id= titleId;
            
			if(options.url && typeof options.url == 'string' && options.url.length > 0) {
				uiPopupContentIframe= (self.tmPopupContentIframe = $('<iframe frameborder="0"></iframe>'))
				.addClass("ui-tmPopup-Content-Iframe")
				.attr(
					{
						role: 'iframe',
						name: "ui-tmPopup-Content-Iframe-" + titleId,
						id: "ui-tmPopup-Content-Iframe-" + titleId,
						src: options.url
					}
				)				
				.bind("load",
					function(){				
						self._loaded= true;
					}
				);
				
				if(options.openAfterLoaded === false){
					uiPopupContentIframe
					.appendTo(uiPopupContent);
				}
				self._hasIframe= true;
			}else if(options.dialog){
				uiPopupDialog= (self.tmPopupDialog = options.dialog)
				.addClass('ui-tmPopup-dialog')
				.appendTo(uiPopupContent);
				self._hasDialog= true;
			}
				
			//handling of deprecated beforeclose (vs beforeClose) option
			if ($.isFunction(options.beforeclose) && !$.isFunction(options.beforeClose)) {
				options.beforeClose = options.beforeclose;
			}
			
			uiPopupTitlebar.find("*").add(uiPopupTitlebar).disableSelection();
			
			if(options.closeButton === false) {
				uiPopupCloseBtn.remove();
			}
			if(options.fixPosition === true){			
				$(window).bind("resize.ui-tmPopup-" + titleId, function(){
					self._position(options.position);
				});
				$(window).bind("scroll.ui-tmPopup-" + titleId, function(){
					self._position(options.position);
				});
			}
			if (options.draggable === true && $.fn.draggable) {
				self._makeDraggable();
			}
			if (options.resizable === true && $.fn.resizable) {
				self._makeResizable();
			}
			self._createButtons(options.buttons);
            self._createCheckBox(options.checkbox);
			self._isOpen = false;
			self.element.data("hasTmPopup", true);
			if ($.fn.bgiframe) {
				_uiPopup.bgiframe();
			}			
	},

	_init: function() {
		if ( this.options.autoOpen ) {
			this.open();
		}
	},

	destroy: function() {
		var self = this;
		
		if (self.overlay) {
			self.overlay.destroy();
		}
		
		$([document, window]).unbind('.ui-tmPopup-' +  self._id);
		/*self.element
			.unbind('.dialog')
			.removeData('dialog')
			.removeClass('ui-dialog-content ui-widget-content')
			.hide().appendTo('body');*/
		self.tmPopup.remove();
		self.tmPopupBackground.remove();
		/*if (self.originalTitle) {
			self.element.attr('title', self.originalTitle);
		}*/
		self.element.data("hasTmPopup", false);		
		return self;
	},

	widget: function() {	
		return this._uiPopup;
	},

	close: function(event) {		
		var self = this,
			maxZ, thisZ;
		if (false === self._trigger('beforeClose', event)) {
			return;
		}
		if (self.overlay) {
			self.overlay.destroy();
		}
		
		self.tmPopup.unbind('keypress.ui-tmPopup');
		self._isOpen = false;
		$.ui.tmPopup.opened= false;
		$.ui.tmPopup._openPopup= null;
		if (self.options.hide) {
			self.tmPopup.hide(self.options.hide, function() {
				self._trigger('close', event);
			});
			self.tmPopupBackground.hide(self.options.hide);			
		} else {
			self.tmPopup.hide();
			self.tmPopupBackground.hide();
			self._trigger('close', event);
		}
		
		//$.ui.tmPopup.overlay.resize();
		
		// adjust the maxZ to allow other mask tmPopup to continue to work
		/*if (self.options.mask) {
			maxZ = 0;
			$('.ui-tmPopup').each(function() {
				if (this !== self.tmPopup[0]) {
					thisZ = $(this).css('z-index');
					if(!isNaN(thisZ)) {
						maxZ = Math.max(maxZ, thisZ);
					}
				}
			});
			$.ui.tmPopup.maxZ = maxZ;
		}*/

		return self;
	},

	isOpen: function() {
		return this._isOpen;
	},
	// the force parameter allows us to move mask tmPopup to their correct
	// position on open
	moveToTop: function(force, event) {
		var self = this,
			options = self.options,
			saveScroll;

		if ((options.mask && !force) ||
			(!options.stack && !options.mask)) {
			return self._trigger('focus', event);
		}

		if (options.zIndex > $.ui.tmPopup.maxZ) {
			$.ui.tmPopup.maxZ = options.zIndex;
		}
		if (self.overlay) {
			$.ui.tmPopup.maxZ += 1;
			//self.overlay.$el.css('z-index', $.ui.tmPopup.overlay.maxZ = $.ui.tmPopup.maxZ);
		}

		//Save and then restore scroll since Opera 9.5+ resets when parent z-Index is changed.
		saveScroll = { scrollTop: self.element.attr('scrollTop'), scrollLeft: self.element.attr('scrollLeft') };
		$.ui.tmPopup.maxZ += 1;
		self.tmPopup.css('z-index', $.ui.tmPopup.maxZ);
		self.element.attr(saveScroll);
		self._trigger('focus', event);

		return self;
	},

	open: function() {
		if (this._isOpen) { return; }
		var self = this,
			options = self.options,
			uiPopup = self.tmPopup;		
		self.overlay = options.mask ? new $.ui.tmPopup.overlay(self) : null;
		function _open(){
			if(options.openRefresh === true){
				self.tmPopupContentIframe.bind("load",
					function(){
						self._size();
						uiPopup.hide();
						self._position(options.position);
						uiPopup.show(options.show);
						self.tmPopupBackground.show(options.show);
						
						self._isOpen = true;
						self.moveToTop(true);
						$.ui.tmPopup.opened= true;
						$.ui.tmPopup._openPopup= self;
						self._trigger('open');
						self.tmPopupContentIframe.unbind("load");
					}
				);
				self.tmPopupContentIframe[0].contentWindow.location.reload();
			}else{				
				self._size();
				uiPopup.hide();
				self._position(options.position);
				uiPopup.show(options.show);
				self.tmPopupBackground.show(options.show);
				
				self._isOpen = true;
				self.moveToTop(true);
				$.ui.tmPopup.opened= true;
				$.ui.tmPopup._openPopup= self;
				self._trigger('open');
				return self;
			}
		}
		if(self._hasIframe === true){			
			if(options.openAfterLoaded){
				if(self.tmPopupContent.find("iframe").length == 0){					
					self.tmPopupContentIframe.appendTo(self.tmPopupContent);
				}
			}
			uiPopup
				.css("top", -100000)
				.show();		
			if(self._loaded){				
				return  _open();
			}else{				
				self.tmPopupContentIframe.bind("load",
					function(){						
						return  _open();
					}
				);
			}			
		}else{
			self._size();	
			uiPopup.show(options.show);			
			self._position(options.position);
			self.tmPopupBackground.show(options.show);
			self._isOpen = true;
			self.moveToTop(true);
			$.ui.tmPopup.opened= true;
			$.ui.tmPopup._openPopup= self;
			self._trigger('open');
			return self;
		}
		/*
		// prevent tabbing out of mask tmPopup
		if (options.uiDialog.mask) {
			bind('keypress.ui-dialog', function(event) {
				if (event.keyCode !== $.ui.keyCode.TAB) {
					return;
				}

				var tabbables = $(':tabbable', this),
					first = tabbables.filter(':first'),
					last  = tabbables.filter(':last');

				if (event.target === last[0] && !event.shiftKey) {
					first.focus(1);
					return false;
				} else if (event.target === first[0] && event.shiftKey) {
					last.focus(1);
					return false;
				}
			});
		}
*/
		// set focus to the first tabbable element in the content area or the first button
		// if there are no tabbable elements, set focus on the dialog itself
		/*$(self.element.find(':tabbable').get().concat(
			uiDialog.find('.ui-dialog-buttonpane :tabbable').get().concat(
				uiDialog.get()))).eq(0).focus();
		*/
		
	},
	
	_createButtons: function(buttons) {
		var self = this,
			hasButtons = false;
	
		if (typeof buttons === 'object' && buttons !== null) {
			$.each(buttons, function() {
				return !(hasButtons = true);
			});
		}else{
            return false;
        }
        if(self.tmPopupFooter && self.tmPopupFooter.length>0){
            if(self.tmPopupBtnUl){                    
                self.tmPopupBtnUl.remove();
            }
            uiPopupFooter=  self.tmPopupFooter;
        }else{
            uiPopupFooter= (self.tmPopupFooter = $('<div></div>'))
            .addClass('ui-tmPopup-footer')
            .appendTo(self.tmPopup)
            .show();
        }	
        uiPopupBtnUl= (self.tmPopupBtnUl = $('<ul></ul>'))
            .addClass('ui-tmPopup-btn-ul')
            .appendTo(uiPopupFooter);
        
		if(hasButtons) {			
			$.each(buttons, function(name, props) {				
				var button;
				if($.isFunction( props )){
					return false;
				}
				if(!("name" in props)) {
					props["name"] = name;
				}
				if($.fn.buttonBuild !== undefined) {
					button= $('<li role="button" class="tmPopupButton"></li>')
						.buttonBuild(props);
					if(props.mode && props.mode == "small") {
						button.css("margin-top", 10);
					}else{
						button.css("margin-top", 8);
					}
				}
				props["element"]= button.appendTo(uiPopupBtnUl);
				
				
				/*props = $.isFunction( props ) ?
					{ click: props, text: name } :
					props;
				var button = $('<button type="button"></button>')
					.click(function() {
						props.click.apply(self.element[0], arguments);
					})*/
					//.appendTo(uiButtonSet);
				// can't use .attr( props, true ) with jQuery 1.3.2.
				/*$.each( props, function( key, value ) {
					if ( key === "click" ) {
						return;
					}
					if ( key in attrFn ) {
						button[ key ]( value );
					} else {
						button.attr( key, value );
					}
				});
				if ($.fn.button) {
					button.button();
				}*/
			});
			if(uiPopupBtnUl.children().length > 0) {
				uiPopupFooter.appendTo(self.tmPopup).show();				
			}			
		}
	},
	
	_createCheckBox: function(checkbox){                		    
        var self = this,
            uiPopupFooter,
            hasCheckBox = false,
            titleId = self._id;
           
            if (typeof checkbox === 'object' && checkbox !== null) {
                $.each(checkbox, function() {
                    return !(hasCheckBox = true);
                });
            }else{
                return false;
            }            
            if(self.tmPopupFooter && self.tmPopupFooter.length>0){                
                if(self.checkBoxContainer){                    
                    self.checkBoxContainer.remove();
                }
                uiPopupFooter=  self.tmPopupFooter;
            }else{
                uiPopupFooter= (self.tmPopupFooter = $('<div></div>'))
				.addClass('ui-tmPopup-footer')
                .appendTo(self.tmPopup)
                .show();
            }            
            if(hasCheckBox){
                var label= (self.checkBoxLable= $('<label></label>'))
                    .attr("for", "tmPopupCheckBox_"+titleId);
                    
                if("lable" in checkbox && checkbox["lable"] != ""){                    
                    label.text(checkbox["lable"]);
                }
                var checkboxContainer= (self.checkBoxContainer= $('<div class="tmPopupCheckBoxContainer"></div>').append((self.checkbox= $('<input type="checkbox" id="tmPopupCheckBox_'+titleId+'" name="tmPopupCheckBox_'+titleId+'"/>'))))
                    .append(label);
                checkbox["element"]= checkboxContainer.appendTo(uiPopupFooter);
                /*self.checkbox.bind("click.ui-tmPopup-" + titleId,function(){
                        $(this).attr("checked");
                    }
                );*/
                if("click" in checkbox && typeof checkbox["click"] == "function"){
                    self.checkbox.bind("click.ui-tmPopup-" + titleId, 
                        function(){
                            checkbox["click"](self.checkbox);                           
                        }
                    );
                }
            }
	},
	_makeDraggable: function() {
	},

	_makeResizable: function(handles) {		
	},

	_minHeight: function() {
	},

	_position: function(position) {

		var myAt = [],
			offset = [0, 0],
			isVisible;

		if (position) {		
		
			if (typeof position === 'string' || (typeof position === 'object' && '0' in position)) {
			
				myAt = position.split ? position.split(' ') : [position[0], position[1]];
				if (myAt.length === 1) {
					myAt[1] = myAt[0];
				}

				$.each(['left', 'top'], function(i, offsetPosition) {
					if (+myAt[i] === myAt[i]) {
						offset[i] = myAt[i];
						myAt[i] = offsetPosition;
					}
				});

				position = {
					my: myAt.join(" "),
					at: myAt.join(" "),
					offset: offset.join(" ")
				};
				
			}
			
			position = $.extend({}, $.ui.tmPopup.prototype.options.position, position);
			
		} else {
		
			position = $.ui.tmPopup.prototype.options.position;
			
		}
		
		// need to show the tmPopup to get the actual offset in the position plugin
		isVisible = this.tmPopup.is(':visible');
		if (!isVisible) {
			this.tmPopup.css({visibility : "hidden"}).show();
		}
		this.tmPopup.position($.extend({ of: window }, position));		
		this.tmPopupBackground.css({
			top: parseInt(this.tmPopup.css("top"), 10) - 9,
			left: parseInt(this.tmPopup.css("left"), 10) - 9,
			visibility : "hidden"
		})			
		.show();	
		
		if (!isVisible) {
			this.tmPopup.hide().css({visibility : "visible"});
			this.tmPopupBackground.hide().css({visibility : "visible"});
		}else{
			this.tmPopup.css({visibility : "visible"});
			this.tmPopupBackground.css({visibility : "visible"});
		}
	},

	_setOptions: function( options ) {
		var self = this,
			resizableOptions = {},
			resize = false;
			
		$.each( options, function( key, value ) {
		
			self._setOption( key, value );
			
			if ( key in sizeRelatedOptions ) {
				resize = true;
			}
			if ( key in resizableRelatedOptions ) {
				resizableOptions[ key ] = value;
			}
		});

		if ( resize ) {
			this._size();
		}
		if ( this.tmPopup.is( ":data(resizable)" ) ) {
			this.tmPopup.resizable( "option", resizableOptions );
		}
	},

	_setOption: function(key, value){	
		var self = this,
			uiPopup  = self.tmPopup;
			
		switch (key) {
			//handling of deprecated beforeclose (vs beforeClose) option
			/*case "beforeclose":
				key = "beforeClose";
				break;*/
			case "buttons":
				self._createButtons(value);
            break;
            case "checkbox":
                self._createCheckBox(value);
            break;
				/*
			case "closeText":
				// ensure that we always pass a string
				self.uiDialogTitlebarCloseText.text("" + value);
				break;
			case "dialogClass":
				uiDialog
					.removeClass(self.options.dialogClass)
					.addClass(uiDialogClasses + value);
				break;*/
			case "disabled":
				if (value) {
					uiPopup.addClass('ui-dialog-disabled');
				} else {
					uiPopup.removeClass('ui-dialog-disabled');
				}
				break;
			/*case "draggable":
				var isDraggable = uiDialog.is( ":data(draggable)" );
				if ( isDraggable && !value ) {
					uiDialog.draggable( "destroy" );
				}
				
				if ( !isDraggable && value ) {
					self._makeDraggable();
				}
				break;*/
			case "fixPosition":					
				if(value === true){
					$(window).bind("resize.ui-tmPopup-" + self._id, function(){
						self._position( self.options.position);
					});
					$(window).bind("scroll.ui-tmPopup-" + self._id, function(){
						self._position( self.options.position);
					});
				}else{
					$(window).unbind("resize.ui-tmPopup-" + self._id); 
					$(window).unbind("scroll.ui-tmPopup-" + self._id); 
				}
			break;
			case "position":
				self._position(value);
			break;
			/*case "resizable":
				// currently resizable, becoming non-resizable
				var isResizable = uiDialog.is( ":data(resizable)" );
				if (isResizable && !value) {
					uiDialog.resizable('destroy');
				}

				// currently resizable, changing handles
				if (isResizable && typeof value === 'string') {
					uiDialog.resizable('option', 'handles', value);
				}

				// currently non-resizable, becoming resizable
				if (!isResizable && value !== false) {
					self._makeResizable(value);
				}
				break;*/
			case "title":
				// convert whatever was passed in o a string, for html() to not throw up
				self.tmPopupTitle.html("" + (value || '&#160;'));
				break;
			case "url":
				if(value && typeof value == 'string' && value.length > 0) {
					self._loaded= false;
					if(!self.tmPopupContentIframe){
						var uiPopupContentIframe= (self.tmPopupContentIframe = $('<iframe frameborder="0"></iframe>'))
						.addClass("ui-tmPopup-Content-Iframe")
						.attr(
							{
								role: 'iframe',
								name: "ui-tmPopup-Content-Iframe-" + self._id,
								id: "ui-tmPopup-Content-Iframe-" + self._id,
								src: value
							}
						)
						.bind("load",
							function(){
								self._loaded= true;
							}
						);
						
						if( self.options.openAfterLoaded === false){
							uiPopupContentIframe.appendTo(self.tmPopupContent);
						}
						self._hasIframe= true;
					}else{						
						self.tmPopupContentIframe
						.css({
							width: "auto",
							height: "auto"
						})
						.unbind("load")
						.bind("load", function(){
								self._loaded= true;
							}				
						)
						.attr("src", value);						
					}										
				}					
			break;
		}

		$.Widget.prototype._setOption.apply(self, arguments);
	},
	size: function(){
		var self = this;		
		self._size();
	},
	_size: function() {		
		/* If the user has resized the tmPopup, the .ui-tmPopup and .ui-tmPopup-content
		 * divs will both have width and height set, so we need to reset them
		 */		
		var options = this.options,
			nonContentHeight,
			minContentHeight,
			isVisible = this.tmPopup.is( ":visible" );		
		// reset content sizing
		if(this._hasIframe === true) {
			/*this.tmPopupContentIframe.css({
				width: "auto",
				height: "auto"
			})*/
			this.tmPopupContentIframe			
			.css({
				minHeight: options.minHeight,
				minWidth: options.minWidth,
				width: this.tmPopupContentIframe.contents().width(),
				height: this.tmPopupContentIframe.contents().height()
			});			
		}else if(this._hasDialog){
			/*this.tmPopupDialog.show().css({
				width: 'auto',
				minHeight: 0,
				height: 0
			});*/
			//tmp setting style
			this.tmPopupDialog.show();
		}
		
		this.tmPopupBackground.css({
			width: this.tmPopup.width() + 20,
			height: this.tmPopup.height() + 20
		});
		
		/*if (options.minWidth > options.width) {
			options.width = options.minWidth;
		}*/
		
		// reset wrapper sizing
		// determine the height of all the non-content elements
		/*nonContentHeight = this.tmPopup.css({
				height: 'auto',
				width: options.width
			})
			.height();
			
		minContentHeight = Math.max( 0, options.minHeight - nonContentHeight );*/
		/*		
		if ( options.height === "auto" ) {
			// only needed for IE6 support
			if ( $.support.minHeight ) {
				this.element.css({
					minHeight: minContentHeight,
					height: "auto"
				});
			} else {
				this.tmPopup.show();
				var autoHeight = this.element.css( "height", "auto" ).height();
				if ( !isVisible ) {
					this.tmPopup.hide();
				}
				this.element.height( Math.max( autoHeight, minContentHeight ) );
			}
		} else {
			this.element.height( Math.max( options.height - nonContentHeight, 0 ) );
		}

		if (this.tmPopup.is(':data(resizable)')) {
			this.tmPopup.resizable('option', 'minHeight', this._minHeight());
		}*/
	}
});

$.extend($.ui.tmPopup, {
	version: "1.0.01",
	uuid: 0,
	maxZ: 0,
	opened: false,
	_openPopup: null,	
	getOpenPopup: function() {
		return this._openPopup;
	},
	getTitleId: function($el) {
		var id = $el.attr('id');
		if (!id) {
			this.uuid += 1;
			id = this.uuid;
		}
		return 'ui-dialog-title-' + id;
	},

	overlay: function(popup) {
		this.$el = $.ui.tmPopup.overlay.create(popup);
	}
});

$.extend($.ui.tmPopup.overlay, {
	instances: [],
	// reuse old instances due to IE memory leak with alpha transparency
	oldInstances: [],
	maxZ: 0,
	events: $.map('focus,mousedown,mouseup,keydown,keypress,click'.split(','),
		function(event) { return event + '.tmPopup-overlay'; }).join(' '),
	create: function(popup) {
		if (this.instances.length === 0) {			
			// prevent use of anchors and inputs
			// we use a setTimeout in case the overlay is created from an
			// event that we're going to be cancelling
			setTimeout(function() {
				// handle $(el).tmPopup().tmPopup('close')
				if ($.ui.tmPopup.overlay.instances.length) {
					$(document).bind($.ui.tmPopup.overlay.events, function(event) {
						// stop events if the z-index of the target is < the z-index of the overlay
						// we cannot return true when we don't want to cancel the event
						if ($(event.target).zIndex() < $.ui.tmPopup.overlay.maxZ) {
							return false;
						}
					});
				}
			}, 1);
			
			// allow closing by pressing the escape key
			$(document).bind('keydown.tmPopup-overlay', function(event) {
				if (popup.options.closeOnEscape && event.keyCode && event.keyCode === $.ui.keyCode.ESCAPE) {					
					popup.close(event);
					event.preventDefault();
				}
			});

			// handle window resize
			$(window).bind('resize.tmPopup-overlay', $.ui.tmPopup.overlay.resize);
		}	
		
		var $el = (this.oldInstances.pop() || $('<div></div>').addClass('ui-tmPopup-overlay'))
			.appendTo(document.body)
			.css({
				width: parseInt(this.width(),10) - 4,
				height: parseInt(this.height(), 10) - 4,
				zIndex: popup.tmPopupBackground.css("zIndex") - 1
			});

		if ($.fn.bgiframe) {
			$el.bgiframe();
		}

		this.instances.push($el);
		return $el;
	},

	destroy: function($el) {
		var indexOf = $.inArray($el, this.instances);
		if (indexOf != -1){
			this.oldInstances.push(this.instances.splice(indexOf, 1)[0]);
		}

		if (this.instances.length === 0) {
			$([document, window]).unbind('.tmPopup-overlay');
		}

		$el.remove();
		
		// adjust the maxZ to allow other mask tmPopup to continue to work
		var maxZ = 0;
		$.each(this.instances, function() {
			maxZ = Math.max(maxZ, this.css('z-index'));
		});
		this.maxZ = maxZ;
	},

	height: function() {
		var scrollHeight,
			offsetHeight;
		// handle IE 6
		if ($.browser.msie && $.browser.version < 7) {
			scrollHeight = Math.max(
				document.documentElement.scrollHeight,
				document.body.scrollHeight
			);
			offsetHeight = Math.max(
				document.documentElement.offsetHeight,
				document.body.offsetHeight
			);

			if (scrollHeight < offsetHeight) {
				return $(window).height() + 'px';
			} else {
				return scrollHeight + 'px';
			}
		// handle "good" browsers
		} else {
			return $(document).height() + 'px';
		}
	},

	width: function() {
		var scrollWidth,
			offsetWidth;
		// handle IE 6
		if ($.browser.msie && $.browser.version < 7) {
			scrollWidth = Math.max(
				document.documentElement.scrollWidth,
				document.body.scrollWidth
			);
			offsetWidth = Math.max(
				document.documentElement.offsetWidth,
				document.body.offsetWidth
			);

			if (scrollWidth < offsetWidth) {
				return $(window).width() + 'px';
			} else {
				return scrollWidth + 'px';
			}
		// handle "good" browsers
		} else {
			return $(document).width() + 'px';
		}
	},

	resize: function() {
		/* If the tmPopup is draggable and the user drags it past the
		 * right edge of the window, the document becomes wider so we
		 * need to stretch the overlay. If the user then drags the
		 * tmPopup back to the left, the document will become narrower,
		 * so we need to shrink the overlay to the appropriate size.
		 * This is handled by shrinking the overlay before setting it
		 * to the full document size.
		 */
		var $overlays = $([]);
		$.each($.ui.tmPopup.overlay.instances, function() {
			$overlays = $overlays.add(this);
		});

		$overlays.css({
			width: 0,
			height: 0
		}).css({
			width: $.ui.tmPopup.overlay.width(),
			height: $.ui.tmPopup.overlay.height()
		});
	}
});

$.extend($.ui.tmPopup.overlay.prototype, {
	destroy: function() {
		$.ui.tmPopup.overlay.destroy(this.$el);
	}
});

}(jQuery));
