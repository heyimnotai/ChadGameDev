---
description: Build native iOS app using XcodeBuildMCP
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - mcp__XcodeBuildMCP__build_sim_name_proj
  - mcp__XcodeBuildMCP__build_sim_name_workspace
  - mcp__XcodeBuildMCP__list_simulators
  - mcp__XcodeBuildMCP__boot_simulator
  - mcp__XcodeBuildMCP__get_build_settings
---

# Build Command

Build the native iOS app using Xcode via XcodeBuildMCP.

## Usage

```
/build [target] [--simulator name]
```

## What This Command Does

1. **Locate** Xcode project or workspace
2. **Select** target simulator
3. **Build** the app for simulator
4. **Report** build status and any errors

## Prerequisites

- Xcode installed on macOS
- Valid `.xcodeproj` or `.xcworkspace` file
- XcodeBuildMCP server running

## Steps to Execute

### Step 1: Find Project

Search for Xcode project files:
```
Glob: **/*.xcodeproj
Glob: **/*.xcworkspace
```

### Step 2: List Available Simulators

```
mcp__XcodeBuildMCP__list_simulators
```

Select appropriate iPhone simulator (prefer iPhone 15).

### Step 3: Boot Simulator (if needed)

```
mcp__XcodeBuildMCP__boot_simulator
simulator_name: "iPhone 15"
```

### Step 4: Build for Simulator

For `.xcodeproj`:
```
mcp__XcodeBuildMCP__build_sim_name_proj
project_path: "/path/to/Project.xcodeproj"
scheme: "ProjectScheme"
simulator_name: "iPhone 15"
```

For `.xcworkspace`:
```
mcp__XcodeBuildMCP__build_sim_name_workspace
workspace_path: "/path/to/Project.xcworkspace"
scheme: "ProjectScheme"
simulator_name: "iPhone 15"
```

### Step 5: Report Results

If successful:
```markdown
## Build Successful ✅

**Project**: MyGame.xcodeproj
**Scheme**: MyGame
**Simulator**: iPhone 15
**Build Time**: 12.3s

App is ready to launch with `/test-ios`
```

If failed:
```markdown
## Build Failed ❌

**Error**: [error description]
**File**: [file:line if applicable]

### Suggested Fix
[Description of how to fix the issue]
```

## Common Build Errors

| Error | Cause | Fix |
|-------|-------|-----|
| No scheme found | Project misconfigured | Create/select scheme in Xcode |
| Signing error | No valid team | Use automatic signing or set team |
| Module not found | Missing dependency | Run `pod install` or add SPM package |
| Syntax error | Code issue | Fix Swift syntax in referenced file |

## Build Settings

To inspect build settings:
```
mcp__XcodeBuildMCP__get_build_settings
project_path: "/path/to/Project.xcodeproj"
```

## Notes

- First build may take longer (cold cache)
- Incremental builds are enabled for faster iteration
- Use `/test-ios` after successful build to launch app
