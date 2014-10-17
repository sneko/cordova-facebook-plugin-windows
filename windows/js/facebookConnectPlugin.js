"use strict";

/*
 * @author Thomas Ramé
 * @copyright THR 2014 (www.thr.pm)
 */


if (window.cordova && window.cordova.platformId == "windows") {
    var facebookMan = {
        hrefPlugin: "https://www.YOURPLUGINURL.com/myplugin/", // Only https:// link, don't forget the end "/" like a directory
        appId: "",
        ai: 0, // Auto-increment for waiting functions
        functions: {},
        storeFunctions: function (success, fail) {
            if (!fail) {
                fail = null;
            }

            facebookMan.functions[++facebookMan.ai] = { s: success, f: fail };

            return facebookMan.ai;
        },
        cancelLogin: function (e) {
            facebookMan.login.style.display = "none";

            facebookMan.scriptNotify({
                value: JSON.stringify({
                    exec: 'error',
                    callbackId: e.value,
                    response: {
                        status: 'unknown'
                    }
                })
            });
        },
        scriptNotify: function (e) {
            var data = JSON.parse(e.value);

            if ("exec" in data) {
                var cId = data.callbackId;

                if (!data.response) {
                    data.response = null;
                }

                if ("type" in data && data.type == "showDialog") {
                    facebookMan.manager.style.display = "none";
                }

                if (cId in facebookMan.functions) {
                    switch (data.exec) {
                        case "success":
                            facebookMan.functions[cId].s(data.response);
                            break;
                        case "fail":
                            facebookMan.functions[cId].f(data.response);
                            break;
                        case "error":
                            if (!facebookMan.functions[cId].f) {
                                console.error(data.response.message);
                            } else {
                                facebookMan.functions[cId].f(data.response);
                            }
                            break;
                        default:
                            return;
                    }

                    delete facebookMan.functions[cId];
                }
            }
        }
    };

    var fbman_body = document.getElementsByTagName('body')[0];

    var fbman_m = document.createElement('x-ms-webview');
    var fbman_l = document.createElement('x-ms-webview');

    fbman_m.id = "wb_manager";
    fbman_l.id = "wb_login";

    facebookMan.manager = fbman_body.appendChild(fbman_m);
    facebookMan.login = fbman_body.appendChild(fbman_l);

    facebookMan.manager.addEventListener("MSWebViewScriptNotify", facebookMan.scriptNotify);
    facebookMan.manager.navigate(facebookMan.hrefPlugin + "manager.html");
    
    facebookMan.login.addEventListener("MSWebViewScriptNotify", facebookMan.cancelLogin);

    facebookMan.login.addEventListener("MSWebViewNavigationCompleted", function () {
        var src = facebookMan.login.src;

        if (!/callback_id/.test(src)) {
            return;
        }

        var cI = /[\\?&]callback_id=([^&#]*)/.exec(src);

        if (!cI) {
            cI = /[\\?&]callback_id=([^&#]*)/.exec(decodeURIComponent(decodeURIComponent(src)));

            if (!cI) {
                return;
            }
        }

        var callbackId = cI[1];

        facebookMan.login.invokeScriptAsync("eval", "document.querySelector('input[name=\"cancel\"]').onclick=function(){window.external.notify(\"" + callbackId + "\");};").start();

        if (src.substr(0, facebookMan.hrefPlugin.length) == facebookMan.hrefPlugin) {
            facebookMan.login.style.display = "none";

            facebookConnectPlugin.getLoginStatus(function (response) {
                facebookMan.scriptNotify({
                    value: JSON.stringify({
                        exec: 'success',
                        callbackId: callbackId,
                        response: {
                            status: 'connected'
                        }
                    })
                });
            }, true);
        }
    });

    // This should override the existing facebookConnectPlugin object created from cordova_plugins.js
    var facebookConnectPlugin = {
        getLoginStatus: function (s, f) {
            var force = (f === true) ? true : false;

            var callbackId = facebookMan.storeFunctions(s, f);
            facebookMan.manager.invokeScriptAsync("getLoginStatus", callbackId, force).start();
        },

        showDialog: function (options, s, f) {
            var callbackId = facebookMan.storeFunctions(s, f);

            facebookMan.manager.style.display = "block";
            facebookMan.manager.invokeScriptAsync("showDialog", JSON.stringify(options), callbackId).start();
        },
        // Attach this to a UI element, this requires user interaction.
        login: function (permissions, s, f) {
            var callbackId = facebookMan.storeFunctions(s, f);

            facebookMan.login.navigate("https://www.facebook.com/dialog/oauth?client_id=" + facebookMan.appId + "&display=popup&scope=" + permissions.toString() + "&response_type=token&redirect_uri=" + facebookMan.hrefPlugin + "login_success.html?callback_id=" + callbackId);

            facebookMan.login.style.display = "block";
        },

        getAccessToken: function (s, f) {
            var callbackId = facebookMan.storeFunctions(s, f);
            facebookMan.manager.invokeScriptAsync("getAccessToken", callbackId).start();
        },

        logEvent: function (eventName, params, valueToSum, s, f) {
            // AppEvents are not avaliable in JS.
            s();
        },

        logPurchase: function (value, currency, s, f) {
            // AppEvents are not avaliable in JS.
            s();
        },

        logout: function (s, f) {
            var callbackId = facebookMan.storeFunctions(s, f);
            facebookMan.manager.invokeScriptAsync("logout", callbackId).start();
        },

        api: function (graphPath, permissions, s, f) {
                        var callbackId = facebookMan.storeFunctions(s, f);
            facebookMan.manager.invokeScriptAsync("api", graphPath, JSON.stringify(permissions), callbackId).start();
        },

        // Windows wrapper API ONLY (only on Windows 8.1 and Windows Phone 8.1 minimum)
        windowsInit: function (appId, version) {
            if (!version) {
                version = "v2.0";
            }

            facebookMan.appId = appId;

            facebookMan.manager.invokeScriptAsync("browserInit", appId, version).start();
        }
    };
}
