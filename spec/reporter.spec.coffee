describe "Jasmine Webkit Reporter", () ->

  it "should be defined", () ->
    expect(jasmine.WebkitReporter).toBeDefined()
    return

  #-----------------------------------------------------------------------------
  #--- constructor

  describe "when create new reporter instance", () ->

    describe "when options not given", () ->

      instance = null

      beforeEach () ->
        instance = new jasmine.WebkitReporter()
        return

      it "should have default title", () ->
        expect(instance.title).toEqual("Jasmine")
        return

      it "should have default replaceId", () ->
        expect(instance.replaceId).toEqual("jasmine")
        return

      it "should have default timeout", () ->
        expect(instance.timeout).toEqual(0)
        return

      it "should have default icons", () ->
        expect(instance.passedIcon).toEqual("")
        expect(instance.failedIcon).toEqual("")
        expect(instance.runningIcon).toEqual("")
        return
      
      return

    describe "when custom options given", () ->

      instance = null

      beforeEach () ->
        instance = new jasmine.WebkitReporter
          title: "Webkit Reporter"
          replaceId: "webkit-reporter"
          timeout: 3000
          passedIcon: "passed.png"
          failedIcon: "failed.png"
          runningIcon: "running.png"
        return

      it "should have custom title", () ->
        expect(instance.title).toEqual("Webkit Reporter")
        return

      it "should have custom replaceId", () ->
        expect(instance.replaceId).toEqual("webkit-reporter")
        return

      it "should have custom timeout", () ->
        expect(instance.timeout).toEqual(3000)
        return

      it "should have custom icons", () ->
        expect(instance.passedIcon).toEqual("passed.png")
        expect(instance.failedIcon).toEqual("failed.png")
        expect(instance.runningIcon).toEqual("running.png")
        return

      return

    it "should have empty startedAt and finishedAt", () ->
      instance = new jasmine.WebkitReporter()
      expect(instance.startedAt).toEqual(null)
      expect(instance.finishedAt).toEqual(null)
      return

    return

  it "should have default methods of jasmine.Reporter", () ->
    instance = new jasmine.WebkitReporter()
    methods = [
      "reportRunnerStarting", 
      "reportRunnerResults",
      "reportSuiteResults",
      "reportSpecStarting",
      "reportSpecResults",
      "log"
    ]
    for method in methods
      expect(instance[method]).toBeDefined()
    return

  #-----------------------------------------------------------------------------
  #--- reportRunnerStarting

  describe "have method reportRunnerStarting method", () ->

    instance = null
    showReportSpy = null
    checkPermissionStub = null

    beforeEach () ->
      instance = new jasmine.WebkitReporter()
      showReportSpy = sinon.spy(instance, "showReport")
      checkPermissionStub = sinon.stub(window.webkitNotifications, 'checkPermission')
      return

    afterEach () ->
      instance.showReport.restore()
      checkPermissionStub.restore()
      return

    describe "if notifications permission is allowed", () ->

      beforeEach () ->
        checkPermissionStub.returns(0)
        instance.reportRunnerStarting(null)
        return

      it "should mark startedAt", () ->
        expect(instance.startedAt).not.toEqual(null)
        return

      it "should reset finishedAt", () ->
        expect(instance.finishedAt).toEqual(null)
        return

      it "should call showReport method", () ->
        expect(showReportSpy).toHaveBeenCalledWith("", "Jasmine: RUNNING", "Running specs. Please wait...")
        return
        
      it "should call showReport method with empty title", () ->
        instance.title = ""
        instance.reportRunnerStarting(null)
        expect(showReportSpy).toHaveBeenCalledWith("", "RUNNING", "Running specs. Please wait...")
        return
      
      it "should call showReport method with custom icon", () ->
        instance.runningIcon = "running.png"
        instance.reportRunnerStarting(null)
        expect(showReportSpy).toHaveBeenCalledWith("running.png", "Jasmine: RUNNING", "Running specs. Please wait...")
        return

      it "should call showReport method with custom title", () ->
        instance.title = "WebkitReporter"
        instance.reportRunnerStarting(null)
        expect(showReportSpy).toHaveBeenCalledWith("", "WebkitReporter: RUNNING", "Running specs. Please wait...")
        return

      return

    describe "if notifications permission isn't allowed", () ->

      spyRequestPermission = null

      beforeEach () ->
        spyRequestPermission = sinon.spy(window.webkitNotifications, "requestPermission")
        checkPermissionStub.returns(1)
        return
      
      afterEach () ->
        window.webkitNotifications.requestPermission.restore()
        return

      it "should call requestPermission", () ->
        instance.reportRunnerStarting(null)
        expect(spyRequestPermission).toHaveBeenCalled()
        expect(showReportSpy).not.toHaveBeenCalled()
        return

      return

    return

  #-----------------------------------------------------------------------------
  #--- reportRunnerResults

  describe "have method reportRunnerResults method", () ->

    instance = null
    showReportSpy = null
    checkPermissionStub = null
    passedRunner = 
      results: () ->
        totalCount: 10
        failedCount: 0
    failedRunner = 
      results: () ->
        totalCount: 10
        failedCount: 5

    beforeEach () ->
      instance = new jasmine.WebkitReporter
        passedIcon: "passed.png"
        failedIcon: "failed.png"
      instance.reportRunnerStarting(null)
      showReportSpy = sinon.spy(instance, "showReport")
      checkPermissionStub = sinon.stub(window.webkitNotifications, 'checkPermission')
      return

    afterEach () ->
      instance.showReport.restore()
      checkPermissionStub.restore()
      return

    describe "if notifications permission is allowed", () ->

      time = null

      beforeEach () ->
        checkPermissionStub.returns(0)
        return

      describe "if given passed runner", () ->

        beforeEach () ->
          instance.reportRunnerResults(passedRunner)
          time = (instance.finishedAt.getTime() - instance.startedAt.getTime()) / 1000
          return

        it "should call showReport with passed icon", () ->
          expect(showReportSpy.args[0][0]).toEqual("passed.png")
          return

        it "should call showReport with passes title", () ->
          expect(showReportSpy.args[0][1]).toEqual("Jasmine: PASSED")
          return

        it "should call showReport with correct message", () ->
          expect(showReportSpy.args[0][2]).toEqual("10 specs, 0 failures in #{time}s")
          return

        return

      describe "if given failed runner", () ->

        beforeEach () ->
          instance.reportRunnerResults(failedRunner)
          time = (instance.finishedAt.getTime() - instance.startedAt.getTime()) / 1000
          return

        it "should call showReport with failed icon", () ->
          expect(showReportSpy.args[0][0]).toEqual("failed.png")
          return

        it "should call showReport with failed title", () ->
          expect(showReportSpy.args[0][1]).toEqual("Jasmine: FAILED")
          return

        it "should call showReport with correct message", () ->
          expect(showReportSpy.args[0][2]).toEqual("10 specs, 5 failures in #{time}s")
          return

        return

      return

    describe "if notifications permission isn't allowed", () ->

      spyRequestPermission = null

      beforeEach () ->
        spyRequestPermission = sinon.spy(window.webkitNotifications, "requestPermission")
        checkPermissionStub.returns(1)
        return
      
      afterEach () ->
        window.webkitNotifications.requestPermission.restore()
        return

      it "should call requestPermission", () ->
        instance.reportRunnerResults(passedRunner)
        expect(spyRequestPermission).toHaveBeenCalled()
        expect(showReportSpy).not.toHaveBeenCalled()
        return

      return

    return

  #-----------------------------------------------------------------------------
  #--- showReport

  describe "have method showReport", () ->

    instance = new jasmine.WebkitReporter()
    notify = 
      icon: ""
      title: ""
      message: ""
      replaceId: ""
      created: false
      show: () ->
      cancel: () ->
    createNotificationStub = null
    createNotificationSpy = null
    showSpy = null
    cancelSpy = null
    setTimeoutStub = null

    beforeEach () ->
      notify.title = ""
      notify.replaceId = ""
      notify.created = false
      createNotificationStub = sinon.stub window.webkitNotifications, "createNotification", (icon, title, message) ->
        notify.icon = icon
        notify.title = title
        notify.message = message
        notify.created = true
        return notify
      setTimeoutStub = sinon.stub window, "setTimeout", (func, timeout) ->
        func.call(this)
        return
      showSpy = sinon.spy(notify, "show")
      cancelSpy = sinon.spy(notify, "cancel")
      
      instance.showReport("icon.png", "title", "message")
      return

    afterEach () ->
      createNotificationStub.restore()
      setTimeoutStub.restore()
      showSpy.restore()
      cancelSpy.restore()
      return

    it "should call createNotification with args", () ->
      expect(notify.created).toBeTruthy()
      expect(notify.icon).toEqual("icon.png")
      expect(notify.title).toEqual("title")
      expect(notify.message).toEqual("message")
      return

    it "should call show on notification", () ->
      expect(showSpy).toHaveBeenCalled()
      return

    it "should set replaceId for notification", () ->
      expect(notify.replaceId).toEqual("jasmine")
      return

    it "should not close message by timeout", () ->
      expect(cancelSpy).not.toHaveBeenCalled()
      return

    it "should close message by timeout if timeout not 0", () ->
      instance.timeout = 1000
      instance.showReport("icon.png", "title", "message")
      expect(cancelSpy).toHaveBeenCalled()
      return

  return
