import * as vscode from 'vscode';
import {PLUGIN_NAME} from './consts';
import {ICommand} from './types';
import * as demoSettings from '../resources/demosettings.json';
import {FavoritesPanelProvider} from './FavoritesPanelProvider';
import {TreeItem} from './TreeItem';
import {insertNewCode, openFile, openUrl, runCommand, runProgram} from './commands';
import {Errors} from './Errors';

export const errors = new Errors();

// get Icon
const getIcon = (item: any) => {
    switch (item.command) {
        case 'openFile':
            return new vscode.ThemeIcon('symbol-file');
        case 'openUrl': // DEPRECATED
            return new vscode.ThemeIcon('link-external');
        case 'run':
            return new vscode.ThemeIcon('console');
        case 'runCommand':
            return new vscode.ThemeIcon('run');
        case 'insertNewCode':
            return new vscode.ThemeIcon('find-replace');
        default:
            return vscode.ThemeIcon.File;
    }
};

// Get command from item of settings
const getCommand = (item: any) => {
    return {
        label: item.label,
        description: item.description,
        command: {
            command: `${PLUGIN_NAME}.${item.command}`,
            arguments: [item.arguments],
        },
        iconPath: (item.icon && new vscode.ThemeIcon(item.icon)) || getIcon(item),
    };
};

// Get Commands from configuration.
const getCommandsFromConf = (): ICommand[] => vscode.workspace.getConfiguration(PLUGIN_NAME).get('commands') || [];

// Prepare commands for tree view.
export const getCommandsForTree = () => {
    const commandsFromConf: ICommand[] = getCommandsFromConf();
    const commandsForTree = commandsFromConf.length ? commandsFromConf : (<any>demoSettings)[`${PLUGIN_NAME}.commands`];
    return commandsForTree.map((item: any) => {
        if (item.commands) {
            return new TreeItem(
                item.label,
                item.commands.map((item: any) => {
                    return getCommand(item);
                })
            );
        } else {
            return getCommand(item);
        }
    });
};

// Commands activations/
export function activate(context: vscode.ExtensionContext) {
    const favoritesPanelProvider = new FavoritesPanelProvider(getCommandsForTree());
    vscode.window.registerTreeDataProvider('favoritesPanel', favoritesPanelProvider);
    vscode.commands.registerCommand(`${PLUGIN_NAME}.refreshPanel`, () => favoritesPanelProvider.refresh());

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
        })
    );

    // Open demo file of settings
    if (!getCommandsFromConf().length) {
        const path = process.platform === 'win32' ?  '\\resources\\' : '/resources/';
        openFile([`${context.extensionPath}${path}demosettings.json`, 'external']);

    }
}

export function deactivate() {}
