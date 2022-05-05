(function ($) {

    $.jq_easy_session_timeout = function (userSettings) {

        let defaultSettings = {
            activityEvents: 'click keypress scroll wheel mousewheel mousemove',
            applicationId: 'easy_session_time_out',
            dialogMessage: 'Due to inactivity, the session will timeout shortly...',
            dialogTimeRemainingLabel: 'TIME REMAINING',
            dialogTitle: 'SESSION TIMEOUT WARNING',
            documentTitle: null,
            heartbeatCallback: null,
            heartbeatUrl: window.location.href,
            heartRate: 30,
            inactivityLogoutUrl: 'https://www.google.com',
            inactivityDialogDuration: 60,
            localStoragePrefix: null,
            logoutNowButtonText: 'LOG OUT',
            manualLogoutUrl: null,
            maxInactivitySeconds: 240,
            stayLoggedInButtonText: 'REMAIN LOGGED IN'
        };

        let settings = $.extend({}, defaultSettings, userSettings);

        settings.documentTitle = settings.documentTitle || settings.dialogTitle;
        settings.localStoragePrefix = settings.localStoragePrefix || settings.applicationId;
        settings.manualLogoutUrl = settings.manualLogoutUrl || settings.inactivityLogoutUrl;

        let sessionStartTime;
        let heartbeatTimer;
        let inactivityTimer;
        let originalPageTitle = document.title;
        let localStorage = {};
        
        let heartbeat = function (heartbeat_url) {
            $.get(heartbeat_url, function(data, textStatus, jqXHR) {
                if ($.isFunction(settings.heartbeatCallback)) {
                    settings.heartbeatCallback(data, textStatus, jqXHR);
                }
            });
        }
        
        let startHeartbeatTimer = function () {
            heartbeatTimer = setInterval(
                function () {
                    heartbeat(settings.heartbeatUrl);
                },
                (settings.heartRate * 1000)
            );
        }
        
        let stopHeartbeatTimer = function () {
            clearInterval(heartbeatTimer);
        }
        
        let checkInactivity = function () {
            let loggedOutStatus = getLoggedOutStatus();
            let sessionStartTime = getSessionStartTime();
            if (typeof loggedOutStatus === 'boolean' && typeof sessionStartTime === 'number') {
                if (loggedOutStatus) {
                    logout();
                } else {
                    let elapsedSeconds = Math.floor(((new Date()).getTime() - sessionStartTime) / 1000);
                    let remainingSeconds = (settings.maxInactivitySeconds - elapsedSeconds);
                    let secondsLabel = (remainingSeconds == 1) ? 'second' : 'seconds';
                    $('#jquery-idle-hands-time-remaining').text(
                        remainingSeconds + ' ' + secondsLabel
                    );
                    if (elapsedSeconds > settings.maxInactivitySeconds) {
                        logout(settings.inactivityLogoutUrl);
                    } else if (remainingSeconds <= settings.inactivityDialogDuration) {
                        $(document).off(settings.activityEvents, activityHandler);
                        showDialog();
                    } else {
                        hideDialog();
                    }
                }
            }
        }
        
        let startInactivityTimer = function () {
            setSessionStartTime((new Date()).getTime());
            inactivityTimer = setInterval(checkInactivity, 1000);
        };
        
        let stopInactivityTimer = function () {
            clearInterval(inactivityTimer);
        }
        
        let restartInactivityTimer = function () {
            stopInactivityTimer();
            startInactivityTimer();
        }
        
        let activityHandler = function (event) {
            restartInactivityTimer();
        }
        
        let initializeLocalStorage = function () {
            let config = {
                namespace: settings.localStoragePrefix,
                keyDelimiter: '.'
            };   
            localStorage.basil = new window.Basil(config);
            flushLocalStorage();
        }
        
        localStorage.set = function (key, value) {
            localStorage.basil.set(key, value);
        }
        
        localStorage.get = function (key) {
            return localStorage.basil.get(key);
        }
        
        localStorage.flush = function () {
            localStorage.basil.reset();
        }
        
        let setSessionStartTime = function (time) {
            localStorage.set('sessionStartTime', time);
            sessionStartTime = time;
        }
        
        let getSessionStartTime = function () {
            return localStorage.get('sessionStartTime');
        }
        
        let setLogoutUrl = function (logoutUrl) {
            localStorage.set('logoutUrl', logoutUrl);
        }
        
        let getLogoutUrl = function () {
            return localStorage.get('logoutUrl');
        }
        
        let flushLocalStorage = function () {
            localStorage.flush();
        }
        
        let setLoggedOutStatus = function (loggedOutStatus) {
            localStorage.set('loggedOutStatus', loggedOutStatus);
        }
        
        let getLoggedOutStatus = function () {
            return localStorage.get('loggedOutStatus');
        }
        
        let createDialog = function () {
            let dialogContainer = '<div id="jquery-idle-hands">' +
                                  '<div id="jquery-idle-hands-overlay"></div>' +
                                  '<div id="jquery-idle-hands-dialog">' +
                                  '<div id="jquery-idle-hands-dialog-title">' + settings.dialogTitle + '</div>' +
                                  '<div id="jquery-idle-hands-message-container">' +
                                  '<p id="jquery-idle-hands-message">' + settings.dialogMessage + '</p>' +
                                  '<p id="jquery-idle-hands-time-remaining-label">' + (settings.dialogTimeRemainingLabel + ': ') +
                                  '<span id="jquery-idle-hands-time-remaining"></span>' +
                                  '</p>' +
                                  '</div>' +
                                  '<hr/>' +
                                  '<div id="jquery-idle-hands-button-container">' +
                                  '<button id="jquery-idle-hands-stay-logged-in-button">' + settings.stayLoggedInButtonText + '</button>' +
                                  '<button id="jquery-idle-hands-logout-button">' + settings.logoutNowButtonText + '</button>' +
                                  '</div>' +
                                  '</div>' +
                                  '</div>';

            $('body').append(dialogContainer);
            
            $('#jquery-idle-hands-stay-logged-in-button').on('click', function (event) {
                event.stopPropagation();
                stayLoggedIn();
            });
            
            $('#jquery-idle-hands-logout-button').on('click', function (event) {
                event.stopPropagation();
                logout(settings.manualLogoutUrl);
            });
        }
        
        let showDialog = function () {
            document.title = settings.documentTitle;
            $('#jquery-idle-hands').show(function () {
                //$('#jquery-idle-hands button').first().focus();
            });
        }
        
        let hideDialog = function () {
            document.title = originalPageTitle;
            $('#jquery-idle-hands').hide();
        }
        
        let logout = function (logoutUrl) {
            if (logoutUrl) {
                setLogoutUrl(logoutUrl);
            } else {
                logoutUrl = getLogoutUrl();
            }
            if (logoutUrl) 
            {
                setLoggedOutStatus(true);
                stopHeartbeatTimer();
                stopInactivityTimer();
                $('#jquery-idle-hands-dialog').hide();
                if (typeof logoutUrl == 'function')
                {
                    logoutUrl('logoutUrl');
                }
                else
                {
                    window.location = logoutUrl;
                }
            }
        }
        
        let stayLoggedIn = function () {
            flushLocalStorage();
            setLoggedOutStatus(false);
            restartInactivityTimer();
            $(document).on(settings.activityEvents, activityHandler);
            hideDialog();
        }
        
        let css = function(){
            var s1 ="#jquery-idle-hands{display:none;margin:0!important;padding:0!important;font-family:Roboto,Verdana,sans-serif!important;line-height:1.5!important;color:#333}#jquery-idle-hands-overlay{position:fixed!important;width:100%!important;height:100%!important;top:0!important;left:0!important;right:0!important;bottom:0!important;b1ackground-color:rgba(0,0,0,.25)!important;background-color:rgb(0 0 0 / 82%)!important;z-index:1001!important;margin:0!important;margin:0!important}#jquery-idle-hands-dialog{position:absolute!important;top:50%!important;left:50%!important;transform:translate(-50%,-50%)!important;z-index:1002!important;background-color:#fff!important;border-radius:4px!important;padding:4px!important;margin:0!important;min-width:300px!important;border:1px solid #000;font-family:Roboto,Verdana,sans-serif!important;line-height:1.5!important;color:#333}#jquery-idle-hands-dialog-title{color:#fff!important;text-align:center!important;background-color:red!important;border-radius:4px!important;padding:4px!important;margin:4px!important;text-align:center!important;line-height:1.5!important;font-family:Roboto,Verdana,sans-serif!important;font-size:16px}#jquery-idle-hands-message-container p{padding:0!important;margin:14px!important;text-align:left!important;line-height:1.5!important;font-family:Roboto,Verdana,sans-serif!important;color:#333;font-size:14px}#jquery-idle-hands hr{padding:0!important;margin:0 0 4px 0!important;border:1px solid silver!important;border-bottom:none!important;font-family:Roboto,Verdana,sans-serif!important;color:#333;line-height:1.5!important;height:1px!important}#jquery-idle-hands-button-container{text-align:center!important;margin:0!important;padding:0!important;font-family:Roboto,Verdana,sans-serif!important;color:#333;line-height:1.5!important}#jquery-idle-hands-button-container button{width:40%!important;padding:5px 0!important;font-size:14px;margin:5px 10px!important;line-height:1.5!important;font-family:Roboto,Verdana,sans-serif!important;color:#333}#jquery-idle-hands-stay-logged-in-button{background-color:green!important;color:#fff!important}";
            var str = ''
            +'<div class="session_logout">'
                +'<style>'
                    + s1
                +'</style>'
            +'</div>';
            $(str).appendTo('body');
        }
        
        let initialize = function () {
            css();
            initializeLocalStorage();
            setLoggedOutStatus(false);
            $(document).on(settings.activityEvents, activityHandler);
            createDialog();
            startHeartbeatTimer();
            startInactivityTimer();
        }
        
        $(document).ready(function($) 
        {
           $.getScript('https://cdnjs.cloudflare.com/ajax/libs/basil.js/0.4.10/basil.min.js', function(d) 
            {
                initialize();
            });
        });
    };
    
}(jQuery));
