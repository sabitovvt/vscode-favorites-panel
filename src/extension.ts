import * as vscode from 'vscode';
import * as path from 'path';
import {DEFAULT_COMMANDS, PLUGIN_NAME, ERRORS} from './consts';
import {IItem, ICommand} from './types';

const {exec} = require('child_process');

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
        default:
            return null;
    }
}

// Получение иконки
function getIcon(command: string) {
    switch (command) {
        case 'openFile':
            return {
                light: path.join(__filename, '..', '..', 'resources', 'light', 'document.svg'),
                dark: path.join(__filename, '..', '..', 'resources', 'dark', 'document.svg'),
            };
        case 'openUrl':
            return {
                light: path.join(__filename, '..', '..', 'resources', 'light', 'link.svg'),
                dark: path.join(__filename, '..', '..', 'resources', 'dark', 'link.svg'),
            };
        case 'run':
            return {
                light: path.join(__filename, '..', '..', 'resources', 'light', 'run.svg'),
                dark: path.join(__filename, '..', '..', 'resources', 'dark', 'run.svg'),
            };
        default:
            return vscode.ThemeIcon.File;
    }
}

// Получение данных из файла конфигурации
function getData() {
    const configuration = vscode.workspace.getConfiguration(PLUGIN_NAME);
    const commandsFromConf: ICommand[] = configuration.get('commands') || [];
    const commands = commandsFromConf.length ? commandsFromConf : DEFAULT_COMMANDS;
    return commands.map((item: any) => {
        return {
            label: item.label,
            description: item.description,
            command: {
                command: getCommand(item.command),
                arguments: [item.arguments],
            },
            iconPath: getIcon(item.command),
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
function openUrl(args: any) {
    if (!args[0]) {
        vscode.window.showErrorMessage('Не найден url!');
        return;
    }
    vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(args[0]));
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
        vscode.commands.registerCommand(`${PLUGIN_NAME}.openUrl`, (args) => {
            openUrl(args);
        })
    );
}

export function deactivate() {}
