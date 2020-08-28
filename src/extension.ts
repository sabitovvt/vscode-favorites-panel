import * as vscode from 'vscode';
import * as path from 'path';

const {exec} = require('child_process');
const pluginName = 'favoritesPanel';

interface IItem {
    collapsibleState: number;
    label: string;
    version: string;
    command?: any;
    iconPath: any;
}

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
            return `${pluginName}.openFile`;
        case 'run':
            return `${pluginName}.run`;
        case 'openUrl':
            return `${pluginName}.openUrl`;
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
    const configuration = vscode.workspace.getConfiguration(pluginName);
    const commandsFromConf: any = configuration.get('commands') || [];
    return commandsFromConf.map((item: any) => {
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
function openFile(file: string) {
    const filePath: string = vscode.workspace.rootPath || '';
    if (!filePath) {
        vscode.window.showErrorMessage('Не найден каталог проекта!');
        return;
    }
    const document = `${filePath}\\${file}`;
    vscode.workspace.openTextDocument(document).then((doc) => {
        vscode.window.showTextDocument(doc);
    });
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
    vscode.commands.registerCommand(`${pluginName}.refreshPanel`, () => favoritesPanelProvider.refresh());

    context.subscriptions.push(
        vscode.commands.registerCommand(`${pluginName}.openFile`, (args) => {
            openFile(args[0]);
        }),
        vscode.commands.registerCommand(`${pluginName}.run`, (args) => {
            runProgram(args[0]);
        }),
        vscode.commands.registerCommand(`${pluginName}.openUrl`, (args) => {
            openUrl(args);
        })
    );
}

export function deactivate() {}
