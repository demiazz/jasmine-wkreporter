guard 'shell' do
  # Cakefile
  watch(/^Cakefile$/)  { |m| `cake build:all` }
  # Library
  watch(/^lib\/.*/)    { |m| `cake build:lib`}
  # Specs
  watch(/^spec\/.*/)   { |m| `cake build:spec` }
end

reload_url = 'http://localhost:3000'

guard 'livereload' do
  watch(/^jasmine-wkreporter.js$/)      { |m| reload_url }
  watch(/^jasmine-wkreporter.spec.js$/) { |m| reload_url }
  watch(/^vendor\/.*/)                   { |m| reload_url }
end
