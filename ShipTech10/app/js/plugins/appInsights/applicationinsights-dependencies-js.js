/*!
 * Application Insights JavaScript SDK - Dependencies Plugin, 2.2.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.Microsoft = global.Microsoft || {}, global.Microsoft.ApplicationInsights = {})));
}(this, (function (exports) { 'use strict';

    /**
     * Type of storage to differentiate between local storage and session storage
     */
    var StorageType;
    (function (StorageType) {
        StorageType[StorageType["LocalStorage"] = 0] = "LocalStorage";
        StorageType[StorageType["SessionStorage"] = 1] = "SessionStorage";
    })(StorageType || (StorageType = {}));
    /**
     * Enum is used in aiDataContract to describe how fields are serialized.
     * For instance: (Fieldtype.Required | FieldType.Array) will mark the field as required and indicate it's an array
     */
    var FieldType;
    (function (FieldType) {
        FieldType[FieldType["Default"] = 0] = "Default";
        FieldType[FieldType["Required"] = 1] = "Required";
        FieldType[FieldType["Array"] = 2] = "Array";
        FieldType[FieldType["Hidden"] = 4] = "Hidden";
    })(FieldType || (FieldType = {}));
    var DistributedTracingModes;
    (function (DistributedTracingModes) {
        /**
         * (Default) Send Application Insights correlation headers
         */
        DistributedTracingModes[DistributedTracingModes["AI"] = 0] = "AI";
        /**
         * Send both W3C Trace Context headers and back-compatibility Application Insights headers
         */
        DistributedTracingModes[DistributedTracingModes["AI_AND_W3C"] = 1] = "AI_AND_W3C";
        /**
         * Send W3C Trace Context headers
         */
        DistributedTracingModes[DistributedTracingModes["W3C"] = 2] = "W3C";
    })(DistributedTracingModes || (DistributedTracingModes = {}));

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

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

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
                var r = (window.crypto.getRandomValues( new Uint8Array(1)) * 16 | 0), v = (c === 'x' ? r : r & 0x3 | 0x8);
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

    var LoggingSeverity;
    (function (LoggingSeverity) {
        /**
         * Error will be sent as internal telemetry
         */
        LoggingSeverity[LoggingSeverity["CRITICAL"] = 1] = "CRITICAL";
        /**
         * Error will NOT be sent as internal telemetry, and will only be shown in browser console
         */
        LoggingSeverity[LoggingSeverity["WARNING"] = 2] = "WARNING";
    })(LoggingSeverity || (LoggingSeverity = {}));
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
                            if (!this._messageLogged[messageKey] || this.consoleLoggingLevel() >= LoggingSeverity.WARNING) {
                                this.warnToConsole(message.message);
                                this._messageLogged[messageKey] = true;
                            }
                        }
                        else {
                            // don't log internal AI traces in the console, unless the verbose logging is enabled
                            if (this.consoleLoggingLevel() >= LoggingSeverity.WARNING) {
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

    var RequestHeaders = /** @class */ (function () {
        function RequestHeaders() {
        }
        /**
         * Request-Context header
         */
        RequestHeaders.requestContextHeader = "Request-Context";
        /**
         * Target instrumentation header that is added to the response and retrieved by the
         * calling application when processing incoming responses.
         */
        RequestHeaders.requestContextTargetKey = "appId";
        /**
         * Request-Context appId format
         */
        RequestHeaders.requestContextAppIdFormat = "appId=cid-v1:";
        /**
         * Request-Id header
         */
        RequestHeaders.requestIdHeader = "Request-Id";
        /**
         * W3C distributed tracing protocol header
         */
        RequestHeaders.traceParentHeader = "traceparent";
        /**
         * Sdk-Context header
         * If this header passed with appId in content then appId will be returned back by the backend.
         */
        RequestHeaders.sdkContextHeader = "Sdk-Context";
        /**
         * String to pass in header for requesting appId back from the backend.
         */
        RequestHeaders.sdkContextHeaderAppIdRequest = "appId";
        RequestHeaders.requestContextHeaderLowerCase = "request-context";
        return RequestHeaders;
    }());

    var DataSanitizer = /** @class */ (function () {
        function DataSanitizer() {
        }
        DataSanitizer.sanitizeKeyAndAddUniqueness = function (logger, key, map) {
            var origLength = key.length;
            var field = DataSanitizer.sanitizeKey(logger, key);
            // validation truncated the length.  We need to add uniqueness
            if (field.length !== origLength) {
                var i = 0;
                var uniqueField = field;
                while (map[uniqueField] !== undefined) {
                    i++;
                    uniqueField = field.substring(0, DataSanitizer.MAX_NAME_LENGTH - 3) + DataSanitizer.padNumber(i);
                }
                field = uniqueField;
            }
            return field;
        };
        DataSanitizer.sanitizeKey = function (logger, name) {
            var nameTrunc;
            if (name) {
                // Remove any leading or trailing whitepace
                name = DataSanitizer.trim(name.toString());
                // truncate the string to 150 chars
                if (name.length > DataSanitizer.MAX_NAME_LENGTH) {
                    nameTrunc = name.substring(0, DataSanitizer.MAX_NAME_LENGTH);
                    logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.NameTooLong, "name is too long.  It has been truncated to " + DataSanitizer.MAX_NAME_LENGTH + " characters.", { name: name }, true);
                }
            }
            return nameTrunc || name;
        };
        DataSanitizer.sanitizeString = function (logger, value, maxLength) {
            if (maxLength === void 0) { maxLength = DataSanitizer.MAX_STRING_LENGTH; }
            var valueTrunc;
            if (value) {
                maxLength = maxLength ? maxLength : DataSanitizer.MAX_STRING_LENGTH; // in case default parameters dont work
                value = DataSanitizer.trim(value);
                if (value.toString().length > maxLength) {
                    valueTrunc = value.toString().substring(0, maxLength);
                    logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.StringValueTooLong, "string value is too long. It has been truncated to " + maxLength + " characters.", { value: value }, true);
                }
            }
            return valueTrunc || value;
        };
        DataSanitizer.sanitizeUrl = function (logger, url) {
            return DataSanitizer.sanitizeInput(logger, url, DataSanitizer.MAX_URL_LENGTH, _InternalMessageId.UrlTooLong);
        };
        DataSanitizer.sanitizeMessage = function (logger, message) {
            var messageTrunc;
            if (message) {
                if (message.length > DataSanitizer.MAX_MESSAGE_LENGTH) {
                    messageTrunc = message.substring(0, DataSanitizer.MAX_MESSAGE_LENGTH);
                    logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.MessageTruncated, "message is too long, it has been truncated to " + DataSanitizer.MAX_MESSAGE_LENGTH + " characters.", { message: message }, true);
                }
            }
            return messageTrunc || message;
        };
        DataSanitizer.sanitizeException = function (logger, exception) {
            var exceptionTrunc;
            if (exception) {
                if (exception.length > DataSanitizer.MAX_EXCEPTION_LENGTH) {
                    exceptionTrunc = exception.substring(0, DataSanitizer.MAX_EXCEPTION_LENGTH);
                    logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.ExceptionTruncated, "exception is too long, it has been truncated to " + DataSanitizer.MAX_EXCEPTION_LENGTH + " characters.", { exception: exception }, true);
                }
            }
            return exceptionTrunc || exception;
        };
        DataSanitizer.sanitizeProperties = function (logger, properties) {
            if (properties) {
                var tempProps = {};
                for (var prop in properties) {
                    var value = properties[prop];
                    if (typeof value === "object" && typeof JSON !== "undefined") {
                        // Stringify any part C properties
                        try {
                            value = JSON.stringify(value);
                        }
                        catch (e) {
                            logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.CannotSerializeObjectNonSerializable, "custom property is not valid", { exception: e }, true);
                        }
                    }
                    value = DataSanitizer.sanitizeString(logger, value, DataSanitizer.MAX_PROPERTY_LENGTH);
                    prop = DataSanitizer.sanitizeKeyAndAddUniqueness(logger, prop, tempProps);
                    tempProps[prop] = value;
                }
                properties = tempProps;
            }
            return properties;
        };
        DataSanitizer.sanitizeMeasurements = function (logger, measurements) {
            if (measurements) {
                var tempMeasurements = {};
                for (var measure in measurements) {
                    var value = measurements[measure];
                    measure = DataSanitizer.sanitizeKeyAndAddUniqueness(logger, measure, tempMeasurements);
                    tempMeasurements[measure] = value;
                }
                measurements = tempMeasurements;
            }
            return measurements;
        };
        DataSanitizer.sanitizeId = function (logger, id) {
            return id ? DataSanitizer.sanitizeInput(logger, id, DataSanitizer.MAX_ID_LENGTH, _InternalMessageId.IdTooLong).toString() : id;
        };
        DataSanitizer.sanitizeInput = function (logger, input, maxLength, _msgId) {
            var inputTrunc;
            if (input) {
                input = DataSanitizer.trim(input);
                if (input.length > maxLength) {
                    inputTrunc = input.substring(0, maxLength);
                    logger.throwInternal(LoggingSeverity.WARNING, _msgId, "input is too long, it has been truncated to " + maxLength + " characters.", { data: input }, true);
                }
            }
            return inputTrunc || input;
        };
        DataSanitizer.padNumber = function (num) {
            var s = "00" + num;
            return s.substr(s.length - 3);
        };
        /**
         * helper method to trim strings (IE8 does not implement String.prototype.trim)
         */
        DataSanitizer.trim = function (str) {
            if (typeof str !== "string") {
                return str;
            }
            return str.replace(/^\s+|\s+$/g, "");
        };
        /**
         * Max length allowed for custom names.
         */
        DataSanitizer.MAX_NAME_LENGTH = 150;
        /**
         * Max length allowed for Id field in page views.
         */
        DataSanitizer.MAX_ID_LENGTH = 128;
        /**
         * Max length allowed for custom values.
         */
        DataSanitizer.MAX_PROPERTY_LENGTH = 8192;
        /**
         * Max length allowed for names
         */
        DataSanitizer.MAX_STRING_LENGTH = 1024;
        /**
         * Max length allowed for url.
         */
        DataSanitizer.MAX_URL_LENGTH = 2048;
        /**
         * Max length allowed for messages.
         */
        DataSanitizer.MAX_MESSAGE_LENGTH = 32768;
        /**
         * Max length allowed for exceptions.
         */
        DataSanitizer.MAX_EXCEPTION_LENGTH = 32768;
        return DataSanitizer;
    }());

    var Util = /** @class */ (function () {
        function Util() {
        }
        Util.createDomEvent = function (eventName) {
            var event = null;
            if (typeof Event === "function") {
                event = new Event(eventName);
            }
            else {
                event = document.createEvent("Event");
                event.initEvent(eventName, true, true);
            }
            return event;
        };
        /*
         * Force the SDK not to use local and session storage
        */
        Util.disableStorage = function () {
            Util._canUseLocalStorage = false;
            Util._canUseSessionStorage = false;
        };
        /**
         * Gets the localStorage object if available
         * @return {Storage} - Returns the storage object if available else returns null
         */
        Util._getLocalStorageObject = function () {
            if (Util.canUseLocalStorage()) {
                return Util._getVerifiedStorageObject(StorageType.LocalStorage);
            }
            return null;
        };
        /**
         * Tests storage object (localStorage or sessionStorage) to verify that it is usable
         * More details here: https://mathiasbynens.be/notes/localstorage-pattern
         * @param storageType Type of storage
         * @return {Storage} Returns storage object verified that it is usable
         */
        Util._getVerifiedStorageObject = function (storageType) {
            var storage = null;
            var fail;
            var uid;
            try {
                if (typeof window === 'undefined') {
                    return null;
                }
                uid = new Date;
                storage = storageType === StorageType.LocalStorage ? window.localStorage : window.sessionStorage;
                storage.setItem(uid.toString(), uid.toString());
                fail = storage.getItem(uid.toString()) !== uid.toString();
                storage.removeItem(uid.toString());
                if (fail) {
                    storage = null;
                }
            }
            catch (exception) {
                storage = null;
            }
            return storage;
        };
        /**
         *  Checks if endpoint URL is application insights internal injestion service URL.
         *
         *  @param endpointUrl Endpoint URL to check.
         *  @returns {boolean} True if if endpoint URL is application insights internal injestion service URL.
         */
        Util.isInternalApplicationInsightsEndpoint = function (endpointUrl) {
            return Util._internalEndpoints.indexOf(endpointUrl.toLowerCase()) !== -1;
        };
        /**
         *  Check if the browser supports local storage.
         *
         *  @returns {boolean} True if local storage is supported.
         */
        Util.canUseLocalStorage = function () {
            if (Util._canUseLocalStorage === undefined) {
                Util._canUseLocalStorage = !!Util._getVerifiedStorageObject(StorageType.LocalStorage);
            }
            return Util._canUseLocalStorage;
        };
        /**
         *  Get an object from the browser's local storage
         *
         *  @param {string} name - the name of the object to get from storage
         *  @returns {string} The contents of the storage object with the given name. Null if storage is not supported.
         */
        Util.getStorage = function (logger, name) {
            var storage = Util._getLocalStorageObject();
            if (storage !== null) {
                try {
                    return storage.getItem(name);
                }
                catch (e) {
                    Util._canUseLocalStorage = false;
                    logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.BrowserCannotReadLocalStorage, "Browser failed read of local storage. " + Util.getExceptionName(e), { exception: Util.dump(e) });
                }
            }
            return null;
        };
        /**
         *  Set the contents of an object in the browser's local storage
         *
         *  @param {string} name - the name of the object to set in storage
         *  @param {string} data - the contents of the object to set in storage
         *  @returns {boolean} True if the storage object could be written.
         */
        Util.setStorage = function (logger, name, data) {
            var storage = Util._getLocalStorageObject();
            if (storage !== null) {
                try {
                    storage.setItem(name, data);
                    return true;
                }
                catch (e) {
                    Util._canUseLocalStorage = false;
                    logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.BrowserCannotWriteLocalStorage, "Browser failed write to local storage. " + Util.getExceptionName(e), { exception: Util.dump(e) });
                }
            }
            return false;
        };
        /**
         *  Remove an object from the browser's local storage
         *
         *  @param {string} name - the name of the object to remove from storage
         *  @returns {boolean} True if the storage object could be removed.
         */
        Util.removeStorage = function (logger, name) {
            var storage = Util._getLocalStorageObject();
            if (storage !== null) {
                try {
                    storage.removeItem(name);
                    return true;
                }
                catch (e) {
                    Util._canUseLocalStorage = false;
                    logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.BrowserFailedRemovalFromLocalStorage, "Browser failed removal of local storage item. " + Util.getExceptionName(e), { exception: Util.dump(e) });
                }
            }
            return false;
        };
        /**
         * Gets the sessionStorage object if available
         * @return {Storage} - Returns the storage object if available else returns null
         */
        Util._getSessionStorageObject = function () {
            if (Util.canUseSessionStorage()) {
                return Util._getVerifiedStorageObject(StorageType.SessionStorage);
            }
            return null;
        };
        /**
         *  Check if the browser supports session storage.
         *
         *  @returns {boolean} True if session storage is supported.
         */
        Util.canUseSessionStorage = function () {
            if (Util._canUseSessionStorage === undefined) {
                Util._canUseSessionStorage = !!Util._getVerifiedStorageObject(StorageType.SessionStorage);
            }
            return Util._canUseSessionStorage;
        };
        /**
         *  Gets the list of session storage keys
         *
         *  @returns {string[]} List of session storage keys
         */
        Util.getSessionStorageKeys = function () {
            var keys = [];
            if (Util.canUseSessionStorage()) {
                for (var key in window.sessionStorage) {
                    keys.push(key);
                }
            }
            return keys;
        };
        /**
         *  Get an object from the browser's session storage
         *
         *  @param {string} name - the name of the object to get from storage
         *  @returns {string} The contents of the storage object with the given name. Null if storage is not supported.
         */
        Util.getSessionStorage = function (logger, name) {
            var storage = Util._getSessionStorageObject();
            if (storage !== null) {
                try {
                    return storage.getItem(name);
                }
                catch (e) {
                    Util._canUseSessionStorage = false;
                    logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.BrowserCannotReadSessionStorage, "Browser failed read of session storage. " + Util.getExceptionName(e), { exception: Util.dump(e) });
                }
            }
            return null;
        };
        /**
         *  Set the contents of an object in the browser's session storage
         *
         *  @param {string} name - the name of the object to set in storage
         *  @param {string} data - the contents of the object to set in storage
         *  @returns {boolean} True if the storage object could be written.
         */
        Util.setSessionStorage = function (logger, name, data) {
            var storage = Util._getSessionStorageObject();
            if (storage !== null) {
                try {
                    storage.setItem(name, data);
                    return true;
                }
                catch (e) {
                    Util._canUseSessionStorage = false;
                    logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.BrowserCannotWriteSessionStorage, "Browser failed write to session storage. " + Util.getExceptionName(e), { exception: Util.dump(e) });
                }
            }
            return false;
        };
        /**
         *  Remove an object from the browser's session storage
         *
         *  @param {string} name - the name of the object to remove from storage
         *  @returns {boolean} True if the storage object could be removed.
         */
        Util.removeSessionStorage = function (logger, name) {
            var storage = Util._getSessionStorageObject();
            if (storage !== null) {
                try {
                    storage.removeItem(name);
                    return true;
                }
                catch (e) {
                    Util._canUseSessionStorage = false;
                    logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.BrowserFailedRemovalFromSessionStorage, "Browser failed removal of session storage item. " + Util.getExceptionName(e), { exception: Util.dump(e) });
                }
            }
            return false;
        };
        /*
         * Force the SDK not to store and read any data from cookies
         */
        Util.disableCookies = function () {
            CoreUtils.disableCookies();
        };
        /*
         * helper method to tell if document.cookie object is available
         */
        Util.canUseCookies = function (logger) {
            if (CoreUtils._canUseCookies === undefined) {
                CoreUtils._canUseCookies = false;
                try {
                    CoreUtils._canUseCookies = Util.document.cookie !== undefined;
                }
                catch (e) {
                    logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.CannotAccessCookie, "Cannot access document.cookie - " + Util.getExceptionName(e), { exception: Util.dump(e) });
                }
            }
            return CoreUtils._canUseCookies;
        };
        /**
         * helper method to set userId and sessionId cookie
         */
        Util.setCookie = function (logger, name, value, domain) {
            var domainAttrib = "";
            var secureAttrib = "";
            if (domain) {
                domainAttrib = ";domain=" + domain;
            }
            if (Util.document.location && Util.document.location.protocol === "https:") {
                secureAttrib = ";secure";
            }
            if (Util.canUseCookies(logger)) {
                Util.document.cookie = name + "=" + value + domainAttrib + ";path=/" + secureAttrib;
            }
        };
        Util.stringToBoolOrDefault = function (str, defaultValue) {
            if (defaultValue === void 0) { defaultValue = false; }
            if (str === undefined || str === null) {
                return defaultValue;
            }
            return str.toString().toLowerCase() === "true";
        };
        /**
         * helper method to access userId and sessionId cookie
         */
        Util.getCookie = function (logger, name) {
            if (!Util.canUseCookies(logger)) {
                return;
            }
            var value = "";
            if (name && name.length) {
                var cookieName = name + "=";
                var cookies = Util.document.cookie.split(";");
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = cookies[i];
                    cookie = Util.trim(cookie);
                    if (cookie && cookie.indexOf(cookieName) === 0) {
                        value = cookie.substring(cookieName.length, cookies[i].length);
                        break;
                    }
                }
            }
            return value;
        };
        /**
         * Deletes a cookie by setting it's expiration time in the past.
         * @param name - The name of the cookie to delete.
         */
        Util.deleteCookie = function (logger, name) {
            if (Util.canUseCookies(logger)) {
                // Setting the expiration date in the past immediately removes the cookie
                Util.document.cookie = name + "=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            }
        };
        /**
         * helper method to trim strings (IE8 does not implement String.prototype.trim)
         */
        Util.trim = function (str) {
            if (typeof str !== "string") {
                return str;
            }
            return str.replace(/^\s+|\s+$/g, "");
        };
        /**
         * generate random id string
         */
        Util.newId = function () {
            var base64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
            var result = "";
            // tslint:disable-next-line:insecure-random
            var random = window.crypto.getRandomValues( new Uint8Array(1)) * 1073741824; // 5 symbols in base64, almost maxint
            while (random > 0) {
                var char = base64chars.charAt(random % 64);
                result += char;
                random = Math.floor(random / 64);
            }
            return result;
        };
        /**
         * generate a random 32bit number (-0x80000000..0x7FFFFFFF).
         */
        Util.random32 = function () {
            return (0x100000000 * window.crypto.getRandomValues( new Uint8Array(1))) | 0;
        };
        /**
         * generate W3C trace id
         */
        Util.generateW3CId = function () {
            var hexValues = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
            // rfc4122 version 4 UUID without dashes and with lowercase letters
            var oct = "", tmp;
            for (var a = 0; a < 4; a++) {
                tmp = Util.random32();
                oct +=
                    hexValues[tmp & 0xF] +
                        hexValues[tmp >> 4 & 0xF] +
                        hexValues[tmp >> 8 & 0xF] +
                        hexValues[tmp >> 12 & 0xF] +
                        hexValues[tmp >> 16 & 0xF] +
                        hexValues[tmp >> 20 & 0xF] +
                        hexValues[tmp >> 24 & 0xF] +
                        hexValues[tmp >> 28 & 0xF];
            }
            // "Set the two most significant bits (bits 6 and 7) of the clock_seq_hi_and_reserved to zero and one, respectively"
            var clockSequenceHi = hexValues[8 + (window.crypto.getRandomValues( new Uint8Array(1)) * 4) | 0];
            return oct.substr(0, 8) + oct.substr(9, 4) + "4" + oct.substr(13, 3) + clockSequenceHi + oct.substr(16, 3) + oct.substr(19, 12);
        };
        /**
         * Check if an object is of type Array
         */
        Util.isArray = function (obj) {
            return Object.prototype.toString.call(obj) === "[object Array]";
        };
        /**
         * Check if an object is of type Error
         */
        Util.isError = function (obj) {
            return Object.prototype.toString.call(obj) === "[object Error]";
        };
        /**
         * Check if an object is of type Date
         */
        Util.isDate = function (obj) {
            return Object.prototype.toString.call(obj) === "[object Date]";
        };
        /**
         * Convert a date to I.S.O. format in IE8
         */
        Util.toISOStringForIE8 = function (date) {
            if (Util.isDate(date)) {
                if (Date.prototype.toISOString) {
                    return date.toISOString();
                }
                else {
                    var pad = function (num) {
                        var r = String(num);
                        if (r.length === 1) {
                            r = "0" + r;
                        }
                        return r;
                    };
                    return date.getUTCFullYear()
                        + "-" + pad(date.getUTCMonth() + 1)
                        + "-" + pad(date.getUTCDate())
                        + "T" + pad(date.getUTCHours())
                        + ":" + pad(date.getUTCMinutes())
                        + ":" + pad(date.getUTCSeconds())
                        + "." + String((date.getUTCMilliseconds() / 1000).toFixed(3)).slice(2, 5)
                        + "Z";
                }
            }
        };
        /**
         * Gets IE version if we are running on IE, or null otherwise
         */
        Util.getIEVersion = function (userAgentStr) {
            if (userAgentStr === void 0) { userAgentStr = null; }
            var myNav = userAgentStr ? userAgentStr.toLowerCase() : navigator.userAgent.toLowerCase();
            return (myNav.indexOf('msie') !== -1) ? parseInt(myNav.split('msie')[1]) : null;
        };
        /**
         * Convert ms to c# time span format
         */
        Util.msToTimeSpan = function (totalms) {
            if (isNaN(totalms) || totalms < 0) {
                totalms = 0;
            }
            totalms = Math.round(totalms);
            var ms = "" + totalms % 1000;
            var sec = "" + Math.floor(totalms / 1000) % 60;
            var min = "" + Math.floor(totalms / (1000 * 60)) % 60;
            var hour = "" + Math.floor(totalms / (1000 * 60 * 60)) % 24;
            var days = Math.floor(totalms / (1000 * 60 * 60 * 24));
            ms = ms.length === 1 ? "00" + ms : ms.length === 2 ? "0" + ms : ms;
            sec = sec.length < 2 ? "0" + sec : sec;
            min = min.length < 2 ? "0" + min : min;
            hour = hour.length < 2 ? "0" + hour : hour;
            return (days > 0 ? days + "." : "") + hour + ":" + min + ":" + sec + "." + ms;
        };
        /**
         * Checks if error has no meaningful data inside. Ususally such errors are received by window.onerror when error
         * happens in a script from other domain (cross origin, CORS).
         */
        Util.isCrossOriginError = function (message, url, lineNumber, columnNumber, error) {
            return (message === "Script error." || message === "Script error") && !error;
        };
        /**
         * Returns string representation of an object suitable for diagnostics logging.
         */
        Util.dump = function (object) {
            var objectTypeDump = Object.prototype.toString.call(object);
            var propertyValueDump = JSON.stringify(object);
            if (objectTypeDump === "[object Error]") {
                propertyValueDump = "{ stack: '" + object.stack + "', message: '" + object.message + "', name: '" + object.name + "'";
            }
            return objectTypeDump + propertyValueDump;
        };
        /**
         * Returns the name of object if it's an Error. Otherwise, returns empty string.
         */
        Util.getExceptionName = function (object) {
            var objectTypeDump = Object.prototype.toString.call(object);
            if (objectTypeDump === "[object Error]") {
                return object.name;
            }
            return "";
        };
        /**
         * Adds an event handler for the specified event
         * @param eventName {string} - The name of the event
         * @param callback {any} - The callback function that needs to be executed for the given event
         * @return {boolean} - true if the handler was successfully added
         */
        Util.addEventHandler = function (eventName, callback) {
            if (typeof window === 'undefined' || !window || typeof eventName !== 'string' || typeof callback !== 'function') {
                return false;
            }
            // Create verb for the event
            var verbEventName = 'on' + eventName;
            // check if addEventListener is available
            if (window.addEventListener) {
                window.addEventListener(eventName, callback, false);
            }
            else if (window["attachEvent"]) {
                window["attachEvent"](verbEventName, callback);
            }
            else {
                return false;
            }
            return true;
        };
        /**
         * Tells if a browser supports a Beacon API
         */
        Util.IsBeaconApiSupported = function () {
            return ('sendBeacon' in navigator && navigator.sendBeacon);
        };
        Util.getExtension = function (extensions, identifier) {
            var extension = null;
            var extIx = 0;
            while (!extension && extIx < extensions.length) {
                if (extensions[extIx] && extensions[extIx].identifier === identifier) {
                    extension = extensions[extIx];
                }
                extIx++;
            }
            return extension;
        };
        Util.document = typeof document !== "undefined" ? document : {};
        Util._canUseLocalStorage = undefined;
        Util._canUseSessionStorage = undefined;
        // listing only non-geo specific locations
        Util._internalEndpoints = [
            "https://dc.services.visualstudio.com/v2/track",
            "https://breeze.aimon.applicationinsights.io/v2/track",
            "https://dc-int.services.visualstudio.com/v2/track"
        ];
        Util.NotSpecified = "not_specified";
        return Util;
    }());
    var UrlHelper = /** @class */ (function () {
        function UrlHelper() {
        }
        UrlHelper.parseUrl = function (url) {
            if (!UrlHelper.htmlAnchorElement) {
                UrlHelper.htmlAnchorElement = !!UrlHelper.document.createElement ? UrlHelper.document.createElement('a') : { host: UrlHelper.parseHost(url) }; // fill host field in the fallback case as that is the only externally required field from this fn
            }
            UrlHelper.htmlAnchorElement.href = url;
            return UrlHelper.htmlAnchorElement;
        };
        UrlHelper.getAbsoluteUrl = function (url) {
            var result;
            var a = UrlHelper.parseUrl(url);
            if (a) {
                result = a.href;
            }
            return result;
        };
        UrlHelper.getPathName = function (url) {
            var result;
            var a = UrlHelper.parseUrl(url);
            if (a) {
                result = a.pathname;
            }
            return result;
        };
        UrlHelper.getCompleteUrl = function (method, absoluteUrl) {
            if (method) {
                return method.toUpperCase() + " " + absoluteUrl;
            }
            else {
                return absoluteUrl;
            }
        };
        // Fallback method to grab host from url if document.createElement method is not available
        UrlHelper.parseHost = function (url) {
            var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
            if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
                return match[2];
            }
            else {
                return null;
            }
        };
        UrlHelper.document = typeof document !== "undefined" ? document : {};
        return UrlHelper;
    }());
    var CorrelationIdHelper = /** @class */ (function () {
        function CorrelationIdHelper() {
        }
        /**
         * Checks if a request url is not on a excluded domain list and if it is safe to add correlation headers
         */
        CorrelationIdHelper.canIncludeCorrelationHeader = function (config, requestUrl, currentHost) {
            if (config && config.disableCorrelationHeaders) {
                return false;
            }
            if (!requestUrl) {
                return false;
            }
            var requestHost = UrlHelper.parseUrl(requestUrl).host.toLowerCase();
            if ((!config || !config.enableCorsCorrelation) && requestHost !== currentHost) {
                return false;
            }
            var includedDomains = config && config.correlationHeaderDomains;
            if (includedDomains) {
                var matchExists_1;
                includedDomains.forEach(function (domain) {
                    var regex = new RegExp(domain.toLowerCase().replace(/\./g, "\.").replace(/\*/g, ".*"));
                    matchExists_1 = matchExists_1 || regex.test(requestHost);
                });
                if (!matchExists_1) {
                    return false;
                }
            }
            var excludedDomains = config && config.correlationHeaderExcludedDomains;
            if (!excludedDomains || excludedDomains.length === 0) {
                return true;
            }
            for (var i = 0; i < excludedDomains.length; i++) {
                var regex = new RegExp(excludedDomains[i].toLowerCase().replace(/\./g, "\.").replace(/\*/g, ".*"));
                if (regex.test(requestHost)) {
                    return false;
                }
            }
            return true;
        };
        /**
         * Combines target appId and target role name from response header.
         */
        CorrelationIdHelper.getCorrelationContext = function (responseHeader) {
            if (responseHeader) {
                var correlationId = CorrelationIdHelper.getCorrelationContextValue(responseHeader, RequestHeaders.requestContextTargetKey);
                if (correlationId && correlationId !== CorrelationIdHelper.correlationIdPrefix) {
                    return correlationId;
                }
            }
        };
        /**
         * Gets key from correlation response header
         */
        CorrelationIdHelper.getCorrelationContextValue = function (responseHeader, key) {
            if (responseHeader) {
                var keyValues = responseHeader.split(",");
                for (var i = 0; i < keyValues.length; ++i) {
                    var keyValue = keyValues[i].split("=");
                    if (keyValue.length === 2 && keyValue[0] === key) {
                        return keyValue[1];
                    }
                }
            }
        };
        CorrelationIdHelper.correlationIdPrefix = "cid-v1:";
        return CorrelationIdHelper;
    }());
    var AjaxHelper = /** @class */ (function () {
        function AjaxHelper() {
        }
        AjaxHelper.ParseDependencyPath = function (logger, absoluteUrl, method, commandName) {
            var target, name = commandName, data = commandName;
            if (absoluteUrl && absoluteUrl.length > 0) {
                var parsedUrl = UrlHelper.parseUrl(absoluteUrl);
                target = parsedUrl.host;
                if (!name) {
                    if (parsedUrl.pathname != null) {
                        var pathName = (parsedUrl.pathname.length === 0) ? "/" : parsedUrl.pathname;
                        if (pathName.charAt(0) !== '/') {
                            pathName = "/" + pathName;
                        }
                        data = parsedUrl.pathname;
                        name = DataSanitizer.sanitizeString(logger, method ? method + " " + pathName : pathName);
                    }
                    else {
                        name = DataSanitizer.sanitizeString(logger, absoluteUrl);
                    }
                }
            }
            else {
                target = commandName;
                name = commandName;
            }
            return {
                target: target,
                name: name,
                data: data
            };
        };
        return AjaxHelper;
    }());
    /**
     * A utility class that helps getting time related parameters
     */
    var DateTimeUtils = /** @class */ (function () {
        function DateTimeUtils() {
        }
        /**
         * Get the number of milliseconds since 1970/01/01 in local timezone
         */
        DateTimeUtils.Now = (typeof window === 'undefined') ? function () { return new Date().getTime(); } :
            (window.performance && window.performance.now && window.performance.timing) ?
                function () {
                    return window.performance.now() + window.performance.timing.navigationStart;
                }
                :
                    function () {
                        return new Date().getTime();
                    };
        /**
         * Gets duration between two timestamps
         */
        DateTimeUtils.GetDuration = function (start, end) {
            var result = null;
            if (start !== 0 && end !== 0 && !CoreUtils.isNullOrUndefined(start) && !CoreUtils.isNullOrUndefined(end)) {
                result = end - start;
            }
            return result;
        };
        return DateTimeUtils;
    }());

    var DisabledPropertyName = "Microsoft_ApplicationInsights_BypassAjaxInstrumentation";

    // THIS FILE WAS AUTOGENERATED
    /**
     * Data struct to contain only C section with custom fields.
     */
    var Base = /** @class */ (function () {
        function Base() {
        }
        return Base;
    }());

    /**
     * Data struct to contain both B and C sections.
     */
    var Data = /** @class */ (function (_super) {
        __extends(Data, _super);
        function Data() {
            return _super.call(this) || this;
        }
        return Data;
    }(Base));

    /**
     * System variables for a telemetry item.
     */
    var Envelope = /** @class */ (function () {
        function Envelope() {
            this.ver = 1;
            this.sampleRate = 100.0;
            this.tags = {};
        }
        return Envelope;
    }());

    var Envelope$1 = /** @class */ (function (_super) {
        __extends(Envelope$$1, _super);
        /**
         * Constructs a new instance of telemetry data.
         */
        function Envelope$$1(logger, data, name) {
            var _this = _super.call(this) || this;
            _this.name = DataSanitizer.sanitizeString(logger, name) || Util.NotSpecified;
            _this.data = data;
            _this.time = Util.toISOStringForIE8(new Date());
            _this.aiDataContract = {
                time: FieldType.Required,
                iKey: FieldType.Required,
                name: FieldType.Required,
                sampleRate: function () {
                    return (_this.sampleRate === 100) ? FieldType.Hidden : FieldType.Required;
                },
                tags: FieldType.Required,
                data: FieldType.Required
            };
            return _this;
        }
        return Envelope$$1;
    }(Envelope));

    // THIS FILE WAS AUTOGENERATED
    /**
     * The abstract common base of all domains.
     */
    var Domain = /** @class */ (function () {
        function Domain() {
        }
        return Domain;
    }());

    /**
     * Instances of Event represent structured event records that can be grouped and searched by their properties. Event data item also creates a metric of event count by name.
     */
    var EventData = /** @class */ (function (_super) {
        __extends(EventData, _super);
        function EventData() {
            var _this = _super.call(this) || this;
            _this.ver = 2;
            _this.properties = {};
            _this.measurements = {};
            return _this;
        }
        return EventData;
    }(Domain));

    var Event$1 = /** @class */ (function (_super) {
        __extends(Event, _super);
        /**
         * Constructs a new instance of the EventTelemetry object
         */
        function Event(logger, name, properties, measurements) {
            var _this = _super.call(this) || this;
            _this.aiDataContract = {
                ver: FieldType.Required,
                name: FieldType.Required,
                properties: FieldType.Default,
                measurements: FieldType.Default
            };
            _this.name = DataSanitizer.sanitizeString(logger, name) || Util.NotSpecified;
            _this.properties = DataSanitizer.sanitizeProperties(logger, properties);
            _this.measurements = DataSanitizer.sanitizeMeasurements(logger, measurements);
            return _this;
        }
        Event.envelopeType = "Microsoft.ApplicationInsights.{0}.Event";
        Event.dataType = "EventData";
        return Event;
    }(EventData));

    // THIS FILE WAS AUTOGENERATED
    /**
     * Stack frame information.
     */
    var StackFrame = /** @class */ (function () {
        function StackFrame() {
        }
        return StackFrame;
    }());

    /**
     * An instance of Exception represents a handled or unhandled exception that occurred during execution of the monitored application.
     */
    var ExceptionData = /** @class */ (function (_super) {
        __extends(ExceptionData, _super);
        function ExceptionData() {
            var _this = _super.call(this) || this;
            _this.ver = 2;
            _this.exceptions = [];
            _this.properties = {};
            _this.measurements = {};
            return _this;
        }
        return ExceptionData;
    }(Domain));

    /**
     * Exception details of the exception in a chain.
     */
    var ExceptionDetails = /** @class */ (function () {
        function ExceptionDetails() {
            this.hasFullStack = true;
            this.parsedStack = [];
        }
        return ExceptionDetails;
    }());

    var Exception = /** @class */ (function (_super) {
        __extends(Exception, _super);
        /**
         * Constructs a new instance of the ExceptionTelemetry object
         */
        function Exception(logger, exception, properties, measurements, severityLevel, id) {
            var _this = _super.call(this) || this;
            _this.aiDataContract = {
                ver: FieldType.Required,
                exceptions: FieldType.Required,
                severityLevel: FieldType.Default,
                properties: FieldType.Default,
                measurements: FieldType.Default
            };
            if (exception instanceof Error) {
                _this.exceptions = [new _ExceptionDetails(logger, exception)];
                _this.properties = DataSanitizer.sanitizeProperties(logger, properties);
                _this.measurements = DataSanitizer.sanitizeMeasurements(logger, measurements);
                if (severityLevel) {
                    _this.severityLevel = severityLevel;
                }
                if (id) {
                    _this.id = id;
                }
            }
            else {
                _this.exceptions = exception.exceptions;
                _this.properties = exception.properties;
                _this.measurements = exception.measurements;
                if (exception.severityLevel) {
                    _this.severityLevel = exception.severityLevel;
                }
                if (exception.id) {
                    _this.id = exception.id;
                }
                if (exception.problemGroup) {
                    _this.problemGroup = exception.problemGroup;
                }
                // bool/int types, use isNullOrUndefined
                _this.ver = 2; // TODO: handle the CS"4.0" ==> breeze 2 conversion in a better way
                if (!CoreUtils.isNullOrUndefined(exception.isManual)) {
                    _this.isManual = exception.isManual;
                }
            }
            return _this;
        }
        Exception.CreateFromInterface = function (logger, exception) {
            var exceptions = exception.exceptions
                && exception.exceptions.map(function (ex) { return _ExceptionDetails.CreateFromInterface(logger, ex); });
            var exceptionData = new Exception(logger, __assign({}, exception, { exceptions: exceptions }));
            return exceptionData;
        };
        Exception.prototype.toInterface = function () {
            var _a = this, exceptions = _a.exceptions, properties = _a.properties, measurements = _a.measurements, severityLevel = _a.severityLevel, ver = _a.ver, problemGroup = _a.problemGroup, id = _a.id, isManual = _a.isManual;
            var exceptionDetailsInterface = exceptions instanceof Array
                && exceptions.map(function (exception) { return exception.toInterface(); })
                || undefined;
            return {
                ver: "4.0",
                exceptions: exceptionDetailsInterface,
                severityLevel: severityLevel,
                properties: properties,
                measurements: measurements,
                problemGroup: problemGroup,
                id: id,
                isManual: isManual
            };
        };
        /**
         * Creates a simple exception with 1 stack frame. Useful for manual constracting of exception.
         */
        Exception.CreateSimpleException = function (message, typeName, assembly, fileName, details, line) {
            return {
                exceptions: [
                    {
                        hasFullStack: true,
                        message: message,
                        stack: details,
                        typeName: typeName
                    }
                ]
            };
        };
        Exception.envelopeType = "Microsoft.ApplicationInsights.{0}.Exception";
        Exception.dataType = "ExceptionData";
        return Exception;
    }(ExceptionData));
    var _ExceptionDetails = /** @class */ (function (_super) {
        __extends(_ExceptionDetails, _super);
        function _ExceptionDetails(logger, exception) {
            var _this = _super.call(this) || this;
            _this.aiDataContract = {
                id: FieldType.Default,
                outerId: FieldType.Default,
                typeName: FieldType.Required,
                message: FieldType.Required,
                hasFullStack: FieldType.Default,
                stack: FieldType.Default,
                parsedStack: FieldType.Array
            };
            if (exception instanceof Error) {
                _this.typeName = DataSanitizer.sanitizeString(logger, exception.name) || Util.NotSpecified;
                _this.message = DataSanitizer.sanitizeMessage(logger, exception.message) || Util.NotSpecified;
                var stack = exception.stack;
                _this.parsedStack = _ExceptionDetails.parseStack(stack);
                _this.stack = DataSanitizer.sanitizeException(logger, stack);
                _this.hasFullStack = Util.isArray(_this.parsedStack) && _this.parsedStack.length > 0;
            }
            else {
                _this.typeName = exception.typeName;
                _this.message = exception.message;
                _this.stack = exception.stack;
                _this.parsedStack = exception.parsedStack;
                _this.hasFullStack = exception.hasFullStack;
            }
            return _this;
        }
        _ExceptionDetails.prototype.toInterface = function () {
            var parsedStack = this.parsedStack instanceof Array
                && this.parsedStack.map(function (frame) { return frame.toInterface(); });
            var exceptionDetailsInterface = {
                id: this.id,
                outerId: this.outerId,
                typeName: this.typeName,
                message: this.message,
                hasFullStack: this.hasFullStack,
                stack: this.stack,
                parsedStack: parsedStack || undefined
            };
            return exceptionDetailsInterface;
        };
        _ExceptionDetails.CreateFromInterface = function (logger, exception) {
            var parsedStack = (exception.parsedStack instanceof Array
                && exception.parsedStack.map(function (frame) { return _StackFrame.CreateFromInterface(frame); }))
                || exception.parsedStack;
            var exceptionDetails = new _ExceptionDetails(logger, __assign({}, exception, { parsedStack: parsedStack }));
            return exceptionDetails;
        };
        _ExceptionDetails.parseStack = function (stack) {
            var parsedStack;
            if (typeof stack === "string") {
                var frames_1 = stack.split('\n');
                parsedStack = [];
                var level = 0;
                var totalSizeInBytes = 0;
                for (var i = 0; i <= frames_1.length; i++) {
                    var frame = frames_1[i];
                    if (_StackFrame.regex.test(frame)) {
                        var parsedFrame = new _StackFrame(frames_1[i], level++);
                        totalSizeInBytes += parsedFrame.sizeInBytes;
                        parsedStack.push(parsedFrame);
                    }
                }
                // DP Constraint - exception parsed stack must be < 32KB
                // remove frames from the middle to meet the threshold
                var exceptionParsedStackThreshold = 32 * 1024;
                if (totalSizeInBytes > exceptionParsedStackThreshold) {
                    var left = 0;
                    var right = parsedStack.length - 1;
                    var size = 0;
                    var acceptedLeft = left;
                    var acceptedRight = right;
                    while (left < right) {
                        // check size
                        var lSize = parsedStack[left].sizeInBytes;
                        var rSize = parsedStack[right].sizeInBytes;
                        size += lSize + rSize;
                        if (size > exceptionParsedStackThreshold) {
                            // remove extra frames from the middle
                            var howMany = acceptedRight - acceptedLeft + 1;
                            parsedStack.splice(acceptedLeft, howMany);
                            break;
                        }
                        // update pointers
                        acceptedLeft = left;
                        acceptedRight = right;
                        left++;
                        right--;
                    }
                }
            }
            return parsedStack;
        };
        return _ExceptionDetails;
    }(ExceptionDetails));
    var _StackFrame = /** @class */ (function (_super) {
        __extends(_StackFrame, _super);
        function _StackFrame(sourceFrame, level) {
            var _this = _super.call(this) || this;
            _this.sizeInBytes = 0;
            _this.aiDataContract = {
                level: FieldType.Required,
                method: FieldType.Required,
                assembly: FieldType.Default,
                fileName: FieldType.Default,
                line: FieldType.Default,
            };
            if (typeof sourceFrame === "string") {
                var frame = sourceFrame;
                _this.level = level;
                _this.method = "<no_method>";
                _this.assembly = Util.trim(frame);
                _this.fileName = "";
                _this.line = 0;
                var matches = frame.match(_StackFrame.regex);
                if (matches && matches.length >= 5) {
                    _this.method = Util.trim(matches[2]) || _this.method;
                    _this.fileName = Util.trim(matches[4]);
                    _this.line = parseInt(matches[5]) || 0;
                }
            }
            else {
                _this.level = sourceFrame.level;
                _this.method = sourceFrame.method;
                _this.assembly = sourceFrame.assembly;
                _this.fileName = sourceFrame.fileName;
                _this.line = sourceFrame.line;
                _this.sizeInBytes = 0;
            }
            _this.sizeInBytes += _this.method.length;
            _this.sizeInBytes += _this.fileName.length;
            _this.sizeInBytes += _this.assembly.length;
            // todo: these might need to be removed depending on how the back-end settles on their size calculation
            _this.sizeInBytes += _StackFrame.baseSize;
            _this.sizeInBytes += _this.level.toString().length;
            _this.sizeInBytes += _this.line.toString().length;
            return _this;
        }
        _StackFrame.CreateFromInterface = function (frame) {
            return new _StackFrame(frame, null /* level is available in frame interface */);
        };
        _StackFrame.prototype.toInterface = function () {
            return {
                level: this.level,
                method: this.method,
                assembly: this.assembly,
                fileName: this.fileName,
                line: this.line
            };
        };
        // regex to match stack frames from ie/chrome/ff
        // methodName=$2, fileName=$4, lineNo=$5, column=$6
        _StackFrame.regex = /^([\s]+at)?(.*?)(\@|\s\(|\s)([^\(\@\n]+):([0-9]+):([0-9]+)(\)?)$/;
        _StackFrame.baseSize = 58; // '{"method":"","level":,"assembly":"","fileName":"","line":}'.length
        return _StackFrame;
    }(StackFrame));

    /**
     * An instance of the Metric item is a list of measurements (single data points) and/or aggregations.
     */
    var MetricData = /** @class */ (function (_super) {
        __extends(MetricData, _super);
        function MetricData() {
            var _this = _super.call(this) || this;
            _this.ver = 2;
            _this.metrics = [];
            _this.properties = {};
            return _this;
        }
        return MetricData;
    }(Domain));

    // THIS FILE WAS AUTOGENERATED
    /**
     * Type of the metric data measurement.
     */
    var DataPointType;
    (function (DataPointType) {
        DataPointType[DataPointType["Measurement"] = 0] = "Measurement";
        DataPointType[DataPointType["Aggregation"] = 1] = "Aggregation";
    })(DataPointType || (DataPointType = {}));

    /**
     * Metric data single measurement.
     */
    var DataPoint = /** @class */ (function () {
        function DataPoint() {
            this.kind = DataPointType.Measurement;
        }
        return DataPoint;
    }());

    var DataPoint$1 = /** @class */ (function (_super) {
        __extends(DataPoint$$1, _super);
        function DataPoint$$1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * The data contract for serializing this object.
             */
            _this.aiDataContract = {
                name: FieldType.Required,
                kind: FieldType.Default,
                value: FieldType.Required,
                count: FieldType.Default,
                min: FieldType.Default,
                max: FieldType.Default,
                stdDev: FieldType.Default
            };
            return _this;
        }
        return DataPoint$$1;
    }(DataPoint));

    var Metric = /** @class */ (function (_super) {
        __extends(Metric, _super);
        /**
         * Constructs a new instance of the MetricTelemetry object
         */
        function Metric(logger, name, value, count, min, max, properties) {
            var _this = _super.call(this) || this;
            _this.aiDataContract = {
                ver: FieldType.Required,
                metrics: FieldType.Required,
                properties: FieldType.Default
            };
            var dataPoint = new DataPoint$1();
            dataPoint.count = count > 0 ? count : undefined;
            dataPoint.max = isNaN(max) || max === null ? undefined : max;
            dataPoint.min = isNaN(min) || min === null ? undefined : min;
            dataPoint.name = DataSanitizer.sanitizeString(logger, name) || Util.NotSpecified;
            dataPoint.value = value;
            _this.metrics = [dataPoint];
            _this.properties = DataSanitizer.sanitizeProperties(logger, properties);
            return _this;
        }
        Metric.envelopeType = "Microsoft.ApplicationInsights.{0}.Metric";
        Metric.dataType = "MetricData";
        return Metric;
    }(MetricData));

    /**
     * An instance of PageView represents a generic action on a page like a button click. It is also the base type for PageView.
     */
    var PageViewData = /** @class */ (function (_super) {
        __extends(PageViewData, _super);
        function PageViewData() {
            var _this = _super.call(this) || this;
            _this.ver = 2;
            _this.properties = {};
            _this.measurements = {};
            return _this;
        }
        return PageViewData;
    }(EventData));

    var PageView = /** @class */ (function (_super) {
        __extends(PageView, _super);
        /**
         * Constructs a new instance of the PageEventTelemetry object
         */
        function PageView(logger, name, url, durationMs, properties, measurements, id) {
            var _this = _super.call(this) || this;
            _this.aiDataContract = {
                ver: FieldType.Required,
                name: FieldType.Default,
                url: FieldType.Default,
                duration: FieldType.Default,
                properties: FieldType.Default,
                measurements: FieldType.Default,
                id: FieldType.Default
            };
            _this.id = DataSanitizer.sanitizeId(logger, id);
            _this.url = DataSanitizer.sanitizeUrl(logger, url);
            _this.name = DataSanitizer.sanitizeString(logger, name) || Util.NotSpecified;
            if (!isNaN(durationMs)) {
                _this.duration = Util.msToTimeSpan(durationMs);
            }
            _this.properties = DataSanitizer.sanitizeProperties(logger, properties);
            _this.measurements = DataSanitizer.sanitizeMeasurements(logger, measurements);
            return _this;
        }
        PageView.envelopeType = "Microsoft.ApplicationInsights.{0}.Pageview";
        PageView.dataType = "PageviewData";
        return PageView;
    }(PageViewData));

    /**
     * An instance of Remote Dependency represents an interaction of the monitored component with a remote component/service like SQL or an HTTP endpoint.
     */
    var RemoteDependencyData = /** @class */ (function (_super) {
        __extends(RemoteDependencyData, _super);
        function RemoteDependencyData() {
            var _this = _super.call(this) || this;
            _this.ver = 2;
            _this.success = true;
            _this.properties = {};
            _this.measurements = {};
            return _this;
        }
        return RemoteDependencyData;
    }(Domain));

    var RemoteDependencyData$1 = /** @class */ (function (_super) {
        __extends(RemoteDependencyData$$1, _super);
        /**
         * Constructs a new instance of the RemoteDependencyData object
         */
        function RemoteDependencyData$$1(logger, id, absoluteUrl, commandName, value, success, resultCode, method, requestAPI, correlationContext, properties, measurements) {
            if (requestAPI === void 0) { requestAPI = "Ajax"; }
            var _this = _super.call(this) || this;
            _this.aiDataContract = {
                id: FieldType.Required,
                ver: FieldType.Required,
                name: FieldType.Default,
                resultCode: FieldType.Default,
                duration: FieldType.Default,
                success: FieldType.Default,
                data: FieldType.Default,
                target: FieldType.Default,
                type: FieldType.Default,
                properties: FieldType.Default,
                measurements: FieldType.Default,
                kind: FieldType.Default,
                value: FieldType.Default,
                count: FieldType.Default,
                min: FieldType.Default,
                max: FieldType.Default,
                stdDev: FieldType.Default,
                dependencyKind: FieldType.Default,
                dependencySource: FieldType.Default,
                commandName: FieldType.Default,
                dependencyTypeName: FieldType.Default,
            };
            _this.id = id;
            _this.duration = Util.msToTimeSpan(value);
            _this.success = success;
            _this.resultCode = resultCode + "";
            _this.type = DataSanitizer.sanitizeString(logger, requestAPI);
            var dependencyFields = AjaxHelper.ParseDependencyPath(logger, absoluteUrl, method, commandName);
            _this.data = DataSanitizer.sanitizeUrl(logger, commandName) || dependencyFields.data; // get a value from hosturl if commandName not available
            _this.target = DataSanitizer.sanitizeString(logger, dependencyFields.target);
            if (correlationContext) {
                _this.target = _this.target + " | " + correlationContext;
            }
            _this.name = DataSanitizer.sanitizeString(logger, dependencyFields.name);
            _this.properties = DataSanitizer.sanitizeProperties(logger, properties);
            _this.measurements = DataSanitizer.sanitizeMeasurements(logger, measurements);
            return _this;
        }
        RemoteDependencyData$$1.envelopeType = "Microsoft.ApplicationInsights.{0}.RemoteDependency";
        RemoteDependencyData$$1.dataType = "RemoteDependencyData";
        return RemoteDependencyData$$1;
    }(RemoteDependencyData));

    /**
     * Instances of Message represent printf-like trace statements that are text-searched. Log4Net, NLog and other text-based log file entries are translated into intances of this type. The message does not have measurements.
     */
    var MessageData = /** @class */ (function (_super) {
        __extends(MessageData, _super);
        function MessageData() {
            var _this = _super.call(this) || this;
            _this.ver = 2;
            _this.properties = {};
            return _this;
        }
        return MessageData;
    }(Domain));

    var Trace = /** @class */ (function (_super) {
        __extends(Trace, _super);
        /**
         * Constructs a new instance of the TraceTelemetry object
         */
        function Trace(logger, message, severityLevel, properties) {
            var _this = _super.call(this) || this;
            _this.aiDataContract = {
                ver: FieldType.Required,
                message: FieldType.Required,
                severityLevel: FieldType.Default,
                properties: FieldType.Default
            };
            message = message || Util.NotSpecified;
            _this.message = DataSanitizer.sanitizeMessage(logger, message);
            _this.properties = DataSanitizer.sanitizeProperties(logger, properties);
            if (severityLevel) {
                _this.severityLevel = severityLevel;
            }
            return _this;
        }
        Trace.envelopeType = "Microsoft.ApplicationInsights.{0}.Message";
        Trace.dataType = "MessageData";
        return Trace;
    }(MessageData));

    /**
     * An instance of PageViewPerf represents: a page view with no performance data, a page view with performance data, or just the performance data of an earlier page request.
     */
    var PageViewPerfData = /** @class */ (function (_super) {
        __extends(PageViewPerfData, _super);
        function PageViewPerfData() {
            var _this = _super.call(this) || this;
            _this.ver = 2;
            _this.properties = {};
            _this.measurements = {};
            return _this;
        }
        return PageViewPerfData;
    }(PageViewData));

    var PageViewPerformance = /** @class */ (function (_super) {
        __extends(PageViewPerformance, _super);
        /**
         * Constructs a new instance of the PageEventTelemetry object
         */
        function PageViewPerformance(logger, name, url, unused, properties, measurements, cs4BaseData) {
            var _this = _super.call(this) || this;
            _this.aiDataContract = {
                ver: FieldType.Required,
                name: FieldType.Default,
                url: FieldType.Default,
                duration: FieldType.Default,
                perfTotal: FieldType.Default,
                networkConnect: FieldType.Default,
                sentRequest: FieldType.Default,
                receivedResponse: FieldType.Default,
                domProcessing: FieldType.Default,
                properties: FieldType.Default,
                measurements: FieldType.Default
            };
            _this.url = DataSanitizer.sanitizeUrl(logger, url);
            _this.name = DataSanitizer.sanitizeString(logger, name) || Util.NotSpecified;
            _this.properties = DataSanitizer.sanitizeProperties(logger, properties);
            _this.measurements = DataSanitizer.sanitizeMeasurements(logger, measurements);
            if (cs4BaseData) {
                _this.domProcessing = cs4BaseData.domProcessing;
                _this.duration = cs4BaseData.duration;
                _this.networkConnect = cs4BaseData.networkConnect;
                _this.perfTotal = cs4BaseData.perfTotal;
                _this.receivedResponse = cs4BaseData.receivedResponse;
                _this.sentRequest = cs4BaseData.sentRequest;
            }
            return _this;
        }
        PageViewPerformance.envelopeType = "Microsoft.ApplicationInsights.{0}.PageviewPerformance";
        PageViewPerformance.dataType = "PageviewPerformanceData";
        return PageViewPerformance;
    }(PageViewPerfData));

    var Data$1 = /** @class */ (function (_super) {
        __extends(Data$$1, _super);
        /**
         * Constructs a new instance of telemetry data.
         */
        function Data$$1(baseType, data) {
            var _this = _super.call(this) || this;
            /**
             * The data contract for serializing this object.
             */
            _this.aiDataContract = {
                baseType: FieldType.Required,
                baseData: FieldType.Required
            };
            _this.baseType = baseType;
            _this.baseData = data;
            return _this;
        }
        return Data$$1;
    }(Data));

    // THIS FILE WAS AUTOGENERATED
    /**
     * Defines the level of severity for the event.
     */
    var SeverityLevel;
    (function (SeverityLevel) {
        SeverityLevel[SeverityLevel["Verbose"] = 0] = "Verbose";
        SeverityLevel[SeverityLevel["Information"] = 1] = "Information";
        SeverityLevel[SeverityLevel["Warning"] = 2] = "Warning";
        SeverityLevel[SeverityLevel["Error"] = 3] = "Error";
        SeverityLevel[SeverityLevel["Critical"] = 4] = "Critical";
    })(SeverityLevel || (SeverityLevel = {}));

    var ConfigurationManager = /** @class */ (function () {
        function ConfigurationManager() {
        }
        ConfigurationManager.getConfig = function (config, field, identifier, defaultValue) {
            if (defaultValue === void 0) { defaultValue = false; }
            var configValue;
            if (identifier && config.extensionConfig && config.extensionConfig[identifier] && !CoreUtils.isNullOrUndefined(config.extensionConfig[identifier][field])) {
                configValue = config.extensionConfig[identifier][field];
            }
            else {
                configValue = config[field];
            }
            return !CoreUtils.isNullOrUndefined(configValue) ? configValue : defaultValue;
        };
        return ConfigurationManager;
    }());

    var TelemetryItemCreator = /** @class */ (function () {
        function TelemetryItemCreator() {
        }
        /**
         * Create a telemetry item that the 1DS channel understands
         * @param item domain specific properties; part B
         * @param baseType telemetry item type. ie PageViewData
         * @param envelopeName name of the envelope. ie Microsoft.ApplicationInsights.<instrumentation key>.PageView
         * @param customProperties user defined custom properties; part C
         * @param systemProperties system properties that are added to the context; part A
         * @returns ITelemetryItem that is sent to channel
         */
        TelemetryItemCreator.create = function (item, baseType, envelopeName, logger, customProperties, systemProperties) {
            envelopeName = DataSanitizer.sanitizeString(logger, envelopeName) || Util.NotSpecified;
            if (CoreUtils.isNullOrUndefined(item) ||
                CoreUtils.isNullOrUndefined(baseType) ||
                CoreUtils.isNullOrUndefined(envelopeName)) {
                throw Error("Input doesn't contain all required fields");
            }
            var telemetryItem = {
                name: envelopeName,
                time: new Date().toISOString(),
                iKey: "",
                ext: systemProperties ? systemProperties : {},
                tags: [],
                data: {},
                baseType: baseType,
                baseData: item // Part B
            };
            // Part C
            if (!CoreUtils.isNullOrUndefined(customProperties)) {
                for (var prop in customProperties) {
                    if (customProperties.hasOwnProperty(prop)) {
                        telemetryItem.data[prop] = customProperties[prop];
                    }
                }
            }
            return telemetryItem;
        };
        return TelemetryItemCreator;
    }());

    var PropertiesPluginIdentifier = "AppInsightsPropertiesPlugin";

    var XHRMonitoringState = /** @class */ (function () {
        function XHRMonitoringState() {
            this.openDone = false;
            this.setRequestHeaderDone = false;
            this.sendDone = false;
            this.abortDone = false;
            // <summary>True, if onreadyStateChangeCallback function attached to xhr, otherwise false</summary>
            this.onreadystatechangeCallbackAttached = false;
        }
        return XHRMonitoringState;
    }());
    var ajaxRecord = /** @class */ (function () {
        function ajaxRecord(traceID, spanID, logger) {
            this.completed = false;
            this.requestHeadersSize = null;
            this.requestHeaders = null;
            this.ttfb = null;
            this.responseReceivingDuration = null;
            this.callbackDuration = null;
            this.ajaxTotalDuration = null;
            this.aborted = null;
            this.pageUrl = null;
            this.requestUrl = null;
            this.requestSize = 0;
            this.method = null;
            /// <summary>Returns the HTTP status code.</summary>
            this.status = null;
            // <summary>The timestamp when open method was invoked</summary>
            this.requestSentTime = null;
            // <summary>The timestamps when first byte was received</summary>
            this.responseStartedTime = null;
            // <summary>The timestamp when last byte was received</summary>
            this.responseFinishedTime = null;
            // <summary>The timestamp when onreadystatechange callback in readyState 4 finished</summary>
            this.callbackFinishedTime = null;
            // <summary>The timestamp at which ajax was ended</summary>
            this.endTime = null;
            // <summary>The original xhr onreadystatechange event</summary>
            this.originalOnreadystatechage = null;
            this.xhrMonitoringState = new XHRMonitoringState();
            // <summary>Determines whether or not JavaScript exception occured in xhr.onreadystatechange code. 1 if occured, otherwise 0.</summary>
            this.clientFailure = 0;
            this.CalculateMetrics = function () {
                var self = this;
                // round to 3 decimal points
                self.ajaxTotalDuration = Math.round(DateTimeUtils.GetDuration(self.requestSentTime, self.responseFinishedTime) * 1000) / 1000;
            };
            this.traceID = traceID;
            this.spanID = spanID;
            this._logger = logger;
        }
        ajaxRecord.prototype.getAbsoluteUrl = function () {
            return this.requestUrl ? UrlHelper.getAbsoluteUrl(this.requestUrl) : null;
        };
        ajaxRecord.prototype.getPathName = function () {
            return this.requestUrl ? DataSanitizer.sanitizeUrl(this._logger, UrlHelper.getCompleteUrl(this.method, this.requestUrl)) : null;
        };
        return ajaxRecord;
    }());

    var EventHelper = /** @class */ (function () {
        function EventHelper() {
        }
        /// <summary>Binds the specified function to an event, so that the function gets called whenever the event fires on the object</summary>
        /// <param name="obj">Object to which </param>
        /// <param name="eventNameWithoutOn">String that specifies any of the standard DHTML Events without "on" prefix</param>
        /// <param name="handlerRef">Pointer that specifies the function to call when event fires</param>
        /// <returns>True if the function was bound successfully to the event, otherwise false</returns>
        EventHelper.AttachEvent = function (obj, eventNameWithoutOn, handlerRef) {
            var result = false;
            if (!CoreUtils.isNullOrUndefined(obj)) {
                if (!CoreUtils.isNullOrUndefined(obj.attachEvent)) {
                    // IE before version 9                    
                    obj.attachEvent("on" + eventNameWithoutOn, handlerRef);
                    result = true;
                }
                else {
                    if (!CoreUtils.isNullOrUndefined(obj.addEventListener)) {
                        // all browsers except IE before version 9
                        obj.addEventListener(eventNameWithoutOn, handlerRef, false);
                        result = true;
                    }
                }
            }
            return result;
        };
        EventHelper.DetachEvent = function (obj, eventNameWithoutOn, handlerRef) {
            if (!CoreUtils.isNullOrUndefined(obj)) {
                if (!CoreUtils.isNullOrUndefined(obj.detachEvent)) {
                    obj.detachEvent("on" + eventNameWithoutOn, handlerRef);
                }
                else {
                    if (!CoreUtils.isNullOrUndefined(obj.removeEventListener)) {
                        obj.removeEventListener(eventNameWithoutOn, handlerRef, false);
                    }
                }
            }
        };
        return EventHelper;
    }());

    var Traceparent = /** @class */ (function () {
        function Traceparent(traceId, spanId) {
            this.traceFlag = Traceparent.DEFAULT_TRACE_FLAG;
            this.version = Traceparent.DEFAULT_VERSION;
            if (traceId && Traceparent.isValidTraceId(traceId)) {
                this.traceId = traceId;
            }
            else {
                this.traceId = Util.generateW3CId();
            }
            if (spanId && Traceparent.isValidSpanId(spanId)) {
                this.spanId = spanId;
            }
            else {
                this.spanId = Util.generateW3CId().substr(0, 16);
            }
        }
        Traceparent.isValidTraceId = function (id) {
            return id.match(/^[0-9a-f]{32}$/) && id !== "00000000000000000000000000000000";
        };
        Traceparent.isValidSpanId = function (id) {
            return id.match(/^[0-9a-f]{16}$/) && id !== "0000000000000000";
        };
        Traceparent.prototype.toString = function () {
            return this.version + "-" + this.traceId + "-" + this.spanId + "-" + this.traceFlag;
        };
        Traceparent.DEFAULT_TRACE_FLAG = "01";
        Traceparent.DEFAULT_VERSION = "00";
        return Traceparent;
    }());

    var AjaxMonitor = /** @class */ (function () {
        function AjaxMonitor() {
            this.identifier = AjaxMonitor.identifier;
            this.priority = 120;
            this._trackAjaxAttempts = 0;
            this.currentWindowHost = window && window.location && window.location.host && window.location.host.toLowerCase();
            this.initialized = false;
            this._fetchInitialized = false;
        }
        AjaxMonitor.getDefaultConfig = function () {
            var config = {
                maxAjaxCallsPerView: 500,
                disableAjaxTracking: false,
                disableFetchTracking: true,
                disableCorrelationHeaders: false,
                distributedTracingMode: DistributedTracingModes.AI,
                correlationHeaderExcludedDomains: [
                    "*.blob.core.windows.net",
                    "*.blob.core.chinacloudapi.cn",
                    "*.blob.core.cloudapi.de",
                    "*.blob.core.usgovcloudapi.net"
                ],
                correlationHeaderDomains: undefined,
                appId: undefined,
                enableCorsCorrelation: false,
                enableRequestHeaderTracking: false,
                enableResponseHeaderTracking: false
            };
            return config;
        };
        AjaxMonitor.getEmptyConfig = function () {
            return {
                maxAjaxCallsPerView: undefined,
                disableAjaxTracking: undefined,
                disableFetchTracking: undefined,
                disableCorrelationHeaders: undefined,
                distributedTracingMode: undefined,
                correlationHeaderExcludedDomains: undefined,
                appId: undefined,
                enableCorsCorrelation: undefined,
                correlationHeaderDomains: undefined,
                enableRequestHeaderTracking: undefined,
                enableResponseHeaderTracking: undefined
            };
        };
        AjaxMonitor.getFailedAjaxDiagnosticsMessage = function (xhr) {
            var result = "";
            try {
                if (!CoreUtils.isNullOrUndefined(xhr) &&
                    !CoreUtils.isNullOrUndefined(xhr.ajaxData) &&
                    !CoreUtils.isNullOrUndefined(xhr.ajaxData.requestUrl)) {
                    result += "(url: '" + xhr.ajaxData.requestUrl + "')";
                }
            }
            catch (e) { }
            return result;
        };
        AjaxMonitor.prototype.trackDependencyData = function (dependency, properties) {
            this.trackDependencyDataInternal(dependency, properties);
        };
        AjaxMonitor.prototype.processTelemetry = function (item) {
            if (this._nextPlugin && this._nextPlugin.processTelemetry) {
                this._nextPlugin.processTelemetry(item);
            }
        };
        AjaxMonitor.prototype.setNextPlugin = function (next) {
            if (next) {
                this._nextPlugin = next;
            }
        };
        AjaxMonitor.prototype.includeCorrelationHeaders = function (ajaxData, input, init, xhr) {
            if (input) {
                if (CorrelationIdHelper.canIncludeCorrelationHeader(this._config, ajaxData.getAbsoluteUrl(), this.currentWindowHost)) {
                    if (!init) {
                        init = {};
                    }
                    // init headers override original request headers
                    // so, if they exist use only them, otherwise use request's because they should have been applied in the first place
                    // not using original request headers will result in them being lost
                    init.headers = new Headers(init.headers || (input instanceof Request ? (input.headers || {}) : {}));
                    if (this._isUsingAIHeaders) {
                        var id = "|" + ajaxData.traceID + "." + ajaxData.spanID;
                        init.headers.set(RequestHeaders.requestIdHeader, id);
                        if (this._config.enableRequestHeaderTracking) {
                            ajaxData.requestHeaders[RequestHeaders.requestIdHeader] = id;
                        }
                    }
                    var appId = this._config.appId || this._context.appId();
                    if (appId) {
                        init.headers.set(RequestHeaders.requestContextHeader, RequestHeaders.requestContextAppIdFormat + appId);
                        if (this._config.enableRequestHeaderTracking) {
                            ajaxData.requestHeaders[RequestHeaders.requestContextHeader] = RequestHeaders.requestContextAppIdFormat + appId;
                        }
                    }
                    if (this._isUsingW3CHeaders) {
                        var traceparent = new Traceparent(ajaxData.traceID, ajaxData.spanID);
                        init.headers.set(RequestHeaders.traceParentHeader, traceparent.toString());
                        if (this._config.enableRequestHeaderTracking) {
                            ajaxData.requestHeaders[RequestHeaders.traceParentHeader] = traceparent.toString();
                        }
                    }
                    return init;
                }
                return init;
            }
            else if (xhr) {
                if (this.currentWindowHost && CorrelationIdHelper.canIncludeCorrelationHeader(this._config, xhr.ajaxData.getAbsoluteUrl(), this.currentWindowHost)) {
                    if (this._isUsingAIHeaders) {
                        var id = "|" + xhr.ajaxData.traceID + "." + xhr.ajaxData.spanID;
                        xhr.setRequestHeader(RequestHeaders.requestIdHeader, id);
                        if (this._config.enableRequestHeaderTracking) {
                            xhr.ajaxData.requestHeaders[RequestHeaders.requestIdHeader] = id;
                        }
                    }
                    var appId = this._config.appId || this._context.appId();
                    if (appId) {
                        xhr.setRequestHeader(RequestHeaders.requestContextHeader, RequestHeaders.requestContextAppIdFormat + appId);
                        if (this._config.enableRequestHeaderTracking) {
                            xhr.ajaxData.requestHeaders[RequestHeaders.requestContextHeader] = RequestHeaders.requestContextAppIdFormat + appId;
                        }
                    }
                    if (this._isUsingW3CHeaders) {
                        var traceparent = new Traceparent(xhr.ajaxData.traceID, xhr.ajaxData.spanID);
                        xhr.setRequestHeader(RequestHeaders.traceParentHeader, traceparent.toString());
                        if (this._config.enableRequestHeaderTracking) {
                            xhr.ajaxData.requestHeaders[RequestHeaders.traceParentHeader] = traceparent.toString();
                        }
                    }
                }
                return xhr;
            }
            return undefined;
        };
        AjaxMonitor.prototype.initialize = function (config, core, extensions) {
            if (!this.initialized && !this._fetchInitialized) {
                this._core = core;
                var defaultConfig = AjaxMonitor.getDefaultConfig();
                this._config = AjaxMonitor.getEmptyConfig();
                for (var field in defaultConfig) {
                    this._config[field] = ConfigurationManager.getConfig(config, field, AjaxMonitor.identifier, defaultConfig[field]);
                }
                this._isUsingAIHeaders = this._config.distributedTracingMode === DistributedTracingModes.AI || this._config.distributedTracingMode === DistributedTracingModes.AI_AND_W3C;
                this._isUsingW3CHeaders = this._config.distributedTracingMode === DistributedTracingModes.AI_AND_W3C || this._config.distributedTracingMode === DistributedTracingModes.W3C;
                if (this._config.disableAjaxTracking === false) {
                    this.instrumentXhr();
                }
                if (this._config.disableFetchTracking === false) {
                    this.instrumentFetch();
                }
                if (extensions.length > 0 && extensions) {
                    var propExt = void 0, extIx = 0;
                    while (!propExt && extIx < extensions.length) {
                        if (extensions[extIx] && extensions[extIx].identifier === PropertiesPluginIdentifier) {
                            propExt = extensions[extIx];
                        }
                        extIx++;
                    }
                    if (propExt) {
                        this._context = propExt.context; // we could move IPropertiesPlugin to common as well
                    }
                }
            }
        };
        /**
         * Logs dependency call
         * @param dependencyData dependency data object
         */
        AjaxMonitor.prototype.trackDependencyDataInternal = function (dependency, properties, systemProperties) {
            if (this._config.maxAjaxCallsPerView === -1 || this._trackAjaxAttempts < this._config.maxAjaxCallsPerView) {
                var item = TelemetryItemCreator.create(dependency, RemoteDependencyData$1.dataType, RemoteDependencyData$1.envelopeType, this._core.logger, properties, systemProperties);
                this._core.track(item);
            }
            else if (this._trackAjaxAttempts === this._config.maxAjaxCallsPerView) {
                this._core.logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.MaxAjaxPerPVExceeded, "Maximum ajax per page view limit reached, ajax monitoring is paused until the next trackPageView(). In order to increase the limit set the maxAjaxCallsPerView configuration parameter.", true);
            }
            ++this._trackAjaxAttempts;
        };
        // Fetch Stuff
        AjaxMonitor.prototype.instrumentFetch = function () {
            if (!this.supportsFetch() || this._fetchInitialized) {
                return;
            }
            var originalFetch = window.fetch;
            var fetchMonitorInstance = this;
            window.fetch = function fetch(input, init) {
                var fetchData;
                if (fetchMonitorInstance.isFetchInstrumented(input) && fetchMonitorInstance.isMonitoredInstance(undefined, undefined, input, init)) {
                    try {
                        fetchData = fetchMonitorInstance.createFetchRecord(input, init);
                        init = fetchMonitorInstance.includeCorrelationHeaders(fetchData, input, init);
                    }
                    catch (e) {
                        fetchMonitorInstance._core.logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.FailedMonitorAjaxOpen, "Failed to monitor Window.fetch, monitoring data for this fetch call may be incorrect.", {
                            ajaxDiagnosticsMessage: this.getFailedFetchDiagnosticsMessage(input),
                            exception: Util.dump(e)
                        });
                    }
                }
                return originalFetch(input, init)
                    .then(function (response) {
                    fetchMonitorInstance.onFetchComplete(response, fetchData);
                    return response;
                })
                    .catch(function (reason) {
                    fetchMonitorInstance.onFetchFailed(input, fetchData, reason);
                    throw reason;
                });
            };
            this._fetchInitialized = true;
        };
        AjaxMonitor.prototype.instrumentXhr = function () {
            if (this.supportsAjaxMonitoring() && !this.initialized) {
                this.instrumentOpen();
                this.instrumentSend();
                this.instrumentAbort();
                this.instrumentSetRequestHeader();
                this.initialized = true;
            }
        };
        /// <summary>Verifies that particalar instance of XMLHttpRequest needs to be monitored</summary>
        /// <param name="excludeAjaxDataValidation">Optional parameter. True if ajaxData must be excluded from verification</param>
        /// <returns type="bool">True if instance needs to be monitored, otherwise false</returns>
        AjaxMonitor.prototype.isMonitoredInstance = function (xhr, excludeAjaxDataValidation, request, init) {
            var disabledProperty = false;
            var ajaxValidation = true;
            var initialized = false;
            if (typeof request !== 'undefined') {
                initialized = this._fetchInitialized;
                // Look for DisabledPropertyName in either Request or RequestInit
                disabledProperty = (typeof request === 'object' ? request[DisabledPropertyName] === true : false) ||
                    (init ? init[DisabledPropertyName] === true : false);
            }
            else if (typeof xhr !== 'undefined') {
                initialized = this.initialized;
                disabledProperty = xhr[DisabledPropertyName] === true;
                ajaxValidation = excludeAjaxDataValidation === true || !CoreUtils.isNullOrUndefined(xhr.ajaxData);
            }
            // checking to see that all interested functions on xhr were instrumented
            return initialized
                // checking on ajaxData to see that it was not removed in user code
                && ajaxValidation
                // check that this instance is not not used by ajax call performed inside client side monitoring to send data to collector
                && !disabledProperty;
        };
        /// <summary>Determines whether ajax monitoring can be enabled on this document</summary>
        /// <returns>True if Ajax monitoring is supported on this page, otherwise false</returns>
        AjaxMonitor.prototype.supportsAjaxMonitoring = function () {
            var result = true;
            if (CoreUtils.isNullOrUndefined(XMLHttpRequest) ||
                CoreUtils.isNullOrUndefined(XMLHttpRequest.prototype) ||
                CoreUtils.isNullOrUndefined(XMLHttpRequest.prototype.open) ||
                CoreUtils.isNullOrUndefined(XMLHttpRequest.prototype.send) ||
                CoreUtils.isNullOrUndefined(XMLHttpRequest.prototype.abort)) {
                result = false;
            }
            // disable in IE8 or older (https://www.w3schools.com/jsref/jsref_trim_string.asp)
            try {
            }
            catch (ex) {
                result = false;
            }
            return result;
        };
        AjaxMonitor.prototype.instrumentOpen = function () {
            var originalOpen = XMLHttpRequest.prototype.open;
            var ajaxMonitorInstance = this;
            XMLHttpRequest.prototype.open = function (method, url, async) {
                try {
                    if (ajaxMonitorInstance.isMonitoredInstance(this, true) &&
                        (!this.ajaxData ||
                            !this.ajaxData.xhrMonitoringState.openDone)) {
                        ajaxMonitorInstance.openHandler(this, method, url, async);
                    }
                }
                catch (e) {
                    ajaxMonitorInstance._core.logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.FailedMonitorAjaxOpen, "Failed to monitor XMLHttpRequest.open, monitoring data for this ajax call may be incorrect.", {
                        ajaxDiagnosticsMessage: AjaxMonitor.getFailedAjaxDiagnosticsMessage(this),
                        exception: Util.dump(e)
                    });
                }
                return originalOpen.apply(this, arguments);
            };
        };
        AjaxMonitor.prototype.openHandler = function (xhr, method, url, async) {
            var traceID = (this._context && this._context.telemetryTrace && this._context.telemetryTrace.traceID) || Util.generateW3CId();
            var spanID = Util.generateW3CId().substr(0, 16);
            var ajaxData = new ajaxRecord(traceID, spanID, this._core.logger);
            ajaxData.method = method;
            ajaxData.requestUrl = url;
            ajaxData.xhrMonitoringState.openDone = true;
            ajaxData.requestHeaders = {};
            xhr.ajaxData = ajaxData;
            this.attachToOnReadyStateChange(xhr);
        };
        AjaxMonitor.prototype.instrumentSend = function () {
            var originalSend = XMLHttpRequest.prototype.send;
            var ajaxMonitorInstance = this;
            XMLHttpRequest.prototype.send = function (content) {
                try {
                    if (ajaxMonitorInstance.isMonitoredInstance(this) && !this.ajaxData.xhrMonitoringState.sendDone) {
                        ajaxMonitorInstance.sendHandler(this, content);
                    }
                }
                catch (e) {
                    ajaxMonitorInstance._core.logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.FailedMonitorAjaxSend, "Failed to monitor XMLHttpRequest, monitoring data for this ajax call may be incorrect.", {
                        ajaxDiagnosticsMessage: AjaxMonitor.getFailedAjaxDiagnosticsMessage(this),
                        exception: Util.dump(e)
                    });
                }
                return originalSend.apply(this, arguments);
            };
        };
        AjaxMonitor.prototype.sendHandler = function (xhr, content) {
            xhr.ajaxData.requestSentTime = DateTimeUtils.Now();
            xhr = this.includeCorrelationHeaders(xhr.ajaxData, undefined, undefined, xhr);
            xhr.ajaxData.xhrMonitoringState.sendDone = true;
        };
        AjaxMonitor.prototype.instrumentAbort = function () {
            var originalAbort = XMLHttpRequest.prototype.abort;
            var ajaxMonitorInstance = this;
            XMLHttpRequest.prototype.abort = function () {
                try {
                    if (ajaxMonitorInstance.isMonitoredInstance(this) && !this.ajaxData.xhrMonitoringState.abortDone) {
                        this.ajaxData.aborted = 1;
                        this.ajaxData.xhrMonitoringState.abortDone = true;
                    }
                }
                catch (e) {
                    ajaxMonitorInstance._core.logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.FailedMonitorAjaxAbort, "Failed to monitor XMLHttpRequest.abort, monitoring data for this ajax call may be incorrect.", {
                        ajaxDiagnosticsMessage: AjaxMonitor.getFailedAjaxDiagnosticsMessage(this),
                        exception: Util.dump(e)
                    });
                }
                return originalAbort.apply(this, arguments);
            };
        };
        AjaxMonitor.prototype.instrumentSetRequestHeader = function () {
            if (!this._config.enableRequestHeaderTracking) {
                return;
            }
            var originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
            var ajaxMonitorInstance = this;
            XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
                try {
                    if (ajaxMonitorInstance.isMonitoredInstance(this)) {
                        this.ajaxData.requestHeaders[header] = value;
                    }
                }
                catch (e) {
                    ajaxMonitorInstance._core.logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.FailedMonitorAjaxSetRequestHeader, "Failed to monitor XMLHttpRequest.setRequestHeader, monitoring data for this ajax call may be incorrect.", {
                        ajaxDiagnosticsMessage: AjaxMonitor.getFailedAjaxDiagnosticsMessage(this),
                        exception: Util.dump(e)
                    });
                }
                return originalSetRequestHeader.apply(this, arguments);
            };
        };
        AjaxMonitor.prototype.attachToOnReadyStateChange = function (xhr) {
            var ajaxMonitorInstance = this;
            xhr.ajaxData.xhrMonitoringState.onreadystatechangeCallbackAttached = EventHelper.AttachEvent(xhr, "readystatechange", function () {
                try {
                    if (ajaxMonitorInstance.isMonitoredInstance(xhr)) {
                        if (xhr.readyState === 4) {
                            ajaxMonitorInstance.onAjaxComplete(xhr);
                        }
                    }
                }
                catch (e) {
                    var exceptionText = Util.dump(e);
                    // ignore messages with c00c023f, as this a known IE9 XHR abort issue
                    if (!exceptionText || exceptionText.toLowerCase().indexOf("c00c023f") === -1) {
                        ajaxMonitorInstance._core.logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.FailedMonitorAjaxRSC, "Failed to monitor XMLHttpRequest 'readystatechange' event handler, monitoring data for this ajax call may be incorrect.", {
                            ajaxDiagnosticsMessage: AjaxMonitor.getFailedAjaxDiagnosticsMessage(xhr),
                            exception: Util.dump(e)
                        });
                    }
                }
            });
        };
        AjaxMonitor.prototype.onAjaxComplete = function (xhr) {
            xhr.ajaxData.responseFinishedTime = DateTimeUtils.Now();
            xhr.ajaxData.status = xhr.status;
            xhr.ajaxData.CalculateMetrics();
            if (xhr.ajaxData.ajaxTotalDuration < 0) {
                this._core.logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.FailedMonitorAjaxDur, "Failed to calculate the duration of the ajax call, monitoring data for this ajax call won't be sent.", {
                    ajaxDiagnosticsMessage: AjaxMonitor.getFailedAjaxDiagnosticsMessage(xhr),
                    requestSentTime: xhr.ajaxData.requestSentTime,
                    responseFinishedTime: xhr.ajaxData.responseFinishedTime
                });
            }
            else {
                var dependency = {
                    id: "|" + xhr.ajaxData.traceID + "." + xhr.ajaxData.spanID,
                    target: xhr.ajaxData.getAbsoluteUrl(),
                    name: xhr.ajaxData.getPathName(),
                    type: "Ajax",
                    duration: xhr.ajaxData.ajaxTotalDuration,
                    success: (+(xhr.ajaxData.status)) >= 200 && (+(xhr.ajaxData.status)) < 400,
                    responseCode: +xhr.ajaxData.status,
                    method: xhr.ajaxData.method
                };
                // enrich dependency target with correlation context from the server
                var correlationContext = this.getAjaxCorrelationContext(xhr);
                if (correlationContext) {
                    dependency.correlationContext = /* dependency.target + " | " + */ correlationContext;
                }
                if (this._config.enableRequestHeaderTracking) {
                    if (Object.keys(xhr.ajaxData.requestHeaders).length > 0) {
                        dependency.properties = dependency.properties || {};
                        dependency.properties.requestHeaders = {};
                        dependency.properties.requestHeaders = xhr.ajaxData.requestHeaders;
                    }
                }
                if (this._config.enableResponseHeaderTracking) {
                    var headers = xhr.getAllResponseHeaders();
                    if (headers) {
                        // xhr.getAllResponseHeaders() method returns all the response headers, separated by CRLF, as a string or null
                        // the regex converts the header string into an array of individual headers
                        var arr = headers.trim().split(/[\r\n]+/);
                        var responseHeaderMap_1 = {};
                        arr.forEach(function (line) {
                            var parts = line.split(': ');
                            var header = parts.shift();
                            var value = parts.join(': ');
                            responseHeaderMap_1[header] = value;
                        });
                        if (Object.keys(responseHeaderMap_1).length > 0) {
                            dependency.properties = dependency.properties || {};
                            dependency.properties.responseHeaders = {};
                            dependency.properties.responseHeaders = responseHeaderMap_1;
                        }
                    }
                }
                this.trackDependencyDataInternal(dependency);
                xhr.ajaxData = null;
            }
        };
        AjaxMonitor.prototype.getAjaxCorrelationContext = function (xhr) {
            try {
                var responseHeadersString = xhr.getAllResponseHeaders();
                if (responseHeadersString !== null) {
                    var index = responseHeadersString.toLowerCase().indexOf(RequestHeaders.requestContextHeaderLowerCase);
                    if (index !== -1) {
                        var responseHeader = xhr.getResponseHeader(RequestHeaders.requestContextHeader);
                        return CorrelationIdHelper.getCorrelationContext(responseHeader);
                    }
                }
            }
            catch (e) {
                this._core.logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.FailedMonitorAjaxGetCorrelationHeader, "Failed to get Request-Context correlation header as it may be not included in the response or not accessible.", {
                    ajaxDiagnosticsMessage: AjaxMonitor.getFailedAjaxDiagnosticsMessage(xhr),
                    exception: Util.dump(e)
                });
            }
        };
        AjaxMonitor.prototype.isFetchInstrumented = function (input) {
            return this._fetchInitialized && input[DisabledPropertyName] !== true;
        };
        AjaxMonitor.prototype.supportsFetch = function () {
            var result = true;
            if (!window || CoreUtils.isNullOrUndefined(window.Request) ||
                CoreUtils.isNullOrUndefined(window.Request.prototype) ||
                CoreUtils.isNullOrUndefined(window.fetch)) {
                result = false;
            }
            return result;
        };
        AjaxMonitor.prototype.createFetchRecord = function (input, init) {
            var traceID = (this._context && this._context.telemetryTrace && this._context.telemetryTrace.traceID) || Util.generateW3CId();
            var spanID = Util.generateW3CId().substr(0, 16);
            var ajaxData = new ajaxRecord(traceID, spanID, this._core.logger);
            ajaxData.requestSentTime = DateTimeUtils.Now();
            if (input instanceof Request) {
                ajaxData.requestUrl = input ? input.url : "";
            }
            else {
                ajaxData.requestUrl = input;
            }
            if (init && init.method) {
                ajaxData.method = init.method;
            }
            else if (input && input instanceof Request) {
                ajaxData.method = input.method;
            }
            else {
                ajaxData.method = "GET";
            }
            if (init && init.headers && this._config.enableRequestHeaderTracking) {
                ajaxData.requestHeaders = init.headers;
            }
            else {
                ajaxData.requestHeaders = {};
            }
            return ajaxData;
        };
        AjaxMonitor.prototype.getFailedFetchDiagnosticsMessage = function (input) {
            var result = "";
            try {
                if (!CoreUtils.isNullOrUndefined(input)) {
                    if (typeof (input) === "string") {
                        result += "(url: '" + input + "')";
                    }
                    else {
                        result += "(url: '" + input.url + "')";
                    }
                }
            }
            catch (e) {
                this._core.logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.FailedMonitorAjaxOpen, "Failed to grab failed fetch diagnostics message", { exception: Util.dump(e) });
            }
            return result;
        };
        AjaxMonitor.prototype.onFetchComplete = function (response, ajaxData) {
            if (!ajaxData) {
                return;
            }
            try {
                ajaxData.responseFinishedTime = DateTimeUtils.Now();
                ajaxData.CalculateMetrics();
                if (ajaxData.ajaxTotalDuration < 0) {
                    this._core.logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.FailedMonitorAjaxDur, "Failed to calculate the duration of the fetch call, monitoring data for this fetch call won't be sent.", {
                        fetchDiagnosticsMessage: this.getFailedFetchDiagnosticsMessage(response),
                        requestSentTime: ajaxData.requestSentTime,
                        responseFinishedTime: ajaxData.responseFinishedTime
                    });
                }
                else {
                    var dependency = {
                        id: "|" + ajaxData.traceID + "." + ajaxData.spanID,
                        target: ajaxData.getAbsoluteUrl(),
                        name: ajaxData.getPathName(),
                        type: "Fetch",
                        duration: ajaxData.ajaxTotalDuration,
                        success: response.status >= 200 && response.status < 400,
                        responseCode: response.status,
                        properties: { HttpMethod: ajaxData.method }
                    };
                    // enrich dependency target with correlation context from the server
                    var correlationContext = this.getFetchCorrelationContext(response);
                    if (correlationContext) {
                        dependency.correlationContext = correlationContext;
                    }
                    if (this._config.enableRequestHeaderTracking) {
                        if (Object.keys(ajaxData.requestHeaders).length > 0) {
                            dependency.properties = dependency.properties || {};
                            dependency.properties.requestHeaders = ajaxData.requestHeaders;
                        }
                    }
                    if (this._config.enableResponseHeaderTracking) {
                        var responseHeaderMap_2 = {};
                        response.headers.forEach(function (value, name) {
                            responseHeaderMap_2[name] = value;
                        });
                        if (Object.keys(responseHeaderMap_2).length > 0) {
                            dependency.properties = dependency.properties || {};
                            dependency.properties.responseHeaders = responseHeaderMap_2;
                        }
                    }
                    this.trackDependencyDataInternal(dependency);
                }
            }
            catch (e) {
                this._core.logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.FailedMonitorAjaxGetCorrelationHeader, "Failed to calculate the duration of the fetch call, monitoring data for this fetch call won't be sent.", {
                    fetchDiagnosticsMessage: this.getFailedFetchDiagnosticsMessage(response),
                    exception: Util.dump(e)
                });
            }
        };
        AjaxMonitor.prototype.onFetchFailed = function (input, ajaxData, reason) {
            if (!ajaxData) {
                return;
            }
            try {
                ajaxData.responseFinishedTime = DateTimeUtils.Now();
                ajaxData.CalculateMetrics();
                if (ajaxData.ajaxTotalDuration < 0) {
                    this._core.logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.FailedMonitorAjaxDur, "Failed to calculate the duration of the failed fetch call, monitoring data for this fetch call won't be sent.", {
                        fetchDiagnosticsMessage: this.getFailedFetchDiagnosticsMessage(input),
                        requestSentTime: ajaxData.requestSentTime,
                        responseFinishedTime: ajaxData.responseFinishedTime
                    });
                }
                else {
                    var dependency = {
                        id: "|" + ajaxData.traceID + "." + ajaxData.spanID,
                        target: ajaxData.getAbsoluteUrl(),
                        name: ajaxData.getPathName(),
                        type: "Fetch",
                        duration: ajaxData.ajaxTotalDuration,
                        success: false,
                        responseCode: 0,
                        properties: { HttpMethod: ajaxData.method }
                    };
                    this.trackDependencyDataInternal(dependency, { error: reason.message });
                }
            }
            catch (e) {
                this._core.logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.FailedMonitorAjaxGetCorrelationHeader, "Failed to calculate the duration of the failed fetch call, monitoring data for this fetch call won't be sent.", {
                    fetchDiagnosticsMessage: this.getFailedFetchDiagnosticsMessage(input),
                    exception: Util.dump(e)
                });
            }
        };
        AjaxMonitor.prototype.getFetchCorrelationContext = function (response) {
            try {
                var responseHeader = response.headers.get(RequestHeaders.requestContextHeader);
                return CorrelationIdHelper.getCorrelationContext(responseHeader);
            }
            catch (e) {
                this._core.logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.FailedMonitorAjaxGetCorrelationHeader, "Failed to get Request-Context correlation header as it may be not included in the response or not accessible.", {
                    fetchDiagnosticsMessage: this.getFailedFetchDiagnosticsMessage(response),
                    exception: Util.dump(e)
                });
            }
        };
        AjaxMonitor.identifier = "AjaxDependencyPlugin";
        return AjaxMonitor;
    }());

    exports.AjaxPlugin = AjaxMonitor;
    exports.ajaxRecord = ajaxRecord;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=applicationinsights-dependencies-js.js.map
