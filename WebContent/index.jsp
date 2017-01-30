<%@page language="java" buffer="16kb" session="false" isErrorPage="false" pageEncoding="UTF-8" %>
<%-- 
Copyright (C) 2012 Trend Micro Inc. All rights reserved. 
--%>
<!DOCTYPE html>
<html>
<head>
<title>Deep Discovery Demo</title>
<meta name="robots" content="noindex, nofollow">
<meta http-equiv="imagetoolbar" content="no">
<link rel="stylesheet" type="text/css" href="customstyles/signin_v5.css" />
<link rel="stylesheet" type="text/css" href="lib/bootstrap/bootstrap.css" />
<link href='https://fonts.googleapis.com/css?family=Raleway:200,400,700,800' rel='stylesheet' type='text/css'>
<style>
body {
	background-color: #FFFFFF;
	padding-bottom: 0px;
}

#login_body,#login_body #tm_header {
	background-color: #FFFFFF;
}

.tm_logo {
    width: 350px;
}

.mainBox {
	margin-top: 15px;
	margin: bottom:10px;
	width: 950px;
	left: 50%;
}

.contentBox {
	background-color: #fafafa;
	margin-top: 8px;
	border-radius: 5px;
	border: 1px solid #dddddd;
	height: 300px;
}

.leftBox {
	padding: 15px;
	width: 555px;
	float: left;

}

.rightBox {
	background-color: #eeeeee;
	width: 260px;
	height: 300px;
	float: right;
	border-left: 1px solid #dddddd;
}

label {
	width: 120px;
}

input,textarea,select,.uneditable-input {
	width: 190px;
}

.noRoundingTopRight {
	-webkit-border-top-right-radius: 0;
	-moz-border-radius-topright: 0;
	border-top-right-radius: 0;
}

.noRoundingTopLeft {
	-webkit-border-top-left-radius: 0;
	-moz-border-radius-topleft: 0;
	border-top-left-radius: 0;
}

.boldSection {
	color: #004e78;
	font-family: 'Raleway', sans-serif; 
	font-weight: 700;
}
.titleSection {
	color: #000000;
	font-family: 'Raleway', sans-serif; 
	font-weight: 800;
	font-size:25px;

}

#content-bk {
	height: 250px;
	background: #e5edf1 url(images/content_bk_250.png) repeat-x center top;
}
#content-container {
	width: 976px;
	margin: 0 auto;
	position:relative;
}
#content-arrow {
	height:16px;
	width:32px;
	margin-left:16px;
	background: url(images/content_arrow.png) no-repeat center top;
} 
#content-description {
	padding-top:32px;
	padding-left:32px;
	font-family: 'Raleway', sans-serif; 
	font-weight: 400;
	font-size:15px;
	width:650px;
}

#logo-container {
	padding-top:27px;
	padding-bottom:21px;
	width: 976px;
	margin: 0 auto;
}

#modules-bk {
	background-color:#FFFFFF;
}
#modules-container {
	width: 976px;
	margin: 0 auto;
}
#modules-arrow {
	height:16px;
	width:32px;
	margin-left:16px;
	background: url(images/white_arrow.png) no-repeat center top;
} 
#footer-bk {
	height: 123px;
	background: #e5edf1 url(images/footer_bk.png) repeat-x center top;
}
#footer-container {
	width: 976px;
	margin: 0 auto;
}
#footer-arrow {
	height:16px;
	width:32px;
	margin-left:16px;
	background: url(images/footer_arrow.png) no-repeat center top;
} 

.moduleTitleSection {
	height:64px;
	padding-top:8px;
	vertical-align:middle;
}
.moduleImage {
	cursor: pointer;
}
.moduleTitle {
	font-family: 'Raleway', sans-serif; 
	font-weight: 400;
	font-size:24px;
	padding-top:20px;
	padding-left:3px;
	cursor: pointer;

}
.moduleText {
	font-family: 'Raleway', sans-serif; 
	font-weight: 400;
	font-size:14px;
	color:#004e78;
	background: url(images/mod_left.png) no-repeat left top;
	padding-left:58px;
	padding-top:2px;
	padding-bottom:5px;
	width: 670px;
	margin-left:25px;
	overflow:hidden;
	height:150px;
}
.moduleTextInner {
	padding-top:3px;
	height:100px;
}
.moduleBottom {
	background: url(images/mod_footer.png) no-repeat left top;
	height:8px;
	width:890px;
	padding-bottom:8px;
	margin-left:25px;
}
.link {
	color:#FFFFFF;
	font-family: 'Raleway', sans-serif; 
	font-weight: 400;
	font-size:11px;
}
.link:visited {
	color:#FFFFFF;
}
.link:hover {
	color:#CCCCCC;
}
.nonlink {
	color:#FFFFFF;
	font-family: 'Raleway', sans-serif; 
	font-weight: 400;
	font-size:11px;
}
.sep {
	color:#000000;
	font-family: 'Raleway', sans-serif; 
	font-weight: 400;
	font-size:11px;

}


