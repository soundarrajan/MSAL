/*!
 * Application Insights JavaScript SDK - Channel, 2.2.4
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.Microsoft = global.Microsoft || {}, global.Microsoft.ApplicationInsights = {})));
}(this, (function (exports) { 'use strict';

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
    var SampleRate = "sampleRate";
    var ProcessLegacy = "ProcessLegacy";
    var HttpMethod = "http.method";

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

    // THIS FILE WAS AUTOGENERATED
    var ContextTagKeys = /** @class */ (function () {
        function ContextTagKeys() {
            this.applicationVersion = "ai.application.ver";
            this.applicationBuild = "ai.application.build";
            this.applicationTypeId = "ai.application.typeId";
            this.applicationId = "ai.application.applicationId";
            this.applicationLayer = "ai.application.layer";
            this.deviceId = "ai.device.id";
            this.deviceIp = "ai.device.ip";
            this.deviceLanguage = "ai.device.language";
            this.deviceLocale = "ai.device.locale";
            this.deviceModel = "ai.device.model";
            this.deviceFriendlyName = "ai.device.friendlyName";
            this.deviceNetwork = "ai.device.network";
            this.deviceNetworkName = "ai.device.networkName";
            this.deviceOEMName = "ai.device.oemName";
            this.deviceOS = "ai.device.os";
            this.deviceOSVersion = "ai.device.osVersion";
            this.deviceRoleInstance = "ai.device.roleInstance";
            this.deviceRoleName = "ai.device.roleName";
            this.deviceScreenResolution = "ai.device.screenResolution";
            this.deviceType = "ai.device.type";
            this.deviceMachineName = "ai.device.machineName";
            this.deviceVMName = "ai.device.vmName";
            this.deviceBrowser = "ai.device.browser";
            this.deviceBrowserVersion = "ai.device.browserVersion";
            this.locationIp = "ai.location.ip";
            this.locationCountry = "ai.location.country";
            this.locationProvince = "ai.location.province";
            this.locationCity = "ai.location.city";
            this.operationId = "ai.operation.id";
            this.operationName = "ai.operation.name";
            this.operationParentId = "ai.operation.parentId";
            this.operationRootId = "ai.operation.rootId";
            this.operationSyntheticSource = "ai.operation.syntheticSource";
            this.operationCorrelationVector = "ai.operation.correlationVector";
            this.sessionId = "ai.session.id";
            this.sessionIsFirst = "ai.session.isFirst";
            this.sessionIsNew = "ai.session.isNew";
            this.userAccountAcquisitionDate = "ai.user.accountAcquisitionDate";
            this.userAccountId = "ai.user.accountId";
            this.userAgent = "ai.user.userAgent";
            this.userId = "ai.user.id";
            this.userStoreRegion = "ai.user.storeRegion";
            this.userAuthUserId = "ai.user.authUserId";
            this.userAnonymousUserAcquisitionDate = "ai.user.anonUserAcquisitionDate";
            this.userAuthenticatedUserAcquisitionDate = "ai.user.authUserAcquisitionDate";
            this.cloudName = "ai.cloud.name";
            this.cloudRole = "ai.cloud.role";
            this.cloudRoleVer = "ai.cloud.roleVer";
            this.cloudRoleInstance = "ai.cloud.roleInstance";
            this.cloudEnvironment = "ai.cloud.environment";
            this.cloudLocation = "ai.cloud.location";
            this.cloudDeploymentUnit = "ai.cloud.deploymentUnit";
            this.internalNodeName = "ai.internal.nodeName";
            this.internalSdkVersion = "ai.internal.sdkVersion";
            this.internalAgentVersion = "ai.internal.agentVersion";
        }
        return ContextTagKeys;
    }());

    var CtxTagKeys = new ContextTagKeys();

    var BreezeChannelIdentifier = "AppInsightsChannelPlugin";

    /*
     * An array based send buffer.
     */
    var ArraySendBuffer = /** @class */ (function () {
        function ArraySendBuffer(config) {
            this._config = config;
            this._buffer = [];
        }
        ArraySendBuffer.prototype.enqueue = function (payload) {
            this._buffer.push(payload);
        };
        ArraySendBuffer.prototype.count = function () {
            return this._buffer.length;
        };
        ArraySendBuffer.prototype.clear = function () {
            this._buffer.length = 0;
        };
        ArraySendBuffer.prototype.getItems = function () {
            return this._buffer.slice(0);
        };
        ArraySendBuffer.prototype.batchPayloads = function (payload) {
            if (payload && payload.length > 0) {
                var batch = this._config.emitLineDelimitedJson() ?
                    payload.join("\n") :
                    "[" + payload.join(",") + "]";
                return batch;
            }
            return null;
        };
        ArraySendBuffer.prototype.markAsSent = function (payload) {
            this.clear();
        };
        ArraySendBuffer.prototype.clearSent = function (payload) {
            // not supported
        };
        return ArraySendBuffer;
    }());
    /*
     * Session storege buffer holds a copy of all unsent items in the browser session storage.
     */
    var SessionStorageSendBuffer = /** @class */ (function () {
        function SessionStorageSendBuffer(logger, config) {
            this._bufferFullMessageSent = false;
            this._logger = logger;
            this._config = config;
            var bufferItems = this.getBuffer(SessionStorageSendBuffer.BUFFER_KEY);
            var notDeliveredItems = this.getBuffer(SessionStorageSendBuffer.SENT_BUFFER_KEY);
            this._buffer = bufferItems.concat(notDeliveredItems);
            // If the buffer has too many items, drop items from the end.
            if (this._buffer.length > SessionStorageSendBuffer.MAX_BUFFER_SIZE) {
                this._buffer.length = SessionStorageSendBuffer.MAX_BUFFER_SIZE;
            }
            // update DataLossAnalyzer with the number of recovered items
            // Uncomment if you want to use DataLossanalyzer
            // DataLossAnalyzer.itemsRestoredFromSessionBuffer = this._buffer.length;
            this.setBuffer(SessionStorageSendBuffer.SENT_BUFFER_KEY, []);
            this.setBuffer(SessionStorageSendBuffer.BUFFER_KEY, this._buffer);
        }
        SessionStorageSendBuffer.prototype.enqueue = function (payload) {
            if (this._buffer.length >= SessionStorageSendBuffer.MAX_BUFFER_SIZE) {
                // sent internal log only once per page view
                if (!this._bufferFullMessageSent) {
                    this._logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.SessionStorageBufferFull, "Maximum buffer size reached: " + this._buffer.length, true);
                    this._bufferFullMessageSent = true;
                }
                return;
            }
            this._buffer.push(payload);
            this.setBuffer(SessionStorageSendBuffer.BUFFER_KEY, this._buffer);
        };
        SessionStorageSendBuffer.prototype.count = function () {
            return this._buffer.length;
        };
        SessionStorageSendBuffer.prototype.clear = function () {
            this._buffer.length = 0;
            this.setBuffer(SessionStorageSendBuffer.BUFFER_KEY, []);
            this.setBuffer(SessionStorageSendBuffer.SENT_BUFFER_KEY, []);
            this._bufferFullMessageSent = false;
        };
        SessionStorageSendBuffer.prototype.getItems = function () {
            return this._buffer.slice(0);
        };
        SessionStorageSendBuffer.prototype.batchPayloads = function (payload) {
            if (payload && payload.length > 0) {
                var batch = this._config.emitLineDelimitedJson() ?
                    payload.join("\n") :
                    "[" + payload.join(",") + "]";
                return batch;
            }
            return null;
        };
        SessionStorageSendBuffer.prototype.markAsSent = function (payload) {
            this._buffer = this.removePayloadsFromBuffer(payload, this._buffer);
            this.setBuffer(SessionStorageSendBuffer.BUFFER_KEY, this._buffer);
            var sentElements = this.getBuffer(SessionStorageSendBuffer.SENT_BUFFER_KEY);
            if (sentElements instanceof Array && payload instanceof Array) {
                sentElements = sentElements.concat(payload);
                if (sentElements.length > SessionStorageSendBuffer.MAX_BUFFER_SIZE) {
                    // We send telemetry normally. If the SENT_BUFFER is too big we don't add new elements
                    // until we receive a response from the backend and the buffer has free space again (see clearSent method)
                    this._logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.SessionStorageBufferFull, "Sent buffer reached its maximum size: " + sentElements.length, true);
                    sentElements.length = SessionStorageSendBuffer.MAX_BUFFER_SIZE;
                }
                this.setBuffer(SessionStorageSendBuffer.SENT_BUFFER_KEY, sentElements);
            }
        };
        SessionStorageSendBuffer.prototype.clearSent = function (payload) {
            var sentElements = this.getBuffer(SessionStorageSendBuffer.SENT_BUFFER_KEY);
            sentElements = this.removePayloadsFromBuffer(payload, sentElements);
            this.setBuffer(SessionStorageSendBuffer.SENT_BUFFER_KEY, sentElements);
        };
        SessionStorageSendBuffer.prototype.removePayloadsFromBuffer = function (payloads, buffer) {
            var remaining = [];
            for (var i in buffer) {
                var contains = false;
                for (var j in payloads) {
                    if (payloads[j] === buffer[i]) {
                        contains = true;
                        break;
                    }
                }
                if (!contains) {
                    remaining.push(buffer[i]);
                }
            }
            return remaining;
        };
        SessionStorageSendBuffer.prototype.getBuffer = function (key) {
            var prefixedKey = key;
            try {
                prefixedKey = this._config.namePrefix && this._config.namePrefix() ? this._config.namePrefix() + "_" + prefixedKey : prefixedKey;
                var bufferJson = Util.getSessionStorage(this._logger, prefixedKey);
                if (bufferJson) {
                    var buffer = JSON.parse(bufferJson);
                    if (buffer) {
                        return buffer;
                    }
                }
            }
            catch (e) {
                this._logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.FailedToRestoreStorageBuffer, " storage key: " + prefixedKey + ", " + Util.getExceptionName(e), { exception: Util.dump(e) });
            }
            return [];
        };
        SessionStorageSendBuffer.prototype.setBuffer = function (key, buffer) {
            var prefixedKey = key;
            try {
                prefixedKey = this._config.namePrefix && this._config.namePrefix() ? this._config.namePrefix() + "_" + prefixedKey : prefixedKey;
                var bufferJson = JSON.stringify(buffer);
                Util.setSessionStorage(this._logger, prefixedKey, bufferJson);
            }
            catch (e) {
                // if there was an error, clear the buffer
                // telemetry is stored in the _buffer array so we won't loose any items
                Util.setSessionStorage(this._logger, prefixedKey, JSON.stringify([]));
                this._logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.FailedToSetStorageBuffer, " storage key: " + prefixedKey + ", " + Util.getExceptionName(e) + ". Buffer cleared", { exception: Util.dump(e) });
            }
        };
        SessionStorageSendBuffer.BUFFER_KEY = "AI_buffer";
        SessionStorageSendBuffer.SENT_BUFFER_KEY = "AI_sentBuffer";
        // Maximum number of payloads stored in the buffer. If the buffer is full, new elements will be dropped.
        SessionStorageSendBuffer.MAX_BUFFER_SIZE = 2000;
        return SessionStorageSendBuffer;
    }());

    var EnvelopeCreator = /** @class */ (function () {
        function EnvelopeCreator() {
        }
        EnvelopeCreator.extractProperties = function (data) {
            var customProperties = null;
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    var value = data[key];
                    if (typeof value !== "number") {
                        if (!customProperties) {
                            customProperties = {};
                        }
                        customProperties[key] = value;
                    }
                }
            }
            return customProperties;
        };
        EnvelopeCreator.extractPropsAndMeasurements = function (data, properties, measurements) {
            if (!CoreUtils.isNullOrUndefined(data)) {
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        var value = data[key];
                        if (typeof value === "number") {
                            measurements[key] = value;
                        }
                        else if (typeof value === "string") {
                            properties[key] = value;
                        }
                        else {
                            properties[key] = JSON.stringify(value);
                        }
                    }
                }
            }
        };
        // TODO: Do we want this to take logger as arg or use this._logger as nonstatic?
        EnvelopeCreator.createEnvelope = function (logger, envelopeType, telemetryItem, data) {
            var envelope = new Envelope$1(logger, data, envelopeType);
            envelope.iKey = telemetryItem.iKey;
            var iKeyNoDashes = telemetryItem.iKey.replace(/-/g, "");
            envelope.name = envelope.name.replace("{0}", iKeyNoDashes);
            // extract all extensions from ctx
            EnvelopeCreator.extractPartAExtensions(telemetryItem, envelope);
            // loop through the envelope tags (extension of Part A) and pick out the ones that should go in outgoing envelope tags
            if (!telemetryItem.tags) {
                telemetryItem.tags = [];
            }
            return envelope;
        };
        /*
         * Maps Part A data from CS 4.0
         */
        EnvelopeCreator.extractPartAExtensions = function (item, env) {
            // todo: switch to keys from common in this method
            if (!env.tags) {
                env.tags = {};
            }
            if (!item.ext) {
                item.ext = {};
            }
            if (!item.tags) {
                item.tags = [];
            }
            if (item.ext.user) {
                if (item.ext.user.authId) {
                    env.tags[CtxTagKeys.userAuthUserId] = item.ext.user.authId;
                }
                var userId = item.ext.user.id || item.ext.user.localId;
                if (userId) {
                    env.tags[CtxTagKeys.userId] = userId;
                }
            }
            if (item.ext.app) {
                if (item.ext.app.sesId) {
                    env.tags[CtxTagKeys.sessionId] = item.ext.app.sesId;
                }
            }
            if (item.ext.device) {
                if (item.ext.device.id || item.ext.device.localId) {
                    env.tags[CtxTagKeys.deviceId] = item.ext.device.id || item.ext.device.localId;
                }
                if (item.ext.device.deviceClass) {
                    env.tags[CtxTagKeys.deviceType] = item.ext.device.deviceClass;
                }
                if (item.ext.device.ip) {
                    env.tags[CtxTagKeys.deviceIp] = item.ext.device.ip;
                }
            }
            if (item.ext.web) {
                var web = item.ext.web;
                if (web.browserLang) {
                    env.tags[CtxTagKeys.deviceLanguage] = web.browserLang;
                }
                if (web.browserVer) {
                    env.tags[CtxTagKeys.deviceBrowserVersion] = web.browserVer;
                }
                if (web.browser) {
                    env.tags[CtxTagKeys.deviceBrowser] = web.browser;
                }
                env.data = env.data || {};
                env.data.baseData = env.data.baseData || {};
                env.data.baseData.properties = env.data.baseData.properties || {};
                if (web.domain) {
                    env.data.baseData.properties['domain'] = web.domain;
                }
                if (web.isManual) {
                    env.data.baseData.properties['isManual'] = web.isManual.toString();
                }
                if (web.screenRes) {
                    env.data.baseData.properties['screenRes'] = web.screenRes;
                }
                if (web.userConsent) {
                    env.data.baseData.properties['userConsent'] = web.userConsent.toString();
                }
            }
            if (item.ext.device) {
                if (item.ext.device.model) {
                    env.tags[CtxTagKeys.deviceModel] = item.ext.device.model;
                }
            }
            if (item.ext.os && item.ext.os.name) {
                env.tags[CtxTagKeys.deviceOS] = item.ext.os.name;
            }
            if (item.ext.device) {
                if (item.ext.device.deviceType) {
                    env.tags[CtxTagKeys.deviceType] = item.ext.device.deviceType;
                }
            }
            // No support for mapping Trace.traceState to 2.0 as it is currently empty
            if (item.ext.trace) {
                if (item.ext.trace.parentID) {
                    env.tags[CtxTagKeys.operationParentId] = item.ext.trace.parentID;
                }
                if (item.ext.trace.name) {
                    env.tags[CtxTagKeys.operationName] = item.ext.trace.name;
                }
                if (item.ext.trace.traceID) {
                    env.tags[CtxTagKeys.operationId] = item.ext.trace.traceID;
                }
            }
            // Sample 4.0 schema
            //  {
            //     "time" : "2018-09-05T22:51:22.4936Z",
            //     "name" : "MetricWithNamespace",
            //     "iKey" : "ABC-5a4cbd20-e601-4ef5-a3c6-5d6577e4398e",
            //     "ext": {  "cloud": {
            //          "role": "WATSON3",
            //          "roleInstance": "CO4AEAP00000260"
            //      },
            //      "device": {}, "correlation": {} },
            //      "tags": [
            //        { "amazon.region" : "east2" },
            //        { "os.expid" : "wp:02df239" }
            //     ]
            //   }
            var tgs = {};
            var _loop_1 = function (i) {
                var tg = item.tags[i];
                // Object.keys returns an array of keys
                Object.keys(tg).forEach(function (key) {
                    tgs[key] = tg[key];
                });
                item.tags.splice(i, 1);
            };
            // deals with tags.push({object})
            for (var i = item.tags.length - 1; i >= 0; i--) {
                _loop_1(i);
            }
            // deals with tags[key]=value
            for (var tg in item.tags) {
                tgs[tg] = item.tags[tg];
            }
            env.tags = __assign({}, env.tags, tgs);
            if (!env.tags[CtxTagKeys.internalSdkVersion]) {
                // Append a version in case it is not already set
                env.tags[CtxTagKeys.internalSdkVersion] = "javascript:" + EnvelopeCreator.Version;
            }
        };
        EnvelopeCreator.Version = "2.2.4";
        return EnvelopeCreator;
    }());
    var DependencyEnvelopeCreator = /** @class */ (function (_super) {
        __extends(DependencyEnvelopeCreator, _super);
        function DependencyEnvelopeCreator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DependencyEnvelopeCreator.prototype.Create = function (logger, telemetryItem) {
            this._logger = logger;
            if (CoreUtils.isNullOrUndefined(telemetryItem.baseData)) {
                this._logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.TelemetryEnvelopeInvalid, "telemetryItem.baseData cannot be null.");
            }
            var customMeasurements = telemetryItem.baseData.measurements || {};
            var customProperties = telemetryItem.baseData.properties || {};
            EnvelopeCreator.extractPropsAndMeasurements(telemetryItem.data, customProperties, customMeasurements);
            var bd = telemetryItem.baseData;
            if (CoreUtils.isNullOrUndefined(bd)) {
                logger.warnToConsole("Invalid input for dependency data");
                return null;
            }
            var id = bd.id;
            var absoluteUrl = bd.target;
            var command = bd.name;
            var duration = bd.duration;
            var success = bd.success;
            var resultCode = bd.responseCode;
            var requestAPI = bd.type;
            var correlationContext = bd.correlationContext;
            var method = bd.properties && bd.properties[HttpMethod] ? bd.properties[HttpMethod] : "GET";
            var baseData = new RemoteDependencyData$1(logger, id, absoluteUrl, command, duration, success, resultCode, method, requestAPI, correlationContext, customProperties, customMeasurements);
            var data = new Data$1(RemoteDependencyData$1.dataType, baseData);
            return EnvelopeCreator.createEnvelope(logger, RemoteDependencyData$1.envelopeType, telemetryItem, data);
        };
        DependencyEnvelopeCreator.DependencyEnvelopeCreator = new DependencyEnvelopeCreator();
        return DependencyEnvelopeCreator;
    }(EnvelopeCreator));
    var EventEnvelopeCreator = /** @class */ (function (_super) {
        __extends(EventEnvelopeCreator, _super);
        function EventEnvelopeCreator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        EventEnvelopeCreator.prototype.Create = function (logger, telemetryItem) {
            this._logger = logger;
            if (CoreUtils.isNullOrUndefined(telemetryItem.baseData)) {
                this._logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.TelemetryEnvelopeInvalid, "telemetryItem.baseData cannot be null.");
            }
            var customProperties = {};
            var customMeasurements = {};
            if (telemetryItem.baseType !== Event$1.dataType) {
                customProperties['baseTypeSource'] = telemetryItem.baseType; // save the passed in base type as a property
            }
            if (telemetryItem.baseType === Event$1.dataType) {
                customProperties = telemetryItem.baseData.properties || {};
                customMeasurements = telemetryItem.baseData.measurements || {};
            }
            else {
                if (telemetryItem.baseData) {
                    EnvelopeCreator.extractPropsAndMeasurements(telemetryItem.baseData, customProperties, customMeasurements);
                }
            }
            // Exract root level properties from part C telemetryItem.data
            EnvelopeCreator.extractPropsAndMeasurements(telemetryItem.data, customProperties, customMeasurements);
            var eventName = telemetryItem.baseData.name;
            var baseData = new Event$1(logger, eventName, customProperties, customMeasurements);
            var data = new Data$1(Event$1.dataType, baseData);
            return EnvelopeCreator.createEnvelope(logger, Event$1.envelopeType, telemetryItem, data);
        };
        EventEnvelopeCreator.EventEnvelopeCreator = new EventEnvelopeCreator();
        return EventEnvelopeCreator;
    }(EnvelopeCreator));
    var ExceptionEnvelopeCreator = /** @class */ (function (_super) {
        __extends(ExceptionEnvelopeCreator, _super);
        function ExceptionEnvelopeCreator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ExceptionEnvelopeCreator.prototype.Create = function (logger, telemetryItem) {
            this._logger = logger;
            if (CoreUtils.isNullOrUndefined(telemetryItem.baseData)) {
                this._logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.TelemetryEnvelopeInvalid, "telemetryItem.baseData cannot be null.");
            }
            var bd = telemetryItem.baseData;
            var baseData = Exception.CreateFromInterface(logger, bd);
            var data = new Data$1(Exception.dataType, baseData);
            return EnvelopeCreator.createEnvelope(logger, Exception.envelopeType, telemetryItem, data);
        };
        ExceptionEnvelopeCreator.ExceptionEnvelopeCreator = new ExceptionEnvelopeCreator();
        return ExceptionEnvelopeCreator;
    }(EnvelopeCreator));
    var MetricEnvelopeCreator = /** @class */ (function (_super) {
        __extends(MetricEnvelopeCreator, _super);
        function MetricEnvelopeCreator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MetricEnvelopeCreator.prototype.Create = function (logger, telemetryItem) {
            this._logger = logger;
            if (CoreUtils.isNullOrUndefined(telemetryItem.baseData)) {
                this._logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.TelemetryEnvelopeInvalid, "telemetryItem.baseData cannot be null.");
            }
            var props = telemetryItem.baseData.properties || {};
            var customProperties = EnvelopeCreator.extractProperties(telemetryItem.data);
            customProperties = __assign({}, props, customProperties);
            var name = telemetryItem.baseData.name;
            var average = telemetryItem.baseData.average;
            var sampleCount = telemetryItem.baseData.sampleCount;
            var min = telemetryItem.baseData.min;
            var max = telemetryItem.baseData.max;
            var baseData = new Metric(logger, name, average, sampleCount, min, max, customProperties);
            var data = new Data$1(Metric.dataType, baseData);
            return EnvelopeCreator.createEnvelope(logger, Metric.envelopeType, telemetryItem, data);
        };
        MetricEnvelopeCreator.MetricEnvelopeCreator = new MetricEnvelopeCreator();
        return MetricEnvelopeCreator;
    }(EnvelopeCreator));
    var PageViewEnvelopeCreator = /** @class */ (function (_super) {
        __extends(PageViewEnvelopeCreator, _super);
        function PageViewEnvelopeCreator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PageViewEnvelopeCreator.prototype.Create = function (logger, telemetryItem) {
            this._logger = logger;
            if (CoreUtils.isNullOrUndefined(telemetryItem.baseData)) {
                this._logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.TelemetryEnvelopeInvalid, "telemetryItem.baseData cannot be null.");
            }
            // Since duration is not part of the domain properties in Common Schema, extract it from part C
            var duration;
            if (!CoreUtils.isNullOrUndefined(telemetryItem.baseData) &&
                !CoreUtils.isNullOrUndefined(telemetryItem.baseData.properties) &&
                !CoreUtils.isNullOrUndefined(telemetryItem.baseData.properties.duration)) {
                duration = telemetryItem.baseData.properties.duration;
                delete telemetryItem.baseData.properties.duration;
            }
            else if (!CoreUtils.isNullOrUndefined(telemetryItem.data) &&
                !CoreUtils.isNullOrUndefined(telemetryItem.data["duration"])) {
                duration = telemetryItem.data["duration"];
                delete telemetryItem.data["duration"];
            }
            var bd = telemetryItem.baseData;
            // special case: pageview.id is grabbed from current operation id. Analytics plugin is decoupled from properties plugin, so this is done here instead. This can be made a default telemetry intializer instead if needed to be decoupled from channel
            var currentContextId;
            if (telemetryItem.ext && telemetryItem.ext.trace && telemetryItem.ext.trace.traceID) {
                currentContextId = telemetryItem.ext.trace.traceID;
            }
            var id = bd.id || currentContextId;
            var name = bd.name;
            var url = bd.uri;
            var properties = bd.properties || {};
            var measurements = bd.measurements || {};
            // refUri is a field that Breeze still does not recognize as part of Part B. For now, put it in Part C until it supports it as a domain property
            if (!CoreUtils.isNullOrUndefined(bd.refUri)) {
                properties["refUri"] = bd.refUri;
            }
            // pageType is a field that Breeze still does not recognize as part of Part B. For now, put it in Part C until it supports it as a domain property
            if (!CoreUtils.isNullOrUndefined(bd.pageType)) {
                properties["pageType"] = bd.pageType;
            }
            // isLoggedIn is a field that Breeze still does not recognize as part of Part B. For now, put it in Part C until it supports it as a domain property
            if (!CoreUtils.isNullOrUndefined(bd.isLoggedIn)) {
                properties["isLoggedIn"] = bd.isLoggedIn.toString();
            }
            // pageTags is a field that Breeze still does not recognize as part of Part B. For now, put it in Part C until it supports it as a domain property
            if (!CoreUtils.isNullOrUndefined(bd.properties)) {
                var pageTags = bd.properties;
                for (var key in pageTags) {
                    if (pageTags.hasOwnProperty(key)) {
                        properties[key] = pageTags[key];
                    }
                }
            }
            EnvelopeCreator.extractPropsAndMeasurements(telemetryItem.data, properties, measurements);
            var baseData = new PageView(logger, name, url, duration, properties, measurements, id);
            var data = new Data$1(PageView.dataType, baseData);
            return EnvelopeCreator.createEnvelope(logger, PageView.envelopeType, telemetryItem, data);
        };
        PageViewEnvelopeCreator.PageViewEnvelopeCreator = new PageViewEnvelopeCreator();
        return PageViewEnvelopeCreator;
    }(EnvelopeCreator));
    var PageViewPerformanceEnvelopeCreator = /** @class */ (function (_super) {
        __extends(PageViewPerformanceEnvelopeCreator, _super);
        function PageViewPerformanceEnvelopeCreator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PageViewPerformanceEnvelopeCreator.prototype.Create = function (logger, telemetryItem) {
            this._logger = logger;
            if (CoreUtils.isNullOrUndefined(telemetryItem.baseData)) {
                this._logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.TelemetryEnvelopeInvalid, "telemetryItem.baseData cannot be null.");
            }
            var bd = telemetryItem.baseData;
            var name = bd.name;
            var url = bd.uri || bd.url;
            var properties = bd.properties || {};
            var measurements = bd.measurements || {};
            EnvelopeCreator.extractPropsAndMeasurements(telemetryItem.data, properties, measurements);
            var baseData = new PageViewPerformance(logger, name, url, undefined, properties, measurements, bd);
            var data = new Data$1(PageViewPerformance.dataType, baseData);
            return EnvelopeCreator.createEnvelope(logger, PageViewPerformance.envelopeType, telemetryItem, data);
        };
        PageViewPerformanceEnvelopeCreator.PageViewPerformanceEnvelopeCreator = new PageViewPerformanceEnvelopeCreator();
        return PageViewPerformanceEnvelopeCreator;
    }(EnvelopeCreator));
    var TraceEnvelopeCreator = /** @class */ (function (_super) {
        __extends(TraceEnvelopeCreator, _super);
        function TraceEnvelopeCreator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TraceEnvelopeCreator.prototype.Create = function (logger, telemetryItem) {
            this._logger = logger;
            if (CoreUtils.isNullOrUndefined(telemetryItem.baseData)) {
                this._logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.TelemetryEnvelopeInvalid, "telemetryItem.baseData cannot be null.");
            }
            var message = telemetryItem.baseData.message;
            var severityLevel = telemetryItem.baseData.severityLevel;
            var customProperties = EnvelopeCreator.extractProperties(telemetryItem.data);
            var props = __assign({}, customProperties, telemetryItem.baseData.properties);
            var baseData = new Trace(logger, message, severityLevel, props);
            var data = new Data$1(Trace.dataType, baseData);
            return EnvelopeCreator.createEnvelope(logger, Trace.envelopeType, telemetryItem, data);
        };
        TraceEnvelopeCreator.TraceEnvelopeCreator = new TraceEnvelopeCreator();
        return TraceEnvelopeCreator;
    }(EnvelopeCreator));

    var Serializer = /** @class */ (function () {
        function Serializer(logger) {
            this._logger = logger;
        }
        /**
         * Serializes the current object to a JSON string.
         */
        Serializer.prototype.serialize = function (input) {
            var output = this._serializeObject(input, "root");
            return JSON.stringify(output);
        };
        Serializer.prototype._serializeObject = function (source, name) {
            var circularReferenceCheck = "__aiCircularRefCheck";
            var output = {};
            if (!source) {
                this._logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.CannotSerializeObject, "cannot serialize object because it is null or undefined", { name: name }, true);
                return output;
            }
            if (source[circularReferenceCheck]) {
                this._logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.CircularReferenceDetected, "Circular reference detected while serializing object", { name: name }, true);
                return output;
            }
            if (!source.aiDataContract) {
                // special case for measurements/properties/tags
                if (name === "measurements") {
                    output = this._serializeStringMap(source, "number", name);
                }
                else if (name === "properties") {
                    output = this._serializeStringMap(source, "string", name);
                }
                else if (name === "tags") {
                    output = this._serializeStringMap(source, "string", name);
                }
                else if (Util.isArray(source)) {
                    output = this._serializeArray(source, name);
                }
                else {
                    this._logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.CannotSerializeObjectNonSerializable, "Attempting to serialize an object which does not implement ISerializable", { name: name }, true);
                    try {
                        // verify that the object can be stringified
                        JSON.stringify(source);
                        output = source;
                    }
                    catch (e) {
                        // if serialization fails return an empty string
                        this._logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.CannotSerializeObject, (e && typeof e.toString === 'function') ? e.toString() : "Error serializing object", null, true);
                    }
                }
                return output;
            }
            source[circularReferenceCheck] = true;
            for (var field in source.aiDataContract) {
                var contract = source.aiDataContract[field];
                var isRequired = (typeof contract === "function") ? (contract() & FieldType.Required) : (contract & FieldType.Required);
                var isHidden = (typeof contract === "function") ? (contract() & FieldType.Hidden) : (contract & FieldType.Hidden);
                var isArray = contract & FieldType.Array;
                var isPresent = source[field] !== undefined;
                var isObject = typeof source[field] === "object" && source[field] !== null;
                if (isRequired && !isPresent && !isArray) {
                    this._logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.MissingRequiredFieldSpecification, "Missing required field specification. The field is required but not present on source", { field: field, name: name });
                    // If not in debug mode, continue and hope the error is permissible
                    continue;
                }
                if (isHidden) {
                    // Don't serialize hidden fields
                    continue;
                }
                var value = void 0;
                if (isObject) {
                    if (isArray) {
                        // special case; resurse on each object in the source array
                        value = this._serializeArray(source[field], field);
                    }
                    else {
                        // recurse on the source object in this field
                        value = this._serializeObject(source[field], field);
                    }
                }
                else {
                    // assign the source field to the output even if undefined or required
                    value = source[field];
                }
                // only emit this field if the value is defined
                if (value !== undefined) {
                    output[field] = value;
                }
            }
            delete source[circularReferenceCheck];
            return output;
        };
        Serializer.prototype._serializeArray = function (sources, name) {
            var output;
            if (!!sources) {
                if (!Util.isArray(sources)) {
                    this._logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.ItemNotInArray, "This field was specified as an array in the contract but the item is not an array.\r\n", { name: name }, true);
                }
                else {
                    output = [];
                    for (var i = 0; i < sources.length; i++) {
                        var source = sources[i];
                        var item = this._serializeObject(source, name + "[" + i + "]");
                        output.push(item);
                    }
                }
            }
            return output;
        };
        Serializer.prototype._serializeStringMap = function (map, expectedType, name) {
            var output;
            if (map) {
                output = {};
                for (var field in map) {
                    var value = map[field];
                    if (expectedType === "string") {
                        if (value === undefined) {
                            output[field] = "undefined";
                        }
                        else if (value === null) {
                            output[field] = "null";
                        }
                        else if (!value.toString) {
                            output[field] = "invalid field: toString() is not defined.";
                        }
                        else {
                            output[field] = value.toString();
                        }
                    }
                    else if (expectedType === "number") {
                        if (value === undefined) {
                            output[field] = "undefined";
                        }
                        else if (value === null) {
                            output[field] = "null";
                        }
                        else {
                            var num = parseFloat(value);
                            if (isNaN(num)) {
                                output[field] = "NaN";
                            }
                            else {
                                output[field] = num;
                            }
                        }
                    }
                    else {
                        output[field] = "invalid field: " + name + " is of unknown type.";
                        this._logger.throwInternal(LoggingSeverity.CRITICAL, output[field], null, true);
                    }
                }
            }
            return output;
        };
        return Serializer;
    }());

    /**
     * @description Monitors browser for offline events
     * @export default - Offline: Static instance of OfflineListener
     * @class OfflineListener
     */
    var OfflineListener = /** @class */ (function () {
        function OfflineListener() {
            this._onlineStatus = true;
            try {
                if (typeof window === 'undefined') {
                    this.isListening = false;
                }
                else if (window && window.addEventListener) {
                    window.addEventListener('online', this._setOnline.bind(this), false);
                    window.addEventListener('offline', this._setOffline.bind(this), false);
                    this.isListening = true;
                }
                else if (document && document.body) {
                    document.body.ononline = this._setOnline.bind(this);
                    document.body.onoffline = this._setOffline.bind(this);
                    this.isListening = true;
                }
                else if (document) {
                    document.ononline = this._setOnline.bind(this);
                    document.onoffline = this._setOffline.bind(this);
                    this.isListening = true;
                }
                else {
                    // Could not find a place to add event listener
                    this.isListening = false;
                }
            }
            catch (e) {
                // this makes react-native less angry
                this.isListening = false;
            }
        }
        OfflineListener.prototype.isOnline = function () {
            if (this.isListening) {
                return this._onlineStatus;
            }
            else if (navigator && !CoreUtils.isNullOrUndefined(navigator.onLine)) {
                return navigator.onLine;
            }
            else {
                // Cannot determine online status - report as online
                return true;
            }
        };
        OfflineListener.prototype.isOffline = function () {
            return !this.isOnline();
        };
        OfflineListener.prototype._setOnline = function () {
            this._onlineStatus = true;
        };
        OfflineListener.prototype._setOffline = function () {
            this._onlineStatus = false;
        };
        OfflineListener.Offline = new OfflineListener;
        return OfflineListener;
    }());
    var Offline = OfflineListener.Offline;

    var HashCodeScoreGenerator = /** @class */ (function () {
        function HashCodeScoreGenerator() {
        }
        HashCodeScoreGenerator.prototype.getHashCodeScore = function (key) {
            var score = this.getHashCode(key) / HashCodeScoreGenerator.INT_MAX_VALUE;
            return score * 100;
        };
        HashCodeScoreGenerator.prototype.getHashCode = function (input) {
            if (input === "") {
                return 0;
            }
            while (input.length < HashCodeScoreGenerator.MIN_INPUT_LENGTH) {
                input = input.concat(input);
            }
            // 5381 is a magic number: http://stackoverflow.com/questions/10696223/reason-for-5381-number-in-djb-hash-function
            var hash = 5381;
            for (var i = 0; i < input.length; ++i) {
                hash = ((hash << 5) + hash) + input.charCodeAt(i);
                // 'hash' is of number type which means 53 bit integer (http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types-number-type)
                // 'hash & hash' will keep it 32 bit integer - just to make it clearer what the result is.
                hash = hash & hash;
            }
            return Math.abs(hash);
        };
        // We're using 32 bit math, hence max value is (2^31 - 1)
        HashCodeScoreGenerator.INT_MAX_VALUE = 2147483647;
        // (Magic number) DJB algorithm can't work on shorter strings (results in poor distribution
        HashCodeScoreGenerator.MIN_INPUT_LENGTH = 8;
        return HashCodeScoreGenerator;
    }());

    var SamplingScoreGenerator = /** @class */ (function () {
        function SamplingScoreGenerator() {
            this.hashCodeGeneragor = new HashCodeScoreGenerator();
            this.keys = new ContextTagKeys();
        }
        SamplingScoreGenerator.prototype.getSamplingScore = function (item) {
            var score = 0;
            if (item.tags && item.tags[this.keys.userId]) {
                score = this.hashCodeGeneragor.getHashCodeScore(item.tags[this.keys.userId]);
            }
            else if (item.ext && item.ext.user && item.ext.user.id) {
                score = this.hashCodeGeneragor.getHashCodeScore(item.ext.user.id);
            }
            else if (item.tags && item.tags[this.keys.operationId]) {
                score = this.hashCodeGeneragor.getHashCodeScore(item.tags[this.keys.operationId]);
            }
            else if (item.ext && item.ext.telemetryTrace && item.ext.telemetryTrace.traceID) {
                score = this.hashCodeGeneragor.getHashCodeScore(item.ext.telemetryTrace.traceID);
            }
            else {
                // tslint:disable-next-line:insecure-random
                score = (window.crypto.getRandomValues( new Uint8Array(1)) * 100);
            }
            return score;
        };
        return SamplingScoreGenerator;
    }());

    var Sample = /** @class */ (function () {
        function Sample(sampleRate, logger) {
            // We're using 32 bit math, hence max value is (2^31 - 1)
            this.INT_MAX_VALUE = 2147483647;
            this._logger = CoreUtils.isNullOrUndefined(logger) ? new DiagnosticLogger() : logger;
            if (sampleRate > 100 || sampleRate < 0) {
                this._logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.SampleRateOutOfRange, "Sampling rate is out of range (0..100). Sampling will be disabled, you may be sending too much data which may affect your AI service level.", { samplingRate: sampleRate }, true);
                this.sampleRate = 100;
            }
            this.sampleRate = sampleRate;
            this.samplingScoreGenerator = new SamplingScoreGenerator();
        }
        /**
         * Determines if an envelope is sampled in (i.e. will be sent) or not (i.e. will be dropped).
         */
        Sample.prototype.isSampledIn = function (envelope) {
            var samplingPercentage = this.sampleRate; // 0 - 100
            var isSampledIn = false;
            if (samplingPercentage === null || samplingPercentage === undefined || samplingPercentage >= 100) {
                return true;
            }
            else if (envelope.baseType === Metric.dataType) {
                // exclude MetricData telemetry from sampling
                return true;
            }
            isSampledIn = this.samplingScoreGenerator.getSamplingScore(envelope) < samplingPercentage;
            return isSampledIn;
        };
        return Sample;
    }());

    var Sender = /** @class */ (function () {
        function Sender() {
            this.priority = 1001;
            this.identifier = BreezeChannelIdentifier;
            /**
             * Whether XMLHttpRequest object is supported. Older version of IE (8,9) do not support it.
             */
            this._XMLHttpRequestSupported = false;
        }
        Sender.constructEnvelope = function (orig, iKey, logger) {
            var envelope;
            if (iKey !== orig.iKey && !CoreUtils.isNullOrUndefined(iKey)) {
                envelope = __assign({}, orig, { iKey: iKey });
            }
            else {
                envelope = orig;
            }
            switch (envelope.baseType) {
                case Event$1.dataType:
                    return EventEnvelopeCreator.EventEnvelopeCreator.Create(logger, envelope);
                case Trace.dataType:
                    return TraceEnvelopeCreator.TraceEnvelopeCreator.Create(logger, envelope);
                case PageView.dataType:
                    return PageViewEnvelopeCreator.PageViewEnvelopeCreator.Create(logger, envelope);
                case PageViewPerformance.dataType:
                    return PageViewPerformanceEnvelopeCreator.PageViewPerformanceEnvelopeCreator.Create(logger, envelope);
                case Exception.dataType:
                    return ExceptionEnvelopeCreator.ExceptionEnvelopeCreator.Create(logger, envelope);
                case Metric.dataType:
                    return MetricEnvelopeCreator.MetricEnvelopeCreator.Create(logger, envelope);
                case RemoteDependencyData$1.dataType:
                    return DependencyEnvelopeCreator.DependencyEnvelopeCreator.Create(logger, envelope);
                default:
                    return EventEnvelopeCreator.EventEnvelopeCreator.Create(logger, envelope);
            }
        };
        Sender._getDefaultAppInsightsChannelConfig = function () {
            // set default values
            return {
                endpointUrl: function () { return "https://dc.services.visualstudio.com/v2/track"; },
                emitLineDelimitedJson: function () { return false; },
                maxBatchInterval: function () { return 15000; },
                maxBatchSizeInBytes: function () { return 102400; },
                disableTelemetry: function () { return false; },
                enableSessionStorageBuffer: function () { return true; },
                isRetryDisabled: function () { return false; },
                isBeaconApiDisabled: function () { return true; },
                onunloadDisableBeacon: function () { return false; },
                instrumentationKey: function () { return undefined; },
                namePrefix: function () { return undefined; },
                samplingPercentage: function () { return 100; }
            };
        };
        Sender._getEmptyAppInsightsChannelConfig = function () {
            return {
                endpointUrl: undefined,
                emitLineDelimitedJson: undefined,
                maxBatchInterval: undefined,
                maxBatchSizeInBytes: undefined,
                disableTelemetry: undefined,
                enableSessionStorageBuffer: undefined,
                isRetryDisabled: undefined,
                isBeaconApiDisabled: undefined,
                onunloadDisableBeacon: undefined,
                instrumentationKey: undefined,
                namePrefix: undefined,
                samplingPercentage: undefined
            };
        };
        Sender.prototype.pause = function () {
            throw new Error("Method not implemented.");
        };
        Sender.prototype.resume = function () {
            throw new Error("Method not implemented.");
        };
        Sender.prototype.flush = function () {
            try {
                this.triggerSend();
            }
            catch (e) {
                this._logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.FlushFailed, "flush failed, telemetry will not be collected: " + Util.getExceptionName(e), { exception: Util.dump(e) });
            }
        };
        Sender.prototype.onunloadFlush = function () {
            if ((this._config.onunloadDisableBeacon() === false || this._config.isBeaconApiDisabled() === false) && Util.IsBeaconApiSupported()) {
                try {
                    this.triggerSend(true, this._beaconSender);
                }
                catch (e) {
                    this._logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.FailedToSendQueuedTelemetry, "failed to flush with beacon sender on page unload, telemetry will not be collected: " + Util.getExceptionName(e), { exception: Util.dump(e) });
                }
            }
            else {
                this.flush();
            }
        };
        Sender.prototype.teardown = function () {
            throw new Error("Method not implemented.");
        };
        Sender.prototype.initialize = function (config, core, extensions) {
            var _this = this;
            this._logger = core.logger;
            this._serializer = new Serializer(core.logger);
            this._consecutiveErrors = 0;
            this._retryAt = null;
            this._lastSend = 0;
            this._sender = null;
            var defaultConfig = Sender._getDefaultAppInsightsChannelConfig();
            this._config = Sender._getEmptyAppInsightsChannelConfig();
            var _loop_1 = function (field) {
                this_1._config[field] = function () { return ConfigurationManager.getConfig(config, field, _this.identifier, defaultConfig[field]()); };
            };
            var this_1 = this;
            for (var field in defaultConfig) {
                _loop_1(field);
            }
            this._buffer = (this._config.enableSessionStorageBuffer && Util.canUseSessionStorage())
                ? new SessionStorageSendBuffer(this._logger, this._config) : new ArraySendBuffer(this._config);
            this._sample = new Sample(this._config.samplingPercentage(), this._logger);
            if (!this._config.isBeaconApiDisabled() && Util.IsBeaconApiSupported()) {
                this._sender = this._beaconSender;
            }
            else {
                if (typeof XMLHttpRequest !== "undefined") {
                    var testXhr = new XMLHttpRequest();
                    if ("withCredentials" in testXhr) {
                        this._sender = this._xhrSender;
                        this._XMLHttpRequestSupported = true;
                    }
                    else if (typeof XDomainRequest !== "undefined") {
                        this._sender = this._xdrSender; // IE 8 and 9
                    }
                }
            }
        };
        Sender.prototype.processTelemetry = function (telemetryItem) {
            var _this = this;
            try {
                // if master off switch is set, don't send any data
                if (this._config.disableTelemetry()) {
                    // Do not send/save data
                    return;
                }
                // validate input
                if (!telemetryItem) {
                    this._logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.CannotSendEmptyTelemetry, "Cannot send empty telemetry");
                    return;
                }
                // validate event
                if (telemetryItem.baseData && !telemetryItem.baseType) {
                    this._logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.InvalidEvent, "Cannot send telemetry without baseData and baseType");
                    return;
                }
                if (!telemetryItem.baseType) {
                    // Default
                    telemetryItem.baseType = "EventData";
                }
                // ensure a sender was constructed
                if (!this._sender) {
                    this._logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.SenderNotInitialized, "Sender was not initialized");
                    return;
                }
                // check if this item should be sampled in, else add sampleRate tag
                if (!this._isSampledIn(telemetryItem)) {
                    // Item is sampled out, do not send it
                    this._logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.TelemetrySampledAndNotSent, "Telemetry item was sampled out and not sent", { SampleRate: this._sample.sampleRate });
                    return;
                }
                else {
                    telemetryItem.tags = telemetryItem.tags || {};
                    telemetryItem.tags[SampleRate] = this._sample.sampleRate;
                }
                // construct an envelope that Application Insights endpoint can understand
                var aiEnvelope_1 = Sender.constructEnvelope(telemetryItem, this._config.instrumentationKey(), this._logger);
                if (!aiEnvelope_1) {
                    this._logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.CreateEnvelopeError, "Unable to create an AppInsights envelope");
                    return;
                }
                var doNotSendItem_1 = false;
                // this is for running in legacy mode, where customer may already have a custom initializer present
                if (telemetryItem.tags && telemetryItem.tags[ProcessLegacy]) {
                    telemetryItem.tags[ProcessLegacy].forEach(function (callBack) {
                        try {
                            if (callBack && callBack(aiEnvelope_1) === false) {
                                doNotSendItem_1 = true;
                                _this._logger.warnToConsole("Telemetry processor check returns false");
                            }
                        }
                        catch (e) {
                            // log error but dont stop executing rest of the telemetry initializers
                            // doNotSendItem = true;
                            _this._logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.TelemetryInitializerFailed, "One of telemetry initializers failed, telemetry item will not be sent: " + Util.getExceptionName(e), { exception: Util.dump(e) }, true);
                        }
                    });
                    delete telemetryItem.tags[ProcessLegacy];
                }
                if (doNotSendItem_1) {
                    return; // do not send, no need to execute next plugin
                }
                // check if the incoming payload is too large, truncate if necessary
                var payload = this._serializer.serialize(aiEnvelope_1);
                // flush if we would exceed the max-size limit by adding this item
                var bufferPayload = this._buffer.getItems();
                var batch = this._buffer.batchPayloads(bufferPayload);
                if (batch && (batch.length + payload.length > this._config.maxBatchSizeInBytes())) {
                    this.triggerSend();
                }
                // enqueue the payload
                this._buffer.enqueue(payload);
                // ensure an invocation timeout is set
                this._setupTimer();
            }
            catch (e) {
                this._logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.FailedAddingTelemetryToBuffer, "Failed adding telemetry to the sender's buffer, some telemetry will be lost: " + Util.getExceptionName(e), { exception: Util.dump(e) });
            }
            // hand off the telemetry item to the next plugin
            if (!CoreUtils.isNullOrUndefined(this._nextPlugin)) {
                this._nextPlugin.processTelemetry(telemetryItem);
            }
        };
        Sender.prototype.setNextPlugin = function (next) {
            this._nextPlugin = next;
        };
        /**
         * xhr state changes
         */
        Sender.prototype._xhrReadyStateChange = function (xhr, payload, countOfItemsInPayload) {
            if (xhr.readyState === 4) {
                var response = null;
                if (!this._appId) {
                    response = this._parseResponse(xhr.responseText || xhr.response);
                    if (response && response.appId) {
                        this._appId = response.appId;
                    }
                }
                if ((xhr.status < 200 || xhr.status >= 300) && xhr.status !== 0) {
                    if (!this._config.isRetryDisabled() && this._isRetriable(xhr.status)) {
                        this._resendPayload(payload);
                        this._logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.TransmissionFailed, ". " +
                            "Response code " + xhr.status + ". Will retry to send " + payload.length + " items.");
                    }
                    else {
                        this._onError(payload, this._formatErrorMessageXhr(xhr));
                    }
                }
                else if (Offline.isOffline()) {
                    // Note: Don't check for staus == 0, since adblock gives this code
                    if (!this._config.isRetryDisabled()) {
                        var offlineBackOffMultiplier = 10; // arbritrary number
                        this._resendPayload(payload, offlineBackOffMultiplier);
                        this._logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.TransmissionFailed, ". Offline - Response Code: " + xhr.status + ". Offline status: " + Offline.isOffline() + ". Will retry to send " + payload.length + " items.");
                    }
                }
                else {
                    if (xhr.status === 206) {
                        if (!response) {
                            response = this._parseResponse(xhr.responseText || xhr.response);
                        }
                        if (response && !this._config.isRetryDisabled()) {
                            this._onPartialSuccess(payload, response);
                        }
                        else {
                            this._onError(payload, this._formatErrorMessageXhr(xhr));
                        }
                    }
                    else {
                        this._consecutiveErrors = 0;
                        this._onSuccess(payload, countOfItemsInPayload);
                    }
                }
            }
        };
        /**
         * Immediately send buffered data
         * @param async {boolean} - Indicates if the events should be sent asynchronously
         * @param forcedSender {SenderFunction} - Indicates the forcedSender, undefined if not passed
         */
        Sender.prototype.triggerSend = function (async, forcedSender) {
            if (async === void 0) { async = true; }
            try {
                // Send data only if disableTelemetry is false
                if (!this._config.disableTelemetry()) {
                    if (this._buffer.count() > 0) {
                        var payload = this._buffer.getItems();
                        // invoke send
                        if (forcedSender) {
                            forcedSender.call(this, payload, async);
                        }
                        else {
                            this._sender(payload, async);
                        }
                    }
                    // update lastSend time to enable throttling
                    this._lastSend = +new Date;
                }
                else {
                    this._buffer.clear();
                }
                clearTimeout(this._timeoutHandle);
                this._timeoutHandle = null;
                this._retryAt = null;
            }
            catch (e) {
                /* Ignore this error for IE under v10 */
                if (!Util.getIEVersion() || Util.getIEVersion() > 9) {
                    this._logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.TransmissionFailed, "Telemetry transmission failed, some telemetry will be lost: " + Util.getExceptionName(e), { exception: Util.dump(e) });
                }
            }
        };
        /**
         * error handler
         */
        Sender.prototype._onError = function (payload, message, event) {
            this._logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.OnError, "Failed to send telemetry.", { message: message });
            this._buffer.clearSent(payload);
        };
        /**
         * partial success handler
         */
        Sender.prototype._onPartialSuccess = function (payload, results) {
            var failed = [];
            var retry = [];
            // Iterate through the reversed array of errors so that splicing doesn't have invalid indexes after the first item.
            var errors = results.errors.reverse();
            for (var _i = 0, errors_1 = errors; _i < errors_1.length; _i++) {
                var error = errors_1[_i];
                var extracted = payload.splice(error.index, 1)[0];
                if (this._isRetriable(error.statusCode)) {
                    retry.push(extracted);
                }
                else {
                    // All other errors, including: 402 (Monthly quota exceeded) and 439 (Too many requests and refresh cache).
                    failed.push(extracted);
                }
            }
            if (payload.length > 0) {
                this._onSuccess(payload, results.itemsAccepted);
            }
            if (failed.length > 0) {
                this._onError(failed, this._formatErrorMessageXhr(null, ['partial success', results.itemsAccepted, 'of', results.itemsReceived].join(' ')));
            }
            if (retry.length > 0) {
                this._resendPayload(retry);
                this._logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.TransmissionFailed, "Partial success. " +
                    "Delivered: " + payload.length + ", Failed: " + failed.length +
                    ". Will retry to send " + retry.length + " our of " + results.itemsReceived + " items");
            }
        };
        /**
         * success handler
         */
        Sender.prototype._onSuccess = function (payload, countOfItemsInPayload) {
            this._buffer.clearSent(payload);
        };
        /**
         * xdr state changes
         */
        Sender.prototype._xdrOnLoad = function (xdr, payload) {
            if (xdr && (xdr.responseText + "" === "200" || xdr.responseText === "")) {
                this._consecutiveErrors = 0;
                this._onSuccess(payload, 0);
            }
            else {
                var results = this._parseResponse(xdr.responseText);
                if (results && results.itemsReceived && results.itemsReceived > results.itemsAccepted
                    && !this._config.isRetryDisabled()) {
                    this._onPartialSuccess(payload, results);
                }
                else {
                    this._onError(payload, this._formatErrorMessageXdr(xdr));
                }
            }
        };
        Sender.prototype._isSampledIn = function (envelope) {
            return this._sample.isSampledIn(envelope);
        };
        /**
         * Send Beacon API request
         * @param payload {string} - The data payload to be sent.
         * @param isAsync {boolean} - not used
         * Note: Beacon API does not support custom headers and we are not able to get
         * appId from the backend for the correct correlation.
         */
        Sender.prototype._beaconSender = function (payload, isAsync) {
            var url = this._config.endpointUrl();
            var batch = this._buffer.batchPayloads(payload);
            // Chrome only allows CORS-safelisted values for the sendBeacon data argument
            // see: https://bugs.chromium.org/p/chromium/issues/detail?id=720283
            var plainTextBatch = new Blob([batch], { type: 'text/plain;charset=UTF-8' });
            // The sendBeacon method returns true if the user agent is able to successfully queue the data for transfer. Otherwise it returns false.
            var queued = navigator.sendBeacon(url, plainTextBatch);
            if (queued) {
                this._buffer.markAsSent(payload);
                // no response from beaconSender, clear buffer
                this._onSuccess(payload, payload.length);
            }
            else {
                this._xhrSender(payload, true);
                this._logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.TransmissionFailed, ". " + "Failed to send telemetry with Beacon API, retried with xhrSender.");
            }
        };
        /**
         * Send XMLHttpRequest
         * @param payload {string} - The data payload to be sent.
         * @param isAsync {boolean} - Indicates if the request should be sent asynchronously
         */
        Sender.prototype._xhrSender = function (payload, isAsync) {
            var _this = this;
            var xhr = new XMLHttpRequest();
            xhr[DisabledPropertyName] = true;
            xhr.open("POST", this._config.endpointUrl(), isAsync);
            xhr.setRequestHeader("Content-type", "application/json");
            // append Sdk-Context request header only in case of breeze endpoint
            if (Util.isInternalApplicationInsightsEndpoint(this._config.endpointUrl())) {
                xhr.setRequestHeader(RequestHeaders.sdkContextHeader, RequestHeaders.sdkContextHeaderAppIdRequest);
            }
            xhr.onreadystatechange = function () { return _this._xhrReadyStateChange(xhr, payload, payload.length); };
            xhr.onerror = function (event) { return _this._onError(payload, _this._formatErrorMessageXhr(xhr), event); };
            // compose an array of payloads
            var batch = this._buffer.batchPayloads(payload);
            xhr.send(batch);
            this._buffer.markAsSent(payload);
        };
        /**
         * Parses the response from the backend.
         * @param response - XMLHttpRequest or XDomainRequest response
         */
        Sender.prototype._parseResponse = function (response) {
            try {
                if (response && response !== "") {
                    var result = JSON.parse(response);
                    if (result && result.itemsReceived && result.itemsReceived >= result.itemsAccepted &&
                        result.itemsReceived - result.itemsAccepted === result.errors.length) {
                        return result;
                    }
                }
            }
            catch (e) {
                this._logger.throwInternal(LoggingSeverity.CRITICAL, _InternalMessageId.InvalidBackendResponse, "Cannot parse the response. " + Util.getExceptionName(e), {
                    response: response
                });
            }
            return null;
        };
        /**
         * Resend payload. Adds payload back to the send buffer and setup a send timer (with exponential backoff).
         * @param payload
         */
        Sender.prototype._resendPayload = function (payload, linearFactor) {
            if (linearFactor === void 0) { linearFactor = 1; }
            if (!payload || payload.length === 0) {
                return;
            }
            this._buffer.clearSent(payload);
            this._consecutiveErrors++;
            for (var _i = 0, payload_1 = payload; _i < payload_1.length; _i++) {
                var item = payload_1[_i];
                this._buffer.enqueue(item);
            }
            // setup timer
            this._setRetryTime(linearFactor);
            this._setupTimer();
        };
        /**
         * Calculates the time to wait before retrying in case of an error based on
         * http://en.wikipedia.org/wiki/Exponential_backoff
         */
        Sender.prototype._setRetryTime = function (linearFactor) {
            var SlotDelayInSeconds = 10;
            var delayInSeconds;
            if (this._consecutiveErrors <= 1) {
                delayInSeconds = SlotDelayInSeconds;
            }
            else {
                var backOffSlot = (Math.pow(2, this._consecutiveErrors) - 1) / 2;
                // tslint:disable-next-line:insecure-random
                var backOffDelay = Math.floor(window.crypto.getRandomValues( new Uint8Array(1)) * backOffSlot * SlotDelayInSeconds) + 1;
                backOffDelay = linearFactor * backOffDelay;
                delayInSeconds = Math.max(Math.min(backOffDelay, 3600), SlotDelayInSeconds);
            }
            // TODO: Log the backoff time like the C# version does.
            var retryAfterTimeSpan = Date.now() + (delayInSeconds * 1000);
            // TODO: Log the retry at time like the C# version does.
            this._retryAt = retryAfterTimeSpan;
        };
        /**
         * Sets up the timer which triggers actually sending the data.
         */
        Sender.prototype._setupTimer = function () {
            var _this = this;
            if (!this._timeoutHandle) {
                var retryInterval = this._retryAt ? Math.max(0, this._retryAt - Date.now()) : 0;
                var timerValue = Math.max(this._config.maxBatchInterval(), retryInterval);
                this._timeoutHandle = setTimeout(function () {
                    _this.triggerSend();
                }, timerValue);
            }
        };
        /**
         * Checks if the SDK should resend the payload after receiving this status code from the backend.
         * @param statusCode
         */
        Sender.prototype._isRetriable = function (statusCode) {
            return statusCode === 408 // Timeout
                || statusCode === 429 // Too many requests.
                || statusCode === 500 // Internal server error.
                || statusCode === 503; // Service unavailable.
        };
        Sender.prototype._formatErrorMessageXhr = function (xhr, message) {
            if (xhr) {
                return "XMLHttpRequest,Status:" + xhr.status + ",Response:" + xhr.responseText || xhr.response || "";
            }
            return message;
        };
        /**
         * Send XDomainRequest
         * @param payload {string} - The data payload to be sent.
         * @param isAsync {boolean} - Indicates if the request should be sent asynchronously
         *
         * Note: XDomainRequest does not support sync requests. This 'isAsync' parameter is added
         * to maintain consistency with the xhrSender's contract
         * Note: XDomainRequest does not support custom headers and we are not able to get
         * appId from the backend for the correct correlation.
         */
        Sender.prototype._xdrSender = function (payload, isAsync) {
            var _this = this;
            var xdr = new XDomainRequest();
            xdr.onload = function () { return _this._xdrOnLoad(xdr, payload); };
            xdr.onerror = function (event) { return _this._onError(payload, _this._formatErrorMessageXdr(xdr), event); };
            // XDomainRequest requires the same protocol as the hosting page.
            // If the protocol doesn't match, we can't send the telemetry :(.
            var hostingProtocol = window.location && window.location.protocol;
            if (this._config.endpointUrl().lastIndexOf(hostingProtocol, 0) !== 0) {
                this._logger.throwInternal(LoggingSeverity.WARNING, _InternalMessageId.TransmissionFailed, ". " +
                    "Cannot send XDomain request. The endpoint URL protocol doesn't match the hosting page protocol.");
                this._buffer.clear();
                return;
            }
            var endpointUrl = this._config.endpointUrl().replace(/^(https?:)/, "");
            xdr.open('POST', endpointUrl);
            // compose an array of payloads
            var batch = this._buffer.batchPayloads(payload);
            xdr.send(batch);
            this._buffer.markAsSent(payload);
        };
        Sender.prototype._formatErrorMessageXdr = function (xdr, message) {
            if (xdr) {
                return "XDomainRequest,Response:" + xdr.responseText || "";
            }
            return message;
        };
        return Sender;
    }());

    exports.Sender = Sender;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=applicationinsights-channel-js.js.map
