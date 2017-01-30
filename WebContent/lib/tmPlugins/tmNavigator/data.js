var tmNavigator_data= {
    children: [
        {
			id: 1,
			title: 'Home',
			url: 'index.html',
			status: 'show',
			children: []
		},
        {
			id: 6,
			title: 'Login',
			url: 'login.html',
			status: 'show',
			children: []
		},
        {
			id: 2,
			title: 'Dashboard',
			url: 'dashboard.html',
			status: 'show',
			children: []
		},
        {
			id: 7,
			title: 'Portal',
			url: 'portal.html',
			status: 'show',
			children: []
		},
        {
			id: 3,
			title: 'Documentation',
			url: 'docs/index.html',
			status: 'show',
			children: []
		},
        {
			id: 4,
			title: 'Javascripts',
			url: null,
			click: function(){	
				document.location.href= "docs/javascript.html";
			},
			status: 'show',
			children: []
		},
		{
			id: 5, 
			title: 'Dropdown',
			url: null,
			status: 'show',
			children: [
				{ id: 301, title: 'Alerts', url: null, status: 'show', children:[
						{ id: 30101, title: 'Alerting Rules', url: 'alerting_rules.php', status: 'show', children:[] },
						{ id: 30102, title: 'Triggered Alerts', url: 'triggered_alerts.php', status: 'show', children:[] },
						{ id: 30103, title: 'Alert Settings', url: 'alert_settings.php', status: 'show', children:[] }
					] 
				},
				{ id: 302, title: 'Reports', url: null, status: 'show', children:[
						{ id: 30201, title: 'Report Templates', url: 'report_templates.php', status: 'show', children:[] },
	            		{ id: 30202, title: 'Scheduled Reports', url: 'scheduled_reports.php', status: 'show', children:[] },
						{ id: 30203, title: 'Generated Reports', url: 'generated_reports.php', status: 'show', children:[] }
					]
				},
				{ id: 30204, title: 'Customization', url: null, status: 'show', children:[
					{ id: 3020401, title: 'Alerts / Reports Customization', url: 'alert_report_customizations.php', status: 'show', children:[] }
					]
				}
			]
		}    
    ]
}