</style>
<script>
	function b1() {
		window.location = 'samples/malwaresample1.exe'
		invoke("do=" + "WebSample1");
		modalOpenDialog(
				"Web Sample #1",
				"Sample has been sent and refreshed.",
				{
					"Close": function() {}
				});
	}
	function b2() {
		window.location = 'samples/malwaresample2.exe'
		invoke("do=" + "WebSample2");
		modalOpenDialog(
				"Web Sample #2",
				"Sample has been sent and refreshed.",
				{
					"Close": function() {}
				});
	}
	function b3() {
		window.location = 'samples/malwaresample3.exe'
		invoke("do=" + "WebSample3");
		modalOpenDialog(
				"Web Sample #3",
				"Sample has been sent and refreshed.",
				{
					"Close": function() {}
				});
	}
	function b4() {
		window.location = 'samples/malwaresample4.exe'
		invoke("do=" + "WebSample4");
		modalOpenDialog(
				"Web Sample #4",
				"Sample has been sent and refreshed.",
				{
					"Close": function() {}
				});
	}		
	function b5() {
		invoke("do=" + "EmailSample1");
		modalOpenDialog(
				"Email Sample #1",
				"To be implemented.",
				{
					"Close": function() {}
				});						
	}
	function b6() {
		invoke("do=" + "EmailSample2");
		modalOpenDialog(
				"Email Sample #2",
				"To be implemented.",
				{
					"Close": function() {}
				});						
	}
	var __iframeNumber = 0;
	function invoke(query) {
		var n = __iframeNumber++;
		$('<'+'iframe id="iframe_'+n+'" '+'/'+'>').appendTo('body');
		$('#iframe_'+n).attr('src', "test.jsp?" + query);
		$('#iframe_'+n).hide();
	}

</script>

</head>
<body id="login_body" style="height: 100%;">
	
	
	

	
	<div id="content-bk">
		<div id="content-container">
			
							<div id="content-description">
					<img src="images/TrendLogo.gif">&nbsp;&nbsp;&nbsp;		
					<br/><br/>		
					<span class="titleSection">Deep Discovery Demo</span>
					<br/><br/>
					This demo environment provides access to benign malware samples that can be used to demonstrate or evaluate the capabilities of Trend Micro's Deep Discovery product. The samples can be distributed in one of two ways. The first is via web download which will cause your web browser to download the sample using the HTTP protocol. The second allows you to send the sample via SMTP to an email address of your choice.
					<br />
					<br />
							
							
								<br/>
								<br/>
							</div>
								
		</div>
	</div>
	
	<div id="modules-bk">
		<div id="modules-container">
			<div id="modules-arrow"></div>
	
			<div class="moduleTitleSection">
				<table>
					<tbody>
						<tr>
							<td style="width:65px;"><img class="moduleImage" src="images/mod_wr.png"></td>
							<td><div class="moduleTitle">Web Downloads</div></td>
						</tr>
					</tbody>
				</table>
			</div>
			<div id="module1" class="moduleText">
				<div class="moduleTextInner">
					<span class="blueText">Clicking on one of the following buttons will retrieve a malware sample that will be detected through the virtual analysis functionality of the Deep Discovery solution. Samples #3 and #4 require you to configure the DDI to analyze files larger than 5MB. Sample #4 is a 64-bit sample and would require a 64-bit sandbox image to be imported. Refreshed after every download.<br /><br /><input id="t1" name="t1" type="button" onclick="b1();" value="Download Sample #1" class="btn primary" style="width:250px" />&nbsp;&nbsp;&nbsp;<input id="t2" name="t2" type="button" onclick="b2();" value="Download Sample #2" class="btn primary" style="width:250px" /><input id="t3" name="t3" type="button" onclick="b3();" value="Download Sample #3" class="btn primary" style="width:250px" />&nbsp;&nbsp;&nbsp;<input id="t4" name="t4" type="button" onclick="b4();" value="Download Sample #4" class="btn primary" style="width:250px" /></span>
				</div>
			</div>
			<div class="moduleBottom"></div>
		
			<div class="moduleTitleSection">
				<table>
					<tbody>
						<tr>
							<td style="width:65px;"><img class="moduleImage" src="images/mod_am.png"></td>
							<td><div class="moduleTitle">Email Attachments</div></td>
						</tr>
					</tbody>
				</table>
			</div>
			<div id="module2" class="moduleText">
				<div class="moduleTextInner">
					<span class="blueText">Clicking on one of the following buttons will email a malware sample that will be detected through the virtual analysis functionality of the Deep Discovery solution. Refreshed after every download.<br /><br /><input id="t5" name="t5" type="button" onclick="b5();" value="Email Sample #1" class="btn primary" style="width:250px" />&nbsp;&nbsp;&nbsp;<input id="t6" name="t6" type="button" onclick="b6();" value="Email Sample #2" class="btn primary" style="width:250px" /></span>
				</div>
			</div>
			<div class="moduleBottom"></div>
		
			<br />
		</div>
	</div>
	<div id="footer-bk">
		<div id="footer-container">
			<div id="footer-arrow"></div>
			<div style="text-align: center;">
				<br /><br />
				<div style="text-align: center">
					<span class="nonlink">
						Copyright (C) 2014 Trend Micro Inc. All rights reserved
					</span>
				</div>
			</div>
		</div>
	</div>


 
	







	<%-- IE's version strings are confusing. For example, IE 8 reports in its useragent that its version is 7. This conditional
 			comment allows us to test for the presence of the div in JavaScript to determine if the IE version is acceptable.
 			However, IE 10 has dropped conditional comments, so the div is only present in IE 8/9. IE 10 needs a different test. --%>
	<!--[if gte IE 8]>
			<div id="ieIsAcceptableVersionDiv" style="display:none"></div>
		<![endif]-->

	<!-- jQuery Start -->
	<script src="lib/jquery/jquery-1.7.1.js"></script>
	<script src="lib/jquery/jquery-ui-1.8.17.custom.js"></script>
	<!-- jQuery End -->
	<script src="scripts/common.js"></script>
	<script src="scripts/bootstrap-modal.js"></script>

	<script type="text/javascript">
		 ;(function($) {
			$(document).ready(function () {

			
			});			
		})(jQuery);
		</script>
	<!-- Navigation JS End -->
</body>
</html>
