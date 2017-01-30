/*! Copyright (C) 2012 Trend Micro Inc. All rights reserved. */

/*!JSA-Requires:ui1.js */

//---------------------------------
// Global Vars
//---------------------------------
var __isInit = false;
var __isPostable = true;
var __isPosted = false;
var __rpcAfterPost = false;
var __customOnBeforeUnload = null;

//---------------------------------
//Global jQuery settings
//---------------------------------

//Set ajax to not cache or we get stale documents on some browsers
// and set the timeout to 30 seconds
$.ajaxSetup({ 
	cache: false, 
	timeout: 60000 
	});

//Bind content from a given screen(let) to a div (or any element by ID)
// Always async
function loadScreen(screenName, query, htmlID, callback) {
	// This is the old way
	//rpc('Screen', 'screenName='+screenName+'&htmlID='+htmlID+'&'+query, rpcHTMLCB);

	// This is the new jQuery way
	// It skips the ScreenBean in the rpc package
	window.setTimeout(function () {
		if (query == null)
			query = "";
		var rID = "";
		if ($('#rID').length > 0)
			rID = $('#rID').val();
		$('#' + htmlID).load(screenName + ".screen?" + query + (query.length > 0 ? "&" : "") + "rID=" + rID  , new function() {
			if (callback != null) {
				try { 
					callback();
				} catch (e) {
					dsmErrorLog(e);
				};
			}
		});
	
	},1);
}

//---------------------------------
//sID functions
//---------------------------------

