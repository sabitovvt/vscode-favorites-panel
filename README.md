# Favorites Panel

Adds a panel for accessing frequently used files, Internet addresses, programs, commands.

## Features

- Quick access to your favorite files
- Quick access to favorite URLs
- Fast launch of applications


## Extension Settings

The extension requires initial configuration.
Edit the settings file VSCODE. 

For example:

  "favoritesPanel.commands": [
    {
      "label": "README",
      "description": " - Important!",
      "command": "openFile",
      "arguments": ["README.MD"]
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
  ],




## Release Notes

Users appreciate release notes as you update your extension.

### 0.1.0

Initial release