// some usages
// $('form').systemSettings({});
// $('form').systemSettings('saveForm',{});
//
// The button with the class "save_btn" is used to save the form
//
//
// Configuration object parameters:
// URL: webservice url (used for both read and write)
// readURL - used for reading data
// writeURL- used for writing data 
// includeReadParams: send form names with request (default false)
// readInitialData: (default: true) read data to populate the form on load
// readMethod: default: "GET",
// writeMethod: default: "PUT",
// postCancelFunction: function(form) { } - called after canceling
// postLoadFunction: function(form) {} - called after loading
// customHandling: {field:opt, filed2:op2....} - special handling for fields
// 	- boolean - passed as js boolean
// 	- array - passed as js array (even if only one element)
// 	- commaarray - comma delimited transformed to array
//	- omit - not passed at all
//	- selectall - all values in select list passed (with rockers...)
// writePreProcessor(data) { return data } - modify the data that will be passed to the form
// expandDots: default true. If there are dots in a field name, assume that means a nested json structure (fielda.fieldb would be field {fieldb:"val"}
//
// classnames can be used for markup on forms
//    replaceall - on select lists, assume the data is a list of options (rather than selected values) 
//    skipunchecked - an unchecked checkbox is not added to the data list
(function ($) {
	// classes on checkboxes can be specified for initial behavior
	// In addition, to specify different checkbox behavior, the following can be used for initialization
	// checkboxes : {selector1 : {checkon:"val1", checkoff:"val2"}}
	var options = {
		postUpdateFunction : function(form) {
			$(form).systemSettings('formLoadSuccess');
		},
		saveFailureFunction: function (data) {
			$(document).systemSettings('notification','saveerror', 'mb_error');
			//$(document).popupWin({dialog:"Error saving settings", title:"Error"});						
		},
		loadFailureFunction: function (data) {
			$(document).systemSettings('notification','loaderror', 'system');
			//$(document).popupWin({dialog:"Error reading settings", title:"Error"});
		},
		readURL: "/middleware_rev/handlers/proxy/proxy.php/platform/systemsetting/multisettings?action=query",
		writeURL: "/middleware_rev/handlers/proxy/proxy.php/platform/systemsetting/multisettings?action=update",
		includeReadParams: false,
		readMethod:"GET",
		writeMethod:"PUT",
		postCancelFunction: function(form) { },
		postLoadFunction: function(form) {},
		expandDots: true,
		readInitialData: true
	};

	var methods = { };
	methods.updateSetting = function (key,val, postUpdate, saveFailure, option) {
		if (!postUpdate) {
			postUpdate = function() {};
		}
		if (!saveFailure) {
			saveFailure = options.saveFailureFunction;
		}
		if (!key) {
			key = this.attr('name');
			val = this.attr('value');
		}
		var obj = {};
		obj.settings = {key:val};
		if (option) {
			obj.settings[0].option = option;
		}
		methods.updateMultiSettings(obj,key,postUpdate,saveFailure);
	}

	methods.expandDots = function(settings) {
		for (var k in settings) {
			if (settings.hasOwnProperty(k)) {
				if (k.indexOf('.') != -1) {
					var val = settings[k];
					var f = k.split("\.");
					var cursetting = settings;
					for (var i=0;i<(f.length-1);i++) {
						var elem = f[i];
						if (!cursetting[elem]) {
							cursetting[elem] = {};
						}
						cursetting = cursetting[elem];
					}
					cursetting[f[f.length -1]] = val;
					delete settings[k];
				}
			}
		}
		return settings;
	}



	methods.updateMultiSettings = function (settings, form, postUpdateFunction, saveFailureFunction) 
	{
		if (options.expandDots) {
			settings = methods.expandDots(settings);
		}

		if (options.writePreProcessor && typeof options.writePreProcessor == 'function') {
			settings = options.writePreProcessor(settings,form);
		}
		if (!postUpdateFunction) {
			postUpdateFunction = options.postUpdateFunction;
		}
		if (!saveFailureFunction) {
			saveFailureFunction = options.saveFailureFunction;
		}
		for (j in settings) {
		}
		var opt = $.toJSON(settings);
		var url = options.writeURL;
		var meth = options.writeMethod;
		$.ajax({
			"url": url,
			"type": meth,
			"dataType": "text",
			data: opt,
			"success": function (data) {
				console.log("success:",data);
				postUpdateFunction(form);
			},
			"error": function (jqXHR, textStatus, errorThrown) {
				console.log("ERROR:",textStatus, errorThrown, jqXHR);
				saveFailureFunction(jqXHR, textStatus, errorThrown);
			}
		});
			};		
	methods.showValid = function() {
		return this.each(function() {
			var elem = $(this);
			var form, errorCount;
			if (elem.length >0) {
				label = $('label[for='+elem[0].id+']');
				/*
				elem.css("color","");
				label.css("color","");
				*/
				var errorMsg = elem.nextAll(".error_msg").eq(0);
				var nextError = elem.nextAll(":input").nextAll(".error_msg").eq(0);
				if (errorMsg != nextError) {
					errorMsg.removeClass("displayed");
				}
				elem.removeClass("error");
				label.removeClass("error");
				if (elem.hasClass("invalid")) {
					elem.removeClass("invalid");
					form = elem.closest("._systemSettingsForm");
					errorCount = form.data('errorCount') ;
					if (!errorCount) {
						errorCount = 0;
					}
					errorCount--;
					form.data('errorCount',errorCount);
				}
			}
		});
	}
	// If fields are not valid, they will be changed to read, and form will be marked as invalud
	methods.showInvalid = function() {
		return this.each(function() {
			var elem = $(this);
			var form, errorCount;
			if (elem.length >0) {
				var errorMsg = elem.nextAll(".error_msg").eq(0);
				var nextError = elem.nextAll(":input").nextAll(".error_msg").eq(0);
				if (errorMsg != nextError) {
					errorMsg.addClass("displayed");
				}
				label = $('label[for='+elem[0].id+']');
				elem.addClass("error");
				label.addClass("error");
				if (!elem.hasClass("invalid")) {
					elem.addClass("invalid");
					elem.removeClass("numberic");
					form = elem.closest("._systemSettingsForm");
					errorCount = form.data('errorCount') ;
					if (!errorCount) {
						errorCount = 0;
					}
					errorCount++;
					form.data('errorCount',errorCount);
				}
			}
		});
	}

	methods.loadFormData = function(params) {
		var form = $(this);
		options = __prepareParams(params);
		console.log("loading",form, options);
		var queryFields = {};
		if (options.includeReadParams) {
			queryFields = getQueryFieldsFromForm(form);
		}
		methods.queryMultiInitValue(queryFields,form);
	};

	methods.queryMultiInitValue = function(queryFields, form) {
		for (j in queryFields) {
			if (typeof queryFields[j] == 'object') {
				for (k in queryFields[j]) {
				}
			}

		}
		var opt = $.toJSON(queryFields);
		var url = options.readURL;
		var meth = options.readMethod;
		var dataReq = options.includeReadParams ? opt : null;


		$.ajax({
			"url": url,
			"type": meth,
			"dataType": "json",
			"data": dataReq,
			"success": function (data) {
				var settings = data;
				var i,entry;
				if (typeof form == 'function') {
					form(data);
					return;
				}
				methods.updateFormBySettings(settings,form);
				//Grey out save_btn if found
				if ($('.save_btn', form).length !== 0) {
					$('.save_btn', form).attr('disabled', 'disabled');
					$('.save_btn', form).addClass('button_disabled');
					$(form).bind('change keydown', function (e) {
						$('.save_btn', form).removeAttr('disabled');
						$('.save_btn', form).removeClass('button_disabled');
						$('#main_content .message_box').fadeOut("fast");
					});
				}
				options.postLoadFunction(form,settings);
			},
			"error": function (jqXHR, textStatus, errorThrown) {
				options.loadFailureFunction(jqXHR, textStatus, errorThrown);
			}
		});
	}
	/**
	 * getParameter values
	 * @returns the passed in JQuery object
	 * must provide a callback function as one of the parameters
	 * Other parameters can be system settings values to retrieve.
	 * The parameters may be:
	 *   - individual parameter names
	 *   - arrays of parameter names
	 *   - arrays of objects with uniquekey and type parameters
	 * If no parameters are given, the JQUERY object passed will be scanned for possible variables
	 *   - If the elements have "name" parameters, the names will be used as the parameters
	 *   - If there are no names, and there are ids, the ids will be used as parameters
	 *   - If there are no names or ids, the raw value of the elements will be used
	 * In all cases except the arrays of objects, the parameter type will be assumed to be "text"
	 *
	 */
	methods.getParams = function() {
		var setting, i, j, arg, callback;
		var settingArr = [];

		

		if (arguments.length > 0) {
			for (i=0;i<arguments.length;i++) {
				arg = arguments[i];
				if (typeof arg == 'string') {
					setting = { "uniquekey" : arg, "type":"text" };
					settingArr.push (setting);
				}
				else if (typeof arg == 'function') {
					callback = arg;
				}
				else if (arg.uniquekey) {
					setting = {};
					setting.uniquekey = arg.uniquekey;
					if (arg.type) {
						setting.type = arg.type;
					}
					else {
						setting.type = "text";
					}
					if (arg.option) {
						setting.option = arg.option;
					}
					settingArr.push(setting);
				}
				else if (arg.length) {
					for (j=arg.length-1;j>=0;j--) {
						setting = {"uniquekey" : arg[j], "type":"text" };
						settingArr.push(setting);
					}
				}
			}
		}
		/*
		if (settingArr.length > 0 && callback) {
			// we have a list of settings, do something
			methods.queryMultiInitValue({"settings" : settingArr}, callback);
		}
		else  */
		if (callback) {
			// plan B - see if this was called as a JQuery object - if so, process the value
			if (this.length >0) {
				this.each( function (idx,val) {
					setting = { "type":"text"};
					if (this.name) {
						setting["uniquekey"] = this.name;
					}
					else if (this.id) {
						setting["uniquekey"] = this.id;
					}
					else if (val && (typeof val == "string")) {
						setting["uniquekey"] = val;
					}
					else {
						return;
					}
					settingArr.push (setting);
				});
			}
			methods.queryMultiInitValue({"settings" : settingArr}, callback);
		}
		return this;

	}

	// takes an object of key/value pairs for setting
	methods.setParams = function(results) {
		// scoping seems to only work with a single component - if more than one, use document
		var scope = this;
		if (scope.length >1) {
			scope = $(document);
		}
		for (i in results) {
			if (results.hasOwnProperty(i)) {
				escapedSel = i.replace(/(:|\.)/g,'\\$1');
				// scoping within the jquery object does not seem to work now	
				//if ($('[name='+escapedSel+']',that).length > 0 ) {
				var nameTest = $('[name='+escapedSel+']',scope);
				var idTest = $('#'+escapedSel,scope);
				var obj = nameTest.length >0 ? nameTest : idTest;
				if (obj.is(":input")) {
					if (obj.is(":checkbox")) {
						methods.setInitialCheckbox(obj, results[i]);	
					}
					else {
						obj.val(results[i]);
					}
				}
				else if (obj.length > 0) {
					obj.text(results[i]);
				}
				else {
					// Not name or id?  Nothing to do
				}
			}
		}
		return this;
	}

	methods.getParamsAndDisplay = function() {
		var zhe = this;
		var newArgs = [];
		var newFunc = function(results){};
		for (i=0;i<arguments.length;i++) {
			if (typeof arguments[i] == 'function') {
				newFunc = arguments[i];
			}
			else {
				newArgs.push(arguments[i]);
			}
		}
		var callbackFunc = function(results) {
			var i, escapedSel;
			newFunc(results);
			methods.setParams.call(zhe,results);
		}
		newArgs.push(callbackFunc);

		// If we have multiple arguments, assume we have manual vars and look up in document
		if (newArgs.length >1) {
			that = $('document');
		}

				
		return methods.getParams.apply( this, newArgs );
	}
	methods.formLoadSuccess = function (form) {
		return this.each(function() {
			var form = $(this);
			//Grey out save_btn if found
			if ($('.save_btn', form).length !== 0) {
				$('.save_btn', form).attr('disabled', 'disabled');
				$('.save_btn', form).addClass('button_disabled');
				$(form).bind('change keydown', function (e) {
					$('.save_btn', form).removeAttr('disabled');
					$('.save_btn', form).removeClass('button_disabled');
				});
			}
			$(document).systemSettings('notification','settingssaved','mb_success');
			//$(document).popupWin({dialog:"The settings have been saved", title:"Settings Saved"});
		});
	}

	methods.notification = function (notificationid, type) {
		var strings = {
			settingssaved: "The settings have been saved",
			invalidentries: "Please correct invalid Entries",
			saveerror: "Error saving settings",
			loaderror: "Error reading settings"
		};

		console.log("Something happened... in notification");
		/*
		//var type = 'popup';	

		if (type == 'popup') {
			//$(document).popupWin({dialog:strings[notificationid], title:"Settings Status"});
			//return;
		}

		else if (type == 'system') {
			//$.tmAJAX.setCriticalBox(strings[notificationid]);
		}

		// Assume notificationid is a string unless it is an index to canned messages
		else if (!strings[notificationid]) {
			$("#main_content").show_message({"mb_class":type,"message":notificationid});
		}

		// notificationid may be an index to canned strings
		else {
			$("#main_content").show_message({"mb_class":type,"message":strings[notificationid]});
		}
		*/

	}
	
	methods.setCheckboxValue = function(checkboxitem, isChecked)
	{	

	    var boleans = {
		    	"true":"false",
			"on":"off",
			"yes":"no",
			"1":"0",
	    }
	
	    // if we don't have a checkbox passed as parameter, we may have one from jquery	    
	    if (!checkboxitem) {
			checkboxitem = $(this);
			isChecked = checkboxitem.is(":checked");
	    }
	    if (checkboxitem.data('checkon') && checkboxitem.data('checkoff')) {
		    boleans[checkboxitem.data('checkon')+''] = checkboxitem.data('checkoff');
	    }
	    // if we don't have checkbox status passed, we can get it from the the item
	    if (isChecked === undefined) {
		    isChecked = checkboxitem.is(":checked");
	    }
	    // If we have an actual value instead of a bolean for "isChecked", transform it to a bolean
	    // (used after retrieving values from db)
	    if ((isChecked !== true)&&(isChecked !== false)) { 
		    // A valid "true" value is true, otherwise, everything else is false
		    if (boleans.hasOwnProperty(isChecked)) {
			    isChecked = true;
		    }
		    else {
			    isChecked = false;
		    }
	    }

	    // the previous value determines the new value - however, it may be overridden
	    var oldValue = checkboxitem.val();

	    // allow any number to cause 1/0 behavior to occur, otherwise, convert to lowercase for case insensitive match
	    if(!isNaN(Number(oldValue)))		{ oldValue = 1; }
	    else { oldValue = oldValue.toLowerCase(); }

	    // Allow classnames to override values to specify behavior of bolleans
	    if (checkboxitem.hasClass("truefalse")) 	{ oldValue = 'true'; }
	    if (checkboxitem.hasClass("yesno")) 	{ oldValue = 'yes'; }
	    if (checkboxitem.hasClass("onoff"))		{ oldValue = 'on'; }
	    if (checkboxitem.hasClass("on_off"))	{ oldValue = 'on'; }
	    if (checkboxitem.hasClass("onezero"))	{ oldValue = 1;	}
	    if (checkboxitem.data('checkon'))		{ oldValue = checkboxitem.data('checkon'); }


 	    // Go through the list of possibilities, and set the value based on the oldvalue, newvalue or class	    
	    var checkedval, uncheckedval;
	    for (checkedval in boleans) {
	    	uncheckedval = boleans[checkedval];
	    	if (oldValue == checkedval || oldValue == uncheckedval) {
			checkboxitem.val(isChecked ? checkedval : uncheckedval);
			break;
		}
	    }

	    checkboxitem.prop("checked",isChecked);
	    return this;
	};

	// set the checkbox values after reading from the database
	methods.setInitialCheckbox = function(key, val) {
	    var obj = key;
	    if (typeof key == 'string') {
		    obj = $('[name="' + key + '"]');
	    }
	    if (obj.hasClass('omitunchecked')) {
		    if (obj.val() != val) {
			   return;
		    }
	    } 
	    methods.setCheckboxValue(obj,val);
	    obj.trigger('parentchange');
	};


	/* Given a json object of settings, update the data */

	methods.updateFormBySettings = function (settings,form) {

		if (!form) {
			form = $(document);
		}	
		// allow for cases where the object is nested	
		if (settings && settings.settings && typeof settings.settings == 'object') {
			settings = settings.settings;
		}

		var len = settings.length;
		var i, setting, key, val, option;

		for (setting in settings) {
			if (!settings.hasOwnProperty(setting)) {
				continue;
			}
			key = setting;
			val = settings[setting];
			option = setting.option;
			// skip empty elements
			var elem = $('[name="'+key+'"]',form);
			if (!elem.length) {
				continue;
			}
			var type = elem.attr('type') || '';
			type = type.toLowerCase();

			//radio box
			if ("radio" === type) {
				$('input:radio[name="' + key + '"]',form).filter('[value="' + val + '"]').attr('checked', true);
			}
			// checkbox
			else if ("checkbox" === type) {
			    methods.setInitialCheckbox(key,val); 
			} else if (elem.is("select")) {
				if (elem.hasClass("replaceall")) {
					var opts = $.map(val,function(d) {
						return "<option value='"+d+"'>"+d+"</option>";
					}).join('');
					elem.empty().append(opts);
				}
				else {
					if (!$.isArray(val)) {
						var opt = elem.find("option:[value='+val+']");
						if (opt.length) {
							opt.attr('selected',1);
						}
						else {
							elem.append('<option selected="selected" value="'+val+'">'+val+'</option>');
						}
					}

					else {

						for (i in val) {
							var optval = val[i];
							elem.find("option:[value='+optval+']").attr('selected',1);
						}
				
					}
i				}
			} else {
				if (elem.is('textarea')) {
					if (typeof val == 'object') {
						val = val.join(",");
					}
					elem.html(val);

				}
				else {
					elem.val(val);
				}
			}
		}
	};

	methods.saveForm = function(params) {
		var form = $(this);
		options = __prepareParams(params);
		var settings = methods.getSettingsFromForm(form);
		methods.updateMultiSettings(settings, form);
	}
	/* Given a jquery object, retrieve all the form elements and their data */
	methods.getSettingsFromForm = function(form) {
		if (!form) {
			form = this;
		}
		var settingObj = {};                

		// used to merge same name item				
		var settingMap = {};
		$(':input', form).each(              

		function (index, item) {
			var elem = $(item);
			var elemtype = elem.attr('type') || '';
			elemtype = elemtype.toLowerCase();
			// skip buttons
			if (elemtype == 'button' || elemtype == 'submit' || elemtype == 'cancel' || elem.is('button')) {
				return;
			}
			// skip unchecked radio box
			if (("radio" === elemtype) && (!elem.is(":checked"))) {
				return;
			}

			// skip unchecked checkboxes if we are toled to
			if (("checkbox" === elemtype) && (!elem.is(":checked")) && elem.hasClass("omitunchecked")) {
				return;
			}
			
			var name = elem.attr('name');
			var value = elem.attr('value');

			if (!name ) {
				return;
			}
			// iPhone checkbox hack
			if ($(item).hasClass("on_off")) {
				value = (value == 'on') ? true : false;
			}


			if (!settingMap[name])
			{
				if (options && options.customHandling && options.customHandling.hasOwnProperty(name)) {
					// force data in to an array - whether one or multiple
					if (options.customHandling[name] == 'array') {
						settingMap[name] = [value];
						console.log("its an arr",name,settingMap[name]);
					}
					// convert comma delimited text to an array
					else if (options.customHandling[name] == 'commaarray') {
						var arr = value.split(",");
						settingMap[name] = arr;
						$(settingMap).data(name,'comma');
					}
					else if (options.customHandling[name] == 'boolean') {
						if ((value == 'true')||(value == 'TRUE') || (value =='on')) {
							value = true;
						}
						else {
							value=false;
						}
						settingMap[name] = value;
					}
					else if (options.customHandling[name] == 'omit') {
						return;
					}
					else if (options.customHandling[name] == 'selectall') {
						var value = [];
						elem.find("option").each(function() {
							value[value.length] = $(this).val();
						});
						settingMap[name] = value;
					}


					// no handler - just do normal for now
					else {
						settingMap[name] = value;
					}

				}
				else {
			    		settingMap[name] = value;
				}
			}
			else // exist already
			{
				// if the type is an array, then append to array
				if ($.isArray(settingMap[name])) {
					if ($(settingMap).data(name) == 'comma') {
						var valArr = value.split(",");
						console.log(valArr);
						settingMap[name] = settingMap[name].concat(valArr);
						$(settingMap).data(name,'comma');
					}
					
					else {
						settingMap[name].push(value);
					}
				}
				else {
					// if disabled(or parent disabled) then skip
					// else replace before item
					var temp = $(item);
					
					var bSkiped = false;
					
					while(temp.length != 0)
					{				            
					    if(temp.hasClass('disabled'))
					    {
						bSkiped = true;
						break;
					    }
					    
					    temp = temp.parent();
					}
				
					if(!bSkiped) {
						settingMap[name] = value;
					}
				}
		    	}
		});
				
		console.log("SettingMAP:",settingMap);	
		return settingMap;
	};

	__prepareParams = function(params) {
		if (params) {
			$.extend(options,params);
			// URL serves as read and write URL
			// However, if we were passed a read or write URL that takes precedence
			if (options.URL) {
				if (!params.readURL) {
					options.readURL = options.URL;
				}
				if (!params.writeURL) {
					options.writeURL = options.URL;
				}
			}
		}
		return options;
	};

	methods.init = function(params) {
		if (params) {
			options = __prepareParams(params);
			console.log(options,params);
			if (params["checkboxes"]) {
				for (var i in params["checkboxes"]) {
					if (params["checkboxes"].hasOwnProperty(i)) {
						var j = params.checkboxes[i];
						var item = $(i);
						if (item.length > 0) {
							if (j["checkon"] && j["checkoff"]) {
								item.data('checkon',j['checkon']);
								item.data('checkoff',j['checkoff']);
							}
						}
					}
				}
			}
								
		}

		return this.each(function () {
			var form = $(this);
			var getQueryFieldsFromForm = function (form) {
				var settingArray = [];
				$(':input', form).each(

				function (index, item) {
					var name = $(item).attr('name');
					settingArray.push(name);
				});
				return settingArray;
			};

			var initDependentCheckboxes = function () {
				$('.field_change',form).bind('change keydown click', function (e) {
					var checkboxitem = $(e.target);
					var labelItem = checkboxitem.parent();
					if (labelItem[0].tagName !== 'LABEL') {
						labelItem = checkboxitem;
					}
					var radio = labelItem.prevAll(':radio');
					if (radio.length !== 0) {
						radio.attr('checked','checked');
					}
				});


				$('.disable_unselected_radios input:radio', form).bind('change radiochange', function (e) {
					var radioItem = $(e.target);

					var labelItem = radioItem.parent();
					if (labelItem[0].tagName !== 'LABEL') {
						labelItem = radioItem;
					}
					var radioName = radioItem.attr('name');
					var hiddenItem = labelItem.nextAll(':input');
					
					if (radioItem[0].length !== 0 && hiddenItem.length !== 0) {
						if (radioItem.is(':checked')) {
							hiddenItem.removeAttr('disabled');
							$('input[name='+radioName+']:not(:checked)',form).trigger("radiochange");
						} else {
							hiddenItem.attr('disabled', true);
						}
					}
				});


				// handle regular checkboxes
				$(':checkbox', form).not('.dependent_checkbox').bind('change click', function (e) {
					methods.setCheckboxValue($(this));
				});
				$('.dependent_checkbox', form).bind('change keyup click parentchange', function (e) {
					var checkboxitem = $(e.target);
					
					if (checkboxitem[0].length === 0)return;
					
					// Checkboxes usually have a label. In that case
					// we want siblings of the label
					var labelItem = checkboxitem.parent();
					if (labelItem[0].tagName !== 'LABEL') {
						labelItem = checkboxitem;
					}
				
					var hiddenItem = labelItem.nextAll('.sub_options:first');
				
					if ( hiddenItem.length === 0) {
						methods.setCheckboxValue(checkboxitem);
					} else if (checkboxitem[0].length !== 0 && hiddenItem.length !== 0) {
						if (checkboxitem.is(':checked')) {
							// If the checkbox is checked, the value will be set and box will be checked
							// If the checkbox is not disabled, its children will be made visible
							// only call action once							
							methods.setCheckboxValue(checkboxitem, true);
							
							if (hiddenItem.hasClass('disabled')) {
							    if (!checkboxitem.hasClass('disabled')) {
									$(':input', hiddenItem).removeAttr('disabled');
									$('*', hiddenItem).removeClass('disabled');
									hiddenItem.removeClass('disabled');
									$('.dependent_checkbox', hiddenItem).trigger('parentchange');
									if (hiddenItem.is(":input")) {
										hiddenItem.remoaveAttr('disabled');
									}
								}
							}
						} else {
							// For uncheck, we don't need the disabled check, 
							// everything will be made disabled regardless of the state of the parent checkbox.							
							methods.setCheckboxValue(checkboxitem, false);
						   		
							if (!hiddenItem.hasClass('disabled')) {
								$(':input', hiddenItem).attr('disabled', true);
								$(':not(:input)', hiddenItem).addClass('disabled');
								hiddenItem.addClass('disabled');
								if (hiddenItem.is(":input")) {
									hiddenItem.attr('disabled',true);
								}
							}
						}
					}
				});
			};
			var readSettingsData = function (form) {
				console.log("read setting");
				var queryFields = getQueryFieldsFromForm(form);
				methods.queryMultiInitValue(queryFields, form);
			};
			var writeSettingsData = function (form) {
				console.log("Writing settings...");
				if (form.data('errorCount')) {
					$(document).systemSettings('notification',"invalidentries","mb_error");
					//$(document).popupWin({"dialog":"Please correct invalid Entries", title:"Save Error"});
					return;
				}
				var settings = methods.getSettingsFromForm(form);
				methods.updateMultiSettings(settings, form);
			};
			var initializeForm = function () {
				$('.save_btn', form).attr('disabled','disabled').click(function(e) {
						e.preventDefault();
					    if($(this).attr('disabled') == true || $(this).attr('disabled')=='disabled')return;
						writeSettingsData(form,options.postUpdateFunction);
						return false;
					});
				$('.cancel_btn', form).click( function (e) { // what do we do for cancel?
						readSettingsData(form);
						return false;
					}
				);
				// change here	
				initDependentCheckboxes();
				$('.port',form).each(function() {
					if (!options.validations) {
						options.validations = {};
					}
					options.validations[this.name] = "1-65535";
					var obj = $(this);
					var emsg = !obj.nextAll('.error_msg');
					if (!emsg || emsg.length == 0) {
						$('<span class="error_msg error">Please enter a valid port number</span>').insertAfter(obj);
					}

				});

				console.log("RID:",options.readInitialData);
				if (options.readInitialData) {
					readSettingsData(form);
				}
				else {
					if ($('.save_btn', form).length !== 0) {
					$('.save_btn', form).attr('disabled', 'disabled');
					$('.save_btn', form).addClass('button_disabled');
					$(form).bind('change keydown', function (e) {
						$('.save_btn', form).removeAttr('disabled');
						$('.save_btn', form).removeClass('button_disabled');
						$('#main_content .message_box').fadeOut("fast");
					});
					}
				}
			};
			var validations = function() {
				if (!options.validations) {
					return;
				}
				var v = options.validations;
				var field;
				var elem;
				var action;
				var matches;
				for (field in v) {
					if (v.hasOwnProperty(field)) {
						// elem can be jquery selector or a field name
						elem = $(field);
						if (elem.length == 0) {
							elem = $(':input[name="'+field+'"]');
						}
						// if it is not either, then we ignore it
						if (elem.length == 0) {
							continue;
						}
						action = v[field];
						if (typeof v[field] == 'function') {
							// if we have a function for a certain selector, we bind it
							elem.bind("change validate_fields", function(validationFunc,originalElem) {
								return function(e) {
									// Validation function can return three types of data:
									// 1) bolean - validate the specific field [useful for simple validations of field]
									// 2) object - return a sepcific jquery selector and a result 
									//     - useful when a validation impacts multiple fields (or different fields)
									// 3) an array of selecotr/result pairs - useful when the impact
									//    may be different for different fields
									//
									// The validation field can be a jquery selector with multiple elements
									// 
									var elem = $(e.target);
									var r = validationFunc(e,originalElem);
									var result = r;
									if (typeof r == 'object') {
										if (!r.length) {
											result = [r];
										}
									}
									else {
										result = [{"selector":elem, "result":r}];
									}
									for (i=0;i<result.length;i++) {
										// skip invalid data
										if (!result[i] || !result[i].selector) {
											continue;
										}
										if (result[i].result) {
											result[i].selector.systemSettings('showValid');
										}
										else {
											result[i].selector.systemSettings('showInvalid');
										}
									}
									validationFunc(e,originalElem);
								}
							}(action,elem));
						}
						else if (typeof action === 'string') {
							matches = action.match(/(^\-?[0-9\.]+)\-(\-?[0-9\.]+)/);
							if (matches.length == 3) {
								elem.bind("change validate_fields", function(matchRange) {
									return function(e) {
										var start = matchRange[1]-0;
										var end = matchRange[2]-0;
										var elem = $(e.target);
										var val = elem.val()-0;
										if (elem.val().match(/[^0-9]/) != null) {
											elem.systemSettings('showInvalid');
										}
										else if ((val < start)||(val>end)) {
											elem.systemSettings('showInvalid');
										}
										else {
											elem.systemSettings('showValid');
										}
									}
								}(matches));
							}
						}
					}
				}
				// Default validation for IP Addresses
				$('input[type=text].ipaddress',form).bind("change validate_fields", function(e) {
					// consider disabled fields valid
					var obj = $(e.target);
					var val = obj.val();
					if (obj.attr('disabled')) {
						obj.systemSettings('showValid');
					}
					// not a number is invalid
					else {
						var matches = val.match(/^\s*(\d+)\s*\.\s*(\d+)\s*\.\s*(\d+)\s*\.\s*(\d+)\s*$/);
						var good = true;
						var newVal = '';
						if (matches.length == 5) {
							for (var i=1; i<5;i++) {
								newVal += (i==0) ? "" : ".";
								newVal += matches[i];
								if (matches[i] <0 || matches[i] >255) {
									good = false;
								}
							}
						}
						else {
							good = false;
						}
						if (good) {
							obj.systemSettings('showValid');
						}
						else {
							var emsg = obj.nextAll('.error_msg').eq(0);
							var em2 = obj.nextAll(":input").eq(0).nextAll('.error_msg').eq(0);
							if (!emsg || emsg.length == 0 || emsg == em2) {
								$('<span class="error_msg error">Please enter a valid IP (v4) address</span>').insertAfter(obj);
							}
							obj.systemSettings('showInvalid');
						}
					}
				});


				$('input[type=text].numeric',form).bind("change validate_fields", function(e) {
					// consider disabled fields valid
					var obj = $(e.target);
					var val = obj.val();
					if (obj.attr('disabled')) {
						obj.systemSettings('showValid');
					}
					// not a number is invalid
					else if (isNaN(val)) {
						var emsg = obj.nextAll('.error_msg');
						if (!emsg || emsg.length == 0) {
							$('<span class="error_msg error">Please enter a valid number</span>').insertAfter(obj);
						}
						obj.systemSettings('showInvalid');
					}
					else {
						// its a number, return true
						obj.systemSettings('showValid');
					}
				});
			}
			form.addClass("_systemSettingsForm");
			form.data("errorCount",0);
			console.log("init form");
			initializeForm();
			validations();
		});


	};

	// All methods can be called with $.systemSettings('methodname',{settings:{...},arguments...) or $.settingSettings('methodname',arguments...);
	$.fn.systemSettings = function (method,params) {
		var omitarguments = 1;
		if ( methods[method] ) {
			if (params && params.options) {
				$.extend(options,params.options);
				omitarguments = 2;
			}
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, omitarguments ));
		} else if ( typeof method == 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.systemSettings' );
		}    
	  
	};
})(jQuery);

