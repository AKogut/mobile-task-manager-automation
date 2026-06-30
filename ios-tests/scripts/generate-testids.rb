#!/usr/bin/env ruby
# frozen_string_literal: true

require "pathname"

REPO_ROOT = Pathname.new(File.expand_path("../..", __dir__))
SOURCE = REPO_ROOT.join("app/src/constants/testIds.ts")
OUTPUT = REPO_ROOT.join("ios-tests/MobileTaskManagerUITests/TestIds.swift")

contents = SOURCE.read
block = contents[/export const TestIds = \{(.+?)\} as const;/m, 1]
raise "Could not locate the TestIds object in #{SOURCE}" unless block

entries = block.scan(/^\s*([A-Za-z0-9_]+):\s*'([^']*)',?\s*$/)
raise "No testID entries found in #{SOURCE}" if entries.empty?

lines = entries.map { |key, value| "  static let #{key} = \"#{value}\"" }

OUTPUT.write(<<~SWIFT)
  enum TestIds {
  #{lines.join("\n")}
  }
SWIFT

puts "Generated #{OUTPUT.relative_path_from(REPO_ROOT)} (#{entries.length} identifiers)."
