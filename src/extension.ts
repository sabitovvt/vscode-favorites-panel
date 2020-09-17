import * as vscode from 'vscode';
import {PLUGIN_NAME, ERRORS, INFORMATION} from './consts';
import {IItem, ICommand} from './types';
import * as demoSettings from '../resources/demosettings.json';

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
        case 'insertNewCode':
            return new vscode.ThemeIcon('find-replace');
        default:
            return vscode.ThemeIcon.File;
    }
}

// Get settings from configuration file.
function getData() {
    const commandsFromConf: ICommand[] = getPluginConf();
    const commands = commandsFromConf.length ? commandsFromConf : (<any>demoSettings)['favoritesPanel.commands'];

    return commands.map((item: any) => {
        return {
            label: item.label,
            description: item.description,
            command: {
                command: `${PLUGIN_NAME}.${item.command}`,
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

    displayErrors();
}

// Добавление кода в выбранный файл
function insertNewCode(args: any) {
    const [file, searchPattern, newCode, action = 'before'] = args;
    const projectPath: string = vscode.workspace.rootPath || '';
    const document: string = `${projectPath}\\${file}`;
    vscode.workspace.openTextDocument(document).then(
        (doc) => {
            vscode.window.showTextDocument(doc).then(() => {
                const editor = vscode.window.activeTextEditor;
                if (editor) {
                    const regexp = new RegExp(searchPattern);
                    const fullText = editor.document.getText();
                    const index = fullText.search(regexp);
                    const searchedText = (fullText.match(regexp) || [])[0];
                    const positionStart = editor.document.positionAt(index);
                    const positionEnd = editor.document.positionAt(index + searchedText?.length);
                    switch (action) {
                        case 'replace':
                            const range = new vscode.Range(positionStart, positionEnd);
                            editor.edit((editBuilder) => {
                                editBuilder.replace(range, newCode);
                            });
                            break;
                        case 'after':
                            errors.push(ERRORS.COMMAND_NOT_SUPPORTED_YET);
                            break;
                        case 'before':
                        default:
                            editor.edit((editBuilder) => {
                                editBuilder.insert(positionStart, newCode);
                            });
                    }
                }
            });
        },
        () => {
            errors.push(`${ERRORS.FILE_NOT_FOUND}: ${document}`);
        }
    );

    displayErrors();
}

// Отображаем ошибки.
function displayErrors(): void {
    if (errors.length > 0) {
        errors.forEach((error) => vscode.window.showErrorMessage(error));
        errors.length = 0;
    }
}

// Получение настроек плагина
function getPluginConf(): ICommand[] {
    const configuration = vscode.workspace.getConfiguration(PLUGIN_NAME);
    return configuration.get('commands') || [];
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
        }),
        vscode.commands.registerCommand(`${PLUGIN_NAME}.insertNewCode`, (args) => {
            insertNewCode(args);
        })
    );

    // Открываем демонстрационный файл настроек
    if (!getPluginConf().length) {
        openFile([`${context.extensionPath}\\resources\\demosettings.json`, 'external']);
    }
}

export function deactivate() {}
