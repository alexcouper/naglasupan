#!/bin/bash
# Launch 3 Claude instances in iTerm2 tabs, each in their workspace
# Usage: ./scripts/launch-claude-swarm.sh

set -e

PROJECT_ROOT="/Users/alex/Work/codalens"

WORKSPACE_ROOT="$PROJECT_ROOT/workspaces"

# Workspace paths
W1_PATH="$WORKSPACE_ROOT/naglasupan-w1"
W2_PATH="$WORKSPACE_ROOT/naglasupan-w2"
W3_PATH="$WORKSPACE_ROOT/naglasupan-w3"
# Check workspaces exist
for ws in "$W1_PATH" "$W2_PATH" "$W3_PATH"; do
  if [ ! -d "$ws" ]; then
    echo "Error: Workspace directory not found: $ws"
    echo "Run workspace setup first: jj workspace add"
    exit 1
  fi
done

# AppleScript to create iTerm2 tabs with Claude instances
osascript <<EOF
tell application "iTerm"
    activate

    -- Create new window or use current
    if (count of windows) = 0 then
        create window with default profile
    end if

    tell current window
        -- Tab 1: w1
        tell current session
            set name to "w1"
            write text "cd '$W1_PATH' && claude"
            -- Split horizontally for shell below
            set shellSession1 to (split horizontally with default profile)
            tell shellSession1
                write text "cd '$W1_PATH'"
            end tell
        end tell

        -- Tab 2: w2
        set newTab2 to (create tab with default profile)
        tell current session of newTab2
            set name to "w2"
            write text "cd '$W2_PATH' && claude"
            -- Split horizontally for shell below
            set shellSession2 to (split horizontally with default profile)
            tell shellSession2
                write text "cd '$W2_PATH'"
            end tell
        end tell

        -- Tab 3: w3
        set newTab3 to (create tab with default profile)
        tell current session of newTab3
            set name to "w3"
            write text "cd '$W3_PATH' && claude"
            -- Split horizontally for shell below
            set shellSession3 to (split horizontally with default profile)
            tell shellSession3
                write text "cd '$W3_PATH'"
            end tell
        end tell

        -- Select first tab
        select tab 1
    end tell
end tell
EOF

echo "Launched 3 Claude instances in iTerm2 tabs:"
echo "  Tab 1 (w1): Claude + shell ($W1_PATH)"
echo "  Tab 2 (w2): Claude + shell ($W2_PATH)"
echo "  Tab 3 (w3): Claude + shell ($W3_PATH)"
echo ""
echo "Layout: Claude (top) | Shell (bottom)"
echo ""
echo "Tab colors:"
echo "  Default = working"
echo "  Green   = finished"
echo "  Red     = needs input"
