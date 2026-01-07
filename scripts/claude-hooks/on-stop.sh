#!/bin/bash
# Set iTerm2 tab color to GREEN when Claude finishes
# Uses OSC 6 escape sequences for tab color control

# Green color (R=0, G=200, B=0)
echo -e "\033]6;1;bg;red;brightness;0\a" > /dev/tty
echo -e "\033]6;1;bg;green;brightness;200\a" > /dev/tty
echo -e "\033]6;1;bg;blue;brightness;0\a" > /dev/tty

# macOS notification as backup
osascript -e 'display notification "Claude has finished" with title "Claude Code"' 2>/dev/null || true
