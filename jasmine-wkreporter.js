
/*
  @class 

  Simple reporter for Jasmine. Using Notification API from Chrome/Chromium browser,
  for report results of running specs.

  @author Alexey Plutalov <demiazz.py@gmail.com>
  @since Jasmine Webkit Reporter 0.1
*/

(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  jasmine.WebkitReporter = (function(_super) {

    __extends(WebkitReporter, _super);

    /*
        Title using for header of notification. May used for identify specs.
    
        @type {String}
        @default "jasmine"
    */

    WebkitReporter.prototype.title = "Jasmine";

    /*
        This is ID used for replacing notifications with this ID, when creating new
        notification. 
    
        @type {String}
        @default "jasmine"
    
        @see Notification API Draft
    */

    WebkitReporter.prototype.replaceId = "jasmine";

    /*
        Timeout used for set timeout before notification be autoclosed. If timeout
        is equal 0, then notification not be autoclosed.
    
        @type {Integer}
        @default 0
    */

    WebkitReporter.prototype.timeout = 0;

    /*
        Passed icon is a icon for notification, when all specs are passed.
    
        @type {String}
        @default ""
    */

    WebkitReporter.prototype.passedIcon = "";

    /*
        Failed icon is a icon for notification, when at least one spec are failed.
    
        @type {String}
        @default ""
    */

    WebkitReporter.prototype.failedIcon = "";

    /*
        Running icons is a icon for notification, while specs running.
    
        @type {String}
        @default ""
    */

    WebkitReporter.prototype.runningIcon = "";

    /*
        WebkitReporter constructor.
    
        Options:
          * title
          * replaceId
          * timeout
          * passedIcon
          * failedIcon
          * runningIcon
    
        @param {Object|null} options - options for reporter
    */

    function WebkitReporter(options) {
      if (options == null) options = {};
      if (jasmine.getGlobal().webkitNotifications) {
        if (options) {
          if (options.title) this.title = options.title;
          if (options.replaceId) this.replaceId = options.replaceId;
          if (options.timeout) this.timeout = options.timeout;
          if (options.passedIcon) this.passedIcon = options.passedIcon;
          if (options.failedIcon) this.failedIcon = options.failedIcon;
          if (options.runningIcon) this.runningIcon = options.runningIcon;
        }
        this.startedAt = null;
        this.finishedAt = null;
      } else {
        this.reportRunnerStarting = function() {};
        this.reportRunnerResults = function() {};
      }
      return;
    }

    /*
        Callback for jasmine.Runner, when Runner starting.
    
        If notification permission is not allowed then request permission 
        instead show notification.
    
        @param {jasmine.Runner} runner jasmine.Runner for reporting.
    */

    WebkitReporter.prototype.reportRunnerStarting = function(runner) {
      var title;
      if (jasmine.getGlobal().webkitNotifications.checkPermission() === 0) {
        this.startedAt = new Date();
        this.finishedAt = null;
        if (this.title && this.title.length > 0) {
          title = "" + this.title + ": RUNNING";
        } else {
          title = "RUNNING";
        }
        this.showReport(this.runningIcon, title, "Running specs. Please wait...");
      } else {
        jasmine.getGlobal().webkitNotifications.requestPermission();
      }
    };

    /*
        Callback for jasmine.Runner, when Runner finished.
    
        If notification permission is not allowed then request permission 
        instead show notification.
    
        @param {jasmine.Runner} runner jasmine.Runner for reporting.
    */

    WebkitReporter.prototype.reportRunnerResults = function(runner) {
      var icon, message, results, time, title;
      this.finishedAt = new Date();
      if (jasmine.getGlobal().webkitNotifications.checkPermission() === 0) {
        icon = "";
        title = "";
        message = "";
        time = (this.finishedAt.getTime() - this.startedAt.getTime()) / 1000;
        if (this.title && this.title.length > 0) title = this.title + ": ";
        results = runner.results();
        if (results.failedCount > 0) {
          icon = this.failedIcon;
          title += "FAILED";
        } else {
          icon = this.passedIcon;
          title += "PASSED";
        }
        message += "" + results.totalCount + " spec" + (results.totalCount === 1 ? "" : "s");
        message += ", " + results.failedCount + " failure" + (results.failedCount === 1 ? "" : "s");
        message += " in " + time + "s";
        this.showReport(icon, title, message);
      } else {
        jasmine.getGlobal().webkitNotifications.requestPermission();
      }
    };

    /*
        Show notification by Notification API. Set timeout for autoclose if exist.
    
        @param {String} icon - icon for notification
        @param {String} title - title for notification
        @param {String} message - message for notification
    */

    WebkitReporter.prototype.showReport = function(icon, title, message) {
      var notification;
      notification = jasmine.getGlobal().webkitNotifications.createNotification(icon, title, message);
      notification.replaceId = this.replaceId;
      notification.show();
      if (this.timeout > 0) {
        setTimeout(function() {
          notification.cancel();
        }, this.timeout);
      }
    };

    return WebkitReporter;

  })(jasmine.Reporter);

}).call(this);
