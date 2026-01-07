#!/bin/bash
# Set iTerm2 tab color to RED when Claude needs input/permission
# Uses OSC 6 escape sequences for tab color control

# Red color (R=255, G=50, B=0)
echo -e "\033]6;1;bg;red;brightness;255\a" > /dev/tty
echo -e "\033]6;1;bg;green;brightness;50\a" > /dev/tty
echo -e "\033]6;1;bg;blue;brightness;0\a" > /dev/tty

# macOS notification with sound as backup
osascript -e 'display notification "Claude needs attention" with title "Claude Code" sound name "Basso"' 2>/dev/null || true
