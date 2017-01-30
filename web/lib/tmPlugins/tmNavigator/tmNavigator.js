// JavaScript Document
(
	function ($) {
		$.extend($.fn,{				
			tmNavigator: function (setting) {
				return this.each(
					function(){
						var _target= $(this);
						_target.data('selected_index',1);
						_target.data('hover_selected_index',null);
						function _addMenu(lists){
							var _new_list= $('<ul></ul>').appendTo(_target);
							$(lists).each(
								function(index,li){
									var _list_item= $('<li id="tab_'+li.id+'"></li>')
									.addClass('tab')
									.bind('mouseover',
										function(e){
											if($(e.target).is('.tab_link') || $(e.target).is('.tab')){													
												$(this).addClass('hover').find('a:eq(0)').addClass('hover');
											}else{
												$(this).removeClass('hover').find('a:eq(0)').removeClass('hover');
											}
										}
									).bind('mouseout',
										function(e){										
											$(this).removeClass('hover').find('a:eq(0)').removeClass('hover');
										}
									);					
									if(li.title!='' && li.status == 'show'){
										if(li.url != null){												
											_list_item.append($('<a class="tab_link"></a>').text(li.title).attr('href', li.url));
										}else{
											var alink= $('<a class="tab_link" href="javascript:void(0);"></a>').text(li.title);
											if(li.click){							
												_list_item.bind("click",li.click);
											}	
											_list_item.append(alink);
										}
									}else if(li.status == 'hide'){
										_list_item.css('display','none');
									}
									if(li.children.length>0){
										if($.fn.dropDownList){
											_list_item.dropDownList(
												 { children: li.children }
											);
										}											
									}
									_list_item.appendTo($('ul', _target));
								}
							);
						}
						function _tab_select(index){
							_target.find('li.tab').removeClass('selected');
							_target.find('li.tab#tab_'+index).addClass('selected');
							$('li > a', _target).bind('click',
								function(){if(this.href){document.location.href= this.href;}}
							)
							$('li.tab.selected > a',_target).unbind('click').bind('click',function(){ return false; });
						}
						function _changeSelect(){
							if(setting.tab_selected){
								_target.data('selected_index',setting.tab_selected);
								_tab_select(setting.tab_selected);
							}else{							
								_tab_select(_target.data('selected_index'));
							}
						}							
						if(setting.data && setting.data.children.length > 0){
							_addMenu(setting.data.children);
						}
						_changeSelect();
					}
				);
			}
		});
	}
)(jQuery);
