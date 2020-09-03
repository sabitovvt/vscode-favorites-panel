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
            command: 'run',
            arguments: ['start chrome'],
        },
        {
            label: 'github.com',
            description: '',
            command: 'runCommand',
            arguments: ['vscode.open', 'https://github.com'],
        },
        {
            label: 'Windows folder',
            description: 'Open Windows folder',
            command: 'run',
            arguments: ['start explorer /n, C:\\Windows'],
        },
        {
            label: 'Find in files',
            description: '',
            command: 'runCommand',
            arguments: ['workbench.action.findInFiles', {query: 'SearchPannern', triggerSearch: true}],
        },
        {
            label: 'Zoom In',
            description: '',
            command: 'runCommand',
            arguments: ['editor.action.fontZoomIn'],
        },
        {
            label: 'Zoom Out',
            description: '',
            command: 'runCommand',
            arguments: ['editor.action.fontZoomOut'],
        },
    ],
};
