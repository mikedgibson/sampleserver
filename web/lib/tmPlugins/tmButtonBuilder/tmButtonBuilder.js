// JavaScript Document
(
	function ($) {
		$.extend($.fn,
			{
				visualRadios: function (setting) {
					var _target = $(this);
					var _thebox = '<span class="visual_radios"></span>';
					var _thelist = '';
					$(setting.options_list).each(
						function(id, option_item)
						 {
						 	var _selected_option_1 = "";
							var _selected_option_2 = "";
							if (setting.selected_option==id) {
								_selected_option_1 = " label_selected";
								_selected_option_2 = " checked";
							}
							_thelist = _thelist + '<label id="label_'+option_item.id_name+'" for="'+option_item.id_name+'" class="'+option_item.class_name+_selected_option_1+'">&nbsp;</label>' +
										'<input type="radio" name="'+setting.list_name+'" id="'+option_item.id_name+'" value="'+option_item.option_value+'" '+_selected_option_2+' />';
						}
					);
					_target.append($(_thebox).append(_thelist));
					$('label', _target).bind('click', 
						function(e) {
							$('label', _target).removeClass("label_selected");
							$(this).addClass("label_selected");
						}
					);
				},
				buttonBuild: function (setting) {
					return this.each(
						function(){
							var that= $(this);							
							function _setImage(obj){								
								if(setting.image && setting.image.src!=""){	
									obj.children().removeData().remove();
									obj.removeClass('btn_name');
									if(setting.image.align=='right'){
										var _content_image= $('<span class="btn_name btn"></span><img class="btn" src="'+setting.image.src+'" style="vertical-align:middle; margin-left:5px;"/>');
																		
									}else{
										var _content_image= $('<img src="'+setting.image.src+'" class="btn" style="vertical-align:middle;float:left; margin-right:5px;"/><span class="btn_name btn"></span>');										
									}
									obj.append(_content_image);	
									that.data('image',setting.image.src);
									if(setting.image.disabled){
										that.data('disabled_image',setting.image.disabled);
									}else{
										that.data('disabled_image',setting.image.src);
									}
									that.data('has_image',true);
								}else{	
									if(that.data('has_image')==true){
									}else{
										obj.addClass('btn_name');
									}
								}		
							}
							function _setButtonName(_obj){			
								if(setting && setting.name){
									_obj.html(setting.name);
									that.data('btn_name',setting.name);
								}else{
									if(!that.data('btn_name')){
										_obj.html(that.attr("id"));		
									}else{
										_obj.html(that.data('btn_name'));		
									}
								}
							}
							function _clickEventHandler(){
								if(setting && setting.click){									
									if(that.data('has_drop_down_list') != true){										
										that
										.data('event',setting.click)
										.unbind('click',that.data('event'))
										.bind('click',that.data('event'))
										// bind space and return to same event as click										
										.unbind('keydown')
										.bind('keydown',function (e) {
											if (e.which === 13 || e.which === 32) {
												that.data('event')(e);
											}
										});
									}									
								}
							}
							function _mouseEnter(){
								that
								.addClass(that.data('mode')+'_hover')
								.find('span:not(.button_has_child)')
								.addClass(that.data('mode')+'_hover');										
							}
							function _mouseleave(){
								that
								.removeClass(that.data('mode')+'_hover')
								.find('span:not(.button_has_child)')
								.removeClass(that.data('mode')+'_hover');	
								that
								.removeClass(that.data('mode')+'_actived')
								.find('span:not(.button_has_child)')
								.removeClass(that.data('mode')+'_actived');	
							}
							function _mouseDown(){							
								if(!that.is("."+that.data('mode')+'_disabled')){
									that
									.addClass(that.data('mode')+'_actived')
									.find('span:not(.button_has_child)')
									.addClass(that.data('mode')+'_actived');	
								}
							}
							function _mouseUp(){
								that
								.removeClass(that.data('mode')+'_actived')
								.find('span:not(.button_has_child)')
								.removeClass(that.data('mode')+'_actived');	
							}
							function _disabledButton(){							
								if(setting && setting.disabled){									
									that
									.data("status", "disabled")
									.removeClass(that.data('mode')+'_hover')
									.addClass(that.data('mode')+'_disabled')									
									.unbind("click",that.data('event'))									
									.children()
									.addClass(that.data('mode')+'_disabled');									
									if(that.data('has_image') == true){
										that.find('img').attr('src',that.data('disabled_image'));										
									}
								}else if(setting && setting.disabled == false){
									that
									.data("status", "enabled")
									.unbind('click',that.data('event'))	
									.removeClass(that.data('mode')+'_disabled')
									.bind(
										{
											"mouseenter": _mouseEnter,
											"mouseleave": _mouseleave
											
										}
									)
									.children()
									.removeClass(that.data('mode')+'_disabled');									
									if(that.data('event')){
										that.bind('click',that.data('event'))
									}									
									if(that.data('has_image') == true){
										that.find('img').attr('src',that.data('image'));
									}
								}
							}				
							function _toggleEventHandler(on_handler, off_handler){
								$('.left_sensor, .right_sensor', that).bind('click',
									function(e){
										if($(this).is('.right_sensor')){
											off_handler();
											$(this).parent().find('.toggle_button_sensor').animate({'left':31},{queue:false, duration:300}).addClass('off');
										}else{
											on_handler();
											$(this).parent().find('.toggle_button_sensor').animate({'left':0},{queue:false, duration:300}).removeClass('off');	
										}
									}
								);
							}
							function setDropDownList(_dropdownlist,_container){
								_container.addClass('tab').append($('<span class="button_has_child tab btn">&nbsp;&nbsp;</span>'));
								that								
								.addClass('tab')
								.css('position','relative')
								.dropDownList(
									_dropdownlist
								)
							}
							var _has_span= that.find('span.button_content');						
							if(_has_span.length>0){									
								if(setting.mode && setting.mode != that.data('mode')){
									console.log('Can not change the button mode after initialized!');
									return false;
								}
								if(that.data('mode')=='toggle'){
									
								}else{
									_setImage(_has_span);
									if(_has_span.is('.btn_name')){
										_setButtonName(_has_span);
									}else if(_has_span.find('.btn_name').length>0){
										_setButtonName($('.btn_name',_has_span));
									}
									if(setting.drop_down_list && setting.drop_down_list != null && setting.drop_down_list.children.length>0){
										that
										.data('has_drop_down_list',true)
										.unbind('click')
										.find('ol.drop_down_menu, span.button_has_child')
										.remove();
										setDropDownList(setting.drop_down_list,_has_span);
									}else if(setting.drop_down_list == false){										
										that
										.data('has_drop_down_list',false)
										.unbind('click')
										.find('ol.drop_down_menu, span.button_has_child')
										.remove();
									}else{										
										_clickEventHandler();
									}									
									_disabledButton();									
								}
							}else{							
								if(setting.mode){
									that.addClass(setting.mode).data('mode',setting.mode);
								}else{
									that.addClass('medium').data('mode','medium');
								}								
								if(that.data('mode') == "toggle"){
									var _toggle_title= setting.name?setting.name:that.attr('id');
									that.addClass('tm_button button_toggle').append(
										'<span class="toggle_button_title">'+_toggle_title+':</span><span class="left_sensor switch_on">ON</span><span class="toggle_button_container button_content"><span class="left_sensor"></span><span class="right_sensor"></span><span class="toggle_button_sensor"></span></span><span class="right_sensor switch_off">OFF</span>');
									var toggle_on= function(){ return false;}
									var toggle_off= function(){ return false;}
									if(setting.on) {
										toggle_on = setting.on;
									}
									if(setting.off) {
										toggle_off = setting.off;
									}
									_toggleEventHandler(toggle_on, toggle_off);
								}else{
									var _button_content= $('<span class="button_content btn"></span>');						
									_setImage(_button_content);
									
									that
									.append(_button_content)
									.addClass('tm_button btn')
									.bind(
										{
											"mouseenter": _mouseEnter,
											"mouseleave": _mouseleave,
											"mousedown": _mouseDown,
											"mouseup": _mouseUp
										}
									);
									if(_button_content.is('.btn_name')){
										_setButtonName(_button_content);
									}else{										
										var buttonLabel= _button_content.find('.btn_name');
										if(buttonLabel.length>0)									
											_setButtonName(buttonLabel);										
									}
									if(setting && setting.popupWin) {
										that.popupWin(setting.popupWin);
									}
									else if(setting.drop_down_list && setting.drop_down_list != null && setting.drop_down_list.children.length>0){
										that.data('has_drop_down_list',true);
										setDropDownList(setting.drop_down_list,_button_content);										
									}else{
										that.data('has_drop_down_list',false);
										_clickEventHandler();
									}
									_disabledButton();
								}
							}
						}  
					);
				}
			}
		);
	}
)(jQuery);
