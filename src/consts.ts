export const PLUGIN_NAME = 'favoritesPanel';

export const DEFAULT_COMMANDS = [
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
        command: 'openUrl',
        arguments: ['https://github.com'],
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
];

export const ERRORS = {
    FILE_NOT_FOUND: 'File not found',
};