function getSID() {
	// The value is quoted for tenant sIDs and $.cookie does not remove the quotes like the server-side
	// cookie function does. 
	return $.cookie("sID").replace(/"/g,"");
}

//---------------------------------
//navigation functions
//---------------------------------

// Navigates the main application frame to the given AREA
// e.g #policies_firewallRules or #alerts of #administration_tenants
// You can get the AREA from the url bar, but the better way is to use 
// the MenuFactory to transform a ScreenPAth 
function navigateTo(area, queryString) {
	try {
		var ot = window;
		while (ot.opener!=null) {ot = ot.opener.window;}
		if (ot.top.isApplicationFrame)
			ot.top.fillUnencoded(area, queryString);
	} catch (e) {
		dsmErrorLog(e);
	}		
}
//With the given HEX encoded query string. The encoding only applies
//to screens with a split-panel view.
function navigateToEncoded(area, encodedQueryString) {
	try {
		var ot = window;
		while (ot.opener!=null) {ot = ot.opener.window;}
		if (ot.top.isApplicationFrame)
			ot.top.fill(area, encodedQueryString);
	} catch (e) {
		dsmErrorLog(e);
	}	
}

//---------------------------------
//Debug functions - these are now set in JSAServlet
//---------------------------------
//function dsmErrorLog(e) {
//	if (document.all) {} // DEV_MODE_ONLY
//	else {setTimeout(function() {throw e;}, 50);} // DEV_MODE_ONLY
//}
//
//var dsmTrace = function () {} ;
//if (window.console != undefined) { dsmTrace = function() {if (console.log && console.log.apply) console.log.apply(console, arguments);} } // DEV_MODE_ONLY

//---------------------------------
// Form Control functions
//---------------------------------

// Post a command and arguments
function post(command, arguments) {
	// Don't allow posts until the page is fully loaded or we might end up with partial data
	if (!__isInit)
		return false;
	if (!__isPostable)
		return false;
	if (__isPosted)
		return false;
	var theform = document.mainForm;
	theform.command.value = command;
	if (arguments!=null) 
		theform.cmdArguments.value = arguments;
	
	// Mark this instance as posted, further postings will not be allowed. This enforces IE to work like Firefox. 
	// Mark before we call the submit so that the onload command can use this marker to know it's not navigating away
	// Exclude EXPORT and GENERATE as these commands return export content and the page should still remain postable
	if (command != "EXPORT" && command != "GENERATE")
		__isPosted = true;

	theform.submit();
	return true;
}

// Can post returns true if not already posted with post() and only once
// Use only as part of onsubmit validations
function canPost() {
	if (!__isInit)
		return false;
	if (!__isPostable)
		return false;
	if (__isPosted)
		return false;
		
	// Posting is granted, lock the bit and return true
	__isPosted = true;
	return true;
}

// Set a command without posting
function setCommand(command) {
	var theform = document.mainForm;
	theform.command.value = command;
}

// Set a command and arguments without posting
function setCommandAndArguments(command, arguments) {
	var theform = document.mainForm;
	theform.command.value = command;
	if (arguments!=null) 
		theform.cmdArguments.value = arguments;
}

// Select a control by id (selects and focus)
function selectOn(htmlId) {
	try {
		$('#' + htmlId).focus().select();
	} catch (e) {
		// IE 8 throws an exception if you try to focus on a disabled field, and jQuery 1.7.1 doesn't deal with this
		dsmErrorLog(e);
	}
}

// Select a control by id (selects and focus)
function focusOn(htmlId) {
	try {document.getElementById(htmlId).focus();}catch (e) {dsmErrorLog(e);}
}

// Enble the apply when a given control is changed
function enableApplyOnChange(htmlId) {
	attachFunctionToControl(htmlId, enableApply);
}

// Sets the 'changed' input to true (used when alteration to the form made and enableApplyOnChange not used)
function setChanged() {
	try {
		var o = document.getElementById("changed");
		if (o.value != "true")
			o.value = true;
		setChangedExtension();
	} catch (e) {
		dsmErrorLog(e);
	}		
}

// allows custom extensions to "setChanged" function without altering this file or overriding base algorithm
// implement this code in your jsp file to perform extra tasks
function setChangedExtension() {
}

// Locks out posting from the post('','') function
function setUnpostable() {
	__isPostable = false;
}

//Displays an error in a ui1 message or in an alert (if not found)
function showInfo(message) {
	var messageIcon = "i_m24/info.png";
	var messageClassName = "alert-message info";
	
	showMessage(message, messageIcon, messageClassName)
}


//Displays an warning in a ui1 message or in an alert (if not found)
function showWarning(message) {
	var messageIcon = "i_m24/warning.png";
	var messageClassName = "alert-message warning";
	
	showMessage(message, messageIcon, messageClassName)
}

//Displays an error in a ui1 message or in an alert (if not found)
function showError(message) {
	var messageIcon = "i_m24/error.png";
	var messageClassName = "alert-message error";
	
	showMessage(message, messageIcon, messageClassName)
}

// Displays a message in a ui1 message or in an alert (if not found)
function showMessage(message, messageIcon, messageClassName) {
	if( message != null && message != "" ) {
		if (messageIcon == null || messageIcon == "")
			messageIcon = "i_m24/error.gif";
		if (messageClassName == null || messageClassName == "")
			messageClassName = "message_error";

		try {
			document.getElementById("mainMessage_text").innerHTML = message;
			document.getElementById("mainMessage_icon").src = messageIcon;
			document.getElementById("mainMessage").className = messageClassName;
			//document.getElementById("mainMessage").style.display = "";
			
			// Animate the opening
			ui1AnimateMessage("mainMessage");
			
			// Make sure the layout is correct (not required)
			try {
				resize();
			}
			catch (e) {
				dsmErrorLog(e)
			}
		}
		catch (e) {
			alert(message);
		}
	}
	else {
		document.getElementById("mainMessage_text").innerHTML = "";
		document.getElementById("mainMessage_icon").src = "";
		document.getElementById("mainMessage").style.display = "none";
		
		// Make sure the layout is correct (not required)
		try {
			resize();
		}
		catch (e) {
			dsmErrorLog(e);
		}
	}
}

function disableApplySaveButtons(toDisable){
    $('#applyButton').attr('disabled', toDisable);
    $('#saveButton').attr('disabled', toDisable);
}

// Lock down buttons and prevent double submit
function applySaveCancelCanPost() {
    disableApplySaveButtons(true);
    return canPost();
}

// Display focus for control_border objects (where child component has actual focus)
;(function($) {
	$(document).ready(function () {
		$(".control_border").focusin(function() {$(this).toggleClass('control_border_focus', true);});
		$(".control_border").focusout(function() {$(this).toggleClass('control_border_focus', false);});
	});	
})(jQuery);

//---------------------------------
// PopUp functions
//---------------------------------

// Opens a new window 
// Resizable(true/false)
// Width/Height (#/null) null will use default width/height
// OptionalName (_blank/SSS/null) null will generate a random name, use a set name to prevent duplicate windows
//     Null will also generate a smart name for Details/Properties/Override and Viewers screens
// NoOptions (omitted/null/true) true will remove the options and use the full standard chrome and size
function windowOpen(url, resizable, width, height, optionalName, noOptions) {
	var w = null;
	var h = null;
	try {
		if (height != null && width != null) {
			// Limit the size of popups to the size of the screen.
			if (width > window.screen.availWidth)
				width = window.screen.availWidth - 10;
			if ((height + 40) > window.screen.availHeight)
				height = window.screen.availHeight - 40 - 10;
				
			// Values are ok, lets use them.
			w = width;
			h = height;
		}
	}
	catch (e) {
		dsmErrorLog(e);
	}
	
	// Auto generate a name
	var name = randomWindowID();
	if (optionalName != null) {
		name = optionalName;
	} else {
		try {
			
			// trim off any leading namespace-- prefix from the url before parsing
			var suffix = url;
			if (url.indexOf("--") != -1) {
				suffix = url.substring(url.indexOf("--") + 2);
			}

			// if we have an id to use
			if (((suffix.indexOf("Properties.screen?") != -1) || (suffix.indexOf("PolicyEditor.screen?") != -1) || (suffix.indexOf("ComputerEditor.screen?") != -1) || (suffix.indexOf("Override.screen?") != -1) || (suffix.indexOf("Viewer.screen?") != -1)) && (suffix.indexOf("ID=") != -1) && (suffix.indexOf("ID=0") == -1)) {
				
				// extract the screen name and object id
				var parts = suffix.split(".");
				var screenName = parts[0];
				var sub = suffix.substring(suffix.indexOf("ID="));
				var id = sub.substring(3);
				if (sub.indexOf("&") != -1) {			
					id = sub.substring(3, sub.indexOf("&"));
				}
				name = screenName + id;
				
				// add a suffix to avoid host/policy confusion
				if ((suffix.indexOf("PolicyEditor.screen?") != -1) && (suffix.indexOf("securityProfile") != -1)) {
					name += "sp";
				}
				if ((suffix.indexOf("ComputerEditor.screen?") != -1) && (suffix.indexOf("host") != -1)) {
					name += "h";
				}
				
				// add policyID for override screens
				if ((suffix.indexOf("Override.screen?") != -1) && (suffix.indexOf("securityProfileID=") != -1)) {
					var spsub = suffix.substring(suffix.indexOf("securityProfileID="));
					var spid = spsub.substring(18);
					if (spsub.indexOf("&") != -1) {				
						spid = spsub.substring(18, sub.indexOf("&"));
					}
					name += "spid";
					name += spid;
				}			
			}
		} catch (e) {
			dsmErrorLog(e);
		}
	}		

	var options = "resizable=" + (resizable ? "1" : "0");
	
	if ((w != null) && (w != "")) {
		options += ",width=" + w;
	}
	if ((h != null) && (h != "")) {
		options += ",height=" + h;
	}
	
	var winid = null;
	if ((noOptions != null) && (noOptions == true)) {
		try { winid = window.open(url, name);} catch (e) {log.error("unable to open window url: " + url+ " - name: " + name , e);}
	} else {
		try { winid = window.open(url, name, options);} catch (e) {log.error("unable to open window url: " + url+ " - name: " + name + " - options: " + options , e);}
	}
	try { winid.focus();} catch (e) {dsmErrorLog(e);}
	return winid;
}

// Opens a link in a new window (or tab usually). These tabs have full default browser chrome and are suitable for external links.
function urlOpen(url) {
	windowOpen(url, true, null, null, "_blank", true);
}

//Opens a new window 
// namespace - the string representation of the namespace in which the 
//             target window's screen is defined. May be null for screens
//             that are not tied to a namespace.
// screenName - the target screen name (without .screen)
// queryParams - a string containing query parameters.
//Resizable(true/false)
//Width/Height (#/null) null will use default width/height
//OptionalName (_blank/SSS/null) null will generate a random name, use a set name to prevent duplicate windows
//  Null will also generate a smart name for Details/Properties/Override and Viewers screens
//NoOptions (omitted/null/true) true will remove the options and use the full standard chrome and size
function windowOpenScreen(namespace, screenName, queryParams, resizable, width, height, optionalName, noOptions) {
	if (!queryParams) {
		queryParams = "";
	}
	if (namespace && namespace.length > 0) {
		url = namespace + "--" + screenName + ".screen?" + queryParams;
	} else {
		url = screenName + ".screen?" + queryParams;
	}
	windowOpen(url, resizable, width, height, optionalName, noOptions);
}

function getInternetExplorerVersion()
// Returns the version of Internet Explorer or a -1
// (indicating the use of another browser).
{
	var rv = -1; // Return value assumes failure
	if (navigator.appName == 'Microsoft Internet Explorer') {
		var ua = navigator.userAgent;
		var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
		if (re.exec(ua) != null)
			rv = parseFloat( RegExp.$1 );
	}
	return rv;
}

// Get a random window id
function randomWindowID() {
	return "w"+Math.round(Math.random()*10000000);
}

// keep track of modal dialogs
var __modalCallbacks = new Array();
var __modalWindow = new Array();
var __modalSequence = 1;

/**
 * Opens a dialog where all of the buttons close the dialog an callback to the function defined in the array
 */
function modalOpenDialog(title, text, buttonCallbackArray, optionalWidth) {
	if (optionalWidth == null) {
		optionalWidth = 400;
	}
	
	var marginLeft = parseInt(-optionalWidth / 2);
	
	var modalID = "modal_" + window.top.__modalSequence++;
	__modalCallbacks[modalID] = null;
	window.top.__modalWindow[modalID] = window;
	// Append the shell of the modal
	$(window.top.document.body).append('<div id="'+modalID+'" class="modal hide fade" style="width:'+optionalWidth+'px; max-height: 650px;margin-left:'+marginLeft+'px;"><div id="'+modalID+'_header" class="modal-header" onmousedown="return modalMove(this, event, null);"><h3><span id="'+modalID+'_title"></span></h3></div><div id="'+modalID+'_body" class="modal-body" style="max-height:none;"><div style="padding:10px;padding-bottom:20px;"><span id="'+modalID+'_text"></span></div><div id="'+modalID+'_buttons" style="text-align: center;"></div></div></div>');

	window.top.$("#" + modalID + "_title").text(title);
	window.top.$("#" + modalID + "_text").text(text);

	var number = 0;
	for (var i in buttonCallbackArray) {
		var button = $('<input type="button" style="width:120px;" class="btn small '+(number==0?'primary':'')+'" value="'+i+'" />');
		var cb = buttonCallbackArray[i];
		if (cb != null) {
			button.bind('click', cb);
		}
		button.bind('click', {modalID : modalID}, window.top.modalCloseEventHandler);
		window.top.$("#" + modalID + "_buttons").append(button);
		number++;
	}
	
	window.top.$("#" + modalID).modal({
		backdrop:'static',
		keyboard:true,
		show:false
	}).on("hidden", function() {window.top.modalHidden(modalID)}).modal('show');
}

function modalOpenScreen(namespace, screenName, queryParams, resizable, width, height, cb) {
	if (!queryParams) {
		queryParams = "";
	}
	if (namespace && namespace.length > 0) {
		url = namespace + "--" + screenName + ".screen?" + queryParams;
	} else {
		url = screenName + ".screen?" + queryParams;
	}
	modalOpen(url, resizable, width, height, cb);
}

// display a dialog
function modalOpen(url, resizable, width, height, callback) {

	var modalWidth = width + 30;
	var marginLeft = parseInt(-modalWidth / 2);
	
	var modalID = "modal_" + window.top.__modalSequence++;
	__modalCallbacks[modalID] = callback;
	window.top.__modalWindow[modalID] = window;
	// Append the shell of the modal
	$(window.top.document.body).append('<div id="'+modalID+'" class="modal hide fade" style="width:'+modalWidth+'px; max-height: 650px;margin-left:'+marginLeft+'px;"><div id="'+modalID+'_header" class="modal-header" onmousedown="return modalMove(this, event, \''+modalID+'_iframe\');"><h3><span id="'+modalID+'_title"></span></h3></div><div id="'+modalID+'_body" class="modal-body" style="max-height:none;height:'+height+'px;"><iframe id="'+modalID+'_iframe" src="" style="border:0px;width:100%;height:100%;display:block;" frameBorder="0"></iframe></div></div>');
	disableSelection(window.top.$('#' + modalID+'_header h3'));

	window.top.$("#" + modalID).modal({
		backdrop:'static',
		keyboard:true,
		show:false
	}).on("hidden", function() {window.top.modalHidden(modalID)}).modal('show');
	
	window.top.$("#" + modalID + "_iframe").attr("src",(url + (url.substring(url.length-1) == "?" ? "" : "&") + "modalID=" + modalID));

	// resizable not currently supported by this
						
	return false;	// prevent the default action, e.g. don't following a link 
}

// hide a modal dialog (fires the modalHidden function to do the real work)
function modalCloseEventHandler(event) {
	modalCloseID(event.data.modalID);
	return false;
}

function modalCloseID(modalID) {
	$("#" + modalID).modal('hide');
}

// called whenever a modal dialog is hidden - invoke any callbacks and clean up memory
function modalHidden(modalID) {
	
	// if we recognize this dialog
	if (__modalWindow[modalID] != null) {
	
		// if there is a callback associated with this dialog
		if (__modalWindow[modalID].__modalCallbacks[modalID] != null) {
			
			// invoke the callback and remove it from the table
			__modalWindow[modalID].__modalCallbacks[modalID]();
			__modalWindow[modalID].__modalCallbacks[modalID] = null;
		}
		
		// remove our reference to this dialog
		__modalWindow[modalID] = null;
	}
	
	// remove it from the DOM
	$("#" + modalID).remove();
}

// Called from modals to set title
function setModalTitle(modalID) {
	try {
		// Called from within a modal to copy the title of the document to the modal's title generically
		window.parent.$('#' + modalID + '_title').text(document.title);
	} catch (e) {
		dsmErrorLog(e);
	}
}

// Called from modals to find their opener
function getModalOpener() {
	var modalID = document.getElementById("modalID");
	if (window.parent != null && modalID != null && modalID.value != null && modalID.value.length > 0)
		return window.parent.__modalWindow[modalID.value];
	else 
		return window.opener;
}

// Called from modals to close
function smartClose() {
	var modalID = document.getElementById("modalID");
	if (window.parent != null && modalID != null && modalID.value != null && modalID.value.length > 0)
		window.parent.setTimeout("modalCloseID('"+modalID.value+"')", 1);
	else 
		window.close();
}


//---------------------------------
// Application Control functions
//---------------------------------

// Open admin properties
function doOwnAdministratorProperties(id) {
	windowOpen("AdministratorProperties.screen?administratorID="+id, true, 580, 560);
}

// Sign out of the application
function doSignOut() {
	window.parent.location='SignIn.screen?session=invalidate';
}

// Set user password
function doSetPassword(id, width, height) {
	modalOpen("SetPassword.screen?administratorID="+id, false, width, height);
}


// Open the help dialog
function doHelp(f) {
	try {
		var forScreen = f;
		if (f == null) {
			forScreen = location.hash.replace("#","");
		}
		windowOpen("Help.screen?forScreen="+forScreen, true, null, null, "help");
	}
	catch (e) {alert(e.description);}
}

// Save administrator setting
function doSaveAdministratorSetting(key, value) {
	try {
		rpc('AdministratorSettingSave', 'key='+escape(key)+'&value='+escape(value), callBackNoAction);
	} catch (e) {
		dsmErrorLog(e);
	}
}

// A call back for RPC calling methods that don't need to be called back.
function callBackNoAction(){
	
}


// Refresh the status window
function doStatusRefresh() {
	try {
		var ot = window;
		while (ot.opener!=null) {ot = ot.opener.window;}
		if (ot.top.isApplicationFrame)
			ot.top.externalUpdate();
	} catch (e) {
		dsmErrorLog(e);
	}
}

function doApplicationRefresh() {
	try {
		var ot = window;
		while (ot.opener!=null) {ot = ot.opener.window;}
		if (ot.top.isApplicationFrame)
			ot.top.location = 'Application.screen?';
	} catch (e) {
		dsmErrorLog(e);
	}
}

//---------------------------------
// Display functions
//---------------------------------

// Toggle display
function toggleDisplay(htmlId) {
	var ocontrol = document.getElementById(htmlId);
	if (ocontrol) {
		ocontrol.style.display = (ocontrol.style.display == "" ? "none" : "");
	} else {
		dsmTrace("toggleDisplay - No such control " + htmlId);		
	}
}

// true if displayed
function isDisplayed(htmlId) {
	var ocontrol = document.getElementById(htmlId);
	if (ocontrol) {
		return (ocontrol.style.display == "" ? true : false);
	} else {
		dsmTrace("isDisplayed - No such control " + htmlId);		
	}
}

// Set displayed
function setDisplay(htmlId, display) {
	var ocontrol = document.getElementById(htmlId);
	if (ocontrol) {
		ocontrol.style.display = (!display ? "none" : "");
	} else {
		dsmTrace("setDisplay - No such control " + htmlId);
	}
}

// Hide or show rule assignment context menu items based on selection
function displayAssignmentContextMenuItems(ids, isAssigning) {
	if (!isAssigning) return;
	var visible = true;
	var temp = ids.split(",");
	for (var i = 0; i < temp.length; i++) {
		var name = "a_" + temp[i];
		var ocheck = document.getElementById(name);
		if (ocheck != null) {
			if (ocheck.disabled) {
				visible = false;
				break;
			}
		}
	}
	setDisplay("assignableContextItem_Assign", visible);
	setDisplay("assignableContextItem_Unassign", visible);
	setDisplay("assignableContextItem_Spacer", visible);
}

// Highlight the Filter Submit button - applies to the search, and host and period bars
function highlightFilterSubmit() {
	var $filterSubmitButtonImage = $('#filterSubmitButtonImage');
	if($filterSubmitButtonImage.length > 0) 
		$filterSubmitButtonImage.attr('src', 'i_control/go_white_highlight.gif');
	
	var $filterSubmitButton_bsImage = $('#filterSubmitButton_bsImage');
	if($filterSubmitButton_bsImage.length > 0) 
		$filterSubmitButton_bsImage.attr('src', 'i_control/go_white_highlight_w2b.gif');
}

// This method takes the id of the menu element and apply offset to its width
// The width is in px that will be appended to the original width of the menu
function bestfitMenu(id, offset){
	//IE & Chrome: need to clear the width of the table that affects the computation of the context menu box 
	$(".contextmenu_item > div").each(function() {
		$(this).css("width",""); 
		$(this).find("img").parent().css("width","");
	});
	
	var $menu = $("#"+id);
	$menu.width("auto"); //resets the width

	var adjustedMenuWidth = $menu.width() + offset;
	$menu.width(adjustedMenuWidth);	
	
	//IE & Chrome: restore the width for sub-context menu AFTER auto adjustment of the context menu box
	$(".contextmenu_item > div").each(function() {
		var widthForSubMenu = adjustedMenuWidth - ($menu.innerWidth()-adjustedMenuWidth);
		$(this).width(widthForSubMenu);//Table width for sub-context menu item
		$(this).find("img").parent().width(Math.round(widthForSubMenu * 0.99));//Chrome: 99% width of sub-context menu item width for arrow image holder 
	});
	
}
//---------------------------------
// Screen Layout Functions
//---------------------------------

function correctedTotalHeight() {
	return $(window).height();
}

function correctedTotalWidth() {
	return $(window).width();
}

var __bottomSectionChecked = false;

//Set the mainSection height (-topSection)
function setMainSectionHeightAndWidth() {
	var otopSection 			= document.getElementById("topSection");
	var omainSection			= document.getElementById("mainSection");
	var obottomSection 			= document.getElementById("bottomSection");
	
	if (__bottomSectionChecked == false) {
		try {
			// Remove bottom section if it is empty to avoid a keyboard up/down issue on IE
			// The empty div cause it to behave badly;
			if (obottomSection && obottomSection.innerHTML.indexOf("<") == -1) {
				obottomSection.parentNode.removeChild(obottomSection)
				obottomSection = null;
			}
		} catch (e) {
			dsmErrorLog(e);
		}
		
		__bottomSectionChecked = true;
	}
	
	if (obottomSection != null) {
		omainSection.style.height 	= (correctedTotalHeight() - otopSection.offsetHeight - obottomSection.offsetHeight) + "px";
	} else {
		omainSection.style.height 	= (correctedTotalHeight() - otopSection.offsetHeight) + "px";
	}
	omainSection.style.width 	= correctedTotalWidth() + "px";
}	

// Set the tab height and width for a tabbed dialog
function setTabContentHeightAndWidthForTabbedDialog() {
	var tSH = $("#topSection").outerHeight();
	var bSH = $("#bottomSection").outerHeight();

	var tabContentExtraHeight = $("#mainSection").outerHeight() - $("#tabContent").height();
	
	var otabContent = $("#tabContent");

	var height 	= correctedTotalHeight(true) - tSH - bSH - 26 - 5 - 5 - 4; // Tabs, padding, border, and some extra pixels for Chrome 
	otabContent.height(min10(height));
	
	var width 	= correctedTotalWidth(true) - 5 - 5 - 2;
	otabContent.width(min10(width));
	$("#tabGroup").width(min10(width));
	
	// resize the tab group (enables scrolling tabs)
	try {
		tabGroupResize();
	} catch (e) {
		dsmErrorLog(e);
	}
}

// Set the dialog auto height
function setDialogAutoHeight() {
	var ototalContent			= document.getElementById("totalContent");
	var otoPadd 				= document.getElementById("toPadd");
	$("#toPadd").height(otoPadd.offsetHeight + (correctedTotalHeight() - ototalContent.offsetHeight) - 10);
}

var __autoScroll = new Array();

function setTopToScrollTop(setTop, getScroll) {
	try {
		var osetTop 		= document.getElementById(setTop);
		var ogetScroll 		= document.getElementById(getScroll);
		osetTop.style.top 	= ogetScroll.scrollTop + "px";
	}
	catch (e) {
		dsmErrorLog(e);
	}
}

function setToolbarDropMenuPos(name, button, obj) {
	try {
		var coords = ui1Coords(obj);
		document.getElementById(name).style.top = (coords.y + obj.clientHeight + 2) + "px";
		document.getElementById(name).style.left = (coords.x - document.getElementById(button).clientWidth - 1) + "px";
	} catch (e) {
		dsmErrorLog(e);
	}		
}

function setToolbarDropMenuPosViaCurrentButton(dropMenuName, toolbarItemButton) {
	try {
		var coords = ui1Coords(toolbarItemButton);
		document.getElementById(dropMenuName).style.top = (coords.y + toolbarItemButton.clientHeight + 2) + "px";
		document.getElementById(dropMenuName).style.left = (coords.x) + "px";

	} catch (e) {
		dsmErrorLog(e);

	}		
}

//---------------------------------
//Scroll Functions
//---------------------------------

function resizeTagsAndHistoryTab() {
	var otabContent	= document.getElementById("tabContent");
	var h 			= otabContent.offsetHeight;
	$('#history').height(minValue(h - $('#tags').height() - 145, 40));
}

function resizeGeneralDescriptionTab(allowForExtraHeight) {
	var otabContent	= $("#tabContent");
	var h 			= otabContent.height();
	var hCompensation = allowForExtraHeight ? 115 : 90;
	var ogeneralTable = $('#generalTable');
	$('#descriptionTextarea').height(minValue(h - ogeneralTable.height() - hCompensation, 60));
}

//---------------------------------
// Scroll Functions
//---------------------------------

function restoreScroll(sectionNameId) {//v3
	try {
		if(sectionNameId == null)
			sectionNameId = "mainSection";
		var omainSection = document.getElementById(sectionNameId);
		var oscrollTop = document.getElementById("scrollTop");
		var oscrollLeft = document.getElementById("scrollLeft");
		omainSection.scrollTop = oscrollTop ? (oscrollTop.value == "" ? 0 : parseInt(oscrollTop.value)) : 0;
		omainSection.scrollLeft = oscrollLeft ? (oscrollLeft.value == "" ? 0 : parseInt(oscrollLeft.value)) : 0;
	} catch (e) {
		dsmErrorLog(e);
	}		
}

function storeScroll(sectionNameId) {//v3
	try {
		if(sectionNameId == null)
			sectionNameId = "mainSection";
		var omainSection = document.getElementById(sectionNameId);
		var oscrollTop = document.getElementById("scrollTop");
		var oscrollLeft = document.getElementById("scrollLeft");
		oscrollTop.value = omainSection.scrollTop;
		oscrollLeft.value = omainSection.scrollLeft;
	} catch (e) {
		dsmErrorLog(e);
	}		
}

function clearScroll() {//v3
	try {
		var oscrollTop = document.getElementById("scrollTop");
		var oscrollLeft = document.getElementById("scrollLeft");
		oscrollTop.value = "0";
		oscrollLeft.value = "0";
	} catch (e) {
		dsmErrorLog(e);
	}		
}

//---------------------------------
// Helper Functions
//---------------------------------

function min10(value) {
	if (value < 10)
		return 10;
	return value;
}

function minValue(value, min) {//v3
	if(min == null)
		return min10(value);
	if( value < min )
		return min;
	return value;
}

//---------------------------------
// Private Functions
//---------------------------------

function attachFunctionToControl(htmlId, f) {
	try {
		var ocontrol	= document.getElementById(htmlId);
		if (!ocontrol) {
			dsmTrace("No control found for HTML ID " + htmlId);
		}
		else if (ocontrol.nodeName.toLowerCase() == "select") {
			ui1AttachEvent(ocontrol, "change", f);
		}
		else if (ocontrol.nodeName.toLowerCase() == "input" && (ocontrol.type.toLowerCase() == "checkbox" || ocontrol.type.toLowerCase() == "radio")) {		
			ui1AttachEvent(ocontrol, "click", f);
			ui1AttachEvent(ocontrol, "keypress", f);
		}
		else if (ocontrol.nodeName.toLowerCase() == "input" || ocontrol.nodeName.toLowerCase() == "textarea") {		
			ui1AttachEvent(ocontrol, "keyup", f);
			ui1AttachEvent(ocontrol, "keydown", f);
			ui1AttachEvent(ocontrol, "keypress", f);
			ui1AttachEvent(ocontrol, "paste", f);
		}
	} catch (e) {
		dsmErrorLog(e);
	}		
}
function enableApply(e) {
	if (!e) var e = window.event;
	var k = 0;
	if (e != null) {
		k = e.keyCode;
		if (k == null)
			k = e.which;
	}
	// TAB = 9, SHIFT = 16, CTRL = 17, ALT = 18, CAPS = 20, PAGE UP/DOWN HOME/END ARROWS = 33-40, WINDOWS 91/92
	if (k == 9 || k == 16 || k == 17 || k == 18 || k == 20 || (k >= 33 && k <= 40) || k == 91 || k == 92) { return; }
	
	// CTRL+X , CTRL+C
	try {
	if (e && e.type.substring(0,3) == "key" && e.ctrlKey && (k == 0 || k == 67 || k == 88))
		return;
	} catch (e) {
		dsmErrorLog(e);
	}
	
	var oApply = document.getElementById("applyButton");
	if (oApply != null)
		if (oApply.disabled)
			oApply.disabled = false;
	
	var oSave = document.getElementById("saveButton");
	if (oSave != null)
		if (oSave.disabled)
			oSave.disabled = false;
	
	var oOk = document.getElementById("okButton");
	if (oOk != null)
		if (oOk.disabled)
			oOk.disabled = false;

	// Marking the form as changed allows us to keep the apply enabled between postbacks (such as sorting)
	setChanged();
}

// Helper to set the command to save on enter
function saveOnEnter(e) {
	if (!e) var e = window.event;
	if (e.keyCode==13) {setCommandAndArguments('SAVE','');}	
}

function contextMenuNotify(e) {
	// Close context menu in other frames when opening one in this frame
	try {
		if(window.top!==window.self) {
			window.top.frames
			
			var f = window.top.frames; 
			for (var i = 0; i < f.length; i++) { 
				if (f[i] != window) {
					if (f[i].__ui1_naturalContext == false)
						f[i].contextMenuOnClickEvent();
				}
			}
		}
	} catch (e) {
		// Not important if this fails, just a nice to have
	}
}

function highlightInMainDatatable(word) {
	try {
		recurseHighlight(document.getElementById("mainTable_rows"), word.toLowerCase())
	} catch (e) {
		dsmErrorLog(e);
	}
}

function highlight(node, word) {
	recurseHighlight(node, word.toLowerCase())
}

function recurseHighlight(node,word) {
	// Iterate into this node's childNodes
	if (node.hasChildNodes) {
		var hi_cn;
		var cn = node.childNodes;
		var cnn = node.childNodes.length;
		for (hi_cn=0;hi_cn<cnn;hi_cn++) {
			recurseHighlight(cn[hi_cn],word);
		}
	}
	// And do this node itself
	if (node.nodeType == 3) { // text node
		var tempNodeVal = node.nodeValue.toLowerCase();

		if (tempNodeVal.indexOf(word) != -1) {
			var pn = node.parentNode;
			var nv = node.nodeValue;
			var ni = tempNodeVal.indexOf(word);
			var before = document.createTextNode(nv.substr(0,ni));
			var docWordVal = nv.substr(ni,word.length);
			var after = document.createTextNode(nv.substr(ni+word.length));
			var hiwordtext = document.createTextNode(docWordVal);
			var hiword = document.createElement("span");
			hiword.style.backgroundColor = "#ffff99";
			hiword.style.fontWeight = "bold";
			hiword.style.color = "#000000";
			hiword.appendChild(hiwordtext);
			pn.insertBefore(before,node);
			pn.insertBefore(hiword,node);
			pn.insertBefore(after,node);
			pn.removeChild(node);
		}
	}
}

// toggle visibility (style.display) of parameter element
function toggleDisplay(par){ //par is element id
	var el = document.getElementById(par);
	if(el.style.display=="none" || el.style.display==null)
		el.style.display = "";
	else
		el.style.display = "none";
}
// toggle the icon indicating whether vis is on or not
function toggleIcon(el){
	var sSrc = el.getAttribute("src");
	if(sSrc.indexOf("toggle_close.gif") != -1)
		el.setAttribute("src","i_control/toggle_open.gif");
	else	
		el.setAttribute("src","i_control/toggle_close.gif");
}

// Keep an animated gif moving after a postback
function keepRolling(htmlID) {
	window.setTimeout("keepRolling2(\"" + htmlID + "\")", 200);
}
function keepRolling2(htmlID) {
	try {
		var obj = document.getElementById(htmlID);
		obj.src = new String(obj.src);
	} catch (e) {
		dsmErrorLog(e);
	}
}

if (window.attachEvent) {
	window.attachEvent("onload", new Function("__isInit = true;"));
} else if (window.addEventListener) {
	window.addEventListener("load", new Function("__isInit = true;"), false);
} else {
	// Fail to postable right away
	__isInit = true;
}

// Utilitiy logger.. use log.info(), log.warn() or log.error()
function Log() {
	this.log = function(level, s, ex) {
		try {
			var message = document.location + ": " + s;
			if (ex != null) {
				message += "\n Name: " + ex.name;
				message += "\n Message: " + ex.message;
				if (ex.fileName != null)
					message += "\n File Name: " + ex.fileName;
				if (ex.lineNumber != null)
					message += "\n Line Number: " + ex.lineNumber;
				if (ex.stack != null)
					message += "\n Stack: " + ex.stack;
			}
			message = message.replace(/"/g,"").replace(/\r/g,"").replace(/\n/g,"\\n");
			window.setTimeout("rpc('Log', \"level=" + level + "&message=" + message + "\", logCB);", 100);
		} catch (e) {
			dsmErrorLog(e);
		}
	}
	this.info = function(s, ex) {this.log(1, s, ex);};
	this.warn = function(s, ex) {this.log(2, s, ex);};
	this.error = function(s, ex) {this.log(3, s, ex);}
}
function logCB() {
}

var log = new Log();

function escapeHTML(str) {
	var div = document.createElement('div');
	var text = document.createTextNode(str);
	div.appendChild(text);
	return div.innerHTML;
};

function viewFilterItemSetDisabled(htmlId, parentID, onclick, ondelete, disabled) {
	try {
		var viewFilterItem = document.getElementById(htmlId);
		viewFilterItem.className = disabled ? "disabled" : "view_filter_text";
		var viewFilterIcon = document.getElementById(htmlId + "icon");
		
		var deleteDiv = document.getElementById(htmlId + "DeleteDiv");
		var deleteIcon = document.getElementById(htmlId + "DeleteIcon");
		if (disabled) {
			viewFilterItem.onmouseover=null;
			viewFilterItem.onmouseout=null;
			viewFilterItem.onclick=null;
			try {
				if (deleteDiv) deleteDiv.onclick=null;
				if (deleteIcon) deleteIcon.style.display="none";
				if (viewFilterIcon) viewFilterIcon.className = "img_disabled";
			} catch (e) {
				dsmErrorLog(e);
			}
		} else {
			viewFilterItem.onmouseover=new Function("document.getElementById('" + htmlId + "').className='view_filter_text_over';");
			viewFilterItem.onmouseout=new Function("document.getElementById('" + htmlId + "').className='view_filter_text';");
			viewFilterItem.onclick=new Function("setDisplay('" + parentID + "', false);" + onclick);
	 		try {
	 			if (deleteDiv) deleteDiv.onclick=new Function(ondelete);
	 			if (deleteIcon) deleteIcon.style.display="";
	 			if (viewFilterIcon) viewFilterIcon.className = "";
			} catch (e) {
				dsmErrorLog(e);
			}
		}
	} catch (e) {
		dsmErrorLog(e);
	}
}

function simpleSearchSetDisabled(disabled) {
	var oq = document.getElementById('q');
	var $q = $(oq);
	document.getElementById('q_icon').disabled = disabled;
	document.getElementById('simpleSearchDiv').className = disabled ? 'simple_search_div_disabled' : 'simple_search_div';
	if (disabled) {
		document.getElementById('q_icon').className = "img_disabled";
		if ($q.hasClass('simple_search_input')) {
			$q.toggleClass('simple_search_input simple_search_input_disabled');
			var bgColor = $q.css('background-color');//get background-color property from "simple_search_input_disabled" class
			// and set it to element style attribute to override the style from bootstrap's input[disabled]
			$q.css('background-color', bgColor);
		}
		else if ($q.hasClass('simple_search_input_empty')) {
			$q.toggleClass('simple_search_input_empty simple_search_input_empty_disabled');
			var bgColor = $q.css('background-color');//get background-color property from "simple_search_input_empty_disabled" class
			// and set it to element style attribute to override the style from bootstrap's input[disabled]
			$q.css('background-color', bgColor);
		}
	} else {
		document.getElementById('q_icon').className = "img";
		if ($q.hasClass('simple_search_input_disabled')) {
			$q.toggleClass('simple_search_input simple_search_input_disabled');
			$q.css('background-color', '');
			document.getElementById('q_icon').src = "images/icons/icon_simple_search_cancel.png";
		}
		else if ($q.hasClass('simple_search_input_empty_disabled')) {
			$q.toggleClass('simple_search_input_empty simple_search_input_empty_disabled');
			$q.css('background-color', '');
			document.getElementById('q_icon').src = "i_control/blank.gif";
		}
	}
	oq.disabled = disabled;
}

// Checks the mainTable object against the array and returns true if the value is found
function checkArrayFor(checkArray, value) {
	var ids = document.getElementById("mainTable_selectedItems").value;
	if (ids == "") return false;
	var idArray = ids.split(",");
	for (var i = 0; i < idArray.length; i++) {
		if (checkArray[idArray[i]] == value)
			return true;
	}
	return false;		
}

// This is similar to the jQuery UI code for disabling selection, but not every DSM page includes jQuery UI.
var __supportsSelectStart = "onselectstart" in (document.createElement( "div" ));
// disable selection of one or more items
function disableSelection(jQueryObject) {
	jQueryObject.on((__supportsSelectStart ? "selectstart" : "mousedown") + ".ui-disableSelection", function(event) {
		event.preventDefault();
	});
}

// enable selection of one or more items
function enableSelection(jQueryObject) {
	jQueryObject.off((__supportsSelectStart ? "selectstart" : "mousedown") + ".ui-disableSelection");
}

function encodeToHex(str){
    var hex = '';
    for(var i=0;i<str.length;i++) {
        hex += ''+str.charCodeAt(i).toString(16);
    }
    return hex;
}

/* Function to show or hide custom time range search criteria selection */
function showHideCustomTime(selectControlId, customTimeId, show) {
	$('#' + customTimeId).css('display', show ? 'inline-block' : 'none');
	$('#' + selectControlId).parentsUntil('.timeBarSize').last().css('margin-bottom', show ? 5 : 0);
	$(window).resize();
}

// Common code to be executed for every document loaded.
$(document).ready(function() {
	
	// Try to set a min-width on any element that requests it not be shrunk.
	$('.doNotShrink').each(function() {
		var requiredWidth = 0;
		$(this).children().each(function() {
			var $this = $(this);
			if ($this.css('display') != 'none' && !$this.hasClass('doNotShrink') && (!this.type || this.type.toLowerCase() !== "hidden")) {
				// don't count hidden elements, hidden inputs, and also skip over children
				// that themselves do not want to be shrunk.
				requiredWidth += $this.outerWidth(true) + 1;
				// extra +1 is for IE, which uses non-integer sizes for its box model, and rounding errors
				// can make the calculated width too small.
			}
		});
		$(this).css('min-width', requiredWidth);
	});
	$('.unselectable').each(function() {
		disableSelection($(this));
	});
	
});

var __modal = new Object();

function modalMove(element, event, optionalIframe) {
	var m = __modal;
	m.element = element;
	m.modal = element.parentNode;
	m.optionalIframe = optionalIframe;
	m.startX = event.clientX;
	m.startY = event.clientY;
	m.startPos = $(m.modal).position();
	m.modalX = m.startPos.left;
	m.modalY = m.startPos.top;
	m.height = $(m.modal).outerHeight();
	m.halfWidth = $(m.modal).outerWidth() / 2;
	m.winHeight = $(window).height();
	m.winWidth = $(window).width();
	// IE 8 doesn't receive mouse events bound to window. But for some reason IE 9
	// doesn't receive the "mouseup" event when it's bound to the body. So bind
	// the mouse up event to both the body and the element that receives mousedown.
	m.eventsBoundTo = $("body");
	m.eventsBoundTo.bind("mousemove", modalMoveMM);
	m.eventsBoundTo.bind("mouseup", modalMoveMU);
	$(m.element).bind("mouseup", modalMoveMU);
	if (m.optionalIframe != null) {
	    m.screen = $('<div class="modal-move-screen" />').appendTo(document.body);// Screen to prevent loosing mouse
	}
	return ui1StopEvent(event);
}
function modalMoveMM(event) {
	var m = __modal;
	var newTop = m.modalY + (event.clientY - m.startY);
	var newLeft = m.modalX + (event.clientX - m.startX);
	if (newTop + m.height > m.winHeight) newTop = m.winHeight - m.height;
	if (newTop < 5) newTop = 5;
	if (newLeft + m.halfWidth > m.winWidth) newLeft = m.winWidth - m.halfWidth;// Left is the mid-point
	if ((newLeft - m.halfWidth) < 0) newLeft = m.halfWidth;
	$(m.modal).css({'top' : newTop, 'left' : newLeft});
}
function modalMoveMU(event) {
	var m = __modal;
	m.eventsBoundTo.unbind("mousemove", modalMoveMM);
	m.eventsBoundTo.unbind("mouseup", modalMoveMU);
	$(m.element).unbind("mouseup", modalMoveMU);
	if (m.optionalIframe != null) {
	    m.screen.remove();
	    m.optionalIframe = null;
	}
}
