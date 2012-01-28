# Jasmine WebKit Reporter

Jasmine WebKit Reporter is the simple reporter for Jasmine for showning results
of spec running by Notification API. This is reporter works with Chrome/Chromium
only, because Notification API implemented only in this browser.

Need permission for use notifications for work this reporter.

## Installation

Install this reporter is very simple task. Only enable script after Jasmine in
SpecRunner.

## Usage

This is simple example of usage. :

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
