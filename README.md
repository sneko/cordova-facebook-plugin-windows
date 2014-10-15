Presentation
===============================

This plugin is compatible with Cordova apps, which have the same syntax that :
https://github.com/Wizcorp/phonegap-facebook-plugin

So you can use it with mine to cross-platforms apps, there will be no interference.

The plugin can be used without Cordova, if you develop an JavaScript app.

It permit to use Facebook dialogs on Windows platform (version 8.1 minimum). It's a great alternative to FacebookSDK.net which haven't the capacity to display the Facebook UI (requesting, sharing...).

**WARNING! Some disadvantages exist:**


**- This plugin uses the new Windows webview feature, and it's only available for Windows 8.1/Windows Phone 8.1 minimum**

**- Because webviews, you need to put a page on a website to mediate between your Windows app and Facebook servers**

**- To communicate between your app and the website page inside the webview, Microsoft are requiring you use HTTPS (secure connection), so you must have a SSL license (cost minimum 7 dollars/year).**

Setup
===============================

## On your website

Upload the "website" directory on your server. Remember, you need to have a valid SSL certificate! Keep in mind the full URL of your uploaded directory.

Example: https://www.YOURPLUGINURL.com/myplugin/

## In Facebook Settings

After create an app on https://developers.facebook.com/ , go in "Settings > Advanced". Switch "Client OAuth Login" to ON and add the following URL into the "Valid OAuth redirect URIs :

https://www.YOURPLUGINURL.com/myplugin/login_success.html


## In app

In your Cordova project, put the "/windows/facebookConnectPlugin.js" in the "www/js" directory into your Windows app. Then, modify this file and replace the "hrefPlugin" url.

To authorize external communication, replace the following URL with yours (keep the "/manager.html"), add this code in "package.windows.appxmanifest" under this *< Application Id="..." StartPage="www/index.html" >* tag :
```
<ApplicationContentUriRules>
  <Rule Match="https://www.YOURPLUGINURL.com/myplugin/manager.html" Type="include"/>
</ApplicationContentUriRules>
```

It's almost over :)...

To finish, I joined a little sample to know when the full plugin is loaded. You are able to call functions which present in the cross-platform Facebook Plugin for Cordova.

Here the code :

```
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>Sample</title>
	</head>
	<body>
		<div>
		  Hi, it's just a Sample !
		</div>
		<script src="cordova.js"></script> // Include the required file to Cordova
		<script src="js/facebookConnectPlugin.js"></script> // Include 
		<script>
  	if (window.cordova && window.cordova.platformId == "windows") { // Check if it is the W/WP 8.1 or more
		facebookMan.manager.addEventListener("MSWebViewNavigationCompleted", function () { // Detect when the webview is totally loaded
			facebookConnectPlugin.windowsInit("YOUR APP ID"); // Init the process with your Facebook App ID

			facebookConnectPlugin.getLoginStatus(function (response) { // Basic using example
		      		console.log(response);
		      	}, function (response) {
		      		console.log(response);
		      	});
      	
      			// Put what you want!
		});
	}
		</script>
	</body>
</html>

```

Maybe the directory will be included in the cross-platform plugin if it is of interest to you:
https://github.com/Wizcorp/phonegap-facebook-plugin

Due to my studies, I haven't been able to resolve all the little problems.


*2014 - Created by Thomas Ramé*
