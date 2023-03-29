import * as demoSettings from '../resources/demosettings.json';
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import {PLUGIN_NAME} from './consts';
import {ICommandWithSequence, IStore, TCommand} from './types';
import {FavoritesPanelProvider} from './FavoritesPanelProvider';
import {TreeItem} from './TreeItem';
import {insertNewCode, openFile, openUrl, runCommand, runProgram, runSequence} from './commands';
import {Errors} from './Errors';

// initial store.
const store: IStore = {
    commands: [],
};

export const errors = new Errors();

// get Icon
const getIcon = (item: any, color: string) => {
    const themeColor = new vscode.ThemeColor(color ?? '');
    switch (item.command) {
        case 'openFile':
            return new vscode.ThemeIcon('symbol-file', themeColor);
        case 'openUrl': // DEPRECATED
            return new vscode.ThemeIcon('link-external', themeColor);
        case 'run':
            return new vscode.ThemeIcon('console', themeColor);
        case 'runCommand':
            return new vscode.ThemeIcon('run', themeColor);
        case 'insertNewCode':
            return new vscode.ThemeIcon('find-replace', themeColor);
        default:
            return vscode.ThemeIcon.File;
    }
};

// Get command from item of settings
const getCommand = (item: ICommandWithSequence) => {
    if (item.sequence) {
        return getSequence(item);
    }
    return {
        label: item.label,
        description: item.description,
        command: {
            command: `${PLUGIN_NAME}.${item.command}`,
            arguments: [item.arguments],
        },
        iconPath:
            (item.icon && new vscode.ThemeIcon(item.icon, new vscode.ThemeColor(item.iconColor ?? ''))) ||
            getIcon(item, item.iconColor ?? ''),
    };
};

// Get Sequence from item of settings
const getSequence = (item: ICommandWithSequence) => {
    return {
        label: item.label,
        description: item.description,
        command: {
            command: `${PLUGIN_NAME}.runSequence`,
            arguments: [item.sequence],
        },
        iconPath:
            (item.icon && new vscode.ThemeIcon(item.icon, new vscode.ThemeColor(item.iconColor ?? ''))) ||
            getIcon(item, item.iconColor ?? ''),
    };
};

// Get Commands from configuration.
const getCommandsFromConf = (): TCommand[] => vscode.workspace.getConfiguration(PLUGIN_NAME).get('commands') || [];
const getCommandsFromWorkspaceConf = (): TCommand[] => vscode.workspace.getConfiguration(PLUGIN_NAME).get('commandsForWorkspace') || [];

// Get path to config file.
const getConfFilePath = (): string => vscode.workspace.getConfiguration(PLUGIN_NAME).get('configPath') || '';
const getWorkspaceConfFilePath = (): string => vscode.workspace.getConfiguration(PLUGIN_NAME).get('configPathForWorkspace') || '';

/**
 * Get commands from file.
 * @param file full path with filename.
 */
const getCommandsFromFile = (file: string): TCommand[] => {
    if (file && fs.existsSync(file)) {
        const json = JSON.parse(fs.readFileSync(file, 'utf8'));
        if (Array.isArray([json])) {
            return json;
        }
        return json[`${PLUGIN_NAME}.commands`];
    } else {
        return [];
    }
};

// Prepare commands for tree view.
export const getCommandsForTree = () => {
    const workspaceFolders = vscode.workspace.workspaceFolders?.map((folder) => folder.uri?.fsPath) || [];
    const commands: TCommand[] = [
        ...getCommandsFromConf(),
        ...getCommandsFromWorkspaceConf(),
        ...getCommandsFromFile(getConfFilePath()),
        ...getCommandsFromFile(getWorkspaceConfFilePath()),
    ];

    if (workspaceFolders.length) {
        workspaceFolders.forEach((filder) => {
            const vscodeFolder = process.platform === 'win32' ? '\\.vscode\\' : '/.vscode/';
            commands.push(...getCommandsFromFile(path.join(filder, `${vscodeFolder}favoritesPanel.json`)));
            commands.push(
                ...getCommandsFromFile(path.join(filder, '.favoritesPanel.json')),
                ...getCommandsFromFile(path.join(filder, 'favoritesPanel.json'))
            );
        });
    }

    store.commands = [...commands];

    const commandsForTree = store.commands.length ? store.commands : (<any>demoSettings)[`${PLUGIN_NAME}.commands`];
    return commandsForTree.map((item: any) => {
        if (item.commands) {
            return new TreeItem(
                item.label,
                item.commands.map((item: any) => {
                    return getCommand(item);
                })
            );
        }
        return getCommand(item);
    });
};

// Commands activations/
export function activate(context: vscode.ExtensionContext) {
    const favoritesPanelProvider = new FavoritesPanelProvider(getCommandsForTree());
    vscode.window.registerTreeDataProvider('favoritesPanel', favoritesPanelProvider);
    vscode.window.registerTreeDataProvider('favoritesPanelExplorer', favoritesPanelProvider);
    vscode.commands.registerCommand(`${PLUGIN_NAME}.refreshPanel`, () => favoritesPanelProvider.refresh());
    vscode.commands.registerCommand(`${PLUGIN_NAME}.openFavoritesPanelSettings`, () => {
        runCommand(['workbench.action.openSettings', `@ext:sabitovvt.favorites-panel`]);
    }),
        vscode.commands.registerCommand(`${PLUGIN_NAME}.openUserJsonSettings`, () => {
            runCommand(['workbench.action.openSettingsJson']);
        }),
        vscode.commands.registerCommand(`${PLUGIN_NAME}.openWorkspaceJsonSettings`, () => {
            runCommand(['workbench.action.openWorkspaceSettingsFile']);
        }),

        context.subscriptions.push(
            vscode.commands.registerCommand(`${PLUGIN_NAME}.openFile`, (args) => {
                openFile(args);
            }),
            vscode.commands.registerCommand(`${PLUGIN_NAME}.run`, (args) => {
                runProgram(args[0]);
            }),
            // DEPRECATED
            vscode.commands.registerCommand(`${PLUGIN_NAME}.openUrl`, (args) => {
                openUrl(args);
            }),
            vscode.commands.registerCommand(`${PLUGIN_NAME}.runCommand`, (args) => {
                runCommand(args);
            }),
            vscode.commands.registerCommand(`${PLUGIN_NAME}.insertNewCode`, (args) => {
                insertNewCode(args);
            }),
            vscode.commands.registerCommand(`${PLUGIN_NAME}.runSequence`, (args) => {
                runSequence(args);
            })
        );

    // Open demo file of settings
    if (!store.commands.length) {
        const path = process.platform === 'win32' ? '\\resources\\' : '/resources/';
        openFile([`${context.extensionPath}${path}demosettings.json`, 'external']);
    }
}

export function deactivate() {}
