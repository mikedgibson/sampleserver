// JavaScript Document
(
	function ($) {
		$.extend($.fn,
			{
				maxZIndex: function(opt){
					 var def = { inc: 2, group: ".drop_down_menu" };
					 var zmax = 0;
					 $(def.group).each(function() {
						var cur = parseInt($(this).css('z-index'));
						zmax = cur > zmax ? cur : zmax;
					 });
					 
					 if (!this.jquery)
						return zmax;
						
					return this.each(function() {
						zmax += def.inc;
						$(this).css("z-index", zmax);
					});
				}
			}
		);
		$.extend($.fn,
			{
				dropDownList: function (setting) {
					return this.each(
						function(){							
							var _target= $(this);
							function _addDropDownMenu(lists,target){						
								var _drop_down_menu= $('<ol class="drop_down_menu"></ol>');
								$(lists).each(
									function(index,li){
										if(li.title!='' && li.status == 'show'){
											var _new_drop_down_list = $('<li></li>')
													.attr('title', li.title)
													.append($('<span></span>').text(li.title))
													.appendTo(_drop_down_menu);	
											if(li.url != null){
												_new_drop_down_list.bind('click',
													function(){												
														document.location.href= li.url;
														return false;
													}						 
												);
											}
											if(li.click) {								
												target.data('click_event',li.click);									
												_new_drop_down_list.bind('click',target.data('click_event'));											
											}
											if(li.children.length>0){
												_new_drop_down_list.addClass('have_child').find('span:eq(0)').addClass('category');
												if(lists.length-1 == index){
													_new_drop_down_list.addClass('last_list');
												}
												_add_sub_list(li.children,_new_drop_down_list);
											}else{
												_new_drop_down_list.hover(
													function(e){
														_drop_down_menu.find('li').removeClass('list_hover');
														$(this).addClass('list_hover');
													},
													function(e){
														$(this).removeClass('list_hover');
													}
												)									
											}	
										}
									}
								);						
								_drop_down_menu.find('li').length > 0? target.append(_drop_down_menu): '';
								var _list_tmp= target.find('li');
								_list_tmp.eq(_list_tmp.length-1).addClass('radius');
							}
							function _add_sub_list(lists,target){
								var _new_sub_list_container= $('<ol class="sub_list"></ol>');
								$(lists).each(
									function(index, li) {
										if(li.title!='' && li.status == 'show'){
											var _new_sub_list= $('<li></li>')
													.attr('title', li.title)
													.append($('<span></span>').text(li.title))
													.appendTo(_new_sub_list_container);
											if(li.url != null){
												_new_sub_list.bind('click',
													function(){												
														document.location.href= li.url;
														return false;
													}						 
												);	
											}
											if(li.children.length>0){
												_new_sub_list.addClass('have_list').find('span').addClass('category').end().toggle(
													function(){												
														$(this).addClass('cate_selected').find('ol.sub_list').slideDown();											
													},
													function(){
														$(this).removeClass('cate_selected').find('ol.sub_list').slideUp();
													}
												);
												_add_sub_sub_list(li.children,_new_sub_list);
											}else{
												_new_sub_list
												.hover(
													function(e){
														_new_sub_list_container.find('li').removeClass('list_hover');
														$(this).addClass('list_hover');
													},
													function(e){
														$(this).removeClass('list_hover');
													}
												)
											}
										}
									}
								);
								_new_sub_list_container.find('li').length > 0? target.append(_new_sub_list_container): '';
							}
							function _add_sub_sub_list(lists,target){
								var _new_sub_sub_list_container= $('<ol class="sub_list"></ol>').hide();
								$(lists).each(
									function(index, li) {
										if(li.title!='' && li.status == 'show'){
											var _new_sub_sub_list= $('<li></li>').attr('title', li.title).append($('<span></span>').text(li.title)).appendTo(_new_sub_sub_list_container);
											if(li.url != null){
												_new_sub_sub_list.bind('click',
													function(){												
														document.location.href= li.url;
														return false;
													}						 
												);	
												_new_sub_sub_list
												.hover(
													function(e){
														_new_sub_sub_list_container.find('li').removeClass('list_hover');
														$(this).addClass('list_hover');
													},
													function(e){
														$(this).removeClass('list_hover');
													}
												)
											}
										}
									}
								);
								_new_sub_sub_list_container.find('li').length > 0? target.append(_new_sub_sub_list_container): '';
							}				
							function show(e){									
								var _drop_down_menu= _target.find('.drop_down_menu');			

								if($(e.target).is('.list_container') 
										|| $(e.target).is('.dd_link') 
										|| $(e.target).is('.tab_link') 
										|| $(e.target).is('.tab') 
										|| $(e.target).is('.btn')){			
									if(_target.data("setDropWidth") == false){
										_drop_down_menu.css({'display':'block','visibility':'hidden'})
										.maxZIndex();
										var _widthArr= new Array();
										_drop_down_menu.find("li").each(
											function(index,li){
												_widthArr.push(li.offsetWidth)
											}
										);
										var _maxWidthArr = Math.max.apply( Math, _widthArr );
										if(_target.width() < _maxWidthArr){
											_drop_down_menu.css({'width': _maxWidthArr,'position':'absolute','display':'none', 'visibility':'visible'});
										}else{										
											_drop_down_menu.css({'width': _target.width(),'position':'absolute','display':'none', 'visibility':'visible'});
										}
										_target.data("setDropWidth",true);
									}
									_drop_down_menu							
									.fadeOut('fast')									
									.css({'filter':'progid:DXImageTransform.Microsoft.Gradient(startColorStr="#FFFFFF", endColorStr="#dddddd", gradientType="0")','z-index':500})
									.slideDown(300,function(){
										$(this)
										.css({'filter':'progid:DXImageTransform.Microsoft.Gradient(startColorStr="#FFFFFF", endColorStr="#dddddd", gradientType="0")','z-index':500});
									});
								}else{
									_target.removeClass('hover').find('a:eq(0)').removeClass('hover').end().find('.drop_down_menu').fadeOut(100);
								}
							}
							function hide(e){
								_target.removeClass('hover').find('a:eq(0)').removeClass('hover').end().find('.drop_down_menu').fadeOut(100);
							}
							function disableHide(e){
								  hide(e);
								  _target
								  .unbind('mouseenter',show)
								  .unbind('mouseleave',disableHide);
								  _target.bind('click',setShowHandler);
							}
							function setShowHandler(e){								
								show(e);
								_target			
								.bind('mouseenter',show)
								.bind('mouseleave',disableHide)
								.unbind('click',setShowHandler);
							}
							if(setting && setting.children.length > 0){
								_target.data("setDropWidth",false);
								_addDropDownMenu(setting.children,_target);								
								if(setting.display_by == 'click'){									
									_target.bind('click',setShowHandler).data("event",setShowHandler);
								}else if(setting.display_by == 'hover'){
									_target.hover(show,hide);
								}else{
									_target.hover(show,hide);
								}
							}	
						}
					);			
				}
			}
		);
	}
)(jQuery);
