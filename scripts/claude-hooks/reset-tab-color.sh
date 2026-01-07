#!/bin/bash
# Reset iTerm2 tab color to default
echo -e "\033]6;1;bg;*;default\a" > /dev/tty
