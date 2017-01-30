<%@page language="java" buffer="16kb" session="false" isErrorPage="false"%>
<%@page import="com.trendmicro.ds.demo.EventDemos" %>
<%-- 
Copyright (C) 2012 Trend Micro Inc. All rights reserved. 
--%>
<%
String command = request.getParameter("do");
if (command != null) { 
	if (command.equals("EmailSample1")) {
		EventDemos.fireEmail1();
	} else if (command.equals("EmailSample2")) {
		EventDemos.fireEmail2();
	} else if (command.equals("WebSample1")) {
		EventDemos.fireWeb1();
	} else if (command.equals("WebSample2")) {
		EventDemos.fireWeb2();		
	} else if (command.equals("WebSample3")) {
		EventDemos.fireWeb3();		
	} else if (command.equals("WebSample4")) {
		EventDemos.fireWeb4();		
	}
}
%>
<!DOCTYPE html>
<html>
<% if (command.equals("FW")) { %>
<script>
	<%-- Go to port 443 on the same address. We will block that with the agent. The user's browser should be able to access 443 and the Amazon firewall will be down --%>
	window.location = "https://" + window.location.hostname;
</script>
<% } %>
<body>
</body>
</html>