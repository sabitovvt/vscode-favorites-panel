# Favorites Panel

Adds a panel for accessing frequently used files, Internet addresses, programs, commands.

![Favorites Panel](preview/screenshot_0.png)

## Features

- Quick access to your favorite files
- Quick access to favorite URLs
- Fast launch of applications
- Quick access to your favorite files
- Quick access to favorite commands


## Extension Settings

The extension requires initial configuration.
Edit the settings file VSCODE.
If extension settings are not specified, demo settings will be used.

### Opening file

#### File in project

Settings for opening file in project

```json
    {
      "label": "README",
      "description": "- read me",
      "command": "openFile",
      "arguments": ["README.MD"]
    }
```
#### File is out project 

Settings for opening file in project

```json
    {
      "label": "Hosts",
      "description": "Windows hosts file",
      "command": "openFile",
      "arguments": ["C:\\Windows\\System32\\drivers\\etc\\hosts", "external"]
    }
```
### Run program

Settings for run program

#### Run Chrome in OS Windows

```json
    {
      "label": "Chrome",
      "description": "Run Chrome",
      "command": "run",
      "arguments": ["start chrome"]
    }
```
#### Open folder in OS Windows

```json
    {
      "label": "Windows",
      "description": "",
      "command": "run",
      "arguments": ["start explorer /n, C:\\Windows"]
    }
```

### Open URL

Settings for open URL

```json
    {
      "label": "github.com",
      "description": "",
      "command": "runCommand",
      "arguments": ["vscode.open", "https://github.com"],
    }
```
### Run Command

Settings for running arbitrary commands

```json
    {
      "label": "Zoom In",
      "description": "",
      "command": "runCommand",
      "arguments": ["editor.action.fontZoomIn"],
    }
```
#### Open Search panel
command: workbench.action.findInFiles
arguments:
- query?: string;
-	isRegex?: boolean;
-	triggerSearch?: boolean;
-	filesToInclude?: string;
-	filesToExclude?: string;
-	isCaseSensitive?: boolean;

```json
    {
      "label": "Find in files",
      "description": "",
      "command": "runCommand",
      "arguments": ["workbench.action.findInFiles", {"query": "SearchPannern", "triggerSearch": true}],
    },
```


### Settings for example:

Copy this snippet of settings into settings.json file (VS Code settings file) to see the extension in action.

```json
  "favoritesPanel.commands": [
    {
      "label": "README",
      "description": "- read me",
      "command": "openFile",
      "arguments": ["README.MD"]
    },
    {
      "label": "Hosts",
      "description": "",
      "command": "openFile",
      "arguments": ["C:\\Windows\\System32\\drivers\\etc\\hosts", "external"]
    },
    {
      "label": "Chrome",
      "description": "Run Chrome",
      "command": "run",
      "arguments": ["start chrome"]
    },
    {
      "label": "github.com",
      "description": "",
      "command": "runCommand",
      "arguments": ["vscode.open", "https://github.com"],
    },
    {
        "label": "Zoom In",
        "description": "",
        "command": "runCommand",
        "arguments": ["editor.action.fontZoomIn"],
    },
    {
        "label": "Zoom Out",
        "description": "",
        "command": "runCommand",
        "arguments": ["editor.action.fontZoomOut"],
    },
  ]
```



## Release Notes

## 0.4.0

- Improved support for vscode commands.
- Command "openUrl" is deprecated.
