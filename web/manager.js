"use strict";

/*
 * @author Thomas Ramé
 * @copyright THR 2014 (www.thr.pm)
 */

function getLoginStatus(callbackId, force) {
    // Try will catch errors when SDK has not been init
    try {
        FB.getLoginStatus(function (response) {
            window.external.notify(JSON.stringify({
                exec: 'success',
                callbackId: callbackId,
                response: response
            }));
        }, force);
    } catch (error) {
        window.external.notify(JSON.stringify({
            exec: 'error',
            callbackId: callbackId,
            response: error
        }));
    }
}

function showDialog(options, callbackId) {
    options = JSON.parse(options);

    if (!options.name) {
        options.name = "";
    }
    if (!options.message) {
        options.message = "";
    }
    if (!options.caption) {
        options.caption = "";
    }
    if (!options.description) {
        options.description = "";
    }
    if (!options.link) {
        options.link = "";
    }
    if (!options.picture) {
        options.picture = "";
    }
    
    // Try will catch errors when SDK has not been init
    try {
        FB.ui({
            method: options.method,
            message: options.message,
            name: options.name,
            caption: options.caption,
            description: (
                options.description
            ),
            link: options.link,
            // JS SDK expects href and not link
            href: options.link,
            picture: options.picture
        },
        function (response) {
            if (response && (response.request || !response.error_code)) {
                window.external.notify(JSON.stringify({
                    exec: 'success',
                    callbackId: callbackId,
                    type: "showDialog",
                    response: response
                }));
            } else {
                window.external.notify(JSON.stringify({
                    exec: 'fail',
                    callbackId: callbackId,
                    type: "showDialog",
                    response: response
                }));
            }
        });
    } catch (error) {
        window.external.notify(JSON.stringify({
            exec: 'error',
            callbackId: callbackId,
            type: "showDialog",
            response: error
        }));
    }
}

function getAccessToken(callbackId) {
    var response = FB.getAccessToken();
    if (!response) {
        window.external.notify(JSON.stringify({
            exec: 'error',
            callbackId: callbackId,
            response: "NO_TOKEN"
        }));
    } else {
        window.external.notify(JSON.stringify({
            exec: 'success',
            callbackId: callbackId,
            response: response
        }));
    }
}

function logEvent(eventName, params, valueToSum, callbackId) {
    // AppEvents are not avaliable in JS.
    window.external.notify(JSON.stringify({
        exec: 'success',
        callbackId: callbackId
    }));
}

function logPurchase(value, currency, callbackId) {
    // AppEvents are not avaliable in JS.
    window.external.notify(JSON.stringify({
        exec: 'success',
        callbackId: callbackId
    }));
}

function logout(callbackId) {
    // Try will catch errors when SDK has not been init
    try {
        FB.logout( function (response) {
            window.external.notify(JSON.stringify({
                exec: 'success',
                callbackId: callbackId,
                response: response
            }));
        });
    } catch (error) {
        window.external.notify(JSON.stringify({
            exec: 'error',
            callbackId: callbackId,
            response: error
        }));
    }
}

function api(graphPath, permissions, callbackId) {
    // JS API does not take additional permissions
    
    // Try will catch errors when SDK has not been init
    try {
        FB.api(graphPath, function (response) {
            if (response.error) {
                window.external.notify(JSON.stringify({
                    exec: 'fail',
                    callbackId: callbackId,
                    response: response
                }));
            } else {
                window.external.notify(JSON.stringify({
                    exec: 'success',
                    callbackId: callbackId,
                    response: response
                }));
            }
        });
    } catch (error) {
        window.external.notify(JSON.stringify({
            exec: 'error',
            callbackId: callbackId,
            response: error
        }));
    }
}

// Browser wrapper API ONLY
function browserInit(appId, version) {
    if (!version) {
        version = "v2.0";
    }
    FB.init({
        appId      : appId,
        cookie     : true,
        xfbml      : true,
        version    : version
    })
}
