(
	function ($) {
		$('.tmTabClose').live("click", function(){
			if (confirm("Do you really wish to remove this tab?")) {
				var t_nav_id = $(this).parent().parent().parent().attr("id");
				var t_tabs_id = t_nav_id.replace("nav","pages");
				var tab = $(this).parent().prev(".tmTab").attr("tab");
				$(this).parent().parent().remove();
				$("#" + t_tabs_id + " > #"+tab).remove();
				$("#" + t_nav_id + " > li > .tmTab").first().trigger("click");
			}
			return false;
		});
		$('.tmTab').live("click", function() {
			var t_nav_id = $(this).parent().parent().attr("id");
			$('#' + t_nav_id + ' > li').removeClass('active');
			$(this).parent().addClass('active');
	
			var tab = $(this).attr("tab");
			var t_tabs_id = t_nav_id.replace("nav","pages");
	
			$("#" + t_tabs_id + " > .tabbed_page").hide();
			$("#" + t_tabs_id + " > #"+tab).show();
			return false;
		});

		$(".widget_container").sortable({
			placeholder: "widget_placeholder",
			handle: ".w_tp",
			opacity: 0.7
		});
		$( ".w_tp" ).disableSelection();

		$(document).ready(function () { 
			$('.tmTab').first().click();
		});

	}
	
)(jQuery);