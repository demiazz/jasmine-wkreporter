###
  @class 

  Simple reporter for Jasmine. Using Notification API from Chrome/Chromium browser,
  for report results of running specs.

  @author Alexey Plutalov <demiazz.py@gmail.com>
  @since Jasmine Webkit Reporter 0.1
###
class jasmine.WebkitReporter extends jasmine.Reporter

  ###
    Title using for header of notification. May used for identify specs.

    @type {String}
    @default "jasmine"
  ###
  title: "Jasmine"
  
  ###
    This is ID used for replacing notifications with this ID, when creating new
    notification. 

    @type {String}
    @default "jasmine"

    @see Notification API Draft
  ###
  replaceId: "jasmine"
  
  ###
    Timeout used for set timeout before notification be autoclosed. If timeout
    is equal 0, then notification not be autoclosed.

    @type {Integer}
    @default 0
  ###
  timeout: 0
  
  ###
    Passed icon is a icon for notification, when all specs are passed.

    @type {String}
    @default ""
  ###
  passedIcon: ""
  
  ###
    Failed icon is a icon for notification, when at least one spec are failed.

    @type {String}
    @default ""
  ###
  failedIcon: ""
  
  ###
    Running icons is a icon for notification, while specs running.

    @type {String}
    @default ""
  ###
  runningIcon: ""

  ###
    WebkitReporter constructor.

    Options:
      * title
      * replaceId
      * timeout
      * passedIcon
      * failedIcon
      * runningIcon

    @param {Object|null} options - options for reporter
  ###
  constructor: (options = {}) ->
    if jasmine.getGlobal().webkitNotifications
      if options
        @title = options.title              if options.title
        @replaceId = options.replaceId      if options.replaceId
        @timeout = options.timeout          if options.timeout
        @passedIcon = options.passedIcon    if options.passedIcon
        @failedIcon = options.failedIcon    if options.failedIcon
        @runningIcon = options.runningIcon  if options.runningIcon
      @startedAt =  null
      @finishedAt = null
    else
      # safe stubing functions for reporting by empty methods
      @reportRunnerStarting = () ->
      @reportRunnerResults = () ->
    return

  ###
    Callback for jasmine.Runner, when Runner starting.

    If notification permission is not allowed then request permission 
    instead show notification.

    @param {jasmine.Runner} runner jasmine.Runner for reporting.
  ###
  reportRunnerStarting: (runner) ->
    if jasmine.getGlobal().webkitNotifications.checkPermission() == 0
      @startedAt = new Date()
      @finishedAt = null
      if @title and @title.length > 0
        title = "#{@title}: RUNNING"
      else
        title = "RUNNING"
      @showReport @runningIcon, title, "Running specs. Please wait..."
    else
      jasmine.getGlobal().webkitNotifications.requestPermission()
    return

  ###
    Callback for jasmine.Runner, when Runner finished.

    If notification permission is not allowed then request permission 
    instead show notification.

    @param {jasmine.Runner} runner jasmine.Runner for reporting.
  ###
  reportRunnerResults: (runner) ->
    @finishedAt = new Date()

    if jasmine.getGlobal().webkitNotifications.checkPermission() == 0
      icon = ""
      title = ""
      message = ""

      time = (@finishedAt.getTime() - @startedAt.getTime()) / 1000
      title = @title + ": " if @title and @title.length > 0

      results = runner.results()

      if results.failedCount > 0
        icon = @failedIcon
        title += "FAILED"
      else
        icon = @passedIcon
        title += "PASSED"

      message += "#{results.totalCount} spec#{if results.totalCount == 1 then "" else "s"}"
      message += ", #{results.failedCount} failure#{ if results.failedCount == 1 then "" else "s"}"
      message += " in #{time}s"

      @showReport icon, title, message
    else
      jasmine.getGlobal().webkitNotifications.requestPermission()
    return

  ###
    Show notification by Notification API. Set timeout for autoclose if exist.

    @param {String} icon - icon for notification
    @param {String} title - title for notification
    @param {String} message - message for notification
  ###
  showReport: (icon, title, message) ->
    notification = jasmine.getGlobal().webkitNotifications.createNotification(icon, title, message)
    notification.replaceId = @replaceId
    notification.show()
    if @timeout > 0
      setTimeout () ->
        notification.cancel()
        return
      , @timeout
    return
