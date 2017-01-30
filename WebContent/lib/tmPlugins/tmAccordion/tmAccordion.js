// Dependicies: jquery.hashchange.js
(
	function ($) {

		hash_processing = false;
		$(".tm_accordion_1 > li > a, .tm_accordion_1 > li > div").live("click", function(){
				if(false == $(this).next().is(':visible')) {
						$('.tm_accordion_1 > ul').slideUp(300);
				}
				$('.tm_accordion_1 > li > a').removeClass("selected").next().slideUp(300);
				$('.tm_accordion_1 > li > div').removeClass("selected").next().slideUp(300);
				$(this).next().slideToggle(300);
				$(this).addClass("selected");
		});
		$(".tm_accordion_1 > li a, .tree_accordion li > a").live("click", function () {
/*			var sub_item = $(this).parent("ul.sub_item");
			if (sub_item.length > 0) {
				console.log(sub_item.prev());
			}*/
			var href = $(this).attr('href');
			var is_hash_url = (href.length > 1 && !(0 === href.indexOf( "#" )) );
			if ( is_hash_url && !hash_processing ) {
				var hash_id = $(this).attr( 'href' );
				location.hash = hash_id;
				hash_processing = true
			}
			hash_processing = false;
		});

		if ($.fn.hashchange) {  
			$(window).hashchange( function(){
				if (!hash_processing) {
					var href = location.hash;
					var is_hash_url = (href.length > 1 && 0 === href.indexOf( "#" ));
					var el = $('a[href="'+location.hash.replace( /^#/, '' )+'"]');
					if ( !is_hash_url || !$(el)[0] ) {
						if ($('.tree_accordion').length > 0) {
							el = $('.tree_accordion li a:not([href^="#"])');
						}
						if ($('.tm_accordion_1').length > 0) {
							el = $('.tm_accordion_1 > li > a:not([href^="#"])');
						}
					}
					if ( $(el)[0] ) {
						$(el)[0].click();
					}
				}
			});
		}
		$(".tree_accordion li.tree_opened > a, .tree_accordion li.tree_closed > a").live("click", function () {
			 $(this).next().animate({
				height: 'toggle', opacity: 'toggle'
			}, "fast");
			$(this).parent().toggleClass("tree_closed");
			$(this).parent().toggleClass("tree_opened");
			var href = $(this).attr("href");
			return (href && href != "#" && href != "");
		});

		function fn_toggle_view(_link, _panel, _is_visible) {
			if (_is_visible) {
				_link.removeClass("selected")
				_panel.hide();
			} else {
				_link.addClass("selected")
				_panel.show();
			}
		}

		$(".link_toggle_view").live("click", function(event) {
			event.preventDefault();
			var _el = $( "div[toggle_for="+$(this).attr("id")+"]" );
			var _is_visible = _el.is(':visible');
			var _container = _el.closest(".link_toggle_view_container");
			fn_toggle_view($(this), _el, _is_visible);
		});

		$(".single_toggle_view").live("click", function(event) {
			event.preventDefault();
			var _el = $( "div[toggle_for="+$(this).attr("id")+"]" );
			var _is_visible = _el.is(':visible');
			fn_toggle_view($(this), _el, _is_visible);
		});
		$(".checkbox_toggle_view").live("change", function(event) {
			event.preventDefault();
			var _el = $( "div[toggle_for="+$(this).attr("id")+"]" );
			var _is_visible = $(this).is(':checked');
			fn_toggle_view($(this), _el, !_is_visible);
		});

		$(".radio_toggle_view").live("change", function() {
			$(".sub_toggle_view[toggle_for_name="+$(this).attr("name")+"]").hide();
			$( "div[toggle_for="+$(this).attr("id")+"]" ).show();
		})
		.live("click", function() { $(this).trigger("change"); })
		.live("keyup", function() { $(this).trigger("change"); });
		
		$(".select_toggle_view").live("change", function() {
			$(".sub_toggle_view[toggle_for_name="+$(this).attr("name")+"]").hide();
			$( "div[toggle_for="+$("option:selected", this).attr("id")+"]" ).show();
		})
		.live("click", function() { $(this).trigger("change"); })
		.live("keyup", function() { $(this).trigger("change"); });

		$(document).ready(function () { 
			$(".tree_accordion li a").prepend('<span class="tree_leaf">&nbsp;</span>');
			$(".tree_accordion li:last-child").css("background","none");
			$(".link_toggle_view:first", ".link_toggle_view_container").click();
			$(".radio_toggle_view:first").click();
			$(".select_toggle_view:first").click();
			$(".single_toggle_view").click();

			hash_processing = false;
			if ($.fn.hashchange) {
				$(window).hashchange();
			}
			$("#content_iframe").load(function() {
//				$('.tm_accordion_1 > li:eq(0) > a').click();
//				$('.tm_accordion_1 > li:eq(0) > div').click();
			});

		});

	}
)(jQuery);
