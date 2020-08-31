# Favorites Panel

Adds a panel for accessing frequently used files, Internet addresses, programs, commands.
![Favorites Panel](preview/screenshot_0.png)

## Features

- Quick access to your favorite files
- Quick access to favorite URLs
- Fast launch of applications
- Quick access to your favorite files
- Quick access to favorite commandss


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

```json
    {
      "label": "Chrome",
      "description": "Run Chrome",
      "command": "run",
      "arguments": ["start chrome"]
    }
```
### Open URL

Settings for open URL

```json
    {
      "label": "github.com",
      "description": "",
      "command": "openUrl",
      "arguments": ["https://github.com"]
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
      "command": "openUrl",
      "arguments": ["https://github.com"]
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

## 0.3.0

- Change the icon of the extension in marketplace.
- Change the icon of the extension on the panel.
- Added the ability to run arbitrary VS Code commands or extensions
