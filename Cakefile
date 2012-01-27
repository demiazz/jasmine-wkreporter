fs = require 'fs'
util = require 'util'
exec = require('child_process').exec
http = require 'http'
url = require 'url'

#-------------------------------------------------------------------------------
#--- Helpers

build = (config) ->
  if config.scriptsOrder.length > 0
    files = ""
    for file in config.scriptsOrder
      files += " #{file}"
    command = "coffee --join #{config.outputFile} --compile #{files}"
    if config.compress
      command += " && uglifyjs --overwrite #{config.outputFile}"
    exec command, (error, stdout, stderr) ->
      if error?
        console.error("#{config.outputFile} don't builted.")
        console.error(stdout)
        console.error(stderr)
      else
        console.info("#{config.outputFile} builted successful.")
      return
  return

runServer = (config) ->

  server = http.createServer((request, response) ->
    
    # parse url
    url_path = url.parse(request.url).path

    try
      # for main page
      if url_path == "/"
        response.writeHead 200, "Content-Type": "text/html"
        return response.end fs.readFileSync(config.index)
      # for other files
      else
        if url_path.match(/.*\.(html|js|css)/g)
          if url_path.match(/.*\.html$/g)
            response.writeHead 200, "Content-Type": "text/html"
          if url_path.match(/.*\.js$/g)
            response.writeHead 200, "Content-Type": "text/javascript"
          if url_path.match(/.*\.css$/g)
            response.writeHead 200, "Content-Type": "text/css"
          return response.end fs.readFileSync "./#{url_path}", "utf-8"
        else
          response.writeHead 200
          return response.end fs.readFileSync "./#{url_path}"
    # 404 for error, when try find a file
    catch error
      response.writeHead 404
      return response.end ""
  ).listen(config.port, config.host)

  console.log("Server running on #{config.host}:#{config.port}")

  return

#-------------------------------------------------------------------------------
#--- Buildr configs

lib = 
  scriptsOrder: [
    "lib/reporter.coffee"
  ]
  outputFile: "./jasmine-wkreporter.js"
  compress: false

spec = 
  scriptsOrder: [
    "spec/reporter.spec.coffee"
  ]
  outputFile: "./jasmine-wkreporter.spec.js"
  compress: false

release = 
  scriptsOrder: [
    "lib/reporter.coffee"
  ]
  outputFile: "./jasmine-wkreporter.min.js"
  compress: true

server = 
  host: "localhost"
  port: 3000
  index: "./specRunner.html"

#-------------------------------------------------------------------------------
#--- Tasks

task 'build:lib', 'Build lib for testing', () ->
  build lib
  return

task 'build:spec', 'Build spec for testing', () ->
  build spec
  return

task 'build:release', 'Build lib for release', () ->
  build release
  return

task 'build:all', 'Build lib and spec for testing, and lib for release', () ->
  invoke 'build:lib'
  invoke 'build:spec'
  invoke 'build:release'
  return

task 'server', 'Running development server for Jasmine Runner', () ->
  runServer server
  return