(function() {

  describe("Jasmine Webkit Reporter", function() {
    it("should be defined", function() {
      expect(jasmine.WebkitReporter).toBeDefined();
    });
    describe("when create new reporter instance", function() {
      describe("when options not given", function() {
        var instance;
        instance = null;
        beforeEach(function() {
          instance = new jasmine.WebkitReporter();
        });
        it("should have default title", function() {
          expect(instance.title).toEqual("Jasmine");
        });
        it("should have default replaceId", function() {
          expect(instance.replaceId).toEqual("jasmine");
        });
        it("should have default timeout", function() {
          expect(instance.timeout).toEqual(0);
        });
        it("should have default icons", function() {
          expect(instance.passedIcon).toEqual("");
          expect(instance.failedIcon).toEqual("");
          expect(instance.runningIcon).toEqual("");
        });
      });
      describe("when custom options given", function() {
        var instance;
        instance = null;
        beforeEach(function() {
          instance = new jasmine.WebkitReporter({
            title: "Webkit Reporter",
            replaceId: "webkit-reporter",
            timeout: 3000,
            passedIcon: "passed.png",
            failedIcon: "failed.png",
            runningIcon: "running.png"
          });
        });
        it("should have custom title", function() {
          expect(instance.title).toEqual("Webkit Reporter");
        });
        it("should have custom replaceId", function() {
          expect(instance.replaceId).toEqual("webkit-reporter");
        });
        it("should have custom timeout", function() {
          expect(instance.timeout).toEqual(3000);
        });
        it("should have custom icons", function() {
          expect(instance.passedIcon).toEqual("passed.png");
          expect(instance.failedIcon).toEqual("failed.png");
          expect(instance.runningIcon).toEqual("running.png");
        });
      });
      it("should have empty startedAt and finishedAt", function() {
        var instance;
        instance = new jasmine.WebkitReporter();
        expect(instance.startedAt).toEqual(null);
        expect(instance.finishedAt).toEqual(null);
      });
    });
    it("should have default methods of jasmine.Reporter", function() {
      var instance, method, methods, _i, _len;
      instance = new jasmine.WebkitReporter();
      methods = ["reportRunnerStarting", "reportRunnerResults", "reportSuiteResults", "reportSpecStarting", "reportSpecResults", "log"];
      for (_i = 0, _len = methods.length; _i < _len; _i++) {
        method = methods[_i];
        expect(instance[method]).toBeDefined();
      }
    });
    describe("have method reportRunnerStarting method", function() {
      var checkPermissionStub, instance, showReportSpy;
      instance = null;
      showReportSpy = null;
      checkPermissionStub = null;
      beforeEach(function() {
        instance = new jasmine.WebkitReporter();
        showReportSpy = sinon.spy(instance, "showReport");
        checkPermissionStub = sinon.stub(window.webkitNotifications, 'checkPermission');
      });
      afterEach(function() {
        instance.showReport.restore();
        checkPermissionStub.restore();
      });
      describe("if notifications permission is allowed", function() {
        beforeEach(function() {
          checkPermissionStub.returns(0);
          instance.reportRunnerStarting(null);
        });
        it("should mark startedAt", function() {
          expect(instance.startedAt).not.toEqual(null);
        });
        it("should reset finishedAt", function() {
          expect(instance.finishedAt).toEqual(null);
        });
        it("should call showReport method", function() {
          expect(showReportSpy).toHaveBeenCalledWith("", "Jasmine: RUNNING", "Running specs. Please wait...");
        });
        it("should call showReport method with empty title", function() {
          instance.title = "";
          instance.reportRunnerStarting(null);
          expect(showReportSpy).toHaveBeenCalledWith("", "RUNNING", "Running specs. Please wait...");
        });
        it("should call showReport method with custom icon", function() {
          instance.runningIcon = "running.png";
          instance.reportRunnerStarting(null);
          expect(showReportSpy).toHaveBeenCalledWith("running.png", "Jasmine: RUNNING", "Running specs. Please wait...");
        });
        it("should call showReport method with custom title", function() {
          instance.title = "WebkitReporter";
          instance.reportRunnerStarting(null);
          expect(showReportSpy).toHaveBeenCalledWith("", "WebkitReporter: RUNNING", "Running specs. Please wait...");
        });
      });
      describe("if notifications permission isn't allowed", function() {
        var spyRequestPermission;
        spyRequestPermission = null;
        beforeEach(function() {
          spyRequestPermission = sinon.spy(window.webkitNotifications, "requestPermission");
          checkPermissionStub.returns(1);
        });
        afterEach(function() {
          window.webkitNotifications.requestPermission.restore();
        });
        it("should call requestPermission", function() {
          instance.reportRunnerStarting(null);
          expect(spyRequestPermission).toHaveBeenCalled();
          expect(showReportSpy).not.toHaveBeenCalled();
        });
      });
    });
    describe("have method reportRunnerResults method", function() {
      var checkPermissionStub, failedRunner, instance, passedRunner, showReportSpy;
      instance = null;
      showReportSpy = null;
      checkPermissionStub = null;
      passedRunner = {
        results: function() {
          return {
            totalCount: 10,
            failedCount: 0
          };
        }
      };
      failedRunner = {
        results: function() {
          return {
            totalCount: 10,
            failedCount: 5
          };
        }
      };
      beforeEach(function() {
        instance = new jasmine.WebkitReporter({
          passedIcon: "passed.png",
          failedIcon: "failed.png"
        });
        instance.reportRunnerStarting(null);
        showReportSpy = sinon.spy(instance, "showReport");
        checkPermissionStub = sinon.stub(window.webkitNotifications, 'checkPermission');
      });
      afterEach(function() {
        instance.showReport.restore();
        checkPermissionStub.restore();
      });
      describe("if notifications permission is allowed", function() {
        var time;
        time = null;
        beforeEach(function() {
          checkPermissionStub.returns(0);
        });
        describe("if given passed runner", function() {
          beforeEach(function() {
            instance.reportRunnerResults(passedRunner);
            time = (instance.finishedAt.getTime() - instance.startedAt.getTime()) / 1000;
          });
          it("should call showReport with passed icon", function() {
            expect(showReportSpy.args[0][0]).toEqual("passed.png");
          });
          it("should call showReport with passes title", function() {
            expect(showReportSpy.args[0][1]).toEqual("Jasmine: PASSED");
          });
          it("should call showReport with correct message", function() {
            expect(showReportSpy.args[0][2]).toEqual("10 specs, 0 failures in " + time + "s");
          });
        });
        describe("if given failed runner", function() {
          beforeEach(function() {
            instance.reportRunnerResults(failedRunner);
            time = (instance.finishedAt.getTime() - instance.startedAt.getTime()) / 1000;
          });
          it("should call showReport with failed icon", function() {
            expect(showReportSpy.args[0][0]).toEqual("failed.png");
          });
          it("should call showReport with failed title", function() {
            expect(showReportSpy.args[0][1]).toEqual("Jasmine: FAILED");
          });
          it("should call showReport with correct message", function() {
            expect(showReportSpy.args[0][2]).toEqual("10 specs, 5 failures in " + time + "s");
          });
        });
      });
      describe("if notifications permission isn't allowed", function() {
        var spyRequestPermission;
        spyRequestPermission = null;
        beforeEach(function() {
          spyRequestPermission = sinon.spy(window.webkitNotifications, "requestPermission");
          checkPermissionStub.returns(1);
        });
        afterEach(function() {
          window.webkitNotifications.requestPermission.restore();
        });
        it("should call requestPermission", function() {
          instance.reportRunnerResults(passedRunner);
          expect(spyRequestPermission).toHaveBeenCalled();
          expect(showReportSpy).not.toHaveBeenCalled();
        });
      });
    });
    describe("have method showReport", function() {
      var cancelSpy, createNotificationSpy, createNotificationStub, instance, notify, setTimeoutStub, showSpy;
      instance = new jasmine.WebkitReporter();
      notify = {
        icon: "",
        title: "",
        message: "",
        replaceId: "",
        created: false,
        show: function() {},
        cancel: function() {}
      };
      createNotificationStub = null;
      createNotificationSpy = null;
      showSpy = null;
      cancelSpy = null;
      setTimeoutStub = null;
      beforeEach(function() {
        notify.title = "";
        notify.replaceId = "";
        notify.created = false;
        createNotificationStub = sinon.stub(window.webkitNotifications, "createNotification", function(icon, title, message) {
          notify.icon = icon;
          notify.title = title;
          notify.message = message;
          notify.created = true;
          return notify;
        });
        setTimeoutStub = sinon.stub(window, "setTimeout", function(func, timeout) {
          func.call(this);
        });
        showSpy = sinon.spy(notify, "show");
        cancelSpy = sinon.spy(notify, "cancel");
        instance.showReport("icon.png", "title", "message");
      });
      afterEach(function() {
        createNotificationStub.restore();
        setTimeoutStub.restore();
        showSpy.restore();
        cancelSpy.restore();
      });
      it("should call createNotification with args", function() {
        expect(notify.created).toBeTruthy();
        expect(notify.icon).toEqual("icon.png");
        expect(notify.title).toEqual("title");
        expect(notify.message).toEqual("message");
      });
      it("should call show on notification", function() {
        expect(showSpy).toHaveBeenCalled();
      });
      it("should set replaceId for notification", function() {
        expect(notify.replaceId).toEqual("jasmine");
      });
      it("should not close message by timeout", function() {
        expect(cancelSpy).not.toHaveBeenCalled();
      });
      return it("should close message by timeout if timeout not 0", function() {
        instance.timeout = 1000;
        instance.showReport("icon.png", "title", "message");
        expect(cancelSpy).toHaveBeenCalled();
      });
    });
  });

}).call(this);
