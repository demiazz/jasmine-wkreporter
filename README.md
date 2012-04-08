# Jasmine WebKit Reporter

Jasmine WebKit Reporter is the simple reporter for Jasmine for showning results
of spec running by Notification API. This is reporter works with Chrome/Chromium
only, because Notification API implemented only in this browser.

Need permission for use notifications for work this reporter.

## Installation

Installation this reporter is very simple task. Only enable script after Jasmine in
SpecRunner.

## Usage

This is simple example of usage :

``` javascript

(function() {
    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 1000;

    var trivialReporter = new jasmine.TrivialReporter();
    var webkitReporter = new jasmine.WebkitReporter(); // create new reporter instance

    jasmineEnv.addReporter(trivialReporter);
    jasmineEnv.addReporter(webkitReporter); // register reporter in jasmineEnv

    jasmineEnv.specFilter = function(spec) {
      return trivialReporter.specFilter(spec);
    };

    var currentWindowOnload = window.onload;

    window.onload = function() {
      if (currentWindowOnload) {
        currentWindowOnload();
      }
      execJasmine();
    };

    function execJasmine() {
      jasmineEnv.execute();
    }

  })();

When specs are running, will be used TrivialReporter (default for Jasmine), and
WebkitReporter.

# Options

WebKit Reporter have custom options:
  * title - name of testing application;
  * replaceId - custom replaceId for notifications (see Notifications API Draft);
  * timeout - of timeout is greater such 0, then notifications will be autoclosed after timeout;
  * passedIcon - icon for notifications about passed running;
  * failedIcon - icon for notifications about failed running;
  * runningIcon - icon for notifications about running.

Icons must be a URL or empty string.

# Browsers without webkitNotifications

If browser have not `window.webkitNotifications`, when reporter creating methods
`reportRunnerStarting` and `reportRunnerResults` replaced by empty methods.

This is make possible using library in non-supported browsers without exceptions,
and any actions for disabling of reporter.
