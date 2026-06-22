#!/usr/bin/env ruby
# frozen_string_literal: true

require "xcodeproj"
require "pathname"

REPO_ROOT = Pathname.new(File.expand_path("../..", __dir__))
PROJECT_PATH = REPO_ROOT.join("app/ios/MobileTaskManager.xcodeproj")
SOURCES_DIR = REPO_ROOT.join("ios-tests/MobileTaskManagerUITests")

APP_TARGET_NAME = "MobileTaskManager"
UITEST_TARGET_NAME = "MobileTaskManagerUITests"
UITEST_BUNDLE_ID = "org.reactjs.native.example.MobileTaskManager.uitests"

project = Xcodeproj::Project.open(PROJECT_PATH.to_s)

app_target = project.targets.find { |t| t.name == APP_TARGET_NAME }
raise "App target #{APP_TARGET_NAME.inspect} not found in #{PROJECT_PATH}" unless app_target

if project.targets.any? { |t| t.name == UITEST_TARGET_NAME }
  puts "✓ Target #{UITEST_TARGET_NAME} already present — nothing to do."
  exit 0
end

deployment_target = app_target.deployment_target
swift_version =
  app_target.resolved_build_setting("SWIFT_VERSION", true).values.compact.first || "5.0"

ui_target = project.new_target(
  :ui_test_bundle,
  UITEST_TARGET_NAME,
  :ios,
  deployment_target,
)

project_dir = Pathname.new(File.dirname(PROJECT_PATH.to_s))
group_path = SOURCES_DIR.relative_path_from(project_dir).to_s
group = project.main_group.new_group(UITEST_TARGET_NAME, group_path)

swift_files = Dir.glob(SOURCES_DIR.join("**/*.swift")).sort
raise "No Swift sources found under #{SOURCES_DIR}" if swift_files.empty?

swift_files.each do |path|
  relative = Pathname.new(path).relative_path_from(SOURCES_DIR).to_s
  file_ref = group.new_file(relative)
  ui_target.add_file_references([file_ref])
end

ui_target.add_dependency(app_target)

ui_target.build_configurations.each do |config|
  settings = config.build_settings
  settings["TEST_TARGET_NAME"] = APP_TARGET_NAME
  settings["GENERATE_INFOPLIST_FILE"] = "YES"
  settings["PRODUCT_BUNDLE_IDENTIFIER"] = UITEST_BUNDLE_ID
  settings["PRODUCT_NAME"] = "$(TARGET_NAME)"
  settings["SWIFT_VERSION"] = swift_version
  settings["TARGETED_DEVICE_FAMILY"] = "1,2"
  settings["IPHONEOS_DEPLOYMENT_TARGET"] = deployment_target
  settings["CODE_SIGNING_ALLOWED"] = "NO"
  settings["MARKETING_VERSION"] = "1.0"
  settings["CURRENT_PROJECT_VERSION"] = "1"
end

project.save

scheme_dir = Xcodeproj::XCScheme.shared_data_dir(PROJECT_PATH.to_s)
scheme_path = scheme_dir.join("#{APP_TARGET_NAME}.xcscheme")

scheme =
  if File.exist?(scheme_path)
    Xcodeproj::XCScheme.new(scheme_path.to_s)
  else
    Xcodeproj::XCScheme.new
  end

scheme.add_test_target(ui_target)
scheme.save_as(PROJECT_PATH.to_s, APP_TARGET_NAME, true)

puts "Added #{UITEST_TARGET_NAME} target and wired it into the #{APP_TARGET_NAME} scheme."
