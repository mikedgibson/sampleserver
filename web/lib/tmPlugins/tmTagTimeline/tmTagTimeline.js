/*

Requirements: jquery, jquery-ui (draggable, slider), mousewheel

Tags:  		  <link rel="stylesheet" type="text/css" href="{PATH_TO}/tmTagTimeline.css">
			  <script src="{PATH_TO}/tmTagTimeline_data.js"></script>
			  <script src="{PATH_TO}/tmTagTimeline.js"></script>

Syntax:		  $("#tagCloud").tmTagTimeline(tmTagTimeline_data, {max_font_size: 5});

*/
(
	function ($) {
		$.extend($.fn, {				
			tmTagTimeline: function (data, setting) {
				//f (!setting) var setting = {};
				//if (!setting.max_font_size) setting.max_font_size = 5;

				var _target = $(this);
				$(data).each(function() {
					_target.append($("<div class='tmTagTimeline'></div>")
								.append("<div class='slider'></div>")
								.append($("<div class='movable'></div>")
									.append($("<div class='tmTagCloud'></div>")
										.append("<ul class='tagList'></ul>")
									)
								)
							);
					
					var array_freq = [];
					$(data.tags).map(function(i,dt){array_freq.push(dt.freq);});
					var min_fq = Math.min.apply( Math, array_freq );
					var max_fq = Math.max.apply( Math, array_freq );
					array_freq = [];
					$.each(data.tags, function(i, val) {
						var li = $("<li>");
						var vf = $("<div class='tag_vf'></div>");
						$("<span class='tag_freq'>"+val.freq+"</span>").appendTo(vf);
						$("<span class='tag_val'>" +val.tag+ "</span>").appendTo(vf);
						vf.appendTo(li);
						
						var pc = ( ( ( val.freq - min_fq ) / max_fq ) * 100 );
						var sz = parseInt((setting.max_font_size * pc / 100) + 1);
						$(".tag_val", li).css("fontSize", sz + "em");
						li.appendTo(".tagList", _target);
					});
				});
				$(".tmTagTimeline .slider", _target).slider({
					orientation: 'vertical',
					min: 0,
					max: 100,
					value: 100,
					change: function( event, ui ) {
						var helper = $(".movable", _target);
			        	var h = (helper.outerHeight() - helper.parent().outerHeight());
						var pos = -(h * (100-ui.value)/100);
						helper.animate({top: pos});
					}
				}).mousewheel( function(e, delta) {
                    $(this).slider("value", $(this).slider("value") + delta);
                    return false;
                });
			    $(".tmTagTimeline .movable", _target).draggable({
			    	axis: "y",
			    	scroll: true,
			        stop: function(event, ui) {
			            var helper = ui.helper, pos = ui.position;
			        	var h = -(helper.outerHeight() - helper.parent().outerHeight());
			            if (pos.top >= 0) {
			            	helper.animate({ top: 0 });
			            } else if (pos.top <= h) {
			            	helper.animate({ top: h });
			            }
			        }
		    	 });
			}
		});
	}
)(jQuery);