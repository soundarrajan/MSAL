/*!
 * Application Insights JavaScript SDK - Core, 2.2.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.Microsoft = global.Microsoft || {}, global.Microsoft.ApplicationInsights = {})));
}(this, (function (exports) { 'use strict';

    var MinChannelPriorty = 100;

    /**
     * The EventsDiscardedReason enumeration contains a set of values that specify the reason for discarding an event.
     */
    var EventsDiscardedReason = {
        /**
         * Unknown.
         */
        Unknown: 0,
        /**
         * Status set to non-retryable.
         */
        NonRetryableStatus: 1,
        /**
         * The event is invalid.
         */
        InvalidEvent: 2,
        /**
         * The size of the event is too large.
         */
        SizeLimitExceeded: 3,
        /**
         * The server is not accepting events from this instrumentation key.
         */
        KillSwitch: 4,
        /**
         * The event queue is full.
         */
        QueueFull: 5,
    };

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var CoreUtils = /** @class */ (function () {
        function CoreUtils() {
        }
        CoreUtils.isNullOrUndefined = function (input) {
            return input === null || input === undefined;
        };
        /**
         * Creates a new GUID.
         * @return {string} A GUID.
         */
        CoreUtils.disableCookies = function () {
            CoreUtils._canUseCookies = false;
        };
        CoreUtils.newGuid = function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(GuidRegex, function (c) {
                var r = (Math.random() * 16 | 0), v = (c === 'x' ? r : r & 0x3 | 0x8);
                return v.toString(16);
            });
        };
        return CoreUtils;
    }());
    var GuidRegex = /[xy]/g;

    var ChannelControllerPriority = 500;
    var ChannelValidationMessage = "Channel has invalid priority";
    var ChannelController = /** @class */ (function () {
        function ChannelController() {
            this.identifier = "ChannelControllerPlugin";
            this.priority = ChannelControllerPriority; // in reserved range 100 to 200
        }
        ChannelController.prototype.processTelemetry = function (item) {
            this.channelQueue.forEach(function (queues) {
                // pass on to first item in queue
                if (queues.length > 0) {
                    queues[0].processTelemetry(item);
                }
            });
        };
        Object.defineProperty(ChannelController.prototype, "ChannelControls", {
            get: function () {
                return this.channelQueue;
            },
            enumerable: true,
            configurable: true
        });
        ChannelController.prototype.initialize = function (config, core, extensions) {
            var _this = this;
            if (config.isCookieUseDisabled) {
                CoreUtils.disableCookies();
            }
            this.channelQueue = new Array();
            if (config.channels) {
                var invalidChannelIdentifier_1;
                config.channels.forEach(function (queue) {
                    if (queue && queue.length > 0) {
                        queue = queue.sort(function (a, b) {
                            return a.priority - b.priority;
                        });
                        for (var i = 1; i < queue.length; i++) {
                            queue[i - 1].setNextPlugin(queue[i]); // setup processing chain
                        }
                        // Initialize each plugin
                        queue.forEach(function (queueItem) {
                            if (queueItem.priority < ChannelControllerPriority) {
                                invalidChannelIdentifier_1 = queueItem.identifier;
                            }
                            queueItem.initialize(config, core, extensions);
                        });
                        if (invalidChannelIdentifier_1) {
                            throw Error(ChannelValidationMessage + invalidChannelIdentifier_1);
                        }
                        _this.channelQueue.push(queue);
                    }
                });
            }
            var arr = new Array();
            for (var i = 0; i < extensions.length; i++) {
                var plugin = extensions[i];
                if (plugin.priority > ChannelControllerPriority) {
                    arr.push(plugin);
                }
            }
            if (arr.length > 0) {
                // sort if not sorted
                arr = arr.sort(function (a, b) {
                    return a.priority - b.priority;
                });
                // setup next plugin
                for (var i = 1; i < arr.length; i++) {
                    arr[i - 1].setNextPlugin(arr[i]);
                }
                // Initialize each plugin
                arr.forEach(function (queueItem) { return queueItem.initialize(config, core, extensions); });
                this.channelQueue.push(arr);
            }
        };
        return ChannelController;
    }());

    var validationError = "Extensions must provide callback to initialize";
    var BaseCore = /** @class */ (function () {
        function BaseCore() {
            this._isInitialized = false;
            this._extensions = new Array();
            this._channelController = new ChannelController();
        }
        BaseCore.prototype.initialize = function (config, extensions, logger, notificationManager) {
            var _this = this;
            // Make sure core is only initialized once
            if (this._isInitialized) {
                throw Error("Core should not be initialized more than once");
            }
            if (!config || CoreUtils.isNullOrUndefined(config.instrumentationKey)) {
                throw Error("Please provide instrumentation key");
            }
            this.config = config;
            this._notificationManager = notificationManager;
            if (!this._notificationManager) {
                this._notificationManager = Object.create({
                    addNotificationListener: function (listener) { },
                    removeNotificationListener: function (listener) { },
                    eventsSent: function (events) { },
                    eventsDiscarded: function (events, reason) { }
                });
            }
            this.config.extensions = CoreUtils.isNullOrUndefined(this.config.extensions) ? [] : this.config.extensions;
            // add notification to the extensions in the config so other plugins can access it
            this.config.extensionConfig = CoreUtils.isNullOrUndefined(this.config.extensionConfig) ? {} : this.config.extensionConfig;
            if (this._notificationManager) {
                this.config.extensionConfig.NotificationManager = this._notificationManager;
            }
            this.logger = logger;
            if (!this.logger) {
                this.logger = Object.create({
                    throwInternal: function (severity, msgId, msg, properties, isUserAct) {
                        if (isUserAct === void 0) { isUserAct = false; }
                    },
                    warnToConsole: function (message) { },
                    resetInternalMessageCount: function () { }
                });
            }
            // Concat all available extensions 
            (_a = this._extensions).push.apply(_a, extensions.concat(this.config.extensions));
            // Initial validation 
            this._extensions.forEach(function (extension) {
                var isValid = true;
                if (CoreUtils.isNullOrUndefined(extension) || CoreUtils.isNullOrUndefined(extension.initialize)) {
                    isValid = false;
                }
                if (!isValid) {
                    throw Error(validationError);
                }
            });
            // Initial validation complete
            this._extensions.push(this._channelController);
            // Sort by priority
            this._extensions = this._extensions.sort(function (a, b) {
                var extA = a;
                var extB = b;
                var typeExtA = typeof extA.processTelemetry;
                var typeExtB = typeof extB.processTelemetry;
                if (typeExtA === 'function' && typeExtB === 'function') {
                    return extA.priority - extB.priority;
                }
                if (typeExtA === 'function' && typeExtB !== 'function') {
                    // keep non telemetryplugin specific extensions at start
                    return 1;
                }
                if (typeExtA !== 'function' && typeExtB === 'function') {
                    return -1;
                }
            });
            // sort complete
            // Check if any two extensions have the same priority, then warn to console
            var priority = {};
            this._extensions.forEach(function (ext) {
                var t = ext;
                if (t && t.priority) {
                    if (!CoreUtils.isNullOrUndefined(priority[t.priority])) {
                        if (_this.logger) {
                            _this.logger.warnToConsole("Two extensions have same priority" + priority[t.priority] + ", " + t.identifier);
                        }
                    }
                    else {
                        priority[t.priority] = t.identifier; // set a value
                    }
                }
            });
            var c = -1;
            // Set next plugin for all until channel controller
            for (var idx = 0; idx < this._extensions.length - 1; idx++) {
                var curr = (this._extensions[idx]);
                if (curr && typeof curr.processTelemetry !== 'function') {
                    // these are initialized only, allowing an entry point for extensions to be initialized when SDK initializes
                    continue;
                }
                if (curr.priority === this._channelController.priority) {
                    c = idx + 1;
                    break; // channel controller will set remaining pipeline
                }
                this._extensions[idx].setNextPlugin(this._extensions[idx + 1]); // set next plugin
            }
            // initialize channel controller first, this will initialize all channel plugins
            this._channelController.initialize(this.config, this, this._extensions);
            // initialize remaining regular plugins
            this._extensions.forEach(function (ext) {
                var e = ext;
                if (e && e.priority < _this._channelController.priority) {
                    ext.initialize(_this.config, _this, _this._extensions); // initialize
                }
            });
            // Remove sender channels from main list
            if (c < this._extensions.length) {
                this._extensions.splice(c);
            }
            if (this.getTransmissionControls().length === 0) {
                throw new Error("No channels available");
            }
            this._isInitialized = true;
            var _a;
        };
        BaseCore.prototype.getTransmissionControls = function () {
            return this._channelController.ChannelControls;
        };
        BaseCore.prototype.track = function (telemetryItem) {
            if (!telemetryItem.iKey) {
                // setup default iKey if not passed in
                telemetryItem.iKey = this.config.instrumentationKey;
            }
            if (!telemetryItem.time) {
                // add default timestamp if not passed in
                telemetryItem.time = new Date().toISOString();
            }
            if (CoreUtils.isNullOrUndefined(telemetryItem.ver)) {
                // CommonSchema 4.0
                telemetryItem.ver = "4.0";
            }
            // invoke any common telemetry processors before sending through pipeline
            if (this._extensions.length === 0) {
                this._channelController.processTelemetry(telemetryItem); // Pass to Channel controller so data is sent to correct channel queues
            }
            var i = 0;
            while (i < this._extensions.length) {
                if (this._extensions[i].processTelemetry) {
                    this._extensions[i].processTelemetry(telemetryItem); // pass on to first extension that can support processing
                    break;
                }
                i++;
            }
        };
        return BaseCore;
    }());

    /**
     * Class to manage sending notifications to all the listeners.
     */
    var NotificationManager = /** @class */ (function () {
        function NotificationManager() {
            this.listeners = [];
        }
        /**
         * Adds a notification listener.
         * @param {INotificationListener} listener - The notification listener to be added.
         */
        NotificationManager.prototype.addNotificationListener = function (listener) {
            this.listeners.push(listener);
        };
        /**
         * Removes all instances of the listener.
         * @param {INotificationListener} listener - AWTNotificationListener to remove.
         */
        NotificationManager.prototype.removeNotificationListener = function (listener) {
            var index = this.listeners.indexOf(listener);
            while (index > -1) {
                this.listeners.splice(index, 1);
                index = this.listeners.indexOf(listener);
            }
        };
        /**
         * Notification for events sent.
         * @param {ITelemetryItem[]} events - The array of events that have been sent.
         */
        NotificationManager.prototype.eventsSent = function (events) {
            var _this = this;
            var _loop_1 = function (i) {
                if (this_1.listeners[i].eventsSent) {
                    setTimeout(function () { return _this.listeners[i].eventsSent(events); }, 0);
                }
            };
            var this_1 = this;
            for (var i = 0; i < this.listeners.length; ++i) {
                _loop_1(i);
            }
        };
        /**
         * Notification for events being discarded.
         * @param {ITelemetryItem[]} events - The array of events that have been discarded by the SDK.
         * @param {number} reason           - The reason for which the SDK discarded the events. The EventsDiscardedReason
         * constant should be used to check the different values.
         */
        NotificationManager.prototype.eventsDiscarded = function (events, reason) {
            var _this = this;
            var _loop_2 = function (i) {
                if (this_2.listeners[i].eventsDiscarded) {
                    setTimeout(function () { return _this.listeners[i].eventsDiscarded(events, reason); }, 0);
                }
            };
            var this_2 = this;
            for (var i = 0; i < this.listeners.length; ++i) {
                _loop_2(i);
            }
        };
        return NotificationManager;
    }());

    (function (LoggingSeverity) {
        /**
         * Error will be sent as internal telemetry
         */
        LoggingSeverity[LoggingSeverity["CRITICAL"] = 1] = "CRITICAL";
        /**
         * Error will NOT be sent as internal telemetry, and will only be shown in browser console
         */
        LoggingSeverity[LoggingSeverity["WARNING"] = 2] = "WARNING";
    })(exports.LoggingSeverity || (exports.LoggingSeverity = {}));
    /**
     * Internal message ID. Please create a new one for every conceptually different message. Please keep alphabetically ordered
     */
    var _InternalMessageId = {
        // Non user actionable
        BrowserDoesNotSupportLocalStorage: 0,
        BrowserCannotReadLocalStorage: 1,
        BrowserCannotReadSessionStorage: 2,
        BrowserCannotWriteLocalStorage: 3,
        BrowserCannotWriteSessionStorage: 4,
        BrowserFailedRemovalFromLocalStorage: 5,
        BrowserFailedRemovalFromSessionStorage: 6,
        CannotSendEmptyTelemetry: 7,
        ClientPerformanceMathError: 8,
        ErrorParsingAISessionCookie: 9,
        ErrorPVCalc: 10,
        ExceptionWhileLoggingError: 11,
        FailedAddingTelemetryToBuffer: 12,
        FailedMonitorAjaxAbort: 13,
        FailedMonitorAjaxDur: 14,
        FailedMonitorAjaxOpen: 15,
        FailedMonitorAjaxRSC: 16,
        FailedMonitorAjaxSend: 17,
        FailedMonitorAjaxGetCorrelationHeader: 18,
        FailedToAddHandlerForOnBeforeUnload: 19,
        FailedToSendQueuedTelemetry: 20,
        FailedToReportDataLoss: 21,
        FlushFailed: 22,
        MessageLimitPerPVExceeded: 23,
        MissingRequiredFieldSpecification: 24,
        NavigationTimingNotSupported: 25,
        OnError: 26,
        SessionRenewalDateIsZero: 27,
        SenderNotInitialized: 28,
        StartTrackEventFailed: 29,
        StopTrackEventFailed: 30,
        StartTrackFailed: 31,
        StopTrackFailed: 32,
        TelemetrySampledAndNotSent: 33,
        TrackEventFailed: 34,
        TrackExceptionFailed: 35,
        TrackMetricFailed: 36,
        TrackPVFailed: 37,
        TrackPVFailedCalc: 38,
        TrackTraceFailed: 39,
        TransmissionFailed: 40,
        FailedToSetStorageBuffer: 41,
        FailedToRestoreStorageBuffer: 42,
        InvalidBackendResponse: 43,
        FailedToFixDepricatedValues: 44,
        InvalidDurationValue: 45,
        TelemetryEnvelopeInvalid: 46,
        CreateEnvelopeError: 47,
        // User actionable
        CannotSerializeObject: 48,
        CannotSerializeObjectNonSerializable: 49,
        CircularReferenceDetected: 50,
        ClearAuthContextFailed: 51,
        ExceptionTruncated: 52,
        IllegalCharsInName: 53,
        ItemNotInArray: 54,
        MaxAjaxPerPVExceeded: 55,
        MessageTruncated: 56,
        NameTooLong: 57,
        SampleRateOutOfRange: 58,
        SetAuthContextFailed: 59,
        SetAuthContextFailedAccountName: 60,
        StringValueTooLong: 61,
        StartCalledMoreThanOnce: 62,
        StopCalledWithoutStart: 63,
        TelemetryInitializerFailed: 64,
        TrackArgumentsNotSpecified: 65,
        UrlTooLong: 66,
        SessionStorageBufferFull: 67,
        CannotAccessCookie: 68,
        IdTooLong: 69,
        InvalidEvent: 70,
        FailedMonitorAjaxSetRequestHeader: 71,
        SendBrowserInfoOnUserInit: 72
    };

    var _InternalLogMessage = /** @class */ (function () {
        function _InternalLogMessage(msgId, msg, isUserAct, properties) {
            if (isUserAct === void 0) { isUserAct = false; }
            this.messageId = msgId;
            this.message =
                (isUserAct ? _InternalLogMessage.AiUserActionablePrefix : _InternalLogMessage.AiNonUserActionablePrefix) +
                    msgId;
            var diagnosticText = (msg ? " message:" + _InternalLogMessage.sanitizeDiagnosticText(msg) : "") +
                (properties ? " props:" + _InternalLogMessage.sanitizeDiagnosticText(JSON.stringify(properties)) : "");
            this.message += diagnosticText;
        }
        _InternalLogMessage.sanitizeDiagnosticText = function (text) {
            return "\"" + text.replace(/\"/g, "") + "\"";
        };
        _InternalLogMessage.dataType = "MessageData";
        /**
         * For user non actionable traces use AI Internal prefix.
         */
        _InternalLogMessage.AiNonUserActionablePrefix = "AI (Internal): ";
        /**
         * Prefix of the traces in portal.
         */
        _InternalLogMessage.AiUserActionablePrefix = "AI: ";
        return _InternalLogMessage;
    }());
    var DiagnosticLogger = /** @class */ (function () {
        function DiagnosticLogger(config) {
            /**
             * The internal logging queue
             */
            this.queue = [];
            /**
             *  Session storage key for the prefix for the key indicating message type already logged
             */
            this.AIInternalMessagePrefix = "AITR_";
            /**
             * Count of internal messages sent
             */
            this._messageCount = 0;
            /**
             * Holds information about what message types were already logged to console or sent to server.
             */
            this._messageLogged = {};
            /**
             * When this is true the SDK will throw exceptions to aid in debugging.
             */
            this.enableDebugExceptions = function () { return false; };
            /**
             * 0: OFF (default)
             * 1: CRITICAL
             * 2: >= WARNING
             */
            this.consoleLoggingLevel = function () { return 0; };
            /**
             * 0: OFF
             * 1: CRITICAL (default)
             * 2: >= WARNING
             */
            this.telemetryLoggingLevel = function () { return 1; };
            /**
             * The maximum number of internal messages allowed to be sent per page view
             */
            this.maxInternalMessageLimit = function () { return 25; };
            if (CoreUtils.isNullOrUndefined(config)) {
                // TODO: Use default config
                // config = AppInsightsCore.defaultConfig;
                // For now, use defaults specified in DiagnosticLogger members;
                return;
            }
            if (!CoreUtils.isNullOrUndefined(config.loggingLevelConsole)) {
                this.consoleLoggingLevel = function () { return config.loggingLevelConsole; };
            }
            if (!CoreUtils.isNullOrUndefined(config.loggingLevelTelemetry)) {
                this.telemetryLoggingLevel = function () { return config.loggingLevelTelemetry; };
            }
            if (!CoreUtils.isNullOrUndefined(config.maxMessageLimit)) {
                this.maxInternalMessageLimit = function () { return config.maxMessageLimit; };
            }
            if (!CoreUtils.isNullOrUndefined(config.enableDebugExceptions)) {
                this.enableDebugExceptions = function () { return config.enableDebugExceptions; };
            }
        }
        /**
         * This method will throw exceptions in debug mode or attempt to log the error as a console warning.
         * @param severity {LoggingSeverity} - The severity of the log message
         * @param message {_InternalLogMessage} - The log message.
         */
        DiagnosticLogger.prototype.throwInternal = function (severity, msgId, msg, properties, isUserAct) {
            if (isUserAct === void 0) { isUserAct = false; }
            var message = new _InternalLogMessage(msgId, msg, isUserAct, properties);
            if (this.enableDebugExceptions()) {
                throw message;
            }
            else {
                if (typeof (message) !== "undefined" && !!message) {
                    if (typeof (message.message) !== "undefined") {
                        if (isUserAct) {
                            // check if this message type was already logged to console for this page view and if so, don't log it again
                            var messageKey = +message.messageId;
                            if (!this._messageLogged[messageKey] || this.consoleLoggingLevel() >= exports.LoggingSeverity.WARNING) {
                                this.warnToConsole(message.message);
                                this._messageLogged[messageKey] = true;
                            }
                        }
                        else {
                            // don't log internal AI traces in the console, unless the verbose logging is enabled
                            if (this.consoleLoggingLevel() >= exports.LoggingSeverity.WARNING) {
                                this.warnToConsole(message.message);
                            }
                        }
                        this.logInternalMessage(severity, message);
                    }
                }
            }
        };
        /**
         * This will write a warning to the console if possible
         * @param message {string} - The warning message
         */
        DiagnosticLogger.prototype.warnToConsole = function (message) {
            if (typeof console !== "undefined" && !!console) {
                if (typeof console.warn === "function") {
                    console.warn(message);
                }
                else if (typeof console.log === "function") {
                    console.log(message);
                }
            }
        };
        /**
         * Resets the internal message count
         */
        DiagnosticLogger.prototype.resetInternalMessageCount = function () {
            this._messageCount = 0;
            this._messageLogged = {};
        };
        /**
         * Logs a message to the internal queue.
         * @param severity {LoggingSeverity} - The severity of the log message
         * @param message {_InternalLogMessage} - The message to log.
         */
        DiagnosticLogger.prototype.logInternalMessage = function (severity, message) {
            if (this._areInternalMessagesThrottled()) {
                return;
            }
            // check if this message type was already logged for this session and if so, don't log it again
            var logMessage = true;
            var messageKey = this.AIInternalMessagePrefix + message.messageId;
            // if the session storage is not available, limit to only one message type per page view
            if (this._messageLogged[messageKey]) {
                logMessage = false;
            }
            else {
                this._messageLogged[messageKey] = true;
            }
            if (logMessage) {
                // Push the event in the internal queue
                if (severity <= this.telemetryLoggingLevel()) {
                    this.queue.push(message);
                    this._messageCount++;
                }
                // When throttle limit reached, send a special event
                if (this._messageCount === this.maxInternalMessageLimit()) {
                    var throttleLimitMessage = "Internal events throttle limit per PageView reached for this app.";
                    var throttleMessage = new _InternalLogMessage(_InternalMessageId.MessageLimitPerPVExceeded, throttleLimitMessage, false);
                    this.queue.push(throttleMessage);
                    this.warnToConsole(throttleLimitMessage);
                }
            }
        };
        /**
         * Indicates whether the internal events are throttled
         */
        DiagnosticLogger.prototype._areInternalMessagesThrottled = function () {
            return this._messageCount >= this.maxInternalMessageLimit();
        };
        return DiagnosticLogger;
    }());

    var AppInsightsCore = /** @class */ (function (_super) {
        __extends(AppInsightsCore, _super);
        function AppInsightsCore() {
            return _super.call(this) || this;
        }
        AppInsightsCore.prototype.initialize = function (config, extensions) {
            this._notificationManager = new NotificationManager();
            this.logger = new DiagnosticLogger(config);
            this.config = config;
            _super.prototype.initialize.call(this, config, extensions, this.logger, this._notificationManager);
        };
        AppInsightsCore.prototype.getTransmissionControls = function () {
            return _super.prototype.getTransmissionControls.call(this);
        };
        AppInsightsCore.prototype.track = function (telemetryItem) {
            if (telemetryItem === null) {
                this._notifyInvalidEvent(telemetryItem);
                // throw error
                throw Error("Invalid telemetry item");
            }
            // do basic validation before sending it through the pipeline
            this._validateTelemetryItem(telemetryItem);
            _super.prototype.track.call(this, telemetryItem);
        };
        /**
         * Adds a notification listener. The SDK calls methods on the listener when an appropriate notification is raised.
         * The added plugins must raise notifications. If the plugins do not implement the notifications, then no methods will be
         * called.
         * @param {INotificationListener} listener - An INotificationListener object.
         */
        AppInsightsCore.prototype.addNotificationListener = function (listener) {
            if (this._notificationManager) {
                this._notificationManager.addNotificationListener(listener);
            }
        };
        /**
         * Removes all instances of the listener.
         * @param {INotificationListener} listener - INotificationListener to remove.
         */
        AppInsightsCore.prototype.removeNotificationListener = function (listener) {
            if (this._notificationManager) {
                this._notificationManager.removeNotificationListener(listener);
            }
        };
        /**
         * Periodically check logger.queue for
         */
        AppInsightsCore.prototype.pollInternalLogs = function (eventName) {
            var _this = this;
            var interval = this.config.diagnosticLogInterval;
            if (!(interval > 0)) {
                interval = 10000;
            }
            return setInterval(function () {
                var queue = _this.logger ? _this.logger.queue : [];
                queue.forEach(function (logMessage) {
                    var item = {
                        name: eventName ? eventName : "InternalMessageId: " + logMessage.messageId,
                        iKey: _this.config.instrumentationKey,
                        time: new Date().toISOString(),
                        baseType: _InternalLogMessage.dataType,
                        baseData: { message: logMessage.message }
                    };
                    _this.track(item);
                });
                queue.length = 0;
            }, interval);
        };
        AppInsightsCore.prototype._validateTelemetryItem = function (telemetryItem) {
            if (CoreUtils.isNullOrUndefined(telemetryItem.name)) {
                this._notifyInvalidEvent(telemetryItem);
                throw Error("telemetry name required");
            }
        };
        AppInsightsCore.prototype._notifyInvalidEvent = function (telemetryItem) {
            if (this._notificationManager) {
                this._notificationManager.eventsDiscarded([telemetryItem], EventsDiscardedReason.InvalidEvent);
            }
        };
        return AppInsightsCore;
    }(BaseCore));

    exports.MinChannelPriorty = MinChannelPriorty;
    exports.EventsDiscardedReason = EventsDiscardedReason;
    exports.AppInsightsCore = AppInsightsCore;
    exports.BaseCore = BaseCore;
    exports.CoreUtils = CoreUtils;
    exports.NotificationManager = NotificationManager;
    exports.DiagnosticLogger = DiagnosticLogger;
    exports._InternalLogMessage = _InternalLogMessage;
    exports._InternalMessageId = _InternalMessageId;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=applicationinsights-core-js.js.map
