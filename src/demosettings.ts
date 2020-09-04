export default {
    'favoritesPanel.commands': [
        {
            label: 'README',
            description: ' - Important!',
            command: 'openFile',
            arguments: ['README.MD'],
        },
        {
            label: 'Hosts',
            description: 'Windows hosts file',
            command: 'openFile',
            arguments: ['C:\\Windows\\System32\\drivers\\etc\\hosts', 'external'],
        },
        {
            label: 'Chrome',
            description: 'Run Chrome',
            icon: 'browser',
            command: 'run',
            arguments: ['start chrome'],
        },
        {
            label: 'github.com',
            description: '',
            icon: 'link-external',
            command: 'runCommand',
            arguments: ['vscode.open', 'https://github.com'],
        },
        {
            label: 'Windows folder',
            description: 'Open Windows folder',
            icon: 'symbol-folder',
            command: 'run',
            arguments: ['start explorer /n, C:\\Windows'],
        },
        {
            label: 'Find in files',
            description: '',
            icon: 'search',
            command: 'runCommand',
            arguments: ['workbench.action.findInFiles', {query: 'SearchPannern', triggerSearch: true}],
        },
        {
            label: 'Zoom In',
            description: '',
            icon: 'zoom-in',
            command: 'runCommand',
            arguments: ['editor.action.fontZoomIn'],
        },
        {
            label: 'Zoom Out',
            description: '',
            icon: 'zoom-out',
            command: 'runCommand',
            arguments: ['editor.action.fontZoomOut'],
        },
    ],
};
