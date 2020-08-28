# Favorites Panel

Adds a panel for accessing frequently used files, Internet addresses, programs, commands.

## Features

- Quick access to your favorite files
- Quick access to favorite URLs
- Fast launch of applications


## Extension Settings

The extension requires initial configuration.
Edit the settings file VSCODE. 

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

#### Settings for example:

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
  ]
```



## Release Notes

Users appreciate release notes as you update your extension.

### 0.2.0

- Added the ability to open files outside the project (added the "external" argument to the "openFile" command).

### 0.1.0

Initial release