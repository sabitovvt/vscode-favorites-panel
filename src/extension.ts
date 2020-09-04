import * as vscode from 'vscode';
import {PLUGIN_NAME, ERRORS, INFORMATION} from './consts';
import {IItem, ICommand} from './types';
import demoSettings from './demosettings';

const {exec} = require('child_process');
const errors: string[] = [];

// Tree View
export class FavoritesPanelProvider implements vscode.TreeDataProvider<IItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<IItem | undefined | void> = new vscode.EventEmitter<IItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<IItem | undefined | void> = this._onDidChangeTreeData.event;
    constructor(private commands: any) {}

    refresh(): void {
        this.commands = getData();
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: IItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: IItem): Thenable<IItem[]> {
        if (!this.commands) {
            vscode.window.showInformationMessage('Ассистент не знает чем вам помочь.');
            return Promise.resolve([]);
        }

        if (element) {
            vscode.window.showInformationMessage('Элемент не может быть обработан');
            return Promise.resolve([]);
        } else {
            return Promise.resolve(this.commands);
        }
    }
}

// Получение команды
function getCommand(command: string) {
    switch (command) {
        case 'openFile':
            return `${PLUGIN_NAME}.openFile`;
        case 'run':
            return `${PLUGIN_NAME}.run`;
        case 'openUrl':
            return `${PLUGIN_NAME}.openUrl`;
        case 'runCommand':
            return `${PLUGIN_NAME}.runCommand`;
        default:
            return null;
    }
}

// get Icon
function getIcon(item: any) {
    switch (item.command) {
        case 'openFile':
            return new vscode.ThemeIcon('symbol-file');
        case 'openUrl': // DEPRECATED
            return new vscode.ThemeIcon('link-external');
        case 'run':
            return new vscode.ThemeIcon('console');
        case 'runCommand':
            return new vscode.ThemeIcon('run');
        default:
            return vscode.ThemeIcon.File;
    }
}

// Получение данных из файла конфигурации
function getData() {
    const configuration = vscode.workspace.getConfiguration(PLUGIN_NAME);
    const commandsFromConf: ICommand[] = configuration.get('commands') || [];
    const commands = commandsFromConf.length ? commandsFromConf : demoSettings['favoritesPanel.commands'];
    return commands.map((item: any) => {
        return {
            label: item.label,
            description: item.description,
            command: {
                command: getCommand(item.command),
                arguments: [item.arguments],
            },
            iconPath: (item.icon && new vscode.ThemeIcon(item.icon)) || getIcon(item),
        };
    });
}

// Запуск внешней программы
function runProgram(program: string) {
    exec(program, {shell: true, encoding: 'utf8'}, function (err: any, data: any) {
        console.log(err);
        console.log(data.toString());
    });
}

// Открытие файла
function openFile(args: any) {
    const projectPath: string = vscode.workspace.rootPath || '';
    const filePath = args[1] === 'external' ? '' : projectPath;
    const document = `${filePath}\\${args[0]}`;

    vscode.workspace.openTextDocument(document).then(
        (doc) => {
            vscode.window.showTextDocument(doc);
        },
        () => {
            vscode.window.showErrorMessage(`${ERRORS.FILE_NOT_FOUND}: ${document}`);
        }
    );
}

// Открытие URL
// DEPRECATED
function openUrl(args: any) {
    if (!args[0]) {
        vscode.window.showErrorMessage('Не найден url!');
        return;
    }
    vscode.window.showInformationMessage(`${INFORMATION.DEPRECATED} \n use the "vscode.open" command`);
    vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(args[0]));
}

// Запуск произвольной команды VS Code
function runCommand(args: any) {
    const [command, ...rest] = args;
    switch (command) {
        case '':
            errors.push(ERRORS.COMMAND_NOT_FOUND);
            break;
        case 'vscode.open':
            if (!rest[0]) {
                errors.push(ERRORS.COMMAND_NOT_FOUND);
            }
            vscode.commands.executeCommand(command, vscode.Uri.parse(rest[0]));
            break;
        default:
            vscode.commands.executeCommand(command, ...rest);
    }
    if (errors.length > 0) {
        errors.forEach((error) => vscode.window.showErrorMessage(error));
    }
}

// Активация команд
export function activate(context: vscode.ExtensionContext) {
    const favoritesPanelProvider = new FavoritesPanelProvider(getData());
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
        })
    );
}

export function deactivate() {}
