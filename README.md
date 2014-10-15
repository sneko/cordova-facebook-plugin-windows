Presentation
===============================

This plugin is compatible with Cordova apps, which have the same syntax that :
https://github.com/Wizcorp/phonegap-facebook-plugin

So you can use it with mine, there will be no interference.

The plugin can be used without Cordova, if you develop an JavaScript app.

It permit to use Facebook dialogs on Windows platform (version 8.1 minimum). It's a great alternative to FacebookSDK.net which haven't the capacity to display the Facebook UI (requesting, sharing...).

**WARNING! Some disadvantages exist:**


**- This pluging uses the new Windows webview feature, and it's only available for Windows 8.1/Windows Phone 8.1 minimum**

**- Because webviews, you need to put a page on a website to mediate between your Windows app and Facebook servers**

**- To communicate between your app and the website page inside the webview, Microsoft are requiring you use HTTPS (secure connection), so you must have a SSL license (cost minimum 7 dollars/year).**

Setup
===============================

## On your website

Upload the "website" directory on your server. Remember, you need to have a valid SSL certificate! 


## In app

In your Cordova project, put the "/windows/facebookConnectPlugin.js" in the "www/js" directory into your Windows app. Then, modify this file and replace the "hrefPlugin" url.

To authorize external communication, add this code in "package.windows.appxmanifest" under this *<Application Id="..." StartPage="www/index.html">* tag :
```
<ApplicationContentUriRules>
  <Rule Match="https://www.YOURPLUGINURL.com/manager.html" Type="include"/>
</ApplicationContentUriRules>
```

It's almost over :)...

To finish, add fb-root div and include the facebookConnectPlugin.js with script tag. I joined a little sample to know when the full plugin is loaded. You can have more information about available functions cross-platform Facebook Plugin for Cordova.

Here the code :

```
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>Laby</title>
	</head>
	<body>
		<div id="fb-root"></div>
		<div>
		  Hi, it's just a Sample !
		</div>
		<script src="cordova.js"></script>
		<script src="js/facebookConnectPlugin.js"></script>
		<script>
  if (window.cordova && window.cordova.platformId == "windows") {
		facebookMan.manager.addEventListener("MSWebViewNavigationCompleted", function () {
			facebookConnectPlugin.windowsInit("YOUR APP ID");

				facebookConnectPlugin.getLoginStatus(function (response) {
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

Maybe the directory will be included in cross-platform plugin:
https://github.com/Wizcorp/phonegap-facebook-plugin

Due to my studies, I haven't been able to resolve all the little problems.
