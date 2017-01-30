// JavaScript Document
//	$("#status_bar").addStatusBarTask("Updating 13 Computers...", function(){alert("hi")});
//	$("#status_bar").addStatusBarAlert("(3)", "danger", function(){alert("hi")});
//	$("#status_bar").addStatusBarAlert("(2)", "warn", function(){alert("hi")});
//	$("#status_bar").addStatusBarTask();
//	$("#status_bar").addStatusBarAlert();

(
	function ($) {
		$.extend($.fn, {
			addStatusBarTask: function(id, text, cb) {
				var _that = this;
				$("#sb_tasks",_that).prepend(
					$('<a class="sb_task" href="#" id="sb_task_'+id+'" title="'+text+'"></a>')
						.append(
							$('<div class="sb_text">'+text+'</div>').bind("click", function() {cb();return false;})
						)
						.bind("click", function(){ return false;})
				);
				//$(_that).resizeStatusBarTasks();
			},
			removeStatusBarTask: function(id) {
				var _that = this;
				if (!id) {
					$("#sb_tasks .sb_task",_that).remove();
				} else {
					$("#sb_task_"+id, _that).remove()
				}
				//$(_that).resizeStatusBarTasks();
			},
			resizeStatusBarTasks: function() {
				var _that = this;
				var sbt = $(".sb_task",_that);
				sbt.css("width", 100/sbt.length -2 + "%");
				var sbtwidth = (sbt.outerWidth() - 50);
				if (sbtwidth < 0) sbtwidth = 0;
				$(".sb_text",_that).css("width", sbtwidth + "px");
			},
			addStatusBarAlert: function(text, status, cb) {
				if (!text) {
					$("#sb_alerts .sb_alert",this).remove();
					return false;
				}
				var colors = ["red", "yellow", "green"];
				switch(status){
					case "danger": status = 0; break;
					case "warn": status = 1; break;
					default: status = 2;
				}
				$("#sb_alerts",this).append(
					$('<div class="sb_alert"><div class="sb_alert_status" style="background-color:'+colors[status]+';"></div>'+text+'</div>').bind("click", function() {cb();return false;})
				);
			},
			statusBar: function () {
				var setting = tmStatusBar_data.OPTIONS;
                var _status_bar = $('<div id="status_bar_container"></div>');
                _status_bar.appendTo("body");

				var _links = "";
				if(setting && setting.links) {
					$(setting.links).each(function(i, item) {
						if (item.visibility == 'hide') return;

						_links += '<div id="'+item.id+'" class="status_bar_item collapsable">';
						if (item.popup_content) {
							_links += '<span class="status_bar_popup_item icon_arrow_up">'+item.link+'</span><div class="status_bar_popup_content">'+item.popup_content+'</div>';
						} else {
							_links += '<span>'+item.link+'</span>';
						}
						_links += '</div>';
					});
				}

				var _the_html;
				var _the_alignment = (tmStatusBar_data.ALIGN == 'left' ? 'left':'right');
				_the_html = '<div id="status_bar" class="sb_'+_the_alignment+'"><div class="status_bar_body">'+
							'<div class="status_bar_content"><div class="status_bar_close"></div><div>';

				_the_html += '<div id="sb_tasks"></div>';

				if (tmStatusBar_data.SHOW_ALERTS == true) {
					_the_html += '<div class="status_bar_item" id="sb_alerts"><span class="sb_alerts_title">Alerts</span></div>';
				}

				var	_arrow_width = 17;
				if (tmStatusBar_data.SHOW_LOGO == true) {
					_the_html += '<div id="status_bar_logo"></div>';
					_arrow_width = 55;
				}
        if (tmStatusBar_data.TITLE) {
					_the_html += '<span class="status_head"><span class="status_bar_title">'+tmStatusBar_data.TITLE+'</span></span>';
        }
				
        _the_html += '</div>';

        if (tmStatusBar_data.COPYRIGHT) {
							_the_html += '<div class="collapsable status_bar_item status_bar_copyright">'+
													 '<span class="collapsable">'+tmStatusBar_data.COPYRIGHT+'</span></div>';
				}
				_the_html += _links+'</div></div></div>';

				_status_bar.html(_the_html);
				
				$(window).bind('resize scroll', function() {
					setCloseBtn("resize");
				});
				$('.status_bar_close', _status_bar).bind('click', function (e,option) {
					if ($(this).data("eventinprocess")) return;
					$(this).data('eventinprocess',1);
					var that = $(this);
					var animationspeed = 200;
					if (!option) {
						option = (_status_bar.data('closed')) ? 'open' : 'close';
					} else if (option == "resize") {
						if (_status_bar.data('closed')) return;
						option = "open";
						animationspeed = 0;
					} else {
						animationspeed = 0;
					}
					if (option == 'open') {
						_status_bar
							.removeClass("close_width")
							.data('closed',false)
							.find('#sb_tasks').show()
							.find('.status_bar_title').show()
							.find('collapsable').show();
						$("#status_bar", _status_bar).stop().animate({width:$(window).width()-50},animationspeed*1.25,'linear', function() {
							that.data('eventinprocess',0);
						});
						document.cookie="statusbarcollapsed=0; path=/;";
						// $(".splitter").css("height", $(".splitter").height()-30);
					} else if (option == 'close') {
						_status_bar
							.addClass("close_width")
							.data('closed',true)
							.find('#sb_tasks').hide()
							.find('.status_bar_title').hide()
							.find('collapsable').hide();
						$("#status_bar", _status_bar).stop().animate({width:_arrow_width},(animationspeed),'linear',function(){
							that.data('eventinprocess',0);
						});
						document.cookie="statusbarcollapsed=1; path=/;";
						// $(".splitter").css("height", $(".splitter").height()+30);
					}
				});
				$('span.status_bar_popup_item', _status_bar).parent().bind('click', function(e){
					status_bar_popup($(this), "show");
				});
				$('span.status_bar_popup_item', _status_bar).parent().bind('mouseleave', function(){
					status_bar_popup($(this), "hide");
				});
				function status_bar_popup(e, state) {
					var _link = $('span.status_bar_popup_item', e);
					var _popup = _link.next();
				 	var will_hide = (state == "hide");
					// only hide if visible
					if (will_hide && !_popup.is(':visible')) return;
				 	
					_link.toggleClass("icon_arrow_up", will_hide).toggleClass("icon_arrow_down", !will_hide)
					e.toggleClass("status_bar_item_selected", !will_hide);

					var mleft = -(_popup.outerWidth()-e.innerWidth()-1);
					_popup.css('bottom',e.outerHeight()).css('margin-left',mleft);
					if (will_hide) {
						_popup.hide();
					} else {
						_popup.slideDown('fast');
					}
				}
				function setCloseBtn(option) {
					if (!option) option = "open";
					$('.status_bar_close',_status_bar).trigger('click',option);
				}

				var cook = document.cookie.split(';');
				var statusState = "open";
				for(var i=0;i < cook.length;i++) {
					while (cook[i].charAt(0)==' ') {
						cook[i] = cook[i].substring(1,cook[i].length);
					}
					if (cook[i].indexOf("statusbarcollapsed=1") == 0) {
						statusState = "close";
						break;
					}
				}
				
				setCloseBtn("resize");
			}
		});
		
		$(document).ready(function () { 

			$(document).statusBar();
			//$(window).resize(function() {
			//	$("#status_bar").resizeStatusBarTasks();
			//});
			
		});
		
	}
)(jQuery);
